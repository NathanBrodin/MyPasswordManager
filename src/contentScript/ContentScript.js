/* global chrome */
import React, { useEffect, useState } from 'react'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import './ContentScript.css';

export default function ContentScript() {
  // Initialization of all variables
  const [constructorHasRun, setConstructorHasRun] = useState(false)
  const [inputs, setInputs] = useState()
  const [form, setForm] = useState()
  const [url, setUrl] = useState()
  const [currentUser, setCurrentUser] = useState()
  const [isStored, setStored] = useState()

  useEffect(() => {
    constructor()
        // eslint-disable-next-line
  }, [])

  // Wait for user to send his data
  useEffect(() => {
    if(isStored === false) {
      form.addEventListener("submit", storeInputs)
    }
    return () => form.removeEventListener("submit", storeInputs)
    // eslint-disable-next-line
  }, [isStored])

  const constructor = function() {
    if(constructorHasRun) return

    setInputs(getInputs())
    console.log(inputs)
    if(!inputs) return 
    console.log("b")
    setForm(getForm())
    if(!form) return 
    console.log("c")
    setUrl(getUrl())
    setCurrentUser(getCurrentUser())
    if(!currentUser) return 
    console.log("d")
    userData()

    setConstructorHasRun(true)
  }

  // Search the data of the user
  async function userData() {
    const urlRef = doc(db, "users/" + currentUser.uid + "/data/" + url)
    const urlSnap = await getDoc(urlRef)
    
    // if url is stored, get values
    if(urlSnap.exists()) {
      fillInputs(urlSnap.data())

      return (
        <div className='extension-container'>
          <header>
          <h1>Data as been successfully stored</h1>
          </header>
        </div>
      )
    } else {
      setStored(false)
    }
  }
  
  function getInputs() {
    const inputs = document.getElementsByTagName('input');
    return Object.values(inputs).filter(filterInputs)
  }
  
  function filterInputs(input) {
    switch (input.type) {
      case "email":
      case "password":
      case "tel":    
        return true
    
      default:
        return false
    }

  }
  
  function getForm() {
    return inputs[0].form
  }
  
  function getUrl() {
    let url = window.location.href;
    let domain = (new URL(url));

    return domain.hostname.replace('www.', '');
  }

  function getCurrentUser() {
    chrome.storage.local.get(['key'], function(result) {
      setCurrentUser(result.key)
    })
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
  
  return (
    <div></div>
  )
}
  
// document.forms[0].submit();