Rails.application.routes.draw do
resources :emails, only: [ :index, :show, :create ]
root "emails#index"
end
