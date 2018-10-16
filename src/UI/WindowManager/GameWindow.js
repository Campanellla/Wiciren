import React, { Component } from 'react'
import styled from 'styled-components'

import { blockSelection } from 'src/Utils'
import workspace from 'src/Workspace'

export default class GameWindow extends Component {
	constructor(props) {
		super(props)

		this.controller = this.props.controller

		this.onMouseDown = this.onMouseDown.bind(this)
		this.onClose = this.onClose.bind(this)
		this.setTop = this.controller.setTop.bind(this.controller, this)

		this.closeDragElement = this.closeDragElement.bind(this)
		this.elementDrag = this.elementDrag.bind(this)

		this.offsetx = 0
		this.offsety = 0
		this.posx = this.props.position.left
		this.posy = this.props.position.top

		this.state = {
			hidden: false,
			content: this.props.content,
			position: this.props.position,
			index: this.props.index,
		}
	}

	elementDrag(e) {
		e = e || window.event

		this.posx = e.clientX - this.offsetx
		this.posy = e.clientY - this.offsety

		if (this.posx < 0) this.posx = 0
		if (this.posy < 0) this.posy = 0
		if (this.posx > window.innerWidth - 50) this.posx = window.innerWidth - 50
		if (this.posy > window.innerHeight - 25) this.posy = window.innerHeight - 25

		this.setState({ position: { left: this.posx, top: this.posy } })
	}

	closeDragElement() {
		document.onmouseup = null
		document.onmousemove = null
		blockSelection(false)
	}

	onMouseDown(e) {
		e = e || window.event
		this.offsetx = e.clientX - this.posx
		this.offsety = e.clientY - this.posy
		document.onmouseup = this.closeDragElement
		document.onmousemove = this.elementDrag
		blockSelection(true)
	}

	onClose() {
		this.controller.removeWindow(this)
		workspace.appComponent.setFocusCanvas()
	}

	render() {
		return (
			<StyledGameWindow
				style={{
					left: this.state.position.left,
					top: this.state.position.top,
					zIndex: this.state.index,
				}}
				onMouseDown={this.setTop}
			>
				<div className="window-header" onMouseDown={this.onMouseDown}>
					<h4>Item menu</h4>
					<button onClick={this.onClose}>X</button>
				</div>

				<div className="content">
					{this.state.content ? (
						<this.state.content
							{...this.props.args}
							ref={this.props.contentRef}
						/>
					) : (
						false
					)}
				</div>
			</StyledGameWindow>
		)
	}
}

const StyledGameWindow = styled.div`
	background-color: white;
	border: 1px solid royalblue;
	display: flex;
	flex-flow: column;
	font-size: small;
	position: absolute;
	min-height: 250px;
	min-width: 250px;

	.window-header {
		display: flex;
		justify-content: space-between;
		background-color: royalblue;
		user-select: none;
		border-bottom: 1px solid royalblue;

		h4 {
			margin-right: 0px;
		}
		button {
			top: 2px;
			border: none;
			float: right;
			background: none;
			outline: none;

			&:hover {
				background: lightcoral;
			}
			&:active {
				background: red;
			}
		}
		.content {
		}
	}
`
