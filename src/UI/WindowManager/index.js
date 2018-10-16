import React, { Component } from 'react'

import GameWindow from './GameWindow.js'

export default class WindowManager extends Component {
	constructor(props) {
		super(props)

		this.windows = []
		this.state = {
			windows: this.windows,
		}
		this.key = 0
	}

	render() {
		return <div>{this.state.windows.map(_window => _window.container)}</div>
	}

	appendWindow(content, args) {
		let _window = {
			container: null,
			ref: React.createRef(),
			cref: React.createRef(),
		}

		_window.container = (
			<GameWindow
				controller={this}
				content={content}
				args={args}
				position={{
					left: 100 + this.state.windows.length * 10,
					top: 50 + this.state.windows.length * 2,
				}}
				index={1}
				key={this.key++}
				ref={_window.ref}
				contentRef={_window.cref}
			/>
		)
		this.windows.push(_window)
		this.setState({ windows: this.windows })
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

	update() {
		this.windows.forEach(w => {
			if (w.cref.current && w.cref.current.updateInterface)
				w.cref.current.updateInterface()
		})
	}

	drawMenu(content, args) {
		if (!content) {
			console.log('%cerror content not defined', 'color:red')
			return false
		}

		let key = this.state.windows.findIndex(
			_window => _window.container.props.content === content,
		)
		if (key !== -1) {
			this.setTop(this.state.windows[key].ref.current)
			return false
		}
		this.appendWindow(content, args)
		return true
	}

	drawItemMenu(construction) {
		if (!construction) {
			console.log('%cerror content not defined', 'color:red')
			return false
		}
		let content = construction.InterfaceContent

		let key = this.state.windows.findIndex(
			_window =>
				_window.container.props.args
					? _window.container.props.args.item === construction
					: false,
		)
		if (key !== -1) {
			this.setTop(this.state.windows[key].ref.current)
			return false
		}

		return this.appendWindow(content, { item: construction })
	}
}
