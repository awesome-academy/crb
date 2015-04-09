class Admin::BaseController < ActionController::Base
  before_action :authenticate_user!
  before_action :authorized_admin?

  private
  def authorized_admin?
    unless current_user.is_admin?
      flash[:error] = "You are not authorized to view that page."
      redirect_to root_path
    end
  end
end