import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as BABYLON from 'babylonjs';

import {game} from './App.js';

import {ItemConstructor} from './ItemConstructor.js';
import Pipelines from './Pipelines.js';
import ItemMenu from './ReactComponents/ItemMenu.js';
import Connection from './Connection.js';

import ElectricalGrids from './ElectricalGrids.js';

export class GameWorkspace {
	
	constructor(){
		
		this.timestamp1 = 0;
		this.timestamp2 = 0;
		
		this.map = undefined;
		
		this.constructionsList = [];
		
		this.pipelines = new Pipelines();
		this.electricalGrids = new ElectricalGrids();
		
		this.updatePipelines = false;
		
		
		this.itemConstructor = new ItemConstructor();
		
		this.interfaceComponent = React.createRef(); 
		
		this.componentsNeedUpdate = [];
		
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
		
		this.blockSelection = (bool) => {
			document.onselectstart = function(){return bool}
		};
		
		this.class = {
			Connection:Connection
		}
		
		
	}
	
	
	drawMenu(item){
		
		if (!this.interfaceComponent.current || !this.interfaceComponent.current.windowContainerComponent.current){
			console.log("%cerror component not defined","color:red");
			return false;
		}
		if (!item) {
			console.log("%cerror item not defined","color:red");
			return false;
		}
		
		this.interfaceComponent.current.windowContainerComponent.current.appendWindow(item);
		return true;
		
	}
	
	
	cmax(e){
		e.preventDefault();
		console.log(this);
	}
	
	
	save(items){
	
		var objects = [];
		
		items.forEach((item)=>{
			if (item && item.save) objects.push(item.save());
		});
	
		let saveObject = {
			objects:objects, 
			camera:{	
				position: this.camera.position, 
				rotation: this.camera.rotation
			}
		};
	
		var result;
	
		try{
			result = JSON.stringify(saveObject);
		} catch(e){
			console.log(e, saveObject);
		}
		
		return result;
	}
	
	
	load(data){

		game.map.clearObjects();
		
		if (!data) return false;
		
		if (data.objects){
			data.objects.forEach((object)=>{
				if (object !== "undefined"){
					game.itemConstructor.loadObject(object);
				}
			});
		}
		
		if (data.camera){
			let d = data.camera;
			let g = game.camera;
			[g.position.x, g.position.y, g.position.z] = [d.position.x, d.position.y, d.position.z];
			[g.rotation.x, g.rotation.y, g.rotation.z] = [d.rotation.x, d.rotation.y, d.rotation.z];
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
