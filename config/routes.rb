Adventureblog::Application.routes.draw do
  root :to => 'welcome#index'
  resources :users do 
   resources :location_types, {:path => ""}  do 
    resources :locations, {:path => ""}
   end
  end
end
