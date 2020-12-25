$(function() {
  
    var showInfo = function(message) {
      $('div.progress').hide();
      $('strong.message').text(message);
      $('div.alert').show();
    };

    var showDownload = function() {
      $('div.progress').hide();
      $('a.btn.btn-primary').show();
      $('hr').show();
    };


    var isReady
    $('input[type="submit"]').on('click', function(evt) {
      evt.preventDefault();
      $('div.progress').show();
      var formData = new FormData();
      var file = document.getElementById('myFile').files[0];
      formData.append('myFile', file);
      
      var xhr = new XMLHttpRequest();
      
      xhr.open('post', '/', true);
      
      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
          var percentage = (e.loaded / e.total) * 100;
          $('div.progress div.bar').css('width', percentage + '%');
        }
      };
      
      xhr.upload.onloadend = function() {
        console.log("end");
        showDownload();

      }




      xhr.onerror = function(e) {
        showInfo('An error occurred while submitting the form. Maybe your file is too big');
      };
      
      xhr.onload = function() {
        showInfo(this.statusText);
      };
      
      xhr.send(formData);


    });
    
  });