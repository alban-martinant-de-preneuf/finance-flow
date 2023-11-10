import Modal from "./Modal";
import { useState, useContext } from "react";
import UserContext from "../contexts/user.context";

export default function Authenticate() {
    // Props + Hooks 
  const [LogOrSign, setLogOrSign] = useState("SignUp");
  const [message, setMessage] = useState("");
  const { user, setUser } = useContext(UserContext);

  const changeForm = () => {
    setLogOrSign(LogOrSign === "login" ? "SignUp" : "login");
  };

  const handleSignin = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;
    const confPassword = event.target.passwordConfirm.value;

    if (password !== confPassword) {
      console.error("Passwords do not match");
      return;
    }

    const formD = new FormData();
    formD.append("email", email);
    formD.append("password", password);
    formD.append("passwordConfirm", confPassword);

    try {
      const response = await fetch(
        "http://localhost/finance-flow/backend/authentication.php?signin=true",
        {
          method: "POST",
          body: formD,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message)
        console.log(data);
      } else {
        console.error("Server error:", response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  //Login ..
  const handleLog = async (event) => {
    event.preventDefault();
    console.log("testLog");

    const email = event.target.email.value;
    const password = event.target.password.value;
    console.log(email, password);

    //form
    const formD = new FormData();
    formD.append("email", email);
    formD.append("password", password);

    try {
      const response = await fetch(
        "http://localhost/finance-flow/backend/authentication.php?login=true",
        {
          method: "POST",
          credentials: "include",
          body: formD,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        if (data.success) {
          console.log(data.user);
          setUser({
            id: data.user.id,
            email: data.user.email,
            isAuth: true,
          });
        }
      } else {
        console.error("Server error:", response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  //Return
  return (
    <Modal>
      {LogOrSign === "SignUp" ? (
        <div className="container_form">
          <div className="signUp">
            <form action="" onSubmit={handleSignin}>
              <label htmlFor="email">Email</label>
              <input type="text" name="email" />
              <label htmlFor="password">Password</label>
              <input type="password" name="password" />
              <label htmlFor="conf_pass_sign_up">Confirm Password</label>
              <input type="password" name="passwordConfirm" />
              <button>Sign Up</button>
            </form>
            <button onClick={changeForm}>Already Have A Count ?</button>
            <p>{message}</p>
          </div>
        </div>
      ) : (
        <div className="signIn">
          <form action="" onSubmit={handleLog}>
            <label htmlFor="email_sign_in">Email</label>
            <input type="text" name="email" />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" />
            <button>Sign in</button>
            <button onClick={changeForm}>Forgot Password ?</button>
          </form>
        </div>
      )}
    </Modal>
  );
}
