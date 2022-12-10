require("dotenv").config();
module.exports = {
    packagerConfig: {
        icon: "./assets/icon",
        asar: true,
        ignore: [
            "./src",
            "./node_modules",
            "./.git",
            "./.gitignore",
            "./.vscode",
            "./.env",
            "./README.md",
            "./LICENSE",
            "./forge.config.js",
            "./package.json",
            "./package-lock.json",
            "./.eslintrc.json",
            "./assets",
            "./out"
        ]
    },
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
            platforms: ["darwin", "win32", "win64", "linux"],
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
                prerelease: true,
                authToken: process.env.GITHUB_TOKEN
            }
        }
    ]
};
