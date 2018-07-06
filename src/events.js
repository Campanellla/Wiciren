import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//import {currentMouseLocation} from './init.js';
import {game} from './App.js';

import {setCanvasSize} from './workspace.js';

//import {ConfigMenuWindow} from './ReactComponents.js';





//var actionSelected;
//var flipped = false;


export function assignEvents(game){
	
	
	game.canvas.oncontextmenu = onContextMenu;
	
	function onContextMenu(e){
		e.preventDefault();
		//console.log("contextmenu");
	}

	/// resize canvas and engine on resize 
	function onResize(){
		
		var ratio = game.config.canvasMultiplier; //window.devicePixelRatio;
		
		var size = {x:(window.innerWidth) * ratio, y:(window.innerHeight) * ratio};
		setCanvasSize(game.canvas, size.x, size.y);
		game.engine.resize();
		setCanvasSize(game.canvas, size.x, size.y, true, ratio);
		
	}
	
	window.addEventListener("resize", onResize);

	

	//ReactDOM.render(elements, document.getElementById('selectionview'));


	//var character = game.character;
	// --- keypress --- //

	document.onkeydown = function(a) {
		
		if (a.key === "Escape"){
			if (game.itemMenuDrawn){
				game.hideMenu();
			} else {
				game.configmenu.onclick();
			}
			
		}else 
		if (a.key === "ArrowUp" || a.key === "w"){
			
		} else
		if (a.key === "ArrowDown" || a.key === "s"){
			
		} else
		if (a.key === "ArrowLeft" || a.key === "a"){
			
		} else
		if (a.key === "ArrowRight" || a.key === "d"){
			
		} else 
		if (a.key === "r" ) {
			
			game.itemConstructor.rotationIndex = (game.itemConstructor.rotationIndex + 1) % 4;
			game.selection.setRotation(game.itemConstructor.rotationIndex);
			
		} else 
		if (a.key === "q") {
			game.itemConstructor.setInactiveConstructor();
		}
	}
	
	document.onkeyup = function(a) {
		if (a.key === "ArrowUp" || a.key === "w"){
			
		} else
		if (a.key === "ArrowDown" || a.key === "s"){
			
		} else
		if (a.key === "ArrowLeft" || a.key === "a"){
			
		} else
		if (a.key === "ArrowRight" || a.key === "d"){
			
		}
	}
}





