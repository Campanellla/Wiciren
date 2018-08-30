import {game} from './App.js';

import * as BABYLON from 'babylonjs';

import {blockSelection, unBlockSelection} from './workspace.js';

import {_pipe} from './objects/pipe/pipe.js';
import {_pump} from './objects/pump/pump.js';
import {_tank} from './objects/tank/tank.js';
import {_engine} from './objects/engine/engine.js';
import {_device} from './objects/device/device.js';


export class ItemConstructor {
	
	constructor(){
		
		this.rotationIndex = 0;
		this.activeConstructor = false;
		
		this.activeItem;
		this.constructorMesh;
		
		this.helperMeshes = [];
		
		this.keynum = 0;
		
		this.isFreeSpace = false;
		
		this.constructorItemList = {
			
			pump:{item: _pump, subtype: ''},
			tank:{item: _tank, subtype: ''},
			engine:{item: _engine, subtype: ''},
			device:{item: _device, subtype: ''},
			
			pipe:{item: _pipe, subtype: 'pipe'},
			pipe3:{item: _pipe, subtype: '3-way'},
			pipe4:{item: _pipe, subtype: '4-way'},
			pipeA:{item: _pipe, subtype: 'angle'}
			
		}
		
	}
	
	setActiveConstructor(item){
		
		if(this.activeConstructor || item) {
			
			this.activeConstructor = item || this.activeConstructor;
			
			let object = {subtype:this.constructorItemList[this.activeConstructor].subtype};
			
			this.activeItem = new this.constructorItemList[this.activeConstructor].item(object);
			
			this.activeItem.setState("constructor");
			
			this.activeItem.rotationIndex = this.rotationIndex;
			
			this.constructorMesh = this.activeItem.mesh;
			
			game.selection.setActiveItem(this.activeItem);
			game.selection.setRotation(this.rotationIndex);
			
			this.checkConstructor(game.selection.position.x, game.selection.position.z);
			
			this.helperMeshes = this.activeItem.makeArrows();
			
		}
	}
	
	
	setInactiveConstructor(){
		
		if(!this.activeConstructor) return;
		
		this.activeConstructor = false;
				
		if(this.constructorMesh) game.selection.setActiveItem();
		
		if (this.activeItem) {
			this.activeItem.makeArrows(false);
			this.activeItem.destruct();
		}
	}
	
	
	constructActiveObject(){
		
		if (this.activeConstructor){
			
			var blockx = game.selection.position.x;
			var blocky = game.selection.position.z;
			
			if(this.checkConstructor(blockx, blocky)){
				
				if (this.activeConstructor){
					
					if (!this.checkConstructor(blockx, blocky)) return
					
					this.activeItem.makeArrows(false);
					
					this.activeItem.location = {x:blockx, z:blocky};
					this.activeItem.rotationIndex = this.rotationIndex || 0;
					this.activeItem.subtype = this.constructorItemList[this.activeConstructor].subtype;
					
					this.activeItem.key = this.keynum++;
					
					var item = this.activeItem; 
					
					if (item){
						
						this.activeItem.setState("active");
						
						game.map.insertItem(item, item.location.x, item.location.z, item.itemSize.w, item.itemSize.h, item.rotationIndex);
						game.map.objectsList.push(item);
						
						item.rotate();
						
						game.selection.setActiveItem();
						
						this.constructorMesh = undefined;
						
						this.setActiveConstructor();
						
						//item.updateLinks();
						
					};
					
					game.updatePipelines = true;
					
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
					game.map.objectsList.push(item);
					
				}
				//////////
				game.updatePipelines = true;
			} 
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
	
	checkConstructor(blockx, blocky){
		
		if (this.helperMeshes) if (this.helperMeshes.length > 0) {
			
			this.helperMeshes.forEach(mesh => {
				mesh.position.x = game.selection.position.x + mesh.itemOffset.x;
				mesh.position.z = game.selection.position.z + mesh.itemOffset.z;
				
				mesh.isVisible = this.activeItem.mesh.isVisible;
			});
		}
		
		if (this.activeItem) {
			this.activeItem.location.x = game.selection.position.x;
			this.activeItem.location.z = game.selection.position.z;
		}
		
		if (this.rotationIndex%2) {
			var sizeOffset = {x: this.activeItem.itemSize.h, z: this.activeItem.itemSize.w};
		} else {
			var sizeOffset = {x: this.activeItem.itemSize.w, z: this.activeItem.itemSize.h};
		}
		
		if (!this.activeItem) return;
		
		for (let x = 0; x < sizeOffset.x; x++){
			for(let z = 0; z < sizeOffset.z; z++){
				if (game.map.getItemFromCoord(blockx + x, blocky + z)){
					this.activeItem.mesh.renderOverlay = true;
					this.isFreeSpace = false;
					return false
				}
			}
		}
		
		this.activeItem.mesh.renderOverlay = false;
		this.isFreeSpace = true;
		return true;
	}
	
	
}





