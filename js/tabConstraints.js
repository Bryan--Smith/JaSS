
$(function() {

	$( "#constraintsTable").hide();
	$( "#constraintsTable").handsontable({
		colHeaders: ['Constraint Name', 'Type', ''],
		startCols: 3,
			columns: [
				{readOnly: true},
				{readOnly: true},
				{readOnly: true}
			]		
	});	
		
});


var constraints = {}

constraints.getConstraintNames = function () {
	return $( "#constraintsTable").handsontable("getDataAtCol", 0);
}


constraints.loadTab = function (tableName, fileName) {
	$.ajax({
		type: "GET",
		url: "action/tableConstraints.asp", 
		data: {'tableName': tableName, 'fileName':fileName},
		dataType: "json",
		cache: false,
		success: function(msg) {
			var tableDetail = new Array();
			var constraintArray = msg.constraints
			var nrConstraints = constraintArray.length;
			for (var i=0; i< nrConstraints; i++) {
				var constraint = constraintArray[i];
				

				
				var constraintDetail = new Array();

				constraintDetail[0] = constraint.name;
				constraintDetail[1] = constraint.type;
				constraintDetail[2] = "";
				
				if (constraint.type == "FOREIGN KEY") {
					var detail = constraint.detail;
					if (detail != null && detail.length>0) {
						for (var j=0; j<detail.length; j++) {
							if (j>0) { constraintDetail[2] += "\n";}
							if (tableName == detail[j].fkTableName) {
								constraintDetail[2] += detail[j].fkColumnName + " --> " + detail[j].pkTableName + "." + detail[j].pkColumnName ;
							}
							else if (tableName == detail[j].pkTableName) {
								constraintDetail[2] += detail[j].fkTableName + "." + detail[j].fkColumnName + " --> " + detail[j].pkColumnName ;
							}
						}
					}
				}
				else if (constraint.type == "PRIMARY KEY") {
					var detail = constraint.detail;
					if (detail != null && detail.length>0) {
						for (var j=0; j<detail.length; j++) {
							if (j>0) { constraintDetail[2] += ", ";}
							constraintDetail[2] += detail[j].columnName;
						}
					}
				}
				else if (constraint.type == "UNIQUE") {
					var detail = constraint.detail;
					if (detail != null && detail.length>0) {
						for (var j=0; j<detail.length; j++) {
							if (j>0) { constraintDetail[2] += ", ";}
							constraintDetail[2] += detail[j].columnName;
						}
					}
				}
				else if (constraint.type == "CHECK") {
					var detail = constraint.detail;
					if (detail != null && detail.length>0) {
						constraintDetail[2] = detail[0].checkClause;
					}
				}
				else  {
					constraintDetail[2] = "";
					
				}				

				
				tableDetail.push(constraintDetail);
			}
			
			$( "#constraintsTable").show();
			$( "#constraintsTable").handsontable('loadData', tableDetail);
		},
		error: function(err, status) {
			errorDialog("Constraints loadTab", err);
			console.log("error" + status);
		}
	});
}

constraints.createPrimaryKey = function (fileName, tableName, pkName, columnNames) {
	$.ajax({
		type: "POST",
		url: "action/createPrimaryKey.asp", 
		data: {'fileName': fileName, 'tableName':tableName, 'pkName':pkName,  'columnNames':columnNames},
		dataType: "json",
		cache: false,
		success: function(msg) {
			var status = msg.status
			var message = msg.errorMessage
			
			if (status == "ERROR") {
				$("#ddlErrorMessage").text(message);
				$('#ddlSuccessMessage').text("");
			}
			else {
				$("#ddlErrorMessage").text("");
				$('#ddlSuccessMessage').text('Primary key constraint ' + pkName + ' added to table ' + tableName);
				constraints.loadTab(tableName, fileName);				
			}
			console.log("Success");
		},
		error: function(err, status) {
			errorDialog("Create Primary Key", err);
			console.log("error" + status);
		}
	});
}


constraints.createForeignKey = function (parameters) {
	$.ajax({
		type: "POST",
		url: "action/createForeignKey.asp", 
		data: parameters,
		dataType: "json",
		cache: false,
		success: function(msg) {
			var status = msg.status
			var message = msg.errorMessage
			var fileName = parameters.fileName;
			var tableName = parameters.tableName;
			var pkName = parameters.pkName;
			
			if (status == "ERROR") {
				$("#ddlErrorMessage").text(message);
				$('#ddlSuccessMessage').text("");
			}
			else {
				$("#ddlErrorMessage").text("");
				$('#ddlSuccessMessage').text('Foreign key constraint ' + pkName + ' added to table ' + tableName);
				constraints.loadTab(tableName, fileName);				
			}
			console.log("Success");
		},
		error: function(err, status) {
			errorDialog("Create Foreign Key", err);
			console.log("error" + status);
		}
	});
}

// createCheckConstraint(fileName, tableName, ckName, condition);
constraints.createCheckConstraint = function (fileName, tableName, ckName, condition) {
	$.post("action/createCheckConstraint.asp", 
		{fileName : fileName, tableName: tableName, ckName: ckName, condition: condition},
		null,
		"json").done(function(msg) {
			var status = msg.status
			var message = msg.errorMessage

			
			if (status == "ERROR") {
				$("#ddlErrorMessage").text(message);
				$('#ddlSuccessMessage').text("");
			}
			else {
				$("#ddlErrorMessage").text("");
				$('#ddlSuccessMessage').text('Check constraint ' + ckName + ' added to table ' + tableName);
				constraints.loadTab(tableName, fileName);				
			}
			console.log("Success");
	});


}


constraints.createUniqueKey = function (fileName, tableName, ukName, columnNames) {
	$.ajax({
		type: "POST",
		url: "action/createUniqueKey.asp", 
		data: {'fileName': fileName, 'tableName':tableName, 'ukName':ukName,  'columnNames':columnNames},
		dataType: "json",
		cache: false,
		success: function(msg) {
			var status = msg.status
			var message = msg.errorMessage
			
			if (status == "ERROR") {
				$("#ddlErrorMessage").text(message);
				$('#ddlSuccessMessage').text("");
			}
			else {
				$("#ddlErrorMessage").text("");
				$('#ddlSuccessMessage').text('Unique key constraint ' + ukName + ' added to table ' + tableName);
				constraints.loadTab(tableName, fileName);				
			}
			console.log("Success");
		},
		error: function(err, status) {
			errorDialog("Create Unique Key", err);
			console.log("error" + status);
		}
	});
}


constraints.dropConstraint = function (tableName, fileName, constraintName) {
	$.ajax({
		type: "POST",
		url: "action/dropConstraint.asp", 
		data: {'tableName': tableName, 'fileName':fileName, 'constraintName': constraintName},
		dataType: "json",
		cache: false,
		success: function(msg) {
			var status = msg.status
			var message = msg.errorMessage
			
			if (status == "ERROR") {
				$("#ddlErrorMessage").text(message);
				$('#ddlSuccessMessage').text("");
			}
			else {
				$("#ddlErrorMessage").text("");
				$('#ddlSuccessMessage').text("Constraint " + constraintName + " dropped from table " + tableName);
				$('#constraintName option:selected').remove();
				$('#constraintName').val("");
				$('#constraintName').addClass("jassError");
				enableDisablePopupSubmit();
				constraints.loadTab(tableName, fileName);				
			}
		},
		error: function(err, status) {
			errorDialog("Drop Constraint", err);
			console.log("error" + status);
		}
	});
}


constraints.createPrimaryKeyDialog = function () {
	$('#tabs').tabs("option", "active", CONSTRAINTS);
	var fileName = "html/createPrimaryKeyDialog.html";
	var html = getHtml(fileName);
	$('#popup').html(html);
	
	$( "#popup" ).dialog( "open" );
	$( "#popup" ).dialog( "option", "title", "Add Primary Key to '" + navigation.getDatabaseObjectName() + "' table" );
	$( "#popup" ).dialog( "option", "width", 350);
	$( "#popup" ).dialog( "option", "buttons",
			[{text: "Create Primary Key",
			  id: "submit",
              click: function()	{
					console.log("createColumnOK");
					var tableName = navigation.getDatabaseObjectName();
					var fileName = navigation.getDatabaseFileName();
					var pkName = $('#pkName').val();
								
					
					var columnNameList = "";
					
					$('.dialogTableRow').each( function(index, element) {
						if (index>0) {
							columnNameList += ",";
						}
						var name = $(this).find('.columnName').val();
						columnNameList += name;
						console.log( name);
					});

					constraints.createPrimaryKey(fileName, tableName, pkName, columnNameList);
				}},
			{text: "Close",
			 click: function() {

					$( "#popup" ).dialog( "close" );
					$('#popup').html("");	 
				}}]);	
	
	
	$('.dialogTableHeading').after( constraints.getCreatePrimaryKeyRow() );
	
	// Click handle for New Column button
	$('#addTableColumn').click( function() {
		var $row = constraints.getCreatePrimaryKeyRow();
		$('.dialogTable').children().last().after( $row );
		
		// Show delete button if there are now 2 or more rows.
		var nrRows = $('.dialogTable').find('.dialogTableRow').length;
		if (nrRows > 1) {
			$('.dialogTableRow').find('.columnDelete').show();
		}

		addValidationHandlers($row);
	});	
	
	addValidationHandlers( );
}

constraints.createUniqueKeyDialog = function () {
	$('#tabs').tabs("option", "active", CONSTRAINTS);
	var fileName = "html/createUniqueKeyDialog.html";
	var html = getHtml(fileName);
	$('#popup').html(html);
	
	$( "#popup" ).dialog( "open" );
	$( "#popup" ).dialog( "option", "title", "Add Unique Key to '" + navigation.getDatabaseObjectName() + "' table" );
	$( "#popup" ).dialog( "option", "width", 350);
	$( "#popup" ).dialog( "option", "buttons",
			[{text: "Add Unique Key constraint",
			  id: "submit",
              click: function()	{
					console.log("createColumnOK");
					var tableName = navigation.getDatabaseObjectName();
					var fileName = navigation.getDatabaseFileName();
					var ukName = $('#ukName').val();
								
					
					var columnNameList = "";
					
					$('.dialogTableRow').each( function(index, element) {
						var name = $(this).find('.columnName').val();
						columnNameList += name;
						console.log( name);
					});

					constraints.createUniqueKey(fileName, tableName, ukName, columnNameList);
				}},
			{text: "Close",
			 click: function() {

					$( "#popup" ).dialog( "close" );
					$('#popup').html("");	 
				}}]);	
	
	
	$('.dialogTableHeading').after( constraints.getCreatePrimaryKeyRow() );
	
	// Click handle for New Column button
	$('#addTableColumn').click( function() {
		var $row = constraints.getCreatePrimaryKeyRow();
		$('.dialogTable').children().last().after( $row );
		
		// Show delete button if there are now 2 or more rows.
		var nrRows = $('.dialogTable').find('.dialogTableRow').length;
		if (nrRows > 1) {
			$('.dialogTableRow').find('.columnDelete').show();
		}

		addValidationHandlers( $row );
	});

	addValidationHandlers( );
}


constraints.getCreateRow = function (rowHtmlUrl) {
	var $rowHtml = $(getHtml(rowHtmlUrl));
	$rowHtml.find('.columnDelete').hide();


	
	// Event handler for delete button
	$rowHtml.find('.columnDelete').click(function() {
		console.log("Delete row clicked");
		$(this).parent().parent().remove();
		
		// Hide delete button if only one row remains
		var nrRows = $('.dialogTable').find('.dialogTableRow').length;
		if (nrRows == 1) {
			$('.dialogTableRow').find('.columnDelete').hide();
		}
		
		// Enable/Disable the submit button
		enableDisablePopupSubmit();
	});
	
	return $rowHtml;
}

constraints.getCreatePrimaryKeyRow = function () {
	var $rowHtml = constraints.getCreateRow("html/createPrimaryKeyRow.html");

	$rowHtml.find('.columnName').append('<option value="" selected>-- Choose Column --</option>');
	var columnNames = columns.getColumnNames();
	for (var i=0; i<columnNames.length; i++) {
		$rowHtml.find('.columnName').append('<option value="' + columnNames[i] + '">' + columnNames[i] + '</option>');
	}

	return $rowHtml;
}

constraints.getCreateForeignKeyRow = function (foreignColumnNames) {
	var $rowHtml = constraints.getCreateRow("html/createForeignKeyRow.html");

	var columnNames = columns.getColumnNames();
	$rowHtml.find('.columnName').append('<option value="">-- Select Column --</option>');
	for (var i=0; i<columnNames.length; i++) {
		$rowHtml.find('.columnName').append('<option value="' + columnNames[i] + '">' + columnNames[i] + '</option>');
	}
	
	$rowHtml.find('.foreignColumnName').append('<option value="">-- Select Column --</option>');
	for (var i=0; i<foreignColumnNames.length; i++) {
		$rowHtml.find('.foreignColumnName').append('<option value="' + foreignColumnNames[i] + '">' + foreignColumnNames[i] + '</option>');
	}	

	return $rowHtml;
}

constraints.createForeignKeyDialog = function() {
	$('#tabs').tabs("option", "active", CONSTRAINTS);
	var fileName = "html/createForeignKeyDialog.html";
	var html = getHtml(fileName);
	$('#popup').html(html);
	
	// Add table names to dialog
	var $foreignTableSelect = $('#popup').find('#foreignTableName');
	var tableNames = navigation.getDatabaseTableNames();
	var foreignColumnNames = [];
	$foreignTableSelect.append("<option value=''>-- Select Foreign Table --</option>");
	for (var i=0; i<tableNames.length; i++) {
		var tableName = tableNames[i];
		$foreignTableSelect.append("<option value='" + tableName + "'>" + tableName + "</option>");
	}
	
	// Get Foreign Column Names
	$foreignTableSelect.change(function() {
		var foreignTableName =$(this).val();
		var fileName = navigation.getDatabaseFileName();
		$.get("action/getColumnNames.asp", 
			  {'tableName': foreignTableName, 'fileName':fileName},
			  null,
			  "json").success(function(msg) {
					foreignColumnNames = msg.columnNames;
					
					$('.foreignColumnName').empty();
					$('.foreignColumnName').append('<option value="">-- Select Column --</option>');
					for (var i=0; i<foreignColumnNames.length; i++) {
						$('.foreignColumnName').append('<option value="' + foreignColumnNames[i] + '">' + foreignColumnNames[i] + '</option>');
					}					
				});
	});		

	$( "#popup" ).dialog( "open" );
	$( "#popup" ).dialog( "option", "title", "Add Foreign Key Constraint to '" + navigation.getDatabaseObjectName() + "' table" );
	$( "#popup" ).dialog( "option", "width", 350);
	$( "#popup" ).dialog( "option", "buttons",
			[{text: "Add Foreign Key Constraint",
			  id: "submit",
              click: function()	{
			  
					var parameters = new Object();
					

					parameters.fileName = navigation.getDatabaseFileName();
					parameters.tableName= navigation.getDatabaseObjectName();
					parameters.fkName = $('#fkName').val();
					parameters.foreignTableName = $('#foreignTableName').val();
					
					var $rowData = $('.dialogTable').find('.dialogTableRow');
					parameters.nrColumns = $rowData.length;

					$rowData.each(function(index) {
						parameters["columnName" + (index+1)]  = $(this).find('.columnName').val();
						parameters["foreignColumnName" + (index+1)]  = $(this).find('.foreignColumnName').val();

					});	

					constraints.createForeignKey(parameters);
				}},
			{text: "Close",
			 click: function() {

					$( "#popup" ).dialog( "close" );
					$('#popup').html("");	 
				}}]);	
	
	
	$('.dialogTableHeading').after( constraints.getCreateForeignKeyRow([]) );

	// Click handle for New Column button
	$('#addTableColumn').click( function() {
		$row = constraints.getCreateForeignKeyRow(foreignColumnNames);
		$('.dialogTable').children().last().after( $row );
		
		// Show delete button if there are now 2 or more rows.
		var nrRows = $('.dialogTable').find('.dialogTableRow').length;
		if (nrRows > 1) {
			$('.dialogTableRow').find('.columnDelete').show();
		}

		addValidationHandlers($row);
	});

	addValidationHandlers();
}



constraints.createCheckConstraintDialog = function () {
	$('#tabs').tabs("option", "active", CONSTRAINTS);
	var fileName = "html/createCheckConstraintDialog.html";
	var html = getHtml(fileName);
	$('#popup').html(html);
	
	$( "#popup" ).dialog( "open" );
	$( "#popup" ).dialog( "option", "width", 740 );
	$( "#popup" ).dialog( "option", "title", "Add Check Constraint to '" + navigation.getDatabaseObjectName() + "' table" );
	$( "#popup" ).dialog( "option", "buttons",
			[{text: "Add Check Constraint",
			  id: "submit",
              click: function()	{
					console.log("createColumnOK");
					var tableName = navigation.getDatabaseObjectName();
					var fileName = navigation.getDatabaseFileName();
					var ckName = $('#ckName').val();
					var condition = $('#condition').val();

					constraints.createCheckConstraint(fileName, tableName, ckName, condition);
				}},
			{text: "Close",
			 click: function() {

					$( "#popup" ).dialog( "close" );
					$('#popup').html("");	 
				}}]);	
	
	addValidationHandlers();
}



constraints.dropConstraintDialog = function () {
	$('#tabs').tabs("option", "active", CONSTRAINTS);
	
	var fileName = "html/dropConstraintDialog.html";
	var html = getHtml(fileName);
	$('#popup').html(html);
	
	$( "#popup" ).dialog( "open" );
	$( "#popup" ).dialog( "option", "title", "Drop Constraint from '" + navigation.getDatabaseObjectName() + "' table");
	$( "#popup" ).dialog( "option", "width", 350);
	$( "#popup" ).dialog( "option", "buttons",
			[{text: "Drop Constraint",
			  id: "submit",
              click: function()	{
					var constraintToDelete = $('#constraintName').val();
					if (confirm("Do you wish to drop '" + constraintToDelete + "' constraint from '" + navigation.getDatabaseObjectName() + "' table ?")) {
						var tableName = navigation.getDatabaseObjectName();
						var fileName = navigation.getDatabaseFileName();
						constraints.dropConstraint(tableName, fileName, constraintToDelete)
					}
				}},
			{text: "Close",
			 click: function() {
				console.log("dropIndexesCancel-");
				$( "#popup" ).dialog( "close" );
				$('#popup').html("");		 
				}}]);	
	
	var constraintNames = constraints.getConstraintNames();
	
	$('#constraintName').append("<option value=''>-- Choose constraint --</option>");
	$.each(constraintNames, function(index, value) {
		$('#constraintName').append("<option value='" + value + "'>" + value + "</option>");
	});
	
	addValidationHandlers();
}
