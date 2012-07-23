module LocationHelper
 def location_path loc
  user_location_type_location_path(loc.user.slug, loc.location_type.slug, loc.slug)
 end

 def location_link loc
  path = location_path loc
  link_to loc.title, path, { :class => "location #{loc.location_type.title.downcase}" }  
 end
end
