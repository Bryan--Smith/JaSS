<!-- #include file="classes/DbConnection.asp" -->
<!-- #include file="classes/ColumnDTO.asp" -->
<!-- #include file="classes/ProviderTypes.asp" -->
<!-- #include file="classes/Arrays.asp" -->
<!-- #include file="adovbs.inc"-->

<%

QUOTE = """"
Set columnNameDict = CreateObject("Scripting.Dictionary")
	
tableName = Request.QueryString("tableName")
fileName = Request.QueryString("fileName")
' response.write tableName
	
Set conn = new DbConnection
conn.openJet(fileName)

Set rs1 = conn.openSchema(adSchemaColumns, Array(Empty, Empty, tableName))	
do while not rs1.EOF

	Set column = new ColumnDTO
	column.isPrimaryKey = false
	column.isForeignKey = false
	column.columnName = rs1("COLUMN_NAME").value
	column.ordinalPosition = rs1("ORDINAL_POSITION").value
	column.isNullable = rs1("IS_NULLABLE").value
	column.flags = rs1("COLUMN_FLAGS").value
	if (column.flags and adFldLong) = adFldLong then
		column.isLong = true
	else
		column.isLong = false
	end if
	column.dataType = rs1("DATA_TYPE").value
	column.characterMaximumLength = rs1("CHARACTER_MAXIMUM_LENGTH").value
	column.numericPrecision = rs1("NUMERIC_PRECISION").value
	column.numericScale	= rs1("NUMERIC_SCALE").value		
	
	columnNameDict.add LCase(column.columnName), column

	rs1.moveNext
loop
rs1.close

'
'  Primary Keys
'
Set rs2 = conn.openSchema(adSchemaPrimaryKeys, Array(Empty, Empty, tableName))
do while not rs2.EOF

	columnName = LCase( rs2("COLUMN_NAME").value )
	if columnNameDict.exists(columnName) = true then
		Set column = columnNameDict.item(columnName)
		column.isPrimaryKey = true
	end if

	rs2.moveNext
loop
rs2.close

'
'  Foreign Keys (on primary key side)
'
Set rs3 = conn.openSchema(adSchemaForeignKeys, Array(Empty, Empty, tableName, Empty, Empty, Empty))
do while not rs3.EOF

'	response.write "rs3" & rs3("PK_COLUMN_NAME").value

	columnName = LCase( rs3("PK_COLUMN_NAME").value )
	if columnNameDict.exists(columnName) = true then
'		response.write "EXISTS *****"
		Set column = columnNameDict.item(columnName)
		column.isForeignKey = true
	end if

	rs3.moveNext
loop
rs3.close

'
' Foreign Keys (on the Foreign key Side)
'
Set rs4 = conn.openSchema(adSchemaForeignKeys, Array(Empty, Empty, Empty, Empty, Empty, tableName))
do while not rs4.EOF

	columnName = LCase( rs4("FK_COLUMN_NAME").value )
	if columnNameDict.exists(columnName) = true then
		Set column = columnNameDict.item(columnName)
		column.isForeignKey = true
	end if

	rs4.moveNext
loop
rs4.close

Set mProviderTypes = new ProviderTypes
Set typeNemesDict = mProviderTypes.typesDict(conn)

keys = columnNameDict.keys
for i=0 to columnNameDict.count-1
	Set column = columnNameDict.item(keys(i))
	key = column.dataType & column.isLong
	if typeNemesDict.exists(key) then
		column.typeName = typeNemesDict.item(key)
	end if
next


Set columnOrdinalDict = CreateObject("Scripting.Dictionary")
columnArray = columnNameDict.items
for i=0 to columnNameDict.count-1
	Set column = columnArray(i)

	columnOrdinalDict.add int(column.ordinalPosition), column
next
	
response.write "{"
ordinalArray = columnOrdinalDict.keys
sortedOrdinalArray = (new Arrays).sort(ordinalArray)
first = true
response.write QUOTE & "columns" & QUOTE & " : ["	
for i=0 to uBound(sortedOrdinalArray)
	if first then
		first = false
	else
		response.write "," & vbCRLF
	end if
	Set column = columnOrdinalDict.item( int(sortedOrdinalArray(i)) )
	response.write  column.getJson()
next
response.write "]"
response.write "}"

conn.close
Set conn = Nothing


%>