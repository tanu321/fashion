Template.camera.events({
    'click #jadoo':function(){
     console.log("abc");
    Webcam.on( 'error', function(err) {
        console.log(err); // outputs error to console instead of window.alert
    });

    Webcam.set({
        width: 320,
        height: 240,
        dest_width: 640,
        dest_height: 480,
        image_format: 'jpeg',
        jpeg_quality: 90
    });
    Webcam.attach( '#webcam' );
}
});

Template.camera.events({
    'click .snap': function () {
        Webcam.snap( function(image) {
            Session.set('webcamSnap', image);	
        })
    }
});

Template.camera.helpers({
    image: function () {
        return Session.get('webcamSnap');
    }
});

if (Meteor.isClient) {

  Meteor.startup(function() {

    // This assigns a file upload drop zone to some DOM node
    myFiles.resumable.assignDrop($(".fileDrop"));

    // This assigns a browse action to a DOM node
    myFiles.resumable.assignBrowse($(".fileBrowse"));

    // When a file is added via drag and drop
    myFiles.resumable.on('fileAdded', function (file) {

      // Create a new file in the file collection to upload
      myFiles.insert({
        _id: file.uniqueIdentifier,  // This is the ID resumable will use
        filename: file.fileName,
        contentType: file.file.type
        },
        function (err, _id) {  // Callback to .insert
          if (err) { return console.error("File creation failed!", err); }
          // Once the file exists on the server, start uploading
          myFiles.resumable.upload();
        }
      );
    });

    // This autorun keeps a cookie up-to-date with the Meteor Auth token
    // of the logged-in user. This is needed so that the read/write allow
    // rules on the server can verify the userId of each HTTP request.
    Deps.autorun(function () {
      // Sending userId prevents a race condition
      Meteor.subscribe('myData', Meteor.userId());
      // $.cookie() assumes use of "jquery-cookie" Atmosphere package.
      // You can use any other cookie package you may prefer...
      $.cookie('X-Auth-Token', Accounts._storedLoginToken(), { path: '/' });
    });
  });
}

