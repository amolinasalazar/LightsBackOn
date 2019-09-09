var Canvas   = document.getElementById('canvas'),
	ctx      = Canvas.getContext('2d'),
	Width    = Canvas.width  = MAP.tw * TILE,
	Height   = Canvas.height = MAP.th * TILE,
	Player   = {},
	Treasure = [],	// fuse box
	Traps = [],
	Cells    = [],
	Level    = 1,
	MapTransparency = 1,	// used to hide the map when lights are off
	TutorialPrinted = false,
	TutorialRemoved = false,
	FrameCalled = false,
	LightsTimeout,	// used to clear timeout when the level is reset before lights go off
	LevelDataLoaded = false,
	LevelDoc,	// XML file with all the level data
	LanternActive = false,
	LanternUsed = false,
	TheEnd = false,
	TreasureCatched = false,
	FootStepsSound = new Audio('./assets/foot-steps.mp3'),
	ClickSound = new Audio('./assets/click.mp3'),
	LightsSound = new Audio('./assets/lights-sound.mp3');

// reset some global variables when level is reset
function restartLevel() {
	Player   = {};
	Traps = [];
	Treasure = [];
	Cells    = [];
	MapTransparency = 1;
	FrameCalled = true,
	TreasureCatched = false,
	LanternActive = false;

	ctx.clearRect(0, 0, Canvas.width, Canvas.height);
}
