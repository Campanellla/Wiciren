import {game} from '../../App.js';


export class PipeModel {
	
	
	constructor(setup){
		
		this.type = "model";
		this.subtype = "pipemodel";
		this.modelType = "pipeline";
		
		
		this.connections = [];
		
		
		this.connectionsMap = setup.connections;
		
	}
	
	
	
	
		
}