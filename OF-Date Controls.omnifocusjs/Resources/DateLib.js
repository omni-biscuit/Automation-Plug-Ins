(() => {
	let DateLib = new PlugIn.Library(new Version("1.0"));
	
	DateLib.getSelection = () => document.windows[0].selection
	
	DateLib.today = Calendar.current.startOfDay(new Date())
	
	DateLib.getTimeComponentsFromString = function(timeString) {
		let placeholderDate = new Date("1/1/1 " + timeString)
		let defaultTimeComponents = new DateComponents()
		defaultTimeComponents.hour = placeholderDate.getHours()
		defaultTimeComponents.minute = placeholderDate.getMinutes()
		
		return defaultTimeComponents
	}
	
	DateLib.getDefaultDeferTimeComponents = function() { 
		return this.getTimeComponentsFromString(settings.objectForKey("DefaultStartTime"))
	}

	DateLib.getDefaultDueTimeComponents = function() { 
		return this.getTimeComponentsFromString(settings.objectForKey("DefaultDueTime")) 
	}
	
	DateLib.incrementDate = function(dateType, dateIncrementer) {
		let sel = this.getSelection()
		let cal = Calendar.current
		let defaultTimeComponents
		
		sel.databaseObjects.forEach(obj => {

			if (obj instanceof Task || obj instanceof Project){
			
				let oldDate
				let newDate
				
				if (dateType == "due") {
					oldDate = obj.dueDate
					defaultTimeComponents = this.getDefaultDueTimeComponents()
				}
				else if (dateType == "defer") {
					oldDate = obj.deferDate
					defaultTimeComponents = this.getDefaultDeferTimeComponents()
				}		
						
				// Apply a new date to items that don't have an existing date
				if (!oldDate) {
					if (dateIncrementer.hour) {
						oldDate = new Date()					
					}
					else {
						oldDate = cal.dateByAddingDateComponents(new Date(this.today), defaultTimeComponents)
					}
				}
				
				// Set due date to today or defer date to tomorrow
				if (dateIncrementer.day === 0) {
					let oldHour = oldDate.getHours()
					let oldMinutes = oldDate.getMinutes()

					// Reset old date to today, but preserve the time
					oldDate = new Date(this.today)
					oldDate.setHours(oldHour)
					oldDate.setMinutes(oldMinutes)
					
					if (dateType == "defer") {dateIncrementer.day = 1}
				}

				newDate = cal.dateByAddingDateComponents(oldDate, dateIncrementer)
				
				if (dateType == "due") obj.dueDate = newDate
				if (dateType == "defer") obj.deferDate = newDate
			}
		})
	}
	
	DateLib.clearDate = function(dateField){
	
		let sel = this.getSelection()
		
		sel.databaseObjects.forEach(obj => {
			if (obj instanceof Task || obj instanceof Project){
				if (obj.task != undefined) {obj = obj.task} // workaround for bug setting dueDate to null on Project objects
				
				if (dateField.includes("due")) {obj.dueDate = null}
				if (dateField.includes("defer")) {obj.deferDate = null}
			}
		})
	}
	
	return DateLib;
})();

