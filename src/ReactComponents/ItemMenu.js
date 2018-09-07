import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {game} from '../App.js';


export default class ItemMenu extends Component {
	
	constructor(props){
		super(props);
		
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onClose = this.onClose.bind(this)
		
		this.offsetx = 0;
		this.offsety = 0;
		
		this.posx = 100;
		this.posy = 50;
		
		this.state = 
		{	
			hidden:false,
			item:this.props.item,
			position:this.props.position,
			index:this.props.index
		};
		
		this.controller = this.props.controller;
	}
	
	componentDidMount(){
		if (this.props.activeState) this.props.activeState(true);
	}
	
	
	componentWillUnmount(){
		if (this.props.activeState) this.props.activeState(false);
	}
	
	
	
	elementDrag(e) {
		
		e = e || window.event;
		
		this.posx = e.clientX - this.offsetx;
		this.posy = e.clientY - this.offsety;
		
		if (this.posx < 0) this.posx = 0;
		if (this.posy < 0) this.posy = 0;
		if (this.posx > window.innerWidth - 50) this.posx = window.innerWidth - 50;
		if (this.posy > window.innerHeight - 25) this.posy = window.innerHeight - 25;
		
		this.setState({position:{left:this.posx, top:this.posy}});
	}
	

	closeDragElement() {
		
		document.onmouseup = null;
		document.onmousemove = null;
		
		game.blockSelection(false);
	}
	
	onMouseDown(e){
		
		e = e || window.event;
		
		this.offsetx = e.clientX - this.posx;
		this.offsety = e.clientY - this.posy;
		
		document.onmouseup = this.closeDragElement.bind(this);
		document.onmousemove = this.elementDrag.bind(this);
		
		game.blockSelection(true);
		
	}
	
	
	onClose(){
		this.controller.removeWindow(this);
	}
	
	
	render(){
		return (
			<div 
				className = 'ItemMenu' 
				hidden = {this.state.hidden} 
				style = {{
					left: this.state.position.left, 
					top:  this.state.position.top,
					zIndex: this.state.index
				}} 
				onMouseDown = {this.controller.setTop.bind(this.controller, this)}
			>
				<div className = 'ItemMenuHeader' onMouseDown = {this.onMouseDown}>
					Item menu
				</div>
				<button className = 'ItemMenuCloseButton' onClick = {this.onClose}>
					X
				</button>
				
				<div>
					{	
						(state => {
							if (state.item && state.item.menu_interface) {
								
								let Interface = state.item.menu_interface;
								return <Interface item = {state.item} workspace = {game}/>
							}
						})(this.state)
					}
				</div>
			</div> 
		);
	}
	
}






