//import { game } from '../App.js'

import { BaseModel } from './BaseModel.js'

export default class StorageModel extends BaseModel {
	constructor(args) {
		super()
		this.subtype = 'storagemodel'

		this.parent = args.parentPointer
		this.storageSize = args.storageSize || 1
		this.items = []
	}

	update(dt) {}
}
