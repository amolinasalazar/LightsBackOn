# LightsBackOn
Game entry for [JS13k games](https://js13kgames.com/) competition 2019.

## The Challenge
The idea of this game jam is to develop a videogame using JavaScript/HTML/CSS languages with the main constrain of generate a .zip file with a maximum size of 13KB.

## Game Design
The main I usually do when I join a game jam is start thinking about the concept of the game I want to develop by searching all the possible meanings with the theme. This year it was: "back", and the first thing that came to my mind was: "back in time!", "backpack", ... but I always think that everybody will do games using the same topics. So I saw that phrasal verb: "back on", it can be used to turn on the lights when there is a blackout... and my light bulb started to bright!

What happen when there is a blackout in your house? it doesn't scare at all when your in a good company, you live in a small flat, you now exactly the where is the fuse box located,... but what about if you live a big house and you have to go to he basement? if you are just child with and your parents are not in home? if the only thing you have is a candle with oil for just a few seconds? stress, fear, despair, those are the feelings that I wanted to transmit to the gamers.

So, I made a plataformer with the particular main mechanic: you need to remember the map as you will play in the dark. The game has only 5 levels, but each of them is different regarding the difficulties you are going to face: maybe you need to memorize more than in other levels, you need to avoid some traps or you just have to be patient when you fall while doing a hard jump. Also, to make it more interesting, I added the option to use a candle for a few seconds so the player can see their surroundings. However, you need to think when is the best timing to use it as you can do it only once per level. 

I'm pretty much happy with the result, although there are some people that says that the game is too difficult. Maybe this game is made only for hardcore gamers, as normally when people gets a bit frustrated, they stop playing anymore :P

## Technical Development
So, I'm not a frontend expert at all, but I have some experience with JS at least. I was not thinking use good design patterns, refactor the code and, of course, making unit tests! I was working on this while I was working on real life. And, this period was not easy at all, I had a "crunch" timing doing extra hours and even, I had to travel some days to England for work. Taking into account all of these difficulties, I knew that I just had time to do a simple game with a simple structure. The only thing that I wanted to respect was to do it from scratch, not using any library. However, as a template I used the code from this blog: [Tiny Plataformer](https://codeincomplete.com/posts/tiny-platformer/) to have a foundation structure of the game logic, levels data and so on. This step was essential for me as my lack of experience building game engines.

From that point I had almost implemented all the physics for the game, but I did some changes to adapt it for my game design: 
* Creating all new levels with [Tiled](https://www.mapeditor.org/).
* Exporting levels data to XML instead of JSON files (to earn some extra space).
* Adding logic to render/stop rendering when lights go off.
* Adding image and sound assets.
* Building intro and credits with some cool tween effects for the words.
* Adding the candle element.
* Restarting level by pressing R.
* Some more minor improvements and changes.

Maybe, the most difficult part of all of this was the implementation of the candle, for that I render everything within a bubble that contains the player. That was a bit tricky, but straightforward at the end.

## Sizing everything
Everytime that I ended the day, I compressed all the files and made some predictions if I could fit more items or code. I knew that when minifying the code I'd earn some extra Bytes, but still it was hard to know when to stop adding things. At the end, I had to remove a tutorial level and some cool sounds that I introduced for the intro, but overall the game experience is the same.

## The Experience
When I started to with this project, I wasn't sure if I could finally submit something. This is my first time participating in a game jam alone and I'm not familiar with lastest HTML elements like the canvas element that I used. Even though, I genuine enjoyed every development phase and it was a rich experience for me. The feeling of other people playing your own game is always satisfying. More when they contact you just to let you now that they finally beat the game with a happy face. I will do it again and I will recommend every people to do the same.

## Credits
First of all, I want to thanks **[Beatriz Iañez Bustamante](https://www.linkedin.com/in/beatriz-i%C3%A1%C3%B1ez-bustamante-b75a2b102/)** to help with the assets of the game. She designed the main character, the fuse box and the traps that you can see thorough the levels:

![alt text](https://github.com/amolinasalazar/LightsBackOn/blob/master/assets/player-right.png "Main character")
![alt text](https://github.com/amolinasalazar/LightsBackOn/blob/master/assets/switch.png "Fuse box")
![alt text](https://github.com/amolinasalazar/LightsBackOn/blob/master/assets/trap.png "Trap")

Secondly, I really want to credit the author of Tiny Plataformer: **[@jakesgordon](https://github.com/jakesgordon)** as I mention before, I couldn't make this game without his base code and his clear explanations in his blog: **[Code InComplete](https://codeincomplete.com/)**.

And lastly, thank you for all the people that gave me his feedback and finish the game: **[@ValerioSevilla](https://github.com/ValerioSevilla)**, **[@alconesp](https://github.com/alconesp)** and many more.

Of course, everything is possible thanks to **[Andrzej Mazur](https://end3r.com/)** that organize [JS13k Games](http://js13kgames.com/) competitions every year :)

# License
[MIT License](https://en.wikipedia.org/wiki/MIT_License)

