(() => {
	let action = new PlugIn.Action(function(selection, sender){
		this.DateLib.clearDate("defer")
	})

	action.validate = function(selection, sender){
		return (selection.projects.length > 0 || selection.tasks.length > 0)
	};
	
	return action;
})();