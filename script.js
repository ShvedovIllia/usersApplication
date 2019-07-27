var resultTag = document.getElementById('showResultJson');
var showResultTag = document.getElementById('showResult');
var userCounter = document.getElementById('userCounter');
var counter = new itemIdCounter();
let status = false;
var usersJson;
var usersArray;

fetch("https://jsonplaceholder.typicode.com/users")
    .then(function (response) {
        return response.json();
    })
    .then(function (jsondata) {
        usersJson = JsonStringify(jsondata);
        usersArray = JSON.parse(usersJson);
    })

function changeToJsonView() {
    showResultTag.innerHTML = '<pre id="showResultJson"></pre>'
    resultTag = document.getElementById('showResultJson');
    showResultTag = document.getElementById('showResult');
}

function showAllUsers() {
    usersArray = JSON.parse(usersJson);
    resultTag.innerHTML = usersJson;
    changeCounterOnView();
}

function hideAllUsers() {
    resultTag.innerHTML = '';
    userCounter.innerHTML = 'Found 0 users! =(';
}

function toogleUsers() {
    if (resultTag.textContent == '') {
        resultTag.innerHTML = JsonStringify(usersArray);
        changeCounterOnView();
    } else {
        hideAllUsers();
    }
}

function sortInReverseOrderById() {
    changeStatus();
    sortUtil(usersArray, "id", status);
    resultTag.innerHTML = JsonStringify(usersArray);
    changeCounterOnView();
}

const JsonStringify = (json, replacer = null, space = 2) =>
    JSON.stringify(json, replacer, space)

function changeStatus() {
    console.log(status);
    status = !status
}

function changeCounterOnView() {
    userCounter.innerHTML = 'Found ' + usersArray.length + ' users!';
}

function sortByName() {
    changeStatus();
    usersArray.sort((a, b) => {
        if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return status == true ? 1 : -1;
        }
        if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return status == true ? -1 : 1;
        }
        return 0;
    });
    resultTag.innerHTML = JsonStringify(usersArray);
    changeCounterOnView();
}

function sortUtil(json, field, status) {
    console.log(json[0][field]);
    status ? json.sort((a, b) => a[field] - b[field]) : json.sort((a, b) => b[field] - a[field]);
}

function searchByName() {
    usersArray = JSON.parse(usersJson);
    let names = [];
    let searchValue = document.getElementById('searchField').value;
    for (let i = 0; i < usersArray.length; i++) {
        if (usersArray[i].name.toUpperCase().match(searchValue.toUpperCase())) {
            names.push(usersArray[i]);
        }
    }
    usersArray = names;
    resultTag.innerHTML = JsonStringify(names);
    changeCounterOnView();
}

function changeShowPanelToCards() {
    hideAllUsers();
    hideAllCards();
    for (let i = 0; i < usersArray.length; i++) {
        createDivForCard(counter.increment());
        document.getElementById('div' + counter.getCount()).innerHTML = getHtmlBasic(i);
    }
}

function hideAllCards() {
    showResultTag.innerHTML = '';
}

function getHtmlFromForm(id) {
    let html =
        "<div style='width: 70%; display:inline-block;'>" +
        "<p class='classOfCards'>Id: " + id + "</p>" +
        "<p>Name: " + document.getElementById('nameOfNewCard').value + "</p>" +
        "<p>Username: " + document.getElementById('usernameOfNewCard').value + "</p>" +
        "<p>Email: " + document.getElementById('emailOfNewCard').value + "</p>" +
        "<p>Phone: " + document.getElementById('phoneOfNewCard').value + "</p>" +
        "<p>Website: " + document.getElementById('websiteOfNewCard').value + "</p>" +
        "<p>City: " + document.getElementById('cityOfNewCard').value + "</p>" +
        "</div><div style='width: 30%; display:inline-block;'>" +
        // "<button onclick=deleteCard() id='deleteButton" + id + "'>X</button>" +
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
    createDivForCard(counter.increment());
    let user = {
        "id":document.getElementById('idOfNewCard').value,
        "name":document.getElementById('nameOfNewCard').value,
        "username":document.getElementById('usernameOfNewCard').value,
        "email":document.getElementById('emailOfNewCard').value,
        "phone":document.getElementById('phoneOfNewCard').value,
        "website":document.getElementById('websiteOfNewCard').value,
        "city":document.getElementById('cityOfNewCard').value
    }
    console.log(user);
    user = JSON.stringify(user);
    console.log(user);
    usersArray.push(user);
    document.getElementById('div' + counter.getCount()).innerHTML = getHtmlFromForm(counter.getCount());
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
            document.getElementById(pTagsInCards[i].parentElement.parentElement.id).innerHTML = getHtmlFromForm(document.getElementById('idOfNewCard').value);
        }
    }
}

function createDivForCard(id) {
    let div = document.createElement("div");
    div.setAttribute('style', 'width: 100%;');
    div.id = 'div' + id;
    div.setAttribute('style', style);
    showResultTag.appendChild(div);
    return div;
}

function deleteCard() {
    let idToChange = 'Id: ' + document.getElementById('idOfNewCard').value;
    let pTagsInCards = document.getElementsByClassName('classOfCards');
    for (let i = 0; i < pTagsInCards.length; i++) {
        if (pTagsInCards[i].textContent == idToChange) {
            usersArray.splice(i, 1);
        }
    }
    console.log(usersArray);
    hideAllCards();
    for (let i = 0; i < usersArray.length; i++) {
        createDivForCard(usersArray[i].id);
        document.getElementById('div' + usersArray[i].id).innerHTML = getHtmlBasic(i);
    }
}

function getHtmlBasic(counterOfArrayIteration) {
    let html = "<div style='width: 70%; display:inline-block;'>" +
        "<p class='classOfCards'>Id: " + usersArray[counterOfArrayIteration].id + "</p>" +
        "<p>Name: " + usersArray[counterOfArrayIteration].name + "</p>" +
        "<p>Username: " + usersArray[counterOfArrayIteration].username + "</p>" +
        "<p>Email: " + usersArray[counterOfArrayIteration].email + "</p>" +
        "<p>Phone: " + usersArray[counterOfArrayIteration].phone + "</p>" +
        "<p>Website: " + usersArray[counterOfArrayIteration].website + "</p>" +
        "<p>City: " + usersArray[counterOfArrayIteration].address.city + "</p>" +
        "</div><div style='width: 30%; display:inline-block;'>" +
        // "<button onclick=deleteCard() id='deleteButton" + usersArray[i].id + "'>X</button>" +
        "<img width=230px src='https://i.pinimg.com/originals/54/ce/4f/54ce4f9a4d20898ebdfcef56e380c9a3.jpg'></div>";
    return html;
}