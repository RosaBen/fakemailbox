Rails.application.routes.draw do
resources :emails, only: [ :index, :show, :create, :destroy ] do
  member do
    patch :mark_as_unread
    patch :toggle_read_status
  end
end

root "emails#index"
end
