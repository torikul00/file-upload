const express = require('express')
const app = express()
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname)
        const fileName = file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-') + '-' + Date.now()
        cb(null, fileName + fileExt)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10000000 //1MB
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'avater') {
            if (
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/png' ||
                file.mimetype === 'image/jpeg'
            ) {
                cb(null, true)
            } else {
                cb(new Error('only image file can upload'))
            }
        }
        else if (file.fieldname === 'doc') {
            if (file.mimetype === 'application/pdf') {
                cb(null, true)
            } else {
                cb(new Error('Only PDF file can be upload'))
            }
        }
        else {
            cb(new Error('unknown error found !'))
        }

    }
})
// default error handler 
app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            res.send('there is a multer error')
        }
        res.status(500).send(err.message)
    } else {
        res.send("success")
    }
})


app.post('/', upload.fields([
    { name: 'avater', maxCount: 3 },
    { name: 'doc', maxCount: 3 }
]), (req, res) => {
    console.log(req.files)
    res.send('File uploaded')
})

app.listen(3000, () => {
    console.log('App listening on port 3000')
})




