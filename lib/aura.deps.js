define(function() {
  // Depedencies registry

  var allDeps = { modules: {}, apps: {} };
  
  function registerDeps(ref, deps) {
    var depName;
    for (var d in deps) {
      depName = deps[d];
      if (typeof depName === 'string') {
        allDeps.modules[depName] = allDeps.modules[depName] || {};
        allDeps.modules[depName][ref] = 1;
        allDeps.apps[ref]             = allDeps.apps[ref] || {};
        allDeps.apps[ref][depName]    = 1;
      }
    }
  }

  function unregisterDeps(ref, deps) {
    var depName;
    for (var d in deps) {
      depName = deps[d];
      if (allDeps.modules[depName]) {
        delete allDeps.modules[depName][ref];
        delete allDeps.apps[ref][depName];
        if (Object.keys(allDeps.modules[depName]).length === 0) {
          delete allDeps.modules[depName];
          require.undef(depName);
        }
      }
    }
  }

});