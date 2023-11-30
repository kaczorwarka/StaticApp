document.addEventListener('DOMContentLoaded', () => {

    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        let status = localStorage.getItem('userStatus');

        let email = document.getElementById('email');
        let name = document.getElementById('name');
        let lastName = document.getElementById('last-name');
        let gender = document.getElementById('gender');
        let dateOfBirth = document.getElementById('date-of-birth');

        let emailInput;
        let passwordInput;
        let nameInput;
        let lastNameInput;
        let gendersInput = [];
        let genderInput;
        let dateOfBirthInput;

        const logOutButton = document.getElementById('log-out');
        const modifyButton = document.getElementById('modify');
        const deleteButton = document.getElementById('delete');
        const userInfo = document.getElementById('user-info');
        const userModify = document.getElementById('user-modify');
        const userDelete = document.getElementById('user-delete');
        const addPhotoButton = document.getElementById('photo');
        const picture = document.getElementById('picture');
        const runInfo = document.getElementById('run-info');
        const futureRuns = document.getElementById('future-runs');
        const pastRuns = document.getElementById('past-runs');
        const homeButton = document.getElementById('home-button');

        email.innerText = user.email;
        name.innerText = user.name;
        lastName.innerText = user.lastName;
        gender.innerText = user.gender;
        dateOfBirth.innerText = user.dateOfBirth;

        picture.onload = function () {
            console.log('Zdjęcie załadowane pomyślnie');
        };
    
        picture.onerror = function () {
           picture.src = "../pictures/EmptyUser.JPG";
        };

        displayImage();

        if (status === 'modify'){
            nameInput = addInput(name, 'text');
            lastNameInput = addInput(lastName, 'text');
            emailInput = addInput(email, 'text');
            passwordInput = addInput(gender, 'password');
            gendersInput = addInput(gender, 'radio');
            dateOfBirthInput = addInput(dateOfBirth, 'date');

            modifyButton.innerText = 'Accept';
        }

        logOutButton.addEventListener('click', () => {
            window.location.replace("loginPage.html");
        });

        addPhotoButton.addEventListener('change', () => {
            const file = addPhotoButton.files[0];
            console.log(file);
            const formData = new FormData();
            formData.append('file', file);

            let url = `http://localhost:8080/DB/Users/uploadImage/${user.email}/${user.password}`;
            fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(imageName => {
                displayImage();
            })
            .catch(error => console.error('Error:', error));
        })

        deleteButton.addEventListener('click', () => {
            deleteUser(user);
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

        homeButton.addEventListener('click', () => {
            window.location.replace("homePage.html");
        });

        modifyButton.addEventListener('click', () => {
            if (status === 'view') {
                nameInput = addInput(name, 'text');
                lastNameInput = addInput(lastName, 'text');
                emailInput = addInput(email, 'text');
                passwordInput = addInput(gender, 'password');
                gendersInput = addInput(gender, 'radio');
                dateOfBirthInput = addInput(dateOfBirth, 'date');

                modifyButton.innerText = 'Accept';
                status = 'modify';

            } else if (status === 'modify') {
                gendersInput.forEach((element) => {
                    if (element.checked){
                        genderInput = element;
                    }
                });
                
                let url = `http://localhost:8080/DB/Users/put/${user.email}/${user.password}`;
                console.log(genderInput);
                fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: emailInput.value,
                        password: passwordInput.value,
                        name: nameInput.value,
                        lastName: lastNameInput.value,
                        gender: genderInput.value,
                        dateOfBirth: dateOfBirthInput.value
                    })
                })
                .then(response => {
                    if (response.status === 200){
                        return response.json();
                    } else {
                        throw new Error(response.status);
                    }
                })
                .then(data => {
                    localStorage.setItem('user', JSON.stringify(data));
                    localStorage.setItem('userStatus', 'view');
                    window.location.replace("userPage.html");
                })
                .catch(error => {
                    if (error.message.includes('409')) {
                        emailInput.value = '';
                        emailInput.style.borderColor = 'red';
                    } else {
                        console.error('Błąd:', error);
                    }
                });
            }
        });

        function displayImage() {
            let url = `http://localhost:8080/DB/Users/getImage/${user.email}/${user.password}`;
            picture.src = url; 
        }
    }
});

function addInput(textElement, type) {
    let input;

    if (type !== 'radio'){
        input = document.createElement('input');
        input.type = type;
        input.id = textElement.id + '-input';
        input.className = 'text-input';
        if (type === 'text'){
            input.placeholder = textElement.textContent;
            textElement.parentNode.replaceChild(input, textElement);
        } else if (type === 'password') {
            input.placeholder = 'new password';
            textElement.parentNode.insertBefore(input, textElement);
        } else {
            textElement.parentNode.replaceChild(input, textElement);
        }
    
    } else {
        let div = document.createElement('div');
        div.className = 'gender-button';
        textElement.parentNode.insertBefore(div, textElement);

        let genderList = ['Male', 'Female', 'Other'];

        genderList.forEach((element) =>{
            if (element === textElement.innerText){
                div.appendChild(generateRadio(element, true));
            } else {
                div.appendChild(generateRadio(element, false));
            }
            div.appendChild(gender); 
        });

        textElement.remove();
        input = document.getElementsByName('gender');
    }

    return input;
}

function generateRadio(value, checked) {
    let div = document.createElement('div');
    div.className = 'gender-option';

    let label = document.createElement('label');
    label.htmlFor = value;
    label.innerText = value;
    div.appendChild(label);

    let input = document.createElement('input');
    input.type = 'radio';
    input.name = 'gender';
    input.value = value;
    input.checked = checked;
    div.appendChild(input);

    return div;
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

function SetReminder(element, label) {
    if (element.value) {
        if (label.innerHTML[label.innerHTML.length - 1] === "!"){
            label.style.color = "black";
            label.innerHTML = label.innerHTML.slice(0, -2);
        }
        return true;
    }
    else {
        if (label.innerHTML[label.innerHTML.length - 1] !== "!"){
            label.style.color = "red";
            label.innerHTML += " !";
        }
        return false;
    }
}