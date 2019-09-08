const TRAP_IMG = "./assets/trap.png",
	PLAYER_LEFT_IMG = "./assets/player-left.png",
	PLAYER_RIGHT_IMG = "./assets/player-right.png",
	SWITCH_IMG = "./assets/switch.png";

var PlayerFacing = {
	RIGHT: 0,
	LEFT: 1
  },
  playerLastMovement = PlayerFacing.RIGHT;

function render(ctx, frame, dt, width, height, mapTransparency) {
	ctx.clearRect(0, 0, width, height);
	renderMap(ctx, dt, mapTransparency);
	renderTreasure(ctx, frame);
	renderPlayer(ctx, dt);
	renderMonsters(ctx, dt);
	renderTraps(ctx, dt);
}

function renderMap(ctx, dt, mapTransparency) {
	var x, y, cell;
	ctx.globalAlpha = mapTransparency;
	if(!lanternActive){
		for(y = 0 ; y < MAP.th ; y++) {
			for(x = 0 ; x < MAP.tw ; x++) {
				cell = tcell(x, y);
				if (cell) {
					ctx.fillStyle = COLOR.GREY;
					ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
				}
			}
		}
		ctx.globalAlpha = 1;
	}
	else{
		ctx.globalAlpha = 1;
		for(y = 0 ; y < MAP.th ; y++) {
			for(x = 0 ; x < MAP.tw ; x++) {
				cell = tcell(x, y);
				renderLantern(player, dt, LANTERN_RADIUS);

				if (cell && Math.sqrt((x - p2t(player.x))*(x - p2t(player.x)) + (y - p2t(player.y))*(y - p2t(player.y))) < LANTERN_RADIUS) {
					ctx.fillStyle = COLOR.GREY;
					ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
				}
			}
		}
	}
}

function getOrCreateImage(id, src){
	var image = document.getElementById(id);

	if(image)
		return image;
	
	var container = document.getElementById("hiddenDiv");
	var imageCreated = document.createElement('img');
	imageCreated.id = id;
	imageCreated.src = src;
	container.appendChild(imageCreated);
	return imageCreated;
}

function refreshPlayerLastMovement(){
	if(player.right && !player.left){
		playerLastMovement = PlayerFacing.RIGHT;
	}
	else if(!player.right && player.left){
		playerLastMovement = PlayerFacing.LEFT;
	}
}

function renderLantern(entity, dt, radius){
	ctx.beginPath();
	ctx.arc(entity.x + (entity.dx * dt), entity.y + (entity.dy * dt), radius * TILE, 0, 2 * Math.PI);
	ctx.strokeStyle = "yellow";
	ctx.stroke();
}

function renderPlayer(ctx, dt) {
	ctx.fillStyle = COLOR.GREY;

	refreshPlayerLastMovement();

	switch(playerLastMovement){
		case PlayerFacing.RIGHT:
			var img = getOrCreateImage("playerRight", PLAYER_RIGHT_IMG);
			break;
		case PlayerFacing.LEFT:
			var img = getOrCreateImage("playerLeft", PLAYER_LEFT_IMG);
			break;
		default:
			var img = getOrCreateImage("playerRight", PLAYER_RIGHT_IMG);
	}
	
  	ctx.drawImage(img, player.x + (player.dx * dt), player.y + (player.dy * dt), TILE, TILE);

	var n, max;

	// ctx.fillStyle = COLOR.GOLD;
	// for(n = 0, max = player.collected ; n < max ; n++)
	// 	ctx.drawImage(img, player.x + (player.dx * dt), player.y + (player.dy * dt), TILE, TILE);

	// ctx.fillStyle = COLOR.SLATE;
	// for(n = 0, max = player.killed ; n < max ; n++)
	// 	ctx.drawImage(img, player.x + (player.dx * dt), player.y + (player.dy * dt), TILE, TILE);
}

function renderMonsters(ctx, dt) {
	//ctx.fillStyle = COLOR.SLATE;
	var n, max, monster;
	for(n = 0, max = monsters.length ; n < max ; n++) {
		monster = monsters[n];
		if (!monster.dead)
			ctx.drawImage(getOrCreateImage("trap"+n, TRAP_IMG), monster.x + (monster.dx * dt), monster.y + (monster.dy * dt), TILE, TILE);
	}
}

function renderTraps(ctx, dt) {
	//ctx.fillStyle = COLOR.SLATE;
	var n, max, trap;
	for(n = 0, max = traps.length ; n < max ; n++) {
		trap = traps[n];
		ctx.drawImage(getOrCreateImage("trap"+n, TRAP_IMG), trap.x + (trap.dx * dt), trap.y + (trap.dy * dt), TILE, TILE);
	}
}

function renderTreasure(ctx, frame) {
	//ctx.fillStyle   = COLOR.GOLD;
	ctx.globalAlpha = 0.25 + tweenTreasure(frame, 240);
	var n, max, t;
	for(n = 0, max = treasure.length ; n < max ; n++) {
		t = treasure[n];
		if (!t.collected){
			//ctx.fillRect(t.x, t.y + TILE/3, TILE, TILE*2/3);
			ctx.drawImage(getOrCreateImage("switch", SWITCH_IMG), t.x, t.y + TILE/3, TILE, TILE*2/3);
		}
	}
	ctx.globalAlpha = 1;
}

function tweenTreasure(frame, duration) {
	var half  = duration/2
			pulse = frame%duration;
	return pulse < half ? (pulse/half) : 1-(pulse-half)/half;
}
		
