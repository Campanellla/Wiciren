import React, { Component } from 'react';


export class TimeText extends Component {
	
	constructor(props){
		
		super(props);
		
		this.state = {text:''};
		
	}
	
	render(){
		
		return (
			
			<div id = "timetext">
				{this.state.text}
			</div>	
			
		)
	}
	
	
}