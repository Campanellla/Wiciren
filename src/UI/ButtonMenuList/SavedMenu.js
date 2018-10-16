import React, { Component } from 'react'
import styled, { css } from 'styled-components'

import workspace from 'src/Workspace'

export default class SavesList extends Component {
	constructor(props) {
		super(props)

		this.saves = []

		this.state = { saves: this.saves, selected: '' }
		this.select = this.select.bind(this)
		this.inputRef = React.createRef()

		this.onLoad = this.onLoad.bind(this)
		this.onSave = this.onSave.bind(this)
	}

	select(text) {
		this.setState({ selected: text })
		let name = this.saves.find(save => save.str === text).name
		this.inputRef.current.value = name ? name : text
	}

	onLoad() {
		let saveStr = this.state.selected
		var b = JSON.parse(window.localStorage.getItem(saveStr))
		if (b) {
			workspace.loadSession(b)
		} else {
			console.log('unable to load', b)
		}
	}

	onSave() {
		let saveName = this.inputRef.current.value
		var value = 0

		let saves = []
		for (let saveStr in window.localStorage) {
			let a = saveStr.match(/save\d{1,3}$/i)
			if (a) saves.push(a[0])
		}
		function fifun(save) {
			return save === 'save' + value
		}
		while (true) {
			if (value < 1000) {
				if (saves.findIndex(fifun) === -1) {
					let a = workspace.saveSessionToLocal(workspace.map.objectsList)
					window.localStorage.setItem('save' + value, a)
					window.localStorage.setItem(
						'save' + value + 'info',
						JSON.stringify({
							name: saveName,
						}),
					)
					this.setState({})
					return
				}
			} else {
				console.log('too many saves')
				return
			}
			value++
		}
	}

	onDelete(arg) {
		let saveStr = arg
		saveStr = arg.match(/^save\d{1,3}$/i)
		if (saveStr) {
			window.localStorage.removeItem(saveStr[0])
		} else {
			console.log('unable to delete', saveStr)
		}
		this.setState({})
	}

	render() {
		if (this.props.hidden) return false
		let saves = []

		for (var saveStr in window.localStorage) {
			let a = saveStr.match(/^save\d{1,3}$/i)
			if (a) {
				let str = a[0]
				let namestr = str + 'info'
				let info = window.localStorage.getItem(namestr)
				let name = info ? JSON.parse(info).name : null
				saves.push({ name, str })
			}
		}
		this.saves = saves
		return (
			<SavesListContainer>
				<ul>
					{saves.map((save, key) => (
						<li key={key}>
							<SavedItem
								text={save.str}
								name={save.name}
								parent={this}
								selected={this.state.selected}
								key={key}
							/>
						</li>
					))}
				</ul>

				<div className="operations">
					<button onClick={this.onSave}>save</button>
					<input placeholder="Enter name" ref={this.inputRef} />
					<button onClick={this.onLoad}>load</button>
				</div>
			</SavesListContainer>
		)
	}
}

const SavesListContainer = styled.div`
	display: flex;
	flex-flow: column;
	background: white;
	height: 100%;
	width: 100%;

	ul {
		margin: 0;
		list-style: none;
		padding: 0.25em;
		border: 1px solid gray;
		margin-bottom: 1em;
		flex-grow: 1;

		li:nth-child(even) {
			background: lightgray;
		}
	}

	.operations {
		display: flex;
		flex-flow: row nowrap;
		width: 100%;

		> input {
			width: 100%;
		}
	}
`

const SavedItem = props => {
	return (
		<SavedItemContainer
			onClick={() => props.parent.select(props.text)}
			selected={props.selected === props.text}
		>
			{props.name ? props.name : props.text}
			<button
				hidden={!(props.selected === props.text)}
				onClick={() => props.parent.onDelete(props.selected)}
			>
				DELETE
			</button>
		</SavedItemContainer>
	)
}

const SavedItemContainer = styled.div`
	cursor: pointer;
	${props =>
		props.selected
			? css`
					background: lightskyblue;
			  `
			: css`
					background: none;
			  `};

	button {
		float: right;
		background: none;
		background: rgba(255, 255, 255, 0.5);
	}
`
