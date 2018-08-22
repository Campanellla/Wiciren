import {game} from './App.js';

import {PipeNodeModel} from "./objects/models/PipeNodeModel.js";
import {PipeCollectionModel} from "./objects/models/PipeCollectionModel.js";
import {PipeModel} from "./objects/models/PipeModel.js";


export default class Pipelines {
	
	constructor(){
		
		this.list = [];
		this.models = [];
		
		this.pipeList = [];
	}
	
	rebuild(){
		
		this.list.length = 0;
		this.models.length = 0;
		
		console.time("rebuild");
		
		
		/// collect all models
		game.map.objectsList.forEach(object => {
			
			if (!object) { console.log("%cobject not exist", "color:red"); return false; }
			
			for (let i = 0; i < object.models.length; i++){
				
				let model = object.models[i];
				
				if (model.class === "pipeline"){
					
					if (model.reset) if (model.reset()) {
						
						model = object.models[i];
					}
					
					this.models.push(model);
				}
			}
		});
		
		
		///// update connections
		this.models.forEach((model) => {
			
			if (!model) {console.log(this.models); return; }
			
			model.inserted = false;
			
			model.connections.forEach(connection => connection.updateLinks());
		})
		
		
		/// remove assymetric connections for models
		this.models.forEach((model) => {
			
			model.connections.forEach(connection => connection.checkLinks());
			
			let a = 0;
			
			model.connections.forEach(connection => {
				
				if (!connection) return ;
				let model = connection.connectedModelPointer.link;
				if (model) a++;
				
			});
			
			model.isNode = (model.subtype === "pipemodel" && a > 2);
			
		});
		
		
		this.models.forEach((model) => {
			
			let result = buildPipeline(model);
			
			if (result) {
				
				//result.list.forEach(model => {if (model.updateSubconnections) model.updateSubconnections();})
				this.list.push(result);
			}
			
		});
		
		//this.models.forEach(e => console.log(e))
		
		
		
		
		console.timeEnd("rebuild");
		
		console.log("rebuilt: ", this.list);
		
	}
	
	update(){
		
		this.list.forEach(pipeline => pipeline.update());
		
	}
	
}



function buildPipeline(model){
	
	if (model.inserted) return null;
	
	var nodes = [];
	var modelStack = [];
	var modelStackId = 0;
	var resultStack = [];
	var currentModel;
	
	modelStack.push(model);
	
	while(modelStackId < modelStack.length) {
		
		currentModel = modelStack[modelStackId];
		
		let a = getType(currentModel);
		
		if (a === "pipemodel" && !currentModel.inserted){
			
			let collectedPipe = collectPipe(currentModel);
			
			if (collectedPipe){
				
				resultStack.push(collectedPipe);
				
				collectedPipe.inserted = true;
				
				collectedPipe.connections.forEach((connection) => {
					
					if (!connection) return ;
					let model = connection.connectedModelPointer.link;
					if (!model) return ;
					
					if (!model.inserted) modelStack.push(model);
					
				});
			}
			
		} else if (a === "node" && !currentModel.inserted){
			
			let node = new PipeNodeModel(currentModel, true);
			
			resultStack.push(node);
			
			node.inserted = true;
			
			node.connections.forEach(connection => {
				
				if (!connection) return ;
				let model = connection.connectedModelPointer.link;
				if (!model) return ;
				
				if (!model.inserted) modelStack.push(model);
			});
			
		} else if ((a === "pumpmodel" || a === "tankmodel") && !currentModel.inserted){
			
			resultStack.push(currentModel);
			
			currentModel.inserted = true;
			
			currentModel.connections.forEach((connection) => {	
				
				if (!connection) return ;
				let model = connection.connectedModelPointer.link;
				if (!model) return ;
				
				if (!model.inserted) modelStack.push(model);
			});
		}
		
		modelStackId++;
		if (modelStackId>1000) throw "buildPipeline loop overflow 1000";
		
	}
	
	//console.clear();
	
	/*
	
	resultStack.forEach((pointer) => {
		if (pointer.type === "combpipe") {
			console.log("combpipe: " + pointer.keys, pointer);
			return
		}
		console.log(pointer.type + ' ' + pointer.key, pointer);
	});
	
	console.log(modelStack);
	*console.log(resultStack);/*
	console.log('-------------------')
	
	*/
	
	return new Pipeline(resultStack);
	
}


function collectPipe(model) {
	
	if (getType(model) !== 'pipemodel' || model.inserted) return null;
	
	var modelStack = []
	var modelStackId = 0;
	
	var currentModel;
	var prevItem;
	
	var reversed = false;
	
	modelStack.push(model);
	model.inserted = true;
	
	while(modelStackId < modelStack.length) {
		
		currentModel = modelStack[modelStackId];
		
		let nextItem = currentModel.connections.find((connection) =>{
			
			let model = connection.connectedModelPointer.link;
			
			return model && !model.inserted && !model.combined && getType(model) === "pipemodel";
		});
		
		if (nextItem) nextItem = nextItem.connectedModelPointer.link
		
		if (nextItem){
			
			reversed = false;
			modelStack.push(nextItem);
			nextItem.inserted = true;
			
		} else if (!reversed) {
			
			reversed = true;
			modelStack.reverse();
			modelStackId--;
			
		}
		
		modelStackId++;
		if (modelStackId>1000) throw "collectpipe loop overflow";
	}
	
	//console.log(modelStack)
	
	return new PipeModel(modelStack, true, true);
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



class Pipeline {
	
	constructor(list){
		
		this.type = "pipeline";
		
		this.list = list; // not pointers inside;
		
		this.nodes = list.filter( (item) => {return item.type === "node"} );
		
		this.models = [];
		
	}
	
	
	update(){
		
		let a = -1//= this.list.findIndex((item) => {return true})
		
		if (a !== -1){
			
			console.log("found non existent item", a);
			
			this.list  = this.list.filter((item) => {return item.exist});
			this.nodes = this.list.filter((item) => {return item.type === "node"});
		}
		
		this.list.forEach(item => {item.updateFlow(0.1)});
		
	}
	
	
}








