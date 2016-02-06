3D-Printed Circuit Boards
====

Here is
[the basic idea](http://www.instructables.com/id/3D-Printing-3D-Print-A-Solderless-Circuit-Board/?ALLSTEPS).
I bought some of the conductive goop he uses, and I have a 3d printer and a circuit I want to build, so let's do this.

Write a design system for this thing. Like OpenSCAD, its input will be scripted (in Python) and it shows a graphical
display as you work. Finally, it produces an OpenSCAD file as output. Later, low priority, maybe just go direct to STL
since it's [simple stuff](https://github.com/wware/CylindricalPrinter/blob/master/software/stl.py).

It can generate two forms of output. One is an image that shows placement of parts on the board and the routes. The
other is an OpenSCAD source file to produce the STL file for the 3D printer.





Graphical display
----

One option to show images would be running a small web server. You could push images to a browser using long polling,
but that's a pain. Let's poll the server to get a timestamp of the image, maybe twice a second, and actually get the
image if the timestamp has changed.

First you lay out parts on a 0.1" grid. You have a netlist, constructed in python, and you light up nets and then draw the routes.

To draw routes, you can simply assign points on the 0.1" grid to routes and ensure continuity, either by adjacency or by a jumper. This can be done algorithmically.

I need to think about design rule checking, and using DRC backwards to generate routes. Also think about conductivity, 0.1 ohm-inch, and think about how deep traces need to go. Wall thickness wants to be about 0.4 mm, which says medium-quality or high-quality
[layer accuracy](https://printm3d.com/solutions/article.php?id=17).

Looking at conductivity, I'm worried about skinny runs having too much resistance. You can lay bare wire along the run before gluing it down, and that will give much better results. Definitely do some tests with the goop when it arrives, which should be pretty soon.
