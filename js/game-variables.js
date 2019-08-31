var fps      = 60,
    step     = 1/fps,
    canvas   = document.getElementById('canvas'),
    ctx      = canvas.getContext('2d'),
    width    = canvas.width  = MAP.tw * TILE,
    height   = canvas.height = MAP.th * TILE,
    player   = {},
    monsters = [],
    treasure = [],
    traps = [],
    cells    = [],
    Level    = 1,
    mapTransparency = 1,
    lightsBlinking = true,
    TutorialPrinted = false,
    TutorialRemoved = false,
    FrameCalled = false,
    LightsTimeout,
    LevelDataLoaded = false,
    LevelDoc,
    footStepsSound = new Audio('./assets/foot-steps.mp3');

function restartLevel() {
    fps      = 60;
    step     = 1/fps;
    ctx      = canvas.getContext('2d');
    width    = canvas.width  = MAP.tw * TILE;
    height   = canvas.height = MAP.th * TILE;
    player   = {};
    monsters = [];
    traps = [];
    treasure = [];
    cells    = [];
    mapTransparency = 1;
    lightsBlinking = true,
    FrameCalled = true;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
