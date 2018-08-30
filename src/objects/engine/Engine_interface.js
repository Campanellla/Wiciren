import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {game} from '../../App.js';



export class Engine_interface extends Component {
	
	
	constructor(props){
		
		super(props);
		
		this.sliderRef = React.createRef();
		
		this.state = {
			
			key: -1,
			type: "",
			volume: 0,
			speed: 0,
			load: 0,
			controlIndex: 0,
			setPoint: 0,
			frequency: 0,
			current: 0,
			run: "run"
			
		}
		
	}
	
	updateInterface(){
		
		if(this.props.item){
			
			let item = this.props.item;
			
			this.setState({
				key: item.key || 0,
				type: item.type || "",
				volume: item.models[0].volume || 0,
				speed: item.models[1].speed || 0,
				load: item.models[1].load || 0,
				controlIndex: item.models[1].controlIndex || 0,
				setPoint: item.models[1].setPoint || 0,
				frequency: item.models[1].frequency || 0,
				current: item.models[1].current || 0,
				run: (item.models[1].run && "stop") || "run"
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
	
	
	sliderChange(){
		
		let num = Number(this.sliderRef.current.value);
		
		let item = this.props.item;
		
		if(item && item.models[1].setPoint !== undefined && !isNaN(num)) {
			item.models[1].setPoint = num;
		}
	}
	
	
	onclick(){
		
		this.props.item.models[1].run = !this.props.item.models[1].run;
		
		if (this.props.item.models[1].run) {
			this.setState({run: "stop"})
		} else {
			this.setState({run: "run"})
		}
	}
	
	
	onclick2(){
			
		let speed = this.props.item.models[1].speed; 
		
		if (speed < 100){
			
			this.props.item.models[1].speed += 25;
		}
	}

	
	render(){
		return (
			<div>
			
				<div id = 'ItemMenuText'>
					{
						[
							"volume: " + this.state.volume.toFixed(1) + "ltrs",
							"speed: " + this.state.speed.toFixed(1) + " rpm",
							"load: " + this.state.load.toFixed(0) / 1000 + " kWt",
							"controlIndex: " + this.state.controlIndex.toFixed(0),
							"setPoint: " + this.state.setPoint.toFixed(1),
							"frequency: " + this.state.frequency.toFixed(1) + " Hz",
							"current: " + this.state.current.toFixed(2) + " A"
						].map((item, key) => {
  							return <span key={key}>{item}<br/></span>
						})
					}
				</div>
				
				<button onClick = {this.onclick.bind(this)}>{this.state.run}</button>	
				<button onClick = {this.onclick2.bind(this)}>starter</button>
				
				<div className="slidecontainer">
					<input 	type="range" min="0" max="1000" defaultValue={900 || this.props.item.setPoint} className="slider" id="myRange" 
					 		onChange={this.sliderChange.bind(this)} ref={this.sliderRef} step = "0.1"/>
				</div>
				
			</div>
		)
	}
	
}