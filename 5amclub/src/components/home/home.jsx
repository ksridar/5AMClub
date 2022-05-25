import React from 'react'
import './home.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from '../dashboard/dashboard';
import { useNavigate } from "react-router-dom";



import { initializeApp } from "firebase/app";
import { useEffect, useState } from 'react';
import { createUser } from '../../functions/userData';

import logo from "../../assets/logo.jpg"
import vadivelu from "../../assets/vadivelu.png"

const firebaseConfig = {
    apiKey: "AIzaSyA2VS7uf7CrwYx215IYhvhdiC1itW7aM8Y",
    authDomain: "am-club-2ae7c.firebaseapp.com",
    projectId: "am-club-2ae7c",
    storageBucket: "am-club-2ae7c.appspot.com",
    messagingSenderId: "148454263679",
    appId: "1:148454263679:web:63e4f8488f78ed8c3f284a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth();



const Home = () => {

    const navigate = useNavigate();

    const [loginView, setLoginView] = useState(true)
    const [signInView, setSignInView] = useState(false)
    const [resetPasswordView, setResetPasswordView] = useState(false)
    const [text, setText] = useState('Create Account')

    useEffect(() => {
        console.log(localStorage.getItem('auth'))
        if (localStorage.getItem('auth') && (localStorage.getItem('auth') != "loggedOut")) {
            navigate('/dashboard')
        }
    }, [])

    function createAccount(event) {
        event.preventDefault()
        const form = event.currentTarget
        const fName = form.fName.value
        const lName = form.lName.value
        const email = form.email.value
        const password1 = form.password1.value
        const password2 = form.password2.value
        console.log("before")
        if (password1 != password2) {
            alert("Passwords do not match")
            return
        }
        createUserWithEmailAndPassword(auth, email, password1)
            .then(async (userCredential) => {
                // Signed in 
                await createUser({
                    fName, lName, email
                })
                const user = userCredential.user;
                function run() {
                    localStorage.setItem('auth', user.uid)
                    navigate('/dashboard', { replace: true })
                }
                setTimeout(run, 2000)


            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(error.message)
            });
    }

    function signIn(event) {
        event.preventDefault()
        const form = event.currentTarget
        const email = form.loginEmail.value
        const password = form.loginPassword.value
        
        console.log("before")
        
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                localStorage.setItem('auth', user.uid)
                navigate('/dashboard', { replace: true })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(error.message)
            });
    }

    function resetPassword(event) {
        event.preventDefault()
        const form = event.currentTarget
        const email = form.resetEmail.value
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Check your email!")
                setResetPasswordView(false)
                setLoginView(true)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(error.message)
            });
    }

    return (
        <div className="Home">
            <div className="Header">
                <Navbar bg="light" expand="lg" fixed="top">
                    <Container>
                        <Navbar.Brand href="#home"><img
                            src={vadivelu}
                            width="120"
                            height="50"
                            className="d-inline-block align-top"
                        /></Navbar.Brand>
                        {(text == "Login") ?
                            <Nav.Link onClick={() => {
                                setLoginView(true)
                                setSignInView(false)
                                setResetPasswordView(false)
                                setText("Create Account")

                            }}>{text}</Nav.Link> :
                            <Nav.Link onClick={() => {
                                setLoginView(false)
                                setSignInView(true)
                                setResetPasswordView(false)
                                setText("Login")
                            }}>{text}</Nav.Link>
                        }
                    </Container>
                </Navbar>
            </div>
            <div>
            </div>
            {loginView ?
                <div className="Login">
                    <Form onSubmit={signIn}>
                        <Form.Group className="mb-3" controlId="loginEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Email" required/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="loginPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" required/>
                            
                        </Form.Group>
                        <div>
                        <a className="resetLink" onClick={() => {
                                setLoginView(false)
                                setSignInView(false)
                                setResetPasswordView(true)
                                setText("Login")
                            }}>Forgot your password?</a>
                            </div>
                        <Button className="button" variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>

                </div> : null}

            {signInView ?
                <div>
                    <div className="Login">
                        <Form onSubmit={createAccount}>
                            <Form.Group className="mb-3" controlId="fName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter First Name" required/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="lName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter Last Name" required/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" required/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password1">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" required/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password2">
                                <Form.Label>Repeat Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" required/>
                            </Form.Group>
                            <Button className="button" variant="success" type="submit" >
                                Sign Up!
                            </Button>
                        </Form>
                    </div> </div> : null}

            {resetPasswordView ?
                <div>
                    <div className="Login">
                        <Form onSubmit={resetPassword}>
                            <Form.Group className="mb-3" controlId="resetEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" required/>
                            </Form.Group>
                            <Button className="button" variant="warning" type="submit" >
                                Reset Password
                            </Button>
                        </Form>
                    </div> </div> : null}
        </div>
    )
}

export default Home