import React, { Component } from 'react'

import { game } from '../App.js'

import resources from 'src/Resources'

class SelectAction extends Component {
	constructor(props) {
		super(props)
		this.state = {
			object: this.props.object,
			active: false,
		}
		this.controller = this.props.controller

		this.onSelect = this.onSelect.bind(this)
	}

	onSelect() {
		game.appComponent.setFocusCanvas()

		if (this.controller.activeElement === this) {
			this.setState({ active: false })
			this.controller.activeElement = undefined
			game.actionSelected = undefined
			game.itemConstructor.setInactiveConstructor()
			return
		}

		game.itemConstructor.setInactiveConstructor()
		if (this.controller.activeElement)
			this.controller.activeElement.setState({ active: false })
		game.actionSelected = this.props.object
		this.controller.activeElement = this
		if (this.state.object !== 'remove')
			game.itemConstructor.setActiveConstructor(this.props.object)
		this.setState({ active: true })
	}

	render() {
		return (
			<button
				onClick={this.onSelect}
				style={
					this.state.active ? { background: 'beige' } : { background: 'white' }
				}
			>
				{this.props.object}
			</button>
		)
	}
}

export default class SelectionView extends Component {
	constructor() {
		super()
		this.elements = []
		for (let construction in resources.constructions) {
			this.elements.push(construction)
		}
		this.activeElement = null
	}

	render() {
		return (
			<div id="selectionview">
				{this.elements.map((prop, key) => (
					<SelectAction object={prop} key={key} controller={this} />
				))}
			</div>
		)
	}
}
