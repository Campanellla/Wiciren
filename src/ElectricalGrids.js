import {game} from './App.js';





export default class ElectricalGrids {
	
	constructor(){
		
		this.list = [];
		this.models = [];
		this.itemList =[];
		
	}
	
	
	rebuild(){
		
		this.list.length = 0;
		this.models.length = 0;
		
		
		game.map.objectsList.forEach(object => {
			
			if (!object) { console.log("%cobject not exist", "color:red"); return false; }
			
			for (let i = 0; i < object.models.length; i++){
				let model = object.models[i];
				if (model.class === "electric"){
					
					if (model.reset && model.reset()) {
						model = object.models[i];
					}
					this.models.push(model);
				}
			}
		});
		
		
		///// update connections
		this.models.forEach((model) => {
			
			if (!model) {console.log("model not found"); return; }
			
			model.inserted = false;
			
			model.connections.forEach(connection => connection.updateLinks());
			
			
			console.log("rotationIndex:", model.parent.link.rotationIndex);
			console.log("location:", model.parent.link.location);
			console.log("mlocation:", model.location);
			console.log("conns:", model.connections);
			
			
		})
		
		
		
		
		console.log(this.models)
		
		
		
		
		
		
		
		
	}
	
	
	update(){
		
		this.list.forEach(electricalGrid => electricalGrid.update());
		
	}
	
}

class ElectricalGrid {
	
	constructor(list){
		
		this.type = "electricalGrid";
		this.models = list;
		
		this.sources = [];
		this.consumers = [];
		
	}
	
	
	update(){
		
		this.models.forEach(model => {model.update(1/60)});
		
	}
	
}




















