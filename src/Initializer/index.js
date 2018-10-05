import * as BABYLON from 'babylonjs'

import { game } from '../App.js'
import { assignEvents } from '../events.js'
import initBABYLON from './engine'
import sessionInit from './session'
import Intervals from './intervals'

///// --- INIT --- /////

export default function init() {
	let canvas = document.getElementById('canvas')
	canvas.focus()

	if (!BABYLON.Engine.isSupported()) {
		console.log('%cBABYLON ENGINE IS NOT SUPPORTED', 'color:red')
		return
	}

	/// --- init engine and scene --- ///
	let { engine, scene } = initBABYLON(canvas, game.config.canvasMultiplier)
	game.canvas = canvas
	game.engine = engine
	game.scene = scene

	game.loader.loadMeshes(scene)

	sessionInit()

	// --- events --- //
	assignEvents(game)

	//--- tick functions ---//
	game.Intervals = new Intervals(game)
	// load session

	function loadSession() {
		makeTests()

		var a = window.localStorage.getItem('save0')
		try {
			var b = JSON.parse(a)
			game.loadSession(b)
		} catch (err) {
			console.log(err)
		}

		console.log('session loaded')
	}

	game.loader.onLoad = loadSession

	// load session

	window.getitem = game.map.getItemFromCoord.bind(game.map)

	/// --- LOG --- ///
	console.log('Device pixel ratio: ' + window.devicePixelRatio)

	let saves = []

	for (var saveStr in window.localStorage) {
		let a = saveStr.match(/save\d{1,3}$/i)
		if (a) saves.push(a[0])
	}
	console.log(saves)
}

function makeTests() {
	var passed = 0
	var failed = 0
	function test(fn) {
		let testResult = fn()
		if (testResult.OK) {
			passed++
			console.log(`%c${testResult.name} passed`, 'color: green')
		} else {
			failed++
			console.log(`%c${testResult.name} failed`, 'color: red')
		}
	}

	test(itCreatedBox)
	test(itCreatedDevice)
	console.log(
		`tests finished\n%cpassed: ${passed} %cfailed: ${failed}`,
		'color:green',
		'color: red',
	)
	return { passed, failed }
}

function itCreatedBox() {
	game.itemConstructor.setActiveConstructor('box')
	game.selection.position.x = 4
	game.selection.position.z = 4
	game.itemConstructor.constructActiveObject()
	game.itemConstructor.setInactiveConstructor()
	let item = game.map.getItemFromCoord(4, 4)
	return { name: 'create box', OK: item && item.type === 'box' }
}

function itCreatedDevice() {
	game.itemConstructor.setActiveConstructor('device')
	game.selection.position.x = 10
	game.selection.position.z = 10
	game.itemConstructor.constructActiveObject()
	game.itemConstructor.setInactiveConstructor()

	let item1 = game.map.getItemFromCoord(10, 10)
	let item2 = game.map.getItemFromCoord(10, 11)
	let item3 = game.map.getItemFromCoord(11, 10)
	let item4 = game.map.getItemFromCoord(11, 11)

	let OK =
		item1 &&
		item1.type === 'device' &&
		item2 &&
		item2.type === 'device' &&
		item3 &&
		item3.type === 'device' &&
		item4 &&
		item4.type === 'device'
	return { name: 'create device', OK }
}
