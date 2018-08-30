import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {game} from '../../App.js';



export class Device_interface extends Component {
	
	
	constructor(props){
		
		super(props);
		
		this.sliderRef = React.createRef();
		
		this.state = {
			
			key: -1,
			type: "",
			resistance: 10000
			
		}
		
	}
	
	updateInterface(){
		
		if(this.props.item){
			
			let item = this.props.item;
			
			this.setState({
				key: item.key || 0,
				type: item.type || "",
				resistance: item.resistance || 0
			});
		}
		
	}
	
	componentWillReceiveProps(props){
		
		if (this.props.item === props.item) return;
		
		if (this.props.item) this.props.item.updateInterface = null;
		
		if (props.item) props.item.updateInterface = this.updateInterface.bind(this);
		
	}
	
	
	componentDidMount(){
		
		if(this.props.item) this.props.item.updateInterface = this.updateInterface.bind(this);
	}
	
	
	componentWillUnmount(){
		
		if(this.props.item) this.props.item.updateInterface = null;
	}
	
	
	sliderChange(){
		
		let num = Number(this.sliderRef.current.value);
		let item = this.props.item;
		
		if(item && item.resistance !== undefined && !isNaN(num)) {
			item.resistance = 1/num;
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
							"",
							"resistance: " + this.state.resistance + " Om",
							""
						].map((item, key) => {
  							return <span key={key}>{item}<br/></span>
						})
					}
				</div>
				
				<div className="slidecontainer">
					<input 	type="range" min="0.0001" max="36" defaultValue={1/(this.state.resistance+0.000001)} className="slider" id="myRange" 
					 		onChange={this.sliderChange.bind(this)} ref={this.sliderRef} step="0.001"/>
				</div>
			</div>
		)
		
	}
	
}