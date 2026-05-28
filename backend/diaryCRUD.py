from flask import Blueprint, request, jsonify
import sqlite3
from emotioncolor import get_color

diary_bp = Blueprint('diary', __name__)

def get_db():
    conn = sqlite3.connect('diary.db')
    conn.row_factory = sqlite3.Row
    return conn

# 데이터베이스 초기화 함수
def init_db():
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS diaries (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                title     TEXT NOT NULL,
                date      TEXT NOT NULL UNIQUE,
                emotion   TEXT NOT NULL,
                content   TEXT NOT NULL,
                color     TEXT NOT NULL,
                wake_time  TEXT DEFAULT '',
                sleep_time TEXT DEFAULT ''
            )
        ''')
        # 기존 DB에 컬럼이 없으면 추가 (마이그레이션)
        try:
            conn.execute("ALTER TABLE diaries ADD COLUMN wake_time TEXT DEFAULT ''")
        except Exception:
            pass
        try:
            conn.execute("ALTER TABLE diaries ADD COLUMN sleep_time TEXT DEFAULT ''")
        except Exception:
            pass
        conn.commit()


def row_to_dict(row):
    return {
        "id":         row["id"],
        "title":      row["title"],
        "date":       row["date"],
        "emotion":    row["emotion"],
        "content":    row["content"],
        "color":      row["color"],
        "wakeTime":   row["wake_time"]  or '',
        "sleepTime":  row["sleep_time"] or '',
    }


# [CREATE] 일기 저장
@diary_bp.route('/api/diaries', methods=['POST'])
def create_diary():
    data      = request.get_json() or {}
    title     = (data.get('title')     or '').strip()
    date      = (data.get('date')      or '').strip()
    emotion   = (data.get('emotion')   or 'meh').strip()
    content   = (data.get('content')   or '').strip()
    wake_time  = (data.get('wakeTime')  or '').strip()
    sleep_time = (data.get('sleepTime') or '').strip()

    if not title or not date or not content:
        return jsonify({"error": "제목, 날짜, 내용을 입력해주세요"}), 400

    color = get_color(emotion)

    with get_db() as conn:
        conn.execute(
            '''INSERT INTO diaries (title, date, emotion, content, color, wake_time, sleep_time)
               VALUES (?, ?, ?, ?, ?, ?, ?)''',
            (title, date, emotion, content, color, wake_time, sleep_time)
        )
        conn.commit()

    return jsonify({"message": "일기가 저장되었습니다", "color": color}), 201


# [READ] 전체 일기 조회
@diary_bp.route('/api/diaries', methods=['GET'])
def read_diaries():
    with get_db() as conn:
        rows = conn.execute('SELECT * FROM diaries ORDER BY date DESC').fetchall()
    return jsonify([row_to_dict(r) for r in rows]), 200


# [READ] 특정 날짜 일기 조회 (단건 — DiaryBook용)
@diary_bp.route('/api/diaries/date/<string:date>', methods=['GET'])
def get_diary_by_date(date):
    with get_db() as conn:
        row = conn.execute('SELECT * FROM diaries WHERE date = ?', (date,)).fetchone()
    if not row:
        return jsonify(False), 200
    return jsonify(row_to_dict(row)), 200


# [UPDATE] id로 수정
@diary_bp.route('/api/diaries/<int:diary_id>', methods=['PUT'])
def update_diary(diary_id):
    data       = request.get_json() or {}
    title      = (data.get('title')     or '').strip()
    emotion    = (data.get('emotion')   or 'meh').strip()
    content    = (data.get('content')   or '').strip()
    wake_time  = (data.get('wakeTime')  or '').strip()
    sleep_time = (data.get('sleepTime') or '').strip()

    if not content:
        return jsonify({"error": "내용을 입력해주세요"}), 400

    color = get_color(emotion)

    with get_db() as conn:
        conn.execute(
            '''UPDATE diaries
               SET title=?, emotion=?, content=?, color=?, wake_time=?, sleep_time=?
               WHERE id=?''',
            (title, emotion, content, color, wake_time, sleep_time, diary_id)
        )
        conn.commit()

    return jsonify({"message": "일기가 수정되었습니다", "color": color}), 200


# [UPSERT] 날짜 기준 저장 또는 수정 (DiaryBook 저장 버튼용)
@diary_bp.route('/api/diaries/date/<string:date>', methods=['PUT'])
def upsert_diary_by_date(date):
    data       = request.get_json() or {}
    title      = (data.get('title')     or '').strip()
    emotion    = (data.get('emotion')   or 'meh').strip()
    content    = (data.get('content')   or '').strip()
    wake_time  = (data.get('wakeTime')  or '').strip()
    sleep_time = (data.get('sleepTime') or '').strip()

    if not title or not content:
        return jsonify({"error": "제목과 내용을 입력해주세요"}), 400

    color = get_color(emotion)

    with get_db() as conn:
        existing = conn.execute('SELECT id FROM diaries WHERE date = ?', (date,)).fetchone()
        if existing:
            conn.execute(
                '''UPDATE diaries
                   SET title=?, emotion=?, content=?, color=?, wake_time=?, sleep_time=?
                   WHERE date=?''',
                (title, emotion, content, color, wake_time, sleep_time, date)
            )
        else:
            conn.execute(
                '''INSERT INTO diaries (title, date, emotion, content, color, wake_time, sleep_time)
                   VALUES (?, ?, ?, ?, ?, ?, ?)''',
                (title, date, emotion, content, color, wake_time, sleep_time)
            )
        conn.commit()

    action = "수정" if existing else "저장"
    return jsonify({"message": f"일기가 {action}되었습니다", "color": color}), 200


# [DELETE] 일기 삭제
@diary_bp.route('/api/diaries/<int:diary_id>', methods=['DELETE'])
def delete_diary(diary_id):
    with get_db() as conn:
        conn.execute('DELETE FROM diaries WHERE id=?', (diary_id,))
        conn.commit()
    return jsonify({"message": "일기가 삭제되었습니다"}), 200


# [READ] 특정 날짜 전체 일기 목록 (날짜 복수)
@diary_bp.route('/api/diaries/<date>', methods=['GET'])
def read_diary_by_date(date):
    with get_db() as conn:
        rows = conn.execute('SELECT * FROM diaries WHERE date=?', (date,)).fetchall()
    if not rows:
        return jsonify({"message": f"이날({date})에는 작성한 일기가 없습니다"}), 200
    return jsonify([row_to_dict(r) for r in rows]), 200


# [READ] 캘린더용 색상 데이터
@diary_bp.route('/api/calendar', methods=['GET'])
def get_calendar_colors():
    with get_db() as conn:
        rows = conn.execute('SELECT date, emotion, color, title FROM diaries').fetchall()
    return jsonify([{"date": r["date"], "emotion": r["emotion"], "color": r["color"], "title": r["title"]} for r in rows]), 200