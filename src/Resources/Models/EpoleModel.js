import game from 'src/Workspace'

import { BaseModel } from './BaseModel.js'

export default class EpoleModel extends BaseModel {
	constructor(args) {
		super()
		this.subtype = 'epolemodel'
		this.class = 'electric'

		this.parent = args.parentPointer
		this.location = args.location

		this.connections = []

		this.connectionType = 'range'

		this.connectionRange1 = 2
		this.connectionRange2 = 5
	}

	updateLinks() {
		this.connections.length = 0

		let location = this.parent.link.location

		let startx = location.x - this.connectionRange2
		let startz = location.z - this.connectionRange2

		let rangeminx = location.x - this.connectionRange1
		let rangeminz = location.z - this.connectionRange1

		let rangemaxx = location.x + this.connectionRange1
		let rangemaxz = location.z + this.connectionRange1

		let stack1 = []
		let stack2 = []

		for (var x = startx; x < location.x + this.connectionRange2 + 1; x++) {
			for (var z = startz; z < location.z + this.connectionRange2 + 1; z++) {
				if (x === location.x && z === location.z) continue

				let item = game.map.getItemFromCoord(x, z)

				if (item) {
					let index = stack1.findIndex(_item => _item === item)
					if (index === -1) {
						let epolemodel = item.models.find(model => {
							return model.subtype === 'epolemodel'
						})

						if (epolemodel) {
							stack1.push(item)
							this.connections.push(
								new game.class.Connection({
									itemPointer: this.parent,
									modelPointer: this.pointer,
									connectedItemPointer: item.pointer,
									connectedModelPointer: epolemodel.pointer,
								}),
							)
							continue
						}
					}

					index = stack2.findIndex(_item => _item === item)
					if (
						index === -1 &&
						rangeminx <= x &&
						rangemaxx >= x &&
						rangeminz <= z &&
						rangemaxz >= z
					) {
						let electricmodel = item.models.find(model => {
							return model.class === 'electric'
						})

						if (electricmodel) {
							stack2.push(item)
							this.connections.push(
								new game.class.Connection({
									itemPointer: this.parent,
									modelPointer: this.pointer,
									connectedItemPointer: item.pointer,
									connectedModelPointer: electricmodel.pointer,
								}),
							)
						}
					}
				}
			}
		}
	}
}
