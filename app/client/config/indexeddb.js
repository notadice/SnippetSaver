angular.module("snippetSaver")
  .config(() => {
    idb.open('snippetSaverDB', 1, function(db) {
        db.createObjectStore('snippets', {keyPath: 'id'});
    });
  });