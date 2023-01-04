function updateVoiceList() {
    fetch("https://kana.renorari.net/api/v2/voice").then((response) => {
        if (response.status == 200) {
            response.json().then((voices) => {
                var voiceList = document.getElementById("voiceid");
                voiceList.innerHTML = "";
                Object.keys(voices).forEach((key) => {
                    var optionElement = document.createElement("option");
                    optionElement.value = key;
                    optionElement.innerHTML = voices[key].name;
                    voiceList.appendChild(optionElement);
                });
            }).catch((error) => {
                console.error(error);
            });
        } else {
            response.text().then((text) => {
                console.error(text);
            }).catch((error) => {
                console.error(error);
            });
        }
    });
}

function loginButtonReset() {
    document.querySelector("#loginbutton").attributes.removeNamedItem("disabled");
    document.querySelector("#loginbutton").innerHTML = "ログイン";
}

document.querySelector("#loginbutton").addEventListener("click", () => {
    document.querySelector("#loginbutton").attributes.setNamedItem(document.createAttribute("disabled"));
    document.querySelector("#loginbutton").innerHTML = "<span class=\"material-symbols-rounded rotate big\">sync</span>";
    if (document.querySelector("#userid").value == "" || document.querySelector("#password").value == "") {
        if (document.querySelector("#userid").value == "") {
            loginButtonReset();
            document.querySelector("label[for=\"userid\"]").style.color = "var(--warn-color)";
            document.querySelector("label[for=\"userid\"]").innerHTML = "ユーザーID - 入力してください";
        }
        if (document.querySelector("#password").value == "") {
            loginButtonReset();
            document.querySelector("label[for=\"password\"]").style.color = "var(--warn-color)";
            document.querySelector("label[for=\"password\"]").innerHTML = "パスワード - 入力してください";
        }
    } else {
        document.querySelector("label[for=\"userid\"]").style.color = "var(--label-color)";
        document.querySelector("label[for=\"userid\"]").innerHTML = "ユーザーID";
        document.querySelector("label[for=\"password\"]").style.color = "var(--label-color)";
        document.querySelector("label[for=\"password\"]").innerHTML = "パスワード";
        fetch("https://kana.renorari.net/api/v2/account/info", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "user": {
                    "id": document.querySelector("#userid").value,
                    "password": document.querySelector("#password").value
                }
            })
        }).then((response) => {
            if (response.status == 200) {
                response.json().then((json) => {
                    document.querySelector("#logintitle").innerHTML = "ようこそ";
                    document.querySelector("#loginmessage").innerHTML = json.name;
                    document.querySelector("#loginbutton").innerHTML = "<span class=\"material-symbols-rounded big\">done</span>";
                    if (document.querySelector("#issavelogin").checked) localStorage.setItem("userinfo", JSON.stringify(json));
                    updateVoiceList();
                    setTimeout(() => {
                        document.querySelector("#login").classList.add("fadeout");
                        setTimeout(() => {
                            document.querySelector("#login").style.display = "none";
                        }, 499);
                    }, 500);
                }).catch((error) => {
                    document.querySelector("#loginmessage").innerHTML = "エラーが発生しました<br>もう一度お試しください";
                    console.error(error);
                    loginButtonReset();
                });
            } else if (response.status == 401) {
                document.querySelector("#loginmessage").innerHTML = "ユーザーIDまたはパスワードが違います";
                loginButtonReset();
            } else {
                document.querySelector("#loginmessage").innerHTML = "エラーが発生しました<br>もう一度お試しください";
                loginButtonReset();
                response.text().then((text) => {
                    console.error(text);
                }).catch((error) => {
                    console.error(error);
                });
            }
        });
    }
});

var audio = new Audio();

document.querySelector("#playbutton").addEventListener("click", () => {
    if (document.querySelector("#playbutton > span").innerHTML.match("play_arrow")) {
        document.querySelector("#playbutton").attributes.setNamedItem(document.createAttribute("disabled"));
        document.querySelector("#playbutton > span").innerHTML = "sync";
        document.querySelector("#playbutton > span").classList.add("rotate");
        fetch("https://kana.renorari.net/api/v2/voice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "text": document.querySelector("#text").value ? document.querySelector("#text").value : document.querySelector("#text").attributes.getNamedItem("placeholder").value,
                "voice_id": document.querySelector("#voiceid").value,
                "speed": (Number(document.querySelector("#speed").value) ? Number(document.querySelector("#speed").value) : 0.01),
                "tone": Number(document.querySelector("#tone").value),
                "intonation": Number(document.querySelector("#intonation").value),
                "user": {
                    "id": document.querySelector("#userid").value,
                    "password": document.querySelector("#password").value
                }
            })
        }).then((response) => {
            document.querySelector("#playbutton > span").classList.remove("rotate");
            document.querySelector("#playbutton").attributes.removeNamedItem("disabled");
            document.querySelector("#playbutton > span").innerHTML = "pause";
            response.blob().then((blob) => {
                audio = new Audio(URL.createObjectURL(blob));
                audio.play();
                audio.addEventListener("ended", () => {
                    document.querySelector("#playbutton > span").innerHTML = "play_arrow";
                });
            });
        }).catch((error) => {
            document.querySelector("#playbutton > span").classList.remove("rotate");
            document.querySelector("#playbutton > span").innerHTML = "play_arrow";
            document.querySelector("#playbutton").attributes.removeNamedItem("disabled");
            console.error(error);
        });
    } else if (document.querySelector("#playbutton > span").innerHTML.match("pause")) {
        audio.pause();
        document.querySelector("#playbutton > span").innerHTML = "play_arrow";
    }
});

document.querySelector("#savebutton").addEventListener("click", () => {
    if (document.querySelector("#savebutton > span").innerHTML.match("save")) {
        document.querySelector("#savebutton").attributes.setNamedItem(document.createAttribute("disabled"));
        document.querySelector("#savebutton > span").innerHTML = "sync";
        document.querySelector("#savebutton > span").classList.add("rotate");
        const text = document.querySelector("#text").value ? document.querySelector("#text").value : document.querySelector("#text").attributes.getNamedItem("placeholder").value;
        fetch("https://kana.renorari.net/api/v2/voice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "text": text,
                "voice_id": document.querySelector("#voiceid").value,
                "speed": (Number(document.querySelector("#speed").value) ? Number(document.querySelector("#speed").value) : 0.01),
                "tone": Number(document.querySelector("#tone").value),
                "intonation": Number(document.querySelector("#intonation").value),
                "user": {
                    "id": document.querySelector("#userid").value,
                    "password": document.querySelector("#password").value
                }
            })
        }).then((response) => {
            response.blob().then((blob) => {
                var a = document.createElement("a");
                a.href = window.URL.createObjectURL(blob);
                a.target = "_blank";
                const date = new Date();
                a.download = `${text.slice(0, 5)}_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.wav`;
                a.click();
                document.querySelector("#savebutton > span").classList.remove("rotate");
                document.querySelector("#savebutton > span").innerHTML = "save";
                document.querySelector("#savebutton").attributes.removeNamedItem("disabled");
            });
        }).catch((error) => {
            document.querySelector("#savebutton > span").classList.remove("rotate");
            document.querySelector("#savebutton > span").innerHTML = "save";
            document.querySelector("#savebutton").attributes.removeNamedItem("disabled");
            console.error(error);
        });
    }
});


document.querySelector("#logoutbutton").addEventListener("click", () => {
    document.querySelector("#login").style.display = "flex";
    document.querySelector("#login").classList.remove("fadeout");
    document.querySelector("#logintitle").innerHTML = "ログイン";
    document.querySelector("#loginmessage").innerHTML = "Kana Accountでログイン";
    document.querySelector("#loginbutton").innerHTML = "ログイン";
    document.querySelector("#loginbutton").attributes.removeNamedItem("disabled");
    document.querySelector("#userid").value = "";
    document.querySelector("#password").value = "";
    document.querySelector("#issavelogin").checked = false;
    document.querySelector("label[for=\"userid\"]").style.color = "var(--label-color)";
    document.querySelector("label[for=\"userid\"]").innerHTML = "ユーザーID";
    document.querySelector("label[for=\"password\"]").style.color = "var(--label-color)";
    document.querySelector("label[for=\"password\"]").innerHTML = "パスワード";
    localStorage.removeItem("userinfo");
});