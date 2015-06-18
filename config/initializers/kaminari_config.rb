Kaminari.configure do |config|
  # config.default_per_page = 25
  # config.max_per_page = nil
  # config.window = 4
  # config.outer_window = 0
  # config.left = 0
  # config.right = 0
  # config.page_method_name = :page
  # config.param_name = :page
  Kaminari::Helpers::Tag.class_eval do
    def to_s(locals = {})
        @template.render :partial => "../views/kaminari/#{@theme}#{self.class.name.demodulize.underscore}", :locals => @options.merge(locals)
    end
  end
end
