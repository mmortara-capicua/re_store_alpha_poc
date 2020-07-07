let handleFail = function(err) {
	console.log(`Error: ${err}`);
};

let remoteContainer = document.getElementById('remote-container');
let canvasContainer = document.getElementById('canvas-container');

// Add Video Stream

function addVideoStream(streamId) {
	let streamDiv = document.createElement('div');
	streamDiv.id = streamId;
	streamDiv.style.transform='rotateY(180deg)';
	remoteContainer.appendChild(streamDiv);
}

//Remove Video Stream

function removeVideoStream(evt) {
	let stream = evt.stream;
	stream.stop();
	let remDiv = document.getElementById(stream.getId());
	remDiv.parentNode.removeChild(remDiv);
	console.log('Remote stream is removed' + stream.getId());
}

// Add Canvas

function addCanvas(streamId) {
	let video = document.getElementById(`Video ${streamId}`);
	let canvas = document.createElement('canvas');
	canvasContainer.appendChild(canvas);
	let ctx = canvas.getContext('2d');

	video.addEventListener('loadedmetadata', function(){
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
	})

	video.addEventListener(
		'play',
		function() {
			var $this = this; //cache
			(function loop() {
				if (!$this.paused && !$this.ended) {
					if ($this.width !== canvas.width) {
						canvas.width = video.videoWidth;
						canvas.height = video.videoHeight;
					}
					ctx.drawImage($this, 70, 70);
					setTimeout(loop, 1000 / 30);
				}
			})();
		},
		0
	);
}

let client = AgoraRTC.createClient({
	mode: 'live',
	codec: 'h264'
});

client.init('17052f7d2b644181b159941ed0833d22', () => console.log('Client start!'));

client.join(
	null,
	'agora-demo',
	null,
	(uid) => {
		let localStream = AgoraRTC.createStream({
			streamID: uid,
			audio: false,
			video: true,
			screen: false
		});

		localStream.init(function() {
			//console.log('Error con el ME', document.getElementById('me'))
			localStream.play('me');
			client.publish(localStream, handleFail);

			client.on('stream-added', function(evt) {
				client.subscribe(evt.stream, handleFail);
			});

			client.on('stream-subscribed', function(evt) {
				let stream = evt.stream;
				console.log(`Se a UNIDO un nuevo amiguito! ${stream}`);
				addVideoStream(stream.getId());
				stream.play(stream.getId());
				addCanvas(stream.getId());
				// client.subscribe(evt.stream, handleFail);
			});

			client.on('stream-removed', removeVideoStream);
		}, handleFail);
	},
	handleFail
);
