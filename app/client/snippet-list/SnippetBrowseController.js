angular.module("snippetSaver")
  .controller('BrowseCtrl', function(SnippetService, EditorManager, $timeout, copyTextToClipboard, $scope) {
    $scope.currentPage = 1 ;
    $scope.pageSize = 9;
    var ctrl = this;
    ctrl.SnippetService = SnippetService;
    ctrl.showDescription = {};
    $scope.searchTextInComplete = "";
    $scope.searchText = "";

    ctrl.toggleDescription = value => SnippetService.snippets.forEach( item => ctrl.showDescription[item.id] = value);


    ctrl.copy = (snippetId) => {
      var editor = EditorManager.snippetIdToEditor(snippetId);
      editor.selectAll();
      copyTextToClipboard(editor.getCopyText());

      ctrl.lastCopied = snippetId;
      $timeout(() => {
        ctrl.lastCopied = null;
      }, 1000)

      editor.getSelection().clearSelection();
    };

    ctrl.clearSearchText = function() {
      $scope.searchTextInComplete = "";
      $scope.searchText = "";
    };

    $scope.pageChangeHandler = function(num) {
      console.log("COMING page no = " + num );
    }

    // Write the code here to watch the field and then change the scope.
    $scope.keyPressed = function (keyEvent) {
      //console.log(keyEvent);
      //console.log($scope.searchTextInComplete );
    if (keyEvent.keyCode == 13) {

        console.log('presiono enter ' + $scope.searchTextInComplete);
        $scope.searchText = $scope.searchTextInComplete;

    }
};

    $scope.doSearch = function(language) {
      $scope.searchText = $scope.searchTextInComplete = language;
    }

    $scope.filterByText = function (crieteria) {
          return function(item){
            console.log("INcoming crieteria = " + crieteria);
              if(crieteria == undefined ) {
                return true ;
              }
              else {
                    var splitSearchChars = crieteria.toLowerCase().split(" ");
                  //  console.log("Item = " + JSON.stringify(item) + " Crieteria = " + crieteria);
                    var k = 0 ;
                    var found = true ;
                    //console.log("COMING Here ");
                    for(; k < splitSearchChars.length ; k++)  {
                      //console.log("COMING Here in for loop ");
                      //console.log("Search text in item = " + item.searchText) ;
                      if( item.searchText != undefined && item.searchText.toLowerCase().indexOf(splitSearchChars[k]) >= 0 )
                        found = true ;
                      else {
                        found = false;
                        break;
                      }
                  }
                   //console.log("RETURNING FOUND = " + found);
                   return found ;
              }

          }
    }
  });
