import {game} from './App.js';




export default class Connection {
	
	constructor(args){
		
		this.location = args.location || {x:0, z:0};
		this.size = args.size || {h:1, w:1};
		this.connLocation = args.connLocation || args.conlocation;
		
		this.itemPointer = args.itemPointer || game.nullpointer;
		this.modelPointer = game.nullpointer;
		
		this.connectedItemPointer = game.nullpointer;
		this.connectedModelPointer = game.nullpointer;
		
		this.rlocation = this.location;
		this.rconnLocation = this.connLocation;
		this.r = -1;
		this.rotationIndex = 0;
		
	}
	
	checkRotation(){
		
		if (this.itemPointer.link === null) return false;
		
		let itemRotation = this.itemPointer.link.rotationIndex;
		let itemSize = this.itemPointer.link.itemSize;
		
		if (itemRotation === this.r) {
			
			return true;
		}
		
		if (itemRotation === 0){
			
			this.r = itemRotation;
			this.rlocation = this.location;
			this.rconnLocation = this.connLocation;
			
		} else {
			
			var offsetx = 0;
			var offsetz = 0;
			
			var offsetcx = 0;
			var offsetcz = 0;
			
			switch(itemRotation){
				
				case(1): 	offsetz = itemSize.w - 1;
				
							offsetcz = this.connLocation.x && (this.connLocation.x - itemSize.w/2) * -1 + itemSize.w/2 - 1;
							offsetcx = this.connLocation.z// && (this.connLocation.z - itemSize.h/2) + itemSize.w/2;
							
							break;
				
				case(2): 	offsetz = itemSize.h-1;
						 	offsetx = itemSize.w-1;
						 	
							offsetcz = this.connLocation.z && (this.connLocation.z - itemSize.h/2) * -1 + itemSize.h/2 - 1;
							offsetcx = this.connLocation.x && (this.connLocation.x - itemSize.w/2) * -1 + itemSize.w/2 - 1;
							
						 	break;
						 
				case(3): 	offsetx = itemSize.h-1;
							
							offsetcz = this.connLocation.x// && (this.connLocation.x - itemSize.w/2) + itemSize.h/2;
							offsetcx = this.connLocation.z && (this.connLocation.z - itemSize.h/2) * -1 + itemSize.h/2 - 1;
							
							break;
			};
			
			this.rlocation = {x:this.location.x + offsetx, z:this.location.z + offsetz};
			this.rconnLocation = {x:offsetcx, z:offsetcz};
			this.r = itemRotation;
			
		}
		
		if (this.rconnLocation.x < 0) this.rotationIndex = 0;
		if (this.rconnLocation.x > 0) this.rotationIndex = 2;
		if (this.rconnLocation.z < 0) this.rotationIndex = 3;
		if (this.rconnLocation.z > 0) this.rotationIndex = 1;
		
		return true;
	}
	
	updateLinks(){
		
		let OK = this.checkRotation();
		
		if ( OK && 0
			) {console.log(this.itemPointer.link.rotationIndex, this.r, this.location, this.rlocation, this.connLocation, this.rconnLocation );}
		
		if (!OK) return ;
		
		
		let xx = this.rconnLocation.x + this.itemPointer.link.location.x;
		let zz = this.rconnLocation.z + this.itemPointer.link.location.z;
		
		let item = game.map.getItemFromCoord(xx, zz);
		
		
		if (item !== null) {
			
			this.connectedItemPointer = item.pointer;
			
			item.models.forEach(model => {
				
				if (!model.location) return;
				
				if (model.location.x + model.parent.link.location.x === xx && model.location.z + model.parent.link.location.z === zz){
					
					if (!this.modelPointer.link) {console.log(this); return;}
					
					if (this.modelPointer.link.class === model.class){
						
						this.connectedModelPointer = model.pointer;
					}
				}
			});
			
			//console.log(this.connectedModelPointer);
			
		} else {
			
			this.connectedItemPointer = game.nullpointer;
			this.connectedModelPointer = game.nullpointer;
		}
	}
	
	checkLinks(){
		
		let connModel = this.connectedModelPointer.link;
		let model = this.modelPointer.link;
		
		if (!connModel || !model) return ;
		
		let found = connModel.connections.find(connection => {
			
			if (connection.connectedModelPointer.link === model) return true
			
			return false;
			
		});
		
		if (!found) {
			
			this.connectedModelPointer = game.nullpointer;
			this.connectedItemPointer = game.nullpointer;
			
		}
	}
	
}