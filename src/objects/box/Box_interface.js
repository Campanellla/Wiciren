import React, { Component } from 'react'

import { game } from '../../App.js'

export class Box_interface extends Component {
	constructor(props) {
		super(props)
		this.sliderRef = React.createRef()

		let item = this.props.item
		if (!item) item = {}
		if (!item.models || !item.models[0]) {
			item.models = [{}]
		}

		this.state = {
			key: item.key || -1,
			type: item.type || '',
			storageSize: item.models[0].storageSize || 0,
		}

		this.updateInterface = this.updateInterface.bind(this)
	}

	updateInterface() {
		let item = this.props.item
		if (item) {
			this.setState({
				key: item.key || 0,
				type: item.type || '',
				storageSize: item.models[0].storageSize || 0,
			})
		}
	}

	componentWillReceiveProps(props) {
		if (this.props.item === props.item) return
		if (this.props.item) this.props.item.updateInterface = null
		if (props.item) props.item.updateInterface = this.updateInterface
	}

	componentDidMount() {
		if (this.props.item) {
			this.props.item.updateInterface = this.updateInterface
			game.componentsNeedUpdate.push({
				component: this,
				update: this.updateInterface,
			})
		}
	}

	componentWillUnmount() {
		let key = game.componentsNeedUpdate.findIndex(c => c.component === this)
		if (key !== -1) {
			game.componentsNeedUpdate.splice(key, 1)
		} else {
			console.log(this, 'not found myself in game.componentsNeedUpdate')
		}
		if (this.props.item) this.props.item.updateInterface = null
	}

	render() {
		return (
			<div>
				<div id="ItemMenuText">
					{[
						'key: ' + this.state.key,
						'type: ' + this.state.type,
						'',
						'size: ' + this.state.storageSize,
						'',
					].map((item, key) => {
						return (
							<span key={key}>
								{item}
								<br />
							</span>
						)
					})}
				</div>
			</div>
		)
	}
}
