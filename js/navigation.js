
var navigation = {}

navigation.getJetMenu = function () {
	var jetMenu = null;
	$.ajax({
		type: "POST",
		url: "action/getJetDatabaseList.asp", 
		dataType: "json",
		cache: false,
		async: false,
		success: function(msg) {
			jetMenu = msg.jetMenu;

		},
		error: function(err, status) {
			errorDialog("Drop Constraint", err);
			console.log("error" + status);
		}
	});
	
	return jetMenu
}



navigation.addChildNode  = function (parentType, newNode) {
	var parentNode = navigation.getNode(parentType);
	
	if (parentNode != null) {
		var childNodes = parentNode.children;
		if (childNodes.length > 0) {
			for (var i=0; i<childNodes.length; i++) {
				if (childNodes[i].name > newNode.label) {
					$('#tree1').tree('addNodeBefore', newNode , childNodes[i]); 
					return;
				}
			}
			$('#tree1').tree('addNodeAfter', newNode , childNodes[i-1]);  // {}
		}
		else {
			var nodeList = [];
			nodeList[0] = newNode;
			$('#tree1').tree('loadData', nodeList, parentNode); // [ {}  ]
		}
	}
}

navigation.getTableNames = function() {
	var tableNames = []
	var parentNode = navigation.getNode("TABLE_LIST");	
	if (parentNode != null) {
		var childNodes = parentNode.children;
		for (var i=0; i<childNodes.length; i++) {
			tableNames[i] = childNodes[i].name;
		}
	}

	return tableNames;
}

navigation.selectNode = function (parentType, name) {
	
	
	var node = navigation.getNodeByParentAndName(parentType, name);
	if (node != null) {
		var $tree = $('#tree1');
		$tree.tree('selectNode', node);
	}
}

navigation.getNodeByParentAndName = function(parentType, childName) {
	var $tree = $('#tree1');
	var parentNode = navigation.getNode(parentType);
	if (parentNode != null) {
		var childNodes = parentNode.children;
		for (var i=0; i<childNodes.length; i++) {
			if (childNodes[i].name == childName) {
				return childNodes[i];
			}
		}
	}

	return null;
}

navigation.getDatabaseTableNames = function() {
	var databaseTableNames = [];
	
	var parentNode = navigation.getNode("TABLE_LIST");
	if (parentNode != null) {
		var childNodes = parentNode.children;
		for (var i=0; i<childNodes.length; i++) {
			databaseTableNames.push( childNodes[i].name );
		}
	}

	return databaseTableNames;
}



navigation.removeNode = function(parentType, childName) {
	var $tree = $('#tree1');
	var node = navigation.getNodeByParentAndName(parentType, childName);
	$('#tree1').tree('removeNode', node);

}



navigation.getDatabaseObjectName = function() {
	var node = $('#tree1').tree('getSelectedNode');
	return node.objectName;
}

// DIRNAME, jetDatabase, TABLE_LIST, VIEW_LIST, TABLE, VIEW

/*
{
	"label": dirName,
	"dbType": "DIRNAME",
	"children":[]
}


{
	"label": fileName,
	"fileName": dirName +  "\\"  +  fileName,
	"dbType":"jetDatabase",
	"load_on_demand": "true"
}

{
	"label": dbType,
	"dbType":  dbType + "_LIST",
	"children" : []
}


{
	"label": name,
	"objectName": name,
	"dbType": dbType
}
*/


navigation.getNode = function(type) {
	var node = $('#tree1').tree('getSelectedNode');
	while (node.dbType != type) {
		node = node.parent;
		if (node == null) {
			return null
		}		
	}
	return node;
}

navigation.getDatabaseFileName = function() {
	var node = $('#tree1').tree('getSelectedNode');
	while (node.dbType != 'jetDatabase') {
		node = node.parent;
		if (node == null) {
			return null
		}
	}
	return node.fileName;
}

navigation.getDatabaseDirectoryName = function () {
	var node = $('#tree1').tree('getSelectedNode');
	while (node.dbType != 'DIRNAME') {
		node = node.parent;
		if (node == null) {
			return null
		}
	}
	return node.name;

}


$(function() {



    $('#tree1').tree({
		data : {},
		useContextMenu : true,
		dataUrl: function(node) {
			var url = "action/getJetDatabaseDetails.asp?fileName=" + node.fileName;
			return url;
		},		
	});
	
	$('#tree1').tree('loadData', navigation.getJetMenu());


	
	// Click on the tree
	$('#tree1').bind('tree.click',  function(event) {
		var node = event.node;

		// Don't allow selected node to be deselected
        if ($('#tree1').tree('isNodeSelected', node)) {
            event.preventDefault();
        }
	
    });
	
	$('#tree1').bind('tree.select', function(event) {
		if (event.node) {  // event.node will be null if node deselected
			// node was selected
			var node = event.node;		
			var dbType = node.dbType;		// returned by getJetDatabaseDetails.asp
			if (dbType == "TABLE") {
				$('#tabs').tabs("option", "disabled", [ 3 ]);
				var fileName = navigation.getDatabaseFileName();
				var tableName = navigation.getDatabaseObjectName();
				columns.loadTab(tableName, fileName);
				indexes.loadTab(tableName, fileName);
				constraints.loadTab(tableName, fileName);
				dataTab.loadTab(tableName, fileName, $(".pageSize", "#tabs-data").val(), 1, "", "", "");
				$('#panel-columns').show();
				$('#panel-indexes').show();
				$('#panel-constraints').show();
				$('#panel-viewSql').hide();				
				$('#panel-data').show();
				$('#panel-adhocSql').show();

			}
			else if (dbType == "VIEW") {
				$('#tabs').tabs("option", "disabled", [ 1, 2 ]);
				var fileName = navigation.getDatabaseFileName();
				var tableName = navigation.getDatabaseObjectName();
				columns.loadTab(tableName, fileName);
				viewSql.loadTab(tableName, fileName);
				dataTab.loadTab(tableName, fileName, $(".pageSize", "#tabs-data").val(), 1, "", "", "");
				$('#panel-columns').show();
				$('#panel-indexes').hide();
				$('#panel-constraints').hide();
				$('#panel-viewSql').show();				
				$('#panel-data').show();
				$('#panel-adhocSql').show();
			}
			else if (dbType == "TABLE_LIST" || dbType == "VIEW_LIST" || dbType == "jetDatabase") {
				$('#tabs').tabs("option", "disabled", [ 0, 1, 2, 3, 4]);
				$('#panel-columns').hide();
				$('#panel-indexes').hide();
				$('#panel-constraints').hide();
				$('#panel-viewSql').hide();				
				$('#panel-data').hide();
				$('#panel-adhocSql').show();
			}
			
			
//			console.log('clicked:' + this + " fileName:" + getDatabaseFileName() + " object:" + getDatabaseObjectName());
		}
	});		
	
	
	$('#tree1').bind('tree.contextmenu',  function(event) {
		console.log("context menu 1");
		var node = event.node;
		$('#tree1').tree('selectNode', node);
		
		console.log("context menu 2" + node.dbType);
		if (node.dbType == "TABLE"  || node.dbType == "TABLE_LIST" || node.dbType == "DIRNAME") {

			var clickEvent = event.click_event;
			position = {
				x: clickEvent["clientX"], 
				y: clickEvent["clientY"]					
			}

			$(this).contextMenu(position)	
		}		
	});
	

	
	// The context menu
	
	$.contextMenu({
		selector: '#tree1',
		trigger: 'none',
		build: function($tree, e) {
			var node = $tree.tree('getSelectedNode');
			var dbType = node.dbType;  // returned by getJetDatabaseDetails.asp
			console.log('contextMenu - dbType:' + dbType);
			
			if (dbType == "TABLE") {
				return tableContextMenu();
			}
			else if (dbType == "TABLE_LIST") {
				return tableListContextMenu();
			}
			else if (dbType == "DIRNAME") {
				return dirnameContextMenu();
			}			
		}
	});	
	
	function tableContextMenu() {
		console.log("tableContextMenu:");
		return {
			callback: function(key, options) {
			
				eval(key + "()");
			
				var m = "clicked: " + key + " fileName:" + navigation.getDatabaseFileName() + " object:" + navigation.getDatabaseObjectName();
				console.log(m);
			},
			items: {
				"columnItems": {
					"name": "Column ..,",
					"icon" : "blank",
					"items": {
						"columns.createColumnDialog": {"name": "Add Column", "icon" : "blank"},
						"columnSep": "---------",
						"columns.dropColumnDialog" : {"name": "Drop Column", "icon" : "blank"}
					}
				
				},
				"indexItems": {
					"name": "Index ...",
					"icon" : "blank",
					"items": {
						"indexes.createIndexDialog" : {"name" : "Add Index", "icon" : "blank"},
						"indexSep" : "---------",
						"indexes.dropIndexDialog" : {"name": "Drop Index", "icon" : "blank"}
					}
				},
				"constraintItems": {
					"name": "Constraint ...",
					"icon" : "blank",
					"items": {
						"constraints.createPrimaryKeyDialog" : {"name" : "Add Primary Key", "icon" : "blank"},
						"constraints.createForeignKeyDialog" : {"name" : "Add Foreign Key", "icon" : "blank"},
						"constraints.createUniqueKeyDialog" : {"name" : "Add Unique Key", "icon" : "blank"},
						"constraints.createCheckConstraintDialog" : {"name" : "Add Check Constraint", "icon" : "blank"},
						"constraintSep" : "---------",
						"constraints.dropConstraintDialog" : {"name" : "Drop Constraint", "icon" : "blank"}
					}
				}

			}
		};
	}
	
	
	function tableListContextMenu() {
		console.log("tableListContextMenu:");
		return {
			callback: function(key, options) {
			
				eval(key + "()");

			
				var m = "clicked: " + key + " fileName:" + navigation.getDatabaseFileName() + " object:" + navigation.getDatabaseObjectName();
				console.log(m);
			},
			items: {
				"createTableDialog": {"name": "Create Table", "icon" : "blank"},
				"columnSep": "---------",
				"dropTableDialog" : {"name": "Drop Table", "icon" : "blank"}
			}
		};
	}


	function dirnameContextMenu() {
		console.log("filenameContextMenu:");
		return {
			callback: function(key, options) {
			
				eval(key + "()");
				console.log("clicked:" + key);
			},
			items: {
				"createDatabaseDialog": {"name": "Create Database", "icon" : "blank"}
			}
		};
	}	
});