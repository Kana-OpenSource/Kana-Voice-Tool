window.addEventListener("DOMContentLoaded", () => {
    fetch("https://rnrr.one/network_check").then((response) => {
        if (response.status == 200) {
            response.text().then((text) => {
                if (text == "ok") {
                    document.querySelector("#problem").style.display = "none";
                    if (localStorage.getItem("userinfo")) {
                        const userinfo = JSON.parse(localStorage.getItem("userinfo"));
                        document.querySelector("#userid").value = userinfo.id;
                        document.querySelector("#password").value = userinfo.password;
                        document.querySelector("#loginbutton").click();
                    }
                } else {
                    document.querySelector("#problem_title").innerHTML = "サーバーで障害が発生中";
                    document.querySelector("#problem_content").innerHTML = "サーバーに正しく接続できませんでした。<br>しばらくしてから再度お試しください。";
                }
            });
        } else {
            document.querySelector("#problem_title").innerHTML = "接続に問題";
            document.querySelector("#problem_content").innerHTML = "インターネットに接続できませんでした。<br>お使いのインターネット接続を確認してください。";
        }
    });
});