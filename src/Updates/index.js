import workspace from 'src/Workspace'

export function updateObjects() {
	let dtime = 1 / 60
	workspace.pipelist = []
	workspace.map.objectsList.forEach(function(object) {
		if (!object) return
		object.update(dtime)
	})

	if (workspace.updatePipelines) {
		workspace.updatePipelines = false
		workspace.pipelines.rebuild()
		workspace.electricalGrids.rebuild()
	}

	workspace.electricalGrids.update()
	workspace.pipelines.update()
}
