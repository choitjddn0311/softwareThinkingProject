from flask import Flask
from flask_cors import CORS
from diaryCRUD import diary_bp, init_db
from auth import auth_bp, init_db as init_auth_db  # 추가

app = Flask(__name__)
CORS(app, supports_credentials=True)  # session 쿠키 전달을 위해 수정
app.secret_key = 'your-secret-key-here'  # 추가

app.register_blueprint(diary_bp)
app.register_blueprint(auth_bp)  # 추가

init_db()
init_auth_db()  # 추가

if __name__ == '__main__':
    app.run(debug=True)