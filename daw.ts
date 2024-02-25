let audioContext: AudioContext;
let mediaRecorder: MediaRecorder;
let recordedChunks: Blob[] = [];
let audioStream: MediaStream;
let trackElement: HTMLDivElement;
let isRecording = false;

// Function to initialize audio context
function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    trackElement = document.getElementById('track') as HTMLDivElement;
    trackElement.addEventListener('click', addClip);
}

// Function to start recording
function startRecording() {
    recordedChunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            audioStream = stream;
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = function(event) {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };
            mediaRecorder.start();
            isRecording = true;
        })
        .catch(function(err) {
            console.error('Error accessing microphone:', err);
        });
}

// Function to stop recording
function stopRecording() {
    mediaRecorder.stop();
    isRecording = false;
}

// Function to play recorded audio
function playRecordedAudio() {
    const blob = new Blob(recordedChunks, { type: 'audio/wav' });
    const audioURL = URL.createObjectURL(blob);
    const audioElement = new Audio(audioURL);
    audioElement.play();
}

// Function to add a clip to the track
function addClip(event: MouseEvent) {
    if (!isRecording) {
        const clipWidth = 100; // Adjust as needed
        const clipLeft = event.clientX - trackElement.getBoundingClientRect().left;
        const clip = document.createElement('div');
        clip.className = 'clip';
        clip.style.width = clipWidth + 'px';
        clip.style.left = clipLeft + 'px';
        clip.textContent = 'Clip';
        trackElement.appendChild(clip);
    }
}

// Event listeners
document.getElementById('playButton').addEventListener('click', playRecordedAudio);
document.getElementById('recordButton').addEventListener('click', function() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
});
document.getElementById('stopButton').addEventListener('click', stopRecording);

// Initialize audio context when the page loads
window.onload = initAudio;