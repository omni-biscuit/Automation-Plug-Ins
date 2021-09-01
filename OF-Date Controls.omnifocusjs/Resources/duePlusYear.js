(() => {
	let action = new PlugIn.Action(function(selection, sender){
		let dc = new DateComponents(); dc.year = 1
		
		this.DateLib.incrementDate("due", dc)
	})

	action.validate = function(selection, sender){
		return (selection.projects.length > 0 || selection.tasks.length > 0)
	};
	
	return action;
})();