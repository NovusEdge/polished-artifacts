import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "skills", "manim"))
from manim import UP, Create, FadeIn, Scene, Square, Text, Transform  # noqa: E402
from theme import apply  # noqa: E402

T = apply(os.environ.get("PA_LOOK", "carbon"), dark=os.environ.get("PA_DARK") == "1")


class Smoke(Scene):
    def construct(self):
        title = Text("Latency falls as batch size grows", font=T["font"], color=T["text"]).scale(0.6).to_edge(UP)
        box = Square(color=T["cat"][0])
        self.play(FadeIn(title), run_time=0.3)
        self.play(Create(box), run_time=0.3)
        self.play(Transform(box, Square(color=T["cat"][1]).scale(0.5)), run_time=0.3)
        self.wait(1.5)
