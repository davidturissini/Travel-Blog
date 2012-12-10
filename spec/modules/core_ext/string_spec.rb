require 'spec_helper'

describe String do
	describe "#slugify" do
		it "should slugify a string" do
			str = "Not slug."
			String.slugify(str).should == "not-slug"
		end
	end

	describe "#is_url?" do
		describe "valid url is passed" do
			it "should return true" do
				url = "http://www.google.com"
				String.is_url?(url).should == true
			end
		end
	end
end