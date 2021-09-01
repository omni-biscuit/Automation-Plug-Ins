(() => {
	let action = new PlugIn.Action(function(selection,sender){
		let versNum = this.plugIn.version.versionString
		let pluginName = this.plugIn.displayName
		let pluginID = this.plugIn.identifier
		let descriptionString = this.plugIn.description
		let companyURL = 'https://omni-automation.com/omnifocus/plug-in-date-controls.html'
		let plugInAuthor = this.plugIn.author
		// let documentationURL = ''
		let pluginLibraries = this.plugIn.libraries
		if (pluginLibraries.length != 0){
			libraryNames = []
			pluginLibraries.forEach(function(aLibrary){
				libraryName = aLibrary.name
				libraryVersion = aLibrary.version.versionString
				displayString = libraryName + ' v' + libraryVersion
				libraryNames.push(displayString)
			})
			libraryNamesString = 'LIBRARIES:'
			libraryNamesString = libraryNamesString + '\n' + libraryNames.join('\n')
		} else {
			libraryNamesString = 'This plugin has no libraries.'
		}
		
		let alertTitle = pluginName + ' v' + versNum
		let alertMessage = plugInAuthor + '\n'
		alertMessage += pluginID + '\n'
		alertMessage += companyURL + '\n\n'
		alertMessage += descriptionString + '\n\n' 
		alertMessage += libraryNamesString
		
		let alert = new Alert(alertTitle, alertMessage)
		alert.addOption('OK')
		// alert.addOption('Documentation')
		alert.show(function(result){
			if (result == 1){ 
				// if Documentation button is present and clicked
				url = URL.fromString(documentationURL)
				url.call(function(result){})
			}
		})
	});

	action.validate = function(selection){
		return true
	};

	return action;
})();
