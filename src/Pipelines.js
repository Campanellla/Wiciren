import {game} from './App.js';

export default class Pipelines {
	
	
	constructor(){
		
		this.list = [];
		this.pipeList = [];
		
	}
	
	rebuild(){
		
		this.list.length = 0;
		
		console.time("rebuild");
		
		/// get pipe, pump, etc to list
		
		this.pipeList = game.map.objectsList.filter((pointer)=>{
			if (!pointer.link) return false
			if (pointer.link.type === "pipe" 
				|| pointer.link.type === "tank" 
				|| pointer.link.type === "pump"){
				return true;
			};
		});
		
		this.pipeList.forEach((pointer) => { pointer.link.updateLinks() });
		
		/// remove connection if it only from one side and check if item is node
		
		this.pipeList.forEach((pointer) => {
			
			let currentitem = pointer;
			
			pointer.link.connections = pointer.link.connections.filter((pointer) => {
				
				return pointer.link.connections.find((pointer) => {return (pointer === currentitem)});
				
			});
			
			if (pointer.link.type === "pipe" && pointer.link.connections > 2) {
				
				pointer.link.isNode = true;
				
			}
			
			let result = buildPipeline(pointer);
			
			if (result) this.list.push(result);
			
		});
		
		console.timeEnd("rebuild");
		
		console.log("rebuilt: ", this.list);
		
	}
	
	update(){
		
		this.list.forEach(pipeline => pipeline.update());
		
		//console.log("update");
		
	}
	
}


class CombinedPipe {
	
	constructor(list){
		
		this.pointer = {link: this};
		this.type = "combpipe";
		this.exist = true;
		
		this.keys = '';
		
		this.list = list; // pointers inside
		this.connections = [undefined, undefined];
		
		this.connections[0] = this.list[0].link.connections.find((pointer)=>{return getType(pointer.link) !== "pipe"});
		
		
		if(this.list.length === 1) {
			this.connections[1] = this.list[list.length-1].link.connections.find((pointer)=>{
				return getType(pointer.link) !== "pipe" && pointer !== this.connections[0];
			}); 
		} else {
			this.connections[1] = this.list[list.length-1].link.connections.find((pointer)=>{
				return getType(pointer.link) !== "pipe";
			}); 
		}
		
		for (let i = 0; i < this.list.length; i++){
			
			let pointer = this.list[i];
			
			this.keys += ' ' + pointer.link.key.toString();
			this.volume += pointer.link.volume;
			
		}
		
		if (this.connections[0]) {
			
			let index = this.connections[0].link.connections.findIndex((pointer) => {return (pointer === this.list[0]);})
			if (index > -1) this.connections[0].link.connections[index] = this.pointer;
		}
		if (this.connections[1]) {
			
			let index = this.connections[1].link.connections.findIndex((pointer) => {return (pointer === this.list[this.list.length-1]);})
			if (index > -1) this.connections[1].link.connections[index] = this.pointer;
		}
		
		
		this.flowResistance = this.list.length / 1000;
		this.volume = 0;
		
		this.inflow = [];
		
		this.pressure = 0;
		this.returnFlow = [];
		
	}
	
	
	updateFlow(dt){
		
		if (!this.list.length) return ;
		
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
		
		let b = this.volume / this.list.length;
		
		this.list.forEach(pointer => {
			pointer.link.volume = b;
			pointer.link.pressure = this.pressure;
		})
		
		this.inflow.length = 0;
	}
	
	
}


class Node {
	
	constructor(item){
		
		this.pointer = {link:this};
		this.type = "node";
		this.exist = true;
		
		this.connections = [];
		this.inserted = false;
		
		this.itemPointer = item.pointer;
		
		this.key = item.key;
		
		item.inserted = true;
			
		this.inflow = [];
		this.pressure = 0;
		
		this.connections = this.itemPointer.link.connections.slice(0);
		
		for (let i = 0; i < this.connections.length; i++){
			
			let parentPointer = this.connections[i];
			
			if (parentPointer){
				
				let i = 0;
			
				let index = parentPointer.link.connections.forEach((pointer) => {
				
					if (!pointer || !pointer.link) {
						
						console.log("removed")
						
						parentPointer.link.connections[i] = undefined;
						return
					};
				
					if(pointer.link === this.itemPointer.link){
						parentPointer.link.connections[i] = this.pointer;
					}
				i++
				});				
			}
		}
		
		this.flowResistance = 0.001
		this.volume = 0;
		
		this.returnFlow = [];
	}
	
	updateFlow(dt){
		
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
		
		this.itemPointer.link.volume = this.volume;
		this.itemPointer.link.pressure = this.pressure;
		
		this.inflow.length = 0;
	}
	
}



function getType(item){
	
	if (!item) return undefined;
	if (item.link) item = item.link;
	
	if(item.type === "pipe"){
		if (item.connections.length > 2 || item.isNode){
			return "node";
		} else {
			return "pipe";
		}
	} else {
		
		return item.type
	}
	
}

function collectPipe(pipe) {
	
	if (getType(pipe) !== 'pipe') return null;
	if (pipe.inserted) return null;
	
	var pointerStack = []
	var pointerStackId = 0;
	
	var currentitem;
	var prevItem;
	
	var reversed = false;
	
	pointerStack.push(pipe.pointer);
	pipe.inserted = true;
	
	while(pointerStackId < pointerStack.length) {
		
		currentitem = pointerStack[pointerStackId].link;
		
		let nextItem = currentitem.connections.find((pointer) =>{
			
			let item = pointer.link;
			
			return !item.inserted && getType(item) === "pipe";
		});
		
		if (nextItem){
			
			reversed = false;
			pointerStack.push(nextItem);
			nextItem.link.inserted = true;
			
		} else if (!reversed) {
			
			reversed = true
			pointerStack.reverse();
			pointerStackId--;
			
		}
		
		pointerStackId++;
		if (pointerStackId>1000) throw "collectpipe loop overflow";
	}
	
	return new CombinedPipe(pointerStack);
}


	

function buildPipeline(pointer){
	
	if (!pointer){
		console.log("error:", pointer);
		return
	}
	
	if (pointer.link.inserted) return null;
	
	var nodes = [];
	var pointerStack = [];
	var pointerStackId = 0;
	var resultStack = [];
	var currentitem;
	var currentPointer;
	
	pointerStack.push(pointer);
	
	
	while(pointerStackId < pointerStack.length) {
		
		currentitem = pointerStack[pointerStackId].link;
		
		let a = getType(currentitem);
		
		if (a === "pipe" && !currentitem.inserted){
			
			let result = collectPipe(currentitem);
			
			if (result){ 
				resultStack.push(result);
				result.inserted = true;
				
				let filter = result.connections.filter((pointer) => {	
					if (pointer) return !pointer.link.inserted; else return false;
				});
				
				if (filter) filter.forEach(pointer => pointerStack.push(pointer));
			}
			
		} else if (a === "node" && !currentitem.inserted){
			
			let node = new Node(currentitem)
			
			resultStack.push(node);
			
			node.inserted = true;
			
			let filter = currentitem.connections.filter((pointer) => {	
				if (pointer) return !pointer.link.inserted; else return false;
			});
			
			if (filter) filter.forEach(pointer => pointerStack.push(pointer));
			
		} else if ((a === "pump" || a === "tank") && !currentitem.inserted){
			
			resultStack.push(currentitem);
			
			currentitem.inserted = true;
			
			let filter = currentitem.connections.filter((pointer) => {	
				if (pointer) return !pointer.link.inserted; else return false;
			});
			
			if (filter) filter.forEach(pointer => pointerStack.push(pointer));
			
		}
		
		
		pointerStackId++;
		if (pointerStackId>1000) throw "buildPipeline loop overflow";
		
	}
	
	//console.clear();
	/*
	resultStack.forEach((pointer) => {
		if (pointer.link.type === "combpipe") {
			console.log("combpipe: " + pointer.link.keys, pointer.link);
			return
		}
		console.log(pointer.link.type + ' ' + pointer.link.key, pointer.link);
	})
	*/
	//console.log(resultStack);
	
	return new Pipeline(resultStack);
	
}

class Pipeline {
	
	constructor(list){
		
		this.type = "pipeline";
		
		this.list = list; // not pointers inside;
		
		this.nodes = list.filter( (item) => {return item.type === "node"} );
		
	}
	
	
	update(){
		
		let a = this.list.findIndex((item) => {return !item.exist})
		
		if (a !== -1){
			
			console.log("found non existent item", a);
			
			this.list  = this.list.filter((item) => {return item.exist});
			this.nodes = this.list.filter((item) => {return item.type === "node"});
		}
		
		this.list.forEach(item => {item.updateFlow(0.1)});
		
	}
	
	
	
	
	
	
}








