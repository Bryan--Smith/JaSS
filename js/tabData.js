
$(function() {

	$( ".handsontable", "#tabs-data").hide();
	$( ".handsontable", "#tabs-data").handsontable({
		startCols: 1,
	});	
		
});


function truncate50Renderer(instance, td, row, col, prop, value, cellProperties) {
	if (value != null) {
	if (typeof value == "string") {
			value = value.replace(/\n/g, " ");
			if (value.length > 50) {
				value = value.substr(0, 50) + " ...";
			}
		}
	}
  Handsontable.renderers.TextRenderer.apply(this, arguments);

}


$(function() {

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
	
	$('.submit').click ( function() {
		dataTab.loadTab(navigation.getDatabaseObjectName(), navigation.getDatabaseFileName(), $(".pageSize", "#tabs-data").val(), 1, $('.sortColumn').val(), $('.sortAscDesc:checked').val(), $('.columnFilter').val());
	});	
	
	$('.paging', "#tabs-data").click ( function() {
		dataTab.loadTab(navigation.getDatabaseObjectName(), navigation.getDatabaseFileName(), $(".pageSize", "#tabs-data").val(), $(this).data('page'), $('.sortColumn').val(), $('.sortAscDesc:checked').val(), $('.columnFilter').val());
	});
	
	$( ".spinner", "#tabs-data" ).on( "spin", function( event, ui ) {
		var value = ui.value;
		setTimeout(function() {
			if (value == $( ".spinner", "#tabs-data" ).spinner('value')) {
				dataTab.loadTab(navigation.getDatabaseObjectName(), navigation.getDatabaseFileName(), $(".pageSize", "#tabs-data").val(), value, $('.sortColumn').val(), $('.sortAscDesc:checked').val(), $('.columnFilter').val());
			}
		}, 500);
	});

	$(".pageSize", "#tabs-data").change(function() {
		dataTab.loadTab(navigation.getDatabaseObjectName(), navigation.getDatabaseFileName(), $(".pageSize", "#tabs-data").val(), 1, $('.sortColumn').val(), $('.sortAscDesc:checked').val(), $('.columnFilter').val());
	});

/*	
	$(".pageNumber", "#tabs-data").change(function() {
		loadDataTab(getDatabaseObjectName(), getDatabaseFileName(), $(".pageSize", "#tabs-data").val(), $(".pageNumber", "#tabs-data").val());
	});
	
*/

});

var dataTab = {};

dataTab.populateSortColumnSelect = function(columnNames) {
	var $sortColumn = $('.sortColumn');
	
	$sortColumn.empty();
	for (var i=0; i<columnNames.length; i++) {
		$sortColumn.append("<option value='" + columnNames[i] + "'>" + columnNames[i] + "</option>");
	}
}

dataTab.setTableHeightWidth = function() {
	var dataFilterHeight = $('.dataFilterPanel').outerHeight();
	var dataNavigationHeight = $('#dataNavigationPanel').outerHeight();
	var htHeight = $('#tabs-data').innerHeight()  - dataFilterHeight - dataNavigationHeight - 45;
	var htWidth = $('#tabs-data').innerWidth() - 25;
	
	console.log("dataFilterHeight:" + dataFilterHeight + " dataNavigationHeight:" +  dataNavigationHeight + " htWidth:" + htWidth);
	var ht = $(".handsontable", "#tabs-data").handsontable('getInstance');
	ht.updateSettings({height: htHeight, width: htWidth});	
}

//dataTab.renderTable = function() {
//
//	dataTab.setTableHeightWidth();
//	
//	var ht = $('#tabs-data').handsontable('getInstance');
//	ht.render();
//}

dataTab.loadTab = function (tableName, fileName, pageSize, absolutePage, sortColumn, sortAscDesc, columnFilter) {
	$('#dataTableLoading').addClass("dataLoading");
	$( ".handsontable", "#tabs-data" ).hide();
	console.log("pageSize:" + pageSize);
	$.ajax({
		type: "GET",
		url: "action/tableData.asp", 
		data: {'tableName': tableName, 'fileName':fileName, 'pageSize':pageSize, 'absolutePage': absolutePage, 'sortColumn': sortColumn, 'sortAscDesc': sortAscDesc, 'columnFilter' : columnFilter},
		dataType: "json",
		cache: false,
		success: function(msg) {
			var columnHeadings = msg.columnHeadings
			var data = msg.data;
			var pageCount = msg.pageCount;
			var absolutePage = msg.absolutePage;
			var recordCount = msg.recordCount;
			var pageSize = msg.pageSize;
			var databaseColumnNames = msg.databaseColumnNames;
			var sortColumn = msg.sortColumn;
			var sortAscDesc = msg.sortAscDesc;
			var columnFilter = msg.columnFilter;
			var status = msg.status;
			var errorMessage = msg.errorMessage;
			
			if (databaseColumnNames != null && databaseColumnNames.length > 0) {
				dataTab.populateSortColumnSelect(databaseColumnNames);
			}
			$('.sortColumn').val(sortColumn);
			$('.sortAscDesc').filter('[value=' + sortAscDesc + ']').attr('checked', true);
			$('.columnFilter').val(columnFilter);
			
			if (status == "OK") {
				$('.dataResultSet').show();
				$('#dataSqlError').hide();
			
				if (recordCount > 0) {
					var startRecord = pageSize * (absolutePage - 1) + 1;
					var endRecord = startRecord + pageSize - 1;
				}
				else {
					var startRecord = 0;	// No rows returned
					var endRecord = 0;			
				}
				endRecord = (endRecord > recordCount) ? recordCount : endRecord

				$('#dataTableLoading').removeClass("dataLoading")
				dataTab.setTableHeightWidth();
				$( ".handsontable", "#tabs-data" ).show();
				$( ".handsontable", "#tabs-data" ).handsontable('updateSettings', {
					colHeaders: columnHeadings,
					renderer: truncate50Renderer
				});
				$( ".handsontable", "#tabs-data" ).handsontable('loadData', data);
				
				
				// Set up the Prev and Next buttons
				
				$( ".start", "#tabs-data" ).data("page", 1);
				$( ".prev", "#tabs-data" ).data("page", ((absolutePage==1) ? 1: absolutePage-1));
				
				$( ".spinner", "#tabs-data" ).spinner("option", "min", 1);
				$( ".spinner", "#tabs-data" ).spinner("value", absolutePage);
				$( ".spinner", "#tabs-data" ).spinner("option", "max", pageCount);
				
				$( ".next", "#tabs-data" ).data("page", ((absolutePage == pageCount) ? pageCount : absolutePage+1));
				$( ".end", "#tabs-data" ).data("page", pageCount);
				
				$( ".recordDetails", "#tabs-data" ).text("Records: " + startRecord + " - " + endRecord + " of " + recordCount);
			}
			else if (status == "ERROR") {
				$('.dataResultSet').hide();
				$('#dataSqlError').show().text(errorMessage);			
			}

		},
		error: function(err, status) {
			errorDialog("Constraints loadTab", err);
			console.log("error" + status);
		}
	});
}
