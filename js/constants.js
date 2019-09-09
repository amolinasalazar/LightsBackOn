var MAP 	= { tw: 64, th: 24 },
	TILE 	= 32,
	METER 	= TILE,
	GRAVITY = 9.8 * 6,
	MAXDX 	= 10,		// max horizontal speed (10 tiles per second)
	MAXDY 	= 60,		// max vertical speed   (60 tiles per second)
	ACCEL 	= 1/2,		// take 1/2 second to reach maxdx (horizontal acceleration)
	FRICTION = 1/6,		// take 1/6 second to stop from maxdx (horizontal friction)
	IMPULSE = 1500,		// player jump impulse
	FPS = 60,	// frames per second
	STEP = 1/FPS,	// dt time passed to update loop
	COLOR 	= { GREY: '#333', LIGHTS_ON: 'rgb(218, 218, 218)', LIGHTS_OFF: 'rgb(24, 24, 24)' },
	KEY 	= { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, R: 82, F: 70 };
	TIME_SWITCH_LIGHTS_OFF = 3000,	// delay to switch off the lights
	CREDITS_TIME = 5000,			// delay between names during credits
	LANTERN_RADIUS = 6,				// radius of what element should be rended when lantern is on
	LEVEL_MAX = 6;					// number of levels