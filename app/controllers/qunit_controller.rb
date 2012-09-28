class QunitController < ApplicationController
 def test
 	path = params[:test_path].split(":")
 	render "qunit/#{path.join("/")}"
 end
end
