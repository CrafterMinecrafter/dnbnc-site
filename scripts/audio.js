async function loadConfig() {
    try {
        const response = await fetch('https://dnbnc.vercel.app/config.json');
        const config = await response.json();

        // Создаем APlayer
        const ap = new APlayer({
            container: document.getElementById('aplayer'),
            autoplay: false,
            loop: 'all',
            order: 'list',
            audio: config.audioFiles.map((file) => ({
                name: file.name, // Имя трека
                artist: file.artist, // Автор трека
                url: file.url, // Путь к MP3 файлу
                cover: file.cover, // Путь к обложке
            })),
        });
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

loadConfig();
