import React, { Component } from 'react';

import InterfaceView from './ReactComponents/InterfaceView.js';

import ItemMenu from './ReactComponents/ItemMenu.js';
import SelectionView from './ReactComponents/SelectionView.js';
import ConfigMenu from './ReactComponents/ConfigMenu.js';
import {FpsLabel, DrawCallsLabel} from './ReactComponents/FpsLabel.js';
import {TimeText} from './ReactComponents/Labels.js';



export default class Interface {
	
	constructor(){
		
		this.View = <InterfaceView link = {this}/>;
		
		this.view = null;
		
		this.timeText = null;
		
		this.key = 0;
		
		this.qqq = [];
		
	}
	
	
	mount(){
		
		this.view.appendItem(<TimeText link = {this}/>);
		this.view.appendItem(<DrawCallsLabel link = {this}/>);
		
		this.view.appendItem(<FpsLabel/>);
		this.view.appendItem(<SelectionView/>);
		this.view.appendItem(<ConfigMenu />);
		
		this.view.appendItem(<div id = 'configmenuwindow' hidden/>);
		
	}
	
	appendFloatingMenu(item){
		
		let key = this.view.state.items.findIndex(o => o.props.item === item);
		if (key !== -1) return ;
		
		let ref = React.createRef();
		
		this.qqq.push(ref);
		
		let a = this.view.appendItem(<ItemMenu controller={this} item={item} key={this.key++} ref={ref}/>);
		
		console.log(this.qqq);
		
	}
	
	removeFloatingMenu(item){
		
		let key = this.view.state.items.findIndex(o => {
			return o.props.item === item;
		});
		
		if (key === -1) {
			console.log("key not found");
			return ;
		}
		
		this.view.state.items.splice(key, 1);
		this.view.setState({});
	}
	
	
}



