import {game} from './App.js';

export default class Pipelines {
	
	
	constructor(){
		
		this.list = [];
		this.pipeList = [];
		
		//console.log("Pipelines class constructed");
		
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
			
			let currentitem = pointer.link;
			
			pointer.link.connections = pointer.link.connections.filter((pointer) => {
				
				return pointer.link.connections.find((pointer) => {return (pointer.link === currentitem)});
				
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
		
		//console.log("update");
		
	}
	
}


	/*
	start from one item
	
	loop 
	
	collect wing with item
		check for item.type 
		case pipe - collect pipes
			if pipe sides == 2 - collect
			if pipe sides == 1 - collect and finish
			if pipe sides >2 make node and finish
		case pump - add item 
		case bottle add item
			//check for number of inlets
				if >1 make bottle node
	
	add wing to pipeline
	
	add node to node list 
	add node to nodestack
	
	check node for free sides
		if one side free - send to loop with item
		if all sides collected - remove node from stack - get new node and check again
		
		if all nodes ended 
		
	return pipeline
	
	start loop with new item
	
		
	
	*/

class CombinedPipe {
	
	constructor(list){
		
		this.pointer = {link:this};
		this.type = "combpipe";
		
		this.list = list;
		this.connections = [undefined, undefined];
		
		this.connections[0] = this.list[0].link.connections.find((pointer)=>{return getType(pointer.link) !== "pipe"});
	
		if (this.connections[0]){
		
			this.connections[1] = this.list[list.length-1].link.connections.find((pointer)=>{
				return getType(pointer.link) !== "pipe" && pointer.link !== this.connections[0].link;	
			});
			
		} else {
			
			this.connections[1] = this.list[list.length-1].link.connections.find((pointer)=>{return getType(pointer.link) !== "pipe"});
		}
			
		this.keys = '';
		list.forEach((pointer) => {this.keys += ' ' + pointer.link.key.toString()});
	}
}


class Node {
	
	constructor(item){
		
		this.pointer = {link:this};
		this.type = "node";
		
		this.connections = [];
		this.inserted = false;
		
		this.item = item;
		
		this.key = item.key;
		
		item.inserted = true;
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
				resultStack.push(result.pointer);
				result.inserted = true;
				
				let filter = result.connections.filter((pointer) => {	
					if (pointer) return !pointer.link.inserted; else return false;
				});
				
				if (filter) filter.forEach(pointer => pointerStack.push(pointer));
			}
			
		} else if (a === "node" && !currentitem.inserted){
			
			let node = new Node(currentitem)
			
			resultStack.push(node.pointer);
			
			node.inserted = true;
			
			let filter = currentitem.connections.filter((pointer) => {	
				if (pointer) return !pointer.link.inserted; else return false;
			});
			
			if (filter) filter.forEach(pointer => pointerStack.push(pointer));
			
		} else if ((a === "pump" || a === "tank") && !currentitem.inserted){
			
			resultStack.push(currentitem.pointer);
			
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
	
	return resultStack
	
}


export function updatePipeline1(dT, tt){
	
	var pipeline = game.pipelines[0];
	
	for (var w = 0; w < pipeline.wings.length; w++){
		
		var wing = pipeline.wings[w];
			
			wing.checkVector();
			
			if (wing.level === 0){
				
				if (wing.vector >= 0){
					
					if (wing.startwithnode){
						wing.lastqueue = true;
					} else {
						wing.lastqueue = false;
					}
					
				} else {
					
					if (wing.startwithnode){
						wing.lastqueue = false;
					} else {
						wing.lastqueue = true;
					}
					
				}
			}
	}
	
	
	
	for (var w = 0; w < pipeline.wings.length; w++){
		
		var wing = pipeline.wings[w];
			
		if(!wing.lastqueue){
			wing.calculate(dT);
		}
		
	}
	for (var w = 0; w < pipeline.wings.length; w++){
		
		var wing = pipeline.wings[w];
			
		if(wing.lastqueue){
			wing.calculate(dT);
		}
		
	}
	
	for(var n = 0; n < pipeline.nodes.length; n++){
		
		var node = pipeline.nodes[n];
		
		node.calculate();
		
		
	}
	
	
	
	
	
	for (var w = pipeline.wings.length - 1; w >= 0; w--){
		
		var wing = pipeline.wings[w];
		
		if(wing.lastqueue){
			wing.transfer(dT);
		}
	}
	
	
	
	for (var w = pipeline.wings.length - 1; w >= 0; w--){
		
		var wing = pipeline.wings[w];
			
		if(!wing.lastqueue){
			wing.transfer(dT);
		}
		
	}
	
	for(var n = 0; n < pipeline.nodes.length; n++){
		
		var node = pipeline.nodes[n];
		
		node.calculate();
		
		
	}
	
}



class Pipeline {
	
	constructor(wings, nodes){
		this.wings = wings;
		this.nodes = nodes;
	}
	
}


class JunctionNode {
	
	constructor(item){
		
		this.baseitem = item;
		this.sides = item.sides;
		this.wingsides = [];
		this.level;
		this.type = 'node';
		this.overinput = {};
		this.pressure = 0;
		
		this.input = [];
		this.output = [];
		this.received = [];
		this.return = [];
		
		this.maxVolume = item.maxVolume;
		this.volume = item.volume;
		
		this.updated = false;
		
	}
	
	update(dT){
	
		this.baseitem.pressure = this.pressure;
		this.baseitem.volume = this.volume;
		
	}
	
	
	calculate(dT){
		
		this.updated = false;
		
	}
	
	plan(prevItem, item, nextItem){
		
		if (item.input[0] !== undefined){
				
			if (item.volume < item.maxVolume) {
					
					var qq = item.maxVolume - item.volume;
					
					if (item.input[0].Qmax <= qq) {
					 	
					 	item.received.push(item.input[0].Qmax);
					 	
					} else {
					 	
					 	item.received.push(qq);
					 	item.output.push(item.input[0].Qmax - qq);
					}
			
			} else {
				
				if (nextItem !== undefined){
					item.output.push(item.input[0].Qmax);
				}
			}
		}	
		
		
		if (prevItem === undefined){
			
			if(item.output[0] !== undefined){
				
				nextItem.input.push({Source:item, Qmax:item.output[0]});
				
			}
		}
		
	}
	
	transfer(prevItem, item, nextItem){
		
		if (item.input.length > 10) console.log(item)
			
		if (item.received[0] !== undefined){
			
			item.volume += item.received[0];
			
			item.received = [];
		}
		
		var inlet = 0;
		var outlet = 0;
		var received = 0;
		var source;
		var returned = 0;
		
		if (item.output[0] !== undefined ) {
			for (var i = 0; i < item.output.length; i++){
				outlet += item.output[i];
			}
		}
			
		if (item.received[0] !== undefined ){
			for (var i = 0; i < item.received.length; i++){
		 		received += item.received[i];
		 	}
		}
		
		if (item.return[0] !== undefined){
			for (var i = 0; i < item.return.length; i++){
				returned += item.return[i].Q;
			}
		}
		
		if (item.input[0] !== undefined ) {
			
			for (var i = 0; i < item.input.length; i++){
				inlet += item.input[i].Qmax;
			}
			
			source = item.input[0].Source
			source.return.push({Q:inlet - outlet - received + returned});
			
			//console.log(inlet - outlet - received + returned)
		}
		
		item.output = [];
		item.received = [];
		item.input = [];
		item.return = [];
		
		
		if (source !== undefined && !isNaN(source.pressure)) {
			
			item.pressure = source.pressure - 0.0001 // - 0.00001 * (inlet - outlet) - 0.0001
		} else {
							
			item.pressure = item.volume/1000;
		}
		
		item.update();
		item.updated = true;
		item.output = [];
		item.input = [];
		
	}
		
}


class Wing {
	
	constructor(item){
		this.items = [];
		this.nodes = [];
		this.startwithnode = false;
		this.level;
		
		this.nodeToNode;
		this.vector;
	}
	
	push(item){
		this.items.push(item);
	}
	
	pushnode(node){
		
		node.links = node.baseitem.links;
		
		this.push(node);
		this.nodes.push(node);
	}
	
	checkVector(){
		
		var lastIndex = this.items.length-1;
		
		if(this.items[0].type === "node" && this.items[lastIndex].type === "node"){
			
			this.nodeToNode = true;
			
		} else {
			
			this.nodeToNode = false;
				
		}
		
		if (this.items[0].pressure > this.items[lastIndex].pressure){
				
			this.vector = 1;
				
		} else if (this.items[0].pressure < this.items[lastIndex].pressure){
				
			this.vector = -1;
				
		} else{
				
			this.vector = 0;
				
		}
		
	}
	
	calculate(dT){
		
		var planTransfer = planTransfer.bind(this)
		
		var item = undefined;
		var prevItem = undefined;
		var nextItem = undefined;
		
		
		if (this.vector >= 0){
			
			for(var i = 0; i < this.items.length; i++){
				
				item = this.items[i];
				
				if (i > 0){
					prevItem = this.items[i-1];
				} else {
					prevItem = undefined;
				}
				
				if(i < this.items.length){
					nextItem = this.items[i+1];
				} else {
					prevItem = undefined;
				}
				
				planTransfer(prevItem, item, nextItem);
				
			}
			
		} else {
			
			for(var i = this.items.length-1; i >= 0; i--){
				
				item = this.items[i];
				
				if (i < this.items.length){
					prevItem = this.items[i+1];
				} else {
					prevItem = undefined;
				}
				
				if(i > 0){
					nextItem = this.items[i-1];
				} else {
					nextItem = undefined;
				}
				
				
				planTransfer(prevItem, item, nextItem);
				
			}
			
		}
		
		
		
		
		function planTransfer(prevItem, item, nextItem){
				
			if (item.type === 'pump'){
				
				
				if (item.destvector === nextItem){
					
					if (prevItem !== undefined){
					
					} else {
						
						nextItem.input.push({Source:item, Qmax:10});
						item.output.push(10);
						
					}
						
				} else {
					
					if (nextItem !== undefined){
					
					} else {
						
						prevItem.input.push({Source:item, Qmax:10});
						item.output.push(10);
						
					}
					
				}
				
			} else if(item.type === 'combpipe'){
				
				item.plan(prevItem, item, nextItem);
				
			} else if(item.type === 'node'){
				
				item.plan(prevItem, item, nextItem);
				

			} else if (item.type === 'bottle'){
				
				if (item.input[0] !== undefined){
					
					item.received.push(item.input[0].Qmax);
					
				}
				
			}
		
		}
	}
	
	transfer(dT){
		
		var fn = fn.bind(this)
		
		var item = undefined;
		var prevItem = undefined;
		var nextItem = undefined;
		
		
		if (this.vector >= 0){
			
			for(var i = 0; i < this.items.length; i++){
				
				item = this.items[i];
				
				if (i > 0){
					prevItem = this.items[i-1];
				} else {
					prevItem = undefined;
				}
				
				if(i < this.items.length){
					nextItem = this.items[i+1];
				} else {
					prevItem = undefined;
				}
				
				fn(prevItem, item, nextItem);
				
			}
			
		} else {
			
			for(var i = this.items.length-1; i >= 0; i--){
				
				item = this.items[i];
				
				if (i < this.items.length){
					prevItem = this.items[i-1];
				} else {
					prevItem = undefined;
				}
				
				if(i > 0){
					nextItem = this.items[i+1];
				} else {
					prevItem = undefined;
				}
				
				
				fn(prevItem, item, nextItem);
				
			}
			
		}
		
		/// transfer ///
		function fn(prevItem, item, nextItem){
			
			if (item.type === "pump"){ /// pump 
				
				var returned = 0;
				
				if (item.return[0] !== undefined){
					item.volume += item.return[0].Q
					
					returned = item.return[0].Q
					item.return = [];
				}
				
				if (item.output[0] !== undefined){
						
					var pumped = item.output[0]-returned;
					
					if (pumped < 0) pumped = 0;
						
					item.pressure = 10;
					
					item.Q = pumped;
						
				}
				
				item.output = [];
				
				if (item.input.length > 10) {
					console.log(item);
					item.input = [];
				}

				/// PIPEs
			} else if (item.type === "combpipe") {
				
				item.transfer(prevItem, item, nextItem);
				
			} else if (item.type === "node" && !item.updated){
				
				item.transfer(prevItem, item, nextItem);
				
			} else if(item.type === 'bottle'){
				
				if (item.received[0] !== undefined){
					
					item.volume += item.received[0];
					item.received = [];
					
				}
				
				item.input = [];
				
			} 
			
		}
		
		
		
	}
	
}


class CombinedPipe1 {
	
	constructor(pipes){
		this.pipes = pipes;
		this.keys = '';
		this.volume = 0;
		this.resistance = 0;
		this.type = 'combpipe';
		this.maxVolume = 0;
		this.pressure = 0;
		
		this.input = [];
		this.output = [];
		this.received = [];
		this.return =[];
		
		this.flow = 0;
		this.flowvector = 0;
		this.dQ = 0;
		this.Q = 0;
		
		pipes.forEach((item)=>{
			
			this.keys += item.key+' ';
			this.volume += item.volume;
			this.maxVolume += item.maxVolume;
			this.resistance += 0.001;
			
		});
	}
	
	update(){
		for(var i = 0; i < this.pipes.length; i++){
			this.pipes[i].volume = this.volume / this.pipes.length;
			this.pipes[i].pressure = this.pressure;
		}
	}
	
	plan(prevItem, item, nextItem){
		
			
		if (item.volume >= item.maxVolume){
			
			if (item.input[0] !== undefined){
			
				nextItem.input.push({Source:item, Qmax:item.input[0].Qmax});
				
			}
			
		} else {
			
			var a = item.maxVolume - item.volume;
			
			if (item.input[0] !== undefined){
				
				if (a < item.input[0].Qmax){
					
					nextItem.input.push({Source:item, Qmax:item.input[0].Qmax-a});
					item.received.push(a);
					
				} else {
					
					item.received.push(item.input[0].Qmax);
					
				}
			}
		}
	
	}
	
	transfer(prevItem, item, nextItem){
		 
				
		if (item.input.length > 10) console.log(item)
		
		if(item.input[0] !== undefined){
			
			var source = item.input[0].Source;
			
			if (item.return[0] !== undefined){
				
				source.return.push({Q:item.return[0].Q})
				
				item.return = [];
				
			}
			
			if (item.received[0] !== undefined){
				
				item.volume += item.received[0]
			}
			var returned = 0
			
			if (item.return[0] !== undefined) returned = item.return[0].Q;
			
			if (item.input[0] !== undefined){
				
				item.pressure = source.pressure - 0.001 * (item.input[0].Qmax - returned)
			}

			
			item.input = [];
			item.received = [];
			
		}
		
		item.update();
		
		
				/// NODE
	}
	
}


function collectWing(item, enternode){
	
	var nextitem;
	var wing = new Wing();
	
	var pipecollection = [];
	var step = true;
	var count = 0;
	var node;
	
	var setdestvector;
	
	if (enternode !== undefined){
		wing.pushnode(enternode);
		wing.startwithnode = true;
	}
	
	while(step){
		
		if (item !== undefined && (!item.checked || item.links.length > 2)){
			
			if (item.type === 'pump'){
				
				if (pipecollection.length > 0){
					wing.push(new CombinedPipe(pipecollection));
					
					if (setdestvector !== undefined){
						wing.items[wing.items.length-2].destvector = wing.items[wing.items.length-1];
						setdestvector = undefined;
					}
					
					pipecollection = new Array();
				}
				
				if (item.links[1]){
					if (item.links[1].link.object.checked === true){
						if(wing.items.length > 0){
							item.destvector = wing.items[wing.items.length-1];
						}
					} else {
						setdestvector = item;
					}
				}
				
				wing.push(item);
				item.checked = true;
				nextitem = item.links[1].object.link;
				
			} else if (item.type === 'tank'){
				
				if (pipecollection.length > 0){
					wing.push(new CombinedPipe(pipecollection));
					
					if (setdestvector !== undefined){
						wing.items[wing.items.length-2].destvector = wing.items[wing.items.length-1];
						setdestvector = undefined;
					}
					
					pipecollection = new Array();
				}
				
				wing.push(item);
				
				if (setdestvector !== undefined){
					wing.items[wing.items.length-2].destvector = wing.items[wing.items.length-1];
					setdestvector = undefined;
				}
				
				item.checked = true;
				nextitem = undefined;
				step = false;
				
				
				
			} else if (item.type === 'pipe'){
				
				if (item.links.length === 2 ){
					
					pipecollection.push(item);
					item.checked = true;
					if (!item.links[0].link.checked){
						nextitem = item.links[0].link;
					} else {
						nextitem = item.links[1].link;
					}
					
				} else if (item.links.length > 2){
					
					if (pipecollection.length > 0){
						
						wing.push(new CombinedPipe(pipecollection));
						
						if (setdestvector !== undefined){
							wing.items[wing.items.length-2].destvector = wing.items[wing.items.length-1];
							setdestvector = undefined;
						}
						pipecollection = new Array();
					}
					
					node = new JunctionNode(item)
					
					if (setdestvector !== undefined){
						wing.items[wing.items.length-2].destvector = wing.items[wing.items.length-1];
						setdestvector = undefined;
					}
					
					wing.pushnode(node);
					item.checked = true;
					
					step = false;
					
				} else if (item.links.length === 1){
					
					if (!item.links[0].link.checked){
						
						nextitem = item.links[0].link;
						pipecollection.push(item);
						item.checked = true;
						
					}else{
						item.checked = true;
						
						wing.push(item)
						
						if (setdestvector !== undefined){
							wing.items[wing.items.length-2].destvector = wing.items[wing.items.length-1];
							setdestvector = undefined;
						}
						
						step = false;
					}
				}
			}
			
		} else {
			step = false;
			
		}
		
		item = nextitem;
		
		count++;
		if (count > 10){
			step = false ;
			console.log("forced finish");
			throw " limit exceeded at collectWing "
		}
	}
	
	
	//console.log({wing:wing, node:node})
	
	return {wing:wing, node:node};
	
}






