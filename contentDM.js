let mainText;

chrome.runtime.onMessage.addListener(function(request, sender){
    if (request.textToDM){
        mainText = request.textToDM;
    }
});

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        setTimeout(()=>{
            send()
        }, 1500)
    }
};

function send() {
    if (mainText) {
        console.log('logs before clipboard write + ' + mainText);
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state === "granted" || result.state === "prompt") {
                navigator.clipboard.writeText(mainText)
                    .then(() => {
                        console.log('logs after clipboard write');
                        const block = document.querySelector('._4_j4');
                        block.click();
                        document.execCommand('paste');
                        setTimeout(() => {
                            const sendBtn = document.querySelector('._30yy._38lh._7kpi');
                            sendBtn.click();
                        }, 500)
                    });
            }
        });
    }
    else {
        setTimeout(()=>{
            send();
        }, 500)
    }
}