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
			pipeA:{item: _pipe, subtype: 'angle'}
			
		}
		
		this._mesh;
		this._item;
		
		this.activeItem;
		
	}
	
	setActiveConstructor(item){
		
		if(this.activeConstructor || item) {
			
			this.activeConstructor = item || this.activeConstructor;
			
			let object = {subtype:this.constructorItemList[this.activeConstructor].subtype};
			
			this.activeItem = new this.constructorItemList[this.activeConstructor].item(object);
			
			this.activeItem.setState("constructor");
			
			this.constructorMesh = this.activeItem.mesh;
			
			game.selection.setActiveItem(this.activeItem);
			game.selection.setRotation(this.rotationIndex);
			
		}
		
	}
	
	setInactiveConstructor(){
		
		if(!this.activeConstructor) return
		
		this.activeConstructor = false;
				
		if(this.constructorMesh) {
			
			game.selection.setActiveItem();
			
			if (this.activeItem){
				
				this.activeItem.destruct();
				
			}
		}
	}
	
	constructActiveObject(){
		
		if (this.activeConstructor){
			
			var blockx = game.selection.position.x; //this.constructorMesh.position.x;
			var blocky = game.selection.position.z; //this.constructorMesh.position.z;
			
			if(!game.map.getItemFromCoord(Math.round(blockx), Math.round(blocky))){
				
				if (this.activeConstructor){
					
					if (!this.checkConstructor(blockx, blocky)) return
					
					this.activeItem.location = {x:blockx, z:blocky};
					
					this.activeItem.rotationIndex = this.rotationIndex || 0;
					
					this.activeItem.subtype = this.constructorItemList[this.activeConstructor].subtype;
					
					this.activeItem.key = this.keynum++;
					
					var item = this.activeItem; //new this.constructorItemList[this.activeConstructor].item(object);
					
					if (item){
						
						//item.draw(true);
						game.map.insertItem(item, item.location.x, item.location.z, item.itemSize.w, item.itemSize.h, item.rotationIndex);
						game.map.objectsList.push(item.pointer);
						
						item.mesh.visibility = 1;
						item.mesh.isPickable = true;
						
						console.log(item.mesh);
						
						item.mesh.position = new BABYLON.Vector3(item.location.x, 0, item.location.z);
						
						item.rotate();
						
						//game.selection.setMesh();
						
						this._item = undefined;
						this.constructorMesh = undefined;
						
						this.setActiveConstructor();
						
					}
					/////////////////////////////
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
					game.map.objectsList.push(item.pointer);
					
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
		}
		
	}
	
	checkConstructor(blockx, blocky){
	
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
					return false
				}
			}
		}
		
		this.activeItem.mesh.renderOverlay = false;
		return true
	}
	
	
}





