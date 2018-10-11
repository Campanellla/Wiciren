import React, { Component } from 'react'

import { FpsLabel, DrawCallsLabel } from './InterfaceComponents/FpsLabel.js'
import { TimeText } from './InterfaceComponents/Labels.js'
import Loader from './Loader.js'
import SelectionView from './SelectionView.js'

import BottomMenu from './ButtonMenuList'

import WindowContainer from './WindowContainer'

/*

import WindowContainer from './WindowContainer.js'
import { ButtonsMenu } from './InterfaceComponents/ButtonsMenu.js'

import ButtonMenuList from './ButtonMenuList'
*/

export default class UI extends Component {
	constructor(props) {
		super(props)
		this.workspace = this.props.workspace

		this.timeTextComponent = React.createRef()
		this.drawCallsLabelComponent = React.createRef()
		this.fpsLabelComponent = React.createRef()

		this.selectionViewComponent = React.createRef()
		this.windowContainerComponent = React.createRef()

		this.buttonsMenuComponent = React.createRef()
		this.LoaderComponent = React.createRef()
	}

	render() {
		return (
			<div>
				<Loader ref={this.LoaderComponent} />

				<TimeText ref={this.timeTextComponent} />
				<DrawCallsLabel ref={this.drawCallsLabelComponent} />
				<FpsLabel ref={this.fpsLabelComponent} />

				<Labels />
				<WindowContainer ref={this.windowContainerComponent} />
				<BottomMenu />

				<SelectionView
					ref={this.selectionViewComponent}
					workspace={this.workspace}
				/>
			</div>
		)
	}
}

const Labels = () => {
	return <div />
}

const InactiveCanvasOverlay = () => {
	return <div />
}

/*
export default class InterfaceView extends Component {
	render() {
		return (
			<div>
				
				<ButtonMenuList />
				
				
				

				<ButtonsMenu
					ref={this.buttonsMenuComponent}
					windowContainer={this.windowContainerComponent}
					className="configmenubutton"
					workspace={this.workspace}
				/>
			</div>
		)
	}
}
*/
