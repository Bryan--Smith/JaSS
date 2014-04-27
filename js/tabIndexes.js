
$(function() {

	$( "#indexesTable").hide();
	$( "#indexesTable").handsontable({
		colHeaders: ['', 'Index Name', 'Column Name', 'Unique'],
		startCols: 4,
			columns: [
				{readOnly: true},
				{readOnly: true},
				{readOnly: true}
			]		
	});	
		
});

var indexes = {};

indexes.loadTab = function(tableName, fileName) {
	$.ajax({
		type: "GET",
		url: "action/tableIndexes.asp", 
		data: {'tableName': tableName, 'fileName':fileName},
		dataType: "json",
		cache: false,
		success: function(msg) {
			var tableDetail = new Array();
			var indexeArray = msg.indexes
			var nrIndexes = indexeArray.length;
			for (var i=0; i< nrIndexes; i++) {
				var index = indexeArray[i];
				

				
				var indexDetail = new Array();
				if (index.isPrimaryKey) {
					indexDetail[0] = "PK";
				}
				indexDetail[1] = index.indexName;
				indexDetail[2] = index.columnName;
				
				if (index.unique != null) {
					indexDetail[3] = "UNIQUE";
				}

				

				
				tableDetail.push(indexDetail);
			}
			
			$( "#indexesTable").show();
			$( "#indexesTable").handsontable('loadData', tableDetail);
		},
		error: function(err, status) {
			errorDialog("Index - Load Tab", err);
			console.log("error" + status);
		}
	});
}

indexes.createIndex = function(fileName, tableName, indexName, unique, columnNames, sortOrder) {
	$.ajax({
		type: "POST",
		url: "action/createIndex.asp", 
		data: {'fileName': fileName, 'tableName':tableName, 'indexName':indexName, 'unique': unique, 'columnNames':columnNames, 'sortOrder':sortOrder},
		dataType: "json",
		cache: false,
		success: function(msg) {
			var status = msg.status
			var message = msg.errorMessage
			
			if (status == "ERROR") {
				$("#ddlErrorMessage").text(message);
				$('#ddlSuccessMessage').text('');
			}
			else {
				$("#ddlErrorMessage").text("");
				$('#ddlSuccessMessage').text('Index ' + indexName + ' added to table ' + tableName);
				indexes.loadTab(tableName, fileName);				
			}
			console.log("Success");
		},
		error: function(err, status) {
			errorDialog("Create Index", err);
			console.log("error" + status);
		}
	});
}


indexes.dropIndex = function(tableName, fileName, indexName) {
	$.ajax({
		type: "POST",
		url: "action/dropIndex.asp", 
		data: {'tableName': tableName, 'fileName':fileName, 'indexName': indexName},
		dataType: "json",
		cache: false,
		success: function(msg) {
			var status = msg.status
			var message = msg.errorMessage
			
			if (status == "ERROR") {
				$('#ddlErrorMessage').text(message);
				$('#ddlSuccessMessage').text('');
			}
			else {
				$("#ddlErrorMessage").text("");
				$('#ddlSuccessMessage').text('Index ' + indexName + ' dropped from table ' + tableName);
				$('#indexName option:selected').remove();
				$('#indexName').val("");
				$('#indexName').addClass("jassError");
				enableDisablePopupSubmit();				
				indexes.loadTab(tableName, fileName);				
			}
		},
		error: function(err, status) {
			errorDialog("Drop Index", err);
			console.log("error" + status);
		}
	});
}



indexes.createIndexDialog = function() {
	$('#tabs').tabs("option", "active", INDEXES);
	var fileName = "html/createIndexDialog.html";
	var html = getHtml(fileName);
	$('#popup').html(html);
	
	$( "#popup" ).dialog( "open" );
	$( "#popup" ).dialog( "option", "title", "Add index to '" + navigation.getDatabaseObjectName() + "' table");
	$( "#popup" ).dialog( "option", "width", 350);
	$( "#popup" ).dialog( "option", "buttons",
			[{text: "Create Index",
			  id: "submit",
              click: function()	{
					console.log("createColumnOK");
					var tableName = navigation.getDatabaseObjectName();
					var fileName = navigation.getDatabaseFileName();
					var indexName = $('#indexName').val();
					var unique = $('#unique').prop('checked')
								
					
					var columnNameList = "";
					var sortOrderList = "";
					
					$('.dialogTableRow').each( function(index, element) {
						var $dialogTableRow = $(this);
						var name = $dialogTableRow.find('.columnName').val();
						var rbGroupName = $dialogTableRow.find('.sortOrder').prop('name');
						var order = $dialogTableRow.find('[name="' + rbGroupName + '"]:checked').val();
						
						if (index>0) {
							columnNameList += ',';;
							sortOrderList += ',';
						}
						columnNameList += name;
						sortOrderList += order;
						console.log( $(this).val() + " - " + order);
					});

					indexes.createIndex(fileName, tableName, indexName, unique, columnNameList, sortOrderList);
				}},
			{text: "Close",
			 click: function() {
					console.log("createColumnCancel-");
					$( "#popup" ).dialog( "close" );
					$('#popup').html("");	 
				}}]);	
	
	// Create the 1st row
	var index = 1;
	$('.dialogTableHeading').after( indexes.getCreateIndexColumnRow(index++) );
	
	// Click handle for New Column button
	$('#addTableColumn').click( function() {
		var $row = indexes.getCreateIndexColumnRow(index++);
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

indexes.getCreateIndexColumnRow = function(columnIndex) {
	var $rowHtml = $(getHtml("html/createIndexRow.html"));
	$rowHtml.find('.columnDelete').hide();

	$rowHtml.find('.columnName').append('<option value="" selected>-- Choose Column --</option>');
	var columnNames = columns.getColumnNames();
	for (var i=0; i<columnNames.length; i++) {
		$rowHtml.find('.columnName').append('<option value="' + columnNames[i] + '">' + columnNames[i] + '</option>');
	}
	
	$rowHtml.find('.sortOrder').prop("name", "sortOrder" + columnIndex);
	
	// Event handler for delete button
	$rowHtml.find('.columnDelete').click(function() {
		console.log("Delete row clicked");
		$(this).parent().parent().remove();
		
		// Hide delete button if only one row remains
		var nrRows = $('.dialogTable').find('.dialogTableRow').length;
		if (nrRows == 1) {
			$('.dialogTableRow').find('.columnDelete').hide();
		}
		
		enableDisablePopupSubmit();
	});
	
	return $rowHtml;
}



indexes.getIndexNames = function() {
	return $( "#indexesTable").handsontable("getDataAtCol", 1);
}

indexes.dropIndexDialog = function () {
	$('#tabs').tabs("option", "active", INDEXES);
	
	var fileName = "html/dropIndexDialog.html";
	var html = getHtml(fileName);
	$('#popup').html(html);
	
	$( "#popup" ).dialog( "open" );
	$( "#popup" ).dialog( "option", "title", "Drop Index from '" + navigation.getDatabaseObjectName() + "' table");
	$( "#popup" ).dialog( "option", "width", 350);
	$( "#popup" ).dialog( "option", "buttons",
			[{text: "Drop Index",
			  id: "submit",
              click: function()	{
					var indexToDelete = $('#indexName').val();
					if (confirm("Do you wish to drop '" + indexToDelete + "' index?")) {
						var tableName = navigation.getDatabaseObjectName();
						var fileName = navigation.getDatabaseFileName();
						indexes.dropIndex(tableName, fileName, indexToDelete)
					}
				}},
			{text: "Close",
			 click: function() {
				console.log("dropIndexesCancel-");
				$( "#popup" ).dialog( "close" );
				$('#popup').html("");		 
				}}]);	
	
	var indexNames = indexes.getIndexNames();
	
	$('#indexName').append("<option value=''>-- Choose index --</option>");
	$.each(indexNames, function(index, value) {
		$('#indexName').append("<option value='" + value + "'>" + value + "</option>");
	});
	
	addValidationHandlers();
}





