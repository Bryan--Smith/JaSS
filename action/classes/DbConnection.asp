
<%

Class DbConnection

	private dbPath
	private objConn

	
	public Sub openJet(dbPath)
		Dim strConn
		
		Set objConn = Server.CreateObject ("ADODB.Connection")
        strConn = "Provider=Microsoft.Jet.OLEDB.4.0; Data Source=" & dbPath
		
        objConn.Open strConn
	End Sub	

	public Sub openSqlServer(serverName, userName, password, database)
		Dim strConn

		Set objConn = Server.CreateObject ("ADODB.Connection")
        strConn = "PROVIDER=SQLOLEDB;SERVER=" & serverName & ";UID=" & userName & ";PWD=" & password & ";DATABASE=" & database
        objConn.Open strConn
	End Sub	
	
	public function executeSql(sql)
       Set executeSql = objConn.Execute(sql)
	end function
	
	public function getResultSet(sql)
		Dim rs
		
		set rs=Server.CreateObject("ADODB.recordset")
		rs.Open sql, objConn, adOpenStatic
		set getResultSet = rs
	end function
	
	public function getConnection
		Set getConnection = objConn
	end function
	
	public function openSchemaX(queryType)
		set openSchemaX = objConn.OpenSchema(queryType)
	end function
	
	public function openSchema(queryType, criteria)
		set openSchema = objConn.OpenSchema(queryType, criteria)
	end function
	
	public sub close
	    objConn.Close
        set objConn = Nothing
	end sub



End Class



%>