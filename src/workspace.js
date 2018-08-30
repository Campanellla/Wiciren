import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as BABYLON from 'babylonjs';

import {game} from './App.js';

import {ItemConstructor} from './ItemConstructor.js';
import Interface from './Interface.js';
import Pipelines from './Pipelines.js';
import ItemMenu from './ReactComponents/ItemMenu.js';
import Connection from './Connection.js';


export class GameWorkspace {
	
	constructor(){
		
		this.blockSelection = blockSelection;
		this.unBlockSelection = unBlockSelection;
		
		this.timestamp1 = 0;
		this.timestamp2 = 0;
		
		this.map = undefined;
		
		this.itemMenu = undefined;
		
		this.updatePipelines = false;
		this.pipelines = new Pipelines();
		
		
		this.itemMenuDrawn = false;
		
		this.itemConstructor = new ItemConstructor();
		
		this.interface = new Interface();
		
		this.config = {
			
			wheelSensubility:0.04,
			keyboardSensibility:0.25,
			
			keyboardProgressiveSensibility:true,
			keyboardProgressiveSensibilityMultiplier:0.01,
			
			canvasMultiplier:1.5
			
		};

		this.materials = {};
		
		this.TAU = Math.PI / 2;
		this.PI2 = Math.PI * 2;
		this.PI  = Math.PI;
		
		this.engine = undefined;
		this.canvas = undefined;
		this.map = undefined;
		
		this.nullpointer = {link:null};
		
		document.save = save.bind(this);
		document.load = load.bind(this);
		
		
		this.class = {
			
			Connection:Connection
			
		}
		
		
	}
	
	drawMenu(link){
		
		this.interface.appendFloatingMenu(link);
		
		return ;
		
		if (!link) {console.log("error", link); return}
	}
	
	updateMenu(){
		
	}
	
	hideMenu(){
		if (!this.itemMenu) return
		
		this.itemMenu.setState({hidden:true});
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
	
	var objects = [];
	
	//// save objects
	
	items.forEach((item)=>{
		
		if (item){
			
			objects.push(item.save());
			
		}
		
	});
	
	let saveObject = {
						objects:objects, 
						camera:{position: game.camera.position, rotation: game.camera.rotation}
					};
	
	var a;
	
	try{
		a = JSON.stringify(saveObject);
	} catch(e){
		
		console.log(saveObject);
		console.log(e);
		
	}
	
	
	return a
}




export function load(data){

	game.map.clearObjects();
	//game.pipelinechanged = true;

	if(data){
		if (data.objects){
			
			data.objects.forEach((object)=>{
				
				if (object !== "undefined"){
					
					game.itemConstructor.loadObject(object);
					
				}
				
			});
		}
		
		if (data.camera){
			
			game.camera.position.x = data.camera.position.x;
			game.camera.position.y = data.camera.position.y;
			game.camera.position.z = data.camera.position.z;
			
			game.camera.rotation.x = data.camera.rotation.x;
			game.camera.rotation.y = data.camera.rotation.y;
			game.camera.rotation.z = data.camera.rotation.z;
			
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
