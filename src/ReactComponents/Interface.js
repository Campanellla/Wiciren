import React, { Component } from 'react';


import ItemMenu from './ItemMenu.js';
import SelectionView from './SelectionView.js';
import ConfigMenu from './ConfigMenu.js';
import {FpsLabel, DrawCallsLabel} from './FpsLabel.js';
import {TimeText} from './Labels.js';

import WindowContainer from './WindowContainer.js';


export default class InterfaceView extends Component {
	
	constructor(props){
		
		super(props);
		
		this.timeTextComponent = React.createRef();
		this.drawCallsLabelComponent = React.createRef();
		this.fpsLabelComponent = React.createRef();
		this.selectionViewComponent = React.createRef();
		this.configMenuComponent = React.createRef();
		
		this.windowContainerComponent = React.createRef();
		
	}
	
	
	render(){
		return (
			<div>
				<TimeText ref={this.timeTextComponent}/>
				<DrawCallsLabel ref = {this.drawCallsLabelComponent}/>
				
				<FpsLabel ref={this.fpsLabelComponent}/>
				<SelectionView ref={this.selectionViewComponent}/>
				<ConfigMenu ref={this.configMenuComponent}/>
				
				<WindowContainer ref={this.windowContainerComponent}/>
				
				<div id = 'configmenuwindow' hidden/>
			</div>
		)
	}
	
}




















