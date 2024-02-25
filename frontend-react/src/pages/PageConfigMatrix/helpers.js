export function checkingCompletenessLstForInputCriteriaAlternativesCharacteristics(
  lst
) {
  if (lst.length === 0) {
    return false;
  }

  for (let i = 0; i < lst.length; i++) {
    let hasEmptyElem = false;
    if (lst[i].length === 0) {
      return false;
    }
    if (Array.isArray(lst[i])) {
      lst[i].forEach((elem) => {
        if (elem === "") {
          hasEmptyElem = true;
        }
      });
    }
    if (hasEmptyElem) {
      return false;
    }
    if (lst[i] === "") {
      return false;
    }
  }
  return true;
}

export function createEmptyLstWithValue(n, value) {
  let lst = [];
  for (let i = 0; i < n; i++) {
    lst.push(value);
  }
  return lst;
}

export function createLstForInputCriteriaAlternatives(n) {
  return createEmptyLstWithValue(n, "");
}

export function create2DLstForInputCharacteristics(
  countAlternatives,
  countCriteria
) {
  let lst = [];
  for (let i = 0; i < countAlternatives; i++) {
    let wrapperLst = [];
    for (let j = 0; j < countCriteria; j++) {
      wrapperLst.push("");
    }
    lst.push(wrapperLst);
  }
  return lst;
}

export function showDetailInfoHierarchy(
  existingHierarchies,
  selectedHierarchy
) {
  let desiredHierarchy;
  existingHierarchies.forEach((hierarchy) => {
    if (hierarchy.name === selectedHierarchy) {
      desiredHierarchy = hierarchy;
    }
  });
  return desiredHierarchy;
}
