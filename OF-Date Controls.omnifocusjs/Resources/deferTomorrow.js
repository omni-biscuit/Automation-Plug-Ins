(() => {
	let action = new PlugIn.Action(function(selection, sender){
		let dc = new DateComponents(); dc.day = 0
		
		this.DateLib.incrementDate("defer", dc)
	})

	action.validate = function(selection, sender){
		// validation code
		// selection options: tasks, projects, folders, tags
		return (selection.projects.length > 0 || selection.tasks.length > 0)
	};
	
	return action;
})();