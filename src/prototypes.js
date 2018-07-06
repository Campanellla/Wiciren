import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {game} from './App.js';

import * as BABYLON from 'babylonjs';

import {blockSelection, unBlockSelection} from './workspace.js';


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





/////////////////////// GAMEOBJECT ///////////////////////

export class Map {
	
	constructor(blockHeight, initBlocksHeight, scene){
		
		console.time("Map");
		
		this.blocks = [];
		
		this.objectsList = [];
		this.renderList = [];
		
		this.blockHeight = blockHeight;
		
		var initBlocksWidth = initBlocksHeight;
		var blockIndex = 0;
		
		for (var blockIndexW = 0; blockIndexW < initBlocksWidth; blockIndexW++){
			
			for (var blockIndexH = 0; blockIndexH < initBlocksHeight; blockIndexH++){
			
				this.blocks[blockIndex] = new Block(blockHeight, {x:blockHeight * blockIndexH, z:blockHeight * blockIndexW});
				blockIndex++;
				
			}
			
		}
		console.timeEnd("Map");
	}
	
	getItemFromCoord(x,z){
		
		var block = this.findBlock(x, z);
		if (block){ 
			var item = block.tiles[x-block.offset.x][z-block.offset.z].object
		}		
		
		
		if (item) {
			
			if (item.link){
				return item.link
			} else {
				block.tiles[x-block.offset.x][z-block.offset.z].object = undefined;
				return null
			}
			
		} else {
			return null
		}
		
	}
	
	insertItem(item, x, z, width, height, rotationIndex){
		
		var tiles = [];
		var offsets = [];
		
		if (!width) width = 1;
		if (!height) height = 1;
		
		if (rotationIndex%2){
			let w = width;
			height = width;
			width = w;
		}
		
		for(var w = 0; w < width; w++){
			
			for(var h = 0; h < height; h++){
				
				var block = this.findBlock(x,z);
		
				if (block){
					
					if (block.tiles[x-block.offset.x][z-block.offset.z].object) {
						console.log("item contains: ");
						console.log(block.tiles[x-block.offset.x][z-block.offset.z].object);
					} else {
						tiles.push(block.tiles[x-block.offset.x + w][z-block.offset.z + h]);
						console.log('x: ' + (x-block.offset.x + w) + ' y: ' + (z-block.offset.z + h));
					}
					
				}
				
				
			}
			
		}
		
		tiles.forEach((tile) => {tile.object = item.ref});
		
	}
	
	findBlock(x, z){
		
		for (var i in this.blocks){
			if (this.blocks[i].offset.x <= x && this.blocks[i].offset.x + this.blockHeight > x){
				if (this.blocks[i].offset.z <= z && this.blocks[i].offset.z + this.blockHeight > z){
					return this.blocks[i]
				}
			}
		}
		return null
	}
	
	
}



class Block {
	
	constructor(blockHeight, offset){
		
		this.visible = false;
		this.drawn = false;
		
		this.offset = offset;
		this.tiles = [];
		this.blockHeight = blockHeight;
		this.water = [];
		
		for (var i = 0; i < blockHeight; i++) {
			this.tiles[i] = [];
			for (var ii = 0; ii < blockHeight; ii++) {
				this.tiles[i][ii] = new Tile();
			}
		}
		
		//this.drawBlock();
		
	}
	
	disposeMeshes(){
		this.visible = false;
		this.drawn = false;
		this.mesh.dispose();
		for (var i = 0; i < this.water; i++){
			this.water[i].dispose();
		};
	}
	
	
	drawBlock(){
		
		this.mesh = this.genmap(this.blockHeight, this.blockHeight, this.tiles, game.scene);
		this.mesh.type = 'ground';
		var mat = new BABYLON.StandardMaterial("mat", game.scene);
		this.mesh.material = game.materials.groundMaterial;
		this.mesh.position.x = this.offset.x;
		this.mesh.position.z = this.offset.z;
		
		for (var hi = 0; hi<this.blockHeight; hi++) {

			for (var wi = 0; wi<this.blockHeight; wi++) {

				if ( this.tiles[wi][hi].surface === "water"){
					
					var tile = new BABYLON.Mesh.CreateGround("water", 1, 1, 2, game.scene);
					tile.position = new BABYLON.Vector3(this.offset.x + wi + 0.5, -0.05, this.offset.z + hi + 0.5);
					tile.material = game.materials.waterMaterial;
					tile.type = "water";
					
					this.water.push(tile);
					
				}
			}
		}
		this.drawn = true;
		this.visible = true;
		
	}
	
	updateBlock(){
		
		if (!this.visible) return;
		
		this.mesh.dispose();
		
		this.mesh = this.genmap(this.blockHeight, this.blockHeight, this.tiles, game.scene);
		this.mesh.type = 'ground';
		var mat = new BABYLON.StandardMaterial("mat", game.scene);
		this.mesh.material = game.materials.groundMaterial;
		this.mesh.position.x = this.offset.x;
		this.mesh.position.z = this.offset.z;
		
		for (var i = 0; i < this.water; i++){
			this.water[i].dispose();
		};
		
		this.water = [];
		
		for (var hi = 0; hi<this.blockHeight; hi++) {

			for (var wi = 0; wi<this.blockHeight; wi++) {

				if ( this.tiles[wi][hi].surface === "water" ){
					
					var tile = new BABYLON.Mesh.CreateGround("water", 1, 1, 2, game.scene);
					tile.position = new BABYLON.Vector3(this.offset.x + wi + 0.5, -0.05, this.offset.z + hi + 0.5);
					tile.material = game.materials.waterMaterial;
					tile.type = "water";
					
					this.water.push(tile);
					
				}
			}
		}
		this.drawn = true;
		this.visible = true;
		
	}
	
	hideBlock(){
		
		this.visible = false;
		this.mesh.visibility = false
		for (var i = 0; i < this.water; i++){
			this.water[i].visibility = false;
		};
		
	}
	
	showBlock(){
		
		if (this.drawn){
			
			this.visible = true;
			this.mesh.visibility = true;
			for (var i = 0; i < this.water; i++){
				this.water[i].visibility = true;
			};
			
		} else {
			this.drawBlock();
		}
	}
	
	
	/*
	make custom mesh from {height array}.height

	args: height, width, height array, scene to draw into
	return: custom mesh
	*/

	genmap(h, w, map, scene){
		
		var timeStamp = new Date();
		
		var customMesh = new BABYLON.Mesh("custom", scene);
		var positions = [];
		//positions.length = h * w * 18 * 4;
		
		var indices = [];
		
		var temph = [];
		var tempf = [];
		
		var p = 0;
		var ind = 0;
		
		for (var hh = 0; hh < h; hh++){
			
			for(var ww = 0; ww < w; ww++){
				
				var pos = p/3;
				
				var flat = false;
				
				var hhhz = hh > 0;
				var wwhz = ww > 0;
				var hhm1 = hh < h-1;
				var wwm1 = ww < w-1;
				
				if (hhhz && wwhz &&	hhm1 &&	wwm1) {
					
					if (map[ww][hh].height === map[ww+1][hh].height &&
						map[ww][hh].height === map[ww-1][hh].height &&
						map[ww][hh].height === map[ww][hh+1].height &&
						map[ww][hh].height === map[ww][hh-1].height ){
							flat = true;
					}
				}
				
				if (flat){
					
					var y = map[ww][hh].height
					
					var tempf = [
									ww+0,   y, 	hh+0,
									ww+0,   y, 	hh+1,
									ww+1,	y, 	hh+1, 	
									ww+1,	y, 	hh+0
								];
						
					var tempi = [	pos + 0,
									pos + 3,
									pos + 1,
									pos + 3,
									pos + 2,
									pos + 1 
								]
					
				} else {
					
					var y = new Array(8);
					
					if (map[ww][hh].height){
						y[4] = map[ww][hh].height;
					}
					
					if (hhhz){ //bottom mid
						y[7] = map[ww][hh].height + (map[ww][hh-1].height - map[ww][hh].height)/2; 
						
						if (wwm1){ //bottom r
							y[8]  = (map[ww][hh].height + (map[ww+1][hh-1].height - map[ww][hh].height)/2 + map[ww][hh-1].height + (map[ww+1][hh].height - map[ww][hh-1].height)/2)/2
						}
					}
					
					if (wwhz){ //mid l
						y[3]  = map[ww][hh].height + (map[ww-1][hh].height - map[ww][hh].height)/2;
						
						if (hhhz){ //bottom l
							y[6] = (map[ww][hh].height + (map[ww-1][hh-1].height - map[ww][hh].height)/2 + map[ww][hh-1].height + (map[ww-1][hh].height - map[ww][hh-1].height)/2)/2;
						}
						
						if (hhm1){ //top l
							y[0] = (map[ww][hh].height + (map[ww-1][hh+1].height - map[ww][hh].height)/2 + map[ww][hh+1].height + (map[ww-1][hh].height - map[ww][hh+1].height)/2)/2
						}
					}
					
					if (hhm1){ // top mid
						y[1] = map[ww][hh].height + (map[ww][hh+1].height - map[ww][hh].height)/2;
					}
					
					if (wwm1){ //mid left
						y[5] = map[ww][hh].height + (map[ww+1][hh].height - map[ww][hh].height)/2;
						
						if (hhm1){ //top r
							y[2] = (map[ww][hh].height + (map[ww+1][hh+1].height - map[ww][hh].height)/2 + map[ww][hh+1].height + (map[ww+1][hh].height - map[ww][hh+1].height)/2)/2;
						}
					}
					
					var tempf = [	
								
								ww+0,	0,	hh+1,	//0
								ww+0.5,	0,	hh+1,	//1
								ww+1,	0,	hh+1,	//2
								
								ww+0,	0,	hh+0.5,	//3
								ww+0.5,	0,	hh+0.5,	//4
								ww+1,	0,	hh+0.5,	//5
								
								ww+0,	0,	hh+0,	//6
								ww+0.5,	0,	hh+0,	//7
								ww+1,	0,	hh+0	//8
								
								];	
								
					var tempi = [	
									pos + 4,
									pos + 3,
									pos + 6,
									
									pos + 4,
									pos + 6,
									pos + 7,
									
									pos + 4,
									pos + 7,
									pos + 8,
									
									pos + 4,
									pos + 8,
									pos + 5,
									
									pos + 4,
									pos + 5,
									pos + 2,
									
									pos + 4,
									pos + 2,
									pos + 1,
									
									pos + 4,
									pos + 1,
									pos + 0,
									
									pos + 4,
									pos + 0,
									pos + 3
					 			]
					
					for (var i = 0; i < y.length; i++){
						
						if (y[i] === undefined) y[i] = 0;
						
						tempf[i * 3 + 1] = y[i];
						
					}
				}
				
				positions.length += tempf.length;
				for (var n = 0; n < tempf.length; n++){
					
					positions[p] = tempf[n];
					
					p++;
				}
				
				indices.length += tempi.length;
				for (var n = 0; n < tempi.length; n++){
					
					indices[ind] = tempi[n];
					ind++;
				}
			}
		}
		
		var uvs = [];
		uvs.length = positions.length / 3 * 2;
		var uvsIndex = 0;
		
		for (var n = 0; n < positions.length / 3; n++){
			
			uvs[uvsIndex++] = positions[3 * n] / 100;
			uvs[uvsIndex++] = positions[3 * n + 2] / 100;
			
		}
		
		var vertexData = new BABYLON.VertexData();
		
		var normals = [];
		BABYLON.VertexData.ComputeNormals(positions, indices, normals);
		
		vertexData.positions = positions;
		vertexData.indices = indices;
		vertexData.normals = normals;
		vertexData.uvs = uvs;
		
		console.log(positions.length + ' : ' + indices.length);
		
		var timeStamp2 = new Date();
		game.timestamp1 = ((game.timestamp1 * 10) + Number(timeStamp2 - timeStamp))/11;
		
		vertexData.applyToMesh(customMesh);
		game.timestamp2 = ((game.timestamp2 * 10) + Number(new Date() - timeStamp2))/11;
		
		return customMesh
	}
	
	
	
}


/////////////////////// BLOCK ///////////////////////
class Tile {

	constructor(args) {
		
		this.surface = "grass";
		this.object = undefined;
		this.height = 0;
		
		this.hmap = [0, 1, 2, 3];
		
		if (args !== undefined){
			this.surface = args.surface;
			this.object = args.object;
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




