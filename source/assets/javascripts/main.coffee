$ ->
  pop = $('.pop')

  initPopovers = ()->
    rw = $('.row').width()
    pop.each (i,e)->
      source = $(@)
      content = $($(@).data('source')).html()
      source.data('content', content)
      # Override popover placement if we're in responsive mode
      source.data('placement','bottom') if rw<768;

  pop.on 'mouseleave', (e)-> $(@).popover('destroy')

  pop.on 'mouseenter', (e)->
    pop.not(@).popover('destroy')
    opts =
      html: true
      animation:true
    $(@).popover(opts).popover('show')

  initPopovers()

  hljs.initHighlightingOnLoad();
  $(window).smartresize -> initPopovers()

  # Auto Add ID slugs to pages.
  slug= (str="") ->
    str = str.replace(/^\s+|\s+$/g, "").toLowerCase()
    
    # remove accents, swap ñ for n, etc
    from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;"
    to = "aaaaaeeeeeiiiiooooouuuunc------"
    i = 0
    l = from.length

    while i < l
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i))
      i++

    # remove invalid chars
    # collapse whitespace and replace by -
    str.replace(/\./g, '-').replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-") # collapse dashes

  $('.container').find('h1,h2,h3').each (key,el) =>
    $el = $(el)
    _slug = slug $el.text()
    $el.attr('id', _slug);
    a = document.createElement("a")
    a.setAttribute "href", "##{_slug}"
    a.setAttribute "class", "documentation-anchor"
    a.innerHTML = ""
    $el.append a

