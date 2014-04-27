
$(function() {
		var tabInnerHeight = $('#tabs-columns').innerHeight();
		
		$( "#columnsTable").hide();
		$( "#columnsTable").handsontable({
			colHeaders: ['', 'Name', 'Type', 'Width', 'Not Null'],
			startRows: 0,
			startCols: 5,
			height: tabInnerHeight,
			columns: [
				{readOnly: true},
				{readOnly: true},
				{readOnly: true},
				{readOnly: true},
				{readOnly: true}
			]
		});



	 $( "#popup" ).dialog({
		autoOpen: false,
		height: "auto",
		width: 350,
		modal: true,
	});		







});

var columns = {}

// Create Column Dialog

columns.createColumnDialog = function () {
	$('#tabs').tabs("option", "active", COLUMNS);
	
	var fileName = "html/createColumnDialog.html";
	var html = getHtml(fileName);
	$('#popup').html(html);
	var $select = $('#popup').find('#columnType');
	$select.append("<option value='' selected>-- Choose Column Type --</option>");
	var columnTypes = columns.columnTypeList();
	for (var i=0; i<columnTypes.length; i++) {
		$select.append("<option value='" + columnTypes[i].value + "'>" + columnTypes[i].text + "</option>");
	}
//	$select.prop("selectedIndex",1);
	
	$( "#popup" ).dialog( "open" );
	$( "#popup" ).dialog( "option", "title", "Add column to '" + navigation.getDatabaseObjectName() + "' table");
	$( "#popup" ).dialog( "option", "width", 450);
	$( "#popup" ).dialog( "option", "buttons",
			[{text: "Add Column",
			  id: "submit",
              click: function()	{
					console.log("createColumnOK");
					var tableName = navigation.getDatabaseObjectName();
					var fileName = navigation.getDatabaseFileName();
					var columnName = $("#columnName").val();
					var columnType = $("#columnType").val();
					var length = $("#columnLength").val();
					var precision = $("#columnPreceision").val();
					var scale = $("#columnScale").val();
					var notNull = $("#notNull").prop('checked')
					
					console.log("not null:" + notNull);

					columns.addColumn(tableName, fileName, columnName, columnType, length, precision, scale, notNull);
				}},
			{text: "Close",
			 click: function() {
					$( "#popup" ).dialog( "close" );
					$('#popup').html("");		 
				}}]);
				
	$( "#columnName" ).val("");
	// $( "#columnName" ).on("change keyup", function() {
		// validateJetNameField( $(this) );
	// });
	
	// $( "#columnType" ).on("change keyup", function() {
		// validateSelect( $(this) );
	// });	

	$( "#columnLength" ).val("10");
	$( "#columnPreceision" ).val("0");
	$( "#columnScale" ).val("0");
	$( "#decimalParam").hide();
	$( "#varcharParam").hide();
	
	

	$("#columnType").change(function() {
		var columnType = $(this).val();
		if (columnType == "decimal") {
			$("#decimalParam").show();
			$("#varcharParam").hide();
		}
		else if (columnType == "varchar" || columnType == "char") {
			$("#decimalParam").hide();
			$("#varcharParam").show();		
		}
		else {
			$("#decimalParam").hide();
			$("#varcharParam").hide();		
		}
	});

	addValidationHandlers( );
}

//columns.redraw = function() {
//
//	columns.setTableHeightWidth();
//	
//	var ht = $('#columnsTable').handsontable('getInstance');
//	ht.render();
//}

columns.setTableHeightWidth = function() {
	var htHeight = $('#tabs-columns').innerHeight() - 45;
	var htWidth = $('#tabs-columns').innerWidth() - 65;
	
	console.log("columnsHeight:" + htHeight + " htWidth:" + htWidth);
	var ht = $('#columnsTable').handsontable('getInstance');
	ht.updateSettings({height: htHeight, width: htWidth});	
}


// Drop column dialog

columns.dropColumnDialog = function() {
	$('#tabs').tabs("option", "active", COLUMNS);
	
	var fileName = "html/dropColumnDialog.html";
	var html = getHtml(fileName);
	$('#popup').html(html);
	
	$( "#popup" ).dialog( "open" );
	$( "#popup" ).dialog( "option", "title", "Drop Column from '" + navigation.getDatabaseObjectName() + "' table");
	$( "#popup" ).dialog( "option", "width", 350);
	$( "#popup" ).dialog( "option", "buttons",
			[{text: "Drop Column",
			  id: "submit",
              click: function()	{
					var columnToDelete = $('#columnName').val();
					if (confirm("Do you wish to drop '" + columnToDelete + "' column?")) {
						var tableName = navigation.getDatabaseObjectName();
						var fileName = navigation.getDatabaseFileName();
						columns.dropColumns(tableName, fileName, columnToDelete)
					}
				}},
			{text: "Close",
			 click: function() {
				console.log("dropColumnCancel-");
				$( "#popup" ).dialog( "close" );
				$('#popup').html("");		 
				}}]);	
	
	var columnNames = columns.getColumnNames();
	
	$('#columnName').append("<option value='' selected>-- Choose column --</option>");
	$.each(columnNames, function(index, value) {
		$('#columnName').append("<option value='" + value + "'>" + value + "</option>");
	});
	
	addValidationHandlers( );
}


columns.getColumnNames = function () {
	return $( "#columnsTable").handsontable("getDataAtCol", 1);
}

columns.columnTypeList = function () {

	return	[{value:"byte", text:"byte (1 byte)"},
	         {value:"short", text:"short (2 bytes)"},
			 {value:"integer", text:"integer (4 bytes)"},
			 {value:"counter", text:"counter (4 bytes auto-increment)"},
			 {value:"single", text:"single (4 bytes)"},
			 {value:"double", text:"double (8 bytes)"},
			 {value:"currency", text:"currency (8 bytes)"},
			 {value:"decimal", text:"decimal (17 bytes)"},
			 {value:"yesno", text:"yesno"},
			 {value:"datetime", text:"datetime"},
			 {value:"varchar", text:"varchar (&lt; 255 characters)"},
			 {value:"char", text:"char (&lt; 255 characters)"},
			 {value:"longchar", text:"longchar (&lt; 2 GB)"},
			 {value:"binary", text:"binary (&lt; 510 bytes)"},
			 {value:"longbinary", text:"longbinary (&lt; 2 GB)"}];
}

function getHtml(fileName) {
	var fileContents = null;
	$.ajax({
		type: "GET",
		url: "action/getHtml.asp", 
		data: {'htmlFileName': fileName},
		async: false,
		success: function(msg) {
			fileContents = msg
		},
		error: function(err, status) {
			errorDialog("getHtml", err);
			console.log("error" + status);
		}
	});

	return fileContents;
}

columns.loadTab = function(tableName, fileName) {
	$.ajax({
		type: "GET",
		url: "action/tableColumns.asp", 
		data: {'tableName': tableName, 'fileName':fileName},
		dataType: "json",
		cache: false,
		success: function(msg) {
			var tableDetail = new Array();
			var columnsArray = msg.columns
			var nrColumns = columnsArray.length;
			for (var i=0; i< nrColumns; i++) {
				var column = columnsArray[i];

				
				var colDetail = new Array();

				colDetail[0] = "";
				if (column.isPrimaryKey) {
					colDetail[0] = "PK";
				}
				
				if (column.isForeignKey) {
					colDetail[0] += " FK";
				
				}
				colDetail[1] = column.columnName;
				colDetail[2] = column.typeName;
				
				if (column.characterMaximumLength != null) {
					colDetail[3] = column.characterMaximumLength
				}
				else if (column.numericPrecision != null) {
					colDetail[3] = column.numericPrecision;
					if (column.numericScale != null ) {
						colDetail[3] += "," + column.numericScale;
					}
				}
				
				if ( !column.isNullable) {
					colDetail[4] = "Not Null";
				}
				
				tableDetail.push(colDetail);
			}
			
			columns.setTableHeightWidth();
			
			$('#columnsTable').show();			
			$('#columnsTable').handsontable('loadData', tableDetail);

		},
		error: function(err, status) {
			errorDialog("columns.loadTab", err);
			console.log("error" + status);
		}
	});

}

columns.addColumn = function (tableName, fileName, columnName, columnType, length, precision, scale, notNull) {
	$.ajax({
		type: "POST",
		url: "action/addColumn.asp", 
		data: {'tableName': tableName, 'fileName':fileName, 'columnName':columnName, 'columnType': columnType, 'length':length, 'precision':precision, 'scale': scale, 'notNull': notNull},
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
				$('#ddlSuccessMessage').text('Column ' + columnName + " added to table " + tableName);
				columns.loadTab(tableName, fileName);				
			}
			console.log("Success");
		},
		error: function(err, status) {
			errorDialog("addColumn", err);
			console.log("error" + status);
		}
	});
}


columns.dropColumns = function (tableName, fileName, columnNames) {
	$.ajax({
		type: "POST",
		url: "action/dropColumns.asp", 
		data: {'tableName': tableName, 'fileName':fileName, 'columnNames': columnNames},
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
				$('#ddlSuccessMessage').text("Column '" + columnNames + "' dropped from table '" + tableName + "'");
				$('#columnName option:selected').remove();
				$('#columnName').val("");
				$('#columnName').addClass("jassError");				
				enableDisablePopupSubmit();
				columns.loadTab(tableName, fileName);				
			}
		},
		error: function(err, status) {
			errorDialog("drop Columns", err);
			console.log("error:" + status);
		}
	});
}

