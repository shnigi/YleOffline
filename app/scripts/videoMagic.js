document.addEventListener("DOMContentLoaded", function(event) {
  /* Init DB if not initialized */
  var indexedDB = window.indexedDB = window.indexedDB || window.webkitIndexedDB ||
  window.mozIndexedDB || window.OIndexedDB || 
  window.msIndexedDB;
  var open = indexedDB.open("YleOff", 1);
  open.onupgradeneeded = function() {
    var db = open.result;
    var store = db.createObjectStore("Videos");
    var store = db.createObjectStore("Clips", {keyPath: "id"});
    db.close();
  };
});
function vmSetVideoDownloadState(id='', val=0){
  /* Update DB item download status to 1 when finished downloading */
  var indexedDB = window.indexedDB = window.indexedDB || window.webkitIndexedDB ||
  window.mozIndexedDB || window.OIndexedDB || 
  window.msIndexedDB;
  var open = indexedDB.open("YleOff", 1);
  open.onsuccess = function() {
      var db = open.result;
      var tx = db.transaction("Clips", "readwrite");
      var store = tx.objectStore("Clips");
      var req = store.get(id);
      req.onsuccess = function(){
          req.result['downloaded'] = 1;
          store.put(req.result);
          }
      tx.oncomplete = function() {
          db.close();
      };  
    }
  }
function vmDownload(vId='',vTitle='',vUrl='', vDur=0) {
  /* start download operation */
  var indexedDB = window.indexedDB = window.indexedDB || window.webkitIndexedDB ||
  window.mozIndexedDB || window.OIndexedDB || 
  window.msIndexedDB;
  var open = indexedDB.open("YleOff", 1);
  open.onupgradeneeded = function() {
    var db = open.result;
    var store = db.createObjectStore("Videos");
    var store = db.createObjectStore("Clips", {keyPath: "id"});
    };
  open.onsuccess = function() {
    var db = open.result;
    var tx = db.transaction("Clips", "readwrite");
    var store = tx.objectStore("Clips");
    store.put({id: vId, title: vTitle, downloaded: 0, url: vUrl, duration: vDur});
    tx.oncomplete = function() {
      db.close();
      vmDownloadCOREOperation(vId,vTitle,vUrl);
      };  
    }
  }
function vmGetVideoList(){
  return new Promise( function(resolve, reject) {
    var indexedDB = window.indexedDB = window.indexedDB || window.webkitIndexedDB ||
    window.mozIndexedDB || window.OIndexedDB || 
    window.msIndexedDB;
    var open = indexedDB.open("YleOff", 1);
    open.onsuccess = function() {
      var db = open.result;
      var tx = db.transaction("Clips", "readwrite");
      var store = tx.objectStore("Clips");
      var req = store.getAll();
      req.onsuccess = function(){ resolve(req.result); }
      req.onerror = function(){ reject(); }
      tx.oncomplete = function() { db.close(); };
      }
    
    });
  }
function vmPlayVideoToObject (id='',objID='') {
    window.indexedDB = window.indexedDB || window.webkitIndexedDB || 
                       window.mozIndexedDB || window.OIndexedDB || 
                       window.msIndexedDB,
    IDBTransaction = window.IDBTransaction || 
                     window.webkitIDBTransaction ||
                     window.OIDBTransaction || window.msIDBTransaction;
    var indexedDB = window.indexedDB;
    var request = indexedDB.open("YleOff", 1);
    request.onerror = function (event) {
      return 0;
      };
    request.onsuccess = function (event) {
        db = request.result;     
        var transaction = db.transaction(["Videos"], "readwrite");
        transaction.objectStore("Videos").get(id).onsuccess = 
        function (event) {
        var videoFile = event.target.result;
        var URL = window.URL || window.webkitURL;
        var videoURL = URL.createObjectURL(videoFile);
        var videoElement = document.getElementById(objID);
            videoElement.setAttribute("src", videoURL);
            videoElement.play();
            return 1;
        };
      }
  }
function vmDeleteVideoFromStorage(id=''){
  return new Promise( function(resolve, reject) {
    var indexedDB = window.indexedDB = window.indexedDB || window.webkitIndexedDB ||
    window.mozIndexedDB || window.OIndexedDB || 
    window.msIndexedDB;
    var open = indexedDB.open("YleOff", 1);
    open.onsuccess = function() {
      var db = open.result;
      var tx = db.transaction("Clips", "readwrite");
      var store = tx.objectStore("Clips");

      var req = store.delete(id);
      req.onsuccess = function(){
          var tx2 = db.transaction(["Videos"],"readwrite");
          var store2 = tx2.objectStore("Videos");
          var rq2 = store2.delete(id);
          rq2.onsuccess = function(){
            resolve(1);
            }
        }
        tx.oncomplete = function() { db.close(); };  
      }   
    });  
  }
function vmDeleteAllVideosFromStorage(){
  vmGetVideoList().then((vids) => {
    vids.forEach(v => {
      vmDeleteVideoFromStorage(v['id']);
      });
    });  
  }
function vmDownloadCOREOperation(id='', title='', url='') {
   window.indexedDB = window.indexedDB || window.webkitIndexedDB ||
                      window.mozIndexedDB || window.OIndexedDB || 
                      window.msIndexedDB;
   var IDBTransaction = window.IDBTransaction || 
                        window.webkitIDBTransaction || 
                        window.OIDBTransaction || 
                        window.msIDBTransaction;
   var indexedDB = window.indexedDB;
   var request = indexedDB.open("YleOff", 1),
      db,
      createObjectStore = function (dataBase) {
        dataBase.createObjectStore("Videos");
      },
      getVideoFile = function () {
         var xhr = new XMLHttpRequest(),
         blob;
         xhr.open("GET", url, true);     
         xhr.responseType = "blob";
         xhr.addEventListener("load", function () {
            if (xhr.status === 200) {
                blob = xhr.response;
                putVideoInDb(blob);
                PushFromDB('Videon "'+title+'" lataus on valmistunut!'); /* send Local Notification to user */
                vmSetVideoDownloadState(id, 1); /* set download status to: 1 completed */
            }
            else {
                vmSetVideoDownloadState(id, -1); /* set download status to: -1 error */
            }
          }, false);
          xhr.send();
      },
      putVideoInDb = function (blob) {
         var transaction = db.transaction(["Videos"], "readwrite");
         var put = transaction.objectStore("Videos").put(blob, id);
         
      };
    request.onerror = function (event) {
        console.log("Error creating/accessing IndexedDB database");
    };
    request.onsuccess = function (event) {
        console.log("Success creating/accessing IndexedDB database");
        db = request.result;
        db.onerror = function (event) {
            console.log("Error creating/accessing IndexedDB database");
        };
        getVideoFile();
    }
    request.onupgradeneeded = function (event) {
        createObjectStore(event.target.result);
    };     
}
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
}