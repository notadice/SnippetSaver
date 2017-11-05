// Empty module for templates to be loaded into cache during build
angular.module('templates', []);

// Main module configuration
angular.module('snippetSaver', [
  'ngStorage',
  'ui.router',
  'templates',
  'ng-showdown',
  'shDownloadModule',
  'shClipboardModule',
  'angularUtils.directives.dirPagination'
  ]
);
