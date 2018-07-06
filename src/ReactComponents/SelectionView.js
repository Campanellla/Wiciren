import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {game} from '../App.js';




class SelectAction extends Component {

	constructor(props){
		super(props);
		this.state = {object: this.props.object, styleState: {'background': 'white'} };
	}

	render(){
		return (
			<button onClick={(e) => this.onClick(e)} style={this.state.styleState}>{this.props.object}</button>
		)
	}

	onClick(e){
		
		if (game.actionSelectedItem === this){
			this.setState({styleState: {'background': 'white'}});
			game.actionSelectedItem = undefined;
			game.actionSelected = undefined;
			
			game.itemConstructor.setInactiveConstructor();
			
			return 
		}
		game.itemConstructor.setInactiveConstructor();
		if (game.actionSelectedItem) game.actionSelectedItem.setState({styleState: {'background': 'white'}});
		game.actionSelected = this.props.object;
		this.setState({styleState: {'background': 'beige'}});
		game.actionSelectedItem = this;
		if (this.state.object !== "remove") game.itemConstructor.setActiveConstructor(this.props.object);
		
	}

}


class SelectToggle extends Component {

	constructor(props){
		super(props);
		this.state = {object: this.props.object};
	}

	render(){
		return (
			<button onClick={(e) => this.onClick(e)}>{this.state.object}</button>
		)
	}

	onClick(e){
		if (game.toggle){
			game.toggle = false;
		} else {
			game.toggle = true;
		}
	}

}

export default class SelectionView extends Component {
	
	constructor(){
		
		super();
		
		this.elements = 	[	
								<SelectAction object="pipe" />,
								<SelectAction object="pipe3" />,
								<SelectAction object="pipe4" />,
								<SelectAction object="pipeA" />,
								<SelectAction object="pump" />,
								<SelectAction object="tank" />,
								<SelectAction object="engine" />,
								<SelectAction object="device" />,
								<SelectAction object="remove" />
							];
	}
	
	render(){
		return (<div id = "selectionview"> {this.elements} </div>);
	}
	
}
