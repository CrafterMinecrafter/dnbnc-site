async function loadConfig() {
    try {
        const response = await fetch('/config.json');
        const config = await response.json();
        const playlist = document.getElementById('playlist');
        const audioPlayer = document.getElementById('audio-player');
        const audioSource = document.getElementById('audio-source');

        config.audioFiles.forEach((file, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `Track ${index + 1}`;
            listItem.classList.add('track');
            listItem.dataset.src = file;
            listItem.addEventListener('click', () => {
                audioSource.src = file;
                audioPlayer.load();
                audioPlayer.play();
            });
            playlist.appendChild(listItem);
        });

        // Load the first track by default
        if (config.audioFiles.length > 0) {
            audioSource.src = config.audioFiles[0];
            audioPlayer.load();
        }
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

loadConfig();