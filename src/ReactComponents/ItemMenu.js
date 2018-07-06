import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {game} from '../App.js';


export default class ItemMenu extends Component {
	
	constructor(){
		super();
		this.onMouseDown = this.onMouseDown.bind(this);
		
		this.offsetx = 0;
		this.offsety = 0;
		
		this.element;
		
		this.posx = 0;
		this.posy = 0;
		
	}
	
	componentDidMount(){
		
		this.element =  document.getElementById("ItemMenu");
		
	}
	
	elementDrag(e) {
		
		e = e || window.event;
		
		this.posx = e.clientX - this.offsetx;
		this.posy = e.clientY - this.offsety;
		
		if (this.posx < 0) this.posx = 0;
		if (this.posy < 0) this.posy = 0;
		if (this.posx > window.innerWidth - 50) this.posx = window.innerWidth - 50;
		if (this.posy > window.innerHeight - 25) this.posy = window.innerHeight - 25;
		
		this.element.style.left = (this.posx) + "px";
		this.element.style.top = (this.posy) + "px";
	}

	closeDragElement() {
		
		document.onmouseup = null;
		document.onmousemove = null;
		
		game.unBlockSelection();
	}
	
	onMouseDown(e){
		
		e = e || window.event;
		
		this.offsetx = e.clientX - this.element.offsetLeft;
		this.offsety = e.clientY - this.element.offsetTop;
		
		document.onmouseup = this.closeDragElement.bind(this);
		document.onmousemove = this.elementDrag.bind(this);
		
		game.blockSelection();
		
	}
	
	
	render(){
		return(	<div id = 'ItemMenu' hidden >
					<div id = 'ItemMenuHeader' onMouseDown = {this.onMouseDown}>header</div>
					<div id = 'ItemMenuText'/>
				</div> );
	}
	
}
