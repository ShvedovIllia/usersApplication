var resultTag = document.getElementById('showResultJson');
var showResultTag = document.getElementById('showResult');
var userCounter = document.getElementById('userCounter');
var errorMessageTag = document.getElementById('errorMessage');
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
    resultTag.innerHTML = JsonStringify(usersArray);
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
    sortUtil('number', usersArray, "id", status);
    resultTag.innerHTML = JsonStringify(usersArray);
    changeCounterOnView();
}

const JsonStringify = (json, replacer = null, space = 2) =>
    JSON.stringify(json, replacer, space)

function changeStatus() {
    status = !status
}

function changeCounterOnView() {
    userCounter.innerHTML = 'Found ' + usersArray.length + ' users!';
}

function sortByName() {
    changeStatus();
    sortUtil('string', usersArray, "name", status);
    resultTag.innerHTML = JsonStringify(usersArray);
    changeCounterOnView();
}

function sortUtil(typeOfSort, json, field, status) {
    switch (typeOfSort) {
        case 'number':
            status ? json.sort((a, b) => a[field] - b[field]) : json.sort((a, b) => b[field] - a[field]);
            break;
        case 'string':
            json.sort((a, b) => {
                if (a.name.toUpperCase() > b.name.toUpperCase()) {
                    return status == true ? 1 : -1;
                }
                if (a.name.toUpperCase() < b.name.toUpperCase()) {
                    return status == true ? -1 : 1;
                }
                return 0;
            });
            break;
    }
}

function searchByName() {
    usersArray = JSON.parse(usersJson);
    let searchValue = document.getElementById('searchField').value;
    usersArray = usersArray.filter(user => user.name.toUpperCase().match(searchValue.toUpperCase()));
    resultTag.innerHTML = JsonStringify(usersArray);
    changeCounterOnView();
}

function changeShowPanelToCards() {
    hideAllUsers();
    hideAllCards();
    counter.reset();
    usersArray.forEach(element => {
        createDivForCard(counter.increment());
        document.getElementById('div' + counter.getCount()).innerHTML = getHtmlBasic(counter.getCount() - 1);
    });
}

function changeView() {
    changeStatus();
    status ? changeToJsonView() : changeShowPanelToCards();
}

function showJson() {
    console.log('showJson');
}

function showCards() {
    console.log('showCards');
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
        "<button class='deleteButtonClass' onclick=deleteCard(this.id) id='deleteButton" + id + "'>X</button>" +
        "<button class='editButtonClass' onclick=editCard(this.id) id='editButton" + id + "'>Edit</button>" +
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
   
    let user = {
        "id": counter.getCount(),
        "name": document.getElementById('nameOfNewCard').value,
        "username": document.getElementById('usernameOfNewCard').value,
        "email": document.getElementById('emailOfNewCard').value,
        "phone": document.getElementById('phoneOfNewCard').value,
        "website": document.getElementById('websiteOfNewCard').value,
        "address": {
            "city": document.getElementById('cityOfNewCard').value
        }
    }
    console.log(user);
    if(validationInput(user)) {
        console.log(user);
        createDivForCard(counter.increment());
        user = JSON.stringify(user);
        console.log(user);
        usersArray.push(JSON.parse(user));
        console.log(user);
        document.getElementById('div' + counter.getCount()).innerHTML = getHtmlFromForm(counter.getCount());
    } else {
        errorMessageTag.innerHTML = 'Fields cannot be empty!'
    }    
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
    this.reset = function () {
        count = 0;
        return count;
    }
}

function editCard(clickedId) {
    let idOfDeletedBlock = document.getElementById(clickedId).parentElement.parentElement.id;
    let divId = idOfDeletedBlock.replace('div', '');
    let idToChange = 'Id: ' + divId;
    let pTagsInCards = document.getElementsByClassName('classOfCards');
    Array.from(pTagsInCards).forEach(tag => {
        if (tag.textContent == idToChange) {
            usersArray[divId - 1].name = document.getElementById('nameOfNewCard').value;
            usersArray[divId - 1].username = document.getElementById('usernameOfNewCard').value;
            usersArray[divId - 1].email = document.getElementById('emailOfNewCard').value;
            usersArray[divId - 1].phone = document.getElementById('phoneOfNewCard').value;
            usersArray[divId - 1].website = document.getElementById('websiteOfNewCard').value;
            usersArray[divId - 1].address.city = document.getElementById('cityOfNewCard').value;
            if(validationInput(usersArray[divId - 1])) {
                console.log(validationInput(usersArray[divId - 1]));
                document.getElementById(tag.parentElement.parentElement.id).innerHTML = getHtmlFromForm(divId);
            } else {
                console.log(validationInput(usersArray[divId - 1]));
                errorMessageTag.innerHTML = 'Fields cannot be empty!'
            }
        }
    });
}

function validationInput(user) {
    if (user.name == '' || user.username == '' || user.email == '' || user.phone == '' ||
    user.website == '' || user.address.city == '') {
        console.log('validation input returns false');
        return false;
    } else {
        console.log('validation input returns true');
        return true;
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

function deleteCard(clickedId) {

    let idOfDeletedBlock = document.getElementById(clickedId).parentElement.parentElement.id;
    let divId = idOfDeletedBlock.replace('div', '');
    let idToChange = 'Id: ' + divId;
    let pTagsInCards = document.getElementsByClassName('classOfCards');

    pTagsInCards = Array.from(pTagsInCards).forEach((tag, index) => {
        if (tag.textContent == idToChange) {
            usersArray.splice(index, 1);
        }
    });
    hideAllCards();
    usersArray.forEach((element, index) => {
        createDivForCard(element.id);
        document.getElementById('div' + (element.id)).innerHTML = getHtmlBasic(index);
    });
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
        "<button class='deleteButtonClass' onclick=deleteCard(this.id) id='deleteButton" + usersArray[counterOfArrayIteration].id + "'>X</button>" +
        "<button class='editButtonClass' onclick=editCard(this.id) id='editButton" + usersArray[counterOfArrayIteration].id + "'>Edit</button>" +
        "<img width=230px src='https://i.pinimg.com/originals/54/ce/4f/54ce4f9a4d20898ebdfcef56e380c9a3.jpg'></div>";
    return html;
}