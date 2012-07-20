Adventureblog::Application.routes.draw do
  root :to => 'welcome#index'
  match '/auth/:provider/callback' => "users#login"
  match '/me' => "users#me"
  resources :users, {:path => ""} do 
   resources :location_types, {:path => ""}  do 
    resources :locations, {:path => ""}
   end
  end
end
