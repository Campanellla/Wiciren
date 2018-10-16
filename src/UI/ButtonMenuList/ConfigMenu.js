import React, { Component } from 'react'
import SavesList from './SavedMenu'
import workspace from 'src/Workspace'

export default class ConfigMenu extends Component {
	constructor(props) {
		super(props)
		this.state = { revealed: false, abc: false }
		workspace.configmenu = this
	}

	onclick(e) {
		drawConfigMenu.apply(this)
	}

	render() {
		return (
			<div id="configmenu">
				<button onClick={e => this.onclick(e)}> ConfigMenu </button>
			</div>
		)
	}
}

class OperatingButton extends Component {
	render() {
		return <button onClick={opbutton}> opbutton </button>
	}
}

class ConfigMenuWindow extends Component {
	constructor(props) {
		super(props)
		this.drawSavesMenu = drawSavesMenu.bind(this)
		this.state = { saves: false }
	}

	render() {
		return (
			<div>
				<SaveButton />
				<LoadButton />
				<OperatingButton />
				<button onClick={this.drawSavesMenu}>saves</button>
			</div>
		)
	}
}

class SaveButton extends Component {
	clickSave() {
		var a = workspace.saveSessionToLocal(workspace.map.objectsList)
		window.localStorage.setItem('save0', a)
	}

	render() {
		return <button onClick={this.clickSave}>Save</button>
	}
}

class LoadButton extends Component {
	clickLoad() {
		var b = JSON.parse(window.localStorage.getItem('save0'))
		console.time('loadTime')
		workspace.loadSession(b)
		console.timeEnd('loadTime')
	}

	render() {
		return <button onClick={this.clickLoad}>Load</button>
	}
}

function drawConfigMenu() {
	if (this.state.revealed) {
		this.setState({ revealed: false })
	} else {
		workspace.UI.windowManager.drawMenu(ConfigMenuWindow)
		this.setState({ revealed: true })
	}
}

function opbutton() {
	console.log(workspace)
}

function drawSavesMenu() {
	if (this.state.saves) {
		this.setState({ saves: false })
	} else {
		workspace.UI.windowManager.drawMenu(SavesList)
		this.setState({ saves: true })
	}
}
