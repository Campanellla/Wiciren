import {game} from '../../App.js';

import {BaseModel} from './BaseModel.js'

export class PumpModel extends BaseModel{
	
	
	constructor(setup, parent){
		
		super();

		this.subtype = "pumpmodel";
		
		this.class = "pipeline";
		
		this.parent = parent.pointer;
		this.connections = setup.connections;
		this.location = setup.location;
		
	}
	
	
	
	
}
