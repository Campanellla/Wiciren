//import {game} from '../../App.js';

import { BaseModel } from './../BaseModel.js'

export class PipeNodeModel extends BaseModel {
	constructor(model) {
		super()

		this.subtype = 'nodemodel'
		this.class = 'pipeline'

		this.parent = model.parent
		this.connections = model.connections
		this.location = model.location

		this.inserted = false
		this.isNode = true

		model.inserted = true

		let parent = this.parent.link

		this.modelIndex = parent.models.findIndex(m => {
			return m === model
		})
		parent.models[this.modelIndex] = this

		model.pointer.link = this

		this.origin = model

		this.inflow = []
		this.pressure = model.pressure || 0

		this.flowResistance = 0.001
		this.volume = model.volume || 0

		this.returnFlow = []

		this.type = 'node'
	}

	reset() {
		this.parent.link.models[this.modelIndex] = this.origin
		this.pointer.link = this.origin
		this.origin.pointer.link = this.origin

		return true
	}

	updateFlow(dt) {
		//this.pressure = this.volume / 25;

		this.inflow.forEach(flow => {
			if (flow) {
				if (this.volume + flow.Q < 25) {
					this.volume += flow.Q
				} else {
					let a = 25 - this.volume
					this.volume = 25
					flow.Q -= a

					this.returnFlow.push({
						Q: flow.Q,
						Source: flow.Source,
					})
				}
			}
		})

		this.returnFlow.forEach(flow => {
			flow.Source.link.volume += flow.Q
		})

		this.returnFlow.length = 0

		let pressureCombined = 0
		let pressureCombinedIndex = 0

		for (let i = 0; i < this.connections.length; i++) {
			if (
				!this.connections[i] ||
				!this.connections[i].connectedModelPointer.link
			)
				continue

			let connectedModel = this.connections[i].connectedModelPointer.link

			if (this.pressure > connectedModel.pressure) {
				if (this.volume > 0) {
					if (connectedModel.inflow) {
						////// attention
						connectedModel.inflow.push({
							Q: (this.pressure - connectedModel.pressure) * 10,
							Source: this.pointer,
						})

						this.volume -= (this.pressure - connectedModel.pressure) * 10
					}
				}
			}

			pressureCombined += connectedModel.pressure
			pressureCombinedIndex++
		}

		//console.log(pressureCombined / pressureCombinedIndex)

		this.inflow.length = 0
		if (pressureCombinedIndex)
			this.pressure = pressureCombined / pressureCombinedIndex
	}

	save() {
		return {
			pressure: this.pressure,
			volume: this.volume,
		}
	}
}
