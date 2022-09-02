/* global chrome */
import React from 'react'
import { db } from '../firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import './ContentScript.css'

export default class ContentScript extends React.Component {
  constructor() {
    super()

    this.state = {
      form: this.getForm(),
      inputs: this.getInputs(),
      url: this.getUrl(),
      user: this.getUser(),
      isStored: true
    }
    this.storeInputs = this.storeInputs.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    console.log(this.state.form)
    if(!this.state.inputs) { return }

    this.searchUserData()
  }

  handleSubmit() {
    if(!this.state.form && this.state.isStored) { return }

    console.log("Submitting the form")
    this.storeInputs()
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

  getUser() {
    return "2SQCgGVyg4Wvyfk39TMDglJqbNd2"
    /*
    chrome.identity.getProfileUserInfo(function(userInfo) {
         this.setState({ user: userInfo.id })
     });
     */
  }

  async searchUserData() {
    if(!this.state.user) { return }

    console.log("All the conditions are met, searching for user data")

    const urlRef = doc(db, "users/" + this.state.user + "/data/" + this.state.url)
    const urlSnap = await getDoc(urlRef)
    
    // if url is stored, get values
    if(urlSnap.exists()) {
      console.log("Data stored")
      this.fillInputs(urlSnap.data())

    } else {
      console.log("Data not stored")
      
      this.setState({ isStored: false })
    }
  }

  async storeInputs() {
    if(!this.state.user || !this.state.inputs) { return }

    console.log("Storing the inputs")
    const inputs = this.state.inputs

    const urlDoc = doc(db, "users", this.state.user, "data", this.state.url)
    await setDoc(urlDoc, {})

    for(let input of inputs) {   
      await updateDoc(urlDoc, {
        [input.id]: input.value
      })
    }

    console.log("Inputs stored")
    this.state.form.submit()
  }

  fillInputs(userData) {
    const inputs = this.state.inputs

    if(!inputs) { return }

    for(let input of inputs) {
      try {
        input.value = userData[input.id]
      } catch(e) {
        console.log("Data of input [" + input.id + "] was not found, " + e)
      }
    }

    //this.state.form.submit()
  }

  render() {
    return (
      <div className='extension-container'>
        <button onClick={this.handleSubmit}>
          <div className="svg-wrapper-1">
            <div className="svg-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
              </svg>
            </div>
          </div>
          <span>Save</span>
        </button>
      </div>
    )
  }
}