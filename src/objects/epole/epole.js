import {game} from '../../App.js';

import {Construction} from './../Base.js';

import {EpoleModel} from './../../models/EpoleModel.js';




export class _epole extends Construction {
	
	constructor(args){
		super();
		args = args || {};
		args.models = args.models || [];
		
		this.type = "pole";
		this.itemSize = {h:1, w:1};
		
		if (args.key !== undefined) this.key = args.key; else this.key = -1;
		this.subtype = args.subtype || "epole";
		this.location = args.location || {};
		this.rotationIndex = args.rotationIndex || 0;
		
		let connectionArgs = [
			{
				location: {x:0, z:0}, 
				conlocation: {x:-1, z:0}, 
				size: this.itemSize,
				itemPointer: this.pointer
			}, {
				location: {x:0, z:0}, 
				conlocation: {x:0, z:1}, 
				size: this.itemSize,
				itemPointer: this.pointer
			}, {
				location: {x:0, z:0}, 
				conlocation: {x:1, z:0}, 
				size: this.itemSize,
				itemPointer: this.pointer
			}, {
				location: {x:0, z:0}, 
				conlocation: {x:0, z:-1}, 
				size: this.itemSize,
				itemPointer: this.pointer
			}
		];
		
		this.models.push(new EpoleModel( { 
			connectionsMap: connectionArgs, 
			location: {x:0, z:0}, 
			size: this.itemSize,
			parentPointer: this.pointer
		}));
		
		this.draw();
	}
	
	
	update(dt){
		
	}
	
	
	save(){
		return {
			type: 		this.type,
			location: 	this.location,
			rotationIndex: 	this.rotationIndex
		};	
	}
	
	
	drawMesh(instance, subtype){
		subtype = subtype || this.subtype;
		let a = game.meshes.epole;
		return this.getMesh(a, this.keynum, instance);
	}
	
	
	getConfig(){
		
		return {
			size: {h:1, w:1},
			connections: [
				{
					type: "epolemodel",
					ranged: true,
					location: {x:0, z:0},
					conlocation: [
						{range: 5, opacity: 0.25},
						{range: 2, opacity: 0.5}
					]
				}
			]
		}
	}
	
}









