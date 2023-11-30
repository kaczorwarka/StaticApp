    const user = JSON.parse(localStorage.getItem('user'));
    let updating = false;
    let modifing = false;
    let actualNum;
    let runs;
    let oldName;
    const runsStatus = localStorage.getItem('runsStatus');
    const logOutButton = document.getElementById('log-out');
    const addButton = document.getElementById('run-add');
    const runTable = document.getElementById('table-run');
    const userInfo = document.getElementById('user-info');
    const userModify = document.getElementById('user-modify');
    const userDelete = document.getElementById('user-delete');
    const allRuns = document.getElementById('run-info');
    const futureRuns = document.getElementById('future-runs');
    const pastRuns = document.getElementById('past-runs');
    const homeButton = document.getElementById('home-button');

    let nameInput;
    let distanceInput;
    let dateInput;
    let locationInput;
    let wbesiteInput;
    let typeInput;
    let timeInput;
    let ranignInput;

    if (user){
        
        let url = `http://localhost:8080/DB/Runs/get/${runsStatus}/${user.email}/${user.password}`
        fetch(url, {
            method: 'GET'
        })
        .then(response => {
            if (response.status === 200){
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .then(data => {
            console.log(typeof(data));
            runs = data;
            addTable(runs, runTable);
        })
        .catch(error => {
            console.log(error);
        });

        logOutButton.addEventListener('click', () => {
            window.location.replace("loginPage.html");
        });

        userInfo.addEventListener('click', () => {
            localStorage.setItem('userStatus', "view");
            window.location.replace("userPage.html");
        });

        userModify.addEventListener('click', () => {
            localStorage.setItem('userStatus', "modify");
            window.location.replace("userPage.html");
        });

        userDelete.addEventListener('click', () => {
            deleteUser(user);
            
        });

        homeButton.addEventListener('click', () => {
            window.location.replace("homePage.html");
        });

        addButton.addEventListener('click', () => {  
            console.log('test')
            if (!updating && !modifing){
                updating = true;
                actualNum = 0;
                const newRow = runTable.insertRow(1);
                newRow.className = 'even';
                
                nameInput = addInput(0, 'text', newRow);
                distanceInput = addInput(1, 'text', newRow);
                dateInput = addInput(2, 'date', newRow);
                locationInput = addInput(3, 'text', newRow);
                wbesiteInput = addInput(4, 'text', newRow);
                typeInput = addInput(5, 'text', newRow);
                timeInput = addInput(6, 'text', newRow);
                ranignInput = addInput(7, 'number', newRow);
        
                let newCell = newRow.insertCell(8);
                newCell.innerHTML = `
                <div class="data-buttons">
                <button class="buttons modify-button" onClick=Modify(0)>Accept</button>
                <button class="buttons delete-button" onClick=Delete(0)>Cancel</button>
                </div>`;
            }
        });

        allRuns.addEventListener('click', () => {
            localStorage.setItem('runsStatus', 'all');
            window.location.replace("runsPage.html");
        });

        futureRuns.addEventListener('click', () => {
            localStorage.setItem('runsStatus', 'future');
            window.location.replace("runsPage.html");
        });

        pastRuns.addEventListener('click', () => {
            localStorage.setItem('runsStatus', 'past');
            window.location.replace("runsPage.html");
        });

    }
    
    function Modify(num) {
        if (updating && num === actualNum) {
            let necessaryField = true;
            let row = runTable.rows[num + 1];

            necessaryField = checkField(row.cells[0].children[0]) && necessaryField;
            necessaryField = checkField(row.cells[2].children[0]) && necessaryField;

            if (necessaryField) {
                fetch('http://localhost:8080/DB/Runs/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: row.cells[0].children[0].value,
                        distance: row.cells[1].children[0].value,
                        date: row.cells[2].children[0].value,
                        localization: row.cells[3].children[0].value,
                        website: row.cells[4].children[0].value,
                        type: row.cells[5].children[0].value,
                        time: row.cells[6].children[0].value,
                        rankingPlace: row.cells[7].children[0].value,
                        userEmail: user.email
                    })
                })
                .then(response => {
                    if (response.status === 201){
                        return response.json();
                    } else {
                        throw new Error(response.status);
                    }
                })
                .then(data => {
                    console.log('Odpowiedź od backendu:', data);
                    window.location.replace("runsPage.html");
                })
                .catch(error => {
                    if (error.message.includes('409')) {
                        row.cells[0].children[0].value = '';
                        row.cells[0].children[0].style.borderColor = 'red';
                    } else {
                        console.error('Błąd:', error);
                    }
                });
            }
        } else if (modifing && num === actualNum) {
            let row = runTable.rows[num];

            let url = `http://localhost:8080/DB/Runs/put/${oldName}/${user.email}/${user.password}`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: row.cells[0].children[0].value,
                    distance: row.cells[1].children[0].value,
                    date: row.cells[2].children[0].value,
                    localization: row.cells[3].children[0].value,
                    website: row.cells[4].children[0].value,
                    type: row.cells[5].children[0].value,
                    time: row.cells[6].children[0].value,
                    rankingPlace: row.cells[7].children[0].value
                })
            })
            .then(response => {
                if (response.status === 200){
                    response.json();
                } else {
                    throw new Error(response.status);
                } 
            })
            .then(data => {
                window.location.replace("runsPage.html");
            })
            .catch(error => {
                if (error.message.includes('409')) {
                    row.cells[0].children[0].value = '';
                    row.cells[0].children[0].style.borderColor = 'red';
                } else {
                    console.error('Błąd:', error);
                }
            });

        } else if (!actualNum){
            actualNum = num;
            modifing = true;
            let color;

            let oldRow = runTable.rows[num];
            oldName = oldRow.cells[0].innerHTML;

            runTable.deleteRow(num);
            const newRow = runTable.insertRow(num);
            if (num % 2 === 0){
                newRow.className = 'even';
                color = 'rgb(250, 250, 250)';
            } else {
                newRow.className = 'odd';
                color = 'rgb(224, 224, 224)';
            }

            nameInput = addInput(0, 'text', newRow, color);
            distanceInput = addInput(1, 'text', newRow, color);
            dateInput = addInput(2, 'date', newRow, color);
            locationInput = addInput(3, 'text', newRow, color);
            wbesiteInput = addInput(4, 'text', newRow, color);
            typeInput = addInput(5, 'text', newRow, color);
            timeInput = addInput(6, 'text', newRow, color);
            ranignInput = addInput(7, 'number', newRow, color);
    
            let newCell = newRow.insertCell(8);
            newCell.innerHTML = `
            <div class="data-buttons">
            <button class="buttons modify-button" onClick=Modify(${num})>Accept</button>
            <button class="buttons delete-button" onClick=Delete(${num})>Cancel</button>
            </div>`;
        }
    }

    function Delete(num) {
        if ((updating || modifing) && num === actualNum) {
            window.location.replace("runsPage.html");
        } else if (!actualNum) {
            let row = runTable.rows[num];
            let name = row.cells[0].firstChild.data;

            let url = `http://localhost:8080/DB/Runs/delete/${name}/${user.email}/${user.password}`
            fetch(url, {method: 'Delete'})
            .then(response => {
                if (response.ok){
                    window.location.replace("runsPage.html");
                } else {
                    throw new Error(response.status);
                }
            });
        }
    }


function addInput(num, type, row, color) {
    let newInput = document.createElement('input');
    newInput.className = 'newInput';
    newInput.style.backgroundColor = color;
    newInput.type = type;
    newInput.id = 'input-' + num;

    let newCell = row.insertCell(num);
    newCell.appendChild(newInput);

    return newInput;
}

function addTable(runs, runTable) {
    console.log(runs);
    runs.forEach((element, index) => {
        let newRow = runTable.insertRow(-1);
        
        if (index % 2 === 0) {
            newRow.className = 'odd';
        } else {
            newRow.className = 'even';
        }

        addCell(element.name, newRow);
        addCell(element.distance, newRow);
        addCell(element.date.slice(0, 10), newRow);
        addCell(element.localization, newRow);
        addCell(element.website, newRow);
        addCell(element.type, newRow);
        addCell(element.time, newRow);
        if (element.rankingPlace == 0){
            element.rankingPlace = '';
        }
        addCell(element.rankingPlace, newRow);

        let newCell = newRow.insertCell(-1);
            newCell.innerHTML = `
            <div class="data-buttons">
            <button class="buttons modify-button" onClick=Modify(${index + 1})>Modify</button>
            <button class="buttons delete-button" onClick=Delete(${index + 1})>Delete</button>
            </div>`;
    });
}

function addCell(value, row) {
    let newCell = row.insertCell(-1);

    newCell.innerHTML = value;
}

function checkField(element) {
    if (element.value) {
        element.style.borderColor = 'rgb(151, 151, 151)';
        return true;
    } else {
        element.style.borderColor = 'red';
        return false;
    }
}

function deleteUser(user){
    let url = `http://localhost:8080/DB/Users/delete/${user.email}/${user.password}`
    fetch(url, {method: 'Delete'})
    .then(response => {
        if (response.ok){
            window.location.replace("loginPage.html");
        } else {
            throw new Error(response.status);
        }
    });
}
