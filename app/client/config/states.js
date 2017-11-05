(function(){

'use strict';

angular.module('snippetSaver')
  .config(function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('root', {
        abstract:true,
        url:'/',
        views:{
          'header': {
            templateUrl:'client/layout/header.html',
            controller: 'HeaderCtrl',
            controllerAs: 'hc'
          }
        }
      })
      .state('root.mainBrowse', {
        url: '',
        views:{
          'body@':{
            templateUrl:'client/snippet-list/browse.html',
            controller: 'BrowseCtrl',
            controllerAs: 'bc', 
          }
        }
      })
      .state('root.detail', {
        url: 'snippet/:id',
        views:{
          'body@':{
            templateUrl:'client/snippet-detail/detail.html',
            controller: 'SnippetDetailCtrl',
            controllerAs: 'sdc' 
          }
        }
      })

      $urlRouterProvider.otherwise('/')
  });

})()
