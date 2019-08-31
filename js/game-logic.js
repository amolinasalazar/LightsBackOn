

(function() {

	// -- POLYFILLS --
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
																	 window.mozRequestAnimationFrame    || 
																	 window.oRequestAnimationFrame      || 
																	 window.msRequestAnimationFrame     || 
																	 function(callback) {
																		 window.setTimeout(callback, 1000 / 60);
																	 }
	}
	
	// -- UPDATE LOOP --
	function onkey(ev, key, down) {
		switch(key) {
			case KEY.LEFT:  player.left  = down; ev.preventDefault(); return false;
			case KEY.RIGHT: player.right = down; ev.preventDefault(); return false;
			case KEY.SPACE: player.jump  = down; ev.preventDefault(); return false;
			case KEY.R: restartLevel(); loadLevel(); ev.preventDefault(); return false;
		}
	}
	
	function update(dt) {
		updatePlayer(dt);
		updateMonsters(dt);
		updateTraps(dt);
		checkTreasure();
	}

	function updatePlayer(dt) {
		updateEntity(player, dt);
	}

	function updateMonsters(dt) {
		var n, max;
		for(n = 0, max = monsters.length ; n < max ; n++)
			updateMonster(monsters[n], dt);
	}

	function updateTraps(dt) {
		var n, max;
		for(n = 0, max = traps.length ; n < max ; n++)
			updateTrap(traps[n], dt);
	}

	function updateTrap(trap, dt) {
		updateEntity(trap, dt);
		if (overlap(player.x, player.y, TILE, TILE, trap.x, trap.y, TILE, TILE)) {
			if ((player.dy > 0) && (trap.y - player.y > TILE/2))
				killPlayer(player);
			else
				killPlayer(player);
		}
	}

	function updateMonster(monster, dt) {
		if (!monster.dead) {
			updateEntity(monster, dt);
			if (overlap(player.x, player.y, TILE, TILE, monster.x, monster.y, TILE, TILE)) {
				if ((player.dy > 0) && (monster.y - player.y > TILE/2))
					killMonster(monster);
				else
					killPlayer(player);
			}
		}
	}

	function checkTreasure() {
		var n, max, t;
		for(n = 0, max = treasure.length ; n < max ; n++) {
			t = treasure[n];
			if (!t.collected && overlap(player.x, player.y, TILE, TILE, t.x, t.y, TILE, TILE))
				collectTreasure(t);
		}
	}

	function killMonster(monster) {
		player.killed++;
		monster.dead = true;
	}

	function killPlayer(player) {
		player.x = player.start.x;
		player.y = player.start.y;
		player.dx = player.dy = 0;
	}

	function collectTreasure(t) {
		player.collected++;
		t.collected = true;
		Level++;
		LevelDataLoaded = false;
		loadLevel();
	}

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

		if (entity.player && !entity.jumping && (wasLeft || wasRight) && entity.dx != -16){
				footStepsSound.play();
		}
		else{
			footStepsSound.pause();
			footStepsSound.currentTime = 0;
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

		if (entity.monster) {
			if (entity.left && (cell || !celldown)) {
				entity.left = false;
				entity.right = true;
			}      
			else if (entity.right && (cellright || !celldiag)) {
				entity.right = false;
				entity.left  = true;
			}
		}
	
		entity.falling = ! (celldown || (nx && celldiag));

		// die for falling
		if(entity.y > width)
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

		// dividir en dos, solo llamar al setup pero no volver a cargar lkos datos con una llamada Get
		var data    = LevelDoc.getElementsByTagName("map")[0].getElementsByTagName("layer")[0].getElementsByTagName("data")[0].childNodes[0].nodeValue,
				objects = LevelDoc.getElementsByTagName("map")[0].getElementsByTagName("objectgroup")[0].getElementsByTagName("object"),
				n, obj, entity;

		for(n = 0 ; n < objects.length ; n++) {
			obj = objects[n];
			entity = setupEntity(obj);
			switch(obj.getAttribute("type")) {
			case "player"   : player = entity; break;
			case "monster"  : monsters.push(entity); break;
			case "treasure" : treasure.push(entity); break;
			case "trap" : traps.push(entity); break;
			}
		}

		cells = data.split(',').map(x => parseInt(x));
	}

	function setupEntity(obj) {
		var entity = {};
		entity.x        = parseInt(obj.getAttribute("x"));
		entity.y        = parseInt(obj.getAttribute("y"));
		entity.dx       = 0;
		entity.dy       = 0;
		//entity.gravity  = METER * (obj.properties.gravity || GRAVITY);
		//entity.maxdx    = METER * (obj.properties.maxdx   || MAXDX);
		//entity.maxdy    = METER * (obj.properties.maxdy   || MAXDY);
		//entity.impulse  = METER * (obj.properties.impulse || IMPULSE);
		//entity.accel    = entity.maxdx / (obj.properties.accel    || ACCEL);
		//entity.friction = entity.maxdx / (obj.properties.friction || FRICTION);
		entity.gravity  = METER * (GRAVITY);
		entity.maxdx    = METER * (MAXDX);
		entity.maxdy    = METER * (MAXDY);
		entity.impulse  = METER * (IMPULSE);
		entity.accel    = entity.maxdx / (ACCEL);
		entity.friction = entity.maxdx / (FRICTION);
		var type = obj.getAttribute("type");
		entity.monster  = type == "monster";
		entity.trap  = type == "trap";
		entity.player   = type == "player";
		entity.treasure = type == "treasure";
		//entity.left     = obj.properties.left;
		//entity.right    = obj.properties.right;
		entity.start    = { x: entity.x, y: entity.y }
		entity.killed = entity.collected = 0;
		return entity;
	}

	// -- GAME LOOP --
	
	var counter = 0, dt = 0, now,
			last = timestamp();
	
	function frame() {
		now = timestamp();
		dt = dt + Math.min(1, (now - last) / 1000);
		while(dt > step) {
			dt = dt - step;
			update(step);
		}
		render(ctx, counter, dt, width, height, mapTransparency, MAP);
		last = now;
		counter++;
		requestAnimationFrame(frame, canvas);
	}
	
	document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
	document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);
	footStepsSound.play();

	loadLevel();

	function loadLevel(){
		if(Level == 1 && !TutorialPrinted){
			printTutorial();
			TutorialPrinted = true;
		}
		
		if(Level == 2 && !TutorialRemoved){
			removeTutorial();
			TutorialRemoved = true
		}

		mapTransparency = 1;
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

		LightsTimeout = setTimeout(function(){ lightsBlinking = false; mapTransparency = 0; }, TIME_SWITCH_LIGHTS_OFF);
	}

	function printTutorial(){
		var tutorial = document.createElement('p');
		tutorial.innerHTML = "Use arrows to move <br/> Press Space to jump <br/> Press R to restart level";
		var title = document.querySelector('title');
		title.parentNode.insertBefore(tutorial, title);
	}

	function removeTutorial(){
		var tutorial = document.querySelector('p');
		tutorial.parentNode.removeChild(tutorial);
	}

})();

