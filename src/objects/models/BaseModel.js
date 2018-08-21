import {game} from '../../App.js';


export class BaseModel {
	
	
	constructor(){
		
		
		this.pointer = {link:this};
		
		this.type = "model";
		this.subtype;
		this.class;
		
		this.parent;
		this.connections;
		this.location;
		
		this.submodel;
		
		this.inserted = false;
		this.isNode = false;
		
		
		
	}
	
	
	
	
} 