import game from 'Workspace'

export class BaseModel {
	constructor() {
		this.pointer = { link: this }

		this.type = 'model'
		this.subtype = null
		this.class = null

		this.parent = null
		this.connections = null
		this.location = null

		this.submodel = null

		this.inserted = false
		this.isNode = false
	}

	setUpConnections(map) {
		let connections = []
		map.forEach(config => {
			let connection = new game.class.Connection(config)
			connection.modelPointer = this.pointer
			connections.push(connection)
		})
		return connections
	}
}
