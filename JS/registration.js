document.addEventListener('DOMContentLoaded', () => {

    localStorage.clear();
    const registryButton = document.getElementById('registry');
    const loginButton = document.getElementById('login-button');
    const homepage = "homePage.html";

    loginButton.addEventListener('click', () => {
        window.location.replace("loginPage.html");
    });

    registryButton.addEventListener('click', () => {

        let email = document.getElementById('email');
        let password = document.getElementById('password');
        let name = document.getElementById('name');
        let lastName = document.getElementById('last-name');
        let genderOptions = document.getElementsByName('gender');
        let gender = "";
        genderOptions.forEach((button) => {
            if (button.checked) {
                gender = button;
            }
        });
        let dateOfBirth = document.getElementById('date-of-birth');

        let emailLbl = document.querySelector('label[for="email"]');
        let passwordLbl = document.querySelector('label[for="password"]');
        let nameLbl = document.querySelector('label[for="name"]');
        let lastNameLbl = document.querySelector('label[for="last-name"]');
        let genderLbl = document.querySelector('label[for="gender"]');
        let dateOfBirthLbl = document.querySelector('label[for="date-of-birth"]');
        
        let fieldsNotEmpty = true;

        fieldsNotEmpty = SetReminder(email, emailLbl) && fieldsNotEmpty;
        fieldsNotEmpty = SetReminder(password, passwordLbl) && fieldsNotEmpty;
        fieldsNotEmpty = SetReminder(name, nameLbl) && fieldsNotEmpty;
        fieldsNotEmpty = SetReminder(lastName, lastNameLbl) && fieldsNotEmpty;
        fieldsNotEmpty = SetReminder(gender, genderLbl) && fieldsNotEmpty;
        fieldsNotEmpty = SetReminder(dateOfBirth, dateOfBirthLbl) && fieldsNotEmpty;
        
        if (fieldsNotEmpty) {
            fetch('http://localhost:8080/DB/Users/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value,
                    name: name.value,
                    lastName: lastName.value,
                    gender: gender.value,
                    dateOfBirth: dateOfBirth.value
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
                console.log(data);
                localStorage.setItem('user', JSON.stringify(data));
                window.location.replace("homePage.html");
            })
            .catch(error => {
                if (error.message.includes('409')) {
                    email.value = '';
                    SetReminder(email, emailLbl);
                } else {
                    console.error('Błąd:', error);
                }
            });
        }
    });
});

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
