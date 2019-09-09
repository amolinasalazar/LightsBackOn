var fps      = 60,	// frames per second
	step     = 1/fps,	// dt time passed to update loop
	canvas   = document.getElementById('canvas'),
	ctx      = canvas.getContext('2d'),
	width    = canvas.width  = MAP.tw * TILE,
	height   = canvas.height = MAP.th * TILE,
	player   = {},
	treasure = [],
	traps = [],
	cells    = [],
	Level    = 1,
	mapTransparency = 1,	// used to hide the map when lights are off
	TutorialPrinted = false,
	TutorialRemoved = false,
	FrameCalled = false,
	LightsTimeout,	// used to clear timeout when the level is reset before lights go off
	LevelDataLoaded = false,
	LevelDoc,	// XML file with all the level data
	lanternActive = false,
	lanternUsed = false,
	theEnd = false,
	treasureCatched = false,
	footStepsSound = new Audio('./assets/foot-steps.mp3'),
	clickSound = new Audio('./assets/click.mp3'),
	lightsSound = new Audio('./assets/lights-sound.mp3');

// reset some global variables when level is reset
function restartLevel() {
	fps      = 60;
	step     = 1/fps;
	ctx      = canvas.getContext('2d');
	width    = canvas.width  = MAP.tw * TILE;
	height   = canvas.height = MAP.th * TILE;
	player   = {};
	traps = [];
	treasure = [];
	cells    = [];
	mapTransparency = 1;
	FrameCalled = true,
	treasureCatched = false,
	lanternActive = false;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
