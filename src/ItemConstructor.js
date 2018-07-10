import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {game} from './App.js';

import * as BABYLON from 'babylonjs';

import {blockSelection, unBlockSelection} from './workspace.js';

import {_pipe} from './objects/pipe.js';
import {_pump} from './objects/pump.js';
import {_tank} from './objects/tank.js';
import {_engine} from './objects/engine.js';
import {_device} from './objects/device.js';


export class ItemConstructor {
	
	constructor(){
		this.rotationIndex = 0;
		this.activeConstructor = false;
		this.activeConstructorSize = {h:0, w:0};
		this.constructorMesh = undefined;
		this.keynum = 0;
		
		this.constructorItemList = {
			
			pump:{item: _pump, subtype: ''},
			tank:{item: _tank, subtype: ''},
			engine:{item: _engine, subtype: ''},
			device:{item: _device, subtype: ''},
			
			pipe:{item: _pipe, subtype: 'pipe'},
			pipe3:{item: _pipe, subtype: '3-way'},
			pipe4:{item: _pipe, subtype: '4-way'},
			pipeA:{item: _pipe, subtype: 'angle'},
			
		}
	}
	
	setActiveConstructor(item){
		
		if(!this.activeConstructor) {
			
			this.activeConstructor = item;
			
			this.constructorMesh = this.constructorItemList[this.activeConstructor].item.prototype.drawMesh(false, this.constructorItemList[this.activeConstructor].subtype);
			this.activeConstructorSize = this.constructorItemList[this.activeConstructor].item.prototype.getSize();
			
			game.selection.setMesh(this.constructorMesh, this.activeConstructorSize);
			game.selection.setRotation(this.rotationIndex);
			
			this.constructorMesh.material = game.materials.ycolor;
			this.constructorMesh.visibility = 0.5;
			this.constructorMesh.isPickable = false;
			
			
		}
		
	}
	
	setInactiveConstructor(){
		
		if(!this.activeConstructor) return
		
		this.activeConstructor = false;
				
		if(this.constructorMesh) {
			
			game.selection.setMesh();
			this.constructorMesh.dispose();
			
		}
		game.selection.visibility = 1;
	}
	
	constructActiveObject(){
		
		if (this.activeConstructor){
			
			var blockx = game.selection.position.x;//this.constructorMesh.position.x;
			var blocky = game.selection.position.z;//this.constructorMesh.position.z;
			
			if(!game.map.getItemFromCoord(Math.round(blockx), Math.round(blocky))){
				
				if (this.activeConstructor){
					
					if (!this.checkConstructor(blockx, blocky)) return
					
					var object = {location:{x:blockx, z:blocky}};
				
					object.rotationIndex = this.rotationIndex || 0;
				
					object.subtype = this.constructorItemList[this.activeConstructor].subtype;
					
					object.key = this.keynum++;
					
					var item = new this.constructorItemList[this.activeConstructor].item(object);
					
					if (item){
						
						item.draw(true);
						game.map.insertItem(item, object.location.x, object.location.z, item.itemSize.w, item.itemSize.h, item.rotationIndex);
						game.map.objectsList.push(item.ref);
						
					}
				}
			}
		}
	}
	
	loadObject(object){
		
		if (object){
			
			if (this.constructorItemList[object.type]){
				
				object.rotationIndex = object.rotationIndex || 0;
				object.key = this.keynum++;
				
				var item = new this.constructorItemList[object.type].item(object);
				
				if (item){
					
					item.draw(true);
					game.map.insertItem(item, object.location.x, object.location.z, item.itemSize.w, item.itemSize.h, item.rotationIndex);
					game.map.objectsList.push(item.ref);
					
				}
				
			} 
		}
	}
	
	
	deleteObject(location){
		
		var item = game.map.getItemFromCoord(location[0], location[1]);
		
		if (item){
			
			item.mesh.dispose();
			item.mesh = undefined;
			
			item.ref.link = undefined;
			
		}
		
	}
	
	checkConstructor(blockx, blocky){
	
		if (this.rotationIndex%2) {
			var sizeOffset = {x: this.activeConstructorSize.h, z: this.activeConstructorSize.w};
		} else {
			var sizeOffset = {x: this.activeConstructorSize.w, z: this.activeConstructorSize.h};
		}
		
		for (let x = 0; x < sizeOffset.x; x++){
			for(let z = 0; z < sizeOffset.z; z++){
				if (game.map.getItemFromCoord(blockx + x, blocky + z)){
					this.constructorMesh.renderOverlay = true;
					return false
				}
			}
		}
		this.constructorMesh.renderOverlay = false;
		return true
	}
	
	
}





