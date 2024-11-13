
async function getAccessToken(clientId, clientSecret) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    return data.access_token;
}
async function searchArtistByCharacter(accessToken, character) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${character}*&type=artist`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    return data.artists.items;
}

// Usage Example
(async () => {
    const clientId = 'd3fc38ce7f59434d9d1ee7e7c85205fd'; // Replace with your client ID
    const clientSecret = '06fd876e23034893aa7f2f0af79a42ca'; // Replace with your client secret
    const accessToken = await getAccessToken(clientId, clientSecret);
    
    const artists = await searchArtistByCharacter(accessToken, 'A');
})();
