// -- UPDATE LOOP --
function onkey(ev, key, down) {
	if(!TheEnd){
		switch(key) {
			case KEY.LEFT:  Player.left  = down; ev.preventDefault(); return false;
			case KEY.RIGHT: Player.right = down; ev.preventDefault(); return false;
			case KEY.SPACE: Player.jump  = down; ev.preventDefault(); return false;
			case KEY.R: restartLevel(); loadLevel(); ev.preventDefault(); return false;
			case KEY.F: 
				if(!LanternUsed){
					setTimeout(function(){ 
						LanternActive = false;
						LanternUsed = true;
					}, TIME_SWITCH_LIGHTS_OFF); LanternActive = true; 
				}
				return false;
		}
	}
}

// update every element on the canvas
function update(dt) {
	updatePlayer(dt);
	updateTraps(dt);
	checkTreasure();
}

function updatePlayer(dt) {
	updateEntity(Player, dt);
}

function updateTraps(dt) {
	var n, max;
	for(n = 0, max = Traps.length ; n < max ; n++)
		updateTrap(Traps[n], dt);
}

function updateTrap(trap, dt) {
	updateEntity(trap, dt);
	if (overlap(Player.x, Player.y, TILE, TILE, trap.x, trap.y, TILE, TILE)) {
		killPlayer(Player);
	}
}

function checkTreasure() {
	var n, max, t;
	for(n = 0, max = Treasure.length ; n < max ; n++) {
		t = Treasure[n];
		if (!TreasureCatched && overlap(Player.x, Player.y, TILE, TILE, t.x, t.y, TILE, TILE)){
			collectTreasure(t);
			ClickSound.play();
		}
	}
}

function killPlayer(Player) {
	Player.x = Player.start.x;
	Player.y = Player.start.y;
	Player.dx = Player.dy = 0;
	restartLevel();
	loadLevel();
}

function collectTreasure(t) {
	TreasureCatched = true;
	Level++;
	LevelDataLoaded = false;
	loadLevel();
}

// controls movement, physics and collisions
function updateEntity(entity, dt) {
	var wasLeft    = entity.dx  < 0,
		wasRight   = entity.dx  > 0,
		falling    = entity.falling,
		friction   = entity.friction * (falling ? 0.5 : 1),
		accel      = entity.accel    * (falling ? 0.5 : 1);

	entity.ddx = 0;
	entity.ddy = entity.gravity;

	if (entity.left)
		entity.ddx = entity.ddx - accel;
	else if (wasLeft)
		entity.ddx = entity.ddx + friction;

	if (entity.right)
		entity.ddx = entity.ddx + accel;
	else if (wasRight)
		entity.ddx = entity.ddx - friction;

	if (entity.jump && !entity.jumping && !falling) {
		entity.ddy = entity.ddy - entity.impulse; // an instant big force impulse
		entity.jumping = true;
	}

	// play footsteps when player is moving
	if (entity.player && !entity.jumping && (wasLeft || wasRight) && entity.dx != -16){
			FootStepsSound.play();
	}
	else if(entity.player){
		FootStepsSound.pause();
		FootStepsSound.currentTime = 0;
	}

	entity.x  = entity.x  + (dt * entity.dx);
	entity.y  = entity.y  + (dt * entity.dy);
	entity.dx = bound(entity.dx + (dt * entity.ddx), -entity.maxdx, entity.maxdx);
	entity.dy = bound(entity.dy + (dt * entity.ddy), -entity.maxdy, entity.maxdy);

	if ((wasLeft  && (entity.dx > 0)) ||
			(wasRight && (entity.dx < 0))) {
		entity.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
	}

	var tx        = p2t(entity.x),
			ty        = p2t(entity.y),
			nx        = entity.x%TILE,
			ny        = entity.y%TILE,
			cell      = tcell(tx,     ty),
			cellright = tcell(tx + 1, ty),
			celldown  = tcell(tx,     ty + 1),
			celldiag  = tcell(tx + 1, ty + 1);

	if (entity.dy > 0) {
		if ((celldown && !cell) ||
				(celldiag && !cellright && nx)) {
			entity.y = t2p(ty);
			entity.dy = 0;
			entity.falling = false;
			entity.jumping = false;
			ny = 0;
		}
	}
	else if (entity.dy < 0) {
		if ((cell      && !celldown) ||
				(cellright && !celldiag && nx)) {
			entity.y = t2p(ty + 1);
			entity.dy = 0;
			cell      = celldown;
			cellright = celldiag;
			ny        = 0;
		}
	}

	if (entity.dx > 0) {
		if ((cellright && !cell) ||
				(celldiag  && !celldown && ny)) {
			entity.x = t2p(tx);
			entity.dx = 0;
		}
	}
	else if (entity.dx < 0) {
		if ((cell     && !cellright) ||
				(celldown && !celldiag && ny)) {
			entity.x = t2p(tx + 1);
			entity.dx = 0;
		}
	}

	entity.falling = ! (celldown || (nx && celldiag));

	// die for falling
	if(entity.y > Width)
		killPlayer(entity);
}

// -- MAP LOAD --
function setup(map) {
	if (window.DOMParser) {
		// code for modern browsers
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(map,"text/xml");
	} else {
		// code for old IE browsers
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = false;
		xmlDoc.loadXML(map); 
	}

	LevelDoc = xmlDoc;
	LevelDataLoaded = true;
	loadData(LevelDoc);
}

function loadData(LevelDoc){
	restartLevel();

	var data = LevelDoc.getElementsByTagName("map")[0]
			.getElementsByTagName("data")[0].childNodes[0].nodeValue,
		objects = LevelDoc.getElementsByTagName("map")[0].getElementsByTagName("objectgroup")[0]
			.getElementsByTagName("object"),
		n, obj, entity;

	for(n = 0 ; n < objects.length ; n++) {
		obj = objects[n];
		entity = setupEntity(obj);
		switch(obj.getAttribute("type")) {
			case "player"   : Player = entity; break;
			case "treasure" : Treasure.push(entity); break;
			case "trap" : Traps.push(entity); break;
		}
	}

	Cells = data.split(',').map(x => parseInt(x));
}

function setupEntity(obj) {
	var entity = {};
	entity.x        = parseInt(obj.getAttribute("x"));
	entity.y        = parseInt(obj.getAttribute("y"));
	entity.dx       = 0;
	entity.dy       = 0;
	entity.gravity  = METER * (GRAVITY);
	entity.maxdx    = METER * (MAXDX);
	entity.maxdy    = METER * (MAXDY);
	entity.impulse  = METER * (IMPULSE);
	entity.accel    = entity.maxdx / (ACCEL);
	entity.friction = entity.maxdx / (FRICTION);
	var type 		= obj.getAttribute("type");
	entity.trap  	= type == "trap";
	entity.player   = type == "player";
	entity.treasure = type == "treasure";
	entity.start    = { x: entity.x, y: entity.y }
	return entity;
}

// -- GAME LOOP --
var counter = 0,
	dt = 0, now,
	last = timestamp();

// if frame has past, update all entities
function frame() {
	now = timestamp();
	dt = dt + Math.min(1, (now - last) / 1000);
	while(dt > STEP) {
		dt = dt - STEP;
		update(STEP);
	}
	render(ctx, counter, dt, Width, Height, MapTransparency, MAP);
	last = now;
	counter++;
	requestAnimationFrame(frame, Canvas);
}

// controls data load and call frame method to refresh the canvas
function loadLevel(){
	if(Level > LEVEL_MAX)
		credits();
	else{
		document.getElementsByTagName("body")[0].style.background = COLOR.LIGHTS_ON;
		LanternUsed = true;

		if(Level == 2 && !TutorialRemoved){
			removeTutorial();
			TutorialRemoved = true
		}

		MapTransparency = 1;
		if(!LevelDataLoaded){
			get(`levelsData/level${Level}.xml`, function(req) {
				setup(req.responseText);
			});
		}
		else{
			loadData(LevelDoc);
		}

		if(!FrameCalled){
			frame();
			FrameCalled = true;
		}
		
		if(LightsTimeout)
			clearTimeout(LightsTimeout);

		LightsTimeout = setTimeout(function(){ 
			if(Level == 1 && !TutorialPrinted){
				printTutorial();
				TutorialPrinted = true;
			}
			LanternUsed = false;
			MapTransparency = 0; 
			LightsSound.play(); 
			document.getElementsByTagName("body")[0].style.background = COLOR.LIGHTS_OFF; 
		}, TIME_SWITCH_LIGHTS_OFF);
	}
}