angular.module('snippetSaver')
  .controller('SnippetDetailCtrl', function(SnippetService, $stateParams, $state){
    var ctrl = this;

    ctrl.showPreview = true;

    ctrl.updateLanguages = function() {
        SnippetService.updateSnippet(this.loadedSnippet);
    };

    SnippetService
      .getSnippetById(parseInt($stateParams.id))
      .then((data) => {
        this.loadedSnippet = data;
      })
  })

  .run(function($document, $state){
    $document.on('keydown', function(e) {
        if ((e.which == '115' || e.which == '83' ) && (e.ctrlKey || e.metaKey))
        {
            e.preventDefault();
            $state.go('root.mainBrowse');
            return false;
        }
        return true;
    });
  })
  ;