import {game} from '../App.js';


export class Construction {
	
	constructor(){
		
		this.pointer = {link:this};
		
		this.exist = true;
		this.inserted = false;
		
		this.visible = false;
		
		this.mesh;
		
		this.connections = [];
		
		document.a = this;
		
	}
	
	/// arg bool -> true if need to draw instance only
	draw(instance){
		
		this.mesh = this.drawMesh(instance);
		
		if (!this.mesh) return;
		
		this.mesh.item = this.pointer;
		this.mesh.type = this.type;
		this.mesh.isObject = true;
		
		this.mesh.position.y = 0;
		
		this.visible = true;
		
		this.rotate(this.rotationIndex);
	}
	
	
	makeArrows() {
		
		let a = this.getConnectionsCoordinates();
		
		let meshes = [];
		
		a.forEach((c) => {
			
			let mesh = this.getMesh(game.meshes.arrow, '');
			
			if (!mesh) return
			
			mesh.rotation.y = c.rotationIndex * game.TAU;
			
			mesh.material = game.materials.ycolor;
			mesh.isPickable = false;
			
			meshes.push(mesh);
			
			mesh.position.x = this.location.x + c.x + 0.5;
			mesh.position.y = this.location.y || 0.25;
			mesh.position.z = this.location.z + c.z + 0.5;
			
		});
		
		return meshes;
		
	}
	
	
	getConnectionsCoordinates(){
		
		let h = this.itemSize.h;
		let w = this.itemSize.w;
		let r = this.rotationIndex;
		
		let coordinates = [];
		
		const sides = ["bottom", "right", "top", "left"];
		
		for(let i = 0; i < this.connectionsMap.length; i++){
			
			let x = 0;
			let z = 0;
			let map = [];
			let rotationIndex = 0;
			
			for (let ii = 0; ii < 4; ii++){
				
				let sign = 1;
				let b = (r + ii) % 4;
				
				if ( !(b % 3) && (ii % 3) || (b % 3) && !(ii % 3) ) sign = -1;
				
				let result = this.connectionsMap[i][sides[b]];
				if (result !== undefined) map[sides[ii]] = result * sign;
			}
			
			if (typeof(map.right) === "number"){
				
				x += w - 1 + map.right;
				if (map.right) rotationIndex = 2;
				
			} else {
				
				x += map.left || 0;
				if (map.left < 0) rotationIndex = 0;
			}
			
			if (typeof(map.top) === "number"){
				
				z += h - 1 + map.top;
				if (map.top) rotationIndex = 1;
				
			} else {
				
				z += map.bottom || 0;
				if (map.bottom < 0) rotationIndex = 3;
			}
			
			coordinates.push({x:x, z:z, rotationIndex:rotationIndex});		
		}
		
		return coordinates
	}
	
	
	updateLinks(){
		
		this.inserted = false;
		this.connections.length = 0;
		this.isNode = false;
		
		let x = this.location.x;
		let z = this.location.z;
		
		let rotatedConnectionsMap = this.getConnectionsCoordinates();
		
		for (let i = 0;  i < rotatedConnectionsMap.length; i++){
			
			let xx = rotatedConnectionsMap[i].x + x;
			let zz = rotatedConnectionsMap[i].z + z;
			
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
		
		rotationIndex = rotationIndex || this.rotationIndex;
		
		switch(rotationIndex){
			
			case(1): offsetz = this.itemSize.w; break;
			case(2): offsetz = this.itemSize.h; offsetx = this.itemSize.w; break;
			case(3): offsetx = this.itemSize.h; break;
			
		};
		
		this.mesh.position.x = this.location.x + offsetx;
		this.mesh.position.z = this.location.z + offsetz;
		this.mesh.rotation.y = rotationIndex * game.TAU;
		
		
		
	}
	
	
	getMesh(origin, key, instance){
		
		if(!origin) return null;
		
		if (instance) return origin.createInstance('index: ' + key);
		return new game.BABYLON.Mesh('index: ' + key, game.scene, null, origin);
		
	}
	
	
	destruct(){
		
		this.exist = false;
		this.pointer.link = undefined;
		this.mesh.dispose();
		
		this.visible = false;
		
	}
	
	setState(state){
		
		switch (state){
			
			case "constructor": 
			
				if (!this.visible) this.draw();
			
				this.mesh.visibility = 0.5;
				this.mesh.isPickable = false;
				break;
				
			case "active" :
			
				if (!this.visible) this.draw();
				
				this.mesh.visibility = 1;
				this.mesh.isPickable = true;
				break;
				
			case "inactive" :
			
				if (this.visible){
					
					this.mesh.dispose();
					this.visible = true;
				}
				break;
				
			default : break;
			
			
		}
		
		
		
	}
	
	
}