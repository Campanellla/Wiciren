import React, { Component } from 'react';

import {game} from '../App.js';



export default class FpsLabel extends Component {
	
	constructor(props){
		
		super(props);
		
		this.state = {text:''};
		game.fpsLabel = this;
		
	}
	
	render(){
		return <div id= 'fpsLabel'>{this.state.text}</div>;
	}
	
}


