import {game} from '../../App.js';

import {BaseModel} from './BaseModel.js'


export class EngineModel extends BaseModel {
	
	constructor(args, parent){
		
		super();
		
		
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
		
		let resistancea = 10;
		let resistanceb = 250;
		
		
		if (speed > 800){
			
			this.load = 70000
			
		} 
		
		if (speed < 700){
			
			this.load = 0
			
		} 
		
		//console.log("speed:", speed, "controlIndex: ", controlIndex);
		
		this.I = (900 - speed) * dt * 1 + this.I;
		
		if (Math.abs(this.I) > 25){
			
			if (this.I > 0) this.I = 25;
			if (this.I < 0) this.I = -25;
		}
		
		let I = this.I;
		let P = (900 - speed)*25;
		
		let cisetPoint = I + P;
		
		if (cisetPoint > 100) cisetPoint = 100;
		if (cisetPoint < 0) cisetPoint = 0;
		
		let controlIndexDx = (cisetPoint - controlIndex) * dt * 25;
		
		if (Math.abs(controlIndexDx) > 250 * dt){
			
			if (controlIndexDx > 0) controlIndexDx = 250 * dt;
			if (controlIndexDx < 0) controlIndexDx = -250 * dt;
		}
		
		controlIndex += controlIndexDx;
		
		let fuelIndex = Math.round(controlIndex) * speed;
		
		let volumeChange = fuelIndex / 10000 * dt;
		
		if (volume < volumeChange) fuelIndex = volume * 10000 / dt;
		
		volume -= volumeChange;
		
		let balance = (fuelIndex - resistancea * speed - resistanceb - this.load) / 200 * dt;
		
		speed += balance;
		
		
		
		
		//console.log("speed:", speed, "controlIndex: ", controlIndex, "balance", balance);
		
		if (speed < 0) speed = 0;
		
		
		
		
		this.speed = speed;
		this.parent.link.speed = speed;
		this.parent.link.volume = volume;
		this.parent.link.controlIndex = controlIndex;
		
	}
	
	
	
}





