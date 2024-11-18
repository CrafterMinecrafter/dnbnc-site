async function loadConfig() {
    try {
        const response = await fetch('/config.json');
        const config = await response.json();

        // Создаем APlayer
        const ap = new APlayer({
            container: document.getElementById('aplayer'),
            autoplay: false,
            loop: 'all',
            order: 'list',
            audio: config.audioFiles.map((file, index) => ({
                name: `Track ${index + 1}`,
                artist: 'Unknown Artist',
                url: file,
                cover: '', // Укажите обложку или замените на пустую строку
            })),
        });
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

loadConfig();