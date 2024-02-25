import React from "react";
import "./Calculation.scss";
import { Link } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import { formateDate } from "./helpers";

export default function Calculation(props) {
  let hierarchyCriteria = props.calcs["hierarchy"]["criteria"];
  let hierarchyAlternatives = props.calcs["hierarchy"]["alternatives"];
  console.log(
    "Calculation props",
    props.calcs,
    hierarchyCriteria,
    hierarchyAlternatives
  );

  return (
    <Link
      to="/matrix/comparison/"
      style={{ textDecoration: "none", color: "black" }}
      state={{
        loadedCalcsMatrices: props.calcs["calc_comparison_matrix"],
        alternativesRankingMatrixValues: props.calcs["calc_global_priorities"],
        criteria: hierarchyCriteria,
        alternatives: hierarchyAlternatives,
        characteristicsTable: props.calcs["hierarchy"]["characteristics"],
        hierarchy: props.hierarchy,
        fromPageCalcs: true,
        calculationId: props.calcs["id"],
      }}
    >
      <div className="calc">
        <div className="calc-params">
          <div className="name-calc">{`Расчет по ${props.hierarchy["name"]}`}</div>

          <div className="date-calc">{`Дата: ${formateDate(
            props.dateCalc
          )}`}</div>

          <div className="count-experts-calc">
            {`Число экспертов, проводивших расчеты по данной иерархии: ${props.countExpertsCalcs}`}
          </div>
        </div>

        <button className="delete-calc">
          {" "}
          <ClearIcon
            name={props.index}
            onClick={props.callback}
            sx={{ fontSize: 30 }}
          />{" "}
        </button>
      </div>
    </Link>
  );
}
