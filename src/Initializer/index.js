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
