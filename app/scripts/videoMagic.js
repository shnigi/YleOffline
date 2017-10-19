import * as apiRequests from './requests.js';
import * as decrypt from './decryptUrl.js';
import config from '../../config.json';

export function vmSetVideoDownloadState(id='', val=0){
  /* Update DB item download status to 1 when finished downloading */
  let indexedDB = window.indexedDB || window.webkitIndexedDB ||
  window.mozIndexedDB || window.OIndexedDB || 
  window.msIndexedDB;
  let open = indexedDB.open("YleOff", 1);
  open.onsuccess = function() {
      let db = open.result;
      let tx = db.transaction("Clips", "readwrite");
      let store = tx.objectStore("Clips");
      let req = store.get(id);
      req.onsuccess = function(){
          req.result['downloaded'] = 1;
          store.put(req.result);
          }
      tx.oncomplete = function() {
          db.close();
      };  
    }
  }
export function vmDownload(vId='',vTitle='',vUrl='', vDur=0) {
  /* start download operation */
  let indexedDB = window.indexedDB || window.webkitIndexedDB ||
  window.mozIndexedDB || window.OIndexedDB || 
  window.msIndexedDB;
  let open = indexedDB.open("YleOff", 1);
  open.onupgradeneeded = function() {
    let db = open.result;
    let store = db.createObjectStore("Videos");
    store = db.createObjectStore("Clips", {keyPath: "id"});
    };
  open.onsuccess = function() {
    let db = open.result;
    let tx = db.transaction("Clips", "readwrite");
    let store = tx.objectStore("Clips");
    store.put({id: vId, title: vTitle, downloaded: 0, url: vUrl, duration: vDur});
    tx.oncomplete = function() {
      db.close();
      vmDownloadCOREOperation(vId,vTitle,vUrl);
      };  
    }
  }
export function vmGetVideoList(){
  return new Promise( function(resolve, reject) {
    let indexedDB = window.indexedDB || window.webkitIndexedDB ||
    window.mozIndexedDB || window.OIndexedDB || 
    window.msIndexedDB;
    let open = indexedDB.open("YleOff", 1);
    open.onsuccess = function() {
      let db = open.result;
      let tx = db.transaction("Clips", "readwrite");
      let store = tx.objectStore("Clips");
      let req = store.getAll();
      req.onsuccess = function(){ resolve(req.result); }
      req.onerror = function(){ reject(); }
      tx.oncomplete = function() { db.close(); };
      }
    
    });
  }
export function vmPlayVideoToObject (id='') {
    IDBTransaction = window.IDBTransaction || 
                     window.webkitIDBTransaction ||
                     window.OIDBTransaction || window.msIDBTransaction;
    let indexedDB = window.indexedDB || window.webkitIndexedDB || 
      window.mozIndexedDB || window.OIndexedDB || 
      window.msIndexedDB;
    let request = indexedDB.open("YleOff", 1);
    request.onerror = function (event) {
      return 0;
      };
    request.onsuccess = function (event) {
        db = request.result;     
        let transaction = db.transaction(["Videos"], "readwrite");
        transaction.objectStore("Videos").get(id).onsuccess = 
        function (event) {
        let videoFile = event.target.result;
        let URL = window.URL || window.webkitURL;
        let videoURL = URL.createObjectURL(videoFile);
        return videoURL;
        };
      }
  }
export function vmDeleteVideoFromStorage(id=''){
  return new Promise( function(resolve, reject) {
    let indexedDB = window.indexedDB || window.webkitIndexedDB ||
    window.mozIndexedDB || window.OIndexedDB || 
    window.msIndexedDB;
    let open = indexedDB.open("YleOff", 1);
    open.onsuccess = function() {
      let db = open.result;
      let tx = db.transaction("Clips", "readwrite");
      let store = tx.objectStore("Clips");

      let req = store.delete(id);
      req.onsuccess = function(){
          let tx2 = db.transaction(["Videos"],"readwrite");
          let store2 = tx2.objectStore("Videos");
          let rq2 = store2.delete(id);
          rq2.onsuccess = function(){
            resolve(1);
            }
        }
        tx.oncomplete = function() { db.close(); };  
      }   
    });  
  }
export function vmDeleteAllVideosFromStorage(){
  vmGetVideoList().then((vids) => {
    vids.forEach(v => {
      vmDeleteVideoFromStorage(v['id']);
      });
    });  
  }
function vmDownloadCOREOperation(id='', title='', url='') {
   let IDBTransaction = window.IDBTransaction || 
                        window.webkitIDBTransaction || 
                        window.OIDBTransaction || 
                        window.msIDBTransaction;
   let indexedDB = window.indexedDB || window.webkitIndexedDB ||
     window.mozIndexedDB || window.OIndexedDB || 
     window.msIndexedDB;
   let request = indexedDB.open("YleOff", 1),
      db,
      createObjectStore = function (dataBase) {
        dataBase.createObjectStore("Videos");
      },
      getVideoFile = function () {
         let xhr = new XMLHttpRequest(),
         blob;
         xhr.open("GET", url, true);     
         xhr.responseType = "blob";
         xhr.addEventListener("load", function () {
            if (xhr.status === 200) {
                blob = xhr.response;
                putVideoInDb(blob);
                //PushFromDB('Videon "'+title+'" lataus on valmistunut!'); /* send Local Notification to user */
                console.log('video success');
                vmSetVideoDownloadState(id, 1); /* set download status to: 1 completed */
            }
            else {
                vmSetVideoDownloadState(id, -1); /* set download status to: -1 error */
            }
          }, false);
          xhr.send();
      },
      putVideoInDb = function (blob) {
         let transaction = db.transaction(["Videos"], "readwrite");
         let put = transaction.objectStore("Videos").put(blob, id);
         console.log('sinne asti');
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
  let xhr = new XMLHttpRequest();
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

export const initDownload = async function(episode) {
  const contentId = episode.getId();
  const mediaId = episode.getMediaId();
  const encUrl = await apiRequests.fetchEncryptedUrl(contentId, mediaId);
  if (encUrl == null) {
    console.log('No file available');
  } else {
    const url = decrypt.decrypt(encUrl, config.secret);
    vmDownload(contentId, episode.getTitle(), url, episode.getDuration());
  }
}
