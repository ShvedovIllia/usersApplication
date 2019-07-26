var result = document.getElementById('showResultJson');
var showResultTag = document.getElementById('showResult');
var userCounter = document.getElementById('userCounter');
var usersJson;
var usersArray;

fetch("https://jsonplaceholder.typicode.com/users").then(function (response) {
    return response.json();
}).then(
    function (jsondata) {
        usersJson = JSON.stringify(jsondata, null, 2);
        usersArray = JSON.parse(usersJson);
    }
)

function changeToJsonView() {
    showResultTag.innerHTML = '<pre id="showResultJson"></pre>'
    result = document.getElementById('showResultJson');
    showResultTag = document.getElementById('showResult');
}

function showAllUsers() {
    usersArray = JSON.parse(usersJson);
    result.innerHTML = usersJson;
    userCounter.innerHTML = 'Found ' + usersArray.length + ' users!';
}

function hideAllUsers() {
    result.innerHTML = '';
    userCounter.innerHTML = 'Found 0 users! =(';
}

function toogleUsers() {
    if (result.textContent == '') {
        result.innerHTML = JSON.stringify(usersArray, null, 2);
        userCounter.innerHTML = 'Found ' + usersArray.length + ' users!';
    } else {
        hideAllUsers();
    }
}
var changer = new changeStatus();

function sortInReverseOrderById() {
    let status = changer.change();
    status == false ? usersArray.sort((a, b) => a.id - b.id) : usersArray.sort((a, b) => b.id - a.id);
    result.innerHTML = JSON.stringify(usersArray, null, 2);
    userCounter.innerHTML = 'Found ' + usersArray.length + ' users!';
}

function changeStatus() {
    let status;
    this.change = function () {
        status = !status;
        return status;
    }
}

function sortByName() {
    let status = changer.change();
    usersArray.sort((a, b) => {
        if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return status == true ? 1 : -1;
        }
        if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return status == true ? -1 : 1;
        }
        return 0;
    });
    result.innerHTML = JSON.stringify(usersArray, null, 2);
    userCounter.innerHTML = 'Found ' + usersArray.length + ' users!';
}

function searchByName() {
    let names = [];
    let searchValue = document.getElementById('searchField').value;
    for (let i = 0; i < usersArray.length; i++) {
        if (usersArray[i].name.match(searchValue)) {
            names.push(usersArray[i]);
        }
    }
    result.innerHTML = JSON.stringify(usersArray, null, 2);
    userCounter.innerHTML = 'Found ' + usersArray.length + ' users!';
}
var counter = new itemIdCounter();

function changeShowPanelToCards() {
    hideAllUsers();
    for (let i = 0; i < usersArray.length; i++) {
        createDivForCard();
        document.getElementById('div' + counter.getCount()).innerHTML =
            "<p class='classOfCards'>Id: " + usersArray[i].id + "</p>" +
            "<p>Name: " + usersArray[i].name + "</p>" +
            "<p>Username: " + usersArray[i].username + "</p>" +
            "<p>Email: " + usersArray[i].email + "</p>" +
            "<p>Phone: " + usersArray[i].phone + "</p>" +
            "<p>Website: " + usersArray[i].website + "</p>" +
            "<p>City: " + usersArray[i].address.city + "</p>";
    }
}

function hideAllCards() {
    showResultTag.innerHTML = '';
}

function getHtml() {
    let html = "<div style='width: 70%; display:inline-block;'>" +
        "<p class='classOfCards'>Id: " + document.getElementById('idOfNewCard').value + "</p>" +
        "<p>Name: " + document.getElementById('nameOfNewCard').value + "</p>" +
        "<p>Username: " + document.getElementById('usernameOfNewCard').value + "</p>" +
        "<p>Email: " + document.getElementById('emailOfNewCard').value + "</p>" +
        "<p>Phone: " + document.getElementById('phoneOfNewCard').value + "</p>" +
        "<p>Website: " + document.getElementById('websiteOfNewCard').value + "</p>" +
        "<p>City: " + document.getElementById('cityOfNewCard').value + "</p>" +
        "</div><div style='width: 30%; display:inline-block;'>" +
        "<img width=230px src='https://i.pinimg.com/originals/54/ce/4f/54ce4f9a4d20898ebdfcef56e380c9a3.jpg'></div>";
    return html;
}
var style = "border: 1px solid black; border-radius: 10px; margin: 20px; padding: 20px;" +
    "font-family: Franklin Gothic Medium,Franklin Gothic,ITC Franklin Gothic,Arial,sans-serif; " +
    "background-color: aliceblue; box-shadow:" +
    "inset 0 5px 3px rgba(255,255,255,0.3), " +
    "inset 0 -5px 3px rgba(0,0,0,0.3)," +
    "2px 2px 2px rgba(255,255,255,0.9);)";

function addCard() {
    createDivForCard();
    document.getElementById('div' + counter.getCount()).innerHTML = getHtml();
}

function itemIdCounter() {
    let count = 0;
    this.increment = function () {
        count++;
        return count;
    }
    this.getCount = function () {
        return count;
    }
}

function editCard() {
    let idToChange = 'Id: ' + document.getElementById('idOfNewCard').value;
    let pTagsInCards = document.getElementsByClassName('classOfCards');
    for (let i = 0; i < pTagsInCards.length; i++) {
        if (pTagsInCards[i].textContent == idToChange) {
            document.getElementById(pTagsInCards[i].parentElement.id).innerHTML = getHtml();
        }
    }
}

function createDivForCard() {
    let div = document.createElement("div");
    div.setAttribute('style', 'width: 100%;');
    div.id = 'div' + counter.increment();
    div.setAttribute('style', style);
    showResultTag.appendChild(div);
    return div;
}