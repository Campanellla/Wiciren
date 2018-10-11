//import {game} from '../App.js';

import { BaseModel } from './BaseModel.js'

export default class EngineModel extends BaseModel {
	constructor(args) {
		super()
		this.subtype = 'enginemodel'
		this.class = 'electric'

		this.parent = args.parentPointer
		this.location = args.location

		this.connections = this.setUpConnections(args.connectionsMap)

		let config = args.config || {}

		this.speed = config.speed || 100
		this.controlIndex = config.controlIndex || 0
		this.run = config.run || true
		this.I = config.I || 0
		this.frequency = config.frequency || 0
		this.voltage = config.voltage || 450
		this.setPoint = config.setPoint || 900
		this.speedDroop = config.speedDroop || 0
		this.connectedToGrid = config.connectedToGrid || false

		this.current = 0
		this.conductivity = 0
		this.load = 0
	}

	update(dt) {
		if (!this.parent.link) return

		let ratedPower = 10000000 //00;
		let setPoint = this.setPoint
		let speed = this.speed
		let controlIndex = this.controlIndex

		let consumerConductivity = this.conductivity
		let current = this.voltage * consumerConductivity
		let frequency = speed / 15

		let load = this.load
		let altLoad = load * 1.15

		let volume = this.parent.link.models[0].volume || 0

		let I = this.I

		let resistancea = ratedPower / 7000
		let resistanceb = resistancea * 1000

		if (speed < 0 || isNaN(speed)) speed = 0

		I += (setPoint - this.speedDroop - speed) * dt * 2

		if (Math.abs(I) > 50) {
			if (I > 0) I = 50
			if (I < 0) I = -50
		}

		this.I = I

		let P = (setPoint - this.speedDroop - speed) * 10

		let cisetPoint = I + P

		if (cisetPoint > 110) cisetPoint = 110
		if (cisetPoint < -10) cisetPoint = -10

		let controlIndexDx = (cisetPoint - controlIndex) * dt * 25

		if (Math.abs(controlIndexDx) > 500 * dt) {
			if (controlIndexDx > 0) controlIndexDx = 500 * dt
			if (controlIndexDx < 0) controlIndexDx = -500 * dt
		}

		if (Math.abs(controlIndexDx) < 0.1) controlIndexDx = 0

		controlIndex += controlIndexDx

		this.speedDroop = controlIndex / 1000

		if (controlIndex < 0) controlIndex = 0
		if (controlIndex > 100) controlIndex = 100

		if (!this.run) controlIndex = 0

		let fuelIndex =
			(((Math.round(controlIndex) + (Math.random() - 0.5) * 3) * ratedPower) /
				100 /
				900) *
			speed
		let volumeChange = (fuelIndex / 20000000) * dt

		if (volume < volumeChange) fuelIndex = (volume * 20000000) / dt
		if (volume < 0) volumeChange = 0

		volume -= volumeChange

		if (fuelIndex < 0) fuelIndex = 0

		let balance =
			((fuelIndex -
				resistancea * speed -
				resistanceb / (speed / 50 + 1) -
				altLoad) /
				(ratedPower / 10000 +
					(Math.sqrt(ratedPower / 2) * ratedPower) / 1000000)) *
			dt

		speed += balance / 2

		if (speed < 0) speed = 0

		this.frequency = frequency

		this.current = current
		this.load = load
		this.speed = speed
		this.parent.link.models[0].volume = volume
		this.controlIndex = controlIndex
	}
}
