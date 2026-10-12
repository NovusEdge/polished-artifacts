"""Manim Community theme for the polished-artifacts looks. Values mirror each look's ../<look>/tokens.css."""
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
    ("primer", False): {"bg": "#ffffff", "text": "#1f2328", "text2": "#59636e",
                        "cat": ["#0969da", "#bc4c00", "#1a7f37", "#8250df", "#bf3989"], "font": "sans-serif"},
    ("primer", True): {"bg": "#0d1117", "text": "#f0f6fc", "text2": "#9198a1",
                       "cat": ["#4493f8", "#db6d28", "#3fb950", "#ab7df8", "#db61a2"], "font": "sans-serif"},
    ("editorial", False): {"bg": "#fffff8", "text": "#111111", "text2": "#5c5b55",
                           "cat": ["#8b0000", "#14202e", "#2a623d", "#85837a", "#94661c"], "font": "ET Book"},
    ("editorial", True): {"bg": "#151513", "text": "#f2f1e8", "text2": "#a9a79c",
                          "cat": ["#f07a72", "#8fb3d9", "#7fb38f", "#a9a79c", "#d4b25e"], "font": "ET Book"},
    ("material", False): {"bg": "#fef7ff", "text": "#1d1b20", "text2": "#49454f",
                          "cat": ["#5f52a7", "#0b61a4", "#006a64", "#944b00", "#984061"], "font": "Roboto"},
    ("material", True): {"bg": "#141218", "text": "#e6e0e9", "text2": "#cac4d0",
                         "cat": ["#c9bfff", "#a0c9ff", "#50dbd0", "#ffb783", "#ffb1c8"], "font": "Roboto"},
    ("clay", False): {"bg": "#faf9f5", "text": "#141413", "text2": "#5e5d59",
                      "cat": ["#c6613f", "#4f84b8", "#6b7f50", "#b4577a", "#7a7972"], "font": "Instrument Sans"},
    ("clay", True): {"bg": "#141413", "text": "#faf9f5", "text2": "#b0aea5",
                     "cat": ["#e08a6d", "#8fb7e0", "#9bb07f", "#d88ba4", "#b0aea5"], "font": "Instrument Sans"},
    ("studio", False): {"bg": "#ffffff", "text": "#000000", "text2": "#5d5d5d",
                        "cat": ["#2c67c5", "#d25e28", "#3a843f", "#7849d1", "#ab4f7a"], "font": "Hanken Grotesk"},
    ("studio", True): {"bg": "#000000", "text": "#ffffff", "text2": "#afafaf",
                       "cat": ["#63a8f8", "#f1a275", "#6bc67f", "#b897f4", "#f68ebc"], "font": "Hanken Grotesk"},
}


def apply(look: str, dark: bool) -> dict:
    from manimpango import list_fonts

    theme = dict(LOOKS[(look, dark)])
    # Manim resolves fonts through fontconfig; a missing face renders in a default serif without failing.
    if theme["font"] not in list_fonts():
        theme["font"] = "sans-serif"
    config.background_color = theme["bg"]
    return theme
