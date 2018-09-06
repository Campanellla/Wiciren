import {game} from '../../App.js';

import {BaseModel} from './../BaseModel.js'


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
				
				let type = getType(connection.connectedModelPointer.link);
				
				return type !== "pipemodel" && type !== null;
			});
			
			if(this.count === 1) {
				
				this.connections[1] = this.models[this.models.length-1].connections.find((connection)=>{
					
					let type = getType(connection.connectedModelPointer.link);
					
					return type !== "pipemodel" && connection !== this.connections[0] && type !== null;
				}); 
				
			} else {
				
				this.connections[1] = this.models[this.models.length-1].connections.find((connection)=>{
					
					let type = getType(connection.connectedModelPointer.link);
					
					return type !== "pipemodel" && type !== null;
				}); 
			};
			
			
			
		} else {
			
			this.combined = false;
			
			this.count = 1;
			
			this.parent = setup.parentPointer || parent.pointer;
			this.location = setup.location;
			
			if (setup.connectionsMap) {
				this.connections = this.setUpConnections(setup.connectionsMap);
			} else {
				this.connections = setup.connections;
			}
			
			
		}
		
		
		setup.config = setup.config || {};
		
		this.flowResistance = this.count / 1000;
		this.volume = setup.config.volume || 0;
		
		this.inflow = [];
		
		this.pressure =  setup.config.pressure || 0;
		this.returnFlow = [];
		
		
	}
	
	
	
	reset(){
		
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
		
		let vmax = this.count * 25;
		//this.pressure = this.volume / vmax;
		
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
		
		let pressureCombined = 0;
		let pressureCombinedIndex = 0;
		
		for (let i = 0; i < this.connections.length; i++){
			
			if (!this.connections[i] || !this.connections[i].connectedModelPointer.link) continue;
			
			let connectedModel = this.connections[i].connectedModelPointer.link;
			
			if (this.pressure > connectedModel.pressure){
				
				if (this.volume > 0){
					
					connectedModel.inflow.push({
						Q:(this.pressure - connectedModel.pressure) * 20,
						Source: this.pointer
					})
					
					this.volume -= (this.pressure - connectedModel.pressure) * 20;
					
					//console.log((this.pressure - connectedModel.pressure) * 20)
				}
			}
			
			pressureCombined += connectedModel.pressure;
			pressureCombinedIndex++;
		};
		
		let b = this.volume / this.count;
		
		this.inflow.length = 0;
		if (pressureCombinedIndex) this.pressure = pressureCombined / pressureCombinedIndex;
		
	}
	
	save(){
		return {
			pressure:this.pressure,
			volume: this.volume / this.count
		}
	}
	
	
}




function getType(item){
	
	if (!item) return null;
	
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





