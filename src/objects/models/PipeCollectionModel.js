import {game} from '../../App.js';

import {BaseModel} from './BaseModel.js'


export class PipeCollectionModel extends BaseModel{
	
	constructor(list, connectWithSubmodels){
		
		super();
		
		this.connectWithSubmodels = connectWithSubmodels;
		
		this.subtype = "pipecollection";
		this.class = "pipeline";
		
		this.parents = list;
		this.list = list; 
		
		list.forEach(model => {
			
			model.submodel = this;
			
		});
		
		this.connections = [null, null];
		this.subconnections = [null, null];
		
		this.connections[0] = list[0].connections.find((connection) => {
			
			return getType(connection.connectedModelPointer.link) !== "pipemodel";
		});
		
		if(list.length === 1) {
			
			this.connections[1] = list[list.length-1].connections.find((connection)=>{
				return getType(connection.connectedModelPointer.link) !== "pipemodel" && connection !== this.connections[0];
			}); 
			
		} else {
			
			this.connections[1] = list[list.length-1].connections.find((connection)=>{
				return getType(connection.connectedModelPointer.link) !== "pipemodel";
			}); 
		}
		
		
		this.type = "combpipe";    ////---
		
		
		this.flowResistance = this.list.length / 1000;
		this.volume = 0;
		
		this.inflow = [];
		
		this.pressure = 0;
		this.returnFlow = [];
		
		
	}
	
	
	updateFlow(dt){
		
		if (!this.list.length) return ;
		
		this.volume = 0
		this.pressure = 0
		
		this.list.forEach(model => {
			
			this.volume += model.parent.link.volume;
			this.pressure += model.parent.link.pressure;
			
		});
		
		this.pressure = this.pressure / this.list;
		
		
		let vmax = this.list.length * 25;
		
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
						Q:(this.pressure - connectedModel.pressure)*20,
						Source: this.pointer
					})
					
					this.volume -= (this.pressure - connectedModel.pressure)*20;
				}
			}
		});
		
		let b = this.volume / this.list.length;
		
		this.list.forEach(pointer => {
			pointer.volume = b;
			pointer.pressure = this.pressure;
		})
		
		this.inflow.length = 0;
		
		
		this.list.forEach(model => {
			
			model.parent.link.volume = this.volume / this.list.length;
			model.parent.link.pressure = this.pressure;
			
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









