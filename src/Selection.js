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
		this.squareMeshVertexData.positions = 
			[	
				0, 0, 0,	
				0, 0, 1,	
				1, 0, 1, 	
				1, 0, 0 
			];
					
		this.squareMeshVertexData.indices = 
			[ 	
				0, 3, 1, 	
				3, 2, 1 
			];
		
		this.squareMeshVertexData.uvs = 
			[ 
				0, 0, 		
				0, 1, 		
				1, 1, 		
				1, 0 
			];	
		
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
		
		this.activeItem;
		
	}
	
	setPosition(position){
		
		if (!this.activeMesh.isVisible) this.activeMesh.isVisible = true;
		
		if (!position) return ;
		
		this.position = position;
		
		this.activeMesh.position.x = position.x + this.offsetx;
		this.activeMesh.position.z = position.z + this.offsetz;
		this.activeMesh.position.y = position.y;
		
	}
	
	
	setActiveMesh(mesh, config){
		
		if (mesh){
			
			this.itemSize = config.size;
			this.activeMesh = mesh;
			this.activeMesh.isVisible = this.squareMesh.isVisible;
			this.squareMesh.isVisible = false;
			this.activeMesh.position.x = this.squareMesh.position.x;
			this.activeMesh.position.z = this.squareMesh.position.z;
			
		} else {
			
			if (!(this.activeMesh === this.squareMesh)){
			
				this.squareMesh.position.x = this.activeMesh.position.x;
				this.squareMesh.position.z = this.activeMesh.position.z;
				
				this.activeMesh = this.squareMesh;
				this.activeMesh.isVisible = true;
				
				this.offsetx = 0;
				this.offsetz = 0;
				
				this.itemSize = {w:1, h:1};
				
			}
		}
		
	}
	
	
	setRotation(rotationIndex){
		
		if (rotationIndex === undefined) return;
		
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
	
	
	setInvisible(){
		
		this.activeMesh.isVisible = false;
		
	}
	
	
	setVisible(){
		
		this.activeMesh.isVisible = true;
		
	}
	
}

