angular.module('snippetSaver')
  .controller('HeaderCtrl', function(SnippetService, EditorManager, $timeout, copyTextToClipboard) {
    var ctrl = this;
    ctrl.SnippetService = SnippetService;
    
    ctrl.copy = (snippetId) => {
      var editor = EditorManager.snippetIdToEditor(snippetId);
      editor.selectAll();
      copyTextToClipboard(editor.getCopyText());

      ctrl.lastCopied = snippetId;
      $timeout(() => {
        ctrl.lastCopied = null;
      }, 1000)

      editor.getSelection().clearSelection();
    }
    
  })