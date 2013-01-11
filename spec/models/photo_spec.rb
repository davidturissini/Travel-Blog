require 'spec_helper'

describe Photo do

	before do
		Photo.any_instance.stub(:save_attached_files).and_return(true)
	end

	before(:each) do
		@photo = Photo.new({
			:static => File.new("#{Rails.root}/spec/fixtures/images/rails.png")
			})

		@photo.save!
	end

	describe "#square" do
		it "should return the proper url" do
			@photo.square.should == "http://s3.amazonaws.com/traveladdict-test/statics/#{@photo.id}/square/rails?#{@photo.static_updated_at.to_i}"
		end
	end

	describe "#widescreen" do
		it "should return the proper url" do
			@photo.widescreen.should == "http://s3.amazonaws.com/traveladdict-test/statics/#{@photo.id}/widescreen/rails?#{@photo.static_updated_at.to_i}"
		end
	end

	
end