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
  match '/me/statuses/' => "admin/statuses#create", :user_id => "me", :via => :post
  match '/me/statuses/:status_id' => "admin/statuses#destroy", :user_id => "me", :via => :delete
  match '/me/flickr_photoset_photos/:photoset_id' => "admin/users#photoset_photos", :user_id => "me"
  match '/me/trips' => "admin/trips#create", :user_id => "me", :via => "post"
  match '/me/trips/new' => "admin/trips#new", :user_id => "me", :via => "get", :as => "new_trip"
  match '/me/:trip_id' => "admin/trips#edit", :user_id => "me", :via => "get", :as => "admin_trip_edit"
  match '/me/:trip_id' => "admin/trips#update", :user_id => "me", :via => "put"
  match '/me/:trip_id' => "admin/trips#destroy", :user_id => "me", :via => "delete"

  match '/me/locations/new' => "admin/locations#new", :user_id => "me", :via => "get", :as => "new_location"
  match '/me/:trip_id/photos' => "admin/photos#create", :via => :post, :user_id => "me"
  match '/me/:trip_id/photos' => "admin/photos#index", :via => :get, :user_id => "me"
  match '/me/:trip_id/maps' => "admin/maps#index", :via => :get, :user_id => "me", :as => "trip_maps"
  match '/me/maps/stage' => "admin/maps#stage", :via => :post, :user_id => "me"
  match '/me/:trip_id/maps/new' => "admin/maps#new", :user_id => "me", :as => "new_trip_map"
  match '/me/:trip_id/maps/create' => "admin/maps#create", :via => :post, :user_id => "me"
  match '/me/:trip_id/maps/:map_id/edit' => "admin/maps#edit", :user_id => "me", :as => "edit_trip_map"
  match '/me/:trip_id/maps/:map_id' => "admin/maps#update", :via => :put, :user_id => "me"
  match '/me/:trip_id/maps/:map_id' => "admin/maps#destroy", :via => :delete, :user_id => "me"
  match '/me/:trip_id/photos/edit' => "admin/trips#edit_photos", :user_id => "me", :as => "trip_photos_edit"
  match '/me/:trip_id/photos/new' => "admin/trips#new_photos", :user_id => "me", :as => "trip_photos_new"
  match '/me/:trip_id/photos/:slug' => "admin/photos#delete", :user_id => "me", :via => "delete"
  match '/me/:trip_id/photos/:slug' => "admin/photos#update", :user_id => "me"
  match '/me/:trip_id/edit' => "admin/trips#edit", :user_id => "me"
  match "/:user_id/template/:path" => "admin/template#load"
  match '/:user_id/locations/create' => "admin/locations#create"

  match '/about' => "static#about"

  resources :countries, :only => [:index]

  match '/:user_id' => "users#show"
  match '/:user_id/new' => "location_types#new"


  resources :users, {:path => ""} do 
    resources :trips, {:path => ""} do
      resources :journal_entries, :except => [:index, :show]
    end
  end
end
