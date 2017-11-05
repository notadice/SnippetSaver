{
  class SnippetService {
    constructor(DownloadService, $rootScope, $q, $http){
      var self = this;
      this.snippets = [];
      this.currentID = 0;
      this.currentSnippet = {};

      this.$rootScope = $rootScope;
      this.$q = $q;
      this.DownloadService = DownloadService;
      this.store = null;
      this.idbSnippets = {
  get(db, key) {
    return db.transaction('snippets')
      .objectStore('snippets').get(key);
  },
  getAll(db) {
    return db.transaction('snippets')
      .objectStore('snippets').getAll();
  },
  set(db, key, val) {
    var tx = db.transaction('snippets', 'readwrite');
    if (key) {
        tx.objectStore('snippets').put(val, key);
    } else {
        tx.objectStore('snippets').put(val);
    }
    return tx.complete;
  },
  setArray(db, keyField, arr) {
    var tx = db.transaction('snippets', 'readwrite');
    _.forEach(arr, function(val) {
        if (keyField) {
            tx.objectStore('snippets').put(val, val[keyField]);
        } else {
            tx.objectStore('snippets').put(val);
        }
    });
    return tx.complete;
  },
  delete(db, key) {
    var tx = db.transaction('snippets', 'readwrite');
    tx.objectStore('snippets').delete(key);
    return tx.complete;
  },
  clear(db) {
    var tx = db.transaction('snippets', 'readwrite');
    tx.objectStore('snippets').clear();
    return tx.complete;
  },
  keys(db) {
    return db.transaction('snippets')
        .objectStore('snippets')
        .getAllKeys();
  }
};

      function openStore() {
        idb.open('snippetSaverDB', 1, function(db) {
            db.createObjectStore('snippets');
        }).then(function(db) {
            self.store = db;

            self.idbSnippets.keys(db).then(function(keys) {
                if (!keys.length) {
                    $http.get('data.json').then((resp) => {
                        var timestamp = Math.floor(new Date().getTime() / 1000);
                        self.snippets = resp.data;
                        self.currentID = _.last(self.snippets).id + 1;
                        _.forEach(self.snippets, function(snippet) {
                            if ("undefined" === typeof snippet.created) {
                                snippet.created = timestamp - ((self.currentID - snippet.id) * 1000);
                            }
                        });
                        // Sort in descending order of created date (most recent first)
                        self.snippets.sort(function(a, b) {
                            return b.created - a.created;
                        });
                        self.idbSnippets.setArray(self.store, null, resp.data).then(function() {
                            // Do nothing
                        });
                        self.$rootScope.$apply();
                        console.log("Loaded Snippet is " + JSON.stringify(self.snippets));
                        console.log("Current ID = " + JSON.stringify(self.currentID));
                    });
                } else {
                    self.idbSnippets.getAll(self.store).then(function(snippets) {
                        var timestamp = Math.floor(new Date().getTime() / 1000);
                        self.snippets = snippets;
                        self.currentID = Math.max.apply(Math,self.snippets.map(function(o){return o.id;}));
                        //self.snippets.map(function(o){o.searchText = o.title +  " " + o.languages.join(" ");});
                        self.snippets.map(function(o){
                            if(o.languages && o.languages.length > 0 )
                                o.searchText = o.title +  " " +  o.languages.join(" ") ;
                            else
                                o.searchText = o.title ;
                        });
                        _.forEach(self.snippets, function(snippet) {
                            if ("undefined" === typeof snippet.created) {
                                snippet.created = timestamp - ((self.currentID - snippet.id) * 1000);
                            }
                        });
                        // Sort in descending order of created date (most recent first)
                        self.snippets.sort(function(a, b) {
                            return b.created - a.created;
                        });
                        self.$rootScope.$apply();
                        console.log("Loaded Snippet is " + JSON.stringify(self.snippets));
                        console.log("Current ID = " + JSON.stringify(self.currentID));
                    });
                }
            });
        })
        .catch(function(err) {
            console.log("Error opening snippet saver DB!", err);
        });
      }

        openStore();
    }

    addSnippet(snippet){
      snippet.id = ++this.currentID;
      snippet.created = Math.floor(new Date().getTime() / 1000);
      console.log("Adding Snippet " + JSON.stringify(snippet));
      if(snippet.languages && snippet.languages.length > 0 ) {
        snippet.languages = snippet.languages
        .filter(function(value, index, self) {
            return self.indexOf(value) === index;
        });
        snippet.searchText = snippet.title +  " " +  snippet.languages.join(" ") ;
      } else
        snippet.searchText = snippet.title ;

      console.log("Adding = " + JSON.stringify(snippet));
      this.snippets.unshift(angular.copy(snippet));
      //this.snippets.push(angular.copy(snippet));
      this.saveSnippet(snippet);
      this.currentSnippet = {};
    }

    updateSnippet(snippet) {
      console.log("Updating snippet " + JSON.stringify(snippet));
      if(snippet.languages && snippet.languages.length > 0 ) {
        snippet.languages = snippet.languages
        .filter(function(value, index, self) {
            return self.indexOf(value) === index;
        });
        snippet.searchText = snippet.title +  " " +  snippet.languages.join(" ") ;
      } else
        snippet.searchText = snippet.title ;

      console.log("Updating = " + JSON.stringify(snippet));
      var index = _.findIndex(this.snippets, function(s) {
        return s.id === snippet.id;
      });
      if (-1 !== index) {
        this.snippets.splice(index, 1, snippet);
      } else {
        this.snippets.unshift(angular.copy(snippet));
      }
      this.saveSnippet(snippet);
      this.currentSnippet = {};
    }

    deleteSnippet(snippetId){
      console.log("PRIOR -> " + JSON.stringify(this.snippets) );
      this.snippets = _.filter(this.snippets, (obj) => obj.id!=snippetId);
      if (this.store) {
          this.idbSnippets.delete(this.store, snippetId).then(function() {
            // Do nothing
          });
      }
      console.log(JSON.stringify(this.snippets));
    }

    getSnippetById(id){
      return this.$q.when(_.find(this.snippets, {id:id}))
    }

    saveSnippet(snippet) {
        if (this.store) {
            return this.idbSnippets.set(this.store, null, snippet).then(function() {
                // Do nothing
            });
        }
    }

    saveFile(){
      this.DownloadService(angular.toJson(this.snippets), "data.json", "json");
    }

    loadFile(file){
      var fr = new FileReader();
      var self = this;

      fr.onload = (e) => {
        this.snippets = angular.fromJson(fr.result);
        var timestamp = Math.floor(new Date().getTime() / 1000);
        _.forEach(self.snippets, function(snippet) {
            if ("undefined" === typeof snippet.created) {
                // Sort in reverse order of ID
                snippet.created = timestamp - ((self.currentID - snippet.id) * 1000);
            }
        });
        // Sort in descending order of created date (most recent first)
        self.snippets.sort(function(a, b) {
            return b.created - a.created;
        });
        self.idbSnippets.clear(self.store).then(function() {
            self.idbSnippets.setArray(self.store, null, self.snippets).then(function() {
                // Do nothing
            });
        })
        .catch(function() {
            // No items in db, but that's okay
            var timestamp = Math.floor(new Date().getTime() / 1000);
            _.forEach(self.snippets, function(snippet) {
                if ("undefined" === typeof snippet.created) {
                    // Sort in reverse order of ID
                    snippet.created = timestamp - ((self.currentID - snippet.id) * 1000);
                }
            });
            // Sort in descending order of created date (most recent first)
            self.snippets.sort(function(a, b) {
                return b.created - a.created;
            });
            self.idbSnippets.setArray(self.store, null, self.snippets).then(function() {
                // Do nothing
            });
        });
        self.snippets.map(function(o){
          if(o.languages && o.languages.length > 0 )
          o.searchText = o.title +  " " +  o.languages.join(" ") ;
          else
          o.searchText = o.title ;
        });

        //this.currentID = _.last(this.snippets).id + 1;
        this.currentID = Math.max.apply(Math,this.snippets.map(function(o){return o.id;}));

        this.$rootScope.$apply();
      }
      fr.readAsText(file[0]);
    }
  }

  SnippetService.$inject['DownloadService', '$rootScope', '$q', '$http']

  angular.module('snippetSaver')
  .service('SnippetService', SnippetService);
}
