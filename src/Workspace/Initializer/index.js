import * as BABYLON from 'babylonjs'

import assignEvents from 'src/Events/events.js'

import initBABYLON from './engine'
import sessionInit from './session'
import Intervals from './intervals'

import { Selection } from 'src/Selection.js'

///// --- INIT --- /////

export default function init({ appComponent, UI }) {
	this.interfaceComponent = UI
	this.appComponent = appComponent

	if (!UI.current) throw new Error('ui.current undefined')
	this.UI = UI.current

	let canvas = document.getElementById('canvas')
	appComponent.setFocusCanvas()

	if (!BABYLON.Engine.isSupported()) {
		console.log('%cBABYLON ENGINE IS NOT SUPPORTED', 'color:red')
		return
	}

	/// --- init engine and scene --- ///
	let { engine, scene, materials, inst, camera } = initBABYLON(
		canvas,
		this.config.canvasMultiplier,
	)
	this.canvas = canvas
	this.engine = engine
	this.scene = scene
	this.camera = camera
	this.materials = materials

	this.scninst = inst

	this.meshes = {}

	let selection = new Selection(scene)
	this.selection = selection

	this.loader.loadMeshes(scene)

	sessionInit()

	// --- events --- //
	assignEvents(this)

	//--- tick functions ---//
	this.Intervals = new Intervals(this)
	// load session

	function loadSession() {
		this.makeTests()

		var a = window.localStorage.getItem('save0')
		try {
			var b = JSON.parse(a)
			this.loadSession(b)
		} catch (err) {
			console.log(err)
		}

		console.log('session loaded')
	}

	// load session
	this.loader.onLoad = loadSession.bind(this)

	/// --- LOG --- ///
	console.log('Device pixel ratio: ' + window.devicePixelRatio)

	let saves = []

	for (var saveStr in window.localStorage) {
		let a = saveStr.match(/save\d{1,3}$/i)
		if (a) saves.push(a[0])
	}
}
