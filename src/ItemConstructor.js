import {game} from './App.js';

import * as BABYLON from 'babylonjs';

import {blockSelection, unBlockSelection} from './workspace.js';

import {_pipe} from './objects/pipe/pipe.js';
import {_pump} from './objects/pump/pump.js';
import {_tank} from './objects/tank/tank.js';
import {_engine} from './objects/engine/engine.js';
import {_device} from './objects/device/device.js';

import {_epole} from './objects/epole/epole.js';


export class ItemConstructor {
	
	constructor(){
		
		this.rotationIndex = 0;
		this.activeConstructor = false;
		//this.activeItem;
		//this.constructorMesh;
		this.helperMeshes = [];
		this.keynum = 0;
		//this.isFreeSpace = false;
		this.activeMesh;
		this.config;
		this.constructorItemList = {
			
			pump:{item: _pump, subtype: ''},
			tank:{item: _tank, subtype: ''},
			engine:{item: _engine, subtype: ''},
			device:{item: _device, subtype: ''},
			
			pipe:{item: _pipe, subtype: 'pipe'},
			pipe3:{item: _pipe, subtype: '3-way'},
			pipe4:{item: _pipe, subtype: '4-way'},
			pipeA:{item: _pipe, subtype: 'angle'},
			
			pole:{item: _epole, subtype: ''}
			
		}
		
	}
	
	setActiveConstructor(item){
		
		if(this.activeConstructor || item) {
			
			this.activeConstructor = item || this.activeConstructor;
			let object = {subtype:this.constructorItemList[this.activeConstructor].subtype};
			let _item = this.constructorItemList[this.activeConstructor];
			
			if (_item && _item.item.prototype.getConfig) {
				let subtype = _item.subtype;
				let _prototype = _item.item.prototype;
				this.config = _prototype.getConfig();
				this.activeMesh = _prototype.drawMesh(false, subtype);
				this.activeMesh.isObject = true;
			}
			
			game.selection.setActiveMesh(this.activeMesh, this.config);
			game.selection.setRotation(this.rotationIndex);
			
		}
	}
	
	
	setInactiveConstructor(){
		if(!this.activeConstructor) return;
		this.activeConstructor = false;
		if(this.activeMesh) {
			game.selection.setActiveMesh();
			this.activeMesh.dispose();
		}
	}
	
	
	constructActiveObject(){
		
		if (this.activeConstructor){
			let blockx = game.selection.position.x;
			let blocky = game.selection.position.z;
			
			if(this.checkConstructor(blockx, blocky) && this.activeConstructor){
				let args = {
					location: {x:blockx, z:blocky},
					rotationIndex: this.rotationIndex || 0,
					subtype: this.constructorItemList[this.activeConstructor].subtype,
					key: this.keynum++
				}
				let item = new this.constructorItemList[this.activeConstructor].item(args);
				game.map.insertItem(item, item.location.x, item.location.z, item.itemSize.w, item.itemSize.h, item.rotationIndex);
				game.map.objectsList.push(item);
				item.rotate();
				
				//this.setInactiveConstructor()
				console.log(item);
				
				game.updatePipelines = true;	
			}
		}
	}
	
	
	loadObject(object){
		if (object && this.constructorItemList[object.type]){	
			
			//object.rotationIndex = object.rotationIndex || 0;
			
			object.key = this.keynum++;
			var item = new this.constructorItemList[object.type].item(object);
			if (item){
				item.draw(true);
				game.map.insertItem(item, object.location.x, object.location.z, item.itemSize.w, item.itemSize.h, item.rotationIndex);
				game.map.objectsList.push(item);
			}
			game.updatePipelines = true;
		}
	}
	
	
	deleteObject(location){
		var item = game.map.getItemFromCoord(location[0], location[1]);
		if (item){
			item.destruct();
			game.updatePipelines = true;
			let index = game.map.objectsList.findIndex(a => {return a === item});
			if (index >= 0) game.map.objectsList.splice(index, 1);
		}
	}
	
	// return true if space is free
	checkConstructor(tilex, tiley){
		
		if (!this.activeMesh) return false;
		
		if (this.helperMeshes && this.helperMeshes.length > 0) {
			
			this.helperMeshes.forEach(mesh => {
				mesh.position.x = game.selection.position.x + mesh.itemOffset.x;
				mesh.position.z = game.selection.position.z + mesh.itemOffset.z;
				
				mesh.isVisible = this.activeItem.mesh.isVisible;
			});
		}
		
		if (this.rotationIndex%2) {
			var sizeOffset = {x: this.config.size.h, z: this.config.size.w};
		} else {
			var sizeOffset = {x: this.config.size.w, z: this.config.size.h};
		}
		
		for (let x = 0; x < sizeOffset.x; x++){
			for(let z = 0; z < sizeOffset.z; z++){
				if (game.map.getItemFromCoord(tilex + x, tiley + z)){
					this.activeMesh.renderOverlay = true;
					//this.isFreeSpace = false;
					return false
				}
			}
		}
		
		this.activeMesh.renderOverlay = false;
		//this.isFreeSpace = true;
		return true;
	}
	
	
}





