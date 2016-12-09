var EsHead = (function (EsHead) {

  EsHead.pluginName = "eshead.hawtio";
  EsHead.log = Logger.get(EsHead.pluginName);

  angular.module(EsHead.pluginName, ['hawtioCore'])
    .run(function () {
      EsHead.log.debug("plugin running");
    })
    .directive('eshead', function() {
      return {
        restrict: 'A',
        scope: false,
        link: function($scope, $element, $attrs) {
          $scope.app = new app.App($element, {
            id: "es",
            base_uri: new Jolokia(Core.getJolokiaUrl()).execute("io.fabric8.insight:type=Elasticsearch2","getRestUrl","insight")
          });
        }
      };
    });

  return EsHead;
}(EsHead || {}));

hawtioPluginLoader.registerPreBootstrapTask(function (nextTask) {
  hawtioPluginLoader.addModule(EsHead.pluginName);

  Core.addCSS('../hawtio-eshead/vendor.css');
  Core.addCSS('../hawtio-eshead/hawtioPlugin.css');

  nextTask();
});
