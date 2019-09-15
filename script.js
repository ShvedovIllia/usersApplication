var resultTag = document.getElementById('showResultJson');
var showResultTag = document.getElementById('showResult');
var userCounter = document.getElementById('userCounter');
var errorMessageTag = document.getElementById('errorMessage');
var counter = new itemIdCounter();
let status = true;
let viewStatus = true;
let loading = true;
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

function renderJsonView() {
    showResultTag.innerHTML = '<h1 id="userCounter">Found ' + usersArray.length + ' user =(</h1>' +
        '<pre id="showResultJson"></pre>';
    resultTag = document.getElementById('showResultJson');
    showResultTag = document.getElementById('showResult');
    resultTag.innerHTML = JsonStringify(usersArray);
    userCounterUpdate();
}

const userCounterUpdate = () => userCounter.innerHTML = 'Found ' + usersArray.length + ' users!';

function showAllUsers() {
    usersArray = JSON.parse(usersJson);
    resultTag.innerHTML = usersJson;
    userCounterUpdate();
}

function hideAllUsers() {
    resultTag.innerHTML = '';
    userCounter.innerHTML = 'Found 0 users! =(';
}

function toogleUsers() {
    if (resultTag.textContent == '') {
        resultTag.innerHTML = JsonStringify(usersArray);
        userCounterUpdate();
    } else {
        hideAllUsers();
    }
}

function sortInReverseOrderById() {
    new Promise((resolve, reject) => {
        preloaderDraw(true);
        setTimeout(() => resolve(), 1500);
    }).then(_ => {
        changeStatus();
        usersArray.sort(sortUtil('number', "id", status));
        preloaderDraw(false);
        rerender();
        userCounterUpdate();
    })
}

const JsonStringify = (json, replacer = null, space = 2) =>
    JSON.stringify(json, replacer, space)

function changeStatus() {
    status = !status
}

function sortByName() {
    new Promise((resolve, reject) => {
        preloaderDraw(true);
        setTimeout(() => resolve(), 1500);
    }).then(_ => {
        changeStatus();
        usersArray.sort(sortUtil('string', "name", status));
        preloaderDraw(false);
        userCounterUpdate();
    });
}

function sortUtil(typeOfSort, field, status) {
    switch (typeOfSort) {
        case 'number':
            return (a, b) => status ? a[field] - b[field] : b[field] - a[field];
        case 'string':
            return (a, b) => {
                if (a.name.toUpperCase() > b.name.toUpperCase()) {
                    return status ? 1 : -1;
                }
                if (a.name.toUpperCase() < b.name.toUpperCase()) {
                    return status ? -1 : 1;
                }
                return 0;
            }
    };
}

function preloaderDraw(isPreloading) {
    if (isPreloading) {
        showResultTag.innerHTML = '<img src="https://media0.giphy.com/media/9UCStxAde7lK/giphy.gif?cid=790b76115d403c2e3868643236cbc2d6&rid=giphy.gif">';
    } else {
        rerender();
    }
}

function search() {
    let searchValueEmail;
    let searchValue;
    new Promise((resolve, reject) => {
        preloaderDraw(true);
        setTimeout(() => resolve(), 1500);
    }).then(_ => {
        usersArray = JSON.parse(usersJson);
        searchValueEmail = document.getElementById('searchFieldEmail').value;
        usersArray = usersArray.filter(user => user.email.toUpperCase().match(searchValueEmail.toUpperCase()));
        searchValue = document.getElementById('searchField').value;
        usersArray = usersArray.filter(user => user.name.toUpperCase().match(searchValue.toUpperCase()));
        preloaderDraw(false);
        changeCounterOnView();
        userCounterUpdate();
    });
}

let isFirstShow = true;

function changeShowPanelToCards() {
    counter.reset();
    showResultTag.innerHTML = '<h1 id="userCounter">Found ' + usersArray.length + ' user =(</h1>' +
        '<pre id="showResultJson"></pre>';
    userCounter.innerHTML = 'Found ' + usersArray.length + ' users!';

    usersArray.forEach((element, index) => {
        createDivForCard(isFirstShow ? null : element.id, 'basic', index);
    })
    isFirstShow = false;
}

const rerender = _ => viewStatus ? renderJsonView() : changeShowPanelToCards();

function changeView() {
    new Promise((resolve, reject) => {
        preloaderDraw(true);
        setTimeout(() => resolve(), 1500);
    }).then(_ => {
        cleanUp();
        viewStatus = !viewStatus;
        preloaderDraw(false);
    });
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
    "2px 2px 2px rgba(255,255,255,0.9);) ";

function addCard() {
    new Promise((resolve, reject) => {
            preloaderDraw(true);
            setTimeout(() => resolve(createUser()), 1500);
        }).then(user => validationInput(user))
        .then(user => {
            errorMessageTag.innerHTML = '';
            createDivForCard();
            user.id = counter.getCount();
            user = JSON.stringify(user);
            usersArray.push(JSON.parse(user));
        }).catch(err => {
            errorMessageTag.innerHTML = err;
        }).finally(_ => preloaderDraw(false));
}

function cleanUp() {
    hideAllCards();
    hideAllUsers();
}

function createUser(id) {
    let user = {
        "id": null,
        "name": document.getElementById('nameOfNewCard').value,
        "username": document.getElementById('usernameOfNewCard').value,
        "email": document.getElementById('emailOfNewCard').value,
        "phone": document.getElementById('phoneOfNewCard').value,
        "website": document.getElementById('websiteOfNewCard').value,
        "address": {
            "city": document.getElementById('cityOfNewCard').value
        }
    }
    return user;
}

function itemIdCounter() {
    let count = -1;
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
    this.setValue = function (setValueNumber) {
        count = setValueNumber;
        return count;
    }
}

function editCard(clickedId) {
    let idOfDeletedBlock = document.getElementById(clickedId).parentElement.parentElement.id;
    let divId = idOfDeletedBlock.replace('div', '');
    hideAllCards();
    new Promise((resolve, reject) => {
        preloaderDraw(true);
        setTimeout(() => resolve(), 1500);
    }).then(_ => {
        usersArray.forEach((user, index) => {
            if (user.id == divId) {
                document.getElementById('nameOfNewCard').value = usersArray[index].name;
                document.getElementById('usernameOfNewCard').value = usersArray[index].username;
                document.getElementById('emailOfNewCard').value = usersArray[index].email;
                document.getElementById('phoneOfNewCard').value = usersArray[index].phone;
                document.getElementById('websiteOfNewCard').value = usersArray[index].website;
                document.getElementById('cityOfNewCard').value = usersArray[index].address.city;
                document.getElementById('idOfEditingCard').innerHTML = usersArray[index].id;
            }
        });
    }).finally(_ => preloaderDraw(false));
    document.getElementById('editPanel').setAttribute('style', 'display: block');
    document.getElementById('addCard').setAttribute('style', 'display: none');
}

function saveEdit() {
    let id = document.getElementById('idOfEditingCard').textContent;
    new Promise((resolve, reject) => {
        preloaderDraw(true);
        setTimeout(() => resolve(), 1500);
    }).then(_ => {
        usersArray.forEach((user, index) => {
            if (user.id == id) {
                preloaderDraw(false);
                let user = createUser(id);
                validationInput(user).then(user => {
                    let divToSearch = 'div' + id;
                    document.getElementById(divToSearch).innerHTML = getHtmlFromForm(id);
                    usersArray[index].name = user.name;
                    usersArray[index].username = user.username;
                    usersArray[index].email = user.email;
                    usersArray[index].phone = user.phone;
                    usersArray[index].website = user.website;
                    usersArray[index].address.city = user.address.city;
                    cancelEdit();
                }).catch(err => {
                    errorMessageTag.innerHTML = err;
                });
            }
        })
    });
}

function cancelEdit() {
    document.getElementById('nameOfNewCard').value = '';
    document.getElementById('usernameOfNewCard').value = '';
    document.getElementById('emailOfNewCard').value = '';
    document.getElementById('phoneOfNewCard').value = '';
    document.getElementById('websiteOfNewCard').value = '';
    document.getElementById('cityOfNewCard').value = '';
    document.getElementById('idOfEditingCard').innerHTML = '';
    document.getElementById('editPanel').setAttribute('style', 'display: none');
    document.getElementById('addCard').setAttribute('style', 'display: block');
    errorMessageTag.innerHTML = ''
}

function validationInput(user) {
    return new Promise((resolve, reject) => {
        if (!user.name || !user.username || !user.email || !user.phone || !user.website || !user.address.city) {
            reject(new Error('Fields cannot be empty!'));
        } else {
            resolve(user);
        }
    });
}

function createDivForCard(id = null, type = null, index = null) {
    let idOfCurrentUser;
    if (id != null) {
        idOfCurrentUser = id;
        counter.setValue(id);
    } else idOfCurrentUser = counter.increment();
    let div = document.createElement("div");
    div.setAttribute('style', 'width: 100%;');
    div.id = 'div' + idOfCurrentUser;
    div.setAttribute('style', style);
    if (type == 'basic') {
        div.innerHTML = getHtmlBasic(index, idOfCurrentUser);
    } else {
        div.innerHTML = getHtmlFromForm(idOfCurrentUser);
    }
    showResultTag.appendChild(div);
}

function deleteCard(clickedId) {
    let idOfDeletedBlock = document.getElementById(clickedId).id;
    let divId = idOfDeletedBlock.replace('deleteButton', '');
    hideAllCards();
    new Promise((resolve, reject) => {
        preloaderDraw(true);
        setTimeout(() => resolve(), 1500);
    }).then(_ => {
        usersArray = usersArray.filter(user => user.id != divId);
        preloaderDraw(false);
        showResultTag.innerHTML = '<h1 id="userCounter">Found ' + usersArray.length + ' user =(</h1>' +
            '<pre id="showResultJson"></pre>';
        userCounter.innerHTML = 'Found ' + usersArray.length + ' users!';
        counter.reset()
        usersArray.forEach((element, index) => {
            createDivForCard(element.id, 'basic', index);
        });
    });
}

function getHtmlBasic(counterOfArrayIteration, id) {
    let html = "<div style='width: 70%; display:inline-block;'>" +
        "<p class='classOfCards'>Id: " + id + "</p>" +
        "<p>Name: " + usersArray[counterOfArrayIteration].name + "</p>" +
        "<p>Username: " + usersArray[counterOfArrayIteration].username + "</p>" +
        "<p>Email: " + usersArray[counterOfArrayIteration].email + "</p>" +
        "<p>Phone: " + usersArray[counterOfArrayIteration].phone + "</p>" +
        "<p>Website: " + usersArray[counterOfArrayIteration].website + "</p>" +
        "<p>City: " + usersArray[counterOfArrayIteration].address.city + "</p>" +
        "</div><div style='width: 30%; display:inline-block;'>" +
        "<button class='deleteButtonClass' onclick=deleteCard(this.id) id='" + id + "deleteButton'>X</button>" +
        "<button class='editButtonClass' onclick=editCard(this.id) id='editButton" + id + "'>Edit</button>" +
        "<img width=230px src='https://i.pinimg.com/originals/54/ce/4f/54ce4f9a4d20898ebdfcef56e380c9a3.jpg'></div>";
    return html;
}