import React from "react";
import "./Table.scss";
import FieldInput from "../FieldInput/FieldInput";

export default function Table(props) {
  console.log(
    `Table ${props.indexMatrix ? props.indexMatrix : ""} props`,
    props
  );
  let countCriteria = props.countColumns.length - 2;

  return (
    <table
      className={
        !props.additionalclassNameTable
          ? props.classNameTable
          : props.additionalclassNameTable
      }
    >
      <thead>
        <tr>
          {props.nameColumns.map((column, index) => (
            <th key={index}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.countRows.map((nameRow, i) => (
          <tr key={i}>
            {props.firstColumnIsHeader ? (
              <td
                className={
                  props.classNameTable === "final-table" &&
                  props.tableValues[i][countCriteria + 1] === 1
                    ? "headings-left-preferred-alternative"
                    : "headings-left"
                }
              >
                {props.firstColumnIsHeader ? nameRow : undefined}
              </td>
            ) : props.firstColumnIsHeader ? (
              nameRow
            ) : undefined}

            {props.countColumns.map((valueCell, j) => (
              <td
                key={j}
                className={
                  props.classNameTable === "final-table" &&
                  props.tableValues[i][countCriteria + 1] === 1
                    ? "preferred-alternative"
                    : undefined
                }
                name={
                  props.classNameTable === "final-table" &&
                  j === props.countColumns.length
                    ? "Global priority alternative " + String(i)
                    : ""
                }
              >
                {props.availabilityInputFields ||
                (props.classNameTable === "matrix" &&
                  j < props.countRows.length &&
                  i < props.countRows.length) ? (
                  <FieldInput
                    className={props.classNameInput}
                    type="text"
                    name={
                      props.classNameTable ===
                      "table-input-criteria-alternatives"
                        ? j === 0
                          ? "Criterion"
                          : "Alternative"
                        : props.nameInput
                    }
                    value={
                      props.classNameTable ===
                      "table-input-criteria-alternatives"
                        ? undefined
                        : props.tableValues[i][j]
                    }
                    onChange={(e) => props.callback(e, i, j)}
                  />
                ) : props.classNameTable === "final-table" ? (
                  j === countCriteria && i !== 0 ? (
                    parseFloat(props.tableValues[i][j]).toFixed(3)
                  ) : (
                    props.tableValues[i][j]
                  )
                ) : (
                  props.tableValues[i][j]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
