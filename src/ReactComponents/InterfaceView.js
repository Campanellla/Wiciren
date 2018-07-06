import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {game} from '../App.js';


export class InterfaceView extends Component {
	
	constructor(){
		super();
		
		game.InterfaceView = this;
		
		this.items = [];
		this.state = {
			items:this.items,
			a:0
		};
		this.appendItem = this.appendItem.bind(this);
		this.prependItem = this.prependItem.bind(this);
		
	}
	
	appendItem(a) {
		
		this.items.push(a);
		this.setState({
			a:this.state.a+1
		});
		
	}

	prependItem(a) {
		
		this.items.unshift(a);
		this.setState({
			a:this.state.a+1
		});
		
	}
	
	render() {
		return (
			<div id = 'InterfaceView'>
			{this.state.items.map((item) => {return item }) }
			</div>
			);
	}
}