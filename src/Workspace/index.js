//import React from 'react'

import { ItemConstructor } from '../ItemConstructor.js'
import Connection from '../Connection.js'

import Loader from 'Loader'
import Initializer from './Initializer'
import resources from 'Resources'

import { makeTests } from './tests'

class GameWorkspace {
	constructor() {
		this.init = Initializer

		this.resources = resources

		this.makeTests = makeTests

		this.map = undefined
		this.constructionsList = []

		let modelStructs = resources.modelStructures

		this.pipelines = new modelStructs.Pipelines()
		this.electricalGrids = new modelStructs.ElectricalGrids()

		this.itemConstructor = new ItemConstructor()

		this.interfaceComponent = {}
		this.componentsNeedUpdate = []

		/// marker to be transfered to pipelines class
		this.updatePipelines = false

		/// babylon  objects
		this.engine = undefined
		this.canvas = undefined

		this.materials = {}

		/// configuration should be here
		this.config = {
			wheelSensubility: 0.04,
			keyboardSensibility: 0.25,

			keyboardProgressiveSensibility: true,
			keyboardProgressiveSensibilityMultiplier: 0.01,

			canvasMultiplier: 1.5,
		}

		this.class = {
			Connection: Connection,
		}

		this.loader = new Loader(this)

		/// --- properties --- ///

		this.timestamp1 = 0
		this.timestamp2 = 0
	}

	/// true to block selection of text(used while moving the windows)
	blockSelection(bool) {
		if (bool) document.onselectstart = () => true
		if (!bool) document.onselectstart = undefined
	}

	drawMenu(item) {
		if (
			!this.interfaceComponent.current ||
			!this.interfaceComponent.current.windowContainerComponent.current
		) {
			console.log('%cerror component not defined', 'color:red')
			return false
		}
		if (!item) {
			console.log('%cerror item not defined', 'color:red')
			return false
		}

		this.interfaceComponent.current.windowContainerComponent.current.appendWindow(
			item,
		)
		return true
	}

	saveSessionToLocal(items) {
		var objects = []

		items.forEach(item => {
			if (item && item.save) objects.push(item.save())
		})

		let saveObject = {
			objects: objects,
			camera: {
				position: this.camera.position,
				rotation: this.camera.rotation,
			},
		}

		var result

		try {
			result = JSON.stringify(saveObject)
		} catch (e) {
			console.log(e, saveObject)
		}

		return result
	}

	loadSession(data) {
		this.map.clearObjects()

		if (!data) return false

		if (data.objects) {
			data.objects.forEach(object => {
				if (object !== 'undefined') {
					this.itemConstructor.loadObject(object)
				}
			})
		}

		if (data.camera) {
			let d = data.camera
			let g = this.camera
			;[g.position.x, g.position.y, g.position.z] = [
				d.position.x,
				d.position.y,
				d.position.z,
			]
			;[g.rotation.x, g.rotation.y, g.rotation.z] = [
				d.rotation.x,
				d.rotation.y,
				d.rotation.z,
			]
		}
	}

	showGameMenu() {}
}

const workspace = new GameWorkspace()

export default workspace
