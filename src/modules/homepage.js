import axios from "axios"
import { renderS } from "./stats"

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
    const loginDiv = createElement('div', ['login-div'])
    const logInput = createElement('input', ['login-input'])
    logInput.placeholder = 'Enter Username'
    const logBtn = createElement('button', ['login-btn'], '', 'Log In')

    const welcome = createElement('p', ['user'], '', 'welcome ')
    const username = createElement('span', ['user'], 'username', user)
    setUser(logBtn, logInput, username)

    welcome.appendChild(username)
    addChilds(loginDiv, [logInput, logBtn, welcome])
    app.appendChild(loginDiv)
}
const setUser = (logBtn, logInput, usernameSpan) => {
    logBtn.addEventListener('click', () => {
        usernameSpan.textContent = logInput.value
        const app = document.getElementById("root")
        if (app.classList.contains('stats')){
            renderS()
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
    const output = createElement('p', [], 'output', 'custom generated link will be shown here. example: https://zip-url.herokuapp.com/r/')
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
                `https://zip-url.herokuapp.com/shorten/`, 
                {originUrl: `${mainUrlInput}`, customUrl: `${customUrlInput}`},
                {headers:{
                    username: getUser(),
                    'Content-Type': 'application/json'
                }}
            )
            const output = document.getElementById('output')
            output.textContent = `${response.data.message} your new custom link is\nhttps://zip-url.herokuapp.com/r/`
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