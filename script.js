function showSignUp() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
}

async function signUp() {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const data = { username, email, password, balance: 0 };

    try {
        const response = await fetch('http://localhost:3000/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Sign Up Successful');
            showLogin();
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to sign up');
    }
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(user => user.email === email && user.password === password);
    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = 'game.html';
    } else {
        alert('Invalid credentials');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('game.html')) {
        let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            window.location.href = 'index.html';
        } else {
            document.getElementById('username').textContent = loggedInUser.username;
            document.getElementById('balance').textContent = loggedInUser.balance;
        }
    }
});

function addMoney() {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    loggedInUser.balance += 100;
    updateUser(loggedInUser);
}

function transferMoney() {
    let recipientUsername = document.getElementById('transfer-username').value;
    let amount = parseFloat(document.getElementById('transfer-amount').value);

    let users = JSON.parse(localStorage.getItem('users'));
    let recipient = users.find(user => user.username === recipientUsername);
    if (recipient && amount > 0) {
        let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser.balance >= amount) {
            loggedInUser.balance -= amount;
            recipient.balance += amount;
            updateUser(loggedInUser);
            updateUser(recipient);
            alert('Transfer Successful');
        } else {
            alert('Insufficient Balance');
        }
    } else {
        alert('Invalid Recipient or Amount');
    }
}

function updateUser(updatedUser) {
    let users = JSON.parse(localStorage.getItem('users'));
    let userIndex = users.findIndex(user => user.email === updatedUser.email);
    users[userIndex] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    document.getElementById('balance').textContent = updatedUser.balance;
}
