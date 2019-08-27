function render(ctx, frame, dt, width, height, mapTransparency) {
	ctx.clearRect(0, 0, width, height);
	renderMap(ctx, mapTransparency);
	renderTreasure(ctx, frame);
	renderPlayer(ctx, dt);
	renderMonsters(ctx, dt);
}

function renderMap(ctx, mapTransparency) {
	var x, y, cell;
	ctx.globalAlpha = mapTransparency;
	for(y = 0 ; y < MAP.th ; y++) {
		for(x = 0 ; x < MAP.tw ; x++) {
			cell = tcell(x, y);
			if (cell) {
				ctx.fillStyle = COLORS[cell - 1];
				ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
			}
		}
	}
	ctx.globalAlpha = 1;
}

function renderPlayer(ctx, dt) {
	ctx.fillStyle = COLOR.YELLOW;
	var img = document.getElementById("test");
  	ctx.drawImage(img, player.x + (player.dx * dt), player.y + (player.dy * dt), TILE, TILE);

	var n, max;

	ctx.fillStyle = COLOR.GOLD;
	for(n = 0, max = player.collected ; n < max ; n++)
		ctx.drawImage(img, player.x + (player.dx * dt), player.y + (player.dy * dt), TILE, TILE);

	ctx.fillStyle = COLOR.SLATE;
	for(n = 0, max = player.killed ; n < max ; n++)
		ctx.drawImage(img, player.x + (player.dx * dt), player.y + (player.dy * dt), TILE, TILE);
}

function renderMonsters(ctx, dt) {
	ctx.fillStyle = COLOR.SLATE;
	var n, max, monster;
	for(n = 0, max = monsters.length ; n < max ; n++) {
		monster = monsters[n];
		if (!monster.dead)
			ctx.fillRect(monster.x + (monster.dx * dt), monster.y + (monster.dy * dt), TILE, TILE);
	}
}

function renderTreasure(ctx, frame) {
	ctx.fillStyle   = COLOR.GOLD;
	ctx.globalAlpha = 0.25 + tweenTreasure(frame, 60);
	var n, max, t;
	for(n = 0, max = treasure.length ; n < max ; n++) {
		t = treasure[n];
		if (!t.collected)
			ctx.fillRect(t.x, t.y + TILE/3, TILE, TILE*2/3);
	}
	ctx.globalAlpha = 1;
}

function tweenTreasure(frame, duration) {
	var half  = duration/2
			pulse = frame%duration;
	return pulse < half ? (pulse/half) : 1-(pulse-half)/half;
}
		
