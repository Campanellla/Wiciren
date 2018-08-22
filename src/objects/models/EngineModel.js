import {game} from '../../App.js';

import {BaseModel} from './BaseModel.js'


export class EngineModel extends BaseModel {
	
	constructor(args, parent){
		
		super();
		
		this.subtype = "enginemodel";
		this.class = "electric";
		
		this.connections = args.connections;
		this.location = args.location;
		this.parent = parent.pointer;
		
		this.speed = parent.speed;
		
		this.controlIndex = parent.controlIndex;
		
		this.I = 0
		
		this.load = 0
		
	}
	
	update(dt){
		
		let speed = this.parent.link.speed;
		let volume = this.parent.link.volume;
		
		let controlIndex = this.parent.link.controlIndex;
		
		let resistancea = 120;
		let resistanceb = 250000;
		
		if (speed < 0) speed = 0;
		
		this.I = (900 - speed) * dt * 2 + this.I;
		
		if (Math.abs(this.I) > 10){
			
			if (this.I > 0) this.I = 10;
			if (this.I < 0) this.I = -10;
		}
		
		let I = this.I;
		let P = (900 - speed) * 25;
		
		let cisetPoint = I + P;
		
		if (cisetPoint > 100) cisetPoint = 100;
		if (cisetPoint < 0) cisetPoint = 0;
		
		let controlIndexDx = (cisetPoint - controlIndex) * dt * 25;
		
		if (Math.abs(controlIndexDx) > 250 * dt){
			
			if (controlIndexDx > 0) controlIndexDx = 250 * dt;
			if (controlIndexDx < 0) controlIndexDx = -250 * dt;
		}
		
		controlIndex += controlIndexDx;
		
		let fuelIndex = Math.round(controlIndex) * 12 * speed;
		
		let volumeChange = fuelIndex / 20000000 * dt;
		
		if (volume < volumeChange) fuelIndex = volume * 20000000 / dt;
		
		if (volume < 0) volumeChange = 0;
		
		volume -= volumeChange;
		
		if (fuelIndex < 0) fuelIndex = 0;
		
		let balance = (fuelIndex - resistancea * speed - resistanceb / (speed / 15 + 1) - this.load) / 5000 * dt;
		
		speed += balance;
		
		
		//console.log("speed:", speed, "controlIndex: ", controlIndex, "balance", balance);
		
		if (speed < 0) speed = 0;
		
		
		
		
		this.speed = speed;
		this.parent.link.speed = speed;
		this.parent.link.volume = volume;
		this.parent.link.controlIndex = controlIndex;
		this.parent.link.load = this.load;
		
		this.load = 0;
		
	}
	
	
	
}





