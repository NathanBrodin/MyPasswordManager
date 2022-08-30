/* global chrome */
import React from 'react'
import { db } from '../firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import './ContentScript.css'

export default class ContentScript extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      form: this.getForm(),
      inputs: this.getInputs(),
      url: this.getUrl(),
      user: this.getUser()
    }

    this.searchUserData()
  }

  getForm() {
    const form = document.getElementsByTagName('form')[0]
    if(form) {
      return form
    }
  }

  getInputs() {
    var inputs = document.getElementsByTagName('input')
    inputs = Object.values(inputs).filter(this.filterInputs)

    if(inputs.length) {
      return inputs
    }
  }
  
  filterInputs(input) {
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

  getUrl() {
    let url = (new URL(window.location.href))
    url = url.hostname.replace('www.', '')

    if(url) {
      return url
    }
  }

  async getUser() {
    const user = await chrome.storage.sync.get('user')
    if(user) {
      return user
    }
  }

  async searchUserData() {
    if(!this.state.user) { return }

    console.log("All the conditions are met, searching for user data")
    console.log("User: " + this.state.user, "Url: " + this.state.url, "Form: " + this.state.form, "Inputs: " + this.state.inputs)

    const urlRef = doc(db, "users/" + this.state.user + "/data/" + this.state.url)
    const urlSnap = await getDoc(urlRef)
    
    // if url is stored, get values
    if(urlSnap.exists()) {
      console.log("Data stored")
      this.fillInputs(urlSnap.data())

    } else {
      console.log("Data not stored")
      this.state.form.addEventListener('submit', this.storeInputs)
    }
  }

  async storeInputs() {
    console.log("Storing the inputs")
    const inputs = this.state.inputs

    const urlDoc = doc(db, "users", this.state.user, "data", this.state.url)
    await setDoc(urlDoc, {})

    for(let input of inputs) {    
      await updateDoc(urlDoc, {
        [input.id]: input.value
      })
    }
  }

  fillInputs(userData) {
    const inputs = this.state.inputs

    for(let input of inputs) {
      try {
        input.value = userData[input.id]
      } catch(e) {
        console.log("Data of input [" + input.id + "] was not found, " + e)
      }
    }
  }

  render() {
    return (
      <div className="extension-container">
        <h1>Content Script</h1>
        <p>This is the content script</p>
      </div>
    )
  }
}

/*
export default function ContentScript() {
  const [isStored, setStored] = useState()

  const [inputs, setInputs] = useState()
  const [form, setForm] = useState()
  const [url, setUrl] = useState()
  const [currentUser, setCurrentUser] = useState()
  const [data, setData] = useState()

  useEffect(() => {
    console.log("ContentScript is running")
    constructor()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if(isStored) {
      fillInputs()
    }

    if(!isStored && form) {
      console.log("Waiting for user to send data")

      form.addEventListener('submit', function(e) {
        console.log("Form submitted")
        storeInputs()
        setStored(true)
      })

      return () => {
        form.removeEventListener('submit', function(e) {})
      }
    }
    // eslint-disable-next-line
  }, [isStored])

  const constructor = function() {

    setInputs(getInputs())
    setForm(getForm())
    setUrl(getUrl())

    getCurrentUser()
  }

  // Search the data of the user
  async function userData() {
    console.log("All the conditions are met, searching for user data")

    console.log("Current user: " + currentUser, "Url: " + url, "Form: " + form)
    const urlRef = doc(db, "users/" + currentUser + "/data/" + url)
    const urlSnap = await getDoc(urlRef)
    
    // if url is stored, get values
    if(urlSnap.exists()) {
      console.log("Data stored")

      setData(urlSnap.data())
      setStored(true)

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
    return document.getElementsByTagName('form')[0]
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
      setCurrentUser(result)

      userData()  // Start searching for user data
    }, function(err) {
      console.log(err); // Error: "It broke"
    });
  }

  function fillInputs() {
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
*/
  
// document.forms[0].submit();