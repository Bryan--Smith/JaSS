

$(function() {





	 $( "#error" ).dialog({
		autoOpen: false,
		height: "auto",
		width: 450,
		modal: true,
	});		







});



function errorDialog(action, error) {

	var fileName = "html/errorDialog.html";
	var html = getHtml(fileName);
	$('#error').html(html);
	$('#error').find("#errorStatus").text(error.status);
	$('#error').find("#errorStatusText").text(error.statusText);
	$('#error').find("#errorResponseText").html(error.responseText);
	
	
	$( "#error" ).dialog( "open" );
	$( "#error" ).dialog( "option", "title", "Error calling '" + action + "'");
	$( "#error" ).dialog( "option", "buttons",
			[{text: "Close",
			 click: function() {
				$("#error" ).dialog( "close" );
				$('#error').html("");		 
				}}]);		
}