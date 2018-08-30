import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {game} from '../App.js';


export default class InterfaceView extends Component {
	
	constructor(props){
		super(props);
		
		this.props.link.view = this;
		
		this.items = [];
		this.state = {
			items:this.items,
			a:0
		};
		this.appendItem = this.appendItem.bind(this);
		this.prependItem = this.prependItem.bind(this);
		
		this.key = 0;
		
	}
	
	componentDidMount(){
		
		game.interface.mount();
		
	}
	
	
	appendItem(a) {
		
		this.items.push(a);
		this.setState({
			a:this.state.a+1
		});
		
		return a;
		
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