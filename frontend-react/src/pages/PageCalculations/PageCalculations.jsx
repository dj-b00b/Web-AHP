import React, { useContext } from "react";
import "./PageCalculations.scss";
import TypicalHeader from "../../templates/TypicalHeader/TypicalHeader";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Link, useNavigate } from "react-router-dom";
import Calculation from "../../components/Calculation/Calculation";
import { useEffect, useState } from "react";
import { AuthContext } from "../../context";
import { backendUrl, sendRequest } from "../../utils/backend";

export default function PageCalculations() {
  const { isAuth, setIsAuth, deleteAuthDataFromLocalStorage } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const [calcsHierarchies, setCalcsHierarchies] = useState([]);

  useEffect(() => {
    console.log("PageCalculations isAuth", isAuth);
    if (!isAuth) {
      navigate("/login/");
    } else {
      fetchCalcsHierarchies();
    }
  }, []);

  async function fetchCalcsHierarchies() {
    let url = `${backendUrl}/calculations/`;
    let response = await sendRequest(url, "get", null, true);
    setCalcsHierarchies(response.data);
    console.log("fetchCalcsHierarchies response", response.data);
  }

  function returnToLoginPage(e) {
    e.preventDefault();

    setIsAuth(false);
    deleteAuthDataFromLocalStorage();
    navigate("/login/");
  }

  async function deleteCalculation(e) {
    e.preventDefault();
    let indexCalcHierarchy = e.target.getAttribute("name");
    let delHierarchy = calcsHierarchies[indexCalcHierarchy];
    console.log(
      "deleteCalculation index",
      indexCalcHierarchy,
      "\n calculation",
      delHierarchy
    );

    let url = `${backendUrl}/calculations/${delHierarchy["id"]}/`;
    let response;
    try {
      response = await sendRequest(url, "delete", null, true);
      console.log("deleteCalculation response", response);
    } catch (err) {
      console.log("deleteCalculation err", err, "\nresponse", response);
    }
    let updatedCalcsHierarchies = calcsHierarchies.slice();
    delete updatedCalcsHierarchies[indexCalcHierarchy];
    setCalcsHierarchies(updatedCalcsHierarchies);
  }

  return (
    <>
      <TypicalHeader
        title={"Метод анализа иерархий"}
        icon1={
          <Link to="/login/" style={{ textDecoration: "none", color: "white" }}>
            <button onClick={returnToLoginPage} className="logout-button">
              Выйти
            </button>
          </Link>
        }
        icon2={
          <Link
            to="/matrix/configure/"
            style={{ textDecoration: "none", color: "white" }}
          >
            <EditNoteIcon sx={{ fontSize: 40 }} />
          </Link>
        }
      />
      <div className="mini-title">Завершенные расчеты</div>
      <div className="calcs">
        {calcsHierarchies.length !== 0 ? (
          calcsHierarchies.map((calcHierarchy, i) => (
            <Calculation
              hierarchy={calcHierarchy["hierarchy"]}
              calcs={calcHierarchy}
              dateCalc={calcHierarchy["datetime"]}
              countExpertsCalcs={calcHierarchy["count_experts_calcs"]}
              callback={deleteCalculation}
              key={i}
              index={i}
            ></Calculation>
          ))
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
