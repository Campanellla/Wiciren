import {game} from '../../App.js';

import {BaseModel} from './BaseModel.js'

export class PumpModel extends BaseModel{
	
	
	constructor(setup, parent){
		
		super();

		this.subtype = "pumpmodel";
		
		this.class = "pipeline";
		
		this.parent = parent.pointer;
		this.location = setup.location;
		
		if (setup.connectionsMap) {
			this.connections = this.setUpConnections(setup.connectionsMap);
		} else {
			this.connections = setup.connections;
		}
		
	}
	
	
	
	
}
