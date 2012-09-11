module UserHelper
	def user_countries_count_text user
		count = user.countries_count
		country_str = count != 1 ? "Countries" : "Country"
		"#{count} #{country_str}"
	end
end