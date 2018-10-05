import { game } from '../App.js'

export default class ElectricalGrids {
	constructor() {
		this.list = []
		this.models = []
		this.itemList = []
		this.poles = []
	}

	rebuild() {
		this.list.length = 0
		this.models.length = 0

		console.log('egrids rebuild start')

		game.map.objectsList.forEach(object => {
			if (!object) {
				console.log('%cobject not exist', 'color:red')
				return false
			}

			for (let i = 0; i < object.models.length; i++) {
				let model = object.models[i]
				if (model.class === 'electric') {
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

			if (model.updateLinks) {
				model.updateLinks()
			} else {
				model.connections.forEach(connection => connection.updateLinks())
			}

			if (model.subtype === 'epolemodel') {
				this.poles.push(model)
			}
		})

		this.poles.forEach(poleModel => {
			if (!poleModel.inserted) {
				let grid = this.collectPoles(poleModel)
				if (grid) this.list.push(grid)
			}
		})

		console.log('egrids rebuild stop')

		console.log(this.list)
	}

	update() {
		this.list.forEach(electricalGrid => electricalGrid.update())
	}

	collectPoles(poleModel) {
		var sourceList = []
		var consumerList = []

		var modelStack = []
		var modelStackId = 0

		var currentModel

		modelStack.push(poleModel)

		poleModel.inserted = true

		while (modelStackId < modelStack.length) {
			currentModel = modelStack[modelStackId]

			currentModel.connections.forEach(connection => {
				if (connection && connection.connectedModelPointer.link) {
					let model = connection.connectedModelPointer.link

					if (model.class === 'electric' && model.inserted !== true) {
						switch (model.subtype) {
							case 'enginemodel':
								sourceList.push(model)
								model.inserted = true
								break

							case 'epolemodel':
								modelStack.push(model)
								model.inserted = true
								break

							case 'devicemodel':
								consumerList.push(model)
								model.inserted = true
								break
							default:
							// do nothing //
						}
					}
				}
			})

			modelStackId++
			if (modelStackId > 1000)
				throw new Error('collectpole loop over 1000 units')
		}

		console.log(modelStack, sourceList, consumerList)

		return new ElectricalGrid(modelStack, sourceList, consumerList)
	}
}

class ElectricalGrid {
	constructor(poles, sources, consumers) {
		this.type = 'electricalGrid'

		this.sources = sources
		this.consumers = consumers
		this.poles = poles

		this.gridFrequency = null
	}

	update() {
		let totalSourceLoad = 0
		let totalLoad = 0
		let frequency = 0
		let voltage = 0
		let current = 0
		let connectedSources = 0
		// eslint-disable-next-line
		let connectedConsumers = 0
		let totalConsumerConductivity = 0

		this.sources.forEach(model => {
			if (model.connectedToGrid) {
				connectedSources++

				frequency += model.frequency
				voltage += model.voltage
				current += model.current
				totalSourceLoad += model.load
			}
		})

		if (connectedSources) {
			frequency = frequency / connectedSources
			voltage = frequency / connectedSources
		}

		if (frequency <= 5) {
			voltage = 0
		} else if (frequency < 30) {
			voltage = (frequency * 450) / 30
		} else if (frequency >= 30) {
			voltage = 450
		}

		this.consumers.forEach(model => {
			model.update(1 / 60)
			totalConsumerConductivity += model.conductivity
			connectedConsumers++
		})

		totalLoad =
			(voltage * voltage * totalConsumerConductivity * frequency * frequency) /
			60 /
			60

		1 ||
			console.log(
				'sLoad:',
				totalSourceLoad.toFixed(1),
				'Load:',
				totalLoad.toFixed(1),
				'F:',
				frequency.toFixed(1),
				'V:',
				voltage.toFixed(0),
				'A:',
				current.toFixed(1),
				'connectedSources:',
				connectedSources,
				//"connectedConsumers:", connectedConsumers,
				'1/R:',
				totalConsumerConductivity.toFixed(1),
			)

		this.sources.forEach(model => {
			if (model.connectedToGrid) {
				let fdiff = model.frequency - frequency

				if (Math.abs(fdiff) > 1) fdiff = Math.abs(fdiff) / fdiff
				if (fdiff < 0) {
					fdiff = fdiff * fdiff * -1
				} else {
					fdiff = fdiff * fdiff
				}

				model.load = totalLoad / connectedSources + fdiff * 10000000
			} else {
				model.load = 0
			}
		})

		this.sources.forEach(model => {
			model.update(1 / 60)
		})
	}
}
