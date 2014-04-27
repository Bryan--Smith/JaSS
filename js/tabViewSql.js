
$(function() {


		
});

var viewSql = {};

viewSql.loadTab = function(tableName, fileName) {
	$.ajax({
		type: "GET",
		url: "action/tableViewSql.asp", 
		data: {'tableName': tableName, 'fileName':fileName},
		dataType: "json",
		cache: false,
		success: function(msg) {
			var tableDetail = new Array();
			var viewDefinition = msg.viewDefinition;
			
			$('#viewSql').text(viewDefinition);

		},
		error: function(err, status) {
			console.log("error" + status);
		}
	});
}










