import { game } from './App.js'

import { nullpointer } from 'utils.js'

export default class Connection {
	constructor(args) {
		this.itemPointer = args.itemPointer || nullpointer
		this.modelPointer = args.modelPointer || nullpointer

		this.connectedItemPointer = args.connectedItemPointer || nullpointer
		this.connectedModelPointer = args.connectedModelPointer || nullpointer

		this.location = args.location || { x: 0, z: 0 }
		this.size = args.size || { h: 1, w: 1 }
		this.connLocation = args.connLocation || args.conlocation || {}

		this.rlocation = this.location
		this.rconnLocation = this.connLocation
		this.r = -1
		this.rotationIndex = 0
	}

	checkRotation() {
		if (this.itemPointer.link === null) {
			console.log('item pointer not exist')
			return false
		}

		let itemRotation = this.itemPointer.link.rotationIndex
		let itemSize = this.itemPointer.link.itemSize

		if (itemRotation === this.r) {
			console.log('rotation same')
			return true
		}

		if (itemRotation === 0) {
			this.r = itemRotation
			this.rlocation = this.location
			this.rconnLocation = this.connLocation
		} else {
			var offsetx = 0
			var offsetz = 0

			var offsetcx = 0
			var offsetcz = 0

			switch (itemRotation) {
				case 1:
					offsetz = itemSize.w - 1

					offsetcz =
						this.connLocation.x &&
						(this.connLocation.x - itemSize.w / 2) * -1 + itemSize.w / 2 - 1
					offsetcx = this.connLocation.z // && (this.connLocation.z - itemSize.h/2) + itemSize.w/2;
					this.rlocation = {
						x: this.location.z + offsetz,
						z: this.location.x + offsetx,
					}
					break

				case 2:
					offsetz = itemSize.h - 1
					offsetx = itemSize.w - 1

					offsetcz =
						this.connLocation.z &&
						(this.connLocation.z - itemSize.h / 2) * -1 + itemSize.h / 2 - 1
					offsetcx =
						this.connLocation.x &&
						(this.connLocation.x - itemSize.w / 2) * -1 + itemSize.w / 2 - 1
					this.rlocation = {
						x: this.location.x + offsetx,
						z: this.location.z + offsetz,
					}
					break

				case 3:
					offsetx = itemSize.h - 1

					offsetcz = this.connLocation.x // && (this.connLocation.x - itemSize.w/2) + itemSize.h/2;
					offsetcx =
						this.connLocation.z &&
						(this.connLocation.z - itemSize.h / 2) * -1 + itemSize.h / 2 - 1
					this.rlocation = {
						x: this.location.z + offsetz,
						z: this.location.x + offsetx,
					}
					break

				default:
				//do nothing //
			}

			this.rconnLocation = { x: offsetcx, z: offsetcz }
			this.r = itemRotation
		}

		return true
	}

	updateLinks() {
		let info = false
		if (this.itemPointer.link.key === 2) info = false ////////

		let OK = this.checkRotation()

		if (OK && info && false) {
			console.log(
				'item: ',
				this.itemPointer.link,
				'\n',
				'rInd: ',
				this.itemPointer.link.rotationIndex,
				'\n',
				'r: ',
				this.r,
				'\n',
				'loc: ',
				this.location,
				this.rlocation,
				'\n',
				'cloc:',
				this.connLocation,
				this.rconnLocation,
			)
		}

		if (!OK) return

		let xx = this.rconnLocation.x + this.itemPointer.link.location.x
		let zz = this.rconnLocation.z + this.itemPointer.link.location.z

		let item = game.map.getItemFromCoord(xx, zz)

		if (item !== null) {
			this.connectedItemPointer = item.pointer

			item.models.forEach((model, key) => {
				if (!model.location || !model.parent || !model.parent.link) {
					console.log(model)
					return
				}

				if (
					(model.parent.link.location.x + model.location.x === xx &&
						model.parent.link.location.z + model.location.z === zz) ||
					true
				) {
					if (!this.modelPointer.link) {
						console.log(this)
						return
					}

					if (this.modelPointer.link.class === model.class) {
						//if (info) console.log(true)

						this.connectedModelPointer = model.pointer
					}
				}
			})

			//console.log(this.connectedModelPointer);
		} else {
			this.connectedItemPointer = nullpointer
			this.connectedModelPointer = nullpointer
		}
	}

	checkLinks() {
		if (!this.connectedModelPointer) console.log(this)

		let connModel = this.connectedModelPointer.link
		let model = this.modelPointer.link

		if (!connModel || !model) return

		let found = connModel.connections.find(connection => {
			if (connection.connectedModelPointer.link === model) return true

			return false
		})

		if (!found) {
			this.connectedModelPointer = nullpointer
			this.connectedItemPointer = nullpointer
		}
	}
}
