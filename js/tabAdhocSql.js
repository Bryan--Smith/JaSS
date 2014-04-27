
$(function() {
	$( ".queryResultSet", "#tabs-adhocSql").hide();
	$( ".handsontable", "#tabs-adhocSql").handsontable({
		startCols: 1,
	});	
		
});

$(function() {


	$('#adhocSqlText').resize( function() {
		adhocSqlTab.setTableHeightWidth();
	
	});

	 $( ".start").button({
		text: false,
		icons: {
			primary: "ui-icon-seek-start"
		}
	});
	
	$( ".prev" ).button({
		text: false,
		icons: {
			primary: "ui-icon-seek-prev"
		}
	});
	
	$( ".spinner").spinner();
	
	$( ".next" ).button({
		text: false,
		icons: {
			primary: "ui-icon-seek-next"
		}
	});
	
	$( ".end" ).button({
		text: false,
		icons: {
			primary: "ui-icon-seek-end"
		}
	});	
	
	$('.paging', "#tabs-adhocSql").click ( function() {
		runAdhocSql(navigation.getDatabaseFileName(), $("#adhocSqlText").val(), $(".pageSize", "#tabs-adhocSql").val(), $(this).data('page'));
	});
	
	$( ".spinner", "#tabs-adhocSql" ).on( "spin", function( event, ui ) {
		console.log("on spinner");
		var value = ui.value;
		setTimeout(function() {
			console.log("on spinner - timeout : value:" + value);
			if (value == $( ".spinner", "#tabs-adhocSql" ).spinner('value')) {
				console.log("calling runAdhocSql");
				runAdhocSql(navigation.getDatabaseFileName(), $("#adhocSqlText").val(), $(".pageSize", "#tabs-adhocSql").val(), value);
			}
		}, 500);
	});	

	$(".pageSize", "#tabs-adhocSql").change(function() {
		runAdhocSql(navigation.getDatabaseFileName(), $("#adhocSqlText").val(), $(".pageSize", "#tabs-adhocSql").val(), 1);
	});
	
	$(".pageNumber", "#tabs-adhocSql").change(function() {
		runAdhocSql(navigation.getDatabaseFileName(), $("#adhocSqlText").val(), $(".pageSize", "#tabs-adhocSql").val(), $(".pageNumber", "#tabs-adhocSql").val());
	});	
	
	$("#adhocSqlSubmit").click(function() {
		var sql = $("#adhocSqlText").val();
		var pageSize = $(".pageSize", "#tabs-adhocSql").val();
		var absolutePage = 1;
		runAdhocSql(navigation.getDatabaseFileName(), sql, pageSize, absolutePage);
	});	

});

var adhocSqlTab = {}

adhocSqlTab.setTableHeightWidth = function() {
	var adhocQueryHeight = $('.adhocQueryPanel').outerHeight();
	var adhocNavigationHeight = $('.adhocNavigationPanel').outerHeight();
	var htHeight = $('#tabs-adhocSql').innerHeight()  - adhocQueryHeight - adhocNavigationHeight - 80;
	var htWidth = $('#tabs-adhocSql').innerWidth() - 45;
	
	console.log("adhocQueryHeight:" + adhocQueryHeight + " adhocNavigationHeight:" +  adhocNavigationHeight + " htWidth:" + htWidth);
	var ht = $( ".handsontable", "#tabs-adhocSql" ).handsontable('getInstance');
	ht.updateSettings({height: htHeight, width: htWidth});	
}

function runAdhocSql(fileName, sql, pageSize, absolutePage)  {
	$( ".queryResultSet", "#tabs-adhocSql").hide();
	$.ajax({
		type: "POST",
		url: "action/adhocSql.asp", 
		data: {'fileName':fileName, 'sql': sql, 'pageSize':pageSize, 'absolutePage': absolutePage},
		dataType: "json",
		cache: false,
		success: function(msg) {
			var status = msg.status
			var resultType = msg.resultType;
			if (status == "ERROR") {
//			        adhocSqlMessage
				$("#adhocSqlMessage").hide();
				$("#adhocSqlError").show().text(msg.errorMessage);
			}
			else if (resultType == "COMMAND") {
				$("#adhocSqlMessage").show().text("Command sucessfully executed");
				$("#adhocSqlError").hide();
			
			}
			else {
				$("#adhocSqlMessage").hide();
				$("#adhocSqlError").hide();
				$(".queryResultSet", "#tabs-adhocSql").show();
				
			var columnHeadings = msg.columnHeadings
			var data = msg.data;
			var pageCount = msg.pageCount;
			var absolutePage = msg.absolutePage;
			var recordCount = msg.recordCount;
			var pageSize = msg.pageSize;
			
			if (recordCount > 0) {
				var startRecord = pageSize * (absolutePage - 1) + 1;
				var endRecord = startRecord + pageSize - 1;
			}
			else {
				var startRecord = 0;	// No rows returned
				var endRecord = 0;			
			}
			endRecord = (endRecord > recordCount) ? recordCount : endRecord

			$( ".handsontable", "#tabs-adhocSql" ).handsontable('updateSettings', {
				colHeaders: columnHeadings
			});
			
			adhocSqlTab.setTableHeightWidth();
			$( ".handsontable", "#tabs-adhocSql" ).handsontable('loadData', data);
			
			$( ".start", "#tabs-adhocSql" ).data("page", 1);
			$( ".prev", "#tabs-adhocSql" ).data("page", ((absolutePage==1) ? 1: absolutePage-1));
			
			$( ".spinner", "#tabs-adhocSql" ).spinner("option", "min", 1);
			$( ".spinner", "#tabs-adhocSql" ).spinner("value", absolutePage);
			$( ".spinner", "#tabs-adhocSql" ).spinner("option", "max", pageCount);
			
			$( ".next", "#tabs-adhocSql" ).data("page", ((absolutePage == pageCount) ? pageCount : absolutePage+1));
			$( ".end", "#tabs-adhocSql" ).data("page", pageCount);
			
			$( ".recordDetails", "#tabs-adhocSql" ).text("Records: " + startRecord + " - " + endRecord + " of " + recordCount);				

/*			
				var resultType = msg.resultType;
				
				var columnHeadings = msg.columnHeadings
				var data = msg.data;
				var pageCount = msg.pageCount;
				var absolutePage = msg.absolutePage;

				$( ".handsontable", "#tabs-adhocSql").handsontable('updateSettings', {
					colHeaders: columnHeadings
				});
				$( ".handsontable", "#tabs-adhocSql").handsontable('loadData', data);
				
				$(".pageCount", "#tabs-adhocSql").html(pageCount);
				
				$(".pageNumber", "#tabs-adhocSql").empty();

				for (var i=1; i<=pageCount; i++) {
					$(".pageNumber", "#tabs-adhocSql").append( "<option value='" + i + "'" + ((i==absolutePage) ? "selected" : "") + ">" + i + "</option>")
				}
*/
			}
		},
		error: function(err, status) {
			console.log("error" + status);
		}
	});

}