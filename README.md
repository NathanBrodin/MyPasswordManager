![MyPasswordManager](https://github.com/NathanBrodin/MyPasswordManager/blob/master/public/logo192.png)

# My Password Manager
My Password Manager is a chrome extension to store, autofill and submit your password, email and username to any website.
Every data is encrypted using AES 128.
The extension is build using REACT/JS and data is stored in Firebase Firestore database.

#### The project will be soon available on chrome store.

## User guide
Open the popup to create an account or to log in, once done, your ready to use the extension.
Data will be stored automatically and will load to your log in inputs.

## Development

Made using [create-react-extension](https://github.com/VasilyShelkov/create-react-extension) for chrome extension.
Main things happen in [ContentScript.js](https://github.com/NathanBrodin/MyPasswordManager/blob/master/src/contentScript/ContentScript.js). ContentScript start each time you load a page, the script will look for email and password input available in the document, then it look at the database to see if the user data is stored. If not it will wait for the user to send the form.

The Popup provid a Sign up, Log in, Forgot password, reset password and Dashboard page. They all use Firebase Authentication.

## License
[MIT](https://choosealicense.com/licenses/mit/)