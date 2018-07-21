import {game} from '../../App.js';



export class TankModel {
	
	
	constructor(setup){
		
		this.type = "model";
		this.subtype = "tankmodel";
		this.modelType = "pipeline";
		
		
		setup.connections.forEach(connection => {
			
			connection.model = this;
			
		});
		
		this.connections = setup.connections;
		
	}
	
	
	
	
}