FactoryGirl.define do
  factory :location do
    latitude 100
    longitude 100

    association :trip_id, :factory => :trip

  end
end