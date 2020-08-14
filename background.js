let textToDM;
let textToPost;
let launched = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log(request);
        if (request.textDM || request.textComment){
            console.log('sentT');
            textToDM = request.textDM;
            textToPost = request.textComment;
            chrome.tabs.sendMessage(tabs[0].id, {'textDM': request.textDM, 'textComment': request.textComment});
        }
        if (request.launch){
            console.log('sentL');
            chrome.tabs.sendMessage(tabs[0].id, {'launch': request.launch});
        }
        if (request.links){
            console.log(textToDM);
            if (textToDM){
                let timer = 0;
                request.links.forEach(link=>{
                    setTimeout(()=>{
                        console.log('new DM');
                        chrome.tabs.update({url: link}, ()=>{});
                    }, timer);
                    timer+=10000;
                });
            }
        }
        if (request.launched === false || request.launched === true){
            launched = request.launched;
        }
        if (request.getData){
            if (textToPost || textToDM){
                sendResponse({'textToPost': textToPost, 'textToDM': textToDM, 'launched': launched});
            }
            else{
                sendResponse({'noData': true, 'launched': launched})
            }
        }
    });
    return true;
});

chrome.tabs.onUpdated.addListener(function (){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (textToDM) {
            chrome.tabs.sendMessage(tabs[0].id,{'textToDM': textToDM});
        }
    })
});

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: {hostEquals: 'www.facebook.com', schemes: ['https'], pathContains: 'permalink' },
                    }),
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: {hostEquals: 'm.facebook.com', schemes: ['https'], pathContains: 'permalink' },
                    })
                ],
                actions: [ new chrome.declarativeContent.ShowPageAction() ]
            }
        ]);
    });
});