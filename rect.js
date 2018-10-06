(function() {
	const sqrt = Math.sqrt;
	this.rect = (x, y, w, h) => Object.create({
			set: function(x, y, w, h) {this.position = v2(x, y); this.dimensions = v2(w, h); return this},
			add: function(other) {this.x += other.x; this.y += other.y; return this},
			sub: function(other) {this.x -= other.x; this.y -= other.y; return this},
			scale: function(scalar) {this.x *= scalar, this.y *= scalar; return this},
			dot: function(other) {return this.x * other.x + this.y * other.y},
			sqmag: function() {return this.x*this.x + this.y*this.y},
			mag: function() {return sqrt(this.x*this.x + this.y*this.y)},
			normalize: function() {this.scale(1/this.mag()); return this},
			normalized: function() {return this.copy().normalize()},
			copy: function() {return v2(this.x, this.y)},
			toArray: function() {return [this.x, this.y]},
		}).set(x, y, w, h);
}).call(window.game = window.game || {})