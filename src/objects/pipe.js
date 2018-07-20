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
		
		this.models = [];
		
		switch(this.subtype){
			
			case "3-way": this.connectionsMap = [{left: -1}, 			{right: 1},	{bottom: -1}]; break;
			case "4-way": this.connectionsMap = [{left: -1}, {top: 1},	{right: 1},	{bottom: -1}]; break;
			case "angle": this.connectionsMap = [{left: -1}, 						{bottom: -1}]; break;
			default     : this.connectionsMap = [{left: -1}, 			{right: 1}				]; break;
		}
		
		
		let setup = {
			
			connections:this.connectionsMap
			
		}
		
		
		//this.childItems.push(new PipeModel());
		
		this.models.push(new PipeModel(setup));
		
		
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









