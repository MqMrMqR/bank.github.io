const GITHUB_REPO = 'https://api.github.com/repos/MqMrMqR/bank.github.io/contents/accounts.json';
const GITHUB_TOKEN = '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'; // Keep this token secure!

let accounts = {};
let currentUser = null;

async function loadAccounts() {
    try {
        const response = await fetch(GITHUB_REPO, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const data = await response.json();
        const content = atob(data.content);
        accounts = JSON.parse(content);
    } catch (error) {
        console.error('Error loading accounts:', error);
    }
}

async function saveAccounts() {
    const content = btoa(JSON.stringify(accounts, null, 2));
    const response = await fetch(GITHUB_REPO, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Update accounts',
            content,
            sha: (await response.json()).sha
        })
    });
}

function showSignUp() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('signup-page').style.display = 'block';
}

function showLogin() {
    document.getElementById('signup-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'block';
}

function signUp() {
    const username = document.getElementById('signup-username').value.trim();
    if (username && !accounts[username]) {
        accounts[username] = { balance: 1000 }; // Starting balance
        document.getElementById('signup-username').value = '';
        saveAccounts();
        alert('Account created! Please log in.');
        showLogin();
    } else {
        alert('Invalid username or account already exists.');
    }
}

function login() {
    const username = document.getElementById('login-username').value.trim();
    if (username && accounts[username]) {
        currentUser = username;
        document.getElementById('login-username').value = '';
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('signup-page').style.display = 'none';
        document.getElementById('bank-page').style.display = 'block';
        document.getElementById('welcome-message').innerText = `Welcome, ${currentUser}!`;
        updateMoney();
        displayAccounts();
    } else {
        alert('Invalid username.');
    }
}

function updateMoney() {
    document.getElementById('money').innerText = accounts[currentUser].balance;
}

function transferMoney() {
    const toUsername = document.getElementById('to-username').value.trim();
    const amount = parseFloat(document.getElementById('transfer-amount').value);
    if (toUsername in accounts && amount > 0 && accounts[currentUser].balance >= amount) {
        accounts[currentUser].balance -= amount;
        accounts[toUsername].balance += amount;
        document.getElementById('to-username').value = '';
        document.getElementById('transfer-amount').value = '';
        updateMoney();
        saveAccounts();
    } else {
        alert('Invalid transfer details.');
    }
}

function displayAccounts() {
    const accountList = document.getElementById('accounts');
    accountList.innerHTML = '';
    for (const [name, data] of Object.entries(accounts)) {
        const li = document.createElement('li');
        li.textContent = `${name}: $${data.balance}`;
        accountList.appendChild(li);
    }
}

window.onload = loadAccounts;