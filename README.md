![MyPasswordManager](https://github.com/NathanBrodin/MyPasswordManager/blob/master/images/MyPasswordManager-WebStore-1.jpg)

# My Password Manager
My Password Manager is a chrome extension to store, autofill and submit your informations to any website.
Every data is encrypted using AES and stored into Firebase Firestore database.

## User guide
Open the popup to create an account or to log in, once done, you're ready to use the extension. 
When you log in into a page, you will see the save button at the top right of your screen, just fill the inputs of the website and instead of clicking to the connect button, click into the save button. It will store your inputs and login automatically to the page. 
Now, next time you will came to this page, data will be filled automatically.

If you want the extension to fill and send the data, just open the popup and check "Enable auto-submit".

## Security
If you wonder if this extension is safe, you can see that every data stored is encrypted using CryptoJS AES, the secret key is stored localy to to your computer so nobody else can view your data. Encryption is made in [ContentScript.js](https://github.com/NathanBrodin/MyPasswordManager/blob/master/src/contentScript/ContentScript.js) and the key is generate in [AuthContext.js](https://github.com/NathanBrodin/MyPasswordManager/blob/master/src/contexts/AuthContext.js)

## Development
Made using [create-react-extension](https://github.com/VasilyShelkov/create-react-extension) for chrome extension.
Main things happen in [ContentScript.js](https://github.com/NathanBrodin/MyPasswordManager/blob/master/src/contentScript/ContentScript.js). ContentScript start each time you load a page, the script will look for email and password inputs available in the document, then it look at the database to see if the user data is stored. If not it will wait for the user to send the form.

The Popup provid a Sign up, Log in, Forgot password, reset password and Dashboard page. They all use Firebase Authentication.

![MyPasswordManager](https://github.com/NathanBrodin/MyPasswordManager/blob/master/images/MyPasswordManager-WebStore-2.jpg)
![MyPasswordManager](https://github.com/NathanBrodin/MyPasswordManager/blob/master/images/MyPasswordManager-WebStore-3.jpg)
![MyPasswordManager](https://github.com/NathanBrodin/MyPasswordManager/blob/master/images/MyPasswordManager-WebStore-4.jpg)

## License
[MIT](https://choosealicense.com/licenses/mit/)
