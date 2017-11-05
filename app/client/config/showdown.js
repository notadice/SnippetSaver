angular.module("snippetSaver")
  .config(($showdownProvider) => {
    showdown.setFlavor('github');
  });