import {game} from '../../App.js';

import {Construction} from './../Base.js';

import {TankModel} from './../../models/TankModel.js';
import {EngineModel} from './../../models/EngineModel.js';

import {Engine_interface} from "./Engine_interface.js";

export class _engine extends Construction {
	
	constructor(args){
		super();
		args = args || {};
		args.models = args.models || [];
		
		this.type = "engine";
		this.itemSize = {h:1, w:2};
		
		if (args.key !== undefined) this.key = args.key; else this.key = -1;
		
		this.location = args.location || {};
		this.rotationIndex = args.rotationIndex || 0;
		
		let connectionsArgs = [
			{	
				location: {x:0, z:0}, 
				conlocation: {x:-1, z:0}, 
				size: this.itemSize, 
				itemPointer: this.pointer
			}
		];
		let modelargs = {
			connectionsMap: connectionsArgs, 
			location: {x:0, z:0}, 
			size: this.itemSize,
			parentPointer: this.pointer,
			config: args.models[0]
		};
		this.models.push(new TankModel(modelargs));
		
		connectionsArgs = [
			{	
				location: {x:1, z:0}, 
				conlocation: {x:2, z:0}, 
				size: this.itemSize, 
				itemPointer: this.pointer
			}
		];
		modelargs = {
			connectionsMap: connectionsArgs, 
			location: {x:1, z:0},
			size: this.itemSize,
			parentPointer: this.pointer,
			config: args.models[1]
		};
		this.models.push(new EngineModel(modelargs));
		
		this.draw();
		
		this.menu_interface = Engine_interface;
		this.updateInterface = null;
		
	}
	
	
	update(dt){
		//this.models[1].update(dt);
		//if (this.updateInterface) this.updateInterface();
	}
	
	
	save(){
		return {
			type: this.type,
			location: this.location,
			rotationIndex: this.rotationIndex,
			models:[
				{
					subtype: this.models[0].subtype,
					pressure: this.models[0].pressure,
					volume: this.models[0].volume
				}, {
					subtype: this.models[1].subtype,
					speed: this.models[1].speed,
					controlIndex: this.models[1].controlIndex,
					run: this.models[1].run,
					I: this.models[1].I,
					frequency: this.models[1].frequency,
					voltage: this.models[1].voltage,
					setPoint: this.models[1].setPoint,
					speedDroop: this.models[1].speedDroop,
					connectedToGrid: this.models[1].connectedToGrid
				}
			]
		};
	}
	
	
	drawMesh(instance, subtype){
		return this.getMesh(game.meshes.engine, this.keynum, instance);
	}
	
	
	getConfig(subtype){
		return {
			size: {h:1, w:2},
			connections: [
				{
					type: "tankmodel",
					location: {x:0, z:0},
					conlocation: [{x:-1, z:0, r:0}]
				}, {
					type: "enginemodel",
					location: {x:1, z:0},
					conlocation: [{x:2, z:0, r:2}]
				}
			]
		}
	}
	
	
	
}






