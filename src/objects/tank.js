import {game} from '../App.js';

import {Construction} from './Base.js';



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
		
		this.maxVolume = 250;
		this.flowresistance = 0.2;
		
		this.returnFlow = [];
		this.inflow = [];
		
		this.connectionsMap = [{right: 1}];
	}
	
	
	update(){
		
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
				volume: this.volume,
				inflow: this.inflow,
				reversedflow: this.reversedflow,
				rotationIndex :this.rotationIndex
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
	
	
	
}
