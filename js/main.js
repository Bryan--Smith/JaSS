
var fileName = 'C:\\Users\\Bryan\\spanweb\\db\\web_requests1.mdb';

$(function() {

	
	loadTablesList(fileName);
	loadViewsList(fileName);
	
	$("#tables").change(function() {
		var tableName = $(this).val();
		columns.loadTab(tableName, fileName);
		indexes.loadTab(tableName, fileName);
		constraints.loadTab(tableName, fileName);
		dataTab.loadTab(tableName, fileName, $(".pageSize", "#tabs-data").val(), 1, "", "", "");
	});
	



	
	
	$(".number").keypress(function (e) {
     //if the letter is not digit then display error and don't type anything
		if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
			return false;
		}
	});





});

function loadTablesList(fileName) {
	$.ajax({
		type: "GET",
		url: "tableNames.asp", 
		data: {'type':'TABLE', 'fileName':fileName},
		dataType: "json",
		cache: false,
		success: function(msg) {
			$("#tables").empty()
			$.each( msg.listOfNames, function(index, name) {
				$('#tables').append('<option value="' + name + '">' + name +'</option>');
			});
			console.log("success");
		},
		error: function(err, status) {
			console.log("error" + status);
		}
	});
}

function loadViewsList(fileName) {
	$.ajax({
		type: "GET",
		url: "tableNames.asp", 
		data: {'type':'VIEW', 'fileName':fileName},
		dataType: "json",
		cache: false,
		success: function(msg) {
			$("#views").empty()
			$.each( msg.listOfNames, function(index, name) {
				$('#vs').append('<option value="' + name + '">' + name +'</option>');
			});
			console.log("success");
		},
		error: function(err, status) {
			console.log("error" + status);
		}
	});
}







