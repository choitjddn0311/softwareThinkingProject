EMOTION_COLORS = {
    "happy":"#fcf300",
    "sad": "#a3c4f3",
    "angry": "#e01e37",
    "meh": "#001f54",
    "love": "#ff69eb",
    "funny": "#80b918",
}

def get_color(emotion):
    if emotion in EMOTION_COLORS:
        return EMOTION_COLORS[emotion]
    else:
        return "#bfc3ba"