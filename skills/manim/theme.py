"""Manim Community theme for the polished-artifacts looks. Values mirror ../carbon/tokens.css and ../apple/tokens.css."""
from manim import config

LOOKS = {
    ("carbon", False): {"bg": "#ffffff", "text": "#161616", "text2": "#525252",
                        "cat": ["#6929c4", "#1192e8", "#005d5d", "#9f1853", "#fa4d56"], "font": "IBM Plex Sans"},
    ("carbon", True): {"bg": "#161616", "text": "#f4f4f4", "text2": "#c6c6c6",
                       "cat": ["#8a3ffc", "#33b1ff", "#007d79", "#ff7eb6", "#fa4d56"], "font": "IBM Plex Sans"},
    ("apple", False): {"bg": "#ffffff", "text": "#000000", "text2": "#3c3c43",
                       "cat": ["#1e6ef4", "#008932", "#c55300", "#e9152d", "#b02fc2"], "font": "Satoshi"},
    ("apple", True): {"bg": "#000000", "text": "#ffffff", "text2": "#ebebf5",
                      "cat": ["#5cb8ff", "#4ad968", "#ffa056", "#ff6165", "#ea8dff"], "font": "Satoshi"},
}


def apply(look: str, dark: bool) -> dict:
    from manimpango import list_fonts

    theme = dict(LOOKS[(look, dark)])
    # Manim resolves fonts through fontconfig; a missing face renders in a default serif without failing.
    if theme["font"] not in list_fonts():
        theme["font"] = "sans-serif"
    config.background_color = theme["bg"]
    return theme
