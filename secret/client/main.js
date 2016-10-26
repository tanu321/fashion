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
    Webcam.style.marginLeft='50%';
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


Template.crop.events({
 'click #shirts':function(){
 $(".shirts").toggle();
}
});


Template.crop.onRendered(function(){
    var condition = 1;
    var points = [];//holds the mousedown points
    var canvas = document.getElementById('myCanvas');
    this.isOldIE = (window.G_vmlCanvasManager);
    $(function() {
      //  if (document.domain == 'localhost') {

            if (this.isOldIE) {
                G_vmlCanvasManager.initElement(myCanvas);
            }
            var ctx = canvas.getContext('2d');
            var imageObj = new Image();



            function init() {
                canvas.addEventListener('mousedown', mouseDown, false);
                canvas.addEventListener('mouseup', mouseUp, false);
                canvas.addEventListener('mousemove', mouseMove, false);
            }

            // Draw  image onto the canvas
            imageObj.onload = function() {
                ctx.drawImage(imageObj, 0, 0);

            };
            imagesrc = images.find({},{sort: {timestamp: -1}}).fetch(); 
            imageObj.src = imagesrc[0].src;



            // Switch the blending mode
            ctx.globalCompositeOperation = 'destination-over';

            //mousemove event
            $('#myCanvas').mousemove(function(e) {
                if (condition == 1) {

                    ctx.beginPath();

                    $('#posx').html(e.offsetX);
                    $('#posy').html(e.offsetY);
                }
            });
            //mousedown event
            $('#myCanvas').mousedown(function(e) {
                if (condition == 1) {

                    if (e.which == 1) {
                        var pointer = $('<span class="spot">').css({
                            'position': 'absolute',
                            'background-color': '#000000',
                            'width': '5px',
                            'height': '5px',
                            'top': e.pageY,
                            'left': e.pageX


                        });
                        //store the points on mousedown
                        points.push(e.pageX, e.pageY);

                        //console.log(points);

                        ctx.globalCompositeOperation = 'destination-out';
                        var oldposx = $('#oldposx').html();
                        var oldposy = $('#oldposy').html();
                        var posx = $('#posx').html();
                        var posy = $('#posy').html();
                        ctx.beginPath();
                        ctx.moveTo(oldposx, oldposy);
                        if (oldposx != '') {
                            ctx.lineTo(posx, posy);

                            ctx.stroke();
                        }
                        $('#oldposx').html(e.offsetX);
                        $('#oldposy').html(e.offsetY);
                    }
                    $(document.body).append(pointer);
                    $('#posx').html(e.offsetX);
                    $('#posy').html(e.offsetY);
                }//condition
            });

            $('#crop').click(function() {
                condition = 0;

                //  var pattern = ctx.createPattern(imageObj, "repeat");
                //ctx.fillStyle = pattern;
                $('.spot').each(function() {
                    $(this).remove();

                })
                //clear canvas

                //var context = canvas.getContext("2d");

                ctx.clearRect(0, 0, 1000, 1000);
                ctx.beginPath();
                ctx.width = 1000;
                ctx.height = 1000;
                ctx.globalCompositeOperation = 'destination-over';
                //draw the polygon
                setTimeout(function() {


                    //console.log(points);
                    var offset = $('#myCanvas').offset();
                    //console.log(offset.left,offset.top);


                    for (var i = 0; i < points.length; i += 2) {
                        var x = parseInt(jQuery.trim(points[i]));
                        var y = parseInt(jQuery.trim(points[i + 1]));


                        if (i == 0) {
                            ctx.moveTo(x - offset.left, y - offset.top);
                        } else {
                            ctx.lineTo(x - offset.left, y - offset.top);
                        }
                        //console.log(points[i],points[i+1])
                    }

                    if (this.isOldIE) {

                        ctx.fillStyle = '';
                        ctx.fill();
                        var fill = $('fill', myCanvas).get(0);
                        fill.color = '';
                        fill.src = element.src;
                        fill.type = 'tile';
                        fill.alignShape = false;
                    }
                    else {
                        var pattern = ctx.createPattern(imageObj, "repeat");
                        ctx.fillStyle = pattern;
                        ctx.fill();

                        var dataurl = canvas.toDataURL("image/png");


                        //upload to server (if needed)
                        var xhr = new XMLHttpRequest();
                        // // 
                        xhr.open('POST', 'upload.php', false);
                        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        var files = dataurl;
                        var data = new FormData();
                        var myprod = $("#pid").val();
                        data = 'image=' + files;
                        xhr.send(data);
                        if (xhr.status === 200) {
                            console.log(xhr.responseText);
                            $('#myimg').html('<img src="upload/' + xhr.responseText + '.png"/>');
                        }



                    }
                }, 20);

            });

       // }
    });
});
