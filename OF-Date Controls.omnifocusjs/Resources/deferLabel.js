(() => {
	let action = new PlugIn.Action(() => {
		// This empty action serves as a label/separator in the menu bar
	})

	action.validate = () => false;
	
	return action;
})();