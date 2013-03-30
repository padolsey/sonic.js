## Sonic.js

 * **[See some examples!](http://padolsey.net/p/Sonic/repo/demo/demo.html)**
 * **[Create your own with Sonic Creator!](http://padolsey.github.com/sonic-creator/)**

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

### How does it work?

Sonic works by drawing a shape (by default a square, `fillRect`) at tiny intervals along a pre-defined path. You define the path via the `path` option:

Drawing methods are specified in the `path` array like so:

    [methodName, arguments...]

### Methods and their arguments:

 * `['line', startX, startY, endX, endY]`
 * `['bezier', startX, startY, endX, endY, cp1x, cp1y, cp2x, cp2y]`
 * `['arc', cx, cy, radius, startDegree, endDegree]` (degrees, not radians!)

### Options

Options that you can pass to `new Sonic({...})` include:

 * `path`: An array which defines the path taken by sonic. Look at the square example above. Each array item is an array with the format `[methodName, arguments...]`, with the available methods specified above (`line`, `bezier` and `arc`).
 * `width`: The pixel width of the canvas (note: not including padding)
 * `height`: The pixel height of the canvas (note: not including padding)
 * `padding` (default: `0`): The pixel padding.
 * `fillColor`: The canvas' context's fill color (e.g. `red`, `rgb(255,0,0)`, `#F00`)
 * `strokeColor`: The canvas' context's stroke color (e.g. `green`, `rgb(0,255,0)`, `#0F0`)
 * `fps` (default: `25`): How many frames per second. More fps means smoother animation and sonic will progress through the specified path quicker. Less frames means the opposite. There shouldn't be much need to change this.
 * `stepsPerFrame` (default: `1`): This integer specifies how many steps of an animation should occur on each frame.
 * `pointDistance` (default: `.05`): The distance between points (0..1) in each path (that is, each sub-path under the main path). If you draw a line, and set the pointDistance to 0.1, then there will be ten steps in the animation (ten points). 
 * `trailLength` (default: `1`): The length of sonic's trail (0..1). A length of **one** means that it's like a snake trying to eat its own tail.
 * `step` (default: `"square"`): A function OR a name of a function found in `Sonic.stepMethods`. This function will be called on every step of the animation. See below (under "more control") for more info on this function.
 * `domClass` (default: `"sonic"`): A class to be applied to the `<canvas>` element.

### More control:

Custom shapes can be drawn with the help of `step`:

	new Sonic({
		//...
		step: function(point, index, frame) {

			// point is an object { x: n, y: n, progress: n}
			// point.progress is progress of point (0..1)
			// relative to other points in that single draw

			// index is the progress relative to entire shape

			// frame is the current frame (0..1) 

			// E.g. let's draw a tiny circle:

			this._.beginPath();
			this._.moveTo(point.x, point.y);
			this._.arc(point.x, point.y, 5, 0, Math.PI*2, false);
			this._.closePath();
			this._.fill();

			// this == Sonic instance
			// this._ == canvas context
			// this.alpha = alpha opacity

		}
	});

For more demos, see: https://github.com/jamespadolsey/Sonic/blob/master/demo/demo.html

### FAQ:

#### Isn't it slow/inefficient?

No, not really. It only has to run the calculations (i.e. functions for `line`, `arc`, and `bezier`) for one loop, then Sonic caches the produced image and simply calls `putImageData` on every subsequent frame. It's pretty quick.

#### Older browsers!?

Cadell Christo (cadc) has made [sonicGIF](https://github.com/cadc/SonicGIF), which generares GIFs for you to use in older browsers.

#### There's no `anticlockwise` arg for `arc`, why?

It's not needed. You can make an arc progress in an anti-clockwise direction by going from, `360` to `0`, instead of `0` to `360`.