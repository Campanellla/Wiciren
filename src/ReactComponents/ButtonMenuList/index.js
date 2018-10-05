import React, { Component } from 'react'
import styled, { css } from 'styled-components'

export default class ButtonMenuList extends Component {
	constructor(props) {
		super(props)

		this.state = { inventory: false, saves: false }

		this.onInventory = this.onInventory.bind(this)
		this.onSaves = this.onSaves.bind(this)
	}

	onInventory() {
		this.setState({ inventory: !this.state.inventory })
	}
	onSaves() {
		this.setState({ saves: !this.state.saves })
	}

	render() {
		return (
			<div>
				<Inventory hidden={!this.state.inventory} />
				<SavesList hidden={!this.state.saves} />
				<Container>
					<button onClick={this.onInventory}>inventory</button>
					<button onClick={this.onSaves}>saves</button>
					<button>another</button>
				</Container>
			</div>
		)
	}
}

const Container = styled.div`
	display: flex;
	position: fixed;
	bottom: 0.5em;
	width: 100%;
	justify-content: center;
`

class Inventory extends Component {
	constructor(props) {
		super(props)
		this.state = {
			items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		}
	}
	render() {
		if (this.props.hidden) return false
		return (
			<InventoryContainer>
				<InventoryList items={this.state.items} />
			</InventoryContainer>
		)
	}
}

const InventoryContainer = styled.div`
	position: fixed;
	top: 25%;
	left: 25%;

	height: 50%;
	width: 20em;
	background: white;
`

function InventoryList(props) {
	return (
		<StyledInventoryList>
			{props.items
				? props.items.map(item => <InventoryItem item={item} />)
				: false}
		</StyledInventoryList>
	)
}

const StyledInventoryList = styled.div`
	display: flex;
	flex-flow: row wrap;
	align-content: baseline;
`

function InventoryItem(props) {
	return <StyledInventoryItem draggable>{props.item}</StyledInventoryItem>
}

const StyledInventoryItem = styled.div`
	height: 2em;
	width: 2em;
	background-color: lightgreen;
	margin: 2px;
	cursor: pointer;
	user-select: none;
`

class SavesList extends Component {
	constructor(props) {
		super(props)

		let saves = []

		for (var saveStr in window.localStorage) {
			let a = saveStr.match(/save\d{1,3}$/i)
			if (a) saves.push(a[0])
		}

		this.state = { saves, selected: '' }
		this.select = this.select.bind(this)
		this.inputRef = React.createRef()
	}

	select(text) {
		this.setState({ selected: text })
		this.inputRef.current.value = text
	}

	render() {
		if (this.props.hidden) return false
		let saves = []

		for (var saveStr in window.localStorage) {
			let a = saveStr.match(/^save\d{1,3}$/i)
			if (a) saves.push(a[0])
		}

		return (
			<SavesListContainer>
				<ul>
					{saves.map(save => (
						<li>
							<SavedItem
								text={save}
								parent={this}
								selected={this.state.selected}
							/>
						</li>
					))}
				</ul>

				<div className="operations">
					<button>save</button>
					<input placeholder="Enter name" ref={this.inputRef} />
					<button>load</button>
				</div>
			</SavesListContainer>
		)
	}
}

const SavesListContainer = styled.div`
	display: flex;
	flex-flow: column;
	background: white;
	position: fixed;
	top: 25%;
	left: 25%;
	height: 50%;
	width: 20em;
	padding: 1em;

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
			{props.text}
			<button hidden={!(props.selected === props.text)}>DELETE</button>
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
