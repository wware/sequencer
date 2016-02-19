function Sequencer() {
    var i, j, states = [];
    var nextstep = 0;
    var time = 100;  // milliseconds
    var resettable = false;
    var length = 16;
    var numnotes = 15;
    var active = true;
    var buttonActive, buttonInactive;
    var pitches = [
        0, 2, 4, 5, 7, 9, 11, 12, 14, 16,
        17, 19, 21, 23, 24, 26, 28, 29, 31
    ];
    function setRunButtonControls(_active, _inactive) {
        buttonActive = _active;
        buttonInactive = _inactive;
    }
    function getLength() {
        return length;
    }
    function getNumNotes() {
        return numnotes;
    }
    function setLength(x) {
        var i, step;
        while (x > states.length) {
            step = [];
            for (i = 0; i < numnotes; i++) {
                step.push(false);
            }
            states.push(step);
        }
        length = x;
    }
    function step() {
        var j, pf, note, thisstep = nextstep;
        var pitchOffset = 48;   // C below middle C
        if (resettable) {
            for (i = 0; i < length; i++) {
                for (j = 0; j < numnotes; j++) {
                    states[i][j] = false;
                }
            }
            resettable = false;
            active = false;
            return;
        }
        nextstep = (thisstep + 1) % length;
        for (j = 0; j < numnotes; j++) {
            $('#progress-row > th').removeClass('active');
            $('#progress-row > th:nth-child(' + (thisstep + 1) + ')').addClass('active');
            if (states[thisstep] === undefined) {
                debugger;
            }
            if (states[thisstep][j]) {
                note = pitches[j] + pitchOffset;
                MIDI.noteOn(0, note, 127, 0);
            }
        }
        setTimeout(function() {
            for (j = 0; j < numnotes; j++) {
                if (states[thisstep][j]) {
                    note = pitches[j] + pitchOffset;
                    MIDI.noteOff(0, note, 0, 0);
                }
            }
            if (active) {
                setTimeout(step, 0.25 * time);
            }
        },
        0.75 * time);
    }
    function settime(t) {
        time = 1000 * t;    // convert to milliseconds
    }
    function running() {
        active = !active;
        if (active) {
            step();
        }
        active ? buttonActive() : buttonInactive();
    }
    function toggle(i, j) {
        var x;
        states[i][j] = x = !states[i][j];
        return x;
    }
    function reset() {
        if (active) {
            resettable = true;
        } else {
            for (i = 0; i < length; i++) {
                for (j = 0; j < numnotes; j++) {
                    states[i][j] = false;
                }
            }
        }
    }

    states = [];
    setLength(length);
    step();

    return {
        running: running,
        settime: settime,
        toggle: toggle,
        reset: reset,
        setRunButtonControls: setRunButtonControls,
        getLength: getLength,
        getNumNotes: getNumNotes,
        setLength: setLength
    };
};


function build_ui(target) {
    var size = "40px";
    var offcolor = "#cfc";
    var oncolor = "#88f";
    var i, i2, j, row, td, colgroup;
    var resettable = [];
    var table = $('<table>').attr({
        cellSpacing: '10px'
    });
    var sequencer = Sequencer();

    var runbutton = $('<button>')
        .attr({id: 'runbutton'})
        .text("Running")
        .attr({
            style: "margin: 0px 0px 0px 20px"
        })
        .click(function() {
            sequencer.running();
        });
    sequencer.setRunButtonControls(
        function() {
            runbutton.text('Running');
        },
        function() {
            runbutton.text('Stopped');
        }
    );

    target.append(
        $('<div>').append(
            $('<button>')
            .text("Reset")
            .click(function() {
                $('.td').removeClass('active');
                sequencer.reset();
            })
        ).append(runbutton).append(
            $('<input>')
            .attr({
                type: 'range',
                value: 0,
                style: "margin: 0px 0px 0px 20px"
            })
            .change(function(event) {
                var value = parseInt(event.target.value);
                var time = 0.1 * Math.exp(value / 29);
                sequencer.settime(time);
            })
        ).append(
            $('<span>').text("Uncle Will's Javascript Sequencer")
            .attr({style: "margin: 0px 0px 0px 100px"})
        )
    ).append(table);

    colgroup = $('<colgroup>');
    table.append(colgroup);
    for (i = 0; i < sequencer.getLength(); i++) {
        colgroup.append(
            $('<col>').attr({
                style: "width:" + size
            })
        );
    }

    row = $('<tr>').attr({
        id: 'progress-row',
        style: "height: 5px;"
    });
    table.append(row);
    for (j = 0; j < sequencer.getLength(); j++) {
        th = $('<th>').attr({
            class: "th"
        });
        row.append(th);
    }

    for (i = 0; i < sequencer.getNumNotes(); i++) {
        i2 = sequencer.getNumNotes() - 1 - i;
        row = $('<tr>').attr({
            style: "height:" + size
        });
        table.append(row);
        for (j = 0; j < sequencer.getLength(); j++) {
            var clickmaker = function(i2, j, td) {
                return function() {
                    if (sequencer.toggle(j, i2)) {
                        td.addClass('active');
                    } else {
                        td.removeClass('active');
                    }
                }
            }
            td = $('<td>').attr({
                id: "td-" + i2 + "-" + j,
                class: "td"
            });
            if ((i2 % 7) == 0 || (i2 % 7) == 2 || (i2 % 7) == 4) {
                td.addClass('cmajor');
            }
            td.click(clickmaker(i2, j, td));
            resettable.push(td);
            row.append(td);
        }
    }
};
