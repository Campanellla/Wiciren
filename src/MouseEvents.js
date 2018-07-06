

//import * as BABYLON from 'babylonjs';

import {game} from './App.js';



export function onMouseMoveEvent(evt){
	
	var pickResult = this.pick(this.pointerX*game.config.canvasMultiplier, this.pointerY*game.config.canvasMultiplier);
	
	if (pickResult.hit) {
		
		var selection;
		
		var offsetx = 0;
		var offsetz = 0;
		
		var position = {x:0, y:0.05, z:0};
		
		this.itemSize = {w:1, h:1};
		
		if (game.itemConstructor.activeConstructor) {
			
			position.y = 0;
			
			game.selection.setRotation(game.itemConstructor.rotationIndex);
			
		} else {
			
			position.y = 0.1;
			
		}
	
		var x,y,z;
	
	
		if (pickResult.pickedMesh.type === 'ground' || pickResult.pickedMesh.type === 'water'){
			
			x = Math.floor(pickResult.pickedPoint.x);
			z = Math.floor(pickResult.pickedPoint.z);
			y = 0 
			
			position.x = x + offsetx;
			position.y += y;
			position.z = z + offsetz;
			
			game.selection.setPosition(position);
			if (game.itemConstructor.activeConstructor) game.itemConstructor.checkConstructor(x, z);
			
			//console.log(x + ' '+ y + ' '+z);
			
		} else if(pickResult.pickedMesh.type === 'selection'){
			
		} else if(pickResult.pickedMesh.isObject){
			
			x = Math.floor(pickResult.pickedPoint.x);
			z = Math.floor(pickResult.pickedPoint.z);
			y = 0 
			
			position.x = x + offsetx;
			position.y += y;
			position.z = z + offsetz;
			
			game.selection.setPosition(position);
			if (game.itemConstructor.activeConstructor) game.itemConstructor.checkConstructor(x, z);
			
		}else {
			position.x = -100;
			position.y = -100;
			position.z = -100;
		}
		
		if (game.itemConstructor.continuousConstruction){
			game.itemConstructor.constructActiveObject();
		}
		
		
		
	} else {
		/*
		selection.position.x = -100;
		selection.position.y = -100;
		selection.position.z = -100;
		*/
	}
}


export function onMouseClickEvent(evt) {
	
	console.log(this)
	
	var button;
	
	switch (evt.button){
		case 0: button = "left"; break;
		case 2: button = "right"; break;
	};
	
	console.time("pickResult");
	var pickResult = this.pick(this.pointerX * game.config.canvasMultiplier, this.pointerY * game.config.canvasMultiplier);
	console.timeEnd("pickResult");
	
	var impact = {position:{}};
	
	if (pickResult.hit) {
		
		if (pickResult.pickedMesh.type === 'ground' || pickResult.pickedMesh.isObject){
		
			//var box = new BABYLON.Mesh('pipe', this, null, game.abc)
			//box.type = 'pipe';
			
			
			
			var x = Math.floor(pickResult.pickedPoint.x);
			var z = Math.floor(pickResult.pickedPoint.z);
			var y = 0;
			
			console.log(x + ' ' + y + ' ' + z);
			
    		impact.position.x = pickResult.pickedPoint.x;
    		impact.position.y = pickResult.pickedPoint.y;
    		impact.position.z = pickResult.pickedPoint.z;
    		
    		//// ----- create

			var blockx = x; 
			var blocky = z;

			try{

				document.getElementById('eventtext').innerText = 'X: ' + blockx + ' Y: ' + blocky;

				console.log(game.map.getItemFromCoord(blockx, blocky))

				if (!game.map.getItemFromCoord(blockx, blocky)){
				
					game.pipelinechanged = true;

					game.itemConstructor.constructActiveObject();
					game.itemConstructor.continuousConstruction = true;
					
				} else if (game.actionSelected === 'remove' || button === "right"){
					
					game.itemConstructor.deleteObject([blockx, blocky]);
					game.hideMenu();
					
				}
				
			} catch(e){
				console.log(e)
			}
			
			//// ----- create
			
			
			
		} else {
			
		}
		
	}
	
};


export function onMouseClickReleaseEvent(evt){
	
	game.itemConstructor.continuousConstruction = false;
	
}

export function onDoubleClick(evt){
	
	console.log("onDoubleClick")
	
	var pickResult = this.pick(this.pointerX * game.config.canvasMultiplier, this.pointerY * game.config.canvasMultiplier);
	
	if (pickResult.hit) {
		
		if (pickResult.pickedMesh.type === 'ground' || pickResult.pickedMesh.isObject){
			
			game.hideMenu();
			
			if (pickResult.pickedMesh.isObject){
				if (pickResult.pickedMesh.item){
					if (pickResult.pickedMesh.item.link){
						
						var text = 	'type: ' + pickResult.pickedMesh.item.link.type + 
									', \nkey: ' + pickResult.pickedMesh.item.link.key + 
									', \npowr: ' + pickResult.pickedMesh.item.link.power +
									', \npos x:' + pickResult.pickedMesh.position.x + ' z: ' + pickResult.pickedMesh.position.z;
						
						game.drawMenu(text);
						
					}
				}
			}
		}
	}
}




