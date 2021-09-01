(() => {
	let action = new PlugIn.Action(() => {
		// This empty action serves as a label/separator when viewing the plug-in actions in the menu bar
	})

	action.validate = () => false;
	
	return action;
})();