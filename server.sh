#!/bin/bash

export VIRTUAL_ENV="./venv"
export PATH="$VIRTUAL_ENV/bin:$PATH"
unset PYTHON_HOME

if [ ! -d ./venv ]
then
    virtualenv venv
fi

if [ ! -d ./venv/lib/python2.7/site-packages/flask ]
then
    pip install -r requirements.txt
fi

# exec "${@:-$SHELL}"
python ./server.py
