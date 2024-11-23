import { showErrorMsg } from "../../services/event-bus.service.js";
import { store } from "../store";
import { USER_LOGGED, USER_LOGOUT } from "./user.reducer.js";

export async function loginUser(loggedUser){
    try {
        console.log('dispatch login:', loggedUser)
        store.dispatch( { type: USER_LOGGED , loggedUser })

    } catch (err) {
        console.log('cannot login :', err)
        showErrorMsg( 'Cannot login ')
        throw new Error ( err )
    }
}

export async function logoutUser(loggedUser){
    try {
        console.log('dispatch logout:', loggedUser)
        store.dispatch( { type: USER_LOGOUT , loggedUser })

    } catch (err) {
        console.log('cannot login :', err)
        showErrorMsg( 'Cannot login ')
        throw new Error ( err )
    }
}
