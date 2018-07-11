import React, { Component } from 'react';

import InterfaceView from './ReactComponents/InterfaceView.js';

import ItemMenu from './ReactComponents/ItemMenu.js';
import SelectionView from './ReactComponents/SelectionView.js';
import ConfigMenu from './ReactComponents/ConfigMenu.js';
import FpsLabel from './ReactComponents/FpsLabel.js';
import {TimeText} from './ReactComponents/Labels.js';



export default class Interface {
	
	constructor(){
		
		this.View = <InterfaceView/>;
		
		this.view = null;
		
		this.timeText = null;
		
	}
	
	
	mount(){
		
		this.view.appendItem(<TimeText link = {this}/>);
		//this.view.appendItem(<div id= 'eventtext'></div>);
		
		this.view.appendItem(<FpsLabel/>);
		this.view.appendItem(<SelectionView/>);
		this.view.appendItem(<ConfigMenu />);
		
		this.view.appendItem(<div id = 'configmenuwindow' hidden/>);
		
		this.view.appendItem(<ItemMenu />);
		
	}
	
}