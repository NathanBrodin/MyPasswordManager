/* global chrome */
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import './ContentScript.css'

export default function ContentScript() {
  var inputs, form, url, currentUser
  const [isStored, setStored] = useState()

  useEffect(() => {
    constructor()
    // eslint-disable-next-line
  }, [])

  // Wait for user to send his data
  useEffect(() => {
    if(isStored === false && form) {
      console.log("Waiting for user to send data")
      form.addEventListener("submit", storeInputs)
    }
    return () => form.removeEventListener("submit", storeInputs)
    // eslint-disable-next-line
  }, [isStored])

  const constructor = function() {
    inputs = getInputs()
    if(!inputs) return 

    form = getForm()
    if(!form) return 

    url = getUrl()
    if(!url) return

    getCurrentUser()  // This an async function, so we need to wait for it to search user in local storage
  }

  // Search the data of the user
  async function userData() {
    console.log("All the conditions are met, searching for user data")

    console.log("User is: ", currentUser)
    const urlRef = doc(db, "users/" + currentUser + "/data/" + url)
    const urlSnap = await getDoc(urlRef)
    
    // if url is stored, get values
    if(urlSnap.exists()) {
      console.log("Data stored")
      fillInputs(urlSnap.data())

      return (
        <div className='extension-container'>
          <header>
          <h1>Data as been successfully stored</h1>
          </header>
        </div>
      )
    } else {
      console.log("Data not stored")
      setStored(false)
    }
  }
  
  function getInputs() {
    const inputs = document.getElementsByTagName('input')
    return Object.values(inputs).filter(filterInputs)
  }
  
  function filterInputs(input) {
    switch (input.type) {
      case "email":
      case "password":
      case "text":
      case "tel":    
        return true
    
      default:
        return false
    }

  }
  
  function getForm() {
    var form
    try {
      form = document.getElementsByTagName('form')[0]
    } catch {
      console.log("No form found")
      form =  null
    }
    return form
  }
  
  function getUrl() {
    let url = window.location.href
    let domain = (new URL(url))

    return domain.hostname.replace('www.', '')
  }

  async function getCurrentUser() {
      var promise = new Promise(function(resolve, reject) {
        chrome.storage.sync.get(['user'], function(result) {

          if(result.user) {
            resolve(result.user)
          } else {
            reject("No user found")
          }
        })
      })
      promise.then(function(result) {
        console.log("User found: ", result)
        currentUser = result

        userData()  // Start searching for user data
      }, function(err) {
        console.log(err); // Error: "It broke"
      });
  }

  function fillInputs(data) {
    for(let input of inputs) {
      try {
        input.value = data[input.id]
      } catch(e) {
        console.log("Data of input [" + input.id + "] was not found, " + e)
      }
    }
  }
  
  async function storeInputs() {
    console.log("Storing the inputs")
    const urlDoc = doc(db, "users", currentUser, "data", url)
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