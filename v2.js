module("v2", [], () => {
	const sqrt = Math.sqrt;
	const v2proto = {
		x: 0,
		y: 0,
		assign: function(x, y) {this.x = x; this.y = y; return this},
		addAssign: function(other) {this.x += other.x; this.y += other.y; return this},
		subAssign: function(other) {this.x -= other.x; this.y -= other.y; return this},
		scaleAssign: function(scalar) {this.x *= scalar, this.y *= scalar; return this},
		hadamardAssign: function(other) {this.x *= other.x, this.y *= other.y; return this},
		normalizeAssign: function() {this.scale(1/this.mag()); return this},
		add: function(other) {return this.copy().addAssign(other)},
		sub: function(other) {return this.copy().subAssign(other)},
		scale: function(scalar) {return this.copy().scaleAssign(scalar)},
		hadamard: function(other) {return this.copy().hadamardAssign(other)},
		normalize: function() {return this.copy().normalizeAssign()},
		dot: function(other) {return this.x * other.x + this.y * other.y},
		squareMagnitude: function() {return this.x*this.x + this.y*this.y},
		magnitude: function() {return sqrt(this.x*this.x + this.y*this.y)},
		copy: function() {return v2(this.x, this.y)},
		toArray: function() {return [this.x, this.y]},
	};
	function v2(x, y) {
		return Object.create(v2proto).assign(x, y);
	}

	v2.v2proto = v2proto;
	
	return v2;
});