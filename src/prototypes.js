import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {game} from './App.js';

import * as BABYLON from 'babylonjs';

import {blockSelection, unBlockSelection} from './workspace.js';


/// item selection square and mesh for constructor

export class Selection {
	
	constructor(scene){
		
		this.ref = {link:this};
		this.scene = scene;
		
		this.squareMesh = new BABYLON.Mesh("ground1", scene);
		
		var material = new BABYLON.StandardMaterial("mat", scene);
		material.emissiveColor = new BABYLON.Color3(1, 1, 1);
		material.alpha = 0.25;
		this.squareMesh.material = material;
		
		this.squareMeshVertexData = new BABYLON.VertexData();
		this.squareMeshVertexData.positions = [	
		0, 0, 0,	0, 0, 1,	1, 0, 1, 	1, 0, 0 ];
					
		this.squareMeshVertexData.indices = [ 	
		0, 3, 1, 	3, 2, 1 ];
		
		this.squareMeshVertexData.uvs = [ 
		0, 0, 		0, 1, 		1, 1, 		1, 0 ];	
		
		this.squareMeshVertexData.normals = [];
		BABYLON.VertexData.ComputeNormals(	this.squareMeshVertexData.positions,
											this.squareMeshVertexData.indices,
											this.squareMeshVertexData.normals 	);
		this.squareMeshVertexData.applyToMesh(this.squareMesh);
		
		this.squareMesh.type = 'selection';
		this.squareMesh.isPickable = false;
		
		this.squareMesh.parentClass = this.ref;
		
		this.itemConstructorMesh = undefined;
		
		this.activeMesh = this.squareMesh;
		
		this.offsetx = 0;
		this.offsetz = 0;
		
		this.itemSize = {w:1, h:1};
		
		this.position = {x:0, y:0, z:0};
		
	}
	
	setPosition(position){
		
		this.position = position;
		
		this.activeMesh.position.x = position.x + this.offsetx;
		this.activeMesh.position.z = position.z + this.offsetz;
		this.activeMesh.position.y = position.y;
		
	}
	
	setMesh(mesh, size, position){
		
		if (size) {
			this.itemSize = size;
		}
		
		if (mesh){
			
			this.squareMesh.isVisible = false;
			this.activeMesh = mesh;
			
		} else {
			
			if (!(this.activeMesh === this.squareMesh)){
				
				this.activeMesh = this.squareMesh;
				this.activeMesh.isVisible = true;
				
				this.offsetx = 0;
				this.offsetz = 0;
				
			}
		}
		
		if (position){
			
			this.position = position;
			
			this.activeMesh.position.x = position.x;
			this.activeMesh.position.y = position.y;
			this.activeMesh.position.z = position.z;
			
		}
		
	}
	
	setRotation(rotationIndex){
		
		if (rotationIndex !== undefined){
			
			this.activeMesh.rotation.y = rotationIndex * game.TAU;
			
			this.offsetx = 0;
			this.offsetz = 0;
			
			switch(game.itemConstructor.rotationIndex){
				
				case(1):this.offsetz = this.itemSize.w; break;
				case(2):this.offsetz = this.itemSize.h; 
						this.offsetx = this.itemSize.w; break;
				case(3):this.offsetx = this.itemSize.h; break;
				
			};
			
			this.activeMesh.position.x = this.position.x + this.offsetx;
			this.activeMesh.position.z = this.position.z + this.offsetz;
			this.activeMesh.position.y = this.position.y;
			
		}
		
	}
	
}














class Char extends React.Component {
	render(){
		return(
			<div id = "Char" style={{
				top:this.props.position.y, 
				left:this.props.position.x
			}}>X</div>
		)
	}
}



/////////////////////// CHARACTER ///////////////////////

export var _character = function(){};
_character.prototype = {

	object: <Char />,
	game: undefined,
	blocklist: undefined,
	currentBlock: [],

	directionleft: 0,
	directiontop: 0,
	counter: 0,

	position: {
		x:100,
		y:100
	},
	newposition: {
		x:100,
		y:100
	},

	drawCharacter: function(){

		console.log()

		this.view = document.getElementById('View');
		//ReactDOM.render(this.object, document.getElementById('CharacterView'));
		this.blocklist = this.game.blocklist;

		this.moveItem();		
	},

	move: function() {
		var moved = false;

		if (!this.counter){

			this.newposition = Object.assign({}, this.position);

			if (this.directionleft !== 0) {
				this.newposition.x += this.directionleft*25;
				if (this.checkMovingPossible()){
					this.position.x = this.newposition.x;
					moved = true;
				} else {
					this.newposition.x = this.position.x;
				}
				this.counter += 1;
			}
			if (this.directiontop !== 0) {
				this.newposition.y += this.directiontop*25;
				if (this.checkMovingPossible()){
					this.position.y = this.newposition.y;
					moved = true;
				} else {
					this.newposition.y = this.position.y;
				}
				if (this.counter === 0) {
					this.counter += 1;
				};
			}
			if (moved){
				//this.moveItem();
			}

		} else {
			this.counter -= 1;
		}
	},

	moveItem: function (){
		//ReactDOM.render(<Char position={this.position} />, document.getElementById('CharacterView'));

		var a = Math.round(window.innerWidth/2);
		var b = Math.round(window.innerHeight/2);

		//this.view.style.left = a-this.position.x + 'px';
		//this.view.style.top =  b-this.position.y + 'px';

		this.currentBlock = [this.position.x/25, this.position.y/25];
	},

	checkMovingPossible: function(){
		if (this.blocklist[this.newposition.x/25] !== undefined) {
			if (this.blocklist[this.newposition.x/25][this.newposition.y/25] !== undefined) {
				if (this.blocklist[this.newposition.x/25][this.newposition.y/25].surface === "grass"){
					return true
				}
			}
		}
		return false
	}
}




