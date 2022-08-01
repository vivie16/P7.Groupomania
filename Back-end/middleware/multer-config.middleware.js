const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if(file.fieldname === "posts") callback(null, "../../public/uploads/post")
        else if(file.fieldname === "profil") callback(null, "../../public/uploads/profil")
        else console.log("erreur dans la destination")
    },
    filename: (req, file, callback) => {
        const name = req.body.posterId;
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage });