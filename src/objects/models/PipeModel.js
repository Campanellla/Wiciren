import {game} from '../../App.js';


export class PipeModel {
	
	
	constructor(setup){
		
		this.type = "model";
		this.subtype = "pipemodel";
		this.modelType = "pipeline";
		
		setup.connections.forEach(connection => {
			
			connection.model = this;
			
		});
		
		this.connections = setup.connections;
		
		
	}
	
	
	
	
		
}