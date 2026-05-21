from flask import Flask
from flask_cors import CORS
from diaryCRUD import diary_bp, init_db

app = Flask(__name__)
CORS(app)

app.register_blueprint(diary_bp)

init_db()

if __name__ == '__main__':
    app.run(debug=True)