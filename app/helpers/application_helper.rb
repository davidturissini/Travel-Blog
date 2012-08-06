module ApplicationHelper
 def image source, options = {}
  source = source.nil? ? "melissa_and_me.jpg" : source
  image_tag source, options
 end
end
