import {game} from '../App.js';

import {BaseModel} from './BaseModel.js'


export class EngineModel extends BaseModel {
	
	constructor(args){
		
		super();
		
		this.subtype = "enginemodel";
		this.class = "electric";
		
		this.location = args.location;
		this.parent = args.parentPointer;
		
		if (args.connectionsMap) {
			this.connections = this.setUpConnections(args.connectionsMap);
		} else {
			this.connections = args.connections;
		}
		
		args.config = args.config || {};
		
		this.speed = args.config.speed || 100;
		this.controlIndex = args.config.controlIndex || 0;
		this.run = args.config.run || true;
		this.I = args.config.I || 0;
		this.frequency = args.config.frequency || 0;
		this.voltage = args.config.voltage || 450;
		this.setPoint = args.config.setPoint || 900;
		this.speedDroop = args.config.speedDroop ||0;
		
		this.resistance = 1000000;
		this.load = 0;
		
	}
	
	update(dt){
		
		let ratedPower = 10000000//00;
		let setPoint = this.setPoint;
		let speed = this.speed;
		let controlIndex = this.controlIndex;
		
		let consumerResistance = this.resistance;
		let current = this.voltage / consumerResistance;
		let frequency = speed / 15;
		
		let load = 450 * current;
		let altLoad = load * 1.15;
		
		
		let volume = this.parent.link.models[0].volume || 0;
		
		let I = this.I;
		
		
		//console.log(this.parent.link.key, this.speed);
		
		
		let resistancea = ratedPower/7000;
		let resistanceb = resistancea*1000;
		
		if (speed < 0 || isNaN(speed)) speed = 0;
		
		I += (setPoint - this.speedDroop - speed) * dt * 2;
		
		if (Math.abs(I) > 50){
			
			if (I > 0) I = 50;
			if (I < 0) I = -50;
		}
		
		this.I = I;
		
		let P = (setPoint - this.speedDroop - speed) * 10;
		
		let cisetPoint = I + P;
		
		
		if (cisetPoint > 110) cisetPoint = 110;
		if (cisetPoint < -10) cisetPoint = -10;
		
		let controlIndexDx = (cisetPoint - controlIndex) * dt * 25;
		
		if (Math.abs(controlIndexDx) > 500 * dt){
			
			if (controlIndexDx > 0) controlIndexDx = 500 * dt;
			if (controlIndexDx < 0) controlIndexDx = -500 * dt;
		}
		
		
		if (Math.abs(controlIndexDx) < 0.1) controlIndexDx = 0;
		
		
		controlIndex += controlIndexDx ;
		
		this.speedDroop = controlIndex / 1000
		
		if (controlIndex < 0) controlIndex = 0;
		if (controlIndex > 100) controlIndex = 100;
		
		if (!this.run) controlIndex = 0;
		
		let fuelIndex = (Math.round(controlIndex) + (Math.random()-0.5)*3) * ratedPower/100/900 * speed;
		let volumeChange = fuelIndex / 20000000 * dt;
		
		if (volume < volumeChange) fuelIndex = volume * 20000000 / dt;
		if (volume < 0) volumeChange = 0;
		
		volume -= volumeChange;
		
		if (fuelIndex < 0) fuelIndex = 0;
		
		let balance = (fuelIndex - resistancea * speed - resistanceb / (speed / 50 + 1) - altLoad) / (ratedPower/10000 + Math.sqrt(ratedPower/2)*ratedPower/1000000) * dt;
		
		speed += balance;
		
		if (speed < 0) speed = 0;
		
		
		this.frequency = frequency;
		
		this.current = current;
		this.load = load;
		this.speed = speed;
		this.parent.link.models[0].volume = volume;
		this.controlIndex = controlIndex;
		
		
		
	}
	
	
	
	
}





