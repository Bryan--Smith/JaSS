


function createDatabaseDialog() {



	var dialogHtml = getHtml("html/createDatabaseDialog.html");
	$('#popup').html(dialogHtml);
	

	
	$( "#popup" ).dialog( "open" );
	$( "#popup" ).dialog( "option", "title", "Create Database: "  );
	$( "#popup" ).dialog( "option", "width", 350 );
	$( "#popup" ).dialog( "option", "buttons",
			[{text: "Create Database",
              click: function()	{
					console.log("createTableOK");
					
					var directoryName = navigation.getDatabaseDirectoryName();
					var databaseName = $('#databaseName').val();
					

					
					createDatabase(directoryName, databaseName + ".mdb");
				}},
				
			{text: "Close",
			 click: function() {

					$( "#popup" ).dialog( "close" );
					$('#popup').html("");	 
				}}]);
}	

function createDatabase(dirName, fileName) {
	var databasePath = dirName + "\\" + fileName;
	console.log('createDatabase:' + databasePath);
	
	$.ajax({
		type: "POST",
		url: "action/createDatabase.asp", 
		data: {'fileName':databasePath},
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
				$("#ddlSuccessMessage").text("Database '" + fileName + "' created");

			
				
				var newNode = {};
				
				newNode.label = fileName;
				newNode.fileName = databasePath;
				newNode.dbType = "jetDatabase";
				newNode.load_on_demand = "true";

				navigation.addChildNode("DIRNAME", newNode);
				
				navigation.selectNode("DIRNAME", newNode);

				
				$('#tabs').tabs("option", "disabled", [ 0, 1, 2, 3, 4 ]);
				
/*				
				var fileName = navigation.getDatabaseFileName();
				var tableName = parameters.tableName;
				columns.loadTab(tableName, fileName);
				indexes.loadTab(tableName, fileName);
				constraints.loadTab(tableName, fileName);
				dataTab.loadTab(tableName, fileName, $(".pageSize", "#tabs-data").val(), 1);					
*/				
				
				
			}
			console.log("Success");
		},
		error: function(err, status) {
			errorDialog("create Database", err);
			console.log("error" + status);
		}
	});	
	
}			