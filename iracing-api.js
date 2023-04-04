import axios from 'axios' // used for web requests
import cryptoJS from 'crypto-js';

const axiosInstance = axios.create({withCredentials: true});
const cookieJar = { myCookies: undefined }; 

// authenticate to the official iracing api
await authenticate(); 

async function authenticate() {
    let email = process.env.email;
    let password = process.env.iRSecret;

    let hashPassword = cryptoJS.enc.Base64.stringify(
        cryptoJS.SHA256(password + email.toLowerCase())
    );

    const response = await axiosInstance.post('https://members-ng.iracing.com/auth',
    {
        email: email,
        password: hashPassword
    })

    console.log('Authentication Status: ' + response.status)

    cookieJar.myCookies = response.headers['set-cookie'];
}

export default async function request(url) {
    try {
        const response = await axiosInstance.get(url,
        {
            headers: 
            {
                // Set the session cookie retrieved earlier
                cookie: cookieJar.myCookies
            }
        });
     
        // get the AWS cached link given by the iracing api
        let link = response.data.link

        // access the cached AWS link the API gives us
        const cachedResponse = await axiosInstance.get(link,         
        {
            headers: 
            {
                // Set the session cookie retrieved earlier
                cookie: cookieJar.myCookies
            }
        });
    
        console.log('Returning response for ' + url);
        return cachedResponse.data; 
    }
    catch (err) {
        if (err.response.status == 401) {
            // Attempt to re-authenticate
            await login();

            // Wait between attempts to authenticate
            await new Promise(resolve => setTimeout(resolve, 5000));

            // re-attempt the request
            await request(url);
        }
    }
}