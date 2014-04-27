<!-- #include file="adovbs.inc"-->
<!-- #include file="classes/DbConnection.asp" -->
<!-- #include file="classes/DateFormatter.asp" -->
<!-- #include file="include/status.asp" -->
<!-- #include file="include/getParameter.asp" -->


<%



sub processDDL
	tableName = getFormParameter("tableName")
	foreignTableName = getFormParameter("foreignTableName")
	fileName = getFormParameter("fileName")
	fkName = getFormParameter("fkName")
	nrColumns = getFormParameter("nrColumns")



	columnNameList = ""
	foreignColumnNameList = ""

	for i = 1 to nrColumns

		if i > 1 then
			columnNameList = columnNameList & ", "
			foreignColumnNameList = foreignColumnNameList & ", "
		end if

		columnName = Request.Form("columnName" & i)
		foreignColumnName = Request.Form("foreignColumnName" & i)
		
		columnNameList = columnNameList & columnName
		foreignColumnNameList = foreignColumnNameList & foreignColumnName
	next

	sql = "ALTER TABLE " & tableName & " ADD CONSTRAINT " & fkName & " FOREIGN KEY (" & columnNameList & ") REFERENCES " & foreignTableName & "(" & foreignColumnNameList &  ")"


		
	Set conn = new DbConnection
	conn.openJet(fileName)
	set rs=Server.CreateObject("ADODB.recordset")

	conn.executeSql(sql)
	
	conn.close
	Set conn = Nothing


end sub

on error resume next
Call processDDL

if Err.Number <> 0 then
	message = err.description & sql
	response.write "{"
	failJson(message)
	response.write "}"
else
	response.write "{"
	successJson()
	response.write "}"
end if



%>