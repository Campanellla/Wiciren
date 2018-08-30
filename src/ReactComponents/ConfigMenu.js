import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {game} from '../App.js';



export default class ConfigMenu extends Component {

	constructor(props){
		super(props);
		this.state = {revealed:false, abc:false};
		game.configmenu = this;
	}

	onclick(e){
		drawConfigMenu.apply(this);
	}

	render(){
		return (<div id = "configmenu">
					<button onClick={(e) => this.onclick(e)}> ConfigMenu </button>
				</div>
		)
	}
}

class OperatingButton extends Component {
	render(){
		return (<div id= 'operatingbutton'>
					<button onClick={opbutton}> opbutton </button>
				</div>
		)
	}
}

class ConfigMenuWindow extends Component {

	render (){
		return (
			<div > <SaveButton /><LoadButton /><OperatingButton /> </div>
		)
	}

}


class SaveButton extends Component {

	clickSave(){
		var a = game.save(game.map.objectsList);
		window.localStorage.setItem("save0", a);
	}

	render (){
		return(
			<button onClick={this.clickSave}>Save</button>
		)
	}
}

class LoadButton extends Component {

	clickLoad(){
		var b = JSON.parse(window.localStorage.getItem("save0"));
		console.time("loadTime")
		game.load(b);
		console.timeEnd("loadTime")
		
	}

	render (){
		return(
			<button onClick={this.clickLoad}>Load</button>
		)
	}

}


function drawConfigMenu(){
	if (this.state.revealed) {
		document.getElementById('configmenuwindow').hidden = true;
		this.setState({revealed:false});
	} else {
		document.getElementById('configmenuwindow').hidden = false;
		ReactDOM.render(<ConfigMenuWindow />, document.getElementById('configmenuwindow'));
		this.setState({revealed:true});

	}
}

function opbutton(){
	console.log(game);
}





