import React from "react";
import "./Matrix.scss";
import { useState } from "react";
import Table from "../../components/Table/Table";
import {
  namesCalcColumnsMatrix,
  namesCalcRowsMatrix,
  AHPCalculator,
} from "./AHP";
import {
  converterStringToNum,
  converterNumToString,
  createFieldValuesMatrix,
  putReverseValueInReverseCellMatrix,
} from "./helpers";

export default function Matrix(props) {
  const dimension = props.dimension;
  const nameColumns = props.nameColumns;
  const nameCompElem = props.nameCompElem;
  const matricesWValues = props.matricesWValues;
  const countCriteria = props.countCriteria;
  const countAlternatives = props.countAlternatives;
  const indexMatrix = props.indexMatrix;
  const loadedMatrixValues = props.loadedMatrixValues;
  const callbackAddValuesMatrix = props.addMatrixValues;
  const callbackDelValuesMatrix = props.delMatrixValues;

  const [matrixValues, setMatrixValues] = useState(() => {
    if (loadedMatrixValues) {
      return loadedMatrixValues;
    } else {
      return createFieldValuesMatrix(dimension);
    }
  });

  function calcMatrix(indexMatrix) {
    converterStringToNum(matrixValues, dimension);
    let matrixCalculator = new AHPCalculator(
      matrixValues,
      dimension,
      countCriteria,
      countAlternatives
    );
    let calcMatrixValues = matrixCalculator.calcMatrix();
    setMatrixValues(calcMatrixValues);
    let isValidCalculatedMatrix = matrixCalculator.checkValidityCalcMatrix();
    converterNumToString(matrixValues, dimension);
    console.log(
      `Матрица ${indexMatrix} согласованна (ОС < 0.15)?  `,
      isValidCalculatedMatrix
    );

    if (isValidCalculatedMatrix) {
      let wValuesMatrix = matrixCalculator.getWMatrix();
      callbackAddValuesMatrix(indexMatrix, wValuesMatrix, calcMatrixValues);
    } else if (
      !isValidCalculatedMatrix &&
      matricesWValues.hasOwnProperty(indexMatrix)
    ) {
      callbackDelValuesMatrix(indexMatrix, calcMatrixValues);
    } else {
      callbackAddValuesMatrix(indexMatrix, null, calcMatrixValues, false);
    }
  }

  const handleChangeMatrixValues = (e, i, j) => {
    const value = e.target.value;
    console.log(
      `handleChangeMatrixValues в матрице ${indexMatrix}  value`,
      value,
      "  индексы измененной ячейки матрицы",
      i,
      j
    );
    putReverseValueInReverseCellMatrix(
      i,
      j,
      value,
      matrixValues,
      setMatrixValues
    );
    calcMatrix(indexMatrix);
    console.log("state расчитанной матрицы", matrixValues);
  };

  return (
    <Table
      classNameTable={"matrix"}
      nameColumns={[
        ...nameColumns.slice(0, dimension + 1),
        ...namesCalcColumnsMatrix,
      ]}
      countRows={[
        ...nameCompElem.slice(0, dimension + 1),
        ...namesCalcRowsMatrix,
      ]}
      countColumns={nameColumns.slice(0, dimension + 2)}
      classNameInput={"input-matrix"}
      nameInput={indexMatrix}
      callback={handleChangeMatrixValues}
      tableValues={matrixValues}
      firstColumnIsHeader={true}
      indexMatrix={indexMatrix}
    ></Table>
  );
}
