from flask import Flask
from flask_cors import CORS
from diaryCRUD import diary_bp, init_db
from auth import auth_bp, init_db as init_auth_db
from imageGen import image_bp

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = 'your-secret-key-here'

app.register_blueprint(diary_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(image_bp)

init_db()
init_auth_db()  # 추가

if __name__ == '__main__':
    app.run(debug=True)