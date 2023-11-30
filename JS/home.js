document.addEventListener('DOMContentLoaded', () => {

    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        let name = document.getElementById('name');
        let lastName = document.getElementById('last-name');

        name.innerText = user.name;
        lastName.innerText = user.lastName;
    
        const logOutButton = document.getElementById('log-out');
        const userInfo = document.getElementById('user-info');
        const userModify = document.getElementById('user-modify');
        const userDelete = document.getElementById('user-delete');
        const runInfo = document.getElementById('run-info');
        const futureRuns = document.getElementById('future-runs');
        const pastRuns = document.getElementById('past-runs');
        const runList = document.getElementById('runs-ul');
        const eventsCount = document.getElementById('events-count');
        const picture = document.getElementById('picture');

        picture.onload = function () {
            console.log('Zdjęcie załadowane pomyślnie');
        };
    
        picture.onerror = function () {
           picture.src = "../pictures/EmptyUser.JPG";
        };

        displayImage();
    
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

        runInfo.addEventListener('click', () => {
            localStorage.setItem('runsStatus', "all");
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
    
        userDelete.addEventListener('click', () => {
            let url = `http://localhost:8080/DB/Users/delete/${user.email}/${user.password}`
            fetch(url, {method: 'Delete'})
            .then(response => {
                if (response.ok){
                    window.location.replace("loginPage.html");
                } else {
                    throw new Error(response.status);
                }
            });
        });

        getRuns(runList, eventsCount,  user.email, user.password, 'future');
        getRuns(runList, eventsCount, user.email, user.password, 'all');

        function displayImage() {
            let url = `http://localhost:8080/DB/Users/getImage/${user.email}/${user.password}`;
            picture.src = url; 
        }
    }
});

function getRuns (runList, eventsNumber, email, password, type) {
    let url = `http://localhost:8080/DB/Runs/get/${type}/${email}/${password}`
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
            console.log(data);
            if (type === 'future'){
                for (let i = 0; i < 3; i++) {
                    if (data[i]) {
                        addElementToRunList(data[i], runList);
                    }
                }
            } else {
                eventsNumber.innerText = `Events: ${data.length}`;
            }
            return data;
        })
        .catch(error => {
            console.log(error);
    });
}


function addElementToRunList (run, runList) {
    let newRow = document.createElement('li');

    newRow.innerHTML = `
    <div class="run-element">
        <p class="run-name">${run.name}</p>
        <div class="run-info">
            <p>${run.distance}</p>
            <p>${run.date.slice(0, 10)}</p>
            <p>${run.localization}</p>
        </div>
    </div>`;

    runList.appendChild(newRow);
}
