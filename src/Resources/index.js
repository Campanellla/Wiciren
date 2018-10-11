import objects from './Objects'
import models from './Models'
import modelStructures from './ModelStructures'
import items from './Items'

const constructions = {
	pump: {
		item: objects.Pump,
		subtype: '',
		name: 'pump',
		description: 'small pump',
	},
	tank: {
		item: objects.Tank,
		subtype: '',
		name: 'tank',
		description: 'small tank',
	},
	engine: {
		item: objects.Engine,
		subtype: '',
		name: 'engine',
		description: 'small pump',
	},
	device: {
		item: objects.Device,
		subtype: '',
		name: 'device',
		description: 'small pump',
	},

	pipe: {
		item: objects.Pipe,
		subtype: 'pipe',
		name: 'pipe',
		description: 'pipe',
	},
	pipe3: {
		item: objects.Pipe,
		subtype: '3-way',
		name: '3-way pipe',
		description: '3-way pipe',
	},
	pipe4: {
		item: objects.Pipe,
		subtype: '4-way',
		name: '4-way pipe',
		description: '4-way pipe',
	},
	pipeA: {
		item: objects.Pipe,
		subtype: 'angle',
		name: 'angle pipe',
		description: 'angle pipe',
	},

	pole: {
		item: objects.Epole,
		subtype: '',
		name: 'pole',
		description: 'electrical pole',
	},
	box: {
		item: objects.Box,
		subtype: '',
		name: 'box',
		description: 'small storage box',
	},
}

const resources = {
	objects,
	models,
	modelStructures,
	items,
	constructions,
}

export default resources
