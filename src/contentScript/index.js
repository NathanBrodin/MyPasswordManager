import React from 'react'
import { createRoot } from 'react-dom/client';
import { doc, getDoc } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'

if(typeof init === 'undefined') {
  const init = function() {
    // Adding the extension to the document
    const extensionRoot = document.createElement('div')
    extensionRoot.id = 'extension'
    document.body.appendChild(extensionRoot)

    // Render the extension to get the script working
    const container = document.getElementById('extension')
    const root = createRoot(container)
    root.render(<Page />)
  }
  
  init();
}

export default function Page() {

  document.body.style.backgroundColor = "#32a852"

  /*
  const inputs = getInputs()  // TODO: Return if there is no inputs
  const url = getUrl()
  const { currentUser } = useAuth()

  // Search the data of the user
  const userData = async() => {
    const urlRef = doc(db, "users/" + currentUser.uid + "/data/" + url)
    const urlSnap = await getDoc(urlRef)
    
    // if url is stored, get values
    if(urlSnap.exists()) {

    } else {
      // Prepare to store the data
      console.log("Data of this website is not yet stored")
    }
  }

  function getInputs() {
    const inputs = document.getElementsByTagName('input');

    return inputs
  }

  function fillInputs() {
    var inputType = inputs[0].type
    console.error("Type of the first input is: ", inputType)
  }

  function getUrl() {
    let url = window.location.href;
    let domain = (new URL(url));

    return domain.hostname.replace('www.', '');
  }
  */
  return (
    <div></div>
  )
}

/*
    // Search the data of the user
    const user = async() => {
        const urlRef = doc(db, "/users/" + this.userId + "/data/" + this.url);
        const urlSnap = await getDoc(urlRef);

        // if url is stored, get values
        if(urlSnap.exists()) {
          this.email = urlSnap.data().email;
          this.username = urlSnap.data().username;
          this.password = urlSnap.data().password;

          // Get the user preferences
          const prefRef = doc(db, "/users/" + this.userId + "/profil/preferences");
          const prefSnap = await getDoc(prefRef);
          this.autoSubmit = prefSnap.data().autoSubmit;

          this.setUserInputs(inputs);

        // Else wait to get the inputs the user will fill
        } else {
          console.log("Url not register");

          

          /*  
          id=loginbutton, name=login, type=submit
          
        }
    }
    user();

  }

  getDomain () {
    let url = window.location.href;
    let domain = (new URL(url));

    return domain.hostname.replace('www.', '');
  }

  setUserInputs(inputs) {
    // For each inputs, it looks what type it is
    for(let i = 0; i < inputs.length; i++) {
      const input = inputs.item(i);
      
      this.fillForms(input, input.name);
      this.fillForms(input, input.type);
      this.fillForms(input, input.id);   
    }

    
    // Send directly the inputs
    if(this.autoSubmit === true) {
      document.forms[0].submit();
    }
  }

  // Fill the inputs with the givens data
  fillForms(input, type) {
    switch(type) {
      case 'email':
          input.value = this.email;
          break;

        case 'username':
          input.value = this.username;
          break;

        case 'password':
        case 'pass':
          input.value = this.password;
          break;

        default:
          break;
    }
  }
}

if(typeof init === 'undefined') {
  const init = function() {
    // eslint-disable-next-line
    const page = new PageInfo();
  }

  init();
}
*/