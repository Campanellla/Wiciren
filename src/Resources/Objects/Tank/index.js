import game from 'Workspace'

import { Construction } from '../Base.js'

import TankModel from '../../Models/TankModel.js'

import { Tank_interface } from './Tank_interface.js'

export default class Tank extends Construction {
	constructor(args) {
		super()
		if (!args) args = {}
		args.models = args.models || []

		this.type = 'tank'
		this.itemSize = { h: 1, w: 1 }

		if (args.key !== undefined) this.key = args.key
		else this.key = -1
		this.location = args.location || {}
		this.rotationIndex = args.rotationIndex || 0

		let connectionsArgs = [
			{
				location: { x: 0, z: 0 },
				conlocation: { x: 1, z: 0 },
				size: this.itemSize,
				itemPointer: this.pointer,
			},
		]
		args = {
			connectionsMap: connectionsArgs,
			location: { x: 0, z: 0 },
			size: this.itemSize,
			parentPointer: this.pointer,
			config: args.models[0],
		}
		this.models.push(new TankModel(args, this))

		this.menu_interface = Tank_interface
		this.updateInterface = null

		this.draw()
	}

	update() {}

	save() {
		return {
			type: this.type,
			location: this.location,
			rotationIndex: this.rotationIndex,
			models: [
				{
					volume: this.models[0].volume,
					pressure: this.models[0].pressure,
				},
			],
		}
	}

	drawMesh(instance, subtype) {
		return this.getMesh(game.meshes.tank, this.keynum, instance)
	}

	getConfig(subtype) {
		return {
			size: { h: 1, w: 1 },
			connections: [
				{
					type: 'tankmodel',
					location: { x: 0, z: 0 },
					conlocation: [{ x: 1, z: 0, r: 2 }],
				},
			],
		}
	}
}
