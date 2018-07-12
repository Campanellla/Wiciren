import {game} from '../App.js';


export class _pipe {
	
	constructor(args){
		
		this.pointer = {link:this};
		this.type = "pipe";
		
		this.subtype = args.subtype || "pipe";
		
		this.itemSize = this.getSize();
		
		this.maxVolume = 10;
		this.flowresistance = 0.2;
		
		if (args){
			
			if (args.key !== undefined) this.key = args.key; else this.key = -1;
			this.location = args.location || {};
			
			this.rotationIndex = args.rotationIndex || 0;
			this.pressure = args.pressure || 0;
			this.volume = args.volume || 0;
			
		}
		
		this.sourceresistance = 0;
		this.sourcepressure = 0;
		this.lastQ = 0;
		this.Q = 0;
		
		this.checked = false;
		this.inserted = false;
		this.connections = [];
		
		this.isNode = false;
		
	}
	
	update(dt){
		
		
		
	}
	
	updateLinks(){
		
		this.checked = false;
		
		this.connections.length = 0;
		
		this.isNode = false;
		
		let a, b, c, d;
		
		let x = this.location.x;
		let z = this.location.z;
		
		if (this.subtype === "pipe"){
			
			if (!this.rotationIndex % 2){
				
				a = game.map.getItemFromCoord(x-1, z);
				b = game.map.getItemFromCoord(x+1, z);
				
			} else {
				
				a = game.map.getItemFromCoord(x, z-1);
				b = game.map.getItemFromCoord(x, z+1);
				
			}
		} else if (this.subtype === "3-way"){
			
			if (this.rotationIndex === 0){
				
				a = game.map.getItemFromCoord(x-1, z);
				b = game.map.getItemFromCoord(x+1, z);
				c = game.map.getItemFromCoord(x, z-1);
				
			} else if (this.rotationIndex === 1){
				
				a = game.map.getItemFromCoord(x-1, z);
				b = game.map.getItemFromCoord(x, z-1);
				c = game.map.getItemFromCoord(x, z+1);
				
			} else if (this.rotationIndex === 2){
				
				a = game.map.getItemFromCoord(x-1, z);
				b = game.map.getItemFromCoord(x+1, z);
				c = game.map.getItemFromCoord(x, z+1);
				
			} else if (this.rotationIndex === 3){
				
				a = game.map.getItemFromCoord(x+1, z);
				b = game.map.getItemFromCoord(x, z-1);
				c = game.map.getItemFromCoord(x, z+1);
			}
		} else if (this.subtype === "4-way"){
			
			a = game.map.getItemFromCoord(x+1, z);
			b = game.map.getItemFromCoord(x, z-1);
			c = game.map.getItemFromCoord(x, z+1);
			d = game.map.getItemFromCoord(x-1, z);
			
		} else if (this.subtype === "angle"){
			
			if (this.rotationIndex === 0){
				
				a = game.map.getItemFromCoord(x , z-1);
				b = game.map.getItemFromCoord(x-1 , z);
				
			} else if (this.rotationIndex === 1){
				
				a = game.map.getItemFromCoord(x-1 , z);
				b = game.map.getItemFromCoord(x , z+1);
				
			} else if (this.rotationIndex === 2){
				
				a = game.map.getItemFromCoord(x+1 , z);
				b = game.map.getItemFromCoord(x , z+1);
				
			} else if (this.rotationIndex === 3){
				
				a = game.map.getItemFromCoord(x+1 , z);
				b = game.map.getItemFromCoord(x , z-1);	
			}
		}
		
		if (a) this.connections.push(a.pointer);
		if (b) this.connections.push(b.pointer);
		if (c) this.connections.push(c.pointer);
		if (d) this.connections.push(d.pointer);
	}
	

	save(){
		var str = 
			{
				type: 		this.type,
				subtype: 	this.subtype,
				location: 	this.location,
				volume: 	this.volume,
				pressure:	this.pressure,
				rotationIndex: 	this.rotationIndex
			};
		
		return str;
	}
	
	/// arg bool -> true if need to draw instance only
	draw(instance){
		
		var mesh = this.drawMesh(instance);
		
		this.mesh = mesh;
		
		mesh.item = this.pointer;
		mesh.type = this.type;
		mesh.isObject = true;
		
		mesh.position.y = 0;
		
		this.rotate(this.rotationIndex);
		
	}
	
	
	drawMesh(instance, subtype){
		
		subtype = subtype || this.subtype;
		
		var mesh;
		
		if (subtype === "3-way"){
			if (instance){
				mesh = game.meshes.pipe3.createInstance('index: ' + this.keynum);
			} else {
				mesh = new game.BABYLON.Mesh('index: ' + this.keynum, game.scene, null, game.meshes.pipe3);
			}
		} else if (subtype === "4-way"){
			if (instance){
				mesh = game.meshes.pipe4.createInstance('index: ' + this.keynum);
			} else {
				mesh = new game.BABYLON.Mesh('index: ' + this.keynum, game.scene, null, game.meshes.pipe4);
			}
		} else if (subtype === "angle") {
			if (instance){
				mesh = game.meshes.pipeA.createInstance('index: ' + this.keynum);
			} else {
				mesh = new game.BABYLON.Mesh('index: ' + this.keynum, game.scene, null, game.meshes.pipeA);
			}
		} else {
			if (instance){
				mesh = game.meshes.pipe.createInstance('index: ' + this.keynum);
			} else {
				mesh = new game.BABYLON.Mesh('index: ' + this.keynum, game.scene, null, game.meshes.pipe);
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
	
	destruct(){
		
		this.pointer.link = undefined;
		this.mesh.dispose();
		
	}
	
	
}
