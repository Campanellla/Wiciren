import {game} from '../../App.js';

import {Construction} from './../Base.js';
import {PumpModel} from './../../models/PumpModel.js';





export class _pump extends Construction {
	
	constructor(args){
		super();
		args = args || {};
		args.models = args.models || [];
		
		this.type = "pump";
		this.itemSize = {h:1, w:1};
			
		if (args.key !== undefined) this.key = args.key; else this.key = -1;
		
		this.location = args.location || {};
		this.rotationIndex = args.rotationIndex || 0;
		
		let connectionsArgs = [
			{
				location: {x:0, z:0},
				size: this.itemSize,
				conlocation: {x:-1, z:0},
				itemPointer: this.pointer
			}, {
				location: {x:0, z:0},
				size: this.itemSize,
				conlocation: {x:1, z:0},
				itemPointer: this.pointer
			}
		]
		let modelArgs = { 
			connectionsMap: connectionsArgs, 
			location: {x:0, z:0}, 
			size: this.itemSize,
			parentPointer: this.pointer,
			config: args.models[0]
		}
		this.models.push(new PumpModel(args));
		
		this.draw();
	}
	
	
	update(dt){
		
	}
	
	
	save(){
		return {
			type: this.type,
			location: this.location,
			rotationIndex: this.rotationIndex,
			models: [{
				volume: this.models[0].volume,
				pressure: this.models[0].pressure
			}]
		}
	}
	
	
	drawMesh(instance, subtype){
		return this.getMesh(game.meshes.pump, this.keynum, instance);
	}
	
	
	getConfig(subtype){
		return {
			size: {h:1, w:1},
			connections: [
				{
					type: "pumpmodel",
					location: {x:0, z:0},
					conlocation: [
						{x:-1, z:0, r:0},
						{x:1, z:0, r:2}
					]
				}
			]
		}
	}
	
	
	
}





