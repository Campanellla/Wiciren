import React, { Component } from 'react'

export default class Tank_interface extends Component {
	constructor(props) {
		super(props)

		this.state = {
			key: -1,
			type: '',
			volume: 0,
			pressure: 0,
		}

		this.updateInterface = this.updateInterface.bind(this)
		this.onClickAdd = this.onClickAdd.bind(this)
	}

	updateInterface() {
		if (this.props.item) {
			let item = this.props.item

			this.setState({
				key: item.key,
				type: item.type || '',
				volume: item.models[0].volume || 0,
				pressure: item.models[0].pressure || 0,
			})
		}
	}

	onClickAdd() {
		this.props.item.models[0].volume += 100
	}

	render() {
		return (
			<div>
				<div id="ItemMenuText">
					{[
						'key: ' + this.state.key,
						'type: ' + this.state.type,
						'volume: ' + this.state.volume.toFixed(1),
						'pressure: ' + this.state.pressure.toFixed(1),
					].map((item, key) => {
						return (
							<span key={key}>
								{item}
								<br />
							</span>
						)
					})}
				</div>

				<button onClick={this.onClickAdd}>add 100</button>
			</div>
		)
	}
}
