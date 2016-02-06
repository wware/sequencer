#!/bin/sh

PYFILES=$(git ls-files | grep "\.py$")
pep8 $PYFILES && pylint $PYFILES && py.test --doctest-modules $PYFILES
