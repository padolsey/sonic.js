/*
 * Sonic
 */
(function(){

	function Sonic(d) {

		this.data = d.data;
		this.imageData = [];

		this.multiplier = d.multiplier || 1;
		this.padding = d.padding || 10;

		this.stepsPerFrame = d.stepsPerFrame || 1;
		this.trailLength = 1, d.trailLength || 1;
		this.pointDistance = d.pointDistance || .05;

		this.color = d.color || [255,255,255].join(',');

		this.stepMethod = typeof d.step == 'string' ?
			stepMethods[d.step] :
			d.step || stepMethods.square;

		this._setup = d.setup || function(){};
		this._teardown = d.teardown || function(){};

		this.width = d.width;
		this.height = d.height;

		this.setup();

	}

	var argTypes = Sonic.argTypes = {
		DIM: 1,
		DEGREE: 2,
		RADIUS: 3,
		OTHER: 0
	};

	var argSignatures = Sonic.argSignatures = {
		arc: [1, 1, 3, 2, 2, 0],
		bezier: [1, 1, 1, 1, 1, 1, 1, 1],
		line: [1,1,1,1]
	};

	var pathMethods = Sonic.pathMethods = {
		bezier: function(t, p0x, p0y, p1x, p1y, c0x, c0y, c1x, c1y) {
			
		    t = 1-t;

		    var i = 1-t,
		        x = t*t,
		        y = i*i,
		        a = x*t,
		        b = 3 * x * i,
		        c = 3 * t * y,
		        d = y * i;

		    return [
		        a * p0x + b * c0x + c * c1x + d * p1x,
		        a * p0y + b * c0y + c * c1y + d * p1y
		    ]

		},
		arc: function(t, cx, cy, radius, start, end, anti) {

			if (start < 0) start = Math.PI*2 + start;
			if (end < 0) end = Math.PI*2 + end;

			if (anti) end -= Math.PI*2;

		    var point = (end - start) * t + start;

		    var ret = [
		        (Math.cos(point) * radius) + cx,
		        (Math.sin(point) * radius) + cy
		    ];

		    ret.angle = point;
		    ret.t = t;

		    return ret;

		},
		line: function(t, sx, sy, ex, ey) {
			return [
				(ex - sx) * t + sx,
				(ey - sy) * t + sy
			]
		}
	};

	var stepMethods = Sonic.stepMethods = {
		
		square: function(x, y, p, color, alpha) {
			this._.fillRect(x - 3, y - 3, 6, 6);
		},

		fader: function(x, y, p, color, alpha) {

			this._.beginPath();
			this._last && this._.moveTo(this._last[0], this._last[1]);
			this._.lineTo(x, y);
			this._.closePath();
			this._.stroke();

			this._last = [x,y];

		}

	}

	Sonic.prototype = {
		setup: function() {

			var args,
				type,
				method,
				value,
				data = this.data;

			this.canvas = document.createElement('canvas');
			this._ = this.canvas.getContext('2d');

			this.canvas.height = this.height + 2*this.padding;
			this.canvas.width = this.width + 2*this.padding;

			this.points = [];

			for (var i = -1, l = data.length; ++i < l;) {

				args = data[i].slice(1);
				method = data[i][0];

				if (!(method in argSignatures)) {
					continue;
				}

				for (var a = -1, al = args.length; ++a < al;) {

					type = argSignatures[method][a];
					value = args[a];

					switch (type) {
						case argTypes.RADIUS:
							value *= this.multiplier;
							break;
						case argTypes.DIM:
							value *= this.multiplier;
							value += this.padding;
							break;
						case argTypes.DEGREE:
							value *= Math.PI/180;
							break;
					};

					args[a] = value;

				}

				args.unshift(0);

				for (var r, pd = this.pointDistance, t = pd; t <= 1; t += pd) {
					
					// Avoid crap like 0.15000000000000002
					t = Math.round(t*1/pd) / (1/pd);

					args[0] = t;

					this.points.push(
						r = pathMethods[method].apply(null, args)
					);

					r.progress = t;

				}

			}

			this.frame = 0;
			this.prep();

		},

		prep: function() {

			this._.clearRect(0, 0, this.canvas.width, this.canvas.height);
			
			var points = this.points,
				pointsLength = points.length,
				point, index;

			var alpha,
				pd = this.pointDistance;

			this._setup();

			for (var i = 0, l = pointsLength*this.trailLength; ++i < l;) {

				index = this.frame + i;

				point = points[index] || points[index - pointsLength];

				alpha = Math.round(1000*(i/l))/1000;

				this._.fillStyle = ('rgba(' + this.color + ',' + alpha + ')');
				this._.strokeStyle = ('rgba(' + this.color + ',' + alpha + ')');

				this.stepMethod(point[0], point[1], point.progress, this.color, alpha);

			} 

			this._teardown();

			this.imageData[this.frame] = (
				this._.getImageData(0, 0, this.canvas.width, this.canvas.height)
			);


		},

		draw: function() {

			if (!(this.frame in this.imageData)) {

				this.prep();

			} else {

				this._.clearRect(0, 0, this.canvas.width, this.canvas.height);
				
				this._.putImageData(
					this.imageData[this.frame],
					0, 0
				);

			}

			this.frame += this.stepsPerFrame;

			if (this.frame + 1 >= this.points.length) {
				this.frame = 0;
			}

		},

		play: function() {
			var hoc = this;
			this.timer = setInterval(function(){
				hoc.draw();
			}, 30);
		},
		stop: function() {
			this.timer && clearInterval(this.timer);
		}
	};

	window.Sonic = Sonic;

}());