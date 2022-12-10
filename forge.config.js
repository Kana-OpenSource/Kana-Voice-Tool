module.exports = {
    packagerConfig: {},
    rebuildConfig: {},
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                authors: "Renorari",
                description: "Kanaの音声合成ツール"
            },
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: ["all"],
        },
        {
            name: "@electron-forge/maker-deb",
            config: {
                options: {
                    maintainer: "Renorari",
                    homepage: "https://kana.renorari.net/apps/"
                }
            },
        },
        {
            name: "@electron-forge/maker-snap",
            config: {
                features: {
                    audio: true,
                    mpris: true,
                    webgl: true
                },
                summary: "Kanaの音声合成ツール"
            }
        },
    ],
    publishers: [
        {
            name: "@electron-forge/publisher-github",
            config: {
                repository: {
                    owner: "Kana-OpenSource",
                    name: "Kana-Voice-Tool"
                },
                prerelease: true
            }
        }
    ]
};
