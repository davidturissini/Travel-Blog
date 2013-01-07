FactoryGirl.define do
  factory :user do
  	name "User name"
  	
  	sequence :slug do |n|
	    "user-#{n}"
	end

  	trips {
			Array(5..10).sample.times.map do
				 FactoryGirl.create(:trip, user:@instance)
			end
		}
    
  end
end