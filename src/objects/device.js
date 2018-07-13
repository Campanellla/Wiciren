import {game} from '../App.js';


export class _device {
	
	constructor(args){
		
		this.pointer = {link:this};
		this.exist = true;
		this.type = "device";
		
		this.itemSize = this.getSize();
		
		if (args) {
			
			if (args.key) this.key = args.key; else this.key = -1;
			if (args.location) this.location = args.location; else this.location = {};
			
			this.rotationIndex = args.rotationIndex || 0;
			
		};
		
	}
	
	update(dt){
		
		
		
	}
	
	save(){
		var str = '"object":'+JSON.stringify(
			{
				type: this.type,
				location:this.location,
				rotationIndex:this.rotationIndex
			})
		return str;
	}
	
	
	draw(){
		
		var mesh = this.drawMesh();
		
		this.mesh = mesh;
		
		mesh.item = this.pointer;
		mesh.type = this.type;
		mesh.isObject = true;
		
		mesh.position.y = 0;
		
		this.rotate(this.rotationIndex);
	}
	
	drawMesh(instance){
		
		if (instance){
			var mesh = game.meshes.device.createInstance('index: ' + this.keynum);
		} else {
			var mesh = new game.BABYLON.Mesh('index: ' + this.keynum, game.scene, null, game.meshes.device);
		}
		
		return mesh;
		
	}
	
	getSize(){
		
		return {h:2, w:2};
		
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
	destruct(){
		
		this.exist = false;
		this.pointer.link = undefined;
		this.mesh.dispose();
		
	}
	
}








