import {game} from './App.js';




export function updateObjects(dtime){
	
	game.pipelist = [];
	
	game.map.objectsList.forEach(function(object){
		if (!object) return;
		object.update(dtime);
	});
	
	if (game.updatePipelines){
		
		game.updatePipelines = false;
		game.pipelines.rebuild();
				
	};
	
	game.pipelines.update();
	
};










