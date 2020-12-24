var ffmpeg = require('fluent-ffmpeg');
/**
 *    input - string, path of input file
 *    output - string, path of output file
 *    callback - function, node-style callback fn (error, result)        
 */
function convert(input, output, callback) {
    ffmpeg(input)
        .inputOptions([
            '-f s16be',
            '-ac 1',
            '-acodec pcm_s16le',
            '-ar 8000'
        ])
        .output(output)
        .on('end', function() {                    
            console.log('conversion ended');
            callback(null);
        }).on('error', function(err){
            console.log('error: ', e.code, e.msg);
            callback(err);
        }).run();
}

convert('./test2.wav', './output.wav', function(err){
   if(!err) {
       console.log('conversion complete');
       //...

   }
});