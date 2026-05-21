EMOTION_COLORS = {
    "happy":"#ffea00",
    "sad": "#0a2472",
    "blue": "#778da9",
    "angry": "#d62828",
    "annoyed": "#008000",
    "meh": "#bfc3ba"
}

def get_color(emotion):
    if emotion in EMOTION_COLORS:
        return EMOTION_COLORS[emotion]
    else:
        return "#bfc3ba"