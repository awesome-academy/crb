class User < ActiveRecord::Base
  include RailsAdminUser

  has_many :events, class_name: "Schedule", through: :schedule_users, foreign_key: :user_id
  has_many :repeats, dependent: :destroy
  has_many :schedule_users
  has_many :schedules, dependent: :destroy

  validates :name, presence: true, length: {maximum: 100}
  validate :avatar_size

  scope :with_ids, ->ids{where id: ids}
  scope :without_user, ->user_id{where.not id: user_id}

  before_create{self.role ||= Settings.user_roles[:normal]}

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  mount_uploader :avatar, AvatarUploader

  Settings.user_roles.each do |_, user_role|
    define_method("#{user_role}?") {user_role == role}
  end

  private
  def avatar_size
    if avatar.size > Settings.max_avatar_file_size.megabytes
      errors.add :avatar, I18n.t("invalid.avatar", max_avatar_file_size: Settings.max_avatar_file_size)
    end
  end
end
