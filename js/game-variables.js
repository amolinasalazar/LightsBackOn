var fps      = 60,
    step     = 1/fps,
    canvas   = document.getElementById('canvas'),
    ctx      = canvas.getContext('2d'),
    width    = canvas.width  = MAP.tw * TILE,
    height   = canvas.height = MAP.th * TILE,
    player   = {},
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
    lanternActive = false,
    lanternUsed = false,
    theEnd = false,
    treasureCatched = false,
    footStepsSound = new Audio('./assets/foot-steps.mp3'),
    clickSound = new Audio('./assets/click.mp3'),
    lightsSound = new Audio('./assets/lights-sound.mp3');

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
    lightsBlinking = true,
    FrameCalled = true,
    treasureCatched = false,
    lanternActive = false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
