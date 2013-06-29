module MarkdownNavigation

  class MarkdownNavigationGenerator < Redcarpet::Render::Base
    def header (txt, lvl)
      level = lvl
      @prev_lvl ||= 1
      @entry ||= 0
      
      return if lvl.to_i > 2

      if(lvl==1)
        @entry+=1
        ul_attributes="accordion-group"
        li_class = 'accordion-heading'
        a_attributes = "class='accordion-toggle' data-toggle='collapse' data-parent='accordion' data-target='#accordion_#{@entry}'"
      else
        ul_attributes='collapse'
        a_attributes = ''
        li_class = ''
      end
        
      s = ""

      if lvl > @prev_lvl
        s += "<ul class='#{ul_attributes}' id='accordion_#{@entry}'>"
      elsif lvl < @prev_lvl
        s += "</li></ul></li>"
      else
        s += "</li>"
      end

      s +="<li class='level_#{lvl} #{li_class}'><a href=\"\##{txt.parameterize}\" #{a_attributes}>#{txt}"
      # s += ' <b class="caret"></b>'
      s += '</a>'

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

