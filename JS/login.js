document.addEventListener('DOMContentLoaded', () => {

    localStorage.clear();
    const loginButton = document.getElementById('login');
    const registryButton = document.getElementById('registry');

    loginButton.addEventListener('click', () => {
        let email = document.getElementById('email');
        let password = document.getElementById('password');
    
        let emailLbl = document.querySelector('label[for="email"]');
        let passwordLbl = document.querySelector('label[for="password"]');

        let fieldsNotEmpty = true;

        fieldsNotEmpty = SetReminder(email, emailLbl) && fieldsNotEmpty;
        fieldsNotEmpty = SetReminder(password, passwordLbl) && fieldsNotEmpty;

        if (fieldsNotEmpty) {
            let url = `http://localhost:8080/DB/Users/get/${email.value}/${password.value}`

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
                localStorage.setItem('user', JSON.stringify(data));
                window.location.replace("homePage.html");
            })
            .catch(error => {
                if (error.message.includes('204')) {
                    email.value = "";
                    SetReminder(email, emailLbl);

                    password.value = "";
                    SetReminder(password, passwordLbl)
                } else {
                    console.error('Błąd:', error);
                }
            });
        }
    });

    registryButton.addEventListener('click', () => {
        window.location.replace("registrationPage.html");
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