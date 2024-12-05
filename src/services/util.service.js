export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    debounce,
    randomPastTime,
    saveToStorage,
    loadFromStorage
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}


function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
    }
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

export function getExistingProperties(obj){
    const trueObj = {}
    for (const key in obj){
        const val = obj[key]
        if ( val || typeof val === 'boolean')
            trueObj[key] = val
    }
    return trueObj
}

export function setTrackJson( trackInfo ){
    if(!trackInfo) return 'error, did not get track'
    const trackJson =      
    {
        id: trackInfo.id,
        title: trackInfo.name,
        artist: trackInfo.artist,
        image: trackInfo.image        
    }
    return trackJson
}

export function setPlaylistJson( trackInfo, youtubeId){
    console.log('trackInfo:', trackInfo)
    if(!trackInfo) return 'error, did not get track'
    const trackJson =   [     
    {
        id: trackInfo.id,
        title: trackInfo.name,
        artist: trackInfo.artist,
        image: trackInfo.image,
        youtubeId: youtubeId
    }]
    return trackJson
}

export function getHeader(objectType) {
    switch (objectType) {
        case "playlist":
            return 'Playlists'
        case "artist":
            return 'Artists'
        case "album":
            return 'Albums'
        case "track":
            return 'Songs'
        default:
            return 'header not found'
    }
}