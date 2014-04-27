<%

class CfgFileReader

	private FOR_READING
	private FOR_WRITING
	private ASCII
	private CONFIG_FILENAME
		
	Private Sub Class_Initialize
		FOR_READING = 1
		FOR_WRITING = 2
		ASCII = 0
		CONFIG_FILENAME="jass.cfg"
	end sub

	public function readCfg
		Set keyValueDict = CreateObject("Scripting.Dictionary")
	
		configFilenamePath = Server.MapPath(CONFIG_FILENAME)
		configFilenamePath = Replace(configFilenamePath, "action\" & CONFIG_FILENAME, CONFIG_FILENAME)

		Set fso = CreateObject("Scripting.FileSystemObject")
		If fso.FileExists(configFilenamePath) Then
			Set objStream = fso.OpenTextFile(configFilenamePath, FOR_READING, False, ASCII) 
			

			
			Do While Not objStream.AtEndOfStream
				strLine = trim(objStream.ReadLine)

				if Left(strLine, 1) <> "#" then
					keyValue = split(strLine, "=")

					if ubound(keyValue) = 1 then
						key = keyValue(0)
						value = keyValue(1)
						
						
						
						
						if not keyValueDict.exists(key) then
						
'							response.write "(" & key & "--->" & value & ")"
							keyValueDict.add key, value
						end if
					end if	' Is key/value pair
				end if	' Not a comment
			loop
		end if

		set readCfg = keyValueDict
	end function
	
	public sub updateCfg(updatesDict)
	
		configFilenamePath = Server.MapPath(CONFIG_FILENAME)
		configFilenamePath = Replace(configFilenamePath, "action\class\" & CONFIG_FILENAME, CONFIG_FILENAME)	
		configFilenameBak = configFilenamePath & ".bak"
		
		Set fso = CreateObject("Scripting.FileSystemObject")
		If fso.FileExists(configFilenamePath) Then
			fso.CopyFile configFilenamePath, configFilenameBak
			
			Set objInput = fso.OpenTextFile(configFilenameBak, FOR_READING, False, ASCII) 
			Set objOutput = fso.OpenTextFile(configFilenamePath, FOR_WRITING, True, ASCII) 
			
			Do While Not objInput.AtEndOfStream
				val = Nothing 	' Reset to  Not Initialized
			
				inLine = objInput.ReadLine
				strLine = trim(inLine)
				if Left(strLine, 1) <> "#" then
					keyValue = split(strLine, "=")
					if ubound(keyValue) = 1 then
						key = keyValue(0)
						
						if updatesDict.exists(key) then
							val = updatesDict.item(key)
						end if
					end if	' Is key/value pair
				end if	' Not a comment
				
				if val is nothing then
					objOutput.writeLine inLine
				else
					objOutput.writeLine key & "=" & val
				end if
			loop			

			objInput.close
			objOutput.close

		end if
	
	end sub

end class


%>