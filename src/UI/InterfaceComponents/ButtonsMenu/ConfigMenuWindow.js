import React, { Component } from 'react';





export class ConfigMenuWindow extends Component {
	
	constructor(props){
		super(props);
		this.game = this.props.workspace;
		
		this.opbutton = this.opbutton.bind(this);
		this.clickSave = this.clickSave.bind(this);
		this.clickLoad = this.clickLoad.bind(this);
	}
	
	
	opbutton(){
		console.log(this.game);
	}
	

	clickSave(){
		var a = this.game.saveSessionToLocal(this.game.map.objectsList);
		window.localStorage.setItem("save0", a);
		console.log("Saved current session with string length:", a.length);
	}
	
	
	clickLoad(){
		let time = new Date();
		var b = JSON.parse(window.localStorage.getItem("save0"));
		this.game.loadSession(b);
		time = new Date() - time;
		console.log("Reloaded session in:", time, "ms");
	}
	
	
	render (){
		return (
			<div className="configmenuwindowcontainer">
				<div className = "configmenuwindow"> 
					<button onClick={this.clickSave}>Save</button>
					<button onClick={this.clickLoad}>Load</button>
					<button onClick={this.opbutton} >LOG </button>
				</div>
			</div>
		)
	}
	
}









