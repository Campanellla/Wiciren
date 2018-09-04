import {game} from '../App.js';

import {BaseModel} from './BaseModel.js'


export class EpoleModel extends BaseModel{
	
	constructor(setup){
		
		super();
		
		this.subtype = "epolemodel";
		this.class = "electric";
		
		this.parent = setup.parentPointer;
		this.location = setup.location;
		
		
		if (setup.connectionsMap) {
			this.connections = this.setUpConnections(setup.connectionsMap);
		} else {
			this.connections = setup.connections;
		}
		
		
	}
	
	
	
	
}