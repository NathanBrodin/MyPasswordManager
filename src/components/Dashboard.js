import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { goTo, Link } from 'react-chrome-extension-router'
import logo from '../logo.svg';
import Login from './Login'
import UpdateProfile from './UpdateProfile';

export default function Dashboard() {
    const { currentUser, logout, getAutoSubmit, updateAutoSubmit } = useAuth()
    const [checked, setChecked] = useState(false)
    initAutoSubmit()

    async function handleLogout() {
        try {
            await logout()
            goTo(Login)
        } catch {
            console.error("Failed to log out")
        }
    }

    async function handleAutoSubmitChange() {
        if(checked) {
            await updateAutoSubmit(false)
            setChecked(false)
        } else {
            await updateAutoSubmit(true)
            setChecked(true)
        }
    }

    async function initAutoSubmit() {
        const autoSubmit = await getAutoSubmit()
        setChecked(autoSubmit)
    }

  return (
    <div className='component-container'>
        <header>
            <img src={logo} className="App-logo" alt="logo" />
            <h2>My Password Manager</h2>
        </header>
        <div className='profile-container'>
            <h2>Profile</h2>
            <input id='checkbox' className='checkbox' type="checkbox" checked={checked} onChange={handleAutoSubmitChange}/>
            <label htmlFor='checkbox'>Enable auto-submit</label>
            <p>Email: {currentUser.email}</p>
        </div>
        <div className='logout-container'>
            <Link component={UpdateProfile}>Update Profile</Link>
            <button className='submit-button' onClick={handleLogout}>Log Out</button>    
        </div>
    </div>
  )
}
