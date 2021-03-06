import {game} from '../../App.js';

import {Construction} from './../Base.js';

import {TankModel} from './../../models/TankModel.js';

import {Tank_interface} from "./Tank_interface.js";


export class _tank extends Construction {

	constructor(args){
		
		super();
		
		if (!args) args = {};
		
		this.type = "tank";
		
		this.isNode = false;
		
		this.itemSize = this.getSize();
		
		if (args.key !== undefined) this.key = args.key; else this.key = -1;
		this.location = args.location || {};
		
		this.rotationIndex = args.rotationIndex || 0;
		this.pressure = args.pressure || 0;
		this.volume = args.volume || 0;
		
		
		let left =   {location: {x:0, z:0}, size: {h:1, w:1}, conlocation: {x:-1, z:0}, itemPointer: this.pointer}
		let top =    {location: {x:0, z:0}, size: {h:1, w:1}, conlocation: {x:0, z:1} , itemPointer: this.pointer}
		let right =  {location: {x:0, z:0}, size: {h:1, w:1}, conlocation: {x:1, z:0} , itemPointer: this.pointer}
		let bottom = {location: {x:0, z:0}, size: {h:1, w:1}, conlocation: {x:0, z:-1}, itemPointer: this.pointer}	
		
		args = { 
			connectionsMap: [right], 
			location: {x:0, z:0}, 
			size: this.itemSize,
			parentPointer: this.pointer
		}
		
		this.models.push(new TankModel(args, this));
		
		this.menu_interface = Tank_interface;
		this.updateInterface = null;
		
		this.draw();
	}
	
	
	update(){
		
		if (this.updateInterface) this.updateInterface();
		
	}
	
	
	
	save(){
		var str = 
			{
				type: this.type,
				location:this.location,
				volume: this.volume,
				rotationIndex :this.rotationIndex,
				pressure: this.pressure
			}
		return str;
	}
	
	
	drawMesh(instance, subtype){
		
		subtype = subtype || this.subtype;
		
		let mesh;
		let a = game.meshes.tank;
		
		mesh = this.getMesh(a, this.keynum, instance);
		
		return mesh;
	}
	
	getSize(){
		
		return {h:1, w:1};
	}
	
	
	getConfig(subtype){
		
		return {
			size: {h:1, w:1},
			connections: [
				{
					type: "tankmodel",
					location: {x:0, z:0},
					conlocation: [{x:1, z:0, r:2}]
				}
			]
		}
	}
	
	
}
