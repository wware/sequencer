#!/usr/bin/env python
"""
Module docstring, make pylint happy.
"""

import sys
from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    """
    Function docstring, make pylint happy.
    """
    return render_template('index.html')

if __name__ == '__main__':
    if sys.platform == 'darwin':
        # run debug on the Mac
        app.run(debug=True)
    else:
        # run production on Linux
        app.run(host='0.0.0.0', port=80)
