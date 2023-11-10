import Modal from "./Modal";
import { useState } from "react";

export default function Authenticate() {
    // Props + Hooks 
    const [LogOrSign, setLogOrSign] = useState('SignUp');
//Functions 

const changeForm = () =>{
     LogOrSign == "login" ? setLogOrSign('SignUp') : setLogOrSign('login');
}

const handleSubmit = (event)=>{
    event.preventDefault();
    console.log('testForm');
    const formD = new FormData();
    const fetch = async ()=>{
        const sendFetch = await fetch('http://localhost/finance-flow/authentication.php?signin=true',{
            method: "POST",
            body:formD,
        });
        const returnFetch = await sendFetch.json();
        console.log(returnFetch);
    }
}
//Return
    return (
        <Modal>
            {LogOrSign === "SignUp" ? (
                <div className="container_form">
                    <div className="signUp">
                        <form action="" onSubmit={handleSubmit}>
                            <label htmlFor="email">Email</label>
                            <input type="text" name="email_sign_up" />
                            <label htmlFor="password">Password</label>
                            <input type="password" name="passwordConfirm" />
                            <label htmlFor="conf_pass_sign_up">Confirm Password</label>
                            <input type="password" name="conf_pass_sign_up" />
                            <button>Sign Up</button>
                        </form>
                        <button onClick={changeForm} >Already Have A Count ?</button>
                    </div>
                </div>
            ) : (
                <div className="signIn">
                    <form action="">
                        <label htmlFor="email_sign_in">Email</label>
                        <input type="text" name="email_sign_in" />
                        <label htmlFor="password_sign_in">Password</label>
                        <input type="password" name="password_sign_in" />
                        <button>Sign in</button>
                        <button onClick={changeForm}>Forgot Password ?</button>
                    </form>
                </div>
            )}
        </Modal>
    );
}
