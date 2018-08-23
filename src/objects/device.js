import React, { Component } from 'react';
import ReactDOM from 'react-dom';


import {game} from '../App.js';

import {Construction} from './Base.js';
import {DeviceModel} from './models/DeviceModel.js';


export class _device extends Construction {
	
	constructor(args){
		
		super();
		
		this.type = "device";
		
		this.itemSize = {h:2, w:2};
		
		if (!args) args = {};
		
		if (args.key) this.key = args.key; else this.key = -1;
		this.location = args.location || {};
		this.rotationIndex = args.rotationIndex || 0;
		
		let connectionsMap = [{location: {x:0, z:0}, size: {h:2, w:2}, connLocation: {x:-1, z:0}, itemPointer: this.pointer}];
		
		this.models.push(new DeviceModel({ connectionsMap: connectionsMap, location: {x:0, z:0}, size: {h:2, w:2} }, this));
		
		
		this.volume = 0;
		this.speed = 0;
		this.controlIndex = 0;
		this.load = 0;
		
		var value = React.createRef();
		this.a = {value:value, item:this.pointer, stopButton:"stop"};
		
	}
	
	getMenu(obj){
		
		var a = this.a;
		
		var handleChange = function(){
		
			let num = Number(a.value.current.value);
			
			if(this.item) 
				if(this.item.link) 
					if (this.item.link.load !== undefined && !isNaN(num)) {
						this.item.link.load = num;
						game.updateMenu();
					}
			
		}
		
		var text = [
			"key: " + this.key,
			"type: " + this.type,
			"",
			"speed: " + this.speed.toFixed(1) + " rpm",
			"load: " + this.load.toFixed(0) + " kWt",
			"controlIndex: " + this.controlIndex.toFixed(0),
			""
		];
		
		
		var onclick = function(){
			
			this.item.link.models[0].connections[0].connectedModelPointer.link.run = !this.item.link.models[0].connections[0].connectedModelPointer.link.run;
			
			if (this.item.link.models[0].connections[0].connectedModelPointer.link.run) {
				this.stopButton = "stop";
			} else {
				this.stopButton = "run";
			}
			
		}
		
		var onclick2 = function(){
			
			let speed = this.item.link.models[0].connections[0].connectedItemPointer.link.speed; 
			
			if (speed < 100){
				
				this.item.link.models[0].connections[0].connectedItemPointer.link.speed += 25;
				
			}
			
		}
		
		var items = (
			<div>
			
				<div id = 'ItemMenuText'>
					{
						text.map((item, key) => {
  							return <span key={key}>{item}<br/></span>
						})
					}
				</div>
				
				<button onClick = {onclick.bind(this.a)}>{this.a.stopButton}</button>	
				<button onClick = {onclick2.bind(this.a)}>starter</button>
				
				<div class="slidecontainer">
					<input 	type="range" min="0" max="1000" defaultValue="0" class="slider" id="myRange" 
					 		onChange={handleChange.bind(this.a)} ref={this.a.value}/>
				</div>
			</div>
		)
		
		
		
		return items//{items:items, value:value};
		
		
		
		
	}
	
	
	
	
	update(dt){
		
		this.models[0].connections[0].updateLinks();
		
		this.models[0].update(0.02);
		
	}
	
	save(){
		var str = 
			{
				type: this.type,
				location:this.location,
				rotationIndex:this.rotationIndex,
				load: this.load,
				speed: this.speed,
				controlIndex: this.controlIndex
			};
		return str;
	}
	
	
	drawMesh(instance, subtype){
		
		subtype = subtype || this.subtype;
		
		let mesh;
		let a = game.meshes.device;
		
		mesh = this.getMesh(a, this.keynum, instance);
		
		return mesh;
	}
	
	getSize(){
		
		return {h:2, w:2};
		
	}
	
}








