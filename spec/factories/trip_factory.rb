FactoryGirl.define do
	factory :trip do
		association :user_id, :factory => :user

		sequence :slug do |n|
		    "trip-#{n}"
		end

		locations {
			Array(5..10).sample.times.map do
				 FactoryGirl.create(:location, trip:@instance)
			end
		}

		maps {
			Array(5..10).sample.times.map do
				 FactoryGirl.create(:map)
			end
		}

		posts {
			Array(5..10).sample.times.map do
				 FactoryGirl.create(:post)
			end
		}

		photos {
			Array(5..10).sample.times.map do
				 FactoryGirl.create(:photo)
			end
		}
	end
end