import React, { Component } from 'react';

import {ConfigMenuWindow} from './ConfigMenuWindow.js';


export class MenuButton extends Component {
	
	constructor(props){
		super(props);
		this.game = this.props.workspace;
		
		this.windowContainer = this.props.windowContainer;
		
		this.state = {active: false};
		this.window = {menu_interface:ConfigMenuWindow};
		
		this.onclick = this.onclick.bind(this);
		this.isActive = this.isActive.bind(this);
		
		this.windowRef = {current: null};
		
	}
	
	isActive(state){
		this.setState({active:state})
	}
	
	
	onclick(event){
		
		let link = this.windowRef.current
		if (link) {
			link.onClose.call(this.windowRef.current);
		} else {
			let ref = this.windowContainer.current.appendWindow(this.window, this.isActive);
			if (ref) this.windowRef = ref;
		}
	}
	
	
	render(){
		
		return (
			<button 
				onClick={this.onclick} 
				style={{
						borderStyle:(this.state.active)? "inset" : "outset",
						background:(this.state.active)? "lightskyblue" : "white"
					}}
			>
				ConfigMenu
			</button>
		)
		
	}
	
	
	
	
}


