import meshesLoader from './meshesLoader'
import resources from './resources'

export default class Loader {
	constructor(game) {
		this.game = game
		this.meshes = {
			loaded: 0,
			loading: 0,
			current: '',
		}
		this.onLoad = null
		this.state = {
			meshes: false,
		}
		this.component = {}
	}

	insertMesh() {
		this.meshes.loading++

		if (this.component.current) {
			this.component.current.setState({
				loading: this.meshes.loading,
				loaded: this.meshes.loaded,
				active: true,
			})
		}
	}

	loadedMesh(current) {
		this.meshes.loaded++
		this.meshes.current = current
		this.check()
	}

	check() {
		if (this.meshes.loading === this.meshes.loaded) {
			if (this.onLoad) {
				if (this.component.current) {
					this.component.current.setState({
						active: false,
					})
				}

				this.onLoad()
			}
		}
		if (this.component.current) {
			this.component.current.setState({
				loading: this.meshes.loading,
				loaded: this.meshes.loaded,
				current: this.meshes.current,
			})
		} else if (this.game.interfaceComponent.current) {
			this.component = this.game.interfaceComponent.current.LoaderComponent
		}
	}

	loadMeshes(scene, list) {
		if (list) {
			meshesLoader(scene, list)
		}
		meshesLoader(scene, resources.meshes)
	}
}
