module HasFiles
	def save_file file, options = {}
		if( Rails.env.development? )
			return save_file_remote file, options
		else
			return save_file_local file, options
		end
	end

	def create_dir_if_not_exists! dir
		if( Rails.env.development? )
			create_remote_dir_if_not_exists dir
		else
			system("mkdir -p /#{CONFIG['static']['server_path']}#{dir}")
		end
	end


	protected
	def create_remote_dir_if_not_exists dir
		Net::SSH.start(CONFIG['static']['domain'], CONFIG['static']['username'], :password => CONFIG['static']['password']) do |ssh|
			ssh.exec!("mkdir -p #{CONFIG['static']['server_path']}#{dir}")
		end
	end

	def save_file_local file, options
		full_path = "#{CONFIG['static']['server_path']}/#{options[:path]}"
		File.open(full_path, "w") do |f|
			f.write(file.read)
		end
	end

	def save_file_remote file, options
		path = options[:path]

		remote_path = "#{CONFIG['static']['server_path']}#{path}"

		Net::SCP.start(CONFIG['static']['domain'], CONFIG['static']['username'], :password => CONFIG['static']['password']) do |scp|
			scp.upload! file, remote_path
		end

		Net::SSH.start(CONFIG['static']['domain'], CONFIG['static']['username'], :password => CONFIG['static']['password']) do |ssh|
			ssh.exec!("chmod 0644 #{remote_path}")
		end
	end
end
