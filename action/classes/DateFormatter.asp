

<%


 ' Template items (example)
 ' %w Weekday as integer (1 is Sunday)
 ' %W Abbreviated day name (Fri) 
 ' %d Day of the month (23) 
 ' %m Month as a decimal (02)
 ' %M Abbreviated month name (Feb )
 ' %Y Year with century (1998)
 ' %y Year without century (98)

 ' %H Hour in 24 hour format (24)
 ' %h Hour in 12 hour format (12)
 ' %N Minute as an integer (01)
 ' %S Second as an integer (55)
 ' %P AM/PM Indicator (PM)
class DateFormatter

	private monthArray
	private dayArray
	
	 Private Sub Class_Initialize
		dayArray = Split("Sun Mon Tue Wed Thu Fri Sat")
		monthArray = Split("Jab Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec")
	 end sub
	
	public function format(dateValue, dateFormat)
		retValue = ""
		startPos = 1
		index = Instr(startPos, dateFormat, "%")

		do while index>0 
		
			retValue = retValue & Mid(dateFormat, startPos, (index-startPos))
		
			formatItem = Mid(dateFormat, index, 2)
		
			select case formatItem
				case "%m"	' Month as a decimal (02)
					retValue = retValue & Month(dateValue)
				case "%M"	' Abbreviated month name (Feb)
					retValue = retValue & monthArray(Month(dateValue)-1)
				case "%d"	' Day of the month (23)
					retValue = retValue & Day(dateValue)
				case "%Y"	' Year with century (1998)
					retValue = retValue & Year(dateValue)
				case "%y"	' Year without century (98)
					retValue = retValue & (Year(dateValue) mod 100)
				case "%w"	' Weekday as integer (1 is Sunday)
					retValue = retValue & Weekday(dateValue)
				case "%W"	' Abbreviated day name (Fri)
					retValue = retValue & dayArray(Weekday(dateValue)-1)
				case "%H"	' Hour in 24 hour format (24)
					retValue = retValue & Hour(dateValue)
				case "%h"	' Hour in 12 hour format (12)
					retValue = retValue & (Hour(dateValue) mod 12)
				case "%N"	' Minute as an integer (01)
					retValue = retValue & Minute(dateValue)
				case "%S"	' Second as an integer (55)
					retValue = retValue & Second(dateValue)
'				case "%P"	' AM/PM Indicator (PM)
'				
			end select
			startPos = index + 2
			
			index = Instr(startPos, dateFormat, "%")
		loop
		retValue = retValue & Mid(dateFormat, startPos)

	
		format = retValue
	end function
	

end class


%>