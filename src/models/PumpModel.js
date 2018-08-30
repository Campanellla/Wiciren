import {game} from '../App.js';

import {BaseModel} from './BaseModel.js'

export class PumpModel extends BaseModel{
	
	
	constructor(setup){
		
		super();

		this.subtype = "pumpmodel";
		
		this.class = "pipeline";
		
		this.parent = setup.parentPointer;
		this.location = setup.location;
		
		if (setup.connectionsMap) {
			this.connections = this.setUpConnections(setup.connectionsMap);
		} else {
			this.connections = setup.connections;
		}
		
	}
	
	updateFlow(dt){
		
		
		
		
	}
	
	
}
