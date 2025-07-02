Rails.application.routes.draw do
resources :emails, only: [:index]
root "emails#index"
end
