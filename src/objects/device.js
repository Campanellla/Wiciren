import {game} from '../App.js';

import {Construction} from './Base.js';
import {DeviceModel} from './models/DeviceModel.js';


export class _device extends Construction {
	
	constructor(args){
		
		super();
		
		this.type = "device";
		
		this.itemSize = this.getSize();
		
		if (!args) args = {};
		
		if (args.key) this.key = args.key; else this.key = -1;
		this.location = args.location || {};
		this.rotationIndex = args.rotationIndex || 0;
		
		this.connectionsMap = [];
		
		let c = new game.class.Connection({location: {x:0, z:0}, size: {h:2, w:2}, connLocation: {x:-1, z:0}, itemPointer: this.pointer})
		
		
		this.models.push(new DeviceModel({ 	connections: [c],
											location: {x:0, z:0}, 
											size: {h:2, w:2} 
										}, this));
		
		this.models[0].connections[0].modelPointer = this.models[0].pointer;
		
		
		this.volume = 0;
		this.speed = 0;
		this.controlIndex = 0;
		
	}
	
	
	update(dt){
		
		this.models[0].connections[0].updateLinks();
		
		this.models[0].update(0.02);
		
	}
	
	save(){
		var str = 
			{
				type: this.type,
				location:this.location,
				rotationIndex:this.rotationIndex,
				volume: this.volume,
				speed: this.speed,
				controlIndex: this.controlIndex
			};
		return str;
	}
	
	
	drawMesh(instance, subtype){
		
		subtype = subtype || this.subtype;
		
		let mesh;
		let a = game.meshes.device;
		
		mesh = this.getMesh(a, this.keynum, instance);
		
		return mesh;
	}
	
	getSize(){
		
		return {h:2, w:2};
		
	}
	
}








