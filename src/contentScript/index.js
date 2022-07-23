import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { AuthProvider } from '../contexts/AuthContext'
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
    root.render(
      <AuthProvider>
        <Page />
      </AuthProvider>
    )
  }
  
  init();
}

export default function Page() {
  const inputs = getInputs()
  const form = document.forms[0]
  const url = getUrl()
  const currentUser = {uid: "admin", email: "admin@gmail.com"}

  useEffect(() => {
    form.addEventListener("submit", storeInputs)

    return () => form.removeEventListener("submit", storeInputs)
})

  if(inputs.length === 0 || !currentUser) {
    console.log("No inputs nor user")
    return
  }

  console.log("Current user: ", currentUser.uid)

  // Search the data of the user
  const userData = async() => {
    const urlRef = doc(db, "users/" + currentUser.uid + "/data/" + url)
    const urlSnap = await getDoc(urlRef)
    
    // if url is stored, get values
    if(urlSnap.exists()) {
      console.log("This website is stored")
      fillInputs()
    } else {
      // Prepare to store the data
      console.log("Data of this website is not stored yet, listening to submitEvent")
    }
  }
  userData()

  function getInputs() {
    const inputs = document.getElementsByTagName('input');

    return Object.values(inputs).filter(input => input.type !== "hidden")
  }

  function fillInputs() {
    console.log("Filling the inputs")
  }

  async function storeInputs() {
    console.log("Submit has been pressed")

    await setDoc(doc(db, "users", currentUser.uid, "data", url), {
    })

    for(let input of inputs) {    
      await updateDoc(doc(db, "users", currentUser.uid, "data", url), {
        [input.id]: input.value
      })
    }
  }

  function getUrl() {
    let url = window.location.href;
    let domain = (new URL(url));

    return domain.hostname.replace('www.', '');
  }

  return (
    <div></div>
  )
}

// document.forms[0].submit();