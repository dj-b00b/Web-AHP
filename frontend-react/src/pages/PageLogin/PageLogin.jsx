import React, { useContext, useEffect, useState } from "react";
import "./PageLogin.scss";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context";
import { backendUrl, sendRequest } from "../../utils/backend";
import { userAttributes, userAttributesEng } from "./helpers";
import FieldInput from "../../components/FieldInput/FieldInput";

export default function PageLogin() {
  const navigate = useNavigate();
  const { isAuth, setIsAuth, putAuthDataToLocalStorage } =
      useContext(AuthContext);

  const [inputFields, setInputFields] = useState({});
  const [isUserRegistered, setIsUserRegistered] = useState(true);
  const [countInputFields, setCountInputFields] = useState(2);
  const [greenButtonState, setGreenButtonState] = useState("Войти");
  const [isSuccessAuth, setIsSuccessAuth] = useState(true);

  useEffect(() => {
    console.log("PageLogin useEffect isAuth", isAuth);
    if (isAuth) {
      navigate("/calculations/");
    }
  }, []);

  async function sendUserData(e) {
    let data = {
      username: inputFields["username"],
      password: inputFields["password"],
    };
    let url = `${backendUrl}/experts/token-auth/`;

    if (!isUserRegistered) {
      data["email"] = inputFields["email"];
      data["first_name"] = inputFields["first_name"];
      data["last_name"] = inputFields["last_name"];

      url = `${backendUrl}/experts/`;
    }

    let response;
    try {
      response = await sendRequest(url, "post", data);
      console.log(
          "sendUserData",
          response,
          "'\nisUserRegistered",
          isUserRegistered
      );
    } catch (err) {
      console.log("Неудачная попытка аутентификации", data["username"], err);
      setIsSuccessAuth(false);

      return;
    }

    switch (response.status) {
      case 200:
        setIsAuth(true);
        putAuthDataToLocalStorage(response);
        navigate("/calculations/");
        console.log("auth-token", localStorage.getItem("token"));
        break;
      case 201:
        setIsUserRegistered(true);
        setGreenButtonState("Войти");
        setCountInputFields(2);
        break;
    }
  }

  const handleClickRegistration = () => {
    console.log(
        "handleClickRegistration isUserRegistered",
        isUserRegistered,
        "countInputFields",
        countInputFields
    );
    if (isUserRegistered) {
      setIsUserRegistered(false);
      setCountInputFields(userAttributes.length);
      setGreenButtonState("Создать");
    } else {
      setIsUserRegistered(true);
      setCountInputFields(2);
      setInputFields({
        username: inputFields["username"],
        password: inputFields["password"],
      });
      setGreenButtonState("Войти");
    }
  };
  const handleInputFieldChange = (e) => {
    const { name, value } = e.target;
    setInputFields({ ...inputFields, [name]: value });
    console.log(
        "handleInputFieldChange",
        name,
        value,
        "state inputFields",
        inputFields,
        "isUserRegistered",
        isUserRegistered
    );
  };

  return (
      <>
        <Helmet>
          <style>{"body { background-color: rgb(49 77 120); }"}</style>
        </Helmet>

        <div className="login-page">
          <div className="form">
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
              {userAttributes
                  .slice(0, countInputFields)
                  .map((attribute, index) => (
                      <FieldInput
                          type={index === 1 ? "password" : "text"}
                          name={userAttributesEng[index]}
                          placeholder={userAttributes[index]}
                          onChange={handleInputFieldChange}
                      />
                  ))}

              {!isSuccessAuth ? (
                  <div className="message-error">Логин/пароль указаны неверно!</div>
              ) : (
                  <></>
              )}

              <button onClick={sendUserData}>{greenButtonState}</button>
              {isUserRegistered ? (
                  <p className="message">
                    Не зарегистрированы?{" "}
                    <a href="#" onClick={handleClickRegistration}>
                      Создайте аккаунт
                    </a>
                  </p>
              ) : (
                  <p className="message">
                    Зарегистрированы?{" "}
                    <a href="#" onClick={handleClickRegistration}>
                      Войти
                    </a>
                  </p>
              )}
            </form>
          </div>
        </div>
      </>
  );
}
