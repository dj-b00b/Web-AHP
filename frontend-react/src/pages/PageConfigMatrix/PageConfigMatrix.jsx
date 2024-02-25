import React, { useContext } from "react";
import TypicalHeader from "../../templates/TypicalHeader/TypicalHeader";
import ArrowBack from "@mui/icons-material/ArrowBack";
import DoneIcon from "@mui/icons-material/Done";
import "./PageConfigMatrix.scss";
import FieldInput from "../../components/FieldInput/FieldInput";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../components/Table/Table";
import { backendUrl, sendRequest } from "../../utils/backend";
import {
  checkingCompletenessLstForInputCriteriaAlternativesCharacteristics,
  create2DLstForInputCharacteristics,
  createLstForInputCriteriaAlternatives,
  showDetailInfoHierarchy,
} from "./helpers.js";
import { AuthContext } from "../../context";

export default function PageConfigMatrix(props) {
  console.log("PageConfigMatrix props", props);

  const navigate = useNavigate();
  const { isAuth } = useContext(AuthContext);

  const url = `${backendUrl}/hierarchies/`;
  const [alternatives, setAlternatives] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [
    characteristicsAlternativesByCriteria,
    setCharacteristicsAlternativesByCriteria,
  ] = useState([]);

  const nameColumnsTableWithCriteriaAlternatives = ["Критерии", "Альтернативы"];
  const nameColumnsCharacteristicsTable = [
    "Критерии/Альтернативы",
    ...alternatives,
  ];

  const largerLst =
    alternatives.length > criteria.length ? alternatives : criteria;
  let [newInputHierarchy, setNewInputHierarchy] = useState("");
  const [selectedHierarchy, setSelectedHierarchy] = useState("");

  let [existingHierarchies, setExistingHierarchies] = useState([]);

  useEffect(() => {
    console.log("PageConfigMatrix isAuth", isAuth);
    if (!isAuth) {
      navigate("/login/");
    } else {
      fetchExistingHierarchies();
    }
  }, []);

  useEffect(() => {
    console.log("useEffect selectedHierarchy", selectedHierarchy);
    if (selectedHierarchy === "") {
      setCriteria([]);
      setAlternatives([]);
      setCharacteristicsAlternativesByCriteria([]);
    } else {
      let desiredHierarchy = showDetailInfoHierarchy(
        existingHierarchies,
        selectedHierarchy
      );
      setCriteria(desiredHierarchy["criteria"]);
      setAlternatives(desiredHierarchy["alternatives"]);
      setCharacteristicsAlternativesByCriteria(
        desiredHierarchy["characteristics"]
      );
    }
  }, [selectedHierarchy]);

  useEffect(() => {
    console.log(
      "useEffect state criteria",
      criteria,
      "\nstate alternatives",
      alternatives,
      "\n count criteria",
      criteria.length,
      "count alternatives",
      alternatives.length
    );
    if (
      !checkingCompletenessLstForInputCriteriaAlternativesCharacteristics(
        characteristicsAlternativesByCriteria
      )
    ) {
      setCharacteristicsAlternativesByCriteria(
        create2DLstForInputCharacteristics(alternatives.length, criteria.length)
      );
    }
  }, [alternatives, criteria]);

  async function fetchExistingHierarchies() {
    let response = await sendRequest(url, "get", null, true);
    setExistingHierarchies(response.data);
    console.log("fetchExistingHierarchies", response.data);
  }

  const handleChangeValueTableWithCriteriaAlternatives = (e, i, j) => {
    const { name, value } = e.target;
    console.log(
      "handleChangeValueTableWithCriteriaAlternatives name",
      name,
      "  value",
      value,
      "  индекс измененного поля",
      i
    );

    if (name === "Criterion") {
      criteria[i] = value;
      setCriteria(criteria.slice());
    } else {
      alternatives[i] = value;
      setAlternatives(alternatives.slice());
    }
  };

  const handleChangeValueCharacteristicsTable = (e, i, j) => {
    const { name, value } = e.target;
    characteristicsAlternativesByCriteria[i][j] = value;
    setCharacteristicsAlternativesByCriteria(
      characteristicsAlternativesByCriteria.slice()
    );
    console.log(
      "handleChangeValueCharacteristicsTable name",
      name,
      "  value",
      value,
      "  индексы измененного поля",
      i,
      j,
      "\n state characteristicsAlternativesByCriteria",
      characteristicsAlternativesByCriteria
    );
  };

  const handleChangeCountCriteriaAlternatives = (e) => {
    const { name, value } = e.target;
    if (typeof Number(value) === "number" && Number(value) <= 14) {
      name === "countAlternatives"
        ? setAlternatives(createLstForInputCriteriaAlternatives(Number(value)))
        : setCriteria(createLstForInputCriteriaAlternatives(Number(value)));
    }
  };

  const handleInputNewHierarchyOrSelectExisting = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    name === "selection-hierarchies"
      ? setSelectedHierarchy(value)
      : setNewInputHierarchy(value);
  };

  async function createNewHierarchy() {
    let response = await sendRequest(
      url,
      "post",
      {
        name: newInputHierarchy,
        criteria: criteria,
        alternatives: alternatives,
        characteristics: characteristicsAlternativesByCriteria,
      },
      true
    );
    console.log("createNewHierarchy response", response.data);

    return response;
  }

  async function handleClick(event) {
    event.preventDefault();

    let response;
    if (newInputHierarchy !== "" && selectedHierarchy === "") {
      response = await createNewHierarchy();
      setNewInputHierarchy(response.data);
    }

    navigate("/matrix/comparison/", {
      state: {
        alternatives: alternatives,
        criteria: criteria,
        characteristicsTable: characteristicsAlternativesByCriteria,
        hierarchy:
          selectedHierarchy === ""
            ? response.data
            : showDetailInfoHierarchy(existingHierarchies, selectedHierarchy),
      },
    });
  }

  return (
    <>
      <TypicalHeader
        title={"Метод анализа иерархий"}
        icon1={<ArrowBack sx={{ fontSize: 30 }} />}
        icon2={
          checkingCompletenessLstForInputCriteriaAlternativesCharacteristics(
            alternatives
          ) &&
          checkingCompletenessLstForInputCriteriaAlternativesCharacteristics(
            criteria
          ) &&
          checkingCompletenessLstForInputCriteriaAlternativesCharacteristics(
            characteristicsAlternativesByCriteria
          ) &&
          (selectedHierarchy !== "") | (newInputHierarchy !== "") ? (
            <Link
              onClick={handleClick}
              style={{ textDecoration: "none", color: "white" }}
            >
              <DoneIcon sx={{ fontSize: 30 }} />
            </Link>
          ) : undefined
        }
      />

      <div className="input-fields">
        <div className="fields-criteria-alternatives">
          <div>
            <div className="field-title">Число критериев</div>
            <FieldInput
              className={"field-input"}
              name="countCriteria"
              value={criteria.length === 0 ? "" : criteria.length}
              onChange={handleChangeCountCriteriaAlternatives}
              type="text"
            />
          </div>
          <div>
            <div className="field-title">Число альтернатив</div>
            <FieldInput
              className={"field-input"}
              name="countAlternatives"
              value={alternatives.length === 0 ? "" : alternatives.length}
              onChange={handleChangeCountCriteriaAlternatives}
              type="text"
            />
          </div>
          <select
            className={
              selectedHierarchy === ""
                ? "not-selected-hierarchy"
                : "selected-hierarchy"
            }
            name="selection-hierarchies"
            value={selectedHierarchy}
            onChange={handleInputNewHierarchyOrSelectExisting}
          >
            <option value="">Выберите иерархию</option>
            {existingHierarchies.map((hierarchy) => (
              <option key={hierarchy["name"]} value={hierarchy["name"]}>
                {hierarchy["name"]}
              </option>
            ))}
          </select>
        </div>
        {selectedHierarchy === "" ? (
          <div>
            <div className="field-title">Добавить новую иерархию</div>
            <FieldInput
              className="field-input-new-hierarchy"
              name="add-new-hierarchy"
              value={newInputHierarchy}
              onChange={handleInputNewHierarchyOrSelectExisting}
              type="text"
            />
          </div>
        ) : undefined}

        {alternatives.length > 0 &&
        criteria.length > 0 &&
        selectedHierarchy === "" ? (
          <Table
            classNameTable={"table-input-criteria-alternatives"}
            nameColumns={nameColumnsTableWithCriteriaAlternatives}
            countRows={largerLst}
            countColumns={[null, null]}
            classNameInput={"input-criteria-alternatives"}
            callback={handleChangeValueTableWithCriteriaAlternatives}
            firstColumnIsHeader={false}
            availabilityInputFields={true}
          ></Table>
        ) : (
          <></>
        )}

        {checkingCompletenessLstForInputCriteriaAlternativesCharacteristics(
          criteria
        ) &&
        checkingCompletenessLstForInputCriteriaAlternativesCharacteristics(
          alternatives
        ) &&
        selectedHierarchy === "" ? (
          <Table
            classNameTable={"characteristics-table"}
            nameColumns={nameColumnsCharacteristicsTable}
            countRows={criteria}
            countColumns={alternatives}
            classNameInput={"input-characteristics"}
            callback={handleChangeValueCharacteristicsTable}
            tableValues={characteristicsAlternativesByCriteria}
            firstColumnIsHeader={true}
            availabilityInputFields={true}
          ></Table>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
