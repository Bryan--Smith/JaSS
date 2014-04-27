<!-- #include file="adovbs.inc"-->
<!-- #include file="classes/DbConnection.asp" -->
<!-- #include file="classes/DateFormatter.asp" -->
<!-- #include file="include/status.asp" -->
<!-- #include file="include/getParameter.asp" -->


<%



sub processDDL
	tableName = getFormParameter("tableName")
	fileName = getFormParameter("fileName")
	nrColumns = getFormParameter("nrColumns")

	sql = "CREATE TABLE " & tableName & "("
	pkSql = ""

	for i = 1 to nrColumns


		primaryKey = getFormParameter("primaryKey" & i)
		columnName = getFormParameter("columnName" & i)
		columnType = getFormParameter("columnType" & i)
		length = getFormParameter("length" & i)
		precision = getFormParameter("precision" & i)
		scale = getFormParameter("scale" & i)
		notNull = getFormParameter("notNull" & i)
		
		lengthIsVisible = getFormParameter("lengthIsVisible" & i)
		precisionIsVisible = getFormParameter("precisionIsVisible" & i)
		
		if primaryKey = "true" then
			if len(pkSql) > 0 then
				pkSql = pkSql & ", "
			end if
			pkSql = pkSql & columnName
		end if
		

		
		if i > 1 then
			sql = sql & ", "
		end if
		

		sql = sql & columnName & " " & columnType
		
		if lengthIsVisible = "true" then
			sql = sql & "(" & length & ")"
		end if	
		
		if precisionIsVisible = "true" then
			sql = sql & "(" & precision & "," & scale & ")"
		end if	
		
		if notNull = "true" then
			sql = sql & " Not Null"
		end if
	next

	if len(pkSql) > 0 then
		sql = sql & ", PRIMARY KEY(" & pkSql & ")"
	end if

	sql = sql & ")"


		
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