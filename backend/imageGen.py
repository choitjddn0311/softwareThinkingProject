import urllib.parse
import urllib.request
import ssl
import random
import os
import uuid
import json
from flask import Blueprint, request, jsonify, session, send_from_directory

image_bp = Blueprint('image', __name__)

# 이미지 저장 폴더
IMAGE_DIR = os.path.join(os.path.dirname(__file__), 'diary_images')
os.makedirs(IMAGE_DIR, exist_ok=True)

EMOTION_EXPRESSIONS = {
    'happy':     'happy smiling expression, cheerful',
    'sad':       'sad tearful expression, gloomy',
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
    # 1인칭 주어 제거 및 소문자 정리
    text = english_text.strip().rstrip('.')
    first_person = ['I ', 'I\'m ', 'I am ', 'We ', 'We\'re ', 'We are ']
    for fp in first_person:
        if text.startswith(fp):
            text = text[len(fp):]
            break

    # 과거형 → 현재진행형 변환 (주요 동사)
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

    data = request.get_json() or {}
    emotion = (data.get('emotion') or '').strip()
    title   = (data.get('title')   or '').strip()
    content = (data.get('content') or '').strip()
    weather = (data.get('weather') or '').strip()

    expression      = EMOTION_EXPRESSIONS.get(emotion, 'neutral expression')
    weather_scene   = WEATHER_EXPRESSIONS.get(weather, '')

    # 한국어 일기 내용 → 영어 번역
    korean_text = f"{title}. {content}" if title and content else title or content or 'daily life'
    print(f"[번역 중...] {korean_text}")
    english_scene = translate_to_english(korean_text)
    print(f"[번역 완료] {english_scene}")
    action_scene = to_action_scene(english_scene)
    print(f"[행동 변환] {action_scene}")

    seed = random.randint(1, 99999)
    prompt = (
        f"Korean child's crayon drawing diary illustration, "
        f"drawn by a 6-7 year old Korean kindergartener, "
        f"heavily filled with thick crayon colors, "
        f"NO outlines dominant style — color fills everything, "
        f"background completely covered: blue sky on top, green or brown ground on bottom, "
        f"naive Korean childlike art, bold flat color blocks, "
        f"chunky simple human figure facing forward with round face and big smile, "
        f"symbolic objects drawn large and simple (sun, tree, food, etc), "
        f"no empty white space — every area filled with bright saturated crayon color, "
        f"scene: {action_scene}, "
        f"weather: {weather_scene}, " if weather_scene else ""
        f"character showing {expression}, "
        f"vivid primary colors: red, yellow, blue, green, orange, "
        f"scanned paper texture, hand-drawn diary page style, "
        f"Korean summer vacation diary aesthetic"
    )

    encoded = urllib.parse.quote(prompt)
    pollinations_url = f"https://image.pollinations.ai/prompt/{encoded}?width=512&height=512&nologo=true&seed={seed}"

    print(f"[이미지 생성 중...] prompt: {prompt}")

    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        req = urllib.request.Request(
            pollinations_url,
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req, timeout=90, context=ctx) as response:
            image_data = response.read()

        filename = f"{uuid.uuid4()}.jpg"
        filepath = os.path.join(IMAGE_DIR, filename)
        with open(filepath, 'wb') as f:
            f.write(image_data)

        local_url = f"/api/image-file/{filename}"
        print(f"[이미지 저장 완료] {local_url}")
        return jsonify({"image_url": local_url, "prompt": prompt}), 200

    except Exception as e:
        print(f"[이미지 생성 실패] {e}")
        return jsonify({"image_url": pollinations_url, "prompt": prompt}), 200
