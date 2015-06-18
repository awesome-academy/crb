class Admin::BaseController < ActionController::Base
  before_action :authenticate_user!, :authorized_admin!

  private
  def authorized_admin!
    unless current_user.admin?
      flash[:alert] = t("flash.alert")
      redirect_to root_path
    end
  end
end
