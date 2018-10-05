import { game } from '../../App.js'

import { Construction } from './../Base.js'
import { StorageModel } from './../../models/StorageModel.js'

import { Box_interface } from './Box_interface.js'

export class _box extends Construction {
	constructor(args) {
		super()
		args = args || {}
		args.models = args.models || []

		this.type = 'box'
		this.itemSize = { h: 1, w: 1 }

		if (args.key !== undefined) this.key = args.key
		else this.key = -1

		this.location = args.location || {}
		this.rotationIndex = args.rotationIndex || 0

		let modelargs = {
			parentPointer: this.pointer,
			storageSize: 11,
		}
		this.models.push(new StorageModel(modelargs))

		this.menu_interface = Box_interface
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
				},
			],
		}
	}

	drawMesh(instance, subtype) {
		return this.getMesh(game.meshes.box, this.keynum, instance)
	}

	getConfig(subtype) {
		return {
			size: { h: 1, w: 1 },
			connections: [],
		}
	}
}
