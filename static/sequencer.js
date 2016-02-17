var length = 16;
var numnotes = 15;
var active = true;
var runbutton;

function updateRunButton() {
    if (active) {
        $('#runbutton').text('Running');
    } else {
        $('#runbutton').text('Stopped');
    }
}

function Sequencer() {
    var i, j, states = [];
    var nextstep = 0;
    var time = 100;  // milliseconds
    var resettable = false;
    var pitches = [
        0, 2, 4, 5, 7, 9, 11, 12, 14, 16,
        17, 19, 21, 23, 24, 26, 28, 29, 31
    ];
    for (i = 0; i < length; i++) {
        states.push([]);
        for (j = 0; j < numnotes; j++) {
            states[i].push(false);
        }
    }
    function step() {
        var j, pf, note, thisstep = nextstep;
        if (resettable) {
            for (i = 0; i < length; i++) {
                for (j = 0; j < numnotes; j++) {
                    states[i][j] = false;
                }
            }
            resettable = false;
            active = false;
            updateRunButton();
            return;
        }
        nextstep = (thisstep + 1) % length;
        for (j = 0; j < numnotes; j++) {
            $('#progress-row > th').removeClass('active');
            $('#progress-row > th:nth-child(' + (thisstep + 1) + ')').addClass('active');
            if (states[thisstep][j]) {
                note = pitches[j] + 60;
                MIDI.noteOn(0, note, 127, 0);
            }
        }
        setTimeout(function() {
            for (j = 0; j < numnotes; j++) {
                if (states[thisstep][j]) {
                    note = pitches[j] + 60;
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
        updateRunButton();
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
    step();
    return {
        running: running,
        settime: settime,
        toggle: toggle,
        reset: reset
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

    runbutton = $('<button>')
        .attr({id: 'runbutton'})
        .text("Running")
        .attr({
            style: "margin: 0px 0px 0px 20px"
        })
        .click(function() {
            sequencer.running();
        });

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
    for (i = 0; i < length; i++) {
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
    for (j = 0; j < length; j++) {
        th = $('<th>').attr({
            class: "th"
        });
        row.append(th);
    }

    for (i = 0; i < numnotes; i++) {
        i2 = numnotes - 1 - i;
        row = $('<tr>').attr({
            style: "height:" + size
        });
        table.append(row);
        for (j = 0; j < length; j++) {
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
