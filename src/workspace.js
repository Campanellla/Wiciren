import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {game} from './App.js';

import * as BABYLON from 'babylonjs';

import {ItemConstructor} from './ItemConstructor.js';


export class GameWorkspace {
	
	constructor(){
		
		this.blockSelection = blockSelection;
		this.unBlockSelection = unBlockSelection;
		
		this.timestamp1 = 0;
		this.timestamp2 = 0;
		
		this.map = undefined;
		
		this.blocklist = [];
		this.objectlist = [];
		this.blocklength = 25;
		this.objectRenderList = [];
		this.pipelist = [];
		this.pipeconn = [];
		this.keynum = 1;
		
		this.itemMenuDrawn = false;
		
		this.itemConstructor = new ItemConstructor();
		
		this.config = {
			
			wheelSensubility:0.04,
			keyboardSensibility:0.25,
			
			keyboardProgressiveSensibility:true,
			keyboardProgressiveSensibilityMultiplier:0.01,
			
			canvasMultiplier:1
			
		};

		this.materials = {};
		
		this.TAU = Math.PI / 2;
		this.PI2 = Math.PI * 2;
		this.PI  = Math.PI;
		
	}
	
	drawMenu(text){
		
		var itemMenu = document.getElementById("ItemMenu");
		var itemMenuText = document.getElementById("ItemMenuText");
		itemMenuText.innerText = text;
		itemMenu.hidden = false;
		this.itemMenuDrawn = true;
		
	}
	
	hideMenu(){
		var itemMenu = document.getElementById("ItemMenu");
		itemMenu.hidden = true;
		this.itemMenuDrawn = false;
	}
	
	
	cmax(e){
		e.preventDefault();
		console.log(this);
	}
	
}










export function blockSelection(){
	
	document.onselectstart = function(){return false}
	
}

export function unBlockSelection(){
	
	document.onselectstart = function(){return true}
	
}


export function save(items){
	
	var retstring = '';
	
	for(var i = 0; i < items.length; i++){
		
		var string = '';
		
		var a = [];
		var ai = 0;
		
		if (items[i].link === undefined){
			
		} else {
			var b = items[i].link.save()
			a[ai++] = b;
		
			var aa = a.join();
			string += '{'+aa+'}';
			
			retstring += '' + string + ',';
		};

	}
	
	let scr = {camera: {position: game.camera.position, rotation: game.camera.rotation}};
	
	return '[' + retstring + JSON.stringify(scr) + ']';
}


export function load(data){

	game.map.objectlist = [];
	game.pipelinechanged = true;

	if(data !== null || data !== undefined){
		
		/*
		for(var i = 0; i < data.length; i++){
			for(var ii = 0; ii < data[i].length; ii++){
				//game.blocklist[i][ii] = new blockObject({surface:data[i][ii].surface});
			}
		}
		*/
		
		for(var i = 0; i < data.length; i++){
			
			if (data[i].object){
				
				if (data[i].object !== "undefined"){
				
					game.itemConstructor.loadObject(data[i].object);
				
				}
			} else if (data[i].camera){
				
				if (data[i].camera !== "undefined"){
					
					game.camera.position.x = data[i].camera.position.x;
					game.camera.position.y = data[i].camera.position.y;
					game.camera.position.z = data[i].camera.position.z;
					
					game.camera.rotation.x = data[i].camera.rotation.x;
					game.camera.rotation.y = data[i].camera.rotation.y;
					game.camera.rotation.z = data[i].camera.rotation.z;
					
				}
			}
		}
	}
}


export function setCanvasSize(canvas, w, h, r, m){
	
	if (r){
		
		if (m){
			var pixelRatio = m;
		} else {
			pixelRatio = window.devicePixelRatio;
		}
		
		canvas.style.width  =  w / pixelRatio + 'px';
   		canvas.style.height =  h / pixelRatio + 'px'; 
		
	} else {
		
		canvas.style.width  = w + 'px';
   		canvas.style.height = h + 'px';
   		
   	}
}


/* 
draw axis x/y/z

args: size in units, scene
return:null
*/

export function showAxis(size, scene) {
    	var makeTextPlane = function(text, color, size) {
    		var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
    		dynamicTexture.hasAlpha = true;
    		dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
    		var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
    		plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
    		plane.material.backFaceCulling = false;
    		plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
    		plane.material.diffuseTexture = dynamicTexture;
    		return plane;
     	};
  
    	var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
      		new BABYLON.Vector3.Zero(),
      		new BABYLON.Vector3(size, 0, 0), 
      		new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
      		new BABYLON.Vector3(size, 0, 0), 
      		new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      	], scene);
      	
    	axisX.color = new BABYLON.Color3(1, 0, 0);
    	var xChar = makeTextPlane("X", "red", size / 10);
    	xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    	
    	var axisY = BABYLON.Mesh.CreateLines("axisY", [
        	new BABYLON.Vector3.Zero(), 
        	new BABYLON.Vector3(0, size, 0), 
        	new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
        	new BABYLON.Vector3(0, size, 0), 
        	new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
        ], scene);
        
    	axisY.color = new BABYLON.Color3(0, 1, 0);
    	var yChar = makeTextPlane("Y", "green", size / 10);
    	yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    	
    	var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        	new BABYLON.Vector3.Zero(), 
        	new BABYLON.Vector3(0, 0, size), 
        	new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        	new BABYLON.Vector3(0, 0, size), 
        	new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
        ], scene);
        
    	axisZ.color = new BABYLON.Color3(0, 0, 1);
    	var zChar = makeTextPlane("Z", "blue", size / 10);
    	zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};