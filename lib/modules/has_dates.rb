module HasDates
	def has_date_range?
		!end_date.nil?
	end

	def date_string
		str = ""
		str += start_date.strftime("%B %d, %Y") if start_date
		str += " - #{end_date.strftime("%B %d, %Y")}" if end_date
		str
	end
end