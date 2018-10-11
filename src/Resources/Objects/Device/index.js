import game from 'Workspace'

import { Construction } from '../Base.js'
import DeviceModel from '../../Models/DeviceModel.js'

import { Device_interface } from './Device_interface.js'

export default class Device extends Construction {
	constructor(args) {
		super()
		args = args || {}
		args.models = args.models || []

		this.type = 'device'
		this.itemSize = { h: 2, w: 2 }

		if (args.key !== undefined) this.key = args.key
		else this.key = -1

		this.location = args.location || {}
		this.rotationIndex = args.rotationIndex || 0

		let connectionsArgs = [
			{
				location: { x: 0, z: 0 },
				conlocation: { x: -1, z: 0 },
				size: this.itemSize,
				itemPointer: this.pointer,
			},
		]
		let modelargs = {
			connectionsMap: connectionsArgs,
			location: { x: 0, z: 0 },
			size: this.itemSize,
			parentPointer: this.pointer,
			config: args.models[0],
		}
		this.models.push(new DeviceModel(modelargs))

		this.menu_interface = Device_interface
		this.updateInterface = null

		this.draw()
	}

	update(dt) {}

	save() {
		return {
			type: this.type,
			location: this.location,
			rotationIndex: this.rotationIndex,
			models: [
				{
					subtype: this.models[0].subtype,
					conductivity: this.models[0].conductivity,
				},
			],
		}
	}

	drawMesh(instance, subtype) {
		return this.getMesh(game.meshes.device, this.keynum, instance)
	}

	getConfig(subtype) {
		return {
			size: { h: 2, w: 2 },
			connections: [
				{
					type: 'devicemodel',
					location: { x: 0, z: 0 },
					conlocation: [{ x: -1, z: 0, r: 0 }],
				},
			],
		}
	}
}
