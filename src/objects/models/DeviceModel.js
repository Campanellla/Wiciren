import {game} from '../../App.js';

import {BaseModel} from './BaseModel.js'



export class DeviceModel extends BaseModel {
	
	
	constructor(args, parent){
		
		super();
		
		this.subtype = "devicemodel";
		this.class = "electric";
		
		this.location = args.location;
		this.parent = parent.pointer;
		
		if (args.connectionsMap) {
			this.connections = this.setUpConnections(args.connectionsMap);
		} else {
			this.connections = args.connections;
		}
		
		
		
		this.speed = parent.speed;
		this.controlIndex = parent.controlIndex;
		this.I = 0
		this.load = 0
		
	}
	
	update(dt){
		
		if (!this.connections[0]) {
			//console.log("!this.connections[0]"); 
			return ;
		}
		if (!this.connections[0].connectedModelPointer.link) {
			//console.log("!this.connections[0].connectedModelPointer.link"); 
			return ;
		}
		
		let a = this.connections[0].connectedItemPointer.link.speed / 900;
		
		this.connections[0].connectedModelPointer.link.load += this.parent.link.volume * 1000 * a * a;
		
		this.parent.link.speed = this.connections[0].connectedItemPointer.link.speed;
		this.parent.link.controlIndex = this.connections[0].connectedItemPointer.link.controlIndex;
		
	}
	
	
	
	
}