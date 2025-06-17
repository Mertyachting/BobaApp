'use client'
import React, { useState } from "react";

var logged_in = false;

export function loggedIn() {
    return logged_in = true;
}



export default function login() {
    let test_email = 'sb-89a43m40169106@business.example.com';
    let test_password = '123';
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');



    function checkCredentials() {
        if (email === test_email && password === test_password) {
            loggedIn()
        } else {
            console.log('Wrong credentials');
        }
    }

    return (
        <>
            <div className="container vscentered p-6">
                <div className="field">
                    <p className="control has-icons-left has-icons-right">
                        <input className="input" type="email" placeholder="Email" />
                        <span className="icon is-small is-left">
                            <i className="fas fa-envelope"></i>
                        </span>
                        <span className="icon is-small is-right">
                            <i className="fas fa-check"></i>
                        </span>
                    </p>
                </div>
                <div className="field">
                    <p className="control has-icons-left">
                        <input className="input" type="password" placeholder="Password" />
                        <span className="icon is-small is-left">
                            <i className="fas fa-lock"></i>
                        </span>
                    </p>
                </div>
                <div className="field">
                    <p className="control">
                        <button className="button is-success">
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </>
    )
}