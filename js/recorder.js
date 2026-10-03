class MediaRecorderManager {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.videoChunks = [];
  }

  async startAudioRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(stream);
    
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.audioChunks.push(e.data);
    };

    this.mediaRecorder.start();
  }

  async startVideoRecording(videoPreviewEl) {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (videoPreviewEl) {
      videoPreviewEl.srcObject = stream;
      videoPreviewEl.play();
    }
    this.videoChunks = [];
    this.mediaRecorder = new MediaRecorder(stream);
    
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.videoChunks.push(e.data);
    };

    this.mediaRecorder.start();
  }

  stopRecording() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) return resolve(null);
      
      this.mediaRecorder.onstop = () => {
        const isVideo = this.videoChunks.length > 0;
        const chunks = isVideo ? this.videoChunks : this.audioChunks;
        const mimeType = isVideo ? 'video/webm' : 'audio/webm';
        
        const blob = new Blob(chunks, { type: mimeType });
        
        if (this.mediaRecorder.stream) {
          this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }

        resolve({ blob, type: isVideo ? 'video' : 'audio' });
      };

      this.mediaRecorder.stop();
    });
  }
}

const recorderManager = new MediaRecorderManager();