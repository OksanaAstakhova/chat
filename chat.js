'use strict';
let user = {};
const url = 'wss://server-ws-chat.herokuapp.com';
let messages = document.querySelector('.messages');

const nameInput = document.getElementById('name');
nameInput.addEventListener('input', handleNameChange);
const nameButton = document.getElementById('confirm');

function handleNameChange() {
    if (this.value) {
        nameButton.removeAttribute('disabled', '');
        return;
    }
    nameButton.setAttribute('disabled', 'disabled');
}

const nameForm = document.getElementById('name-form');
nameForm.addEventListener('submit', handleSubmitName);

const modal = document.querySelector('.modal');

function handleSubmitName(e) {
    e.preventDefault();
    user.name = nameInput.value;
    user.id =
        Math.random().toString(36).substring(2, 10) +
        Math.random().toString(36).substring(2, 10);
    modal.remove();
}

const sendForm = document.getElementById('send-form');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send-button');
messageInput.addEventListener('input', handleMessage);

messageInput.addEventListener('keydown', handleEnter);

function handleEnter(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        const event = new Event('submit');
        sendForm.dispatchEvent(event);
    }
}

function handleMessage() {
    if (this.value) {
        sendButton.removeAttribute('disabled', '');
        return;
    }
    sendButton.setAttribute('disabled', 'disabled');
}

const socket = new WebSocket(url);

socket.onerror = function (error) {
    console.log(error);
};

function addMessage(message, ours) {
    const messageItem = document.createElement('li');
    if (ours) {
        messageItem.classList.add('ours');
    } else {
        messageItem.classList.add('theirs');
    }
    const messageName = document.createElement('h3');
    messageName.textContent = message.name;
    const messageText = document.createElement('p');
    messageText.textContent = message.message;
    const messageDate = document.createElement('span');
    messageDate.classList.add('time');
    messageDate.textContent = new Intl.DateTimeFormat('en', {
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23'
    }).format(new Date(message.date));
    messageItem.append(messageName, messageText, messageDate);
    messages.append(messageItem);
}
sendForm.addEventListener('submit', handleSendMessage);
function handleSendMessage(e) {
    e.preventDefault();
    const message = {
        name: user.name,
        id: user.id,
        message: messageInput.value,
        date: new Date().toISOString()
    };
    socket.send(JSON.stringify(message));
    addMessage(message, true);
    messageInput.value = '';
}

socket.onmessage = function (e) {
    let message = JSON.parse(e.data);
    addMessage(message);
};
