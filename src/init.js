// --- REACT --- //
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import * as BABYLON from 'babylonjs';

import {game} from './App.js';


import {onMouseMoveEvent, onMouseClickEvent, onMouseClickReleaseEvent, onDoubleClick} from './MouseEvents.js';

import {FreeTopCameraKeyboardMoveInput} from './KeyboardInputs.js';

import {_character, Map, Selection} from './prototypes.js';

import {assignEvents, SelectAction, SelectToggle} from './events.js';

import {updateObjects, updatePipeline, updatePipeline1} from './updates.js';


import ItemMenu from './ReactComponents/ItemMenu.js';
import SelectionView from './ReactComponents/SelectionView.js';
import ConfigMenu from './ReactComponents/ConfigMenu.js';

import {createMap, load, save, setCanvasSize, showAxis} from './workspace.js';

import {loadMeshes} from './meshesLoader.js';






///// --- INIT --- ///// 

export default function init(){
	
	game.toggle = true;
	
	console.log("Device pixel ratio: " + window.devicePixelRatio)
	
	var canvas = document.getElementById('canvas');
	canvas.style.cursor = "pointer";
	
	
	game.InterfaceView.appendItem(<div id= 'header'></div>);
	game.InterfaceView.appendItem(<div id= 'indtext'></div>);
	game.InterfaceView.appendItem(<div id= 'timetext'></div>);
	game.InterfaceView.appendItem(<div id= 'eventtext'></div>);
	game.InterfaceView.appendItem(<div id= 'fpstext'></div>);
	
	game.InterfaceView.appendItem(<SelectionView/>);
	game.InterfaceView.appendItem(<ConfigMenu />);
	
	game.InterfaceView.appendItem(<div id = 'configmenuwindow' hidden/>);
	
	game.InterfaceView.appendItem(<ItemMenu />);
	
	
	
	if (BABYLON.Engine.isSupported()) {
		
		// init engine and scene
		var engine = initBABYLON(canvas);
		
		game.engine = engine;
		game.canvas = canvas;
		
		canvas.focus();
		
		
		/// --- create and draw ground --- ///
		game.map = new Map(100, 10, game.scene);
		
		/// --- make lake --- ///
		game.map.blocks[0].tiles[1][1].surface = "water";
		game.map.blocks[0].tiles[1][1].height = -0.1;
		game.map.blocks[0].tiles[2][1].surface = "water";
		game.map.blocks[0].tiles[2][1].height = -0.1;
		game.map.blocks[0].tiles[1][2].surface = "water";
		game.map.blocks[0].tiles[1][2].height = -0.1;
		game.map.blocks[0].tiles[2][2].surface = "water";
		game.map.blocks[0].tiles[2][2].height = -0.1;
		
		game.map.blocks[0].updateBlock();
		
		assignEvents(game);

		//--- tick functions ---//

		var intervalscount = [];
		
		var time = 0.0;
		
		var updatetime = 0.1;
		
		function updateMap(){
			
			var x = game.camera.position.x;
			var z = game.camera.position.z;
			
			var refreshCount = 0;
			
			for(var blockIndex = 0; blockIndex < game.map.blocks.length; blockIndex++){
				
				var offset = game.map.blocks[blockIndex].offset
				if (offset.x > x - 250 && offset.x < x + 150 && offset.z > z - 250 && offset.z < z + 150){
					if (!game.map.blocks[blockIndex].visible){
						game.map.blocks[blockIndex].drawBlock();
						if (refreshCount === 0) {
							refreshCount = 0;
							break
						}; 
						refreshCount++;
					}
				} else {
					if (game.map.blocks[blockIndex].visible){
						game.map.blocks[blockIndex].disposeMeshes();
					}
				}
			}
		}
		
		var dcl = 0;

		function updateontimer() {
			
			updatemouse();
			time += updatetime;
			document.getElementById('timetext').innerText = time.toFixed(1) + ' s,'
			document.getElementById('timetext').innerText += ' x: ' + game.camera.position.x.toFixed(1) + ' z: ' + game.camera.position.z.toFixed(1);
			try{
			//document.getElementById('timetext').innerText += ' g: ' + game.timestamp1.toFixed(1) + ' a: ' + game.timestamp2.toFixed(1)
			document.getElementById('timetext').innerText += ' DC: ' + game.scninst.drawCallsCounter.current + ' aa: ' + game.scninst.activeMeshesEvaluationTimeCounter.current.toFixed(3);
			document.getElementById('timetext').innerText += " bb: " + dcl.toFixed(3);
			dcl = (game.scninst.frameTimeCounter.current + dcl * 25)/26 ;
			
			document.getElementById("fpstext").innerText = engine.getFps().toFixed() + " fps";
			
			} catch(e){
				
			}
			updateObjects(updatetime);
			
			if (game.pipelinechanged){
				//updatePipeline(updatetime, time);
				game.pipelinechanged = false;
			}
			
			//updatePipeline1(updatetime, time);
			
		}
		
		intervalscount.push(setInterval(updateMap, 1000/60));
		intervalscount.push(setInterval(updateontimer, updatetime*1000));
		
		game.toggle = false;

		setTimeout( function(){
				var a = window.localStorage.getItem("save0");
			try{
				var b = JSON.parse(a);
				load(b);
			}catch(err){
				console.log(err);
			}
		}, 1000);

			
	} else {
		
		console.log('BABYLON ENGINE IS NOT SUPPORTED');
		
	};
	
	
}


var currentMouseLocation = {x:0, y:0};

function updatemouse(){

	var view = document.getElementById('View');

	var x = currentMouseLocation.x;
	var y = currentMouseLocation.y;

	var block = document.getElementById('block');

	var blocklength = 25;

	var blockx = Math.round((x - x % blocklength)/blocklength);
	var blocky = Math.round((y - y % blocklength)/blocklength);

	var etext = '';
	etext += 'X: ' + blockx + ' Y: ' + blocky;

	try {
		
	if (game.blocklist[blockx] !== undefined ){
		if (game.blocklist[blockx][blocky].object !== undefined ){
			etext += ' '+game.blocklist[blockx][blocky].object.type;
			if (game.blocklist[blockx][blocky].object.volume !== undefined){
				etext += " volume: " + game.blocklist[blockx][blocky].object.volume.toFixed(1);
			}
			if (game.blocklist[blockx][blocky].object.pressure !== undefined){
				etext += " pressure: " + game.blocklist[blockx][blocky].object.pressure.toFixed(2);
			}
			if (game.blocklist[blockx][blocky].object.Q !== undefined){
				etext += " Q: " + game.blocklist[blockx][blocky].object.Q.toFixed(4);
			}
			if (game.blocklist[blockx][blocky].object.Qmax !== undefined){
				etext += " Qmax: " + game.blocklist[blockx][blocky].object.Qmax.toFixed(4);
			}
			if (game.blocklist[blockx][blocky].object.key !== undefined){
				etext += " key: " + game.blocklist[blockx][blocky].object.key;
			}
		}
	}

	} catch(err) {
		console.log("ERROR: "+ err );
		console.log(blockx +" "+ blocky);
	}

	document.getElementById('eventtext').innerText = etext;
}


var createScene = function (engine, canvas){	
			
				
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3(0, 0, 1);
	
	/// --- CONFIG CAMERA --- ///
	
	var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 10, -8), scene);
	game.camera = camera;
	
	camera.setTarget(new BABYLON.Vector3(0, 0, -2));
	camera.fov = 0.4;
	
	camera.attachControl(canvas, false);
	camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
	camera.inputs.add(new FreeTopCameraKeyboardMoveInput());
	camera.inputs.remove(camera.inputs.attached.mouse);
	
	/// --- MAKE MATERIALS --- ///
	
	var ycolor = new BABYLON.StandardMaterial("mat1", scene);
	ycolor.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.75);
	ycolor.backFaceCulling = true;
	ycolor.specularColor = new BABYLON.Color3(0,0,0);

	var groundMaterial = new BABYLON.StandardMaterial("mat2", scene);
	
	groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg")
	groundMaterial.bumpTexture = new BABYLON.Texture("./textures/groundbump.jpg");
	
	groundMaterial.bumpTexture.uScale = 5//00//500.0;
	groundMaterial.bumpTexture.vScale = 5//00//500.0;
	groundMaterial.bumpTexture.level = 1;
	
	groundMaterial.diffuseTexture.uScale = 10//00.0;
	groundMaterial.diffuseTexture.vScale = 10//00.0;
	
	groundMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
	
	//groundMaterial.wireframe = true;
	
	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
	light.intensity = 0.75;
	
	
	var waterMaterial = new BABYLON.StandardMaterial('waterMaterial', game.scene);
	
	waterMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
	waterMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	
	
	/// --- add to workspace --- ///
	
	game.materials.ycolor = ycolor;
	game.materials.groundMaterial = groundMaterial;
	game.materials.waterMaterial = waterMaterial;
	
	
	/// --- MAKE GROUND --- ///

	
	game.BABYLON = BABYLON;
	game.scene = scene;
	
	game.meshes = {};
	
	var scn = new BABYLON.Scene(engine);
	
	var selection = new Selection(scene);
	
	
	
	game.selection = selection;
	
	scene.onPointerMove = onMouseMoveEvent;
	scene.onPointerDown = onMouseClickEvent;
	scene.onPointerUp = onMouseClickReleaseEvent;
	
	canvas.addEventListener("dblclick", onDoubleClick.bind(scene));

	showAxis(2.5, game.scene);
	
	
	var inst = new BABYLON.SceneInstrumentation(scene);
	inst.captureActiveMeshesEvaluationTime = true;
	inst.captureFrameTime = true;
	//console.log(inst);
	
	game.scninst = inst;
	
	
	loadMeshes(scene);
	
	
	
	return scene;
	
};




function initBABYLON(canvas){
	
	game.BABYLON = BABYLON;
		
	var engine = new BABYLON.Engine(canvas, true);
	var scene = createScene(engine, canvas);
	
	var ratio = game.config.canvasMultiplier;
	var size = {x:window.innerWidth * ratio, y:window.innerHeight * ratio};
	setCanvasSize(canvas, size.x, size.y);
	
	engine.runRenderLoop(function (){
		if(!game.toggle){
			scene.render();
		}
	});
	
	setCanvasSize(canvas, size.x, size.y, true, ratio);
	
	return engine	
}

