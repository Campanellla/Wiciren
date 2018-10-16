import game from 'src/Workspace'

import Construction from '../Construction'
import EpoleModel from '../../Models/EpoleModel.js'

export default class Epole extends Construction {
	constructor(args) {
		super()
		args = args || {}
		args.models = args.models || []

		this.type = 'pole'
		this.itemSize = { h: 1, w: 1 }

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
			{
				location: { x: 0, z: 0 },
				conlocation: { x: 0, z: 1 },
				size: this.itemSize,
				itemPointer: this.pointer,
			},
			{
				location: { x: 0, z: 0 },
				conlocation: { x: 1, z: 0 },
				size: this.itemSize,
				itemPointer: this.pointer,
			},
			{
				location: { x: 0, z: 0 },
				conlocation: { x: 0, z: -1 },
				size: this.itemSize,
				itemPointer: this.pointer,
			},
		]
		let modelargs = {
			connectionsMap: connectionsArgs,
			location: { x: 0, z: 0 },
			size: this.itemSize,
			parentPointer: this.pointer,
		}
		this.models.push(new EpoleModel(modelargs))

		this.draw()
	}

	update(dt) {}

	save() {
		return {
			type: this.type,
			location: this.location,
			rotationIndex: this.rotationIndex,
		}
	}

	drawMesh(instance, subtype) {
		return this.getMesh(game.meshes.epole, this.keynum, instance)
	}

	getConfig() {
		return {
			size: { h: 1, w: 1 },
			connections: [
				{
					type: 'epolemodel',
					ranged: true,
					location: { x: 0, z: 0 },
					conlocation: [
						{ range: 5, opacity: 0.25 },
						{ range: 2, opacity: 0.5 },
					],
				},
			],
		}
	}
}
