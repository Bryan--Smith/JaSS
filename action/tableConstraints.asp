<!-- #include file="adovbs.inc"-->
<!-- #include file="classes/DbConnection.asp" -->
<!-- #include file="classes/ConstraintDTO.asp" -->

<%

Function sTrim(s)


     i = InStr(s, Chr(0))
     If (i > 0) Then
         sTrim = Trim(Left(s, i - 1))
     Else
         sTrim = Trim(s)
     End If

end function


QUOTE = """"
Set constraintNameDict = CreateObject("Scripting.Dictionary")
	
tableName = Request.QueryString("tableName")
fileName = Request.QueryString("fileName")	
	
Set conn = new DbConnection
conn.openJet(fileName)



'
'   Primary Key Details
'

Set rs1 = conn.openSchema(adSchemaPrimaryKeys, Array(Empty, Empty, tableName))	
do while not rs1.EOF

	constraintName = rs1("PK_NAME").value
	if not constraintNameDict.exists(constraintName) then
		Set constraint = new ConstraintDTO
		constraint.name = constraintName
		constraint.constraintType = "PRIMARY KEY"
		Set constraint.details = CreateObject("Scripting.Dictionary")
		
		constraintNameDict.add constraint.name, constraint
	else
		Set constraint = constraintNameDict.item(constraintName)
	end if

	Set pk = new PrimaryConstraintDTO
	pk.columnName = rs1("COLUMN_NAME").value
	pk.ordinal = rs1("ORDINAL").value
	constraint.details.add pk.ordinal, pk
	
	rs1.moveNext
loop
rs1.close


'
' Foreign Key details (this --> PK)
'
Set rs2 = conn.openSchema(adSchemaForeignKeys, Array(Empty, Empty, Empty, Empty, Empty, tableName)	)
do while not rs2.EOF

	constraintName = rs2("FK_NAME").value
	if not constraintNameDict.exists(constraintName) then
		Set constraint = new ConstraintDTO
		constraint.name = rs2("FK_NAME").value
		constraint.constraintType = "FOREIGN KEY"
		Set constraint.details = CreateObject("Scripting.Dictionary")
		
		constraintNameDict.add constraint.name, constraint
	else		
		Set constraint = constraintNameDict.item(constraintName)
	end if

	Set fk = new ForeignConstraintDTO

	fk.pkName = rs2("PK_NAME").value
	fk.pkTableName = rs2("PK_TABLE_NAME").value
	fk.pkColumnName = rs2("PK_COLUMN_NAME").value
	fk.fkTableName = rs2("FK_TABLE_NAME").value
	fk.fkColumnName = rs2("FK_COLUMN_NAME").value
	fk.ordinal = rs2("ORDINAL").value
	constraint.details.add fk.ordinal, fk

	rs2.moveNext
loop
rs2.close


'
' Foreign Key details (FK --> this)
'

Set rs2 = conn.openSchema(adSchemaForeignKeys, Array(Empty, Empty, tableName, Empty, Empty, Empty)	)
do while not rs2.EOF

	constraintName = rs2("FK_NAME").value
	if not constraintNameDict.exists(constraintName) then
		Set constraint = new ConstraintDTO
		constraint.name = rs2("FK_NAME").value
		constraint.constraintType = "FOREIGN KEY"
		Set constraint.details = CreateObject("Scripting.Dictionary")
		
		constraintNameDict.add constraint.name, constraint
	else		
		Set constraint = constraintNameDict.item(constraintName)
	end if

	Set fk = new ForeignConstraintDTO

	fk.pkName = rs2("PK_NAME").value
	fk.pkTableName = rs2("PK_TABLE_NAME").value
	fk.pkColumnName = rs2("PK_COLUMN_NAME").value
	fk.fkTableName = rs2("FK_TABLE_NAME").value
	fk.fkColumnName = rs2("FK_COLUMN_NAME").value
	fk.ordinal = rs2("ORDINAL").value
	constraint.details.add fk.ordinal, fk

	rs2.moveNext
loop
rs2.close

'
'  Check Constraint
' 
Set rs3 = conn.openSchema(adSchemaTableConstraints, Array(Empty, Empty, Empty, Empty, Empty, tableName, Empty))
do while not rs3.EOF

	constraintType = sTrim(rs3("CONSTRAINT_TYPE").value)
	if constraintType = "CHECK" or constraintType = "UNIQUE" then
	
		Set constraint = new ConstraintDTO
		constraint.name = rs3("CONSTRAINT_NAME").value
		constraint.constraintType = sTrim(rs3("CONSTRAINT_TYPE").value)
		Set constraint.details = CreateObject("Scripting.Dictionary")

		constraintNameDict.add constraint.name, constraint	
		
		if constraint.constraintType = "UNIQUE" then
			Set rs5 = conn.openSchema(adSchemaIndexes, Array(Empty, Empty, constraint.name, Empty, tableName))
			do while not rs5.EOF
				Set uk = new UniqueConstraintDTO

				uk.ordinal = rs5("ORDINAL_POSITION").value
				uk.columnName = rs5("COLUMN_NAME").value
				
'				response.write ">>>" & tableName & ":" & constraint.name & ":" & uk.ordinal & "<<<"
				
				constraint.details.add uk.ordinal, uk

				rs5.moveNext
			loop
			rs5.close
		end if
	end if
	
	rs3.moveNext
loop
rs3.close


Set rs4 = conn.openSchemaX(adSchemaCheckConstraints)
do while not rs4.EOF	
	constraintName = rs4("CONSTRAINT_NAME").value
	
	if constraintNameDict.exists(constraintName) then
		Set constraint = constraintNameDict.item(constraintName)
		Set ck = new CheckConstraintDTO
			
		ck.checkClause = rs4("CHECK_CLAUSE").value
		ck.description = rs4("DESCRIPTION").value
		constraint.details.add ck.checkClause, ck	
	end if
	
	rs4.moveNext
loop
rs4.close


	



response.write "{"
response.write QUOTE & "constraints" & QUOTE & " : ["	

constraintArray = constraintNameDict.items


for i=0 to uBound(constraintArray)
	if i>0 then
		response.write "," & vbCRLF
	end if
	
	Set constraint = constraintArray( i )
	response.write constraint.getJson()
next
response.write "]"
response.write "}"

conn.close
Set conn = Nothing

%>