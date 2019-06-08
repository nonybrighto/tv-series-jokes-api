import path  from 'path';
import os  from 'os';
import * as admin from "firebase-admin";
import UUID from 'uuid-v4';

console.log(__dirname+'/service-account-key.json');
admin.initializeApp({
 
  credential: admin.credential.cert(__dirname+'/service-account-key.json'),
  storageBucket: "tv-series-jokes.appspot.com"
});

async function upload(file){

  let filePath = path.join(os.tmpdir(), file.filename);

  let date = new Date();

  let destination = date.getFullYear()+'/'+date.getMonth()+'/'+file.filename;
  let uuid = UUID();

  let bucket = admin.storage().bucket();
  let results = await bucket.upload(filePath, {
    gzip: true,
    destination: destination,
    metadata: {
      cacheControl: 'public, max-age=31536000',
      metadata: {
        firebaseStorageDownloadTokens: uuid
      }
    },
    
  });

  let url = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(results[0].name) + "?alt=media&token=" + uuid;
  return url;
}

async function remove(fileUrl){ 

  let pathStart = fileUrl.indexOf('/o/')+3;
  let pathEnd = fileUrl.indexOf('?');
  let urlPath = fileUrl.substring(pathStart, pathEnd);
  let filePath = urlPath.replace(/%2F/g, '/');
  console.log(filePath);
  let bucket = admin.storage().bucket();
  await bucket.file(filePath).delete();
}

export {admin, upload, remove};