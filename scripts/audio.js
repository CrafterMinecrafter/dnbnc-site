async function loadConfig() {
    try {
        const response = await fetch('/config.json');
        const config = await response.json();

        const playlist = config.audioFiles.map((file, index) => ({
            title: `Track ${index + 1}`,
            mp3: file,
        }));

        // Инициализация jPlayer
        $("#jquery_jplayer_1").jPlayer({
            ready: function() {
                $(this).jPlayer("setMedia", playlist[0]); // Загружаем первую песню
            },
            swfPath: "/js", // Путь к SWF-файлам, если используется Flash
            supplied: "mp3",
            wmode: "window",
        });

        // Плейлист
        new jPlayerPlaylist({
            jPlayer: "#jquery_jplayer_1",
            cssSelectorAncestor: "#jp_container_1",
        }, playlist, {
            supplied: "mp3",
            smoothPlayBar: true,
            keyEnabled: true,
            audioFullScreen: false, // Для мобильных устройств
        });

    } catch (error) {
        console.error('Error loading config:', error);
    }
}

loadConfig();