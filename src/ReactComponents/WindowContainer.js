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
				{this.state.windows.map(_window => _window.container)}
			</div>
		);
	}
	
	
	appendWindow(item){
		
		let key = this.state.windows.findIndex(_window => _window.container.props.item === item);
		if (key !== -1) return ;
		let _window = {
			container :null, 
			ref: React.createRef()
		};
		_window.container = <ItemMenu 
			controller={this}
			item={item}
			position={{
				left:100 + this.state.windows.length*10, 
				top:50 + this.state.windows.length*2
			}}
			index={++this.newIndex}
			key={this.key++}
			ref={_window.ref} 
		/>;
						
		this.state.windows.push(_window);
		this.setState({});
		
	}
	
	
	removeWindow(currentWindow){
		
		let key = this.state.windows.findIndex(_window => _window.ref.current === currentWindow);
		
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





