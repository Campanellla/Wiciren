import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {game} from '../App.js';


export default class ItemMenu extends Component {
	
	constructor(){
		super();
		
		this.onMouseDown = this.onMouseDown.bind(this);
		
		this.onClose = this.onClose.bind(this)
		
		this.offsetx = 0;
		this.offsety = 0;
		
		this.posx = 100;
		this.posy = 50;
		
		this.state = 
		{	
			hidden:true,
			text:'',
			item:null,
			position:{	
				left:100,
				top:50
			}
		};
		
		game.itemMenu = this;
		
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
		
		game.unBlockSelection();
	}
	
	onMouseDown(e){
		
		e = e || window.event;
		
		this.offsetx = e.clientX - this.posx;
		this.offsety = e.clientY - this.posy;
		
		document.onmouseup = this.closeDragElement.bind(this);
		document.onmousemove = this.elementDrag.bind(this);
		
		game.blockSelection();
		
	}
	
	onClose(){
		this.setState({hidden:true});
	}
	
	
	render(){
		return(<div id = 'ItemMenu' 
					hidden = {this.state.hidden} 
					style = {{
						left:this.state.position.left, 
						top:this.state.position.top}}
				>
					<div id = 'ItemMenuHeader' onMouseDown = {this.onMouseDown}>
						Item menu
					</div>
					<button id = 'ItemMenuCloseButton' onClick = {this.onClose}>X</button>
					<div id = 'ItemMenuText'>{
						this.state.text.split('\n').map((item, key) => {
  							return <span key={key}>{item}<br/></span>
						})
					}</div>
					<ItemConfig item = {this.state.item} />
					
					
				</div> );
	}
	
}

class ItemConfig extends Component {
	
	constructor(props){
		
		super(props);
		this.textInput = React.createRef();
	}
	
	onclick(){
		
		let num = Number(this.textInput.current.value);
		
		if(this.props.item) 
			if(this.props.item.link) 
				if (this.props.item.link.volume !== undefined && !isNaN(num)) {
					this.props.item.link.volume = num;
					game.updateMenu();
				}
	}
	
	render(){
		
		return(
			<div>
				<button onClick = {this.onclick.bind(this)}> set vol </button>	
				<input type = "text" ref={this.textInput}/>
			</div>
			)
		
	}
	
	
}




