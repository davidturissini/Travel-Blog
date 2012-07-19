require 'spec_helper'

describe String do
 describe "slugify" do
  it "should convert all spaces to dashes" do
    str = "string space" 
    String.slugify(str).should == "string-space"
  end

  it "should lowercase all letters" do
   str = "AA"
   String.slugify(str).should == "aa"
  end

  it "should string all non-alphanumerics" do
   str = 'string!@#$%^&*()_+=-[];\'./,<>?:\"{}\\|123'
   String.slugify(str).should == "string123"
  end
 end
end
