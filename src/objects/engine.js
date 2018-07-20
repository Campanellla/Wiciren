import {game} from '../App.js';

import {Construction} from './Base.js';

import {TankModel} from './models/TankModel.js';


export class _engine extends Construction {
	
	constructor(args){
		
		super();
		
		this.type = "engine";
		
		this.itemSize = this.getSize();
		
		if (!args) args = {};
			
		if (args.key) this.key = args.key; else this.key = -1;
		this.location = args.location || {};
		this.rotationIndex = args.rotationIndex || 0;
		
		
		this.power = 100;
		
		this.models = [];
		
		this.connectionsMap = [{left: -1}];
		
		let setup = {
			
			connections:this.connectionsMap
			
		}
		
		this.models.push(new TankModel(setup));
	}
	
	
	update(dt){
		
		
		
	}
	
	
	save(){
		var str = 
			{
				type: this.type,
				location:this.location,
				rotationIndex:this.rotationIndex
			};
		return str;
	}
	
	
	drawMesh(instance, subtype){
		
		subtype = subtype || this.subtype;
		
		let mesh;
		let a = game.meshes.engine;
		
		mesh = this.getMesh(a, this.keynum, instance);
		
		return mesh;
	}
	
	
	getSize(){
		
		return {h:1, w:2};
		
	}
	
	
}
