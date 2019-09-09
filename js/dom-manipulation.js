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

function printTutorial(){
	var tutorial = document.createElement('p');
	tutorial.innerHTML = "There is a blackout! Look for the fuse box and turn the lights back on<br/><br/>Use arrows to move<br/>Press Space to jump<br/>Press R to restart level<br/>Press F to use the lantern (only one use per level)";
	var title = document.querySelector('title');
	title.parentNode.insertBefore(tutorial, title);
}

function removeTutorial(){
	var tutorial = document.querySelector('p');
	tutorial.parentNode.removeChild(tutorial);
}

function credits(){
	theEnd = true;

	var canvas = document.querySelector('#canvas');
	canvas.parentNode.removeChild(canvas);

	var credits = document.createElement('h2');
	credits.setAttribute("class", "credits-titles");
	credits.innerHTML = "Developer & Game Designer";

	var names = document.createElement('h1');
	names.setAttribute("data-heading", "Alejandro Molina Salazar");
	names.setAttribute("class", "credits-names");
	names.innerHTML = "Alejandro Molina Salazar";

	var title = document.querySelector('title');
	title.parentNode.insertBefore(names, title);
	title.parentNode.insertBefore(credits, names);

	setTimeout(function(){ 
		credits.innerHTML = "Game Artist";
		names.setAttribute("data-heading", "Beatriz Iañez Bustamante");
		names.innerHTML = "Beatriz Iañez Bustamante";

		clickSound.play();
		setTimeout(function(){ 
			names.setAttribute("data-heading", "The End");
			names.innerHTML = "The End";
			credits.parentNode.removeChild(credits);

			clickSound.play();
			setTimeout(function(){ 
				names.parentNode.removeChild(names);
				lightsSound.play(); 
			}, CREDITS_TIME);
		}, CREDITS_TIME);
	}, CREDITS_TIME);
}