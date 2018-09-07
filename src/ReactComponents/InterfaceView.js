import React, { Component } from 'react';


import {FpsLabel, DrawCallsLabel} from './InterfaceComponents/FpsLabel.js';
import {TimeText} from './InterfaceComponents/Labels.js';

import SelectionView from './SelectionView.js';
import WindowContainer from './WindowContainer.js';

import {ButtonsMenu} from './InterfaceComponents/ButtonsMenu.js';


export default class InterfaceView extends Component {
	
	constructor(props){
		super(props);
		this.game = this.props.workspace;
		
		this.timeTextComponent = React.createRef();
		this.drawCallsLabelComponent = React.createRef();
		this.fpsLabelComponent = React.createRef();
		
		this.selectionViewComponent = React.createRef();
		this.windowContainerComponent = React.createRef();
		
		this.buttonsMenuComponent = React.createRef();
		
	}
	
	
	render(){
		return (
			<div>
				<TimeText ref={this.timeTextComponent}/>
				<DrawCallsLabel ref = {this.drawCallsLabelComponent}/>
				<FpsLabel ref={this.fpsLabelComponent}/>
				
				<SelectionView ref={this.selectionViewComponent}/>
				<WindowContainer ref={this.windowContainerComponent}/>
				
				<ButtonsMenu 
					ref={this.buttonsMenuComponent} 
					windowContainer={this.windowContainerComponent} 
					className="configmenubutton"
					workspace={this.game}
				/>
			</div>
		)
	}
	
}




















