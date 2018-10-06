module("gameObjects", ["v2"], modules => {
	"use strict";
	const {v2} = modules;
	const BaseEntity = {
		init: function(more) {
			this.position = v2(0,0);
			this.velocity = v2(0,0);
			this.friction = 0.125;
			this.direction = 0;
			this.size = null;
			this.origin = null;
			return Object.assign(this, more);
		},
		move: function() {
			this.position.addAssign(this.velocity);
		},
		applyFriction: function() {
			this.velocity.scaleAssign(1-this.friction);
		},
		updateDirection: function() {
			if(this.velocity.squareMagnitude() > 0.0001) {
				this.direction = Math.atan2(this.velocity.y, this.velocity.x);
			}
		},
		getDrawOffset: function() {
			return this.size.hadamard(this.origin.scale(-1));
		}
	};

	return {
		bulletFactory: () => Object.create(BaseEntity).init({
			lifetime: 0,
			size: v2(20, 4),
			origin: v2(0.5, 0.5)
		}),
		player: Object.create(BaseEntity).init({
			acceleration: v2(0,0),
			speed: 2,
			color: 'orange',
			shootInterval: 75,
			nextShootTime: 0,
			size: v2(64, 64),
			origin: v2(0.5, 0.5)
		})
	};
});