import React, { Component } from 'react';

import {MenuButton} from './ButtonsMenu/MenuButton.js';

import {ConfigMenuWindow} from './ButtonsMenu/ConfigMenuWindow.js';




export class ButtonsMenu extends Component {
	
	constructor(props){
		super(props);
		this.game = this.props.workspace;
		this.windowContainer = this.props.windowContainer;
	}
	
	
	render(){
		return (
			<div className = {this.props.className}>
				<MenuButton 
					windowContainer = {this.windowContainer}
					workspace = {this.game}
					menuInterface = {ConfigMenuWindow}
				/>
			</div>
		)
	}
	
	
	
}