import {game} from './App.js';




export function updateObjects(dtime){
	
	dtime = 1/60;
	
	game.pipelist = [];
	
	game.map.objectsList.forEach(function(object){
		if (!object) return;
		object.update(dtime);
	});
	
	if (game.updatePipelines){
		
		game.updatePipelines = false;
		game.pipelines.rebuild();
		
		game.electricalGrids.rebuild();
		
	};
	
	game.electricalGrids.update();
	game.pipelines.update();
	
};







