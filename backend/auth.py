from flask import Blueprint, request, jsonify, session
import sqlite3
import hashlib
import os
import re

auth_bp = Blueprint('auth', __name__)

DB_PATH = 'user.db'


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                username  TEXT    NOT NULL UNIQUE,
                email     TEXT    NOT NULL UNIQUE,
                password  TEXT    NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()


def hash_password(password: str) -> str:
    salt = os.urandom(32)
    key = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 200_000)
    return salt.hex() + ':' + key.hex()


def verify_password(password: str, stored: str) -> bool:
    try:
        salt_hex, key_hex = stored.split(':')
        salt = bytes.fromhex(salt_hex)
        key = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 200_000)
        return key.hex() == key_hex
    except Exception:
        return False


def validate_email(email: str) -> bool:
    return bool(re.match(r'^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$', email))


def validate_password(pw: str) -> bool:
    return len(pw) >= 8


# ── 회원가입 ──────────────────────────────────────────
@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    username = (data.get('username') or '').strip()
    email    = (data.get('email')    or '').strip().lower()
    password = (data.get('password') or '')

    if not username or not email or not password:
        return jsonify({'error': '모든 필드를 입력해주세요.'}), 400

    if not validate_email(email):
        return jsonify({'error': '이메일 형식이 올바르지 않습니다.'}), 400

    if not validate_password(password):
        return jsonify({'error': '비밀번호는 8자 이상이어야 합니다.'}), 400

    try:
        with get_db() as conn:
            conn.execute(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                (username, email, hash_password(password))
            )
            conn.commit()
        return jsonify({'message': '회원가입이 완료되었습니다.'}), 201

    except sqlite3.IntegrityError as e:
        if 'username' in str(e):
            return jsonify({'error': '이미 사용 중인 사용자명입니다.'}), 409
        if 'email' in str(e):
            return jsonify({'error': '이미 등록된 이메일입니다.'}), 409
        return jsonify({'error': '회원가입에 실패했습니다.'}), 500


# ── 로그인 ────────────────────────────────────────────
@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    email    = (data.get('email')    or '').strip().lower()
    password = (data.get('password') or '')

    if not email or not password:
        return jsonify({'error': '이메일과 비밀번호를 입력해주세요.'}), 400

    with get_db() as conn:
        row = conn.execute(
            'SELECT id, username, password FROM users WHERE email = ?', (email,)
        ).fetchone()

    if not row or not verify_password(password, row['password']):
        return jsonify({'error': '이메일 또는 비밀번호가 올바르지 않습니다.'}), 401

    session['user_id']   = row['id']
    session['username']  = row['username']

    return jsonify({
        'message': '로그인 성공',
        'user': {'id': row['id'], 'username': row['username']}
    }), 200


# ── 로그아웃 ──────────────────────────────────────────
@auth_bp.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': '로그아웃 되었습니다.'}), 200


# ── 현재 사용자 확인 ──────────────────────────────────
@auth_bp.route('/api/auth/me', methods=['GET'])
def me():
    if 'user_id' not in session:
        return jsonify({'error': '로그인이 필요합니다.'}), 401
    return jsonify({
        'user': {
            'id':       session['user_id'],
            'username': session['username']
        }
    }), 200