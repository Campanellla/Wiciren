import game from 'Workspace'

import { Construction } from './../Base.js'
import PipeModel from './../../Models/pipe/PipeModel.js'

import { Pipe_interface } from './Pipe_interface.js'

export default class Pipe extends Construction {
	constructor(args) {
		super()
		args = args || {}
		args.models = args.models || []

		this.type = 'pipe'
		this.itemSize = { h: 1, w: 1 }

		if (args.key !== undefined) this.key = args.key
		else this.key = -1
		this.subtype = args.subtype || 'pipe'
		this.location = args.location || {}
		this.rotationIndex = args.rotationIndex || 0

		let left = {
			location: { x: 0, z: 0 },
			size: this.itemSize,
			conlocation: { x: -1, z: 0 },
			itemPointer: this.pointer,
		}
		let top = {
			location: { x: 0, z: 0 },
			size: this.itemSize,
			conlocation: { x: 0, z: 1 },
			itemPointer: this.pointer,
		}
		let right = {
			location: { x: 0, z: 0 },
			size: this.itemSize,
			conlocation: { x: 1, z: 0 },
			itemPointer: this.pointer,
		}
		let bottom = {
			location: { x: 0, z: 0 },
			size: this.itemSize,
			conlocation: { x: 0, z: -1 },
			itemPointer: this.pointer,
		}
		let connectionsArgs
		switch (this.subtype) {
			case '3-way':
				connectionsArgs = [left, right, bottom]
				break
			case '4-way':
				connectionsArgs = [left, top, right, bottom]
				break
			case 'angle':
				connectionsArgs = [left, bottom]
				break
			default:
				connectionsArgs = [left, right]
				break
		}
		let modelargs = {
			connectionsMap: connectionsArgs,
			location: { x: 0, z: 0 },
			size: { h: 1, w: 1 },
			parentPointer: this.pointer,
			config: args.models[0],
		}
		this.models.push(new PipeModel(modelargs))

		this.menu_interface = Pipe_interface
		this.updateInterface = null

		this.draw()
	}

	update(dt) {}

	save() {
		return {
			type: this.type,
			subtype: this.subtype,
			location: this.location,
			rotationIndex: this.rotationIndex,
			models: [this.models[0].save()],
		}
	}

	drawMesh(instance, subtype) {
		let a
		switch (subtype || this.subtype) {
			case '3-way':
				a = game.meshes.pipe3
				break
			case '4-way':
				a = game.meshes.pipe4
				break
			case 'angle':
				a = game.meshes.pipeA
				break
			default:
				a = game.meshes.pipe
				break
		}
		return this.getMesh(a, this.keynum, instance)
	}

	getConfig(subtype) {
		switch (subtype) {
			case '3-way':
				return {
					size: { h: 1, w: 1 },
					connections: [
						{
							type: 'pipemodel',
							location: { x: 0, z: 0 },
							conlocation: [
								{ x: -1, z: 0, r: 0 },
								{ x: 1, z: 0, r: 2 },
								{ x: 0, z: -1, r: 3 },
							],
						},
					],
				}

			case '4-way':
				return {
					size: { h: 1, w: 1 },
					connections: [
						{
							type: 'pipemodel',
							location: { x: 0, z: 0 },
							conlocation: [
								{ x: -1, z: 0, r: 0 },
								{ x: 1, z: 0, r: 2 },
								{ x: 0, z: 1, r: 1 },
								{ x: 0, z: -1, r: 3 },
							],
						},
					],
				}

			case 'angle':
				return {
					size: { h: 1, w: 1 },
					connections: [
						{
							type: 'pipemodel',
							location: { x: 0, z: 0 },
							conlocation: [{ x: -1, z: 0, r: 0 }, { x: 0, z: -1, r: 3 }],
						},
					],
				}

			default:
				return {
					size: { h: 1, w: 1 },
					connections: [
						{
							type: 'pipemodel',
							location: { x: 0, z: 0 },
							conlocation: [{ x: -1, z: 0, r: 0 }, { x: 1, z: 0, r: 2 }],
						},
					],
				}
		}
	}
}
