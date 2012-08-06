class SeedAnonymousUser < ActiveRecord::Migration
  def up
  	User.create({
    :name => "anonymous",
    :slug => "anonymous",
    :token => "anonymous",
    :salt => "anonymous"
    })
  end

  def down
  	user.find_by_salt("anonymous").destroy
  end
end
