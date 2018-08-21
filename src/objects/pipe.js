import {game} from '../App.js';

import {Construction} from './Base.js';
import {PipeModel} from './models/PipeModel.js';


export class _pipe extends Construction {
	
	constructor(args){
		
		super();
		
		if (!args) args = {};
		
		this.type = "pipe";
		this.subtype = args.subtype || "pipe";
		this.isNode = false;
		
		this.itemSize = this.getSize();
		
		this.constructionSize = {h:1, w:1};
		
		if (args.key !== undefined) this.key = args.key; else this.key = -1;
		this.location = args.location || {};
		
		this.rotationIndex = args.rotationIndex || 0;
		this.pressure = args.pressure || 0;
		this.volume = args.volume || 0;
		
		this.maxVolume = 10;
		this.flowresistance = 0.2;
		
		this.sourceresistance = 0;
		this.sourcepressure = 0;
		
		this.lastQ = 0;
		this.Q = 0;
		
		
		let left =   {location: {x:0, z:0}, size: {h:1, w:1}, connLocation: {x:-1, z:0}, itemPointer: this.pointer}
		let top =    {location: {x:0, z:0}, size: {h:1, w:1}, connLocation: {x:0, z:1} , itemPointer: this.pointer}
		let right =  {location: {x:0, z:0}, size: {h:1, w:1}, connLocation: {x:1, z:0} , itemPointer: this.pointer}
		let bottom = {location: {x:0, z:0}, size: {h:1, w:1}, connLocation: {x:0, z:-1}, itemPointer: this.pointer}	
		
		switch(this.subtype){
			case "3-way": this.connectionsMap = [left, 		right,	bottom]; break;
			case "4-way": this.connectionsMap = [left, top,	right,	bottom]; break;
			case "angle": this.connectionsMap = [left, 				bottom]; break;
			default     : this.connectionsMap = [left, 		right		  ]; break;
		}
		
		let connections = [];
		
		this.connectionsMap.forEach(conn => {
			
			connections.push(new game.class.Connection(conn));
			
		});
		
		this.models.push(new PipeModel( { connections: connections, location: {x:0, z:0}, size: {h:1, w:1} }, this ));
		
		this.models.forEach(model => {
			
			let currentModelPointer = model.pointer;
			
			model.connections.forEach(connection => {connection.modelPointer = currentModelPointer});
			
		});
		
		
	}
	
	
	update(dt){
		
	}
	
	
	save(){
		
		return 	{
				type: 		this.type,
				subtype: 	this.subtype,
				location: 	this.location,
				volume: 	this.volume,
				pressure:	this.pressure,
				rotationIndex: 	this.rotationIndex
				};	
	}
	
	
	drawMesh(instance, subtype){
		
		subtype = subtype || this.subtype;
		
		let mesh;
		let a;
		
		switch(subtype){
			
			case "3-way": a = game.meshes.pipe3; break ;
			case "4-way": a = game.meshes.pipe4; break ;
			case "angle": a = game.meshes.pipeA; break ;
			default     : a = game.meshes.pipe ; break ;
			
		}
		
		mesh = this.getMesh(a, this.keynum, instance);
		
		return mesh;
	}
	
	
	getSize(){
		
		return {h:1, w:1};
		
	}
	
	
}









