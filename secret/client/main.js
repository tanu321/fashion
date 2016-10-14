Template.camera.events({
    'click #capture':function(){
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
         imageid=images.insert({src:image, timestamp: new Date()});	
        })
    }
});

Template.photo.helpers({
    image: function () {
        imagesrc = images.find({},{sort: {timestamp: -1}}).fetch();
        return imagesrc[0].src;
    }
});


