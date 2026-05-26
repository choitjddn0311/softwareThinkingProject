from flask import Blueprint, request, jsonify
import sqlite3
from emotioncolor import get_color

diary_bp = Blueprint('diary', __name__)

# 데이터베이스 초기화 함수
def init_db():
    conn = sqlite3.connect('diary.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS diaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            emotion TEXT NOT NULL,
            content TEXT NOT NULL,
            color TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# [CREATE] 일기 저장
@diary_bp.route('/api/diaries', methods=['POST'])
def create_diary():
    data = request.get_json()

    title = data.get('title')
    date = data.get('date')
    emotion = data.get('emotion')
    content = data.get('content')

    if not title or not date or not emotion or not content:
        return jsonify({"error": "모든 항목을 입력해주세요"}), 400

    color = get_color(emotion)

    conn = sqlite3.connect('diary.db')
    c = conn.cursor()
    c.execute(
        'INSERT INTO diaries (title, date, emotion, content, color) VALUES (?, ?, ?, ?, ?)',
        (title, date, emotion, content, color)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "일기가 저장되었습니다", "color": color}), 201

# [READ] 전체 일기 조회
@diary_bp.route('/api/diaries', methods=['GET'])
def read_diaries():
    conn = sqlite3.connect('diary.db')
    c = conn.cursor()
    c.execute('SELECT * FROM diaries')
    rows = c.fetchall()
    conn.close()

    diary_list = []
    for row in rows:
        diary_list.append({
            "id": row[0],
            "title": row[1],
            "date": row[2],
            "emotion": row[3],
            "content": row[4],
            "color": row[5]
        })

    return jsonify(diary_list), 200

# [READ] 특정 날짜 일기 조회
@diary_bp.route('/api/diaries/date/<string:date>', methods=['GET'])
def get_diary_by_date(date):
    conn = sqlite3.connect('diary.db')
    c = conn.cursor()
    c.execute('SELECT * FROM diaries WHERE date = ?', (date,))
    row = c.fetchone()
    conn.close()

    if not row:
        return jsonify(False), 200

    return jsonify({
        "id": row[0],
        "title": row[1],
        "date": row[2],
        "emotion": row[3],
        "content": row[4],
        "color": row[5]
    }), 200

# [UPDATE] 일기 수정
@diary_bp.route('/api/diaries/<int:diary_id>', methods=['PUT'])
def update_diary(diary_id):
    data = request.get_json()

    emotion = data.get('emotion')
    content = data.get('content')

    if not emotion or not content:
        return jsonify({"error": "감정과 내용을 입력해주세요"}), 400

    color = get_color(emotion)

    conn = sqlite3.connect('diary.db')
    c = conn.cursor()
    c.execute(
        'UPDATE diaries SET emotion=?, content=?, color=? WHERE id=?',
        (emotion, content, color, diary_id)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "일기가 수정되었습니다", "color": color}), 200

# [DELETE] 일기 삭제
@diary_bp.route('/api/diaries/<int:diary_id>', methods=['DELETE'])
def delete_diary(diary_id):
    conn = sqlite3.connect('diary.db')
    c = conn.cursor()
    c.execute('DELETE FROM diaries WHERE id=?', (diary_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "일기가 삭제되었습니다"}), 200

# [READ] 특정 날짜 일기 조회
@diary_bp.route('/api/diaries/<date>', methods=['GET'])
def read_diary_by_date(date):
    conn = sqlite3.connect('diary.db')
    c = conn.cursor()
    c.execute('SELECT * FROM diaries WHERE date=?', (date,))
    rows = c.fetchall()
    conn.close()

    if len(rows) == 0:
        return jsonify({"message": f"이날({date})에는 작성한 일기가 없습니다"}), 200

    diary_list = []
    for row in rows:
        diary_list.append({
            "id": row[0],
            "title": row[1],
            "date": row[2],
            "emotion": row[3],
            "content": row[4],
            "color": row[5]
        })

    return jsonify(diary_list), 200

# [READ] 캘린더용 색상 데이터
# [READ] 캘린더용 색상 데이터
@diary_bp.route('/api/calendar', methods=['GET'])
def get_calendar_colors():
    conn = sqlite3.connect('diary.db')
    c = conn.cursor()
    c.execute('SELECT date, emotion, color, title FROM diaries')  # title 추가
    rows = c.fetchall()
    conn.close()

    calendar_data = []
    for row in rows:
        calendar_data.append({
            "date": row[0],
            "emotion": row[1],
            "color": row[2],
            "title": row[3]
        })

    return jsonify(calendar_data), 200