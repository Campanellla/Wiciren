//import {game} from '../App.js';

import { BaseModel } from './BaseModel.js'

export class DeviceModel extends BaseModel {
	constructor(args) {
		super()
		this.subtype = 'devicemodel'
		this.class = 'electric'

		this.parent = args.parentPointer
		this.location = args.location

		this.connections = this.setUpConnections(args.connectionsMap)

		let config = args.config || {}

		this.conductivity = config.conductivity || 0
	}

	update(dt) {}
}
