
function createTableDialog() {



	var dialogHtml = getHtml("html/createTableDialog.html");
	$('#popup').html(dialogHtml);
	

	
	$( "#popup" ).dialog( "open" );
	$( "#popup" ).dialog( "option", "title", "Create Table: " + navigation.getDatabaseFileName() );
	$( "#popup" ).dialog( "option", "width", 740 );
	$( "#popup" ).dialog( "option", "buttons",
			[{text: "Create Table",
			  id: "submit",
              click: function()	{
					console.log("createTableOK");
					
					var parameters = new Object();
					

					parameters["fileName"] = navigation.getDatabaseFileName();
					parameters.tableName = $('#createtableName').val();
					
					var $rowData = $('.dialogTable').find('.dialogTableRow');
					parameters["nrColumns"] = $rowData.length;

					$rowData.each(function(index) {
						parameters["primaryKey" + (index+1)] = $(this).find('.primaryKey').is(':checked');
						parameters["columnName" + (index+1)]  = $(this).find('.columnName').val();
						parameters["columnType" + (index+1)]  = $(this).find('.columnType').val();
						parameters["length" + (index+1)]  = $(this).find('.length').val();
						parameters["lengthIsVisible" + (index+1)]  = $(this).find('.length').is(":visible");
						parameters["precision" + (index+1)]  = $(this).find('.precision').val();
						parameters["precisionIsVisible" + (index+1)]  = $(this).find('.precision').is(":visible");
						parameters["scale" + (index+1)]  = $(this).find('.scale').val();
						parameters["notNull" + (index+1)] = $(this).find('.notNull').is(':checked');
					});
					
					for (p in parameters) {
						console.log(p + " --> " + parameters[p]);
					}
					
					createTable(parameters);
				}},
				
			{text: "Close",
			 click: function() {

					$( "#popup" ).dialog( "close" );
					$('#popup').html("");	 
				}}]);
	
	// Create the 1st row
	$('.dialogTableHeading').after(getCreateTableColumnRow());
	
	// Click handle for New Column button
	$('#addTableColumn').click( function() {
		var $row = getCreateTableColumnRow();
		$('.dialogTable').children().last().after($row);
		
		// Show delete button if there are now 2 or more rows.
		var nrRows = $('.dialogTable').find('.dialogTableRow').length;
		if (nrRows > 1) {
			$('.dialogTableRow').find('.columnDelete').show();
		}

		addValidationHandlers($row);
	});
	
	addValidationHandlers( );
}

function getCreateTableColumnRow() {
	var $rowHtml = $(getHtml("html/createTableRow.html"));
	
	$select = $rowHtml.find('.columnType');
	$select.append("<option value='' selected>-- Choose Column Type --</option>");
	var columnTypes = columns.columnTypeList();
	for (var i=0; i<columnTypes.length; i++) {
		$select.append("<option value='" + columnTypes[i].value + "'>" + columnTypes[i].text + "</option>");
	}	
	
	
	$rowHtml.find('.columnDelete').hide();
	$rowHtml.find('.length').hide();
	$rowHtml.find('.precision').hide();
	$rowHtml.find('.scale').hide();
	$rowHtml.find('.columnType').change(function() {
		console.log("Change handler called");
		var columnType = $(this).val();
		if (columnType == "decimal") {
			$(this).parent().parent().find('.decimalParam').show();
			$(this).parent().parent().find('.varcharParam').hide();
		}
		else if (columnType == "varchar" || columnType == "char") {
			$(this).parent().parent().find('.decimalParam').hide();
			$(this).parent().parent().find('.varcharParam').show();
		}
		else {
			$(this).parent().parent().find('.decimalParam').hide();
			$(this).parent().parent().find('.varcharParam').hide();
		}
	});
	
	// Event handler for delete button
	$rowHtml.find('.columnDelete').click(function() {
		console.log("Delete row clicked");
		$(this).parent().parent().remove();
		
		// Hide delete button if only one row remains
		var nrRows = $('dialogTable').find('.createTableRow').length;
		if (nrRows == 1) {
			$('.dialogTableRow').find('.columnDelete').hide();
		}
		
		enableDisablePopupSubmit();
	});
	
	return $rowHtml;
}

function dropTableDialog() {
	$('#tabs').tabs("option", "active", COLUMNS);
	
	var fileName = "html/dropTableDialog.html";
	var html = getHtml(fileName);
	$('#popup').html(html);
	
	$( "#popup" ).dialog( "open" );
	$( "#popup" ).dialog( "option", "title", "Drop Table"  );
	$( "#popup" ).dialog( "option", "buttons",
			[{text: "Drop Table",
			  id: "submit",
              click: function()	{
					var tableToDrop = $('#tableName').val();
					if (confirm("Do you wish to drop '" + tableToDrop + "' table?")) {
						var fileName = navigation.getDatabaseFileName();
						dropTable(tableToDrop, fileName)
					}
				}},
			{text: "Close",
			 click: function() {
				console.log("dropColumnCancel-");
				$( "#popup" ).dialog( "close" );
				$('#popup').html("");		 
				}}]);	
	
	var tableNames = navigation.getTableNames();
	
	$('#tableName').append("<option value=''>-- Choose Table --</option>");
	$.each(tableNames, function(index, value) {
		$('#tableName').append("<option value='" + value + "'>" + value + "</option>");
	});
	
	addValidationHandlers( );
}



function createTable(parameters) {

	$.ajax({
		type: "POST",
		url: "action/createTable.asp", 
		data: parameters,
		dataType: "json",
		cache: false,
		success: function(msg) {
			var status = msg.status
			var message = msg.errorMessage
			
			if (status == "ERROR") {
				$("#ddlErrorMessage").text(message);
				$("#ddlSuccessMessage").text("");
			}
			else {
				$("#ddlErrorMessage").text("");
				$("#ddlSuccessMessage").text("Table '" + parameters.tableName + "' created");
				
				var newNode = {};
				
				newNode.label = parameters.tableName;
				newNode.objectName = parameters.tableName;
//				newNode.id = parameters.fileName + "\\" + parameters.tableName;
				newNode.dbType = "TABLE";

				navigation.addChildNode("TABLE_LIST", newNode);
				
				navigation.selectNode("TABLE_LIST", newNode.label);
//				selectNode(newNode.id);
				
				$('#tabs').tabs("option", "disabled", [ 3 ]);
				var fileName = navigation.getDatabaseFileName();
				var tableName = parameters.tableName;
				columns.loadTab(tableName, fileName);
				indexes.loadTab(tableName, fileName);
				constraints.loadTab(tableName, fileName);
				dataTab.loadTab(tableName, fileName, $(".pageSize", "#tabs-data").val(), 1, "", "", "");				
				
			}
			console.log("Success");
		},
		error: function(err, status) {
			errorDialog("Drop Constraint", err);
			console.log("error" + status);
		}
	});

}

function dropTable(tableName, fileName){

	$.ajax({
		type: "POST",
		url: "action/dropTable.asp", 
		data: {'tableName': tableName, 'fileName':fileName},
		dataType: "json",
		cache: false,
		success: function(msg) {
			var status = msg.status
			var message = msg.errorMessage
			
			if (status == "ERROR") {
				$("#ddlErrorMessage").text(message);
				$("#ddlSuccessMessage").text("");
			}
			else {
				$("#ddlErrorMessage").text("");
				$("#ddlSuccessMessage").text("Table '" + tableName + "' dropped");

//				var id = fileName + "\\" + tableName;
				navigation.removeNode("TABLE_LIST", tableName);
				
				$("#tableName option:selected").remove();
				
			}
			console.log("Success");
		},
		error: function(err, status) {
			errorDialog("Drop Constraint", err);
			console.log("error" + status);
		}
	});

}



