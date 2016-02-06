#!/usr/bin/env python
"""
Module docstring, make pylint happy.
"""

import threading

from flask import Flask, render_template

from midi import MidiController, Runner, LENGTH, HEIGHT

app = Flask(__name__)
runnable = threading.Event()
runnable.set()
ctrlr = MidiController()
runner = Runner(ctrlr, 1, runnable)
thr = threading.Thread(target=runner.run, args=())


@app.route('/')
def index():
    """
    Function docstring, make pylint happy.
    """
    return render_template(
        'index.html',
        height=HEIGHT,
        length=LENGTH
    )


@app.route("/settime/<t>")
def handle_time_change(t):
    """
    Function docstring, make pylint happy.
    """
    runner.change_time(float(t))
    return "", 200


@app.route("/click/<i>/<j>")
def handle_click(i, j):
    """
    Function docstring, make pylint happy.
    """
    newstate = ctrlr.toggle(int(i), int(j))
    return newstate and "1" or "0", 200


@app.route("/reset")
def handle_reset():
    """
    Function docstring, make pylint happy.
    """
    ctrlr.reset()
    return "", 200


@app.route("/kill")
def handle_kill():
    """
    Function docstring, make pylint happy.
    """
    runnable.clear()
    return "", 200

if __name__ == '__main__':
    thr.start()
    app.run(debug=True)
    runnable.clear()
