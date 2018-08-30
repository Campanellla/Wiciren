import {game} from '../../App.js';

import {Construction} from './../Base.js';
import {PipeModel} from './../../models/pipe/PipeModel.js';

import {Pipe_interface} from "./Pipe_interface.js";

export class _pipe extends Construction {
	
	constructor(args){
		
		super();
		
		args = args || {};
		
		this.type = "pipe";
		
		/// load config
		
		this.subtype = args.subtype || "pipe";
		if (args.key !== undefined) this.key = args.key; else this.key = -1;
		this.location = args.location || {};
		this.rotationIndex = args.rotationIndex || 0;
		
		
		this.itemSize = {h:1, w:1};
		this.constructionSize = {h:1, w:1}; ///
		
		
		this.pressure = args.pressure || 0;
		this.volume = args.volume || 0;
		
		
		/// config connections 
		
		let left =   {location: {x:0, z:0}, size: {h:1, w:1}, connLocation: {x:-1, z:0}, itemPointer: this.pointer};
		let top =    {location: {x:0, z:0}, size: {h:1, w:1}, connLocation: {x:0, z:1} , itemPointer: this.pointer};
		let right =  {location: {x:0, z:0}, size: {h:1, w:1}, connLocation: {x:1, z:0} , itemPointer: this.pointer};
		let bottom = {location: {x:0, z:0}, size: {h:1, w:1}, connLocation: {x:0, z:-1}, itemPointer: this.pointer};
		
		switch(this.subtype){
			case "3-way": this.connectionsMap = [left, 		right,	bottom]; break;
			case "4-way": this.connectionsMap = [left, top,	right,	bottom]; break;
			case "angle": this.connectionsMap = [left, 				bottom]; break;
			default     : this.connectionsMap = [left, 		right		  ]; break;
		};
		
		this.models.push(new PipeModel( { connectionsMap: this.connectionsMap, location: {x:0, z:0}, size: {h:1, w:1} }, this ));
		
		
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
	
	
}









