import {game} from '../App.js';

import {Construction} from './Base.js';

import {TankModel} from './models/TankModel.js';
import {EngineModel} from './models/EngineModel.js';


export class _engine extends Construction {
	
	constructor(args){
		
		super();
		
		this.type = "engine";
		
		this.itemSize = {h:1, w:2};
		
		args = args || {};
		
		this.key = args.key || -1;
		this.location = args.location || {};
		this.rotationIndex = args.rotationIndex || 0;
		
		
		this.pressure = args.pressure || 0;
		this.volume = args.volume || 0;
		
		this.maxVolume = 250;
		this.flowresistance = 0.2;
		
		this.returnFlow = [];
		this.inflow = [];
		
		
		this.power = 100;
		
		let conOptions = {	
			location: {x:0, z:0}, 
			conlocation: {x:-1, z:0}, 
			size: this.itemSize, 
			itemPointer: this.pointer
		};
		args = {
			connectionsMap: [conOptions], 
			location: {x:0, z:0}, 
			size: this.itemSize,
			parentPointer: this.pointer
		};
		this.models.push(new TankModel(args));
		
		conOptions = {	
			location: {x:1, z:0}, 
			conlocation: {x:2, z:0}, 
			size: this.itemSize, 
			itemPointer: this.pointer
		};
		args = {
			connectionsMap: [conOptions], 
			location: {x:1, z:0},
			size: this.itemSize,
			parentPointer: this.pointer
		};
		this.models.push(new EngineModel(args));
		
		//// temp
		
		this.speed = 100;
		this.load = 0;
		this.controlIndex = 0;
		
		
		console.log(this.models[1]);
		this.models[1].connections[0].updateLinks();
		
	}
	
	
	update(dt){
		
		this.models[1].connections[0].updateLinks();
		
		this.models[1].update(0.02);
		
	}
	
	
	save(){
		var str = 
			{
				type: this.type,
				location:this.location,
				rotationIndex:this.rotationIndex,
				volume: this.volume,
				pressure: this.pressure,
				speed: this.speed,
				controlIndex: this.controlIndex,
				load: this.load
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
