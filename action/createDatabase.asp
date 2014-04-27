<!-- #include file="adovbs.inc"-->
<!-- #include file="include/status.asp" -->
<!-- #include file="include/getParameter.asp" -->


<%


sub processDDL
	fileName = getFormParameter("fileName")

	create_string = "Provider=Microsoft.Jet.OLEDB.4.0;Jet OLEDB:Engine Type=5;"
	create_string = create_string & "Data Source=" & fileName & ";"
	 
	' If JET_encryption_wanted Then
	'     create_string = create_string & "Jet OLEDB:Encrypt Database=True;"
	' End If
	 
	Set cat = CreateObject("ADOX.Catalog")

	cat.Create create_string
	
	cat.close
	cat = Nothing
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