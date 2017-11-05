angular.module('snippetSaver')
.directive('aceEditor', function($state, EditorManager){
  return {
    restrict:"A",
    scope: {
      aceEditor:'=',
      language: '=',
      relatedId: '=',
      readonly: '@'
    },
    require: '?ngModel',
    link:function(scope, iElem, iAttrs, ngModel){
      if (!ngModel) return; // do nothing if no ng-model

      scope.editor = ace.edit(iElem[0]);
      scope.editor.setTheme("ace/theme/monokai");
      console.log(scope.readonly);
      scope.editor.setReadOnly(scope.readonly=='true');

      var deregister = scope.$watchGroup(['language', 'relatedId'], function(newVals){
        var lang;
        if(!newVals || !newVals[0])
          return;
        if(newVals[0])
        {
          lang = ("string" === typeof newVals[0]) ? newVals[0] : newVals[0][0];
          if(lang=="C" || lang == "C++")
            lang = "c_cpp";
          if(lang=="JS")
            lang = "javascript";
          scope.editor.getSession().setMode({
            path: "ace/mode/"+lang.toLowerCase(),
            inline: lang === 'PHP' // setting to true fixes PHP highlighting
          });
        }
        if(newVals[1]){
          EditorManager.updateEditorMap(newVals[1], scope.editor);
        }
      })
      
      scope.editor.commands.addCommand({
          name: 'save',
          bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
          exec: function(editor) {
              $state.go('root.mainBrowse');
          },
          readOnly: true // false if this command should not apply in readOnly mode
      });


      // Specify how UI should be updated
      ngModel.$render = function() {
        scope.editor.setValue(ngModel.$viewValue || '')
        scope.editor.getSelection().clearSelection();
      };

      // Listen for change events to enable binding
      scope.editor.on('change', function() {
        scope.$evalAsync(read);
      });
      //read(); // initialize

      // Write data to the model
      function read() {
        var value = scope.editor.getValue();
        ngModel.$setViewValue(value);
      }

      scope.$on("$destroy", function() {
        scope.editor.destroy();
        delete scope.editor;
      });
    }
  }
});
