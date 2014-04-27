<!-- #include file="adovbs.inc"-->
<!-- #include file="classes/DbConnection.asp" -->
<!-- #include file="classes/DateFormatter.asp" -->
<!-- #include file="include/status.asp" -->
<!-- #include file="include/getParameter.asp" -->


<%



sub processDDL
	fileName = getFormParameter("fileName")
	tableName = getFormParameter("tableName")
	ckName = getFormParameter("ckName")
	condition = getFormParameter("condition")

	Set conn = new DbConnection
	conn.openJet(fileName)
	set rs=Server.CreateObject("ADODB.recordset")

	createConstraintSql = "ALTER TABLE " & tableName & " ADD CONSTRAINT " & ckName & " CHECK (" & condition  & ")"
	conn.executeSql(createConstraintSql)

	conn.close
	Set conn = Nothing
end sub

on error resume next
Call processDDL

if Err.Number <> 0 then
	message = err.description
	response.write "{"
	failJson(message & createConstraintSql )
	response.write "}"
else
	response.write "{"
	successJson()
	response.write "}"
end if



%>