import React, { Component } from 'react'

import game from 'Workspace'

export class Device_interface extends Component {
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
			conductivity: item.models[0].conductivity || 0,
		}

		this.updateInterface = this.updateInterface.bind(this)
	}

	updateInterface() {
		let item = this.props.item
		if (item) {
			this.setState({
				key: item.key || 0,
				type: item.type || '',
				conductivity: item.models[0].conductivity || 0,
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

	sliderChange() {
		let num = Number(this.sliderRef.current.value)
		let item = this.props.item

		if (item && item.models[0].conductivity !== undefined && !isNaN(num)) {
			item.models[0].conductivity = num
		}
	}

	render() {
		return (
			<div>
				<div id="ItemMenuText">
					{[
						'key: ' + this.state.key,
						'type: ' + this.state.type,
						'',
						'conductivity: ' + this.state.conductivity + ' S',
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

				<div className="slidecontainer">
					<input
						type="range"
						min="0"
						max="36"
						defaultValue={this.state.conductivity}
						className="slider"
						id="myRange"
						onChange={this.sliderChange.bind(this)}
						ref={this.sliderRef}
						step="0.001"
					/>
				</div>
			</div>
		)
	}
}