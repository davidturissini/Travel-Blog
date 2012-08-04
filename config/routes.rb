Adventureblog::Application.routes.draw do
  root :to => 'welcome#index'
  match '/auth/:provider/callback' => "users#login"
  match '/qunit' => "qunit#test"
  match '/me' => "users#me", :via => :get
  match '/me/logout' => "users#logout"
  match '/me' => "users#update", :via => :put

  match '/:user_id/:id/edit' => "location_types#edit"
  match '/:user_id/location_types/new' => "location_types#new"
  match '/:user_id/:location_type_id/new' => "locations#new"
  match '/:user_id/new' => "location_types#new"
  match '/:user_id/location_types' => "location_types#index", :via => :get
  match '/:user_id/location_types' => "location_types#create", :via => :post
  
  resources :users, {:path => ""} do 
   resources :location_types, {:path => ""}  do 
    resources :locations, {:path => ""} do
     resources :journal_entries, :except => [:index, :show]
    end
   end
  end
end
