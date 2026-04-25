import React, { useState } from "react";
import { compareCompanies } from "../api/api";

export default function Comparison() {
const [result, setResult] = useState(null);

const handleCompare = () => {
compareCompanies(1,2).then(setResult);
};
return (
  <div>
   <h2> Compare Companies <\h2>
   <button onClick = {handleCompare}>
    Compare Company 1 vs 2
   <\button>

  {result && (
     <div>
      {result.labels.map((name, i) => (
     <div key = {i}>
    {name}: ${result.data[i]}
   <\div>
     ))}
    <h3>Difference: {result.difference}  <\h3>
   <\div>
     ))}
  <\div>
  );
}
