<!-- #include file="adovbs.inc"-->
<!-- #include file="classes/DbConnection.asp" -->


<%

QUOTE = """"
	
tableName = Request.QueryString("tableName")
fileName = Request.QueryString("fileName")	
	
Set conn = new DbConnection
conn.openJet(fileName)

response.write "{"
response.write QUOTE & "columnNames" & QUOTE & " : ["	

Set rs1 = conn.openSchemaX(adSchemaColumns)	
firstItem = true
do while not rs1.EOF
	if rs1("TABLE_NAME").value = tableName then
		columnName = rs1("COLUMN_NAME").value

			
		if firstItem then
			firstItem = false
		else
			response.write ", "
		end if
		
		response.write QUOTE & columnName & QUOTE


	end if
	
	rs1.moveNext
loop
rs1.close

response.write "]"
response.write "}"

conn.close
Set conn = Nothing

%>