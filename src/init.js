import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import * as BABYLON from 'babylonjs';

import {game} from './App.js';

import {onMouseMoveEvent, onMouseClickEvent, onMouseClickReleaseEvent, onDoubleClick} from './MouseEvents.js';
import {FreeTopCameraKeyboardMoveInput} from './KeyboardInputs.js';
import {Selection} from './Selection.js';
import {assignEvents, SelectAction, SelectToggle} from './events.js';
import {updateObjects, updateItems} from './updates.js';
import {createMap, setCanvasSize, showAxis} from './workspace.js';
import {loadMeshes} from './meshesLoader.js';
import {GameMap} from './Map.js'



///// --- INIT --- ///// 

export default function init() {
	
	let canvas = document.getElementById('canvas');
	canvas.style.cursor = "auto";

	if (!BABYLON.Engine.isSupported()) {
		console.log('%cBABYLON ENGINE IS NOT SUPPORTED', "color:red");
		return;
	}
	
	// init engine and scene
	
	game.engine = initBABYLON(canvas);
	game.canvas = canvas;
	let engine = game.engine;
	canvas.focus();
	
	/// --- create and draw ground --- ///
	game.map = new GameMap(100, 10, game.scene);
	
	/// --- and make small lake --- ///
	game.map.blocks[0].tiles[1][1].surface = "water";
	game.map.blocks[0].tiles[1][1].height = -0.1;
	game.map.blocks[0].tiles[2][1].surface = "water";
	game.map.blocks[0].tiles[2][1].height = -0.1;
	game.map.blocks[0].tiles[1][2].surface = "water";
	game.map.blocks[0].tiles[1][2].height = -0.1;
	game.map.blocks[0].tiles[2][2].surface = "water";
	game.map.blocks[0].tiles[2][2].height = -0.1;
	
	game.map.blocks[0].updateBlock();
	
	// --- events --- //
	assignEvents(game);

	//--- tick functions ---//
	
	let intervals = {
		updateMap:undefined,
		updateItems:undefined,
		updateInterface:undefined
	}
	
	let time = 0.0;
	let frameTime = 0;
	
	let startTime = new Date().getTime();
	let lastTime = startTime;
	
	let mapUpdateTimer = 1000/60;
	let itemsUpdatetime = 1000/60;
	let interfaceUpdateTimer = 1000/24;
	
	intervals.updateMap = setInterval(game.map.updateMap, mapUpdateTimer);
	intervals.updateItems = setInterval(updateObjects, itemsUpdatetime);
	intervals.updateInterface = setInterval(updateInterface, interfaceUpdateTimer);
	
	
	function updateInterface(){
		
		var currentTime = new Date().getTime();
		var DT = (currentTime - lastTime) / 1000;
		lastTime = currentTime;
		time += DT;
		
		let timeText = 	
			time.toFixed(1) + ' s,' +
			' x: ' + game.camera.position.x.toFixed(1) + 
			' z: ' + game.camera.position.z.toFixed(1) +
			", frameTime: " + frameTime.toFixed(3);
		
		frameTime = (game.scninst.frameTimeCounter.current + frameTime * 9)/10 ;
		
		let _int = game.interfaceComponent.current;
		
		if (_int){
			if (_int.timeTextComponent.current) 
				_int.timeTextComponent.current.setState({text:timeText});
			if (_int.drawCallsLabelComponent.current) 
				_int.drawCallsLabelComponent.current.setState({text:game.scninst.drawCallsCounter.current+ ' dc'});
			if (_int.fpsLabelComponent.current) 
				_int.fpsLabelComponent.current.setState({text:engine.getFps().toFixed() + " fps"});
			if (game.componentsNeedUpdate.length){
				game.componentsNeedUpdate.forEach(c => c.update());
			}
		}
		
	}
	
	
	setTimeout(
		()=>{
			var a = window.localStorage.getItem("save0");
			try{
				var b = JSON.parse(a);
				game.loadSession(b);
			}catch(err){
				console.log(err);
			}
		}, 1000
	);
	
	
	/// --- LOG --- ///
	console.log("Device pixel ratio: " + window.devicePixelRatio);
	
}


export function ErrorOneTime(){
	
	var time = 500;
	var timeout = false;
	
	return function(text, timer){
		if (!timeout){
			console.log('%c'+text, 'color:red');
			timeout = true;
			setTimeout(() => {timeout = false}, timer || time);
		}
	}
	
}

var errorOneTime = ErrorOneTime();



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

	showAxis(1, game.scene);
	
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
		scene.render();
	});
	
	setCanvasSize(canvas, size.x, size.y, true, ratio);
	
	return engine	
}

