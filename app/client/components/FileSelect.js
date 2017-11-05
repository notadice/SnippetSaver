
  angular.module('snippetSaver')
  .directive('fileSelect', () => {
    return {
      restrict:'A',
      scope:{fileSelect:'&'},
      link:(scope,iElem,iAttr) => iElem.on('change', event => scope.fileSelect({$event:event, files:iElem[0].files}) )
    }
  });