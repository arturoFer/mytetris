class Music{

	constructor(){
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
	}

	private async getSource(){
		const audioContext = new AudioContext();
		const response = await fetch('../assets/music.mp3');
		const arrayBuffer = await response.arrayBuffer();
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		const source = audioContext.createBufferSource();
		source.buffer = audioBuffer;
		source.connect(audioContext.destination);
		return source;
	}

	public async start(){
		const source = await this.getSource();
		source.start(0, 3.7203, 3.6224);
	}

	public async clear(){
		const source = await this.getSource();
		source.start(0, 0, 0.7675);
	}

	public async fall(){
		const source = await this.getSource();
		source.start(0, 1.2558, 0.3546);
	}

	public async gameover(){
		const source = await this.getSource();
		source.start(0, 8.1276, 1.1437);
	}

	public async rotate(){
		const source = await this.getSource();
		source.start(0, 2.2471, 0.0807);
	}

	public async move(){
		const source = await this.getSource();
		source.start(0, 2.9088, 0.1437);
	}
		
}

export default Music;