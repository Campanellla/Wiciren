import {game} from '../App.js';

import {Construction} from './Base.js';



export class _device extends Construction {
	
	constructor(args){
		
		super();
		
		this.type = "device";
		
		this.itemSize = this.getSize();
		
		if (!args) args = {};
		
		if (args.key) this.key = args.key; else this.key = -1;
		this.location = args.location || {};
		this.rotationIndex = args.rotationIndex || 0;
			
		
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
		let a = game.meshes.device;
		
		mesh = this.getMesh(a, this.keynum, instance);
		
		return mesh;
	}
	
	getSize(){
		
		return {h:2, w:2};
		
	}
	
}








