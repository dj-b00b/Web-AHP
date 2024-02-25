// AHP CONSTS
export const namesCalcColumnsMatrix = ["α", "ω"];
export const namesCalcRowsMatrix = ["Сумма", "λ", "λ max", "ИНС", "ОТС"];
export const validQualitativeAssessmentsAlongWithInverseOnes = {
  1: "1",
  2: "1/2",
  3: "1/3",
  4: "1/4",
  5: "1/5",
  6: "1/6",
  7: "1/7",
  8: "1/8",
  9: "1/9",
  "1/2": "2",
  "1/3": "3",
  "1/4": "4",
  "1/5": "5",
  "1/6": "6",
  "1/7": "7",
  "1/8": "8",
  "1/9": "9",
};
export const randomConsistencyIndex = {
  1: 0.0,
  2: 0.0,
  3: 0.58,
  4: 0.9,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
  11: 1.51,
  12: 1.48,
  13: 1.56,
  14: 1.57,
};

const limitRelationConsistencyValue = 0.15;

export class AHPCalculator {
  constructor(matrix, dimension, countCriteria, countAlternatives) {
    this.matrix = matrix;
    this.dimension = dimension;
    this.countCriteria = countCriteria;
    this.countAlternatives = countAlternatives;
    this.w = [];
  }

  calcMatrix() {
    let sumA = 0;
    for (let i = 0; i < this.dimension; i++) {
      sumA = sumA + this.calcA(i);
    }

    for (let i = 0; i < this.dimension + 2; i++) {
      if (i < this.dimension) {
        this.calcW(i, sumA);
      }
      this.calcSum(i);

      if (i < this.dimension) {
        this.calcL(i);
      }
    }
    this.calcLMax();
    this.calcIc();
    this.calcRc();

    return this.matrix;
  }

  calcA(i) {
    let rezMultiply = this.matrix[i]
      .slice(0, this.dimension)
      .reduce((currentPr, elem) => {
        return currentPr * elem;
      }, 1);
    let a = rezMultiply ** (1 / this.dimension);
    this.matrix[i][this.dimension] = a;
    console.log(`a по i-ой строке ${i}  `, a);

    return a;
  }

  calcSum(i) {
    let summaRow = this.matrix
      .slice(0, this.dimension)
      .reduce((currentSum, elem) => currentSum + elem[i], 0);
    this.matrix[this.dimension][i] = summaRow;
    console.log(`Сумма по i-ой столбцу ${i + 1}  `, summaRow);
  }

  calcW(i, sumA) {
    let w = this.matrix[i][this.dimension] / sumA;
    this.matrix[i][this.dimension + 1] = w;
    console.log(`w по i-ой строке ${i}  `, w);
    this.w.push(w.toFixed(3));
  }

  calcL(i) {
    let l = this.matrix[this.dimension][i] * this.matrix[i][this.dimension + 1];
    this.matrix[this.dimension + 1][i] = l;
    console.log(`λ по i-ой строке ${i}  `, l);
  }

  calcLMax() {
    let lMax = this.matrix[this.dimension + 1]
      .slice(0, this.dimension)
      .reduce((currentSum, elem) => currentSum + elem, 0);
    this.matrix[this.dimension + 2][0] = lMax;
    console.log("λ max  ", lMax);
  }

  calcIc() {
    let lMax = this.matrix[this.dimension + 2][0];
    let indexConsistency = (lMax - this.dimension) / (this.dimension - 1);
    this.matrix[this.dimension + 3][0] = Number(indexConsistency.toFixed(3));
    console.log("ИС  ", indexConsistency);
  }

  calcRc() {
    let relationConsistency;
    let indexConsistency = this.matrix[this.dimension + 3][0];

    if (this.dimension <= 2) {
      relationConsistency = indexConsistency;
    } else {
      relationConsistency =
        indexConsistency / randomConsistencyIndex[String(this.dimension)];
    }

    this.matrix[this.dimension + 4][0] = Number(relationConsistency.toFixed(3));
    console.log("ОС  ", relationConsistency);
  }

  checkValidityCalcMatrix() {
    let relationConsistency = this.matrix[this.dimension + 4][0];
    if (
      !isNaN(relationConsistency) &&
      relationConsistency <= limitRelationConsistencyValue &&
      relationConsistency >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  getWMatrix() {
    return this.w;
  }

  calcGlobalPriorityAlternatives(matrixWValues) {
    let globalPriority;
    let globalPrioritiesAlternatives = [];

    for (let i = 0; i < this.countAlternatives; i++) {
      globalPriority = 0;

      for (let j = 0; j < this.countCriteria; j++) {
        globalPriority =
          globalPriority + matrixWValues[i + 1][j] * matrixWValues[0][j];
      }
      globalPriority = globalPriority.toFixed(3);
      console.log(`globalPriority ${i + 1} альтернативы`, globalPriority);
      matrixWValues[i + 1].push(globalPriority);
      globalPrioritiesAlternatives.push(globalPriority);
    }
    return this.rankingAlternatives(
      globalPrioritiesAlternatives,
      matrixWValues
    );
  }

  rankingAlternatives(globalPrioritiesAlternatives, matrixWValues) {
    let sortedGlobalPrioritiesAlternatives = globalPrioritiesAlternatives
      .slice()
      .sort((a, b) => b - a);

    for (let i = 0; i < this.countAlternatives; i++) {
      let elem = globalPrioritiesAlternatives[i];
      let placeAlternative = sortedGlobalPrioritiesAlternatives.indexOf(elem);
      matrixWValues[i + 1][this.countCriteria + 1] = placeAlternative + 1;
    }
    console.log(
      "Матрица ранжирования альтернатив с транспонированными весами критериев/альтернатив",
      matrixWValues
    );

    return matrixWValues;
  }
}
