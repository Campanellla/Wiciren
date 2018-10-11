import { game } from './App.js'

import * as BABYLON from 'babylonjs'

/// map with constructions

export class GameMap {
	constructor(blockHeight, initBlocksHeight, scene) {
		this.blocks = []

		this.objectsList = []
		this.renderList = []

		this.blockHeight = blockHeight

		var initBlocksWidth = initBlocksHeight
		var blockIndex = 0

		for (var blockIndexW = 0; blockIndexW < initBlocksWidth; blockIndexW++) {
			for (var blockIndexH = 0; blockIndexH < initBlocksHeight; blockIndexH++) {
				this.blocks[blockIndex] = new Block(blockHeight, {
					x: blockHeight * blockIndexH,
					z: blockHeight * blockIndexW,
				})
				blockIndex++
			}
		}
	}

	getItemFromCoord(x, z) {
		var block = this.findBlock(x, z)
		let item = undefined
		if (block) {
			item = block.tiles[x - block.offset.x][z - block.offset.z].object
		}

		if (item) {
			if (item.link) {
				return item.link
			} else {
				block.tiles[x - block.offset.x][z - block.offset.z].object = undefined
				return null
			}
		} else {
			return null
		}
	}

	insertItem(item, x, z, width, height, rotationIndex) {
		var tiles = []

		if (!width) width = 1
		if (!height) height = 1

		if (rotationIndex % 2) {
			let w = height
			height = width
			width = w
		}

		for (var w = 0; w < width; w++) {
			for (var h = 0; h < height; h++) {
				let _x = x + w
				let _z = z + h

				var block = this.findBlock(_x, _z)

				if (block) {
					let tile = block.tiles[_x - block.offset.x][_z - block.offset.z]
					let found = tile.object

					if (found && found.link) {
						// log that we found objects here
						console.log('i found in ', 'x:', _x, 'z:', _z, found)
						tiles.push(tile)
					} else {
						tiles.push(tile)
					}
				}
			}
		}

		tiles.forEach(tile => {
			tile.object = item.pointer
		})
	}

	findBlock(x, z) {
		for (var i in this.blocks) {
			if (
				this.blocks[i].offset.x <= x &&
				this.blocks[i].offset.x + this.blockHeight > x
			) {
				if (
					this.blocks[i].offset.z <= z &&
					this.blocks[i].offset.z + this.blockHeight > z
				) {
					return this.blocks[i]
				}
			}
		}

		return null
	}

	clearObjects() {
		this.objectsList.forEach(object => {
			if (object.pointer.link) object.destruct()
		})

		this.objectsList.length = 0
	}

	updateMap() {
		var x = game.camera.position.x
		var z = game.camera.position.z

		var refreshCount = 0

		for (
			var blockIndex = 0;
			blockIndex < game.map.blocks.length;
			blockIndex++
		) {
			var offset = game.map.blocks[blockIndex].offset
			if (
				offset.x > x - 250 &&
				offset.x < x + 150 &&
				offset.z > z - 250 &&
				offset.z < z + 150
			) {
				if (!game.map.blocks[blockIndex].visible) {
					game.map.blocks[blockIndex].drawBlock()
					if (refreshCount === 0) {
						refreshCount = 0
						break
					}
					refreshCount++
				}
			} else {
				if (game.map.blocks[blockIndex].visible) {
					game.map.blocks[blockIndex].disposeMeshes()
				}
			}
		}
	}
}

class Block {
	constructor(blockHeight, offset) {
		this.visible = false
		this.drawn = false

		this.offset = offset
		this.tiles = []
		this.tiles.length = blockHeight
		this.blockHeight = blockHeight
		this.water = []

		for (var i = 0; i < blockHeight; i++) {
			this.tiles[i] = []
			this.tiles.length = blockHeight

			for (var ii = 0; ii < blockHeight; ii++) {
				this.tiles[i][ii] = new Tile()
			}
		}
	}

	disposeMeshes() {
		this.visible = false
		this.drawn = false
		this.mesh.dispose()

		for (var i = 0; i < this.water; i++) {
			this.water[i].dispose()
		}
	}

	drawBlock() {
		this.mesh = this.genmap(
			this.blockHeight,
			this.blockHeight,
			this.tiles,
			game.scene,
		)
		this.mesh.type = 'ground'
		this.mesh.material = game.materials.groundMaterial
		this.mesh.position.x = this.offset.x
		this.mesh.position.z = this.offset.z

		for (var hi = 0; hi < this.blockHeight; hi++) {
			for (var wi = 0; wi < this.blockHeight; wi++) {
				if (this.tiles[wi][hi].surface === 'water') {
					var tile = new BABYLON.Mesh.CreateGround('water', 1, 1, 2, game.scene)
					tile.position = new BABYLON.Vector3(
						this.offset.x + wi + 0.5,
						-0.05,
						this.offset.z + hi + 0.5,
					)
					tile.material = game.materials.waterMaterial
					tile.type = 'water'

					this.water.push(tile)
				}
			}
		}

		this.drawn = true
		this.visible = true
	}

	updateBlock() {
		if (!this.visible) return

		this.mesh.dispose()

		this.mesh = this.genmap(
			this.blockHeight,
			this.blockHeight,
			this.tiles,
			game.scene,
		)
		this.mesh.type = 'ground'
		this.mesh.material = game.materials.groundMaterial
		this.mesh.position.x = this.offset.x
		this.mesh.position.z = this.offset.z

		for (var i = 0; i < this.water; i++) {
			this.water[i].dispose()
		}

		this.water = []

		for (var hi = 0; hi < this.blockHeight; hi++) {
			for (var wi = 0; wi < this.blockHeight; wi++) {
				if (this.tiles[wi][hi].surface === 'water') {
					var tile = new BABYLON.Mesh.CreateGround('water', 1, 1, 2, game.scene)
					tile.position = new BABYLON.Vector3(
						this.offset.x + wi + 0.5,
						-0.05,
						this.offset.z + hi + 0.5,
					)
					tile.material = game.materials.waterMaterial
					tile.type = 'water'

					this.water.push(tile)
				}
			}
		}
		this.drawn = true
		this.visible = true
	}

	hideBlock() {
		this.visible = false
		this.mesh.visibility = false
		for (var i = 0; i < this.water; i++) {
			this.water[i].visibility = false
		}
	}

	showBlock() {
		if (this.drawn) {
			this.visible = true
			this.mesh.visibility = true
			for (var i = 0; i < this.water; i++) {
				this.water[i].visibility = true
			}
		} else {
			this.drawBlock()
		}
	}

	/*
	make custom mesh from {height array}.height

	args: height, width, height array, scene to draw into
	return: custom mesh
	*/

	genmap(h, w, map, scene) {
		var timeStamp = new Date()

		var customMesh = new BABYLON.Mesh('custom', scene)
		var positions = []
		//positions.length = h * w * 18 * 4;

		var indices = []

		//var temph = []
		//var tempf = []

		var p = 0
		var ind = 0

		for (var hh = 0; hh < h; hh++) {
			for (var ww = 0; ww < w; ww++) {
				var pos = p / 3

				var flat = false

				var hhhz = hh > 0
				var wwhz = ww > 0
				var hhm1 = hh < h - 1
				var wwm1 = ww < w - 1

				if (hhhz && wwhz && hhm1 && wwm1) {
					if (
						map[ww][hh].height === map[ww + 1][hh].height &&
						map[ww][hh].height === map[ww - 1][hh].height &&
						map[ww][hh].height === map[ww][hh + 1].height &&
						map[ww][hh].height === map[ww][hh - 1].height
					) {
						flat = true
					}
				}
				if (flat) {
					var y = map[ww][hh].height

					var tempf = [
						ww + 0,
						y,
						hh + 0,
						ww + 0,
						y,
						hh + 1,
						ww + 1,
						y,
						hh + 1,
						ww + 1,
						y,
						hh + 0,
					]

					var tempi = [pos + 0, pos + 3, pos + 1, pos + 3, pos + 2, pos + 1]
				} else {
					y = new Array(8)

					if (map[ww][hh].height) {
						y[4] = map[ww][hh].height
					}

					if (hhhz) {
						//bottom mid
						y[7] =
							map[ww][hh].height +
							(map[ww][hh - 1].height - map[ww][hh].height) / 2

						if (wwm1) {
							//bottom r
							y[8] =
								(map[ww][hh].height +
									(map[ww + 1][hh - 1].height - map[ww][hh].height) / 2 +
									map[ww][hh - 1].height +
									(map[ww + 1][hh].height - map[ww][hh - 1].height) / 2) /
								2
						}
					}

					if (wwhz) {
						//mid l
						y[3] =
							map[ww][hh].height +
							(map[ww - 1][hh].height - map[ww][hh].height) / 2

						if (hhhz) {
							//bottom l
							y[6] =
								(map[ww][hh].height +
									(map[ww - 1][hh - 1].height - map[ww][hh].height) / 2 +
									map[ww][hh - 1].height +
									(map[ww - 1][hh].height - map[ww][hh - 1].height) / 2) /
								2
						}

						if (hhm1) {
							//top l
							y[0] =
								(map[ww][hh].height +
									(map[ww - 1][hh + 1].height - map[ww][hh].height) / 2 +
									map[ww][hh + 1].height +
									(map[ww - 1][hh].height - map[ww][hh + 1].height) / 2) /
								2
						}
					}

					if (hhm1) {
						// top mid
						y[1] =
							map[ww][hh].height +
							(map[ww][hh + 1].height - map[ww][hh].height) / 2
					}

					if (wwm1) {
						//mid left
						y[5] =
							map[ww][hh].height +
							(map[ww + 1][hh].height - map[ww][hh].height) / 2

						if (hhm1) {
							//top r
							y[2] =
								(map[ww][hh].height +
									(map[ww + 1][hh + 1].height - map[ww][hh].height) / 2 +
									map[ww][hh + 1].height +
									(map[ww + 1][hh].height - map[ww][hh + 1].height) / 2) /
								2
						}
					}

					tempf = [
						ww + 0,
						0,
						hh + 1, //0
						ww + 0.5,
						0,
						hh + 1, //1
						ww + 1,
						0,
						hh + 1, //2

						ww + 0,
						0,
						hh + 0.5, //3
						ww + 0.5,
						0,
						hh + 0.5, //4
						ww + 1,
						0,
						hh + 0.5, //5

						ww + 0,
						0,
						hh + 0, //6
						ww + 0.5,
						0,
						hh + 0, //7
						ww + 1,
						0,
						hh + 0, //8
					]

					tempi = [
						pos + 4,
						pos + 3,
						pos + 6,

						pos + 4,
						pos + 6,
						pos + 7,

						pos + 4,
						pos + 7,
						pos + 8,

						pos + 4,
						pos + 8,
						pos + 5,

						pos + 4,
						pos + 5,
						pos + 2,

						pos + 4,
						pos + 2,
						pos + 1,

						pos + 4,
						pos + 1,
						pos + 0,

						pos + 4,
						pos + 0,
						pos + 3,
					]

					for (var i = 0; i < y.length; i++) {
						if (y[i] === undefined) y[i] = 0

						tempf[i * 3 + 1] = y[i]
					}
				}

				positions.length += tempf.length
				for (var n = 0; n < tempf.length; n++) {
					positions[p] = tempf[n]

					p++
				}

				indices.length += tempi.length
				for (let n = 0; n < tempi.length; n++) {
					indices[ind] = tempi[n]
					ind++
				}
			}
		}

		var uvs = []
		uvs.length = (positions.length / 3) * 2
		var uvsIndex = 0

		for (let n = 0; n < positions.length / 3; n++) {
			uvs[uvsIndex++] = positions[3 * n] / 100
			uvs[uvsIndex++] = positions[3 * n + 2] / 100
		}

		var vertexData = new BABYLON.VertexData()

		var normals = []
		BABYLON.VertexData.ComputeNormals(positions, indices, normals)

		vertexData.positions = positions
		vertexData.indices = indices
		vertexData.normals = normals
		vertexData.uvs = uvs

		var timeStamp2 = new Date()
		game.timestamp1 =
			(game.timestamp1 * 10 + Number(timeStamp2 - timeStamp)) / 11

		vertexData.applyToMesh(customMesh)
		game.timestamp2 =
			(game.timestamp2 * 10 + Number(new Date() - timeStamp2)) / 11

		return customMesh
	}
}

class Tile {
	constructor(args) {
		this.surface = 'grass'
		this.object = undefined
		this.height = 0

		//this.hmap = [0, 1, 2, 3];

		if (args !== undefined) {
			this.surface = args.surface
			this.object = args.object
		}
	}
}
