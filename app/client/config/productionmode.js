angular.module("snippetSaver")
  .config(($compileProvider) => {
    $compileProvider.debugInfoEnabled(false);
    $compileProvider.commentDirectivesEnabled(false);
    $compileProvider.cssClassDirectivesEnabled(false)
  });