const textDM = document.querySelector('.textDM');
const textComment = document.querySelector('.textComment');

textDM.addEventListener('input', (event)=>{
    console.log('sentT');
    chrome.runtime.sendMessage({'textDM': textDM.value, "textComment": textComment.value});
});
textComment.addEventListener('input', (event)=>{
    console.log('sentC');
    chrome.runtime.sendMessage({'textDM': textDM.value, "textComment": textComment.value});
});

chrome.runtime.sendMessage({'getData': 'tell me'}, function (response) {
    console.log(response);
    if (response.textToPost){
        textComment.value = response.textToPost;
    }
    if (response.textToDM){
        textDM.value = response.textToDM;
    }
    if (response.launched === false){
        chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, function(tabs){
            chrome.tabs.update({url: tabs[0].url.replace('www', 'm')}, ()=>{});
        });
    }
    if (response.noData){
    }
});

chrome.tabs.onUpdated.addListener(()=>{
    chrome.runtime.sendMessage({'launch': true});
});