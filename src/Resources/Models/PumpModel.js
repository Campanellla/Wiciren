//import {game} from '../App.js';

import { BaseModel } from './BaseModel.js'

export default class PumpModel extends BaseModel {
	constructor(args) {
		super()
		this.subtype = 'pumpmodel'
		this.class = 'pipeline'

		this.parent = args.parentPointer
		this.location = args.location

		this.connections = this.setUpConnections(args.connectionsMap)

		let config = args.config || {}

		this.pressure = config.pressure || 0
		this.volume = config.volume || 0

		this.maxVolume = 25000
		this.flowresistance = 0.2

		this.returnFlow = []
		this.inflow = []
	}

	updateFlow(dt) {
		this.pressure = this.volume / 1000

		this.inflow.forEach(flow => {
			if (flow) {
				if (this.volume + flow.Q < 1000) {
					this.volume += flow.Q
				} else {
					let a = 1000 - this.volume
					this.volume = 1000
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

		this.connections.forEach(pointer => {
			if (!pointer) return

			let item = pointer.link

			if (this.pressure > item.pressure) {
				if (this.volume > 0) {
					item.inflow.push({
						Q: (this.pressure - item.pressure) * 10,
						Source: this.pointer,
					})

					this.volume -= (this.pressure - item.pressure) * 10
				}
			}
		})

		this.inflow.length = 0
	}
}
