import {game} from '../App.js';

import {Construction} from './Base.js';

import {TankModel} from './models/TankModel.js';
import {EngineModel} from './models/EngineModel.js';


export class _engine extends Construction {
	
	constructor(args){
		
		super();
		
		this.type = "engine";
		
		this.itemSize = this.getSize();
		
		if (!args) args = {};
			
		if (args.key) this.key = args.key; else this.key = -1;
		this.location = args.location || {};
		this.rotationIndex = args.rotationIndex || 0;
		
		
		this.pressure = args.pressure || 0;
		this.volume = args.volume || 0;
		
		this.maxVolume = 250;
		this.flowresistance = 0.2;
		
		this.returnFlow = [];
		this.inflow = [];
		
		
		this.power = 100;
		
		let left =   {location: {x:0, z:0}, size: {h:1, w:2}, connLocation: {x:-1, z:0}, itemPointer: this.pointer}
		let top =    {location: {x:0, z:0}, size: {h:1, w:2}, connLocation: {x:0, z:1} , itemPointer: this.pointer}
		let right =  {location: {x:0, z:0}, size: {h:1, w:2}, connLocation: {x:2, z:0} , itemPointer: this.pointer}
		let bottom = {location: {x:0, z:0}, size: {h:1, w:2}, connLocation: {x:0, z:-1}, itemPointer: this.pointer}	
		
		this.connectionsMap = [left] //{left: -1},{top: 1},{bottom: -1}
		
		let connections = [];
		
		this.connectionsMap.forEach(connection => {
			
			connections.push(new game.class.Connection(connection));
			
		});
		
		this.models.push(new TankModel( { connections: connections, location: {x:0, z:0}, size: {h:1, w:2} }, this ));
		
		this.models.forEach(model => {
			
			let currentModelPointer = model.pointer;
			
			model.connections.forEach(connection => {connection.modelPointer = currentModelPointer});
			
		});
		
		let c = new game.class.Connection({location: {x:1, z:0}, size: {h:1, w:2}, connLocation: {x:2, z:0}, itemPointer: this.pointer})
		
		
		this.models.push(new EngineModel({ 	connections: [c],
											location: {x:1, z:0}, 
											size: {h:1, w:2} 
										}, this));
		
		
		this.speed = 100;
		
		this.load = 0;
		
		this.controlIndex = 0;
		
		this.models[1].connections[0].modelPointer = this.models[1].pointer;
		
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
