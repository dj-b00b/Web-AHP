import React, { useContext, useEffect } from "react";
import "./PageMatrices.scss";
import ArrowBack from "@mui/icons-material/ArrowBack";
import TypicalHeader from "../../templates/TypicalHeader/TypicalHeader";
import Matrix from "../../components/Matrix/Matrix";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table/Table";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { backendUrl, sendRequest } from "../../utils/backend";
import {
  transponMatricesWValues,
  matrixHeaderCriteriaTemplate,
  matrixHeaderAlternativeTemplate,
  createLstForCalcsMatrix,
  getWCalcsMatrix,
  updateCalcsMatrices,
} from "./helpers";
import { AHPCalculator } from "../../components/Matrix/AHP";
import { AuthContext } from "../../context";

export default function PageMatrices(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuth } = useContext(AuthContext);

  const dataFromPrevPage = location.state;
  const criteria = dataFromPrevPage.criteria;
  const countCriteria = criteria.length;
  const alternatives = dataFromPrevPage.alternatives;
  const countAlternatives = alternatives.length;
  const characteristicsAlternativesByCriteria =
    dataFromPrevPage.characteristicsTable;
  const hierarchy = dataFromPrevPage.hierarchy;
  const loadedCalculationId = dataFromPrevPage.calculationId;
  let loadedCalcsMatrices = dataFromPrevPage.loadedCalcsMatrices;
  const loadedAlternativesRankingMatrixCalcs =
    dataFromPrevPage.alternativesRankingMatrixValues;

  const [calculationId, setCalculationId] = useState(() => {
    if (loadedCalculationId) {
      return loadedCalculationId;
    } else {
      return undefined;
    }
  });
  const [isLoadedCalcs, setIsLoadedCalcs] = useState(false);
  const [calcsMatrices, setCalcsMatrices] = useState(() => {
    if (loadedCalcsMatrices) {
      setIsLoadedCalcs(true);
      return loadedCalcsMatrices;
    } else {
      return createLstForCalcsMatrix(countCriteria + 1);
    }
  });
  const [count, setCount] = useState(0);
  const [matricesWValues, setMatricesWValues] = useState(() => {
    if (loadedCalcsMatrices) {
      let wValuesCalcsMatrices = getWCalcsMatrix(
        calcsMatrices,
        countCriteria,
        countAlternatives
      );
      setCount(1);
      return wValuesCalcsMatrices;
    } else {
      return {};
    }
  });
  const [
    averageExpertsGlobalPrioritiesCalcs,
    setAverageExpertsGlobalPrioritiesCalcs,
  ] = useState([]);
  const [countExperts, setCountExperts] = useState(1);
  const [alternativesRankingMatrixCalcs, setAlternativesRankingMatrixCalcs] =
    useState(() => {
      if (loadedAlternativesRankingMatrixCalcs) {
        setIsLoadedCalcs(true);
        return loadedAlternativesRankingMatrixCalcs;
      } else {
        return {};
      }
    });
  const matrixCalculator = new AHPCalculator(
    [],
    0,
    countCriteria,
    countAlternatives
  );
  console.log(
    "PageMatrices location dataFromPrevPage",
    dataFromPrevPage,
    "\ncalculationId",
    calculationId
  );

  useEffect(() => {
    if (!isAuth) {
      navigate("/login/");
    }
    if (loadedAlternativesRankingMatrixCalcs) {
      getAverageExpertsGlobalPrioritiesCalcs();
    }
  }, []);

  useEffect(() => {
    console.log(
      "PageMatrices useEffect matricesWValues state",
      matricesWValues,
      "\nAlternativesRankingMatrixCalcs",
      alternativesRankingMatrixCalcs,
      "\n Все ли матрицы заполнены",
      Object.keys(alternativesRankingMatrixCalcs).length === countCriteria + 1
    );
    if (
      Object.keys(matricesWValues).length === countCriteria + 1 &&
      count > 1
    ) {
      let calcAlternativesRanking =
        matrixCalculator.calcGlobalPriorityAlternatives(
          transponMatricesWValues(
            matricesWValues,
            countCriteria,
            countAlternatives
          )
        );
      setAlternativesRankingMatrixCalcs(calcAlternativesRanking);
    } else if (Object.keys(matricesWValues).length < countCriteria + 1) {
      setAlternativesRankingMatrixCalcs({});
    }
    setCount(count + 1);
  }, [matricesWValues]);

  const addMatrixValues = (
    indexMatrix,
    wMatrix,
    calcMatrixValues,
    isMatrixConsistent = true
  ) => {
    if (isMatrixConsistent) {
      let updatedMatrixWValues = { ...matricesWValues };
      updatedMatrixWValues[indexMatrix] = wMatrix;
      setMatricesWValues(updatedMatrixWValues);
    }
    console.log("addMatrixValues calcsMatrices state", calcsMatrices);
    updateCalcsMatrices(
      indexMatrix,
      calcMatrixValues,
      calcsMatrices,
      setCalcsMatrices
    );
  };

  const delMatrixValues = (indexMatrix, calcMatrixValues) => {
    console.log(
      `delMatrixValues удаление матрицы ${indexMatrix} из-за ее несогласованности`
    );
    let updatedMatrixWValues = { ...matricesWValues };
    delete updatedMatrixWValues[indexMatrix];
    setMatricesWValues(updatedMatrixWValues);

    updateCalcsMatrices(
      indexMatrix,
      calcMatrixValues,
      calcsMatrices,
      setCalcsMatrices
    );
    console.log(
      "delMatrixValues",
      matricesWValues,
      "state calcs",
      calcsMatrices
    );
  };

  async function getAverageExpertsGlobalPrioritiesCalcs() {
    let url = `${backendUrl}/calculations/medium_gp_hierarchies/${hierarchy["id"]}/`;
    let response = await sendRequest(url, "get", null, true);
    console.log("getAverageExpertsGlobalPriorityCalcs response", response);
    setAverageExpertsGlobalPrioritiesCalcs(
      response.data["average_experts_gp_calcs"]
    );
    setCountExperts(response.data["count_experts"]);

    return response;
  }

  async function saveOrUpdateCalcHierarchy() {
    let method, url;
    let data = {
      calc_comparison_matrix: calcsMatrices,
      calc_global_priorities: alternativesRankingMatrixCalcs,
    };

    if (!isLoadedCalcs) {
      method = "post";
      url = `${backendUrl}/calculations/`;
      data["hierarchy"] = hierarchy["id"];
    } else {
      method = "patch";
      url = `${backendUrl}/calculations/${calculationId}/`;
    }

    let response;
    try {
      response = await sendRequest(url, method, data, true);
      console.log("saveOrUpdateCalcHierarchy response", response);
    } catch (err) {
      console.log("saveOrUpdateCalcHierarchy err", err, "\nresponse", response);
      let key = "calculation_id";
      if (
        response.status === 400 &&
        response.data.hasOwnProperty(key) &&
        !isLoadedCalcs
      ) {
        setCalculationId(response.data[key]);
        setIsLoadedCalcs(true);
        await saveOrUpdateCalcHierarchy();
      }
    }

    if (!isLoadedCalcs) {
      setIsLoadedCalcs(true);
      if (response.status === 201) {
        setCalculationId(response.data["id"]);
      }
    }
    await getAverageExpertsGlobalPrioritiesCalcs();
  }

  return (
    <>
      <TypicalHeader
        title={"Метод анализа иерархий"}
        icon1={
          <Link
            to={
              dataFromPrevPage.fromPageCalcs === true
                ? "/calculations/"
                : "/matrix/configure/"
            }
            style={{ textDecoration: "none", color: "white" }}
            state={dataFromPrevPage}
          >
            <ArrowBack sx={{ fontSize: 30 }} />
          </Link>
        }
        icon2={
          Object.keys(alternativesRankingMatrixCalcs).length ===
          countCriteria + 1 ? (
            <SaveAsIcon
              onClick={saveOrUpdateCalcHierarchy}
              sx={{ fontSize: 30 }}
            />
          ) : undefined
        }
      />

      <div className="hierarchy-name">{hierarchy["name"]}</div>

      <div className="matrices">
        <Table
          classNameTable={"characteristics-table"}
          nameColumns={["Критерии/Альтернативы", ...alternatives]}
          countRows={criteria}
          countColumns={alternatives}
          classNameInput={"input-characteristics"}
          tableValues={characteristicsAlternativesByCriteria}
          firstColumnIsHeader={true}
        ></Table>

        <Matrix
          addMatrixValues={addMatrixValues}
          delMatrixValues={delMatrixValues}
          loadedMatrixValues={calcsMatrices[0] ? calcsMatrices[0] : null}
          matricesWValues={matricesWValues}
          indexMatrix={0}
          dimension={countCriteria}
          nameCompElem={criteria}
          nameColumns={["Критерии", ...matrixHeaderCriteriaTemplate]}
          countCriteria={countCriteria}
          countAlternatives={countAlternatives}
        />

        {criteria.map((column, index) => (
          <Matrix
            addMatrixValues={addMatrixValues}
            delMatrixValues={delMatrixValues}
            loadedMatrixValues={
              calcsMatrices[index + 1] ? calcsMatrices[index + 1] : null
            }
            matricesWValues={matricesWValues}
            indexMatrix={index + 1}
            dimension={countAlternatives}
            nameCompElem={alternatives}
            countCriteria={countCriteria}
            countAlternatives={countAlternatives}
            nameColumns={[criteria[index], ...matrixHeaderAlternativeTemplate]}
          />
        ))}

        {Object.keys(alternativesRankingMatrixCalcs).length ===
        countCriteria + 1 ? (
          <Table
            classNameTable={"final-table"}
            nameColumns={[
              null,
              ...matrixHeaderCriteriaTemplate.slice(0, countCriteria),
              "Глобальный приоритет",
              "Место",
            ]}
            countRows={["Веса критериев", ...alternatives]}
            countColumns={[...criteria, null, null]}
            classNameInput={"input-criteria-alternatives"}
            tableValues={alternativesRankingMatrixCalcs}
            firstColumnIsHeader={true}
          ></Table>
        ) : (
          <></>
        )}

        {Object.keys(alternativesRankingMatrixCalcs).length ===
          countCriteria + 1 &&
        averageExpertsGlobalPrioritiesCalcs.length !== 0 ? (
          <Table
            classNameTable={"final-table"}
            additionalclassNameTable={"average-experts-calcs"}
            nameColumns={[
              "Потенциальная предпочтительная альтернатива",
              `Среднее глобальных приоритетов ${countExperts} экспертов`,
              "Место",
            ]}
            countRows={alternatives}
            countColumns={[null, null]}
            classNameInput={"input-characteristics"}
            firstColumnIsHeader={true}
            tableValues={averageExpertsGlobalPrioritiesCalcs}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
