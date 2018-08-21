import {game} from '../../App.js';

import {BaseModel} from './BaseModel.js'


export class PipeNodeModel extends BaseModel{

	constructor(model,connectWithSubmodels){
		
		super();
		
		this.connectWithSubmodels = connectWithSubmodels;
		
		
		this.subtype = "nodemodel";
		this.class = "pipeline";
		
		this.parent = model.parent;
		this.connections = model.connections;
		this.location = model.location;
		this.subconnections = [];
		
		this.inserted = false;
		this.isNode = true;
		
		model.inserted = true;
		
		let a = model.parent.link.models.findIndex(m => {return m === model})
		this.modelIndex = a;
		model.parent.link.models[a] = this;
		model.pointer.link = this;
		this.saved = model;
		
		this.inflow = [];
		this.pressure = 0;
		
		this.flowResistance = 0.001
		this.volume = 0;
		
		this.returnFlow = [];
		
		this.type = "node";
		
		
	}
	
	
	reset(){
		
		this.parent.link.models[this.modelIndex] = this.saved;
		this.pointer.link = this.saved;
		this.saved.pointer.link = this.saved;
		
		return this.saved;
		
	}
	
	
	
	updateFlow(dt){
		
		this.volume = this.parent.link.volume;
		this.pressure = this.parent.link.pressure;
		
		this.pressure = this.volume / 25;
		
		this.inflow.forEach((flow)=>{
			
			if (flow){
				
				if (this.volume + flow.Q < 25){
					
					this.volume += flow.Q;
					
				} else {
					
					let a = 25 - this.volume;
					this.volume = 25;
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
		
		
		for (let i = 0; i < this.connections.length; i++){
			
			let connectedModelPointer = this.connections[i].connectedModelPointer;
			
			if (!connectedModelPointer) { //console.log("error 133"); 
				return ;}
			if (!connectedModelPointer.link) { //console.log("error 134"); 
				return ;}
			
			let connectedModel;
			
			if (connectedModelPointer.link.submodel) {
				connectedModel = connectedModelPointer.link.submodel;
			} else {
				connectedModel = connectedModelPointer.link;
			}
			
			if (!connectedModel) { //console.log("error 144"); 
				return ;}
				
			if (this.pressure > connectedModel.pressure){
				
				if (this.volume > 0){
					
					if (connectedModel.inflow){ ////// attention
						connectedModel.inflow.push({
							Q:(this.pressure - connectedModel.pressure)*10,
							Source: this.pointer
						})
					
						this.volume -= (this.pressure - connectedModel.pressure)*10;
					}
				}
			}
		
		}
		
		this.parent.link.volume = this.volume;
		this.parent.link.pressure = this.pressure;
		
		this.inflow.length = 0;
	}
	
	
	
	

}
