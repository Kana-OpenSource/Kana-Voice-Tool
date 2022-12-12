require("dotenv").config();
module.exports = {
    packagerConfig: {
        "name": "Kana Voice Tool",
        "executableName": "KanaVoiceTool",
        "win32metadata": {
            "CompanyName": "Renorari",
            "FileDescription": "Kanaの音声合成ツール",
            "OriginalFilename": "KanaVoiceTool.exe",
            "ProductName": "Kana Voice Tool",
            "InternalName": "KanaVoiceTool"
        },
        "asar": true,
        "ignore": [
            "./src",
            "./node_modules",
            "./.git",
            "./.gitignore",
            "./.vscode",
            "./.env",
            "./README.md",
            "./LICENSE",
            "./forge.config.js",
            "./.eslintrc.json",
            "./out"
        ],
        "icon": "./assets/icon"
    },
    rebuildConfig: {},
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                authors: "Renorari",
                description: "Kanaの音声合成ツール",
                loadingGif: "./assets/install.gif",
            },
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: ["darwin", "win32", "linux"],
        },
        {
            name: "@electron-forge/maker-deb",
            config: {
                options: {
                    maintainer: "Renorari",
                    homepage: "https://kana.renorari.net"
                }
            },
        },
        {
            name: "@electron-forge/maker-rpm",
            config: {
                options: {
                    maintainer: "Renorari",
                    homepage: "https://kana.renorari.net"
                }
            }
        },
        /*{
            name: "@electron-forge/maker-flatpak",
            config: {}
        },
        {
            name: "@electron-forge/maker-snap",
            config: {}
        }*/
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
