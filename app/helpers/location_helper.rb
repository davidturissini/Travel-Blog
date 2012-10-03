module LocationHelper
 def new_location_path location_type
  new_user_location_path(location_type.user.slug, location_type.slug)
 end

 def edit_location_path loc
  edit_user_location_path(loc.user.slug, loc.slug)
 end

 def location_path loc
  user_location_path(loc.user.slug, loc.slug)
 end

 def location_link loc, options = {}
  path = location_path loc
  link_to loc.title, path, options.merge({ :class => "location #{loc.location_type.title.downcase}" })
 end

 def location_image loc
 	image loc.photo_url, { :title => loc.title, :alt => loc.title }
 end

 def location_string_parts location
 	s = ""
 	s = "#{s} #{link_to location.title, location_path(location)} in " if location.title
 	s += link_to location.geo_string, location_path(location)
 end

 def location_string_link location
 	s = ""
 	s = "#{s} #{link_to location.title, location_path(location)} in " if location.title
 	s += link_to location.geo_string, location_path(location)
 end

 def location_string location
 	s = ""
 	s = "#{location.title} in " if location.title
 	s += location.geo_string
 end
end
