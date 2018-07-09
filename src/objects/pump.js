import {game} from '../App.js';


export class _pump {
	
	constructor(args){
		
		this.ref = {link:this};
		this.type = 'pump';
		
		this.itemSize = this.getSize();
		
		if (args){
			
			if (args.key) this.key = args.key; else this.key = -1;
			if (args.location) this.location = args.location; else this.location = {};
			
			this.rotationIndex = args.rotationIndex || 0;
			this.pressure = args.pressure || 0;
			this.volume = args.volume || 0;
			
		}
		
		this.capacity = 5;
		this.volume = 0;
		this.pressure = 1;
		this.lastQ = 0;
		this.Q = 0;
		
		this.input = [];
		this.output = [];
		this.received = [];
		this.return = [];


		if (args !== undefined){
			this.source = args.source;
			this.destination = args.destination;
		}
		
	}

	update(dt){
		
		game.pipelist.push(this);
		this.destinationList = [];
		this.sourceList = [];
		this.Qmax = 5;
		this.inserted = false;

	}

	save(){
		var str = '"object":'+JSON.stringify(
		{
			type: this.type,
			location:this.location,
			rotationIndex: this.rotationIndex
		})
		return str;
	}
	
	
	draw(){
		
		var mesh = this.drawMesh();
		
		this.mesh = mesh;
		
		mesh.item = this.ref;
		mesh.type = this.type;
		mesh.isObject = true;
		
		mesh.position.y = 0;
		
		this.rotate(this.rotationIndex);
	}
	
	drawMesh(instance){
		
		if (instance){
			var mesh = game.meshes.pump.createInstance('index: ' + this.keynum);
		} else {
			var mesh = new game.BABYLON.Mesh('index: ' + this.keynum, game.scene, null, game.meshes.pump);
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
		
		this.ref.link = undefined;
		this.mesh.dispose();
		
	}
	
	
}





