<!-- #include file="adovbs.inc"-->
<!-- #include file="classes/DbConnection.asp" -->
<!-- #include file="classes/DateFormatter.asp" -->
<!-- #include file="include/status.asp" -->
<!-- #include file="include/resultsSetToJson.asp" -->

<%

sql = Request.Form("sql")
fileName = Request.Form("fileName")
pageSize = Request.Form("pageSize")
absolutePage = Request.Form("absolutePage")

Set conn = new DbConnection
conn.openJet(fileName)

on error resume next
Set resultSet = conn.getResultSet(sql)

if Err.Number <> 0 then
	message = err.description
	response.write "{"
	failJson(message)
	response.write "}"
else
	response.write "{"
	successJson()
	
	response.write ","
	
	if resultSet.state = adStateClosed then
		resultTypeJson("COMMAND")
	else
		resultTypeJson("QUERY")
		
		response.write ","
	
		resultSet.pageSize=pageSize
		if cInt(absolutePage) <= resultSet.PageCount then	
			resultSet.absolutePage = absolutePage
		end if


		toJson(resultSet)
		resultSet.close	
	end if
	
	response.write "}"
end if

conn.close
Set conn = Nothing

%>