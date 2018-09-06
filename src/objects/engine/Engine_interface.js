import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {game} from '../../App.js';



export class Engine_interface extends Component {
	
	constructor(props){
		
		super(props);
		this.sliderRef = React.createRef();
		
		let item = this.props.item;
		if (!item) item = {};
		if (!item.models || !item.models[0] || !item.models[1]){
			item.models = [{},{}];
		}
		
		this.state = {
			key: item.key || -1,
			type: item.type || "",
			volume: item.models[0].volume || 0,
			speed: item.models[1].speed || 0,
			load: item.models[1].load || 0,
			controlIndex: item.models[1].controlIndex || 0,
			setPoint: item.models[1].setPoint || 0,
			frequency: item.models[1].frequency || 0,
			current: item.models[1].current || 0,
			run: (item.models[1].run && "stop") || "run",
			connected: (item.models[1].connectedToGrid && "disconnect") || "connect"
		}
		
		this.updateInterface = this.updateInterface.bind(this);
		this.onClickRun = this.onClickRun.bind(this);
		this.onClickStart = this.onClickStart.bind(this);
		this.onClickConnect = this.onClickConnect.bind(this);
		this.onSliderChange = this.onSliderChange.bind(this);
		
		this.updateInterface();
	}
	
	componentWillReceiveProps(props){
		if (this.props.item === props.item) return;
		console.log(this.props.item, props.item);
		if (this.props.item) this.props.item.updateInterface = null;
		if (props.item) props.item.updateInterface = this.updateInterface;
	}
	
	componentDidMount(){
		if(this.props.item){
			this.props.item.updateInterface = this.updateInterface;
			game.componentsNeedUpdate.push({component:this, update:this.updateInterface});
		}
	}
	
	componentWillUnmount(){
		
		let key = game.componentsNeedUpdate.findIndex(c => c.component === this);
		
		if (key !== -1) {
			game.componentsNeedUpdate.splice(key, 1);
		} else {
			console.log(this, "not found myself in game.componentsNeedUpdate");
		}
		
		if(this.props.item){
			this.props.item.updateInterface = null;
		}
	}
	
	
	updateInterface(){
		let item = this.props.item;
		if(item){
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
				run: (item.models[1].run && "stop") || "run",
				connected: (item.models[1].connectedToGrid && "disconnect") || "connect"
			});
		}
	}
	
	
	onSliderChange(){
		
		let num = Number(this.sliderRef.current.value);
		
		let item = this.props.item;
		
		if(item && item.models[1].setPoint !== undefined && !isNaN(num)) {
			item.models[1].setPoint = num;
		}
	}
	
	
	onClickRun(){
		
		this.props.item.models[1].run = !this.props.item.models[1].run;
		
		if (this.props.item.models[1].run) {
			this.setState({run: "stop"})
		} else {
			this.setState({run: "run"})
		}
	}
	
	
	onClickStart(){
			
		let speed = this.props.item.models[1].speed; 
		
		if (speed < 100){
			
			this.props.item.models[1].speed += 25;
		}
	}
	
	
	onClickConnect(){
			
		this.props.item.models[1].connectedToGrid = !this.props.item.models[1].connectedToGrid;
		
		if (this.props.item.models[1].connectedToGrid) {
			this.setState({run: "disconnect"})
		} else {
			this.setState({run: "connect"})
		}
	}

	
	render(){
		return (
			<div>
			
				<div id = 'ItemMenuText'>
					{
						[
							"key: " + this.state.key,
							"volume: " + this.state.volume.toFixed(1) + "ltrs",
							"speed: " + this.state.speed.toFixed(1) + " rpm",
							"load: " + (this.state.load / 1000).toFixed(0) + " kWt",
							"controlIndex: " + this.state.controlIndex.toFixed(0),
							"setPoint: " + this.state.setPoint.toFixed(1),
							"frequency: " + this.state.frequency.toFixed(1) + " Hz",
							"current: " + this.state.current.toFixed(2) + " A"
						].map((item, key) => {
  							return <span key={key}>{item}<br/></span>
						})
					}
				</div>
				
				<button onClick = {this.onClickRun}>{this.state.run}</button>	
				<button onClick = {this.onClickStart}>starter</button>
				<button onClick = {this.onClickConnect}>{this.state.connected}</button>
				
				<div className="slidecontainer">
					<input 	type="range" min="880" max="920" defaultValue={this.state.setPoint} className="slider" id="myRange" 
					 		onChange={this.onSliderChange} ref={this.sliderRef} step = "0.1"/>
				</div>
				
			</div>
		)
	}
	
}