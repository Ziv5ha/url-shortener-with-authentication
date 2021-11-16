import axios from "axios"
import { renderS } from "./stats"
import { serverUrl } from "../index"


export function createElement(tag, classes, id, text){
    const elem = document.createElement(tag)
    if (classes.length > 0) {
        classes.forEach(className => {
            elem.classList.add(className)
        })
    }
    if (id) elem.id = id
    if (text) elem.textContent = text
    return elem
}
export function addChilds(parentElemnt, children){
    children.forEach(childElemnt => {
        parentElemnt.appendChild(childElemnt)
    })
}

export function initRender() {
    const app = document.getElementById("root")
    app.className = 'home'
    createNavHead(app)
    createMenuElem()
    createLogin(app)
    createMain(app)
}

export function renderHP(){
    clearRender()
    const app = document.getElementById("root")
    app.className = 'home'
    createNavHead(app)
    createLogin(app)
    createMain(app)
}

export function createLogin(app, user = 'Guest'){
    const userDiv = createElement('div', ['login-div'])

    const signUpDiv = createElement('div', ['signup'])
    const usernamesignUput = createElement('input', ['login-input'])
    usernamesignUput.placeholder = 'Enter Username'
    const passwordsignUput = createElement('input', ['login-input'])
    passwordsignUput.placeholder = 'Enter Password'
    const signBtn = createElement('button', ['login-btn'], '', 'Sign Up')
    signUp(signBtn, usernamesignUput, passwordsignUput)

    const loginDiv = createElement('div', ['login'])
    const usernameLogInput = createElement('input', ['login-input'])
    usernameLogInput.placeholder = 'Enter Username'
    const passwordLogInput = createElement('input', ['login-input'])
    passwordLogInput.placeholder = 'Enter Password'
    const logBtn = createElement('button', ['login-btn'], '', 'Log In')
    logIn(logBtn, usernameLogInput, passwordLogInput)

    const welcome = createElement('p', ['user'], 'server-msg', 'Please sign in ')

    addChilds(signUpDiv, [usernamesignUput, passwordsignUput, signBtn])
    addChilds(loginDiv, [usernameLogInput, passwordLogInput, logBtn])
    addChilds(userDiv, [signUpDiv, loginDiv, welcome])

    app.appendChild(userDiv)
}
const logIn = (logBtn, username, password) => {
    logBtn.addEventListener('click', async () => {
        try {
            const response = await axios.post(
                `${serverUrl}sign/in`, 
                {
                    "username": username.value, 
                    "password": password.value
                }
            )
            const msg = document.getElementById('server-msg')
            msg.innerText = 'Welcome '
            const usernameSpan = createElement('span', ['user'], 'username', username.value)
            msg.appendChild(usernameSpan)
            username.value = ''
            password.value = ''
            const app = document.getElementById("root")
            if (app.classList.contains('stats')){
                renderS()
            }
        } catch (error) {
            document.getElementById('server-msg').textContent = error
        }
    })
}
const signUp = (signBtn, username, password) => {
    signBtn.addEventListener('click', async () => {
        try {
            const response = await axios.post(
                `${serverUrl}sign/up`, 
                {
                    "username": username.value, 
                    "password": password.value
                }
            )
            username.textContent = ''
            password.textContent = ''
            document.getElementById('server-msg').textContent = 'User created, please log in'
        } catch (error) {
            console.log(error.response);
            document.getElementById('server-msg').textContent = error
        }
    })
}
const getUser = () => {
    return document.getElementById('username').textContent
}
export function createNavHead(app){
    const header = createElement('h1', ['page-head'], '', 'Zip-Url')
    const topHam = createElement('div', ['ham-menu'])
    const middleHam = createElement('div', ['ham-menu'])
    const bottomHam = createElement('div', ['ham-menu'])
    const summener = createElement('button', ['nav-summoner'])
    summener.addEventListener('click', openNav)
    addChilds(summener, [topHam, middleHam, bottomHam])
    addChilds(app, [header, summener])
}

function createMain(app){
    const mainDiv = createElement('div', ['main'])
    const mainUrlInput = createElement('input', ['shortener-input'])
    mainUrlInput.placeholder = 'Enter Url'
    const optionalDiv = createElement('div', ['secend-row'])
    const customUrlInput = createElement('input', ['custom-url-input'])
    customUrlInput.placeholder = 'Want a custom Url? Enter it here'
    const shortBtn = createElement('button', ['custom-url-btn'], '', 'do some magic')
    addShortnerBtnAtttibutes(shortBtn, mainUrlInput, customUrlInput)
    addChilds(optionalDiv, [customUrlInput, shortBtn])
    const output = createElement('p', [], 'output', `custom generated link will be shown here. example: ${serverUrl}r/`)
    const customLink = createElement('span', [], 'output-link', 'XXXXXXXXXX')
    output.appendChild(customLink)
    addChilds(mainDiv, [mainUrlInput, optionalDiv, output])
    app.appendChild(mainDiv)
}
function addShortnerBtnAtttibutes(shortBtn, mainUrlInput, customUrlInput){
    shortBtn.addEventListener('click', () => {
        sendShortening(mainUrlInput.value, customUrlInput.value)
    })
}

const sendShortening = async (mainUrlInput, customUrlInput) => {
    try {
        if (mainUrlInput){
            const response = await axios.post(
                `${serverUrl}shorten/`, 
                {originUrl: `${mainUrlInput}`, customUrl: `${customUrlInput}`},
                {headers:{
                    username: getUser(),
                    'Content-Type': 'application/json'
                }}
            )
            const output = document.getElementById('output')
            output.textContent = `${response.data.message} your new custom link is\n${serverUrl}r/`
            const customLink = createElement('span', [], 'output-link', `${response.data.customUrl}`)
            output.appendChild(customLink)
        }
    } catch (error) {
        
    }
}

export function clearRender(){
    const app = document.getElementById("root")
    while (app.hasChildNodes()){
        app.firstChild.remove()
    }
}


function nav({target}){
    const app =document.getElementById('root')
    if (!app.classList.contains(target.id)){
        if (target.id === 'home'){
            clearActive()
            target.classList.add('active')
            renderHP()
        } else if (target.id === 'stats'){
            clearActive()
            target.classList.add('active')
            renderS()
        }
    }
}
function clearActive() {
    const prevActive = document.getElementsByClassName('active')
    for (const elem of prevActive) {
        elem.classList.remove('active')
    }
}

function createMenuElem() {
    const menuElem = createElement('div', ['menu'], 'menu')
    const homeBtn = createElement('button', ['in-menu-botton', 'active'], 'home', 'Home')
    homeBtn.addEventListener('click', nav)
    const statsBtn = createElement('button', ['in-menu-botton'], 'stats', 'Stats')
    statsBtn.addEventListener('click', nav)
    addChilds(menuElem, [homeBtn, statsBtn])
    document.body.appendChild(menuElem)
}
function exitMenu({ target }) {
    if (
        target.classList.contains('menu') ||
        target.parentElement.classList.contains('menu') ||
        target.classList.contains('nav-summoner') ||
        target.parentElement.classList.contains('nav-summoner')
    ) {
        return
    }
    document.getElementById("menu").style.width = "0";
    document.body.removeEventListener('click', exitMenu)
}
function openNav() {
    document.getElementById("menu").style.width = "200px";
    document.body.addEventListener('click', exitMenu)
}

// function deleteMenu() {
//     const prevMenus = document.querySelectorAll('.menu')
//     for (const prevMenu of prevMenus) {
//         prevMenu.parentElement.removeChild(prevMenu)
//     }
// }
  
//   function closeNav() {
//     document.getElementById("menu").style.width = "0";
//   }