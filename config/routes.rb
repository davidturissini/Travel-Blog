Adventureblog::Application.routes.draw do
  root :to => 'welcome#index'
  match '/auth/:provider/callback' => "users#login"
  resources :users, {:path => ""} do 
   resources :location_types, {:path => "/:id"}  do 
    resources :locations, {:path => ""}
   end
  end
end
