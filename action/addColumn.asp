<!-- #include file="adovbs.inc"-->
<!-- #include file="classes/DbConnection.asp" -->
<!-- #include file="classes/DateFormatter.asp" -->
<!-- #include file="include/status.asp" -->
<!-- #include file="include/getParameter.asp" -->


<%


sub processDDL

	tableName = getFormParameter("tableName")
	fileName = getFormParameter("fileName")
	columnName = getFormParameter("columnName")
	columnType = getFormParameter("columnType")
	length = getFormParameter("length")
	precision = getFormParameter("precision")
	scale = getFormParameter("scale")
	notNull = getFormParameter("notNull")

		
	Set conn = new DbConnection
	conn.openJet(fileName)
	set rs=Server.CreateObject("ADODB.recordset")

	addColumnSql = "ALTER TABLE " & tableName & " ADD COLUMN " & columnName & " " & columnType

	if columnType = "varchar" or columnType = "char" then
		addColumnSql = addColumnSql & "(" & length & ")"
	elseif columnType = "decimal" then
		addColumnSql = addColumnSql & "(" & precision & "," & scale & ")"
	end if

	if notNull = "true" then
		addColumnSql = addColumnSql & " NOT NULL"
	end if
	
	conn.executeSql(addColumnSql)

	conn.close
	Set conn = Nothing
end sub

on error resume next
Call processDDL


if Err.Number <> 0 then
	message = err.description
	response.write "{"
	failJson(message)
	response.write "}"
else
	response.write "{"
	successJson()
	response.write "}"
end if



%>