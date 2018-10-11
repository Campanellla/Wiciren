import React, { Component } from 'react'

import styled from 'styled-components'

import ItemMenu from './ItemMenu.js'

export default class WindowContainer extends Component {
	constructor(props) {
		super(props)

		this.state = {
			windows: [],
		}

		this.key = 0
		this.newIndex = 1
	}

	render() {
		return <div>{this.state.windows.map(_window => _window.container)}</div>
	}

	appendWindow(item, activeState) {
		let key = this.state.windows.findIndex(
			_window => _window.container.props.item === item,
		)
		if (key !== -1) return false
		let _window = {
			container: null,
			ref: React.createRef(),
		}
		_window.container = (
			<ItemMenu
				controller={this}
				item={item}
				position={{
					left: 100 + this.state.windows.length * 10,
					top: 50 + this.state.windows.length * 2,
				}}
				index={1}
				key={this.key++}
				ref={_window.ref}
				activeState={activeState}
			/>
		)

		this.state.windows.push(_window)
		this.setState({})

		return _window.ref
	}

	removeWindow(currentWindow) {
		let key = this.state.windows.findIndex(
			_window => _window.ref.current === currentWindow,
		)

		if (key === -1) {
			console.log('key not found')
			return
		}

		this.state.windows.splice(key, 1)
		this.setState({})
	}

	setTop(_window) {
		//let length = this.state.windows.length
		let windows = this.state.windows

		if (windows[windows.length - 1].ref.current !== _window) {
			let key = windows.findIndex(_w => _w.ref.current === _window)
			if (key === -1) {
				console.log('key not found')
				return
			}

			let w = windows.splice(key, 1)
			this.state.windows.push(w[0])
			this.setState({})
		}
	}
}