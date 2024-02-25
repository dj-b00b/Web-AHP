import { createEmptyLstWithValue } from "../PageConfigMatrix/helpers";

export const matrixHeaderCriteriaTemplate = [
  "K1",
  "K2",
  "K3",
  "K4",
  "K5",
  "K6",
  "K7",
  "K8",
  "K9",
  "K10",
  "K11",
  "K12",
  "K13",
  "K14",
];
export const matrixHeaderAlternativeTemplate = [
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "A6",
  "A7",
  "A8",
  "A9",
  "A10",
  "A11",
  "A12",
  "A13",
  "A14",
];

export function createLstForCalcsMatrix(n) {
  return createEmptyLstWithValue(n, undefined);
}

export function transponMatricesWValues(
  matrixWValues,
  countCriteria,
  countAlternatives
) {
  let newDict = {};
  newDict[0] = matrixWValues[0];

  for (let i = 0; i < countAlternatives; i++) {
    let lst = [];

    for (let j = 1; j < countCriteria + 1; j++) {
      lst.push(matrixWValues[j][i]);
    }

    newDict[i + 1] = lst;
  }
  console.log(
    "Матрица ранжирования альтернатив с транспонированными весами критериев/альтернатив",
    newDict
  );

  return newDict;
}

export function getWCalcsMatrix(calcsMatrix, countCriteria, countAlternatives) {
  let matricesWValues = {};
  for (let i = 0; i < countCriteria + 1; i++) {
    let wValMatrix = calcsMatrix[i]
      .slice(0, countAlternatives)
      .map((elem) => Number(elem[countAlternatives + 1]));
    matricesWValues[i] = wValMatrix;
  }
  return matricesWValues;
}

export function updateCalcsMatrices(
  indexMatrix,
  calcMatrixValues,
  calcsMatricesState,
  setCalcsMatricesState
) {
  let updatedCalcsMatrix = calcsMatricesState.slice();
  updatedCalcsMatrix[indexMatrix] = calcMatrixValues;
  setCalcsMatricesState(updatedCalcsMatrix);
}
