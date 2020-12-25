var ffmpeg = require('fluent-ffmpeg');
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');


const app = express();
app.set('view engine', 'pug');
app.use(fileUpload());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/download', (req, res) => {
    let outputfile = path.join(__dirname, 'public', 'output.wav'); 
    res.download(outputfile, function(err){
        fs.unlink(outputfile, function(err){
            if (err) console.log(err);
            console.log('file successfully deleted');
           })
     })


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
    let num = 0;
    let targetFile = req.files.myFile;
    let extName = path.extname(targetFile.name);
    let baseName = path.basename(targetFile.name, extName);
    let uploadDir = path.join(__dirname, 'uploads', targetFile.name);
    let outputfile = path.join(__dirname, 'public', 'output.wav');
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

 
    while(fs.existsSync(uploadDir)){
        filename = baseName + '-' + num + extName 
        uploadDir = path.join(__dirname, 'uploads', baseName + '-' + num + extName );
      
    }

    targetFile.mv(uploadDir, (err) => {
            if (err)
                return res.status(500).send(err);

            
            convert(uploadDir, outputfile, function(err){
               if(!err) {
                   console.log('conversion complete');
                   //...

                   fs.unlink(uploadDir, function(err){
                    if (err) console.log(err);
                    console.log('file successfully deleted' + outputfile);
                   
                   })
               }
            })
        
    });

});

app.listen(3000, () => console.log('listening on port 3000'));



