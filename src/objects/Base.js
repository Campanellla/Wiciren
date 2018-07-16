import {game} from '../App.js';


export class Construction {
	
	constructor(){
		
		this.pointer = {link:this};
		
		this.exist = true;
		this.inserted = false;
		
		this.mesh;
		
		this.connections = [];
		
		
		
		//// not used
		this.checked = false;
		
		
	}
	
	/// arg bool -> true if need to draw instance only
	draw(instance){
		
		this.mesh = this.drawMesh(instance);
		
		if (!this.mesh) return;
		
		this.mesh.item = this.pointer;
		this.mesh.type = this.type;
		this.mesh.isObject = true;
		
		this.mesh.position.y = 0;
		
		this.rotate(this.rotationIndex);
	}
	
	
	updateLinks(){
		
		this.inserted = false;
		
		this.connections.length = 0;
		
		this.isNode = false;
		
		let a, b, c, d;
		
		let x = this.location.x;
		let z = this.location.z;
		
		let h = this.itemSize.h;
		let w = this.itemSize.w;
		
		for (let i = 0;  i < this.connectionsMap.length; i++){
			
			let xx = x;
			let zz = z;
			
			let sides = ["bottom", "right", "top", "left"];
			
			let a = this.rotationIndex;
			let map = [];
			
			for (let ii = 0; ii < 4; ii++){
				
				let sign = 1;
				let b = (a + ii) % 4;
				
				if ( !(b % 3) && (ii % 3) || (b % 3) && !(ii % 3) ) sign = -1;
				
				let result = this.connectionsMap[i][sides[(a + ii) % 4]];
				if (result !== undefined) map[sides[ii]] = result * sign;
						
			}
			
			if (typeof(map.right) === "number"){
				
				xx += w - 1 + map.right;
				
			} else {
				
				xx += map.left || 0;
			}
			
			if (typeof(map.top) === "number"){
				
				zz += h - 1 + map.top;
				
			} else {
				
				zz += map.bottom || 0;
			}
			
			let item = game.map.getItemFromCoord(xx, zz);
			
			if (item !== null) {
				this.connections.push(item.pointer);
			} else if (this.connectionsMap[i].forced) {
				this.connections.push(null);
			}
			
		}
	}
	
	
	rotate(rotationIndex){
		
		var offsetx = 0;
		var offsetz = 0;
		
		switch(this.rotationIndex){
			
			case(1): offsetz = this.itemSize.w; break;
			case(2): offsetz = this.itemSize.h; offsetx = this.itemSize.w; break;
			case(3): offsetx = this.itemSize.h; break;
			
		};
		
		this.mesh.position.x = this.location.x + offsetx;
		this.mesh.position.z = this.location.z + offsetz;
		this.mesh.rotation.y = this.rotationIndex * game.TAU;
		
	}
	
	getMesh(origin, key, instance){
		
		if(!origin) return null;
		
		if (instance) return origin.createInstance('index: ' + key);
		return new game.BABYLON.Mesh('index: ' + this.keynum, game.scene, null, origin);
		
	}
	
	destruct(){
		
		this.exist = false;
		this.pointer.link = undefined;
		this.mesh.dispose();
		
	}
	
	
}