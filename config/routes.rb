Adventureblog::Application.routes.draw do
  root :to => 'welcome#index'

  match '/test/:test_path' => "qunit#test"

  match '/auth/:provider/callback' => "users#login"
  match '/me' => "admin/users#me", :via => :get, :as => "me", :user_id => "me"
  match '/me/logout' => "users#logout", :as => "logout", :user_id => "me"

  match '/welcome' => "welcome#user", :as => "welcome_user"
  match '/template/:path' => "template#load"

  match '/me' => "admin/users#update", :via => :put, :user_id => "me"
  match '/me/edit' => "admin/users#edit_me", :as => "edit_me", :user_id => "me"
  match '/me/:location_id/photos' => "admin/photos#create", :via => :post, :user_id => "me"
  match '/me/:location_id/tmp_photo' => "admin/photos#temp", :via => :post, :user_id => "me"
  match "/:user_id/template/:path" => "admin/template#load"
  match '/:user_id/locations/create' => "admin/locations#create"

  match '/about' => "static#about"

  resources :countries, :only => [:index]

  match '/:user_id' => "users#show"
  match '/:user_id/new' => "location_types#new"


  resources :users, {:path => ""} do 
    resources :locations, {:path => ""} do
      resources :journal_entries, :except => [:index, :show]
    end
  end
end
