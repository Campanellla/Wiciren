import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {game} from './App.js';

import * as BABYLON from 'babylonjs';

import {ItemConstructor} from './ItemConstructor.js';

import Interface from './Interface.js';
import Pipelines from './Pipelines.js';



class Connection {
	
	constructor(args){
		
		this.location = args.location || {x:0, z:0};
		this.size = args.size || {h:1, w:1};
		this.connLocation = args.connLocation;
		
		this.itemPointer = args.itemPointer || game.nullpointer;
		this.modelPointer = game.nullpointer;
		
		this.connectedItemPointer = game.nullpointer;
		this.connectedModelPointer = game.nullpointer;
		
		this.rlocation = this.location;
		this.rconnLocation = this.connLocation;
		this.r = -1;
		this.rotationIndex = 0;
		
	}
	
	checkRotation(){
		
		if (this.itemPointer.link === null) return false;
		
		let itemRotation = this.itemPointer.link.rotationIndex;
		let itemSize = this.itemPointer.link.itemSize;
		
		if (itemRotation === this.r) {
			
			return true;
		}
		
		if (itemRotation === 0){
			
			this.r = itemRotation;
			this.rlocation = this.location;
			this.rconnLocation = this.connLocation;
			
		} else {
			
			var offsetx = 0;
			var offsetz = 0;
			
			var offsetcx = 0;
			var offsetcz = 0;
			
			switch(itemRotation){
				
				case(1): 	offsetz = itemSize.w - 1;
				
							offsetcz = this.connLocation.x && (this.connLocation.x - itemSize.w/2) * -1 + itemSize.w/2 - 1;
							offsetcx = this.connLocation.z// && (this.connLocation.z - itemSize.h/2) + itemSize.w/2;
							
							break;
				
				case(2): 	offsetz = itemSize.h-1;
						 	offsetx = itemSize.w-1;
						 	
							offsetcz = this.connLocation.z && (this.connLocation.z - itemSize.h/2) * -1 + itemSize.h/2 - 1;
							offsetcx = this.connLocation.x && (this.connLocation.x - itemSize.w/2) * -1 + itemSize.w/2 - 1;
							
						 	break;
						 
				case(3): 	offsetx = itemSize.h-1;
							
							offsetcz = this.connLocation.x// && (this.connLocation.x - itemSize.w/2) + itemSize.h/2;
							offsetcx = this.connLocation.z && (this.connLocation.z - itemSize.h/2) * -1 + itemSize.h/2 - 1;
							
							break;
			};
			
			this.rlocation = {x:this.location.x + offsetx, z:this.location.z + offsetz};
			this.rconnLocation = {x:offsetcx, z:offsetcz};
			this.r = itemRotation;
			
		}
		
		if (this.rconnLocation.x < 0) this.rotationIndex = 0;
		if (this.rconnLocation.x > 0) this.rotationIndex = 2;
		if (this.rconnLocation.z < 0) this.rotationIndex = 3;
		if (this.rconnLocation.z > 0) this.rotationIndex = 1;
		
		return true;
	}
	
	updateLinks(){
		
		let OK = this.checkRotation();
		
		if ( OK && 0
			) {console.log(this.itemPointer.link.rotationIndex, this.r, this.location, this.rlocation, this.connLocation, this.rconnLocation );}
		
		if (!OK) return ;
		
		
		let xx = this.rconnLocation.x + this.itemPointer.link.location.x;
		let zz = this.rconnLocation.z + this.itemPointer.link.location.z;
		
		let item = game.map.getItemFromCoord(xx, zz);
		
		
		if (item !== null) {
			
			this.connectedItemPointer = item.pointer;
			
			item.models.forEach(model => {
				
				if (!model.location) return;
				
				if (model.location.x + model.parent.link.location.x === xx && model.location.z + model.parent.link.location.z === zz){
					
					if (!this.modelPointer.link) console.log(this);
					
					if (this.modelPointer.link.class === model.class){
						
						this.connectedModelPointer = model.pointer;
					}
				}
			});
			
			//console.log(this.connectedModelPointer);
			
		} else {
			
			this.connectedItemPointer = game.nullpointer;
			this.connectedModelPointer = game.nullpointer;
		}
	}
	
	checkLinks(){
		
		let connModel = this.connectedModelPointer.link;
		let model = this.modelPointer.link;
		
		if (!connModel || !model) return ;
		
		let found = connModel.connections.find(connection => {
			
			if (connection.connectedModelPointer.link === model) return true
			
			return false;
			
		});
		
		if (!found) {
			
			this.connectedModelPointer = game.nullpointer;
			this.connectedItemPointer = game.nullpointer;
			
		}
	}
	
}



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
		if (!this.itemMenu) return
		
		if (!link) {console.log("error", link); return}
		try{
			/*
		let text = 	'type: ' + link.link.type + 
					', \nkey: ' + link.link.key +
					', \nvolume: ' + link.link.volume.toFixed(1) +
					', \npressure: ' + link.link.pressure.toFixed(1)+
					', \npowr: ' + link.link.power +
					', \npos x:' + link.link.location.x + ' z: ' + link.link.location.z;
		*/
		
		let a = link.link.save();
		
		let text = 'key: ' + link.link.key + '\n';
    
		for (let prop in a) {
			
			switch(typeof(a[prop])){
				
				case "number": text += prop + " = " + a[prop].toFixed(1) + '\n'; break;
				case "string": text += prop + " = " + a[prop] + '\n'; break;
				case "object": 
					for (let subprop in a[prop]) {
						switch(typeof(a[prop][subprop])){
							
							case "number": text += prop + ' ' + subprop + " = " + a[prop][subprop].toFixed(1) + '\n'; break;
							case "string": text += prop + ' ' + subprop + " = " + a[prop][subprop] + '\n'; break;
							default: break;
						}
					};
					break;
				default: break;
			}
		}
		
		this.itemMenu.setState({hidden:false, text:text, item:link });
		this.itemMenuDrawn = true;
		} catch (e){
			console.log(e);
		}
	}
	
	updateMenu(){
		if (!this.itemMenu) return
		
		let link = this.itemMenu.state.item;
	
		if (!link) return
		if (!link.link) return
		try{
			/*
		let text = 	'type: ' + link.link.type + 
					', \nkey: ' + link.link.key +
					', \nvolume: ' + link.link.volume.toFixed(1) +
					', \npressure: ' + link.link.pressure.toFixed(1)+
					', \npowr: ' + link.link.power +
					', \npos x:' + link.link.location.x + ' z: ' + link.link.location.z;
		*/
		
		let a = link.link.save();
		
		let text = 'key: ' + link.link.key + '\n';
    
		for (let prop in a) {
			
			switch(typeof(a[prop])){
				
				case "number": text += prop + " = " + a[prop].toFixed(1) + '\n'; break;
				case "string": text += prop + " = " + a[prop] + '\n'; break;
				case "object": 
					for (let subprop in a[prop]) {
						switch(typeof(a[prop][subprop])){
							
							case "number": text += prop + ' ' + subprop + " = " + a[prop][subprop].toFixed(1) + '\n'; break;
							case "string": text += prop + ' ' + subprop + " = " + a[prop][subprop] + '\n'; break;
							default: break;
						}
					};
					break;
				default: break;
			}
		}
		
		this.itemMenu.setState({text:text});
		} catch (e){
			console.log(e);
		}
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
