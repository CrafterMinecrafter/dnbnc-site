async function loadConfig() {
    try {
        const response = await fetch('/config.json');
        const config = await response.json();

        // Обработка треков и извлечение метаданных
        const audioFiles = await Promise.all(
            config.audioFiles.map(async(file) => {
                const metadata = await getTrackMetadata(file);
                return {
                    name: metadata.title || "Unknown Title",
                    artist: metadata.artist || "Unknown Artist",
                    url: file,
                    cover: metadata.cover || "",
                };
            })
        );

        // Инициализация APlayer
        const ap = new APlayer({
            container: document.getElementById('aplayer'),
            theme: '#1f1f1f',
            autoplay: false,
            loop: 'all',
            order: 'list',
            audio: audioFiles,
        });

        // Кнопка скачивания активного трека
        const downloadButton = document.getElementById('download-button');
        ap.on('listswitch', (index) => {
            downloadButton.href = audioFiles[index].url;
            downloadButton.download = audioFiles[index].name + '.mp3';
        });
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

// Извлечение метаданных с помощью jsmediatags
async function getTrackMetadata(file) {
    return new Promise((resolve) => {
        new jsmediatags.Reader(file)
            .setTagsToRead(["title", "artist", "picture"])
            .read({
                onSuccess: (tag) => {
                    const picture = tag.tags.picture;
                    const cover = picture ?
                        `data:${picture.format};base64,${arrayBufferToBase64(picture.data)}` :
                        "";
                    resolve({
                        title: tag.tags.title,
                        artist: tag.tags.artist,
                        cover,
                    });
                },
                onError: () => resolve({}),
            });
    });
}

// Помощник для преобразования ArrayBuffer в Base64
function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

loadConfig();