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

    if(!this.state.url || !this.state.inputs) { return }

    this.storeInputs = this.storeInputs.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

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

    let isFormPage = false
    for(let input of inputs) {
      console.log(input.type)
      if(input.type === "password") {
        isFormPage = true
      }
    }

    if(inputs.length && isFormPage) {
      return inputs
    }
    return undefined
  }
  
  filterInputs(input) {
    switch (input.type) {
      case "email":
      case "text":
      case "tel": 
      case "password":
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
    return undefined
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
    if(!this.state.inputs) { return(
      <div></div>
    ) }
    return (
      <div className='extension-container'>
        <button className='extension-button' onClick={this.handleSubmit}>
          <div className="svg-wrapper-1">
            <div className="svg-wrapper">
            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M1 14.5a6.496 6.496 0 0 1 3.064-5.519 8.001 8.001 0 0 1 15.872 0 6.5 6.5 0 0 1-2.936 12L7 21c-3.356-.274-6-3.078-6-6.5zm15.848 4.487a4.5 4.5 0 0 0 2.03-8.309l-.807-.503-.12-.942a6.001 6.001 0 0 0-11.903 0l-.12.942-.805.503a4.5 4.5 0 0 0 2.029 8.309l.173.013h9.35l.173-.013zM13 12h3l-4 5-4-5h3V8h2v4z" fill="currentColor"></path></svg>
            </div>
          </div>
          <span>Save</span>
        </button>
      </div>
    )
  }
}