class Email < ApplicationRecord
  validates :object, presence: true
  validates :body, presence: true

  # Par défaut, un email n'est pas lu
  after_initialize :set_default_read_status, if: :new_record?

  private

  def set_default_read_status
    self.is_read ||= false
  end
end
