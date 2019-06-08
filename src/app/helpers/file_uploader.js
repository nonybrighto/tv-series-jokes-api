const multer = require('multer');
const md5 = require('md5');
const path = require("path");

class FileUploader{

    imageUploadMiddleWare({fieldName = 'image', bodyValid = null} = {}){

        let filter = (req, file, cb) => {
                if(!bodyValid || ( bodyValid && bodyValid(req.body))){
                    cb(null, true);
                }else{
                    cb(null, false);
                }
        }

        
       let storage =  multer.diskStorage({

            filename: (req, file, cb)=>{
                let currentTimeString = new Date().toISOString();
                let fileName = md5(currentTimeString+file.originalname)+path.extname(file.originalname);
                cb(null, fileName);
            }
        });
        const upload = multer({storage: storage, fileFilter: filter});
        return upload.single(fieldName);
    }

    createUploadsPath(base, fileName){

        let path1 = fileName.substr(0, 2);
        let path2 = fileName.substr(2, 2);
        let path3 = fileName.substr(4, 2);

        return 'uploads/'+base+'/'+path1+'/'+path2+'/'+path3+'/';
    }

}


module.exports = FileUploader;