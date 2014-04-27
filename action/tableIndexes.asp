<!-- #include file="adovbs.inc"-->
<!-- #include file="classes/DbConnection.asp" -->
<!-- #include file="classes/IndexDTO.asp" -->

<%

QUOTE = """"

Set indexNameDict = CreateObject("Scripting.Dictionary")

fileName = Request.QueryString("fileName")	
tableName = Request.QueryString("tableName")

	
Set conn = new DbConnection
conn.openJet(fileName)

Set rs1 = conn.openSchemaX(adSchemaIndexes)	
do while not rs1.EOF

	if rs1("TABLE_NAME").value = tableName then

		Set index = new IndexDTO
	
		index.indexName = rs1("INDEX_NAME").value
		index.columnName = rs1("COLUMN_NAME").value
		index.primaryKey = rs1("PRIMARY_KEY").value
		index.unique = rs1("UNIQUE").value
		index.ordinalPosition = rs1("ORDINAL_POSITION").value

		if indexNameDict.exists(index.indexName) then
			Set existDTO = indexNameDict.item(index.indexName)
			existDTO.columnName = existDTO.columnName & ", " & index.columnName
		else
			indexNameDict.add index.indexName, index
		end if
	end if
	
	rs1.moveNext
loop
rs1.close

response.write "{"
response.write QUOTE & "indexes" & QUOTE & " : ["	

indexArray = indexNameDict.items
first = true
for i=0 to uBound(indexArray)
	if first then
		first = false
	else
		response.write "," & vbCRLF
	end if
	Set index = indexArray( i )
	response.write index.getJson()
next
response.write "]"
response.write "}"

conn.close
Set conn = Nothing

%>