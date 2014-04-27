<!-- #include file="adovbs.inc"-->
<!-- #include file="classes/DbConnection.asp" -->
<!-- #include file="classes/DateFormatter.asp" -->
<!-- #include file="include/status.asp" -->
<!-- #include file="include/resultsSetToJson.asp" -->



<%

QUOTE = """"

dim conn, rsQuery, rsSchemaColumns

	tableName = Request.QueryString("tableName")
	fileName = Request.QueryString("fileName")
	sortColumn = Request.QueryString("sortColumn")
	sortAscDesc = Request.QueryString("sortAscDesc")
	columnFilter = Request.QueryString("columnFilter")
	pageSize = Request.QueryString("pageSize")
	absolutePage = Request.QueryString("absolutePage")


sub processSQL
	' http://localhost/access-db/tableData.asp?tableName=Trip_suggestions&fileName=C%3A%5CUsers%5CBryan%5Cspanweb%5Cdb%5Ctrips.mdb&pageSize=10&absolutePage=1&_=1396676516748
	
	Set conn = new DbConnection
	conn.openJet(fileName)
	
	if sortColumn = "" then
		Set rsSchemaColumns = conn.openSchema(adSchemaColumns, Array(Empty, Empty, tableName))	
		Set rsSchemaPrimaryKeys = conn.openSchema(adSchemaPrimaryKeys, Array(Empty, Empty, tableName))	
		do while not rsSchemaPrimaryKeys.EOF 
			if rsSchemaPrimaryKeys("ORDINAL").value = 1 then
				sortColumn = rsSchemaPrimaryKeys("COLUMN_NAME").value
				sortAscDesc = "ASC"
			end if
			rsSchemaPrimaryKeys.moveNext
		loop
	end if	
	
	set rsQuery=Server.CreateObject("ADODB.recordset")
	
	whereClause = ""
	if Len(columnFilter) > 0 then
		whereClause = " WHERE " & columnFilter
	end if
	
	orderByClause = ""
	if len(sortColumn) > 0 then
		orderByClause = " ORDER BY " & sortColumn & " " & sortAscDesc
	end if

	sql = "select * from [" & tableName & "] " & whereClause & orderByClause

	set rsQuery = conn.getResultSet(sql)
	rsQuery.pageSize=pageSize
	if cInt(absolutePage) <= rsQuery.PageCount then	
		rsQuery.absolutePage = absolutePage
	end if
end sub


sub schemaToJson(rsSchemaColumns)

	if not IsEmpty(rsSchemaColumns) then

		response.write QUOTE & "databaseColumnNames" & QUOTE & ":["
		firstRow = true
		do while not rsSchemaColumns.EOF
			if firstRow then
				firstRow = false
			else
				response.write "," & vbCRLF
			end if
			
			response.write QUOTE & rsSchemaColumns("COLUMN_NAME").value & QUOTE 

			rsSchemaColumns.moveNext
		loop
		response.write "],"
		
		rsSchemaColumns.close
	end if

end sub

on error resume next
call processSQL

if Err.Number <> 0 then
	message = err.description
	response.write "{"
	response.write QUOTE & "sortColumn" & QUOTE & ": " & QUOTE & sortColumn & QUOTE & ", " + vbCRLF
	response.write QUOTE & "sortAscDesc" & QUOTE & ": " & QUOTE & sortAscDesc & QUOTE & ", " + vbCRLF
	response.write QUOTE & "columnFilter" & QUOTE & ": " & QUOTE & jsonEscape(columnFilter) & QUOTE & ", " + vbCRLF	
	failJson(message)
	response.write "}"	

else
	response.write "{"
	response.write QUOTE & "sortColumn" & QUOTE & ": " & QUOTE & sortColumn & QUOTE & ", " + vbCRLF
	response.write QUOTE & "sortAscDesc" & QUOTE & ": " & QUOTE & sortAscDesc & QUOTE & ", " + vbCRLF
	response.write QUOTE & "columnFilter" & QUOTE & ": " & QUOTE & jsonEscape(columnFilter) & QUOTE & ", " + vbCRLF
	toJson(rsQuery)
	response.write ", " + vbCRLF
	schemaToJson(rsSchemaColumns)
	successJson()

	response.write "}"
end if

rsQuery.close

conn.close
Set conn = Nothing

%>