module ApplicationHelper
  def full_title page_title
    base_title = t("crb")
    page_title.blank? ? base_title : "#{page_title} | #{base_title}"
  end

  def bootstrap_class_for flash_type
    _type = flash_type.to_sym
    case _type
    when :success
      "alert-success"
    when :error
      "alert-error"
    when :alert
      "alert-warning"
    when :notice
      "alert-info"
    else
      flash_type.to_s
    end
  end
end
