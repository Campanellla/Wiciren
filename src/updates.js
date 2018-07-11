import {game} from './App.js';




export function updateObjects(dtime){
	
	game.pipelist = [];
	
	game.map.objectsList.forEach(function(object){
		if (!object.link) return
		object.link.update(dtime);
	});
	
	if (game.updatePipelines){
		
		game.updatePipelines = false;
		game.pipelines.rebuild();
				
	}
			
	game.pipelines.update();
	
};




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



class CombinedPipe {
	
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
		
		if (item !== undefined && !item.inserted){
			
			if (item.type === 'pump'){
				
				if (pipecollection.length > 0){
					wing.push(new CombinedPipe(pipecollection));
					
					if (setdestvector !== undefined){
						wing.items[wing.items.length-2].destvector = wing.items[wing.items.length-1];
						setdestvector = undefined;
					}
					
					pipecollection = new Array();
				}
				
				if (item.destination !== undefined){
					if (item.destination.object.inserted === true){
						if(wing.items.length > 0){
							item.destvector = wing.items[wing.items.length-1];
						}
					} else {
						setdestvector = item;
					}
				}
				
				wing.push(item);
				item.inserted = true;
				nextitem = item.destination.object;
				
			} else if (item.type === 'bottle'){
				
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
				
				item.inserted = true;
				nextitem = undefined;
				step = false;
				
				
				
			} else if (item.type === 'pipe'){
				
				if (item.sides.length === 2 ){
					
					pipecollection.push(item);
					item.inserted = true;
					if (!item.sides[0].inserted){
						nextitem = item.sides[0];
					} else {
						nextitem = item.sides[1];
					}
					
				} else if (item.sides.length > 2){
					
					
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
					item.inserted = true;
					
					step = false;
					
				} else if (item.sides.length = 1){
					
					if (!item.sides[0].inserted){
						
						nextitem = item.sides[0];
						pipecollection.push(item);
						item.inserted = true;
						
					}else{
						item.inserted = true;
						
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
		if (count > 1000){
			step = false ;
			throw " limit exceeded at collectWing "
		}
	}
	
	
	
	return {wing:wing, node:node};
	
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

export function updatePipeline(dT, tt){
	
	if (game.toggle) {
		console.log(game.pipelist)
	};
		
	game.toggle = false;
	game.pipelines = [];
	
	var pipelist = game.pipelist;
	var pipelines = game.pipelines;
	
	var currentitem = pipelist[0];
	
	var nodelist = [];
	var nodestack = [];
	var nodestackid = 0;
	var winglist = [];
	
	var a = collectWing(currentitem);
	//console.log(a);
	
	if (a.node !== undefined){
		//a.node.wingsides.push(a.wing);
		nodelist.push(a.node);
		nodestack.push(a.node);			
	}
	
	if (nodestack[nodestackid] !== undefined){
		nodestack[nodestackid].wingsides.push(a.wing);
	}
	winglist.push(a.wing);	
	
	var loopcount = 0;
	
	var step = true;
	
	while (step){
		
		var b = undefined;
		nodestack[nodestackid].sides.forEach(function(item){
			if (!item.inserted) {
				b = item;
				return item;
			} 
		})
		
		if (b !== undefined){
			
			currentitem = b;
			var a = collectWing(currentitem, nodestack[nodestackid]);
			
			//console.log(a);
			
			if (nodestack[nodestackid] !== undefined){
				nodestack[nodestackid].wingsides.push(a.wing);
			}
			
			if (a.node !== undefined){
				a.node.wingsides.push(a.wing);
				nodelist.push(a.node);
				nodestack.push(a.node);
				
			}

			winglist.push(a.wing);	
			
		} else {
			
			nodestackid++;
			
		}
		
		loopcount++;
		if(nodestack[nodestackid] === undefined ||  loopcount > 100){
			step = false;
		}
	}
	
	console.log("nodestack: ")
	console.log(nodestack);
	
	console.log("winglist: ")
	console.log(winglist);
	
	pipelines.push(new Pipeline(winglist, nodelist));

	///   set levels for pipes and nodes /////
	
	var pipeline = pipelines[0];
	var numcounter = 0;
	
	pipeline.wings.forEach(function(wing){
		
		if(wing.nodes.length < 2){
			wing.level = 0;
			numcounter++;
		};
		
	});
	
	pipeline.nodes.forEach(function(node){
		
		var num = 0;
		var sum = 0;
		var haslevel0 = false;
		
		node.wingsides.forEach(function(wing){
			num++;
			if (wing.level !== undefined){
				haslevel0 = true;
				sum += wing.level;
			} else {
				sum += sum/num + 1;
			}
		});
		
		if (haslevel0 && num !== 0){
			node.level = sum / num;
		}
		
	});
	
	pipeline.wings.forEach(function(wing){
		
		if(wing.level === undefined){
			wing.level = 1;
			numcounter++;
		};
		
	});
	
	pipeline.wings.sort((a, b) => a.level - b.level);
	pipeline.nodes.sort((a, b) => a.level - b.level);
	
	console.log(numcounter)
	
	pipeline.maxlevel = 1;
	
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









