import * as BABYLON from 'babylonjs'
import { showAxis, setCanvasSize } from 'utils.js'

import {
	onMouseMoveEvent,
	onMouseClickEvent,
	onMouseClickReleaseEvent,
	onDoubleClick,
} from 'MouseEvents.js'

import { FreeTopCameraKeyboardMoveInput } from 'KeyboardInputs.js'

export default function initBABYLON(canvas, ratio) {
	let engine = new BABYLON.Engine(canvas, true)
	let { scene, inst, materials, camera } = createScene(engine, canvas)

	let size = { x: window.innerWidth * ratio, y: window.innerHeight * ratio }
	setCanvasSize(canvas, size.x, size.y)

	engine.runRenderLoop(function() {
		scene.render()
	})

	setCanvasSize(canvas, size.x, size.y, true, ratio)

	return { engine, scene, inst, materials, camera }
}

function createScene(engine, canvas) {
	var scene = new BABYLON.Scene(engine)
	scene.clearColor = new BABYLON.Color3(0, 0, 1)

	/// --- CONFIG CAMERA --- ///

	var camera = new BABYLON.FreeCamera(
		'camera1',
		new BABYLON.Vector3(0, 10, -8),
		scene,
	)

	camera.setTarget(new BABYLON.Vector3(0, 0, -2))
	camera.fov = 0.4

	camera.attachControl(canvas, false)
	camera.inputs.removeByType('FreeCameraKeyboardMoveInput')
	camera.inputs.add(new FreeTopCameraKeyboardMoveInput())
	camera.inputs.remove(camera.inputs.attached.mouse)

	/// --- MAKE MATERIALS --- ///

	var ycolor = new BABYLON.StandardMaterial('mat1', scene)
	ycolor.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.75)
	ycolor.backFaceCulling = true
	ycolor.specularColor = new BABYLON.Color3(0, 0, 0)

	var groundMaterial = new BABYLON.StandardMaterial('mat2', scene)

	groundMaterial.diffuseTexture = new BABYLON.Texture(
		'/assets/textures/ground.jpg',
	)
	groundMaterial.bumpTexture = new BABYLON.Texture(
		'/assets/textures/groundbump.jpg',
	)

	groundMaterial.bumpTexture.uScale = 5
	groundMaterial.bumpTexture.vScale = 5
	groundMaterial.bumpTexture.level = 1

	groundMaterial.diffuseTexture.uScale = 10
	groundMaterial.diffuseTexture.vScale = 10

	groundMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1)

	//groundMaterial.wireframe = true;

	var light = new BABYLON.HemisphericLight(
		'light1',
		new BABYLON.Vector3(0, 1, 0),
		scene,
	)
	light.intensity = 0.75

	var waterMaterial = new BABYLON.StandardMaterial('waterMaterial', scene)

	waterMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1)
	waterMaterial.specularColor = new BABYLON.Color3(0, 0, 0)

	/// --- add to workspace --- ///

	let materials = { ycolor, groundMaterial, waterMaterial }

	/// --- MAKE GROUND --- ///

	scene.onPointerMove = onMouseMoveEvent
	scene.onPointerDown = onMouseClickEvent
	scene.onPointerUp = onMouseClickReleaseEvent

	canvas.addEventListener('dblclick', onDoubleClick.bind(scene))

	showAxis(1, scene)

	var inst = new BABYLON.SceneInstrumentation(scene)
	inst.captureActiveMeshesEvaluationTime = true
	inst.captureFrameTime = true

	return { scene, inst, materials, camera }
}