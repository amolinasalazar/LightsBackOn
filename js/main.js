(function() {
	// -- POLYFILLS --
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || 
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		}
	}
	
	// register input from user
	document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
	document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);
	FootStepsSound.load = true;
	
	// start update loop
	loadLevel();
})();