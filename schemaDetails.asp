<Html>
<head>
</head>

<!-- #include file="action/classes/DbConnection.asp" -->
<!--#include file="adovbs.inc"-->


<body>

<%

public sub schemaDetails(resultSet)

	response.write "<table border='1'>"

	response.write "<tr>"
	for each field in resultSet.fields
		response.write "<td>" & field.name & "</td>"
	next
	response.write "</tr>"

	do while not rs1.EOF

		response.write "<tr>"
		for each field in resultSet.fields
			if varType(field.value) >= vbArray then
				response.write "<td> ??? </td>"
			else
				response.write "<td>" & field.value & "</td>"
			end if
		next
		response.write "</tr>" & vbCRLF
		
		resultSet.moveNext
	loop

	response.write "</table>"
end sub

dim rs

Set conn = new DbConnection
conn.openJet("C:\Users\Bryan\spanweb\db\web_requests1.mdb")
'  Call conn.openSqlServer ("HOME1\SQLEXPRESS", "testuser", "testuser1", "test" )
%>

<h1>adSchemaTables</h1>
<%
Set rs1 = conn.openSchemaX(adSchemaTables)
schemaDetails(rs1)
rs1.close
%>

<h1>adSchemaColumns</h1>
<%
Set rs1 = conn.openSchemaX(adSchemaColumns)
schemaDetails(rs1)
rs1.close
%>



<h1>adSchemaIndexes</h1>
<%
Set rs1 = conn.openSchemaX(adSchemaIndexes)
schemaDetails(rs1)
rs1.close
%>

<h1>adSchemaTableConstraints</h1>
<%
Set rs1 = conn.openSchemaX(adSchemaTableConstraints)
schemaDetails(rs1)
rs1.close
%>

<h1>adSchemaConstraintColumnUsage</h1>
<%
'Set rs1 = conn.openSchemaX(adSchemaConstraintColumnUsage)
'schemaDetails(rs1)
'rs1.close
%>


<h1>adSchemaPrimaryKeys</h1>
<%
Set rs1 = conn.openSchemaX(adSchemaPrimaryKeys)
schemaDetails(rs1)
rs1.close
%>

<h1>adSchemaForeignKeys</h1>
<%
Set rs1 = conn.openSchemaX(adSchemaForeignKeys)
schemaDetails(rs1)
rs1.close
%>




<h1>adSchemaCheckConstraints</h1>
<%
Set rs1 = conn.openSchemaX(adSchemaCheckConstraints)
schemaDetails(rs1)
rs1.close
%>

<h1>adSchemaProviderTypes</h1>
<%
Set rs1 = conn.openSchemaX(adSchemaProviderTypes)
schemaDetails(rs1)
rs1.close
%>


<h1>adSchemaKeyColumnUsage</h1>
<%
'Set rs1 = conn.openSchemaX(adSchemaKeyColumnUsage)
'schemaDetails(rs1)
'rs1.close
%>

<h1>adSchemaViews</h1>
<%
Set rs1 = conn.openSchemaX(adSchemaViews)
schemaDetails(rs1)
rs1.close
%>








</body>
</html>