import {game} from '../App.js';


export class _tank {

	constructor(args){
		
		this.ref = {link:this};
		this.type = "tank";
		
		this.itemSize = this.getSize();
		
		this.maxVolume = 250;
		this.flowresistance = 0.2;
		
		if (args){
			
			if (args.key) this.key = args.key; else this.key = -1;
			if (args.location) this.location = args.location; else this.location = {};
			
			this.rotationIndex = args.rotationIndex || 0;
			this.pressure = args.pressure || 0;
			this.volume = args.volume || 0;
			
		}
		
		this.lastQ = 0;
		this.Q = 0;
		
		this.input = [];
		this.output = [];
		this.received = [];
		this.return = [];
		
	}

	update(){
		game.pipelist.push(this);
		this.pressure = this.volume/1000;
		this.destinationList = [];
		this.sourceList = [];
		this.inserted = false;

	}

	save(){
		var str = '"object":'+JSON.stringify(
			{
				type: this.type,
				location:this.location,
				volume: this.volume,
				inflow: this.inflow,
				reversedflow: this.reversedflow,
				rotationIndex :this.rotationIndex
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
			var mesh = game.meshes.tank.createInstance('index: ' + this.keynum);
		} else {
			var mesh = new game.BABYLON.Mesh('index: ' + this.keynum, game.scene, null, game.meshes.tank);
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
