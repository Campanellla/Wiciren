import game from 'Workspace'
import * as BABYLON from 'babylonjs'
import { TAU } from 'utils.js'

export class Construction {
	constructor() {
		this.pointer = { link: this }

		this.type = null
		this.subtype = null

		this.exist = true
		this.inserted = false
		this.visible = false
		this.constructionSize = null

		this.mesh = null
		this.models = []
	}

	/// maybe will not be used
	renewModel(model1, model2) {
		let index = this.models.findIndex(model => {
			return model1 === model
		})

		if (index >= 0) {
			this.models[index] = model2
			return true
		} else {
			return false
		}
	}

	/// arg bool -> true if need to draw instance only
	draw(instance) {
		this.mesh = this.drawMesh(instance)

		if (!this.mesh) return

		this.mesh.item = this.pointer
		this.mesh.type = this.type
		this.mesh.isObject = true

		this.mesh.position.y = 0

		this.visible = true

		this.rotate(this.rotationIndex)
	}

	getConnectionsCoordinates() {
		let coordinates = []

		this.models.forEach(model => {
			model.connections.forEach(connection => {
				connection.checkRotation()

				coordinates.push({
					x: connection.rconnLocation.x,
					z: connection.rconnLocation.z,
					rotationIndex: connection.rotationIndex,
					connection: connection,
				})
			})
		})

		return coordinates
	}

	updateLinks() {
		this.models.forEach(model => {
			model.connections.forEach(connection => {
				connection.updateLinks()
			})
		})
	}

	rotate(rotationIndex) {
		var offsetx = 0
		var offsetz = 0

		rotationIndex = rotationIndex || this.rotationIndex

		switch (rotationIndex) {
			case 1:
				offsetz = this.itemSize.w
				break
			case 2:
				offsetz = this.itemSize.h
				offsetx = this.itemSize.w
				break
			case 3:
				offsetx = this.itemSize.h
				break
			default:
			/* do nothing */
		}

		this.mesh.position.x = this.location.x + offsetx
		this.mesh.position.z = this.location.z + offsetz
		this.mesh.rotation.y = rotationIndex * TAU
	}

	getMesh(origin, key, instance) {
		if (!origin) return null
		if (instance) return origin.createInstance('index: ' + key)
		return new BABYLON.Mesh('index: ' + key, game.scene, null, origin)
	}

	destruct() {
		this.visible = false
		this.exist = false
		this.pointer.link = null
		if (this.mesh) this.mesh.dispose()
	}

	setState(state) {
		switch (state) {
			case 'constructor':
				if (!this.visible) this.draw()

				this.mesh.visibility = 0.5
				this.mesh.isPickable = false
				break

			case 'active':
				if (!this.visible) this.draw()

				this.mesh.visibility = 1
				this.mesh.isPickable = true
				break

			case 'inactive':
				if (this.visible) {
					this.mesh.dispose()
					this.visible = true
				}
				break

			default:
				break
		}
	}
}
