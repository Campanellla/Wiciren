import React, { Component } from 'react';

import {ConfigMenuButton} from './ButtonsMenu/ConfigMenuButton.js';


export class ButtonsMenu extends Component {
	
	constructor(props){
		
		super(props);
		this.windowContainer = this.props.windowContainer;
		
	}
	
	
	render(){
		return (
			<div className = {this.props.className}>
				<ConfigMenuButton windowContainer = {this.windowContainer}/>
			</div>
		)
	};
	
	
	
	
}