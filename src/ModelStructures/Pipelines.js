import { game } from '../App.js'

import { PipeNodeModel } from '../models/pipe/PipeNodeModel.js'
import { PipeModel } from '../models/pipe/PipeModel.js'

export default class Pipelines {
	constructor() {
		this.list = []
		this.models = []

		this.pipeList = []
	}

	rebuild() {
		this.list.length = 0
		this.models.length = 0

		console.time('rebuild')

		/// collect all models
		game.map.objectsList.forEach(object => {
			if (!object) {
				console.log('%cobject not exist', 'color:red')
				return false
			}

			for (let i = 0; i < object.models.length; i++) {
				let model = object.models[i]
				if (model.class === 'pipeline') {
					if (model.reset && model.reset()) {
						model = object.models[i]
					}
					this.models.push(model)
				}
			}
		})

		///// update connections
		this.models.forEach(model => {
			if (!model) {
				console.log('model not found')
				return
			}

			model.inserted = false
			model.connections.forEach(connection => connection.updateLinks())
		})

		/// remove assymetric connections for models
		this.models.forEach(model => {
			model.connections.forEach(connection => connection.checkLinks())

			let a = 0

			model.connections.forEach(connection => {
				if (!connection) return
				let model = connection.connectedModelPointer.link
				if (model) a++
			})

			model.isNode = model.subtype === 'pipemodel' && a > 2
		})

		this.models.forEach(model => {
			let result = buildPipeline(model)

			if (result) this.list.push(result)
		})

		console.timeEnd('rebuild')
		//console.log("rebuilt: ", this.list);
	}

	update() {
		this.list.forEach(pipeline => pipeline.update())
	}
}

function buildPipeline(model) {
	if (model.inserted) return null

	//var nodes = []
	var modelStack = []
	var modelStackId = 0
	var resultStack = []
	var currentModel

	modelStack.push(model)

	while (modelStackId < modelStack.length) {
		currentModel = modelStack[modelStackId]

		let a = getType(currentModel)

		if (a === 'pipemodel' && !currentModel.inserted) {
			let collectedPipe = collectPipe(currentModel)

			if (collectedPipe) {
				resultStack.push(collectedPipe)
				collectedPipe.inserted = true

				collectedPipe.connections.forEach(connection => {
					if (!connection) return
					let model = connection.connectedModelPointer.link
					if (!model) return

					if (!model.inserted) modelStack.push(model)
				})
			}
		} else if (a === 'node' && !currentModel.inserted) {
			let node = new PipeNodeModel(currentModel, true)
			resultStack.push(node)
			node.inserted = true

			node.connections.forEach(connection => {
				if (!connection) return
				let model = connection.connectedModelPointer.link
				if (!model) return

				if (!model.inserted) modelStack.push(model)
			})
		} else if (
			(a === 'pumpmodel' || a === 'tankmodel') &&
			!currentModel.inserted
		) {
			resultStack.push(currentModel)
			currentModel.inserted = true

			currentModel.connections.forEach(connection => {
				if (!connection) return
				let model = connection.connectedModelPointer.link
				if (!model) return

				if (!model.inserted) modelStack.push(model)
			})
		}

		modelStackId++
		if (modelStackId > 1000) throw new Error('buildPipeline loop overflow 1000')
	}

	//console.clear();

	/*
	
	resultStack.forEach((pointer) => {
		if (pointer.type === "combpipe") {
			console.log("combpipe: " + pointer.keys, pointer);
			return
		}
		console.log(pointer.type + ' ' + pointer.key, pointer);
	});
	
	console.log(modelStack);
	*console.log(resultStack);/*
	console.log('-------------------')
	
	*/

	return new Pipeline(resultStack)
}

function collectPipe(model) {
	if (getType(model) !== 'pipemodel' || model.inserted) return null

	var modelStack = []
	var modelStackId = 0

	var currentModel

	var reversed = false

	modelStack.push(model)
	model.inserted = true

	while (modelStackId < modelStack.length) {
		currentModel = modelStack[modelStackId]

		let nextItem = currentModel.connections.find(connection => {
			let model = connection.connectedModelPointer.link

			return (
				model &&
				!model.inserted &&
				!model.combined &&
				getType(model) === 'pipemodel'
			)
		})

		if (nextItem) nextItem = nextItem.connectedModelPointer.link

		if (nextItem) {
			reversed = false
			modelStack.push(nextItem)
			nextItem.inserted = true
		} else if (!reversed) {
			reversed = true
			modelStack.reverse()
			modelStackId--
		}

		modelStackId++
		if (modelStackId > 1000) throw new Error('collectpipe loop over 1000 units')
	}

	return new PipeModel(modelStack, true, true)
}

function getType(item) {
	if (!item) return undefined

	if (item.subtype === 'pipemodel') {
		if (item.isNode) {
			return 'node'
		} else {
			return 'pipemodel'
		}
	} else {
		return item.subtype
	}
}

class Pipeline {
	constructor(list) {
		this.type = 'pipeline'
		this.models = list
		this.nodes = list.filter(item => {
			return item.type === 'node'
		})
	}

	update() {
		this.models.forEach(model => {
			model.updateFlow(1 / 60)
		})
	}
}
