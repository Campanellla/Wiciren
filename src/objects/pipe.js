import {game} from '../App.js';


export class _pipe {
	
	constructor(args){
		
		this.ref = {link:this};
		this.type = "pipe";
		
		this.subtype = args.subtype || "pipe";
		
		this.itemSize = this.getSize();
		
		this.maxVolume = 10;
		this.flowresistance = 0.2;
		
		if (args){
			
			if (args.key) this.key = args.key; else this.key = -1;
			if (args.location) this.location = args.location; else this.location = {};
			
			this.rotationIndex = args.rotationIndex || 0;
			this.pressure = args.pressure || 0;
			this.volume = args.volume || 0;
			
		}
		
		this.sourceresistance = 0;
		this.sourcepressure = 0;
		this.lastQ = 0;
		this.Q = 0;
		
	}
	
	update(dt){
		
		
		
	}

	save(){
		var str = '"object":'+JSON.stringify(
			{
				type: 		this.type,
				subtype: 	this.subtype,
				location: 	this.location,
				volume: 	this.volume,
				flipped: 	this.flipped,
				pressure:	this.pressure,
				rotationIndex: 	this.rotationIndex
			});
		return str;
	}
	
	
	draw(instance){
		
		var mesh = this.drawMesh(instance);
		
		this.mesh = mesh;
		
		mesh.item = this.ref;
		mesh.type = this.type;
		mesh.isObject = true;
		
		mesh.position.y = 0;
		
		this.rotate(this.rotationIndex);
		
	}
	
	
	drawMesh(instance, subtype){
		
		subtype = subtype || this.subtype;
		
		if (subtype === "3-way"){
			if (instance){
				var mesh = game.meshes.pipe3.createInstance('index: ' + this.keynum);
			} else {
				var mesh = new game.BABYLON.Mesh('index: ' + this.keynum, game.scene, null, game.meshes.pipe3);
			}
		} else if (subtype === "4-way"){
			if (instance){
				var mesh = game.meshes.pipe4.createInstance('index: ' + this.keynum);
			} else {
				var mesh = new game.BABYLON.Mesh('index: ' + this.keynum, game.scene, null, game.meshes.pipe4);
			}
		} else if (subtype === "angle") {
			if (instance){
				var mesh = game.meshes.pipeA.createInstance('index: ' + this.keynum);
			} else {
				var mesh = new game.BABYLON.Mesh('index: ' + this.keynum, game.scene, null, game.meshes.pipeA);
			}
		} else {
			if (instance){
				var mesh = game.meshes.pipe.createInstance('index: ' + this.keynum);
			} else {
				var mesh = new game.BABYLON.Mesh('index: ' + this.keynum, game.scene, null, game.meshes.pipe);
			}
		}
		
		return mesh;
		
	}
	
	getSize(){
		
		return {h:1, w:1};
		
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
	
	
}
