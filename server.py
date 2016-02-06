#!/usr/bin/env python
"""
Module docstring, make pylint happy.
"""

import threading

from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    """
    Function docstring, make pylint happy.
    """
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
