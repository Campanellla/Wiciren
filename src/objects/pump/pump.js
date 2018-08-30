import {game} from '../../App.js';

import {Construction} from './../Base.js';
import {PumpModel} from './../../models/PumpModel.js';


export class _pump extends Construction {
	
	constructor(args){
		
		super();
		
		this.type = 'pump';
		
		this.itemSize = {h:1, w:1};
		
		if (!args) args = {};
			
		if (args.key !== undefined) this.key = args.key; else this.key = -1;
		this.location = args.location || {};
		this.rotationIndex = args.rotationIndex || 0;
		
		
		this.pressure = args.pressure || 0;
		this.volume = args.volume || 0;
		this.returnFlow = [];
		this.inflow = [];
		this.capacity = 5;
		this.volume = 0;
		this.pressure = 1;
		this.lastQ = 0;
		this.Q = 0;
		
		
		let left =   {location: {x:0, z:0}, size: {h:1, w:1}, conlocation: {x:-1, z:0}, itemPointer: this.pointer}
		let right =  {location: {x:0, z:0}, size: {h:1, w:1}, conlocation: {x:1, z:0} , itemPointer: this.pointer}
		
		args = { 
			connectionsMap: [left, right], 
			location: {x:0, z:0}, 
			size: this.itemSize,
			parentPointer: this.pointer
		}
		
		this.models.push(new PumpModel(args, this));
		
		
	}
	
	
	update(dt){
		
	}
	
	
	updateFlow(dt){
		
		this.pressure = this.volume / 1000;
		
		this.inflow.forEach((flow)=>{
			
			if (flow){
				
				if (this.volume + flow.Q < 1000){
					
					this.volume += flow.Q;
					
				} else {
					
					let a = 1000 - this.volume;
					this.volume = 1000;
					flow.Q -= a;
					
					this.returnFlow.push({
						Q:flow.Q,
						Source: flow.Source
					});
				};
			};
		});
		
		this.returnFlow.forEach((flow) => {
			flow.Source.link.volume += flow.Q;
		});
		
		this.returnFlow.length = 0;
		
		this.connections.forEach((pointer)=>{
			
			if (!pointer) return ;
			
			let item = pointer.link;
			
			if (this.pressure > item.pressure){
				
				if (this.volume > 0){
					
					item.inflow.push({
						Q:(this.pressure - item.pressure)*10,
						Source: this.pointer
					})
					
					this.volume -= (this.pressure - item.pressure)*10;
				}
				
			}
		});
		
		this.inflow.length = 0;
		
	}
	
	
	save(){
		var str = 
			{
				type: this.type,
				location:this.location,
				rotationIndex: this.rotationIndex
			};
		return str;
	}
	
	
	drawMesh(instance, subtype){
		
		subtype = subtype || this.subtype;
		
		let mesh;
		let a = game.meshes.pump;
		
		mesh = this.getMesh(a, this.keynum, instance);
		
		return mesh;
	}
	
	
}





