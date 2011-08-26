## Sonic.js

[See the live demo!](http://padolsey.net/p/Sonic/repo/demo/demo.html)

Sonic is a tool that you can use to create spinny-loady-thingies on the fly. It's best for shapes that loop.

E.g. a square:

    var square = new Sonic({
        width: 100,
        height: 100,
        fillColor: '#000',
        path: [
            ['line', 10, 10, 90, 10],
            ['line', 90, 10, 90, 90],
            ['line', 90, 90, 10, 90],
            ['line', 10, 90, 10, 10]
        ]
    });

    square.play();

    document.body.appendChild(square.canvas);

Square demo: http://padolsey.net/p/Sonic/repo/demo/square.html

Drawing methods are specified in `path` like so:

    [methodName, arguments...]

### Methods and their arguments:

 * `['line', startX, startY, endX, endY]`
 * `['bezier', startX, startY, endX, endY, cp1x, cp1y, cp2x, cp2y]`
 * `['arc', cx, cy, radius, startDegree, endDegree]` (degrees, not radians!)


### How does it work?

Sonic works by drawing a shape (by default a square, `fillRect`) at tiny intervals along a pre-defined path. You define the path via the `path` option.

### More control:

Custom shapes can be drawn with the help of `step`:

	new Sonic({
		//...
		step: function(point, index, frame, color, alpha) {

			// point is an object { x: n, y: n, progress: n}
			// point.progress is progress of point (0..1)
			// relative to other points in that single draw

			// index is the progress relative to entire shape

			// frame is the current frame (0..1) 

		}
	});

 For more demos, see: https://github.com/jamespadolsey/Sonic/blob/master/demo/demo.html

### FAQ:

#### Isn't it slow/inefficient?

No, not really. It only has to run the calculations (i.e. functions for `line`, `arc`, and `bezier`) for one loop, then Sonic caches the produced image and simply calls `putImageData` on every subsequent frame. It's pretty quick.

#### There's no `anticlockwise` arg for `arc`, why?

It's not needed. You can make an arc progress in an anti-clockwise direction by going from, `360` to `0`, instead of `0` to `360`.