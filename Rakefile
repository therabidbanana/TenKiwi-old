require 'rubygems'
require 'closure-compiler'
require 'yui/compressor'
require 'base64'

task :default => [:build, :build_no_jquery]

desc "Build into a single html file"
task :build do
  @css = YUI::CssCompressor.new
  @js = Closure::Compiler.new(:compilation_level => 'ADVANCED_OPTIMIZATIONS', :externs => "source/jquery.js")
  @jq = Closure::Compiler.new(:compilation_level => 'WHITESPACE_ONLY')
  build_js = @js.compile(File.open("source/raw.js", 'r'))
  jquery = File.open('source/jquery-1.4.2.min.js', 'r').read.gsub(/[\\]/,'\\\\\0')
  build_css = @css.compress(File.open('source/raw.css', 'r'))
  build_css.gsub!(EMBED_REPLACER) do |url|
    "url(\"data:#{mime_type($1)};charset=utf-8;base64,#{encoded_contents($1)}\")"
  end
  build_html = File.open('source/raw.html', 'r').read
  build_html.gsub!('<script src="./jquery-1.4.2.min.js"></script>', "<script>#{jquery}</script>")
  build_html.gsub!('<script src="./raw.js"></script>', "<script>#{build_js}</script>")
  build_html.gsub!('<link rel="stylesheet" href="./raw.css" type="text/css" media="screen" title="main" charset="utf-8">', "<style>#{build_css}</style>")
  File.open('build_jq.html', 'w+').write(build_html)
  puts "Built TenKiwi with jQuery inlined"
end

desc "Build into a single html file requiring external JQuery"
task :build_no_jquery do
  @css = YUI::CssCompressor.new
  @js = Closure::Compiler.new(:compilation_level => 'ADVANCED_OPTIMIZATIONS', :externs => "source/jquery.js")
  build_js = @js.compile(File.open("source/raw.js", 'r'))
  build_css = @css.compress(File.open('source/raw.css', 'r'))
  build_css.gsub!(EMBED_REPLACER) do |url|
    "url(\"data:#{mime_type($1)};charset=utf-8;base64,#{encoded_contents($1)}\")"
  end
  build_html = File.open('source/raw.html', 'r').read
  build_html.gsub!('<script src="./jquery-1.4.2.min.js"></script>', "<script src='#{JQUERY_LIB}'></script>")
  build_html.gsub!('<script src="./raw.js"></script>', "<script>#{build_js}</script>")
  build_html.gsub!('<link rel="stylesheet" href="./raw.css" type="text/css" media="screen" title="main" charset="utf-8">', "<style>#{build_css}</style>")
  File.open('build.html', 'w+').write(build_html)
  puts "Built TenKiwi without jQuery"
end

JQUERY_LIB = "http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"

# Adapted from jammit - code for inlining images
# Copyright (c) 2009 Jeremy Ashkenas, DocumentCloud
# http://github.com/documentcloud/jammit/
EMBED_MIME_TYPES = {
      '.png'  => 'image/png',
      '.jpg'  => 'image/jpeg',
      '.jpeg' => 'image/jpeg',
      '.gif'  => 'image/gif',
      '.tif'  => 'image/tiff',
      '.tiff' => 'image/tiff',
      '.ttf'  => 'font/truetype',
      '.otf'  => 'font/opentype'
    }
EMBED_REPLACER  = /url\((__EMBED__.+?)(\?\d+)?\)/

# Return the Base64-encoded contents of an asset on a single line.
def encoded_contents(asset_path)
  data = File.open(File.join('source', asset_path), 'rb') {|f| f.read }
  Base64.encode64(data).gsub(/\n/, '')
end

# Grab the mime-type of an asset, by filename.
def mime_type(asset_path)
  EMBED_MIME_TYPES[File.extname(asset_path)]
end
