import { serverUrl } from "../index"

const { default: axios } = require("axios")
const { clearRender, createLogin, createNavHead, createElement, addChilds } = require("./homepage")

export function renderS(){
    const app = document.getElementById('root')
    app.className = 'stats'
    clearRender()
    createNavHead(app)
    createLogin(app, )
    generateStats(app, )
}
async function generateStats(app, ){
    createLoader()
    const stats = await getStats()
    removeLoader()
    const statsElem = createElement('div', ['stats'])
    stats.forEach(urlObj => {
        const entry = createElement('div', ['stat-entry'])
        const originUrl = createElement('div', [], '', `Original URL: ${urlObj.originUrl}`)
        const customUrl = createElement('div', [], '', `Custom URL: ${serverUrl}r/${urlObj.customUrl}`)
        const redirectCount = createElement('div', [], '', `used ${urlObj.redirectCounter} times`)
        const creationDate = createElement('div', [], '', `Created on: ${urlObj.creationDate}`)
        addChilds(entry, [originUrl, customUrl, redirectCount, creationDate])
        statsElem.appendChild(entry)
    })
    app.appendChild(statsElem)
}

async function getStats(){
    try {
        const stats = await axios.get(`${serverUrl}stats/`)
        return stats.data
    } catch (error) {
        console.log(error);
    }
}
function createLoader() {
    const loader = createElement('div', [], 'loader')
    document.body.appendChild(loader)
}
function removeLoader() {
    const loader = document.getElementById('loader')
    loader.remove()
}