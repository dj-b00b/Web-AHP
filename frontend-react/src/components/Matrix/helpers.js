import { validQualitativeAssessmentsAlongWithInverseOnes } from "./AHP";

const convertingDecimalToFraction = {
  0.5: "1/2",
  0.3333333333333333: "1/3",
  0.25: "1/4",
  0.2: "1/5",
  0.16666666666666666: "1/6",
  0.14285714285714285: "1/7",
  0.125: "1/8",
  0.1111111111111111: "1/9",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
}; 

const convertingFractionsToDecimals = {
  "1/2": 0.5,
  "1/3": 0.3333333333333333,
  "1/4": 0.25,
  "1/5": 0.2,
  "1/6": 0.16666666666666666,
  "1/7": 0.14285714285714285,
  "1/8": 0.125,
  "1/9": 0.1111111111111111,
};

export function createFieldValuesMatrix(n) {
  let lst = [];

  for (let i = 0; i < n + 5; i++) {
    let wrapperLst = [];
    for (let j = 0; j < n + 2; j++) {
      i === j && i < n ? wrapperLst.push("1") : wrapperLst.push("");
    }
    lst.push(wrapperLst);
  }
  return lst;
}

export function converterStringToNum(stateMatrix, n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let elem = stateMatrix[i][j];

      if (convertingFractionsToDecimals.hasOwnProperty(elem)) {
        stateMatrix[i][j] = convertingFractionsToDecimals[elem];
      } else {
        stateMatrix[i][j] = Number(elem);
      }
    }
  }
}

export function converterNumToString(stateMatrix, n) {
  for (let i = 0; i < n + 5; i++) {
    for (let j = 0; j < n + 2; j++) {
      let elem = stateMatrix[i][j];
      if (
        convertingDecimalToFraction.hasOwnProperty(elem) &&
        i <= n - 1 &&
        j <= n - 1
      ) {
        stateMatrix[i][j] = convertingDecimalToFraction[elem];
      } else if (i <= n - 1 && j <= n - 1 && elem === 0) {
        stateMatrix[i][j] = "";
      } else if (i <= n - 1 && j <= n - 1 && elem === 0 && elem(isNaN)) {
        stateMatrix[i][j] = "";
      } else if (isNaN(elem)) {
        stateMatrix[i][j] = String(elem);
      } else if (elem === "") {
        break;
      } else {
        stateMatrix[i][j] = elem.toFixed(3);
      }
    }
  }
}

export function putReverseValueInReverseCellMatrix(
  i,
  j,
  value,
  matrixValuesState,
  callbackForChangeState
) {
  const newState = matrixValuesState.slice();

  if (i === j) {
    return;
  } else if (
    validQualitativeAssessmentsAlongWithInverseOnes.hasOwnProperty(value)
  ) {
    newState[i][j] = value;
  } else {
    newState[i][j] = "";
    if (value === "") {
      newState[j][i] = "";
    }
  }
  if (i !== j && value !== "") {
    newState[j][i] = validQualitativeAssessmentsAlongWithInverseOnes[value];
  }
  callbackForChangeState(newState);
}
