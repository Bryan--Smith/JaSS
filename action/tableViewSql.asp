<!-- #include file="classes/DbConnection.asp" -->
<!-- #include file="include/resultsSetToJson.asp" -->
<!-- #include file="adovbs.inc"-->

<%

QUOTE = """"
Set columnNameDict = CreateObject("Scripting.Dictionary")
	
tableName = Request.QueryString("tableName")
fileName = Request.QueryString("fileName")
' response.write tableName
	
Set conn = new DbConnection
conn.openJet(fileName)

viewDefinition = ""
checkOption = ""
isUpdatable = ""
description = ""

Set rs1 = conn.openSchemaX(adSchemaViews)

	
do while not rs1.EOF

	if rs1("TABLE_NAME").value = tableName then


		viewDefinition = rs1("VIEW_DEFINITION").value
		checkOption = rs1("CHECK_OPTION").value
		isUpdatable = rs1("IS_UPDATABLE").value
		description = rs1("DESCRIPTION").value
		
		exit do

	end if
	
	rs1.moveNext
loop
rs1.close



	
response.write "{"

response.write QUOTE & "tableName" & QUOTE & " : "	& QUOTE & tableName & QUOTE & "," & vbCRLF 
response.write QUOTE & "viewDefinition" & QUOTE & " : "	& QUOTE & jsonEscape(viewDefinition) & QUOTE & "," & vbCRLF 
response.write QUOTE & "checkOption" & QUOTE & " : " & QUOTE & checkOption & QUOTE & "," & vbCRLF 
response.write QUOTE & "isUpdatable" & QUOTE & " : " & QUOTE & isUpdatable & QUOTE & "," & vbCRLF 
response.write QUOTE & "description" & QUOTE & " : " &QUOTE & description & QUOTE 

response.write "}"

conn.close
Set conn = Nothing


%>