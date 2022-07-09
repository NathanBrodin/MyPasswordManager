import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"

class PageInfo {
  constructor() {
    // Get the inputs of the website, if none, quit the script
    let inputs = document.getElementsByTagName('input');
    if(inputs.length === 0) {
      return;
    }

    this.url = this.getDomain();
    this.userId = "admin";

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

          for(let i = 0; i < inputs.length; i++) {
            if(inputs[i].type === "submit") {
              const submitInput = inputs[i];
              break;
            }
          }

          /*  
          id=loginbutton, name=login, type=submit
          */
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
    // eslint-disable-next-line no-unused-vars
    const page = new PageInfo();
  }

  init();
}