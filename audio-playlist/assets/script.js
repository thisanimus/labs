class AudioPlayer {
	constructor(audioPlayer) {
		this.audioPlayer = audioPlayer;
		this.audio = this.audioPlayer.querySelector("audio");
		this.playing = false;
		this.eipsode = null;

		// Markup
		this.title = this.audioPlayer.querySelector(".title");
		this.details = this.audioPlayer.querySelector(".details");
		this.playPauseButton = this.audioPlayer.querySelector(".playpause-button");

		// Playpause
		this.playpauseButtons = document.querySelectorAll(".playpause-button");
		this.audioPlayer.dataset.playing = this.playing ? "true" : "false";

		this.playpauseButtons.forEach((playpauseButton) => {
			playpauseButton.addEventListener("playpause", (e) => {
				this.audioItem = e.detail;
				if (this.audio.src !== playpauseButton.dataset.audio) {
					this.playing = false;
					this.loadAudioItem();
				}
				this.playPause();
			});
		});

		// Time
		this.timeRange = this.audioPlayer.querySelector('input[type="range"]');
		this.timeOutput = this.audioPlayer.querySelector(".current");
		this.timeDuration = this.audioPlayer.querySelector(".duration");

		this.timeRange.addEventListener("input", () => {
			this.audio.currentTime = this.timeRange.value;
		});
		this.audio.addEventListener("timeupdate", (e) => {
			this.timeRange.value = this.audio.currentTime;
			this.timeOutput.textContent = this.toTime(this.timeRange.value);
		});

		// Skip
		this.skipForward = this.audioPlayer.querySelector(".forward");
		this.skipBack = this.audioPlayer.querySelector(".backward");
		this.skipForward.addEventListener("click", (e) => {
			this.skip(15);
		});
		this.skipBack.addEventListener("click", (e) => {
			this.skip(-15);
		});

		// Speed
		const speeds = [1, 1.5, 2];
		this.speedControl = this.audioPlayer.querySelector(".speed");
		let i = 0;
		this.speedControl.addEventListener("click", (e) => {
			i = i == 2 ? 0 : i + 1;
			this.audio.playbackRate = speeds[i];
			this.speedControl.textContent = `${speeds[i]}x`;
		});
	}
	loadAudioItem() {
		this.title.innerHTML = this.playPauseButton.dataset.title = this.audioItem.title;
		this.details.innerHTML = this.playPauseButton.dataset.details = this.audioItem.details;
		this.audio.src = this.playPauseButton.dataset.audio = this.audioItem.audio;

		this.audio.load();

		this.audio.addEventListener(
			"loadedmetadata",
			() => {
				this.timeRange.value = 0;
				this.timeRange.max = this.audio.duration;
				this.timeDuration.textContent = this.toTime(this.audio.duration);
			},
			false
		);

		this.audio.addEventListener(
			"ended",
			() => {
				this.audio.currentTime = 0;
				this.playPause();
			},
			false
		);
	}

	skip(s) {
		this.audio.currentTime = this.audio.currentTime + s;
	}

	playPause() {
		if (this.playing == true) {

			this.audio.pause();
			this.playing = false;
		} else {
			this.audio.play();
			this.playing = true;
		}
		this.playpauseButtons.forEach((button) => {
			const parent = button.parentElement;
			if (button.dataset.audio == this.audio.src) {
				parent.dataset.playing = this.playing ? "true" : "false";
				button.title = this.playing ? "Pause" : "Play";
			} else {
				parent.dataset.playing = "false";
				button.title = "Play";
			}
			this.audioPlayer.dataset.playing = this.playing ? "true" : "false";
		});
	}
	toTime(seconds) {
		let hr = Math.floor(seconds / 3600);
		let min = Math.floor((seconds - hr * 3600) / 60);
		let sec = Math.floor(seconds - hr * 3600 - min * 60);
		if (sec < 10) {
			sec = "0" + sec;
		}
		return min + ":" + sec;
	}
}

class Playpause {
	constructor(el) {
		this.playPause = el;
		this.playing = false;
		this.audio = el.dataset.audio;
		this.title = el.dataset.title;
		this.details = el.dataset.details;
		this.rta = el.dataset.rta ? true : false;

		const rtaMarkup = `
			  <div class="rta">
				  <div></div>
				  <div></div>
				  <div></div>
				  <div></div>
			  </div>`;

		this.markup = `
			  ${this.rta ? rtaMarkup : ""}
			  <button class="playpause-button" 
				  title="Play" 
				  data-audio="${this.audio}"
				  data-title="${this.title}"
				  data-details="${this.details}">
				  <span class="play">
					  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM10.622 8.415a.4.4 0 0 0-.622.332v6.506a.4.4 0 0 0 .622.332l4.879-3.252a.4.4 0 0 0 0-.666l-4.88-3.252z" fill="currentColor" /></svg>
				  </span>
				  <span class="pause">
					  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM9 9v6h2V9H9zm4 0v6h2V9h-2z" fill="currentColor" /></svg>
				  </span>
			  </button>
			  `;
		this.playPause.insertAdjacentHTML("beforeend", this.markup);
		this.playPauseButton = this.playPause.querySelector("button");

		this.playPauseButton.addEventListener("click", (e) => {
			const event = new CustomEvent("playpause", {
				detail: {
					audio: this.audio,
					title: this.title,
					details: this.details
				}
			});
			e.target.blur();
			e.target.dispatchEvent(event);
		});
	}
}

const playpauseButtons = document.querySelectorAll(".playpause");
playpauseButtons.forEach((playpauseButton) => {
	new Playpause(playpauseButton);
});

const audioPlayers = document.querySelectorAll(".audio-player");
audioPlayers.forEach((player) => {
	new AudioPlayer(player);
});
