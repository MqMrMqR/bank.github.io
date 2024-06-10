const GITHUB_REPO = 'https://api.github.com/repos/MqMrMqR/bank.github.io/contents/accounts.json';
const GITHUB_TOKEN = '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'; // Keep this token secure!

let accounts = {};

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
        displayAccounts();
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

function createAccount() {
    const accountName = document.getElementById('account-name').value.trim();
    if (accountName && !accounts[accountName]) {
        accounts[accountName] = 0;
        document.getElementById('account-name').value = '';
        displayAccounts();
        saveAccounts();
    } else {
        alert('Account name is invalid or already exists.');
    }
}

function transferMoney() {
    const fromAccount = document.getElementById('from-account').value.trim();
    const toAccount = document.getElementById('to-account').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    if (fromAccount in accounts && toAccount in accounts && amount > 0 && accounts[fromAccount] >= amount) {
        accounts[fromAccount] -= amount;
        accounts[toAccount] += amount;
        document.getElementById('from-account').value = '';
        document.getElementById('to-account').value = '';
        document.getElementById('amount').value = '';
        displayAccounts();
        saveAccounts();
    } else {
        alert('Invalid transfer details.');
    }
}

function displayAccounts() {
    const accountList = document.getElementById('accounts');
    accountList.innerHTML = '';
    for (const [name, balance] of Object.entries(accounts)) {
        const li = document.createElement('li');
        li.textContent = `${name}: $${balance}`;
        accountList.appendChild(li);
    }
}

window.onload = loadAccounts;
