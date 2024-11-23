import { showErrorMsg } from './event-bus.service.js'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'
export const userService = {
    login,
    logout,
    signup,
    getLoggedInUser,
    saveLoggedinUser,
    getEmptyUser,
    getUsers,
    getById,
    save,
    remove,
    getFilterFromSearchParams,
    createEmptyUser,
}

async function login( userCred ){
	const user = await httpService.post('auth/login', userCred)
	if (user) return saveLoggedinUser(user)    
}

async function logout( ){
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
	return await httpService.post('auth/logout')
}

async function signup( userCred ){
    if (!userCred.imgUrl) userCred.imgUrl = 'https://static8.depositphotos.com/1007989/894/i/450/depositphotos_8943042-stock-photo-okay-smiley.jpg'
	userCred.score = 10000

    const user = await httpService.post('auth/signup', userCred)
	return saveLoggedinUser(user)  
}

function getLoggedInUser(  ){
    return JSON.parse(sessionStorage.getItem( STORAGE_KEY_LOGGEDIN_USER ))
}

async function saveLoggedinUser( user ){
    user = { _id: user._id, fullname: user.fullname, img: user.img , score: user.score }
    sessionStorage.setItem( STORAGE_KEY_LOGGEDIN_USER , JSON.stringify(user))
    return user
}

async function getEmptyUser( ){
    return {
        username: '',
        fullname: '',
        password: '',
    }
}

async function getUsers( filterBy ) {
    return httpService.get(`user`, filterBy)
}

async function getById(userId) {
	const user = await httpService.get(`user/${userId}`)
	return user
}

async function remove(userId) {
    return httpService.delete(`user/${userId}`)
}

async function save(user) {
    var savedUser
    if (user._id){
        savedUser = await httpService.put(`user/${user._id}`, user )

        // When admin updates other user's details, do not update loggedinUser
        const loggedinUser = getLoggedInUser() // Might not work because its defined in the main service???
        if (loggedinUser._id === user._id) saveLoggedinUser(user)
    }else {
        savedUser = await httpService.post(`user/`, user )
        console.log('savedUser after creation:', savedUser)
    }
    return savedUser

}

function getFilterFromSearchParams(searchParams){
    const filterBy = {
        search: searchParams.get('search') || ''
    }

    return filterBy
}

function createEmptyUser(){
    return   {
        "username": "",
        "fullname": "",
      }
}
