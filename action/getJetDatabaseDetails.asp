<!-- #include file="classes/DbConnection.asp" -->
<!-- #include file="adovbs.inc"-->

<%

public sub tableOrViewToJson(conn, dbType)

	response.write "{" & QUOTE & "label" & QUOTE & ": " & QUOTE & dbType & QUOTE & "," & vbCRLF
	response.write QUOTE & "dbType" & QUOTE & ": " & QUOTE & dbType & "_LIST" & QUOTE & "," & vbCRLF
	response.write QUOTE & "children" & QUOTE & ": [" & vbCRLF

	Set conn = new DbConnection
	conn.openJet(fileName)

	Set rs1 = conn.openSchemaX(adSchemaTables)
	firstRow = true
	do while not rs1.EOF

		if rs1("TABLE_TYPE").value = dbType then
			if firstRow = true then
				
				firstRow = false
			else
				response.write ","
			end if	
			response.write "{" & QUOTE & "label" & QUOTE & ": " & QUOTE & rs1("TABLE_NAME").value & QUOTE & ","
			response.write  QUOTE & "objectName" & QUOTE & ": " & QUOTE & rs1("TABLE_NAME").value & QUOTE & ","
			response.write  QUOTE & "dbType" & QUOTE & ": " & QUOTE & dbType  & QUOTE & "}"
		
		end if
		
		rs1.moveNext
	loop
	rs1.close


	response.write "]" & vbCRLF
	response.write "}" & vbCRLF

end sub


Const QUOTE = """"
fileName = Request.QueryString("fileName")

response.write "[" & vbCRLF


Set conn = new DbConnection
conn.openJet(fileName)


tableorViewToJson conn, "TABLE" 
response.write "," & vbCRLF
tableOrViewToJson conn, "VIEW"

response.write "]" & vbCRLF

conn.close
Set conn = Nothing




'http://localhost/access-db/action/getJetDatabaseDetails.asp?fileName=C:\Users\Bryan\spanweb\db\mem.mdb

%>