Rails.application.routes.draw do
  root "pages#home"

  mount RailsAdmin::Engine => "/admin", as: "rails_admin"
  devise_for :users, controllers: {registrations: "registrations"}

  resources :schedules

  resources :users do
    resources :schedules, except: [:new, :create, :show]
  end

  get "repeats/confirm"
  resources :repeats, only: [:destroy]

  namespace :api do
    resources :my_schedules, only: :index
    resources :shared_schedules, only: :index
    resources :schedules, only: :index
  end
end
