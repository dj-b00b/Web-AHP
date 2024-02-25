

export function checkAuthorization() {
    if (localStorage.getItem('token') && localStorage.getItem('user_id')) {
        return true
    }
    else {
        return false
    }
}

export function putAuthDataToLocalStorage(response) {
    const {token, user_id } = response.data
    localStorage.setItem('token', token)
    localStorage.setItem('user_id', user_id)

}

export function deleteAuthDataFromLocalStorage() {
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
}