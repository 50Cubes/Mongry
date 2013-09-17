function navigateRooms(num){
	currentRoom = num;
	var i = 0;
	var randInt;
	var door;
	var doors = [];
	while(i < num){
		for(keys in levelManager.rooms[currentRoom].doors){
			doors.push(keys);
		}
		randInt = ~~(Math.random() * doors.length);
		if(randInt == 0){ randInt = 1; }
		var nextRoom = doors[randInt];
		door = levelManager.rooms[currentRoom].doors[nextRoom];
		drawRoom(levelManager.navigate({'index' : nextRoom, 'doorParent' : currentRoom}))
		console.log("i: " + i);
		console.log(currentRoom);
		i += 1;
		doorCount = 0;
		doors = [];
	}
	
} 

var floorTextIndex = 0;
var floorTexts = [
"Welcome to Darcwiston’s Prison for Criminally Insane Monsters. * The only remaining monster in this abandoned building is chained up, but not for long! Once he gets hungry enough he will break free and gobble you up. * Collect as many spiders and rats as you can before the time runs out and bring them back to the golden door.  White doors help you find your way back.  Be mindful of the storm outside – when startled you will drop all the creatures you've collected. * Quick – go find some tasty critters and bring them back to keep the monster fed.", 
"Welcome to Darcwiston’s Prison for Criminally Insane Monsters. * Collect more spiders and rats and bring them back to the golden door before the monster is Hungry again! * White doors help you find your way back.  Be mindful of the storm outside – when startled you will drop all the creatures you've collected. * BUT WAIT.. EVERYTHING HAS CHANGED?!"

];

function drawFloor(room){
	var img = new Image();
    img.src = room.floorURL;
    floorcanvas.attr({
    	'width': room.roomWidth,// + (2*room.wallDepth),
    	'height': room.roomHeight// + (2*room.wallDepth)
    })
    img.onload = function() {
	        var ctx = floorcanvas[0].getContext('2d');
   		for(var i = 0; i< room.roomWidth; i += img.width){
   			for(var j = 0; j< room.roomHeight; j += img.height){
					 ctx.drawImage(img, i, j);
   			}
   		}  
		drawWalls(levelManager.rooms[currentRoom]); 

		if(room.id==0){
   		// var ctx = floorcanvas[0].getContext('2d');
   		ctx.save();
   		ctx.restore();
   		drawFloorText(floorTextIndex, ctx, room);
   	}
   	}
   	
} 

function drawFloorText(ftIndex, ctx, room){
	ftIndex = Math.min(ftIndex, floorTexts.length -1);
	var theText = floorTexts[ftIndex];

	// var ctx = floorcanvas[0].getContext('2d')
	ctx.fillStyle = "#FBFE72";
  	ctx.font = "bold 24px Times New Roman";
  	var textX = (room.roomWidth - DEFAULTS.roomTextMaxWidth) /2;
  	wrapText(ctx, theText, textX, DEFAULTS.roomTextY, DEFAULTS.roomTextMaxWidth, 20);
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(" ");
        var line = "";
        for(var n = 0; n < words.length; n++) {
        	//lineBreak on "*"
        	if(words[n] == "*"){
        		context.fillText(line, x, y);
				// context.save();
        		line = "";
	            y += lineHeight*2;
        	} else {

	          var testLine = line + words[n] + " ";
	          var metrics = context.measureText(testLine);
	          var testWidth = metrics.width;
	          if(testWidth > maxWidth) {
	            context.fillText(line, x, y);
				// context.save();
	            line = words[n] + " ";
	            y += lineHeight;
	          }
	          else {
	            line = testLine;
	          }
	      }
        }
        context.fillText(line, x, y);
        context.save();
        context.restore();
}



function drawWalls(room){
	var wall = new Image();
	wall.src = room.walls.wall.url;
	var corner = new Image();
	corner.src = room.walls.corner.url;

    wall.onload = function() {
	        var ctx = floorcanvas[0].getContext('2d')
	        for(var i = 0; i< room.roomWidth; i+= wall.width){
	        	for(var j = 0; j< room.roomHeight; j+= wall.height){
	        		if(i ==0){

	 					ctx.drawImage(wall, i, j);
   
					}else if (j==0){
						ctx.save();
						ctx.translate(i,j);
						ctx.rotate(3.14/2);   
	 					ctx.drawImage(wall, 0, 0);
	       			    ctx.restore();
	        		}
	        	}
	        }
	        for(var j = 0; j < room.roomHeight; j += wall.height){
	        	ctx.drawImage(wall, (room.roomWidth - wall.width), j);
	        }
	        for(var i = 0; i < room.roomWidth; i += wall.width){
	        	ctx.save();
				ctx.translate(i,room.roomHeight-wall.height);
				ctx.rotate(3.14/2);
				ctx.drawImage(wall, 0, 0);
		       	ctx.restore();  
	        }
			var rot = 0; 
			var x = 0;
			var y = 0;
	 
			for(key in room.doors){  
				switch(room.doors[key].direction){
				case 'north':
				 	rot = 0; 
					x = -50;
					y = -30;
				break;
				case 'south':
				 	rot = 3.14; 
					x = -150;
					y = -50;				
				break;
				case 'east':
			 	rot = 1.57; 
				x = -50;
				y = -50;    		
				break;
				case 'west':
				 	rot = 4.71; 
					x = -150;
					y = -30;	    		
				break;	
				}
				
				ctx.save();
				ctx.translate(room.doors[key].x, room.doors[key].y);
				ctx.rotate(rot);
				ctx.scale(0.7, 0.7);
				if(room.doors[key].doorParent == '-1'){
					ctx.drawImage(golddoor,  x, y);
				}else{
					ctx.drawImage(room.doors[key].image,  x, y)
				}
				
				ctx.restore();
			}
   	}
}