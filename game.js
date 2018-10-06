module("game", ["v2", "gameObjects", "createPool"], modules => {
	"use strict";
	const {createPool, v2, gameObjects} = modules;

	const canvas = document.getElementsByTagName("canvas")[0];
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	const ctx = canvas.getContext("2d");
	
	const time = {
		now: 0,
		last: 0,
		step: 16.6666,
		frameTween: 0,
		slack: 0,
	};
	
	const {player, bulletFactory} = gameObjects;
	const bulletPool = createPool(bulletFactory, 64);
	
	const input = {
		map: ([
			"left", 37, 65, 74,
			"up", 38, 87, 73,
			"right", 39, 68, 76,
			"down", 40, 83, 75,
			"shoot", 32, 13
		].reduce((o, i) => (i.substr ? o.k = i : o.m[i] = o.k, o), {m:{}}).m)
	};

	window.addEventListener("keydown", e => input[input.map[e.which]] = true, {passive: true});
	window.addEventListener("keyup", e => input[input.map[e.which]] = false, {passive: true});
	
	function fixedUpdate() {

		// Update player
		const acceleration = v2();
		acceleration.x = input.right|0 - input.left|0;
		acceleration.y = input.down|0 - input.up|0;
		acceleration.scaleAssign(player.speed);

		player.velocity.addAssign(acceleration);
		player.move();
		player.applyFriction();

		if (player.velocity.squareMagnitude() > 0.001) {
			player.dir = Math.atan2(player.velocity.y, player.velocity.x);
		}

		if (input.shoot) {
			if (time.now >= player.nextShootTime) {
				const bullet = bulletPool.create();
				bullet.position = player.position.copy();
				bullet.dir = player.dir;
				bullet.velocity = v2(Math.cos(bullet.dir), Math.sin(bullet.dir)).scale(8).add(player.velocity);
				bullet.lifetime = 2000;
				player.nextShootTime = time.now + player.shootInterval;
			}
		}	

		// Update bullets
		bulletPool.eachActive(b => {
			b.move();
			b.lifetime -= time.step;
			if (b.lifetime <= 0) {
				bulletPool.destroy(b);
			}
		});

	}
	
	function draw() {
		const ft = time.frameTween;
		
		// clear screen
		ctx.fillStyle = '#202020';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// draw player
		ctx.save();
		const tweenOffset = player.velocity.copy().scale(ft);
		const drawAt = player.position.copy().add(tweenOffset);
		ctx.translate(drawAt.x, drawAt.y);
		ctx.rotate(player.dir);
		let drawOffset = player.getDrawOffset();
		ctx.translate(drawOffset.x, drawOffset.y);
		ctx.fillStyle = player.color;
		ctx.fillRect(0, 0, player.size.x, player.size.y);
		ctx.restore();

		// draw bullets
		bulletPool.eachActive(b => {
			ctx.save();
			const drawAt = b.position.copy().add(b.velocity.copy().scale(ft));
			ctx.translate(drawAt.x, drawAt.y);
			ctx.rotate(b.dir);
			drawOffset = b.getDrawOffset();
			ctx.translate(drawOffset.x, drawOffset.y);
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, b.size.x, b.size.y);
			ctx.restore();
		});
		ctx.fillStyle = "white";
		ctx.fillText("" + time.frameTween, 10, 10);
	}
	
	function tick(ticktime) {
		requestAnimationFrame(tick);

		time.now = ticktime;
		let elapsed = time.now - time.last;
		time.last = time.now;
		
		if (elapsed > 1000) elapsed = 1000;
		time.slack += elapsed;
		
		while (time.slack >= time.step) {
			fixedUpdate();
			time.slack -= time.step;
		}
		time.frameTween = time.slack / time.step;
		draw();
		ctx.fillStyle = "white";
		ctx.fillText("" + ticktime, 100, 100);
	}
	
	requestAnimationFrame(tick);

});