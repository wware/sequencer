var length = 16;
var numnotes = 12;

function Sequencer() {
    var i, j, states = [];
    var nextstep = 0;
    var time = 100;  // milliseconds
    var active = true;
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
        var j, note, thisstep = nextstep;
        nextstep = (thisstep + 1) % length;
        for (j = 0; j < numnotes; j++) {
            if (states[thisstep][j]) {
                note = pitches[j] + 60;
                MIDI.noteOn(0, note, 127, 0);
            }
        }
        if (active) {
            setTimeout(function() {
                var j, note;
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
    }
    function settime(t) {
        console.log('settime ' + t);
        time = 1000 * t;    // convert to milliseconds
    }
    function running() {
        console.log('start');
        active = !active;
        if (active) { nextstep = 0; step(); }
        return active;
    }
    function toggle(i, j) {
        var x;
        console.log('toggle ' + i + ' ' + j);
        states[i][j] = x = !states[i][j];
        return x;
    }
    function reset() {
        console.log('reset');
        for (i = 0; i < length; i++) {
            for (j = 0; j < numnotes; j++) {
                states[i][j] = false;
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
    var i, j, row, td, colgroup;
    var resettable = [];
    var table = $('<table>').attr({
        cellSpacing: '10px'
    });
    var sequencer = Sequencer();

    target.append(
        $('<div>').append(
            $('<button>')
            .text("Reset")
            .click(function() {
                $('.td').attr({bgcolor: offcolor});
                sequencer.reset();
            })
        ).append(
            $('<button>')
            .attr({id: 'runbutton'})
            .text("Running")
            .attr({
                style: "margin: 0px 0px 0px 20px"
            })
            .click(function() {
                if (sequencer.running()) {
                    $('#runbutton').text('Running');
                } else {
                    $('#runbutton').text('Stopped');
                }
            })
        ).append(
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
    for (i = 0; i < numnotes; i++) {
        row = $('<tr>').attr({
            style: "height:" + size
        });
        table.append(row);
        for (j = 0; j < length; j++) {
            var clickmaker = function(i, j, td) {
                return function() {
                    console.log(i + ', ' + j);
                    if (sequencer.toggle(j, numnotes - 1 - i)) {
                        td.attr({bgcolor: oncolor});
                    } else {
                        td.attr({bgcolor: offcolor});
                    }
                }
            }
            td = $('<td>').attr({
                id: "td-" + i + "-" + j,
                class: "td",
                bgcolor: offcolor
            });
            td.click(clickmaker(i, j, td));
            resettable.push(td);
            row.append(td);
        }
    }
};
