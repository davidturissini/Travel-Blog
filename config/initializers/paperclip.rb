Paperclip::Attachment.default_options.merge!(
    :path => ":rails_root/public/system/:attachment/:id/:style/:basename", 
    :url => "/system/:attachment/:id/:style/:basename"
)