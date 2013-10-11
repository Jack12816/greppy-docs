# Guardfile for Greppy Docs
# More info at https://github.com/guard/guard#readme

guard 'shell' do

    # Watch for all markdown file changes
    watch /^docs\/.*\.md$/ do |m|
        `make docs`
    end
end

