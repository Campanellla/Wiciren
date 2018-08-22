import {game} from '../../App.js';

import {BaseModel} from './BaseModel.js'


export class PipeModel extends BaseModel{
	
	
	constructor(setup, parent, combine){
		
		super();
		
		this.subtype = "pipemodel";
		this.class = "pipeline";
		
		if (combine){
			
			this.combined = true;
			
			this.models = setup;
			this.parent = [];
			
			this.models.forEach(model => {
				
				this.parent.push(model.parent);
				model.pointer.link = this;
				
				let index = model.parent.link.models.findIndex(m => {return m === model})
				
				model.parent.link.models[index] = this;
				
			});
			
			this.count = this.parent.length;
			
			this.connections = [null, null];
			
			this.connections[0] = this.models[0].connections.find((connection) => {
				
				return getType(connection.connectedModelPointer.link) !== "pipemodel";
			});
			
			if(this.count === 1) {
				
				this.connections[1] = this.models[this.models.length-1].connections.find((connection)=>{
					return getType(connection.connectedModelPointer.link) !== "pipemodel" && connection !== this.connections[0];
				}); 
				
			} else {
				
				this.connections[1] = this.models[this.models.length-1].connections.find((connection)=>{
					return getType(connection.connectedModelPointer.link) !== "pipemodel";
				}); 
			};
			
			
			
		} else {
			
			this.combined = false;
			
			this.parent = parent.pointer;
			this.location = setup.location;
			
			if (setup.connectionsMap) {
				this.connections = this.setUpConnections(setup.connectionsMap);
			} else {
				this.connections = setup.connections;
			}
			
			
		}
		
		
		
		
		
		
		this.flowResistance = this.count / 1000;
		this.volume = 0;
		
		this.inflow = [];
		
		this.pressure = 0;
		this.returnFlow = [];
		
		
		
		
	}
	
	
	
	reset(){
		
		//console.log(this.combined, this);
		
		if (!this.combined) return false;
		
		this.models.forEach(model => {
			
			model.pointer.link = model;
			
			if (!model.parent.link) return false;
			
			let index = model.parent.link.models.findIndex(model => {return model === this});
			
			if (index !== -1){
				model.parent.link.models[index] = model;
			} else return false;
			
		});
		
		return true;
	}
	
	
	updateFlow(dt){
		
		if (!this.count) return ;
		
		this.volume = 0
		this.pressure = 0
		
		this.parent.forEach(pointer => {
			
			this.volume += pointer.link.volume;
			this.pressure += pointer.link.pressure;
			
		});
		
		this.pressure = this.pressure / this.count;
		
		
		let vmax = this.count * 25;
		
		this.pressure = this.volume / vmax;
		
		this.inflow.forEach((flow)=>{
			
			if (flow){
				
				if (this.volume + flow.Q < vmax){
					
					this.volume += flow.Q;
					
				} else {
					
					let a = vmax - this.volume;
					this.volume = vmax;
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
		
		
		this.connections.forEach((connection)=>{
			
			if (!connection) return ;
			
			let connectedModelPointer = connection.connectedModelPointer;
			
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
					
					connectedModel.inflow.push({
						Q:(this.pressure - connectedModel.pressure) * 20,
						Source: this.pointer
					})
					
					this.volume -= (this.pressure - connectedModel.pressure) * 20;
				}
			}
		});
		
		let b = this.volume / this.count;
		
		/*
		this.list.forEach(pointer => {
			pointer.volume = b;
			pointer.pressure = this.pressure;
		})
		*/
		
		this.inflow.length = 0;
		
		this.parent.forEach(pointer => {
			
			pointer.link.volume = this.volume / this.count;
			pointer.link.pressure = this.pressure;
			
		});
		
		
		
	}
	
	
		
}




function getType(item){
	
	if (!item) return undefined;
	
	if(item.subtype === "pipemodel"){
		if (item.isNode){
			return "node";
		} else {
			return "pipemodel";
		}
	} else {
		
		return item.subtype
	}
	
}