import {game} from '../../App.js';

import {Construction} from './../Base.js';
import {PipeModel} from './../../models/pipe/PipeModel.js';

import {Pipe_interface} from "./Pipe_interface.js";



export class _pipe extends Construction {
	
	constructor(args){
		super();
		args = args || {};
		args.models = args.models || [];
		
		this.type = "pipe";
		this.itemSize = {h:1, w:1};
		
		if (args.key !== undefined) this.key = args.key; else this.key = -1;
		this.subtype = args.subtype || "pipe";
		this.location = args.location || {};
		this.rotationIndex = args.rotationIndex || 0;
		
		let left =   {location: {x:0, z:0}, size: this.itemSize, connLocation: {x:-1, z:0}, itemPointer: this.pointer};
		let top =    {location: {x:0, z:0}, size: this.itemSize, connLocation: {x:0, z:1} , itemPointer: this.pointer};
		let right =  {location: {x:0, z:0}, size: this.itemSize, connLocation: {x:1, z:0} , itemPointer: this.pointer};
		let bottom = {location: {x:0, z:0}, size: this.itemSize, connLocation: {x:0, z:-1}, itemPointer: this.pointer};
		
		switch(this.subtype){
			case "3-way": this.connectionsMap = [left, 		right,	bottom]; break;
			case "4-way": this.connectionsMap = [left, top,	right,	bottom]; break;
			case "angle": this.connectionsMap = [left, 				bottom]; break;
			default     : this.connectionsMap = [left, 		right		  ]; break;
		};
		
		this.models.push(new PipeModel({
			connectionsMap: this.connectionsMap, 
			location: {x:0, z:0}, 
			size: {h:1, w:1},
			parentPointer: this.pointer,
			config: args.models[0]
		}));
		
		this.draw();
		
		this.menu_interface = Pipe_interface;
		this.updateInterface = null;
	}
	
	
	update(dt){
		
		if (this.updateInterface) this.updateInterface();
		
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
		
		let a;
		
		switch(subtype){
			
			case "3-way": a = game.meshes.pipe3; break ;
			case "4-way": a = game.meshes.pipe4; break ;
			case "angle": a = game.meshes.pipeA; break ;
			default     : a = game.meshes.pipe ; break ;
		}
		
		return this.getMesh(a, this.keynum, instance);
	}
	
	
	getConfig(){
		
		return {
			size: {h:1, w:1},
			connections: [
				{
					type: "pipemodel",
					location: {x:0, z:0},
					conlocation: [
						{x:-1, z:0},
						{x: 1, z:0}
					]
				}
			]
		}
	}
	
}









