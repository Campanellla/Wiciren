import { game } from './App.js'

import * as BABYLON from 'babylonjs'

import { _pipe } from './objects/pipe/pipe.js'
import { _pump } from './objects/pump/pump.js'
import { _tank } from './objects/tank/tank.js'
import { _engine } from './objects/engine/engine.js'
import { _device } from './objects/device/device.js'

import { _epole } from './objects/epole/epole.js'
import { _box } from './objects/box/box.js'

export class ItemConstructor {
	constructor() {
		this.rotationIndex = 0
		this.activeConstructor = false
		//this.activeItem;
		//this.constructorMesh;
		this.helperMeshes = []
		this.keynum = 0
		//this.isFreeSpace = false;
		this.activeMesh = null
		this.config = null
		this.constructorItemList = {
			pump: { item: _pump, subtype: '' },
			tank: { item: _tank, subtype: '' },
			engine: { item: _engine, subtype: '' },
			device: { item: _device, subtype: '' },

			pipe: { item: _pipe, subtype: 'pipe' },
			pipe3: { item: _pipe, subtype: '3-way' },
			pipe4: { item: _pipe, subtype: '4-way' },
			pipeA: { item: _pipe, subtype: 'angle' },

			pole: { item: _epole, subtype: '' },
			box: { item: _box, subtype: '' },
		}
	}

	setActiveConstructor(item) {
		if (this.activeConstructor || item) {
			this.activeConstructor = item || this.activeConstructor
			/*let object = {
				subtype: this.constructorItemList[this.activeConstructor].subtype,
			}*/
			let _item = this.constructorItemList[this.activeConstructor]

			if (_item && _item.item.prototype.getConfig) {
				let subtype = _item.subtype
				let _prototype = _item.item.prototype
				this.config = _prototype.getConfig(subtype)
				this.activeMesh = _prototype.drawMesh(false, subtype)
				this.activeMesh.isObject = true

				game.selection.setActiveMesh(this.activeMesh, this.config)
				game.selection.setRotation(this.rotationIndex)

				this.config.connections.forEach(connection => {
					if (!connection) return

					if (connection.ranged) {
						connection.conlocation.forEach(location => {
							let sourcePlane = new BABYLON.Plane(0, -1, 0, 0)
							sourcePlane.normalize()
							let mesh = BABYLON.MeshBuilder.CreatePlane(
								'plane',
								{
									height: location.range * 2 + 1,
									width: location.range * 2 + 1,
									sourcePlane: sourcePlane,
								},
								game.scene,
							)

							this.helperMeshes.push(mesh)
							mesh.material = game.materials.ycolor
							mesh.isPickable = false

							mesh.parent = this.activeMesh

							mesh.position.x = 0.5
							mesh.position.y = 0.25
							mesh.position.z = 0.5

							mesh.visibility = location.opacity || 1
						})
					} else
						connection.conlocation.forEach(location => {
							let mesh = new game.BABYLON.Mesh(
								'index: 100',
								game.scene,
								null,
								game.meshes.arrow,
							)
							this.helperMeshes.push(mesh)
							mesh.material = game.materials.ycolor
							mesh.isPickable = false

							mesh.parent = this.activeMesh

							mesh.rotation.y = location.r * game.TAU || 0
							mesh.position.x = location.x + 0.5
							mesh.position.y = 0.25
							mesh.position.z = location.z + 0.5
						})
				})
			}
		}
	}

	setInactiveConstructor() {
		if (!this.activeConstructor) return
		if (
			game.interfaceComponent.current &&
			game.interfaceComponent.current.selectionViewComponent &&
			game.interfaceComponent.current.selectionViewComponent.current &&
			game.interfaceComponent.current.selectionViewComponent.current
				.activeElement
		)
			game.interfaceComponent.current.selectionViewComponent.current.activeElement.setState(
				{ active: false },
			)
		this.activeConstructor = false
		if (this.activeMesh) {
			game.selection.setActiveMesh()
			this.activeMesh.dispose()
			this.helperMeshes.forEach(mesh => mesh.dispose())
			this.helperMeshes.length = 0
		}
	}

	constructActiveObject() {
		if (this.activeConstructor) {
			let blockx = game.selection.position.x
			let blocky = game.selection.position.z

			if (this.checkConstructor(blockx, blocky) && this.activeConstructor) {
				let args = {
					location: { x: blockx, z: blocky },
					rotationIndex: this.rotationIndex || 0,
					subtype: this.constructorItemList[this.activeConstructor].subtype,
					key: this.keynum++,
				}
				let item = new this.constructorItemList[this.activeConstructor].item(
					args,
				)
				game.map.insertItem(
					item,
					item.location.x,
					item.location.z,
					item.itemSize.w,
					item.itemSize.h,
					item.rotationIndex,
				)
				game.map.objectsList.push(item)
				item.rotate()

				//this.setInactiveConstructor()
				//console.log(item)

				game.updatePipelines = true
			}
		}
	}

	loadObject(object) {
		if (object && this.constructorItemList[object.type]) {
			object.key = this.keynum++
			var item = new this.constructorItemList[object.type].item(object)
			if (item) {
				game.map.insertItem(
					item,
					object.location.x,
					object.location.z,
					item.itemSize.w,
					item.itemSize.h,
					item.rotationIndex,
				)
				game.map.objectsList.push(item)
			}
			game.updatePipelines = true
		}
	}

	deleteObject(location) {
		var item = game.map.getItemFromCoord(location[0], location[1])
		if (item) {
			item.destruct()
			game.updatePipelines = true
			let index = game.map.objectsList.findIndex(a => {
				return a === item
			})
			if (index >= 0) game.map.objectsList.splice(index, 1)
		}
	}

	// return true if space is free
	checkConstructor(tilex, tiley) {
		if (!this.activeMesh) return false

		if (this.helperMeshes.length) {
			this.helperMeshes.forEach(mesh => {
				mesh.isVisible = this.activeMesh.isVisible
			})
		}

		if (this.rotationIndex % 2) {
			var sizeOffset = { x: this.config.size.h, z: this.config.size.w }
		} else {
			sizeOffset = { x: this.config.size.w, z: this.config.size.h }
		}

		for (let x = 0; x < sizeOffset.x; x++) {
			for (let z = 0; z < sizeOffset.z; z++) {
				if (game.map.getItemFromCoord(tilex + x, tiley + z)) {
					this.activeMesh.renderOverlay = true
					return false
				}
			}
		}

		this.activeMesh.renderOverlay = false
		return true
	}
}
