import React, { Component } from 'react'
import styled from 'styled-components'

export default class Loader extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: -1,
			loaded: -1,
			active: true,
			current: '',
		}
	}

	render() {
		if (!this.state.active) return false
		return (
			<LoaderContainer>
				<h2>Loading</h2>
				<br />
				<h3>
					{`loaded meshes: ${this.state.loaded} from ${this.state.loading}`}
					<br />
					{`${this.state.current}`}
				</h3>
			</LoaderContainer>
		)
	}
}

const LoaderContainer = styled.div`
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-flow: column;
	height: 100%;
	width: 100%;
	text-align: center;

	> h2,
	h3 {
		margin: 0;
		width: fit-content;
	}
`
