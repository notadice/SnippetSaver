angular.module('snippetSaver')
  .service('EditorManager', function(){
    var service = {
      editors:{},
      snippetIdToEditor:function(snippetId){
        return service.editors[snippetId];
      },
      updateEditorMap:function(snippetId, editor){
        service.editors[snippetId] = editor;
      }
    }
    return service;
  });