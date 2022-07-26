import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { AuthProvider } from '../contexts/AuthContext'
import { db } from '../firebase'

if(typeof init === 'undefined') {
  console.clear()
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
  const form = getForm()
  const url = getUrl()
  const [isStored, setStored] = useState()
  const currentUser = {uid: "admin", email: "admin@gmail.com"}

  console.log("Page: " + url + ", currentUser: " + currentUser.uid + ", " + currentUser.email)
  console.log("Inputs: " + inputs.length)
  for(let input of inputs) {
    console.log(input)
  }

  useEffect(() => {
    console.log("useEffect as started")
    if(isStored === false) {
      console.log("Waiting to submit the form")
      form.addEventListener("submit", storeInputs)
    }

    return () => form.removeEventListener("submit", storeInputs)
    // eslint-disable-next-line
}, [isStored])

  if(inputs.length === 0 || !currentUser) {
    console.log("There is no inputs and or user on this page")
    return
  }

  // Search the data of the user
  const userData = async() => {
    const urlRef = doc(db, "users/" + currentUser.uid + "/data/" + url)
    const urlSnap = await getDoc(urlRef)
    
    // if url is stored, get values
    if(urlSnap.exists()) {

      console.log("Data of this website are stored, filling the inputs")
      fillInputs(urlSnap.data())
    } else {
      console.log("Data of this website aren't stored, preparing to store them")
      setStored(false)
    }
  }
  userData()

  function getInputs() {
    const inputs = document.getElementsByTagName('input');

    return Object.values(inputs).filter(filterInputs)
  }

  function filterInputs(input) {
    switch (input.type) {
      case "email":
      case "password":
      case "tel":
      case "text":       
        return true
    
      default:
        return false
    }

  }

  function getForm() {
    return inputs[0].form
  }

  function fillInputs(data) {
    for(let input of inputs) {
      try {
        input.value = data[input.id]
      } catch(e) {
        console.error("Data of input [" + input.id + "] was not found, " + e)
      }
    }
  }

  async function storeInputs() {
    console.log("Storing the inputs")
    const urlDoc = doc(db, "users", currentUser.uid, "data", url)
    await setDoc(urlDoc, {})

    for(let input of inputs) {    
      await updateDoc(urlDoc, {
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