import React, { useState, useEffect } from "react";
import styles from "./Auth.module.css";
import { useNavigate } from "react-router-dom";
import { GET_TOKEN, CREATE_USER } from "../queries";
import { useMutation } from "@apollo/client";
import jwtDecode from "jwt-decode";
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';

const Auth = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [getToken] = useMutation(GET_TOKEN);
  const [createUser] = useMutation(CREATE_USER);
  const [isLogin, setIsLogin] = useState(true);

  const authUser = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const result = await getToken({
          variables: { username: username, password: password },
        });
        localStorage.setItem("token", result.data.tokenAuth.token);
        result.data.tokenAuth.token && navigate("/employees");
      } catch (err) {
        alert(err.message);
      }
    } else {
      try {
        await createUser({
          variables: { username: username, password: password },
        });
        const result = await getToken({
          variables: { username: username, password: password },
        });
        localStorage.setItem("token", result.data.tokenAuth.token);
        result.data.tokenAuth.token && navigate("/employees");
      } catch (err) {
        alert(err.message);
      }
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const decodedToken = jwtDecode(localStorage.getItem("token"));
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
      } else {
        navigate("/employees");
      }
    }
  },[navigate]);

  return (
    <div className={styles.auth}>
      <form onSubmit={authUser}>
        <div className={styles.auth__input}>
          <label>Usename: </label>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.auth__input}>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">
          {isLogin ? "Login with JWT" : "Create new user"}
        </button>

        <div>
          <FlipCameraAndroidIcon 
            className={styles.auth__toggle}
            onClick={() => setIsLogin(!isLogin)}
          />
        </div>
      </form>
    </div>
  );
};

export default Auth;
