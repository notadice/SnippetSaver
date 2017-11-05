(()=>{
  'use strict'

  angular.module('shDownloadModule', [])
  .service('DownloadService', () => {
    return (data, filename, type) => {
      var a = document.createElement("a"),
          file = new Blob([data], {type: type});
      if (window.navigator.msSaveOrOpenBlob) // IE10+
          window.navigator.msSaveOrOpenBlob(file, filename);
      else { // Others
          var url = URL.createObjectURL(file);
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);  
          }, 0); 
      }
    }
  });

})();