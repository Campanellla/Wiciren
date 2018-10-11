import React, { Component } from 'react';



export class FpsLabel extends Component {
	
	constructor(props){
		super(props);
		this.state = {text:''};
	}
	
	render(){
		return <div id='fpsLabel'>{this.state.text}</div>;
	}
}


export class DrawCallsLabel extends Component {
	
	constructor(props){
		super(props);
		this.state = {text:''};
	}
	
	render(){
		return <div id='drawCallsLabel'>{this.state.text}</div>;
	}
	
}
