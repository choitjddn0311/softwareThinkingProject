import urllib.parse
import urllib.request
import ssl
import os
import uuid
import json
import requests
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify, session, send_from_directory

# 루트 디렉토리의 .env 로드
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

HF_API_KEY = os.environ.get('HUGGING_FACE_API_KEY', '')
HF_MODEL   = 'black-forest-labs/FLUX.1-schnell'
HF_URL     = f'https://router.huggingface.co/hf-inference/models/{HF_MODEL}'

image_bp = Blueprint('image', __name__)

# 이미지 저장 폴더
IMAGE_DIR = os.path.join(os.path.dirname(__file__), 'diary_images')
os.makedirs(IMAGE_DIR, exist_ok=True)

EMOTION_EXPRESSIONS = {
    'happy':     'happy smiling expression, cheerful',
    'sad':       'sad tearful expression, gloomy',
    'angry':     'angry frustrated expression, upset',
    'lethargic': 'sleepy drowsy expression, tired',
    'funny':     'excited joyful expression, energetic',
    'love':      'blushing heart eyes expression, romantic',
}

WEATHER_EXPRESSIONS = {
    'sunny':        'bright sunny day, clear blue sky, shining sun',
    'partly_cloudy': 'partly cloudy sky, some clouds and sunshine',
    'cloudy':       'overcast cloudy sky, grey clouds',
    'rainy':        'rainy day, raindrops falling, puddles on ground',
    'snowy':        'snowy day, snowflakes falling, white snow on ground',
}

def translate_to_english(text):
    """Google Translate 무료 엔드포인트로 한국어 → 영어 번역 (API 키 불필요)"""
    try:
        url = (
            "https://translate.googleapis.com/translate_a/single"
            f"?client=gtx&sl=ko&tl=en&dt=t&q={urllib.parse.quote(text)}"
        )
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        with urllib.request.urlopen(req, timeout=10, context=ctx) as response:
            result = json.loads(response.read())
            translated = ''.join([item[0] for item in result[0] if item[0]])
            return translated
    except Exception as e:
        print(f"[번역 실패] {e}")
        return text


def to_action_scene(english_text):
    """번역된 문장을 이미지 생성에 적합한 행동 중심 묘사로 변환"""
    text = english_text.strip().rstrip('.')
    first_person = ['I ', 'I\'m ', 'I am ', 'We ', 'We\'re ', 'We are ']
    for fp in first_person:
        if text.startswith(fp):
            text = text[len(fp):]
            break

    past_to_ing = {
        'went to': 'going to', 'went': 'going',
        'ate': 'eating', 'eat': 'eating',
        'played': 'playing', 'play': 'playing',
        'studied': 'studying', 'study': 'studying',
        'watched': 'watching', 'watch': 'watching',
        'ran': 'running', 'run': 'running',
        'swam': 'swimming', 'swim': 'swimming',
        'drew': 'drawing', 'draw': 'drawing',
        'read': 'reading',
        'wrote': 'writing', 'write': 'writing',
        'met': 'meeting', 'meet': 'meeting',
        'visited': 'visiting', 'visit': 'visiting',
        'cried': 'crying', 'cry': 'crying',
        'laughed': 'laughing', 'laugh': 'laughing',
        'slept': 'sleeping', 'sleep': 'sleeping',
        'had': 'having', 'have': 'having',
        'made': 'making', 'make': 'making',
        'bought': 'buying', 'buy': 'buying',
        'received': 'receiving',
        'enjoyed': 'enjoying', 'enjoy': 'enjoying',
        'was happy': 'being happy',
        'was sad': 'being sad',
        'was tired': 'being tired',
        'was excited': 'being excited',
        'felt': 'feeling',
    }
    text_lower = text.lower()
    for past, ing in past_to_ing.items():
        if past in text_lower:
            text = text_lower.replace(past, ing, 1)
            break

    return f"a Korean child {text}"


# 저장된 이미지 파일 서빙
@image_bp.route('/api/image-file/<filename>')
def serve_image_file(filename):
    return send_from_directory(IMAGE_DIR, filename)


@image_bp.route('/api/generate-image', methods=['POST'])
def generate_image():
    if 'user_id' not in session:
        return jsonify({"error": "로그인이 필요합니다"}), 401

    if not HF_API_KEY:
        return jsonify({"error": "이미지 생성 API 키가 설정되지 않았습니다"}), 500

    data = request.get_json() or {}
    emotion = (data.get('emotion') or '').strip()
    title   = (data.get('title')   or '').strip()
    content = (data.get('content') or '').strip()
    weather = (data.get('weather') or '').strip()

    expression    = EMOTION_EXPRESSIONS.get(emotion, 'neutral expression')
    weather_scene = WEATHER_EXPRESSIONS.get(weather, '')

    korean_text = f"{title}. {content}" if title and content else title or content or 'daily life'
    print(f"[번역 중...] {korean_text}")
    english_scene = translate_to_english(korean_text)
    print(f"[번역 완료] {english_scene}")
    action_scene = to_action_scene(english_scene)
    print(f"[행동 변환] {action_scene}")

    weather_part = f"weather: {weather_scene}, " if weather_scene else ""
    prompt = (
        "Korean child's crayon drawing diary illustration, "
        "drawn by a 6-7 year old Korean kindergartener, "
        "heavily filled with thick crayon colors, "
        "NO outlines dominant style — color fills everything, "
        "background completely covered: blue sky on top, green or brown ground on bottom, "
        "naive Korean childlike art, bold flat color blocks, "
        "chunky simple human figure facing forward with round face and big smile, "
        "symbolic objects drawn large and simple (sun, tree, food, etc), "
        "no empty white space — every area filled with bright saturated crayon color, "
        f"scene: {action_scene}, "
        f"{weather_part}"
        f"character showing {expression}, "
        "vivid primary colors: red, yellow, blue, green, orange, "
        "scanned paper texture, hand-drawn diary page style, "
        "Korean summer vacation diary aesthetic"
    )

    print(f"[이미지 생성 중...] prompt: {prompt}")

    try:
        response = requests.post(
            HF_URL,
            headers={'Authorization': f'Bearer {HF_API_KEY}'},
            json={'inputs': prompt},
            timeout=60,
        )

        if response.status_code == 503:
            return jsonify({"error": "이미지 생성 모델 로딩 중입니다. 잠시 후 다시 저장해보세요."}), 502

        if response.status_code != 200:
            print(f"[이미지 생성 실패] HTTP {response.status_code}: {response.text[:200]}")
            return jsonify({"error": f"이미지 생성 실패 (HTTP {response.status_code})"}), 502

        image_data = response.content

        # 유효한 이미지인지 확인
        if not image_data or image_data[:4] not in (b'\xff\xd8\xff\xe0', b'\xff\xd8\xff\xe1', b'\x89PNG'):
            if image_data[:1] == b'{':
                error_msg = json.loads(image_data).get('error', '알 수 없는 오류')
                print(f"[이미지 생성 실패] API 오류: {error_msg}")
                return jsonify({"error": f"이미지 생성 오류: {error_msg}"}), 502
            print(f"[이미지 생성 실패] 유효하지 않은 응답 (앞 20바이트: {image_data[:20]})")
            return jsonify({"error": "이미지 생성 서버에서 유효하지 않은 응답을 받았습니다"}), 502

        filename = f"{uuid.uuid4()}.png"
        filepath = os.path.join(IMAGE_DIR, filename)
        with open(filepath, 'wb') as f:
            f.write(image_data)

        local_url = f"/api/image-file/{filename}"
        print(f"[이미지 저장 완료] {local_url}")
        return jsonify({"image_url": local_url, "prompt": prompt}), 200

    except requests.exceptions.Timeout:
        print("[이미지 생성 실패] 타임아웃")
        return jsonify({"error": "이미지 생성 시간이 초과됐습니다. 다시 저장해보세요."}), 502
    except Exception as e:
        print(f"[이미지 생성 실패] {e}")
        return jsonify({"error": "이미지 생성 중 오류가 발생했습니다"}), 502
