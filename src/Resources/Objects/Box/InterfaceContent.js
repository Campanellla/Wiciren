import React, { Component } from 'react'

export default class Box_interface extends Component {
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
