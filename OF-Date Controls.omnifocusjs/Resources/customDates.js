(() => {
    let action = new PlugIn.Action(function(selection) {
        // Add code to run when the action is invoked
        let cal = Calendar.current
        let DateLib = this.DateLib

		let optionInputField = new Form.Field.Option(
			"dateOption",
			"Dates to update",
			[0,1,2],
			["Defer Only", "Due Only", "Defer & Due"],
			1
		)

		let deferInputField = function() {
			let form = new Form.Field.Date(
				"deferInput",
				"Defer",
				new Date(),
				null
			)
			return form
		}

		let deferInputWithTimeField = function() {
			let form = new Form.Field.Date(
				"deferInputWithTime",
				"Defer",
				new Date(),
				null
			)
			return form
		}

		let dueInputField = function() {
			let form = new Form.Field.Date(
				"dueInput",
				"Due",
				new Date(),
				null
			)
			return form
		}

		let dueInputWithTimeField = function() {
			let form = new Form.Field.Date(
				"dueInputWithTime",
				"Due",
				new Date(),
				null
			)
			return form
		}

		let pushDueCheckbox = function() {
			let form = new Form.Field.Checkbox(
				"pushDue",
				"Push out due date relative to new defer date"
			)
			return form
		}

		let includeTimeCheckbox = new Form.Field.Checkbox(
			"includeTime",
			"Adjust time on dates"
		)

		let inputForm = new Form()
		let formPrompt = "Batch Update Dates:"
		let buttonTitle = "Continue"
		inputForm.addField(optionInputField)
		inputForm.addField(dueInputField())
		inputForm.addField(includeTimeCheckbox)

		let formPromise = inputForm.show(formPrompt, buttonTitle)

		inputForm.validate = function(formObject) {
			let dateOption = formObject.values["dateOption"]
			let includeTime = formObject.values["includeTime"]
			let deferInput = formObject.values["deferInput"]
			let deferInputWithTime = formObject.values["deferInputWithTime"]
			let dueInput = formObject.values["dueInput"]
			let dueInputWithTime = formObject.values["dueInputWithTime"]
			let dateFilled

			// Set up the form for "Defer Only"
			if (dateOption == 0) {
				// Remove the second date field when switching from "Defer & Due"
				if (inputForm.fields[2]["key"].includes("due")) {
					inputForm.removeField(inputForm.fields[2])
				}
				if (inputForm.fields[2]["key"] != "pushDue") {
					inputForm.addField(pushDueCheckbox(), 2)
				}
				if (!includeTime) {
					if (inputForm.fields[1]["key"] != "deferInput") {
						inputForm.removeField(inputForm.fields[1])
						inputForm.addField(deferInputField(), 1)
					}
					dateFilled = deferInput
				}
				else if (includeTime) {
					if (inputForm.fields[1]["key"] != "deferInputWithTime") {
						inputForm.removeField(inputForm.fields[1])
						inputForm.addField(deferInputWithTimeField(), 1)
					}
					dateFilled = deferInputWithTime
				}
			}

			// Set up the form for "Due Only"
			else if (dateOption == 1) {
				if (inputForm.fields.length == 4) {
					// Remove the extra form field when switching from the other dateOptions
					inputForm.removeField(inputForm.fields[2])
				}
				if (!includeTime) {
					if (inputForm.fields[1]["key"] != "dueInput") {
						inputForm.removeField(inputForm.fields[1])
						inputForm.addField(dueInputField(), 1)
					}
					dateFilled = dueInput
				}
				else if (includeTime) {
					if (inputForm.fields[1]["key"] != "dueInputWithTime") {
						inputForm.removeField(inputForm.fields[1])
						inputForm.addField(dueInputWithTimeField(), 1)
					}
					dateFilled = dueInputWithTime
				}
			}

			// Set up the form for "Defer & Due"
			else if (dateOption == 2) {
				if (inputForm.fields.length == 3) {
					inputForm.addField(deferInputField(), 1)
				}
				if (!includeTime) {
					if (inputForm.fields[1]["key"] != "deferInput"
					|| inputForm.fields[2]["key"] != "dueInput") {
						inputForm.removeField(inputForm.fields[1])
						inputForm.addField(deferInputField(), 1)
						inputForm.removeField(inputForm.fields[2])
						inputForm.addField(dueInputField(), 2)
					}
					dateFilled = (deferInput && dueInput)
				}
				else if (includeTime) {
					if (inputForm.fields[1]["key"] != "deferInputWithTime"
					|| inputForm.fields[2]["key"] != "dueInputWithTime") {
						inputForm.removeField(inputForm.fields[1])
						inputForm.addField(deferInputWithTimeField(), 1)
						inputForm.removeField(inputForm.fields[2])
						inputForm.addField(dueInputWithTimeField(), 2)
					}
					dateFilled = (deferInputWithTime && dueInputWithTime)
				}
			}

			// Make sure all date fields (per the selected dateOption) are filled in
			if (dateFilled){return true}
		}

		formPromise.then(function(formObject) {
			let dateOption = formObject.values["dateOption"]
			let updateDateOnly = !formObject.values["includeTime"]
			let pushDue = formObject.values["pushDue"]
			let newDeferDate
			let newDueDate

			// sel = document.windows[0].selection

			selection.databaseObjects.forEach(function(obj) {
				if (obj instanceof Task || obj instanceof Project) {
					let oldDeferDate = obj.deferDate
					let oldDueDate = obj.dueDate

					// Defer Only
					if (dateOption == 0 || dateOption == 2) {
						if (updateDateOnly) {
							newDeferDate = formObject.values["deferInput"]
							if (oldDeferDate) {
								newDeferDate.setHours(oldDeferDate.getHours())
								newDeferDate.setMinutes(oldDeferDate.getMinutes())
							}
							else {
								let defaultDeferDate = DateLib.getDefaultDeferTimeComponents()
								newDeferDate.setHours(defaultDeferDate.hour)
								newDeferDate.setMinutes(defaultDeferDate.minute)
							}
						}
						else {
							newDeferDate = formObject.values["deferInputWithTime"]
						}
						obj.deferDate = newDeferDate

						// Push out due date relative to new defer date
						if (pushDue) {
							let dateDiff = cal.dateComponentsBetweenDates(oldDeferDate, oldDueDate)
							newDueDate = cal.dateByAddingDateComponents(newDeferDate, dateDiff)
							obj.dueDate = newDueDate
						}
					}

					// Due Only
					if (dateOption == 1 || dateOption == 2) {
						if (updateDateOnly) {
							newDueDate = formObject.values["dueInput"]
							if (oldDueDate) {
								newDueDate.setHours(oldDueDate.getHours())
								newDueDate.setMinutes(oldDueDate.getMinutes())
							}
							else {
								let defaultDueDate = DateLib.getDefaultDueTimeComponents()
								newDueDate.setHours(defaultDueDate.hour)
								newDueDate.setMinutes(defaultDueDate.minute)
							}
						}
						else {
							newDueDate = formObject.values["dueInputWithTime"]
						}
						obj.dueDate = newDueDate
					}
				}
			})
		})
    });

    action.validate = function(selection, sender) {
		return (selection.projects.length > 0 || selection.tasks.length > 0)
    };

    return action;
})();
