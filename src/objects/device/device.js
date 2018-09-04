import {game} from '../../App.js';

import {Construction} from './../Base.js';
import {DeviceModel} from './../../models/DeviceModel.js';

import {Device_interface} from "./Device_interface.js";


import React, { Component } from 'react';
import ReactDOM from 'react-dom';

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
		
		this.menu_interface = Device_interface;
		this.updateInterface = null;
		
		this.resistance = 100000;
	}
	
	
	update(dt){
		
		//this.models[0].connections[0].updateLinks();
		
		this.models[0].update(0.02);
		
		if (this.updateInterface) this.updateInterface();
		
		
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








