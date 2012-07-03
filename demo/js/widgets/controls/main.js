define(['sandbox', './views/app'], function (sandbox, AppView) {
  return function (element) {
    new AppView({
      el: sandbox.dom.find(element)
    });
  };
});