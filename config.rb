require "sass-getunicode"
require "./lib/markdown_navigation"

set :css_dir, 'assets/stylesheets'
set :js_dir, 'assets/javascripts'
set :images_dir, 'assets/images'

set :build_dir, "tmp"

set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true,
               :gh_blockcode       => true,
               :tables             => true,
               :autolink           => true,
               :smartypants        => true,
               :no_intra_emphasis  => true,
               :pattern            => '```'

activate :livereload
activate :directory_indexes
activate :markdown_navigation

page "*", :layout => :main


configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Enable cache buster
  # activate :cache_buster

  # Use relative URLs
  activate :relative_assets

  # Pre-gzip Assets
  activate :gzip

  # Compress PNGs after build
  # First: gem install middleman-smusher
  require "middleman-smusher"
  activate :smusher

  # Or use a different image path
  # set :http_path, "/Content/images/"
end
