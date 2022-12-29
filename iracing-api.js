import axios from 'axios'
import cryptoJS from 'crypto-js';

const axiosInstance = createAxios();
const cookieJar = { myCookies: undefined }; 

// login to the iracing-api
await login(); 

// Creates an instance of axios
function createAxios() {
    return axios.create({withCredentials: true});   
}

async function login() {
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
    let parsedCookieInfo = cookieJar.myCookies.toString().replace(/;/g,'\n');
    console.log('Cookie Info:\n' + parsedCookieInfo);
}

export default async function request(url) {
    try {
        // Read the cookie and set it in the headers
        const response = await axiosInstance.get(url,
        {
            headers: 
            {
                cookie: cookieJar.myCookies
            }
        });
     
        let link = response.data.link

        // Access the cached AWS link the API gives us
        const cachedResponse = await axiosInstance.get(link,         
        {
            headers: 
            {
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

            // Wait 10 seconds between attempts to authenticate
            await new Promise(resolve => setTimeout(resolve, 5000));

            // re-attempt the request
            await request(url);
        }
    }
}