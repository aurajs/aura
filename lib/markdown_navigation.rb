module MarkdownNavigation

  class MarkdownNavigationGenerator < Redcarpet::Render::Base
    def header (txt, lvl)
      level = lvl
      @prev_lvl ||= 1
      return if lvl.to_i > 2
      s = ""
      s += "<ul class='nav nav-list'>" if lvl > @prev_lvl
      s += "</li></ul></li>" if lvl < @prev_lvl
      s += "</li>" if lvl == @prev_lvl
      s +="<li class='level_#{lvl}'><a href=\"\##{txt.parameterize}\">#{txt}</a>"
      @prev_lvl = lvl
      s
    end
  end

  class << self
    def registered(app)
      app.helpers MarkdownNavigationHelpers
    end

    alias :included :registered
  end

  module MarkdownNavigationHelpers
    def markdown_navigation(page)
      Redcarpet::Markdown.new(::MarkdownNavigation::MarkdownNavigationGenerator).render open(page.source_file).read
    end
  end

end

::Middleman::Extensions.register(:markdown_navigation, MarkdownNavigation)

