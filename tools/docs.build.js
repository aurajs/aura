({
  baseUrl: "demo/js/aura",
  paths: {
    aura_core: 'mediator',
    aura_perms: 'permissions',
    jquery: 'lib/jquery',
    underscore: 'lib/underscore'
  },
  name: "facade",
  include: ["aura_core", "aura_perms"],
  exclude: ["jquery", "underscore"],
  out: "docs/aura.js",
  optimize: "none"
})
