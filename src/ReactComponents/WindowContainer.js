import React, { Component } from 'react';


import ItemMenu from "./ItemMenu.js";


export default class WindowContainer extends Component {
	
	constructor(props){
		
		super(props);
		
		this.state = {
			windows:[]
		}
		
		this.key = 0;
		this.newIndex = 1;
	}
	
	
	render(){
		return (
			<div id = 'WindowContainer'>
				{this.state.windows.map(w => w.w)}
			</div>
		);
	}
	
	
	appendWindow(item){
		
		let key = this.state.windows.findIndex(w => w.w.props.item === item);
		if (key !== -1) return ;
		let w = {
			w:null, 
			ref:React.createRef()
		};
		w.w = <ItemMenu controller={this} 
						item={item}
						position={{
							left:100 + this.state.windows.length*10, 
							top:50 + this.state.windows.length*2
						}}
						index={++this.newIndex}
						key={this.key++} 
						ref={w.ref} />;
		this.state.windows.push(w);
		this.setState({});
		
	}
	
	
	removeWindow(_window){
		
		let key = this.state.windows.findIndex(w => w.ref.current === _window);
		
		if (key === -1) {
			console.log("key not found");
			return ;
		}
		
		this.state.windows.splice(key, 1);
		this.setState({});
	}
	
	
	setTop(_window){
		
		if (_window.state.index < this.newIndex) {
			_window.setState({index:++this.newIndex});
		}
		
	}
	
	
	
}





