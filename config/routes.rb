Adventureblog::Application.routes.draw do
  root :to => 'welcome#index'
  match '/auth/:provider/callback' => "users#login"
  match '/test/:test_path' => "qunit#test"
  match '/me' => "admin/users#me", :via => :get, :as => "me"
  match '/me/logout' => "users#logout", :as => "logout"
  match '/me' => "admin/users#update", :via => :put
  match '/me/edit' => "admin/users#edit_me", :as => "edit_me"
  match '/welcome' => "welcome#user", :as => "welcome_user"
  match '/template/:path' => "template#load"

  match "/:user_id/template/:path" => "admin/template#load"

  match '/about' => "static#about"

  resources :countries, :only => [:index]

  match '/:user_id' => "users#show"
  match '/:user_id/:id/edit' => "location_types#edit"
  match '/:user_id/location_types/new' => "location_types#new", :as => "new_location_type"
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
