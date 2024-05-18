exports.getLoggedInUser = async (token) => {
    const result = await fetch('http://localhost:5000/api/v1/user/getLoggedInUser', {
        method: 'GET',
        headers: {
            authorization: `Bearer ${token}`
        }
    })

    const user = await result.json();
    return user.user;

}