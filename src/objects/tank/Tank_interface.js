import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {game} from '../../App.js';



export class Tank_interface extends Component {
	
	constructor(props){
		
		super(props);
		
		this.state = {
			
			key:-1,
			type:"",
			volume: 0,
			pressure:0
			
		}
		
		this.updateInterface = this.updateInterface.bind(this);
		
		this.onClickAdd = this.onClickAdd.bind(this);
	}
	
	
	updateInterface(){
		
		if(this.props.item){
			
			let item = this.props.item;
			
			this.setState({
				
				key: item.key,
				type: item.type || "",
				volume: item.models[0].volume || 0,
				pressure: item.models[0].pressure || 0
				
			});
		}
		
	}
	
	
	componentWillReceiveProps(props){ 
		
		if (this.props.item === props.item) return;
		
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
	
	onClickAdd(){
		
		this.props.item.models[0].volume += 100;
		
	}
	
	
	render(){
		
		return (
			<div>
			
				<div id = 'ItemMenuText'>
					{
						[
							"key: " + this.state.key,
							"type: " + this.state.type,
							"volume: " + this.state.volume.toFixed(1),
							"pressure: " + this.state.pressure.toFixed(1)
						].map((item, key) => {
  							return <span key={key}>{item}<br/></span>
						})
					}
				</div>
				
				<button onClick = {this.onClickAdd}>add 100</button>
				
			</div>
		)
		
	}
	
}