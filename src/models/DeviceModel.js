import {game} from '../App.js';

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

		args.config = args.config || {};
		
		this.conductivity = args.config.conductivity || 0;
		
	}
	
	update(dt){
		
	}
	
	
	
	
}