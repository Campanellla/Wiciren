import {game} from './../App.js';


export class Construction {
	
	constructor(){
		this.pointer = {link:this};
		
		this.type;
		this.subtype;
		
		this.exist = true;
		this.inserted = false;
		this.visible = false;
		this.constructionSize;
		
		this.mesh;
		this.models = [];
	}
	
	/// maybe will not be used
	renewModel(model1, model2) {
		
		let index = this.models.findIndex(model => {return model1 === model})
		
		if (index >= 0) {
			this.models[index] = model2;
			return true;
		} else {
			return false;
		}
		
	};
	
	
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
	
	
	makeArrows(arg) {
		
		if (this.arrows.length > 0){
			
			this.arrows.forEach(mesh => mesh.dispose());
			this.arrows.length = 0;
		}
		
		if (arg === false) return ;
		
		let a = this.getConnectionsCoordinates();
				
		a.forEach((c) => {
			
			let mesh = this.getMesh(game.meshes.arrow, '');
			
			if (!mesh) return ;
			
			mesh.rotation.y = c.rotationIndex * game.TAU;
			
			mesh.material = game.materials.ycolor;
			mesh.isPickable = false;
			
			this.arrows.push(mesh);
			
			mesh.position.x = this.location.x + c.x + 0.5;
			mesh.position.y = this.location.y || 0.25;
			mesh.position.z = this.location.z + c.z + 0.5;
			
			mesh.itemOffset = { x:c.x + 0.5, z:c.z + 0.5 };
			
		});
		
		return this.arrows;
	}
	
	
	getConnectionsCoordinates(){
		
		let coordinates = [];
		
		const sides = ["bottom", "right", "top", "left"];
		
		this.models.forEach(model => {
			
			model.connections.forEach(connection => {
				
				connection.checkRotation();
				
				coordinates.push({	
					x: connection.rconnLocation.x, 
					z: connection.rconnLocation.z, 
					rotationIndex: connection.rotationIndex, 
					connection: connection
				});
			});
		});
		
		return coordinates
	}
	
	
	updateLinks(){
		
		this.models.forEach(model => {
			
			model.connections.forEach(connection => {
				
				connection.updateLinks();
				
			});
			
		});
		
		
		return ;
		
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
				rotatedConnectionsMap[i].connection.itemPointer = item.pointer;
				
			} else if (this.connectionsMap[i].forced) {
				
				this.connections.push(null);
				rotatedConnectionsMap[i].connection.itemPointer = game.nullpointer;
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
		this.visible = false;
		this.exist = false;
		this.pointer.link = null;
		this.mesh.dispose();
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