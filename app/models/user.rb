class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :schedules, dependent: :destroy
  
  validates :name, presence: true, length: {maximum: 100}
  validates :role, presence: true, length: {maximum: 50}
end