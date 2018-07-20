import {game} from '../../App.js';



export class TankModel {
	
	
	constructor(setup){
		
		this.type = "model";
		this.subtype = "tankmodel";
		this.modelType = "pipeline";
		
		
		this.connections = [];
		
		
		this.connectionsMap = setup.connections;
		
	}
	
	
	
	
}