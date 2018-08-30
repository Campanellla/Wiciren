import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {game} from '../../App.js';



export class Tank_interface extends Component {
	
	constructor(props){
		
		super(props);
		
		this.state = {
			
			key:-1,
			type:"",
			volume: 0
			
		}
		
	}
	
	
	updateInterface(){
		
		if(this.props.item){
			
			let item = this.props.item;
			
			this.setState({
				
				key: item.key,
				type: item.type || "",
				volume: item.models[0].volume || 0
				
			});
		}
		
	}
	
	
	componentWillReceiveProps(props){ 
		
		if (this.props.item === props.item) return;
		
		if (this.props.item) this.props.item.updateInterface = null;
		
		if (props.item) props.item.updateInterface = this.updateInterface.bind(this);
	}
	
	
	
	componentDidMount(){
		
		if(this.props.item){
			this.props.item.updateInterface = this.updateInterface.bind(this);
		}
	}
	
	componentWillUnmount(){
		
		if(this.props.item){
			this.props.item.updateInterface = null;
		}
		
	}
	
	
	render(){
		
		return (
			<div>
			
				<div id = 'ItemMenuText'>
					{
						[
							"key: " + this.state.key,
							"type: " + this.state.type,
							"volume: " + this.state.volume.toFixed(1)
						].map((item, key) => {
  							return <span key={key}>{item}<br/></span>
						})
					}
				</div>
				
			</div>
		)
		
	}
	
}