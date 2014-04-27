<!-- #include file="adovbs.inc"-->
<!-- #include file="classes/DbConnection.asp" -->
<!-- #include file="classes/DateFormatter.asp" -->
<!-- #include file="include/status.asp" -->
<!-- #include file="include/getParameter.asp" -->


<%



sub processDDL
	tableName = getFormParameter("tableName")
	fileName = getFormParameter("fileName")
	columnNames = getFormParameter("columnNames")

	errors = false

	Set conn = new DbConnection
	conn.openJet(fileName)

	for each column in Split(columnNames)
		dropSql = "ALTER TABLE " & tableName & " DROP COLUMN " & column
		
		conn.executeSql(dropSql)
		
		' if Err.Number <> 0 then
			' message = err.description
			' on error goto 0
			' response.write "{"
			' failJson(message)
			' response.write "}"	
			' errors = true
			' exit for
		' end if
		' on error goto 0

	next 

	conn.close
	Set conn = Nothing
end sub	

on error resume next
Call processDDL

if Err.Number <> 0 then
	message = err.description
	on error goto 0
	response.write "{"
	failJson(message)
	response.write "}"	
else
	response.write "{"
	successJson()
	response.write "}"
end if



%>