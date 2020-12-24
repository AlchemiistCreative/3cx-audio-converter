var ffmpeg = require('fluent-ffmpeg');
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();
app.set('view engine', 'pug');
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : path.join(__dirname,'tmp'),
}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/download', (req, res) => {
    res.download(path.join(__dirname, 'public', 'output.wav'));
});


function convert(input, output, callback) {
    ffmpeg(input)
        .output(output)
        .outputOptions([
            '-ac 1',
            '-ar 8000'
        ])
        .on('end', function() {                    
            console.log('conversion ended');
            callback(null);
        }).on('error', function(err){
            console.log('error: ', e.code, e.msg);
            callback(err);
        }).run();
}


app.post('/', (req, res) => {
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let targetFile = req.files.target_file;
    let extName = path.extname(targetFile.name);
    let baseName = path.basename(targetFile.name, extName);
    let uploadDir = path.join(__dirname, 'uploads', targetFile.name);

    let csv = ['.mp3', '.wav', '.m4a', '.mp4'];
    // Checking the file type
    if(!csv.includes(extName)){
        fs.unlinkSync(targetFile.tempFilePath);
        return res.status(422).send("Invalid Image");
    }

    // if(targetFile.size > 10485760){
    //     fs.unlinkSync(targetFile.tempFilePath);
    //     return res.status(413).send("File is too Large");
    // }

    let num = 1;
    while(fs.existsSync(uploadDir)){
        filename = baseName + '-' + num + extName 
        uploadDir = path.join(__dirname, 'uploads', baseName + '-' + num + extName );
        num++;
    }

    targetFile.mv(uploadDir, (err) => {
            if (err)
                return res.status(500).send(err);

            
            convert(uploadDir, path.join(__dirname, 'public', 'output.wav'), function(err){
               if(!err) {
                   console.log('conversion complete');
                   //...
            
               }

               


            })
            res.render('download');
    });
  
});

app.listen(3000, () => console.log('Your app listening on port 3000'));



