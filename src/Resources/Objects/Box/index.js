import game from 'src/Workspace'

import Construction from '../Construction'
import StorageModel from '../../Models/StorageModel'
import InterfaceContent from './InterfaceContent'

export default class Box extends Construction {
	constructor(args) {
		super()
		this.InterfaceContent = InterfaceContent
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
