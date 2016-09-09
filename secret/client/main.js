Camera = function (videoTagSelector, options) {

	this._iniShims = function() {

		if (!navigator.getUserMedia) {
			this.fail();
			return false;
		}
		return true;
	}

	this.setOnSuccess = function(callback) {
		if(!this.cameraRunning) {
			this.success = callback;
			return;
		}
		callback(this);
	}

	this.init = function(){

		this.fail = options.fail || function() { console.log('user has not accepted camera input'); };
		this.success = options.success || function() { console.log('camera input has started'); };

		if (!this._iniShims()) return false;


		this.videoObject = typeof videoTagSelector == 'string' ? $(videoTagSelector): videoTagSelector;
		this.video = this.videoObject[0];

		this.video.height = options.height || this.videoObject.height();
		this.video.width = options.width || this.videoObject.width();

		// set up stream
		navigator.getUserMedia(
			window.userMediaVideoSelector,
			_.bind(
				function (stream) {
					if (this.video.mozCaptureStream) {
						this.video.mozSrcObject = stream;
					} else {
						this.video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
					}
					this.video.play();
					this.stream = stream;
					this.success(this);
					this.cameraRunning = true;
				},
				this
			),
			this.fail
		);
	}

	this.attachCanvas = function(options){

		var cameraCanvas = options.canvas || document.createElement('canvas');
	    cameraCanvas.width = options.width || this.video.width;
	    cameraCanvas.height = options.height || this.video.height;
	    var cameraCanvasContext = cameraCanvas.getContext('2d');
	    var onUpdate =  options.onUpdate || function(){};

	    // do this every x seconds
	    setInterval(
	    	_.bind(
	    	function(){
	    		//draw image in temp canvas
	    		cameraCanvasContext.drawImage(this.video, 0, 0, cameraCanvas.width, cameraCanvas.height);
	    		onUpdate(cameraCanvas, cameraCanvasContext);
	    		return;
	    	},
	    	this),
	    	options.period || 1000
	    );

	    return cameraCanvas;
	}

	this.init();

	return this;
}

Template.camera.rendered = function(){
	var cameraNode = $(this.firstNode);
	cameraNode[0].camera = new Camera(cameraNode, {});
};

Template.camera.helpers(
    {
        cameraId: function() {
            return _.uniqueId('camera');
        }
    }
);

