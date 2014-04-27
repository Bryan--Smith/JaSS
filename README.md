JaSS
====

jet-and-sql-server-browser


Version 0.1

This application should be installed as a an Application on Internet Information Services (IIS)
on Windows.  In order to run this application you will need to grant permissions to the "IUSR" and
"IIS_IUSRS" users/groups to the directory where this application is deployed.


This version of JaSS Database Administrator will:

  * List existing JET database (.mdb) files on the file system and create new JET databases.
  * List tables and views on a JET database and create new and drop existing tables.  
    There is currently no ability to manage views.
  * List columns on a JET database table and create new and drop existing columns.
  * List indexes on a JET database table and create new and drop existing indexes.
  * List constraints on a JET database table and create new and drop existing constraints.
  * Query data on a JET database table.  A future release may allow a user to insert, 
    modify or delete data.
  * Run any arbitary SQL against a JET database.  This may be used to query data or to execute 
    DML or DDL statements.


A context menu is be opened by right clicking on items in the navigation panel at the left.  
Choices on the context menu are used to create and drop tables, columns, indexes and constraints.

There is currently no ability to manage a SQL Server database.  This may be provided in a future release.

Prior to using the Jass Database Administrator the directory names containing the JET Database (*.mdb) 
files must be configured in the jass.cfg file.  This configuration file is in the root directory of 
this application.

This application is built using the following components.  Without these components JaSS would not be possible.

  * JQuery (http://jquery.com) - Provides AJAX and the foundation for the following components.
  * jQuery-ui (https://jqueryui.com) - Provides tabs and dialogs
  * Handsontable (http://handsontable.com) -  Provides the data grids on each of the tabs
  * jqTree (http://mbraak.github.io/jqTree) - Provides the tree structure used for navigation
  * jQuery Context Menu (http://medialize.github.io/jQuery-contextMenu) - Provides context menu pop-up items.
