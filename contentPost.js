let commentList;
let message;
let comment;
let dmList=[];

chrome.runtime.sendMessage({'launched': false});

const launch = (function() {
    let executed = false;
    return function() {
        if (!executed) {
            executed = true;
            let commentBlock = document.querySelector('._333v._45kb');
            const btnBlock = document.createElement('div');
            const chooseAll = document.createElement('button');
            chooseAll.innerText = 'Choose all';
            const spam = document.createElement('button');
            spam.innerText = 'Start mailing';
            chooseAll.addEventListener('click', (event) => {
                event.preventDefault();
                chooseAllChecks();
            });
            spam.addEventListener('click', (event) => {
                event.preventDefault();
                doSpam(message, comment);
            });
            btnBlock.appendChild(chooseAll);
            btnBlock.appendChild(spam);
            commentBlock.prepend(btnBlock);
            commentList = commentBlock.querySelectorAll('._2a_i[data-sigil="comment"]');
            Array.from(commentList).forEach(elem => {
                elem.classList.add('commentBlock');
                const checkBox = document.createElement('input');
                checkBox.setAttribute('type', 'checkbox');
                checkBox.classList.add('checkComment');
                elem.prepend(checkBox);
            });
            chrome.runtime.sendMessage({'launched': true});
        }
    }
})();

function chooseAllChecks() {
    Array.from(commentList).forEach(elem => {
            elem.querySelector('.checkComment').checked = true;
    })
}

function doSpam(dm, comment) {
    let timer = 0;
    Array.from(commentList).forEach(elem=> {
        if (elem.querySelector('.checkComment').checked === true){
            const name = elem.querySelector('._2b05');
            dmList.push(getID(name.querySelector('a').getAttribute('href')));
            if (comment){
                setTimeout(()=>{
                    sendComment(elem, comment);
                }, timer);
                timer += 3000;
            }
        }
    });
    setTimeout(()=>{
        console.log('times up', dmList);
        sendDM(dmList, message);
    }, timer+3000)
}

function sendComment(elem, text) {
            const row = elem.querySelector('._2b08._4ghu');
            row.querySelectorAll('._2b0a')[2].click();
            setTimeout(()=>{
                elem.querySelector('input[data-sigil=" mentionsHiddenInput"]').setAttribute('value', text);
                const submitBtn = elem.querySelector('._54k8._52jg._56bs._26vk._3lmf._5ljb._56bt');
                submitBtn.removeAttribute('disabled');
                submitBtn.click();
            },1000);
}

function sendDM(links, text) {
    chrome.runtime.sendMessage({'links': links, 'text': text});
}

function getID(link) {
    const baseUrl = 'https://www.messenger.com/t/';
    if (link.includes('profile.php')){
        return baseUrl + link.split('&id=')[1].split('&')[0]
    }
    else {
        return baseUrl + link.split('/')[1].split('?')[0]
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log('launyyched');
    if (request.launch){
        console.log('sentL');
        launch();
    }
    if (request.textDM || request.textComment){
        console.log('sentT');
        message = request.textDM;
        comment = request.textComment;
    }
});