import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {game} from '../../App.js';



export class Device_interface extends Component {
	
	
	constructor(props){
		
		super(props);
		
		this.item = this.props.item;
		
		this.a = this.item.a
		
		this.state = {
			
			key:-1,
			type:"",
			speed:-1,
			load:-1,
			controlIndex:-1
			
		}
		
	}
	
	updateInterface(){
		
		if(this.item){
			
			let item = this.item;
			
			this.setState({
				key: item.key,
				type: item.type,
				speed: item.speed,
				load: item.load,
				controlIndex: item.controlIndex
			});
		}
		
	}
	
	
	componentDidMount(){
		
		if(this.item){
			3
			this.item.updateInterface = this.updateInterface.bind(this);
			
		}
	}
	
	componentWillUnmount(){
		
		if(this.item && this.item.link){
			
			this.item.updateInterface = null;
			
		}
		
	}
	
	
	handleChange(){
		
		let num = Number(this.value.current.value);
		
		if(this.item && this.item.link && this.item.link.load !== undefined && !isNaN(num)) {
			this.item.link.load = num;
			game.updateMenu();
		}
	}
	
	
	onclick(){
			
		this.item.link.models[0].connections[0].connectedModelPointer.link.run = !this.item.link.models[0].connections[0].connectedModelPointer.link.run;
		
		if (this.item.link.models[0].connections[0].connectedModelPointer.link.run) {
			this.stopButton = "stop";
		} else {
			this.stopButton = "run";
		}
	}
	
	
	onclick2(){
			
		let speed = this.item.link.models[0].connections[0].connectedItemPointer.link.speed; 
		
		if (speed < 100){
			
			this.item.link.models[0].connections[0].connectedItemPointer.link.speed += 25;
		}
	}

	
	
	
	
	render(){
		
		return (
			<div>
			
				<div id = 'ItemMenuText'>
					{
						
						[
							"key: " + this.item.key,
							"type: " + this.item.type,
							"",
							"speed: " + this.item.speed.toFixed(1) + " rpm",
							"load: " + this.item.load.toFixed(0) + " kWt",
							"controlIndex: " + this.item.controlIndex.toFixed(0),
							""
						].map((item, key) => {
  							return <span key={key}>{item}<br/></span>
						})
					}
				</div>
				
				<button onClick = {this.onclick.bind(this.item.a)}>{this.item.a.stopButton}</button>	
				<button onClick = {this.onclick2.bind(this.item.a)}>starter</button>
				
				<div class="slidecontainer">
					<input 	type="range" min="0" max="10000" defaultValue={this.item.load} class="slider" id="myRange" 
					 		onChange={this.handleChange.bind(this.item.a)} ref={this.item.a.value}/>
				</div>
			</div>
		)
		
	}
	
}