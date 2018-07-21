import {game} from '../../App.js';



export class PumpModel {
	
	
	constructor(setup){
		
		this.type = "model";
		this.subtype = "pumpmodel";
		this.modelType = "pipeline";
		
		setup.connections.forEach(connection => {
			
			connection.model = this;
			
		});
		
		this.connections = setup.connections;
		
	}
	
	
	
	
}
