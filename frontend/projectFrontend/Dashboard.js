import React, { useEffect, useState} from "react";
import { fetchDashboard } from "../api/api";

export default function Dashboard () {
const [data, setData] = useState(null);

useEffect(() => {
fetchDashboard().then(setData);
}, []);

if(!data) return <div> Loading.. </div>;

return (
  <div>
  <h2> Top Companies <h2>
{data.top_companies.label.map((name, i) => (
   <div key={}>
  {name} - ${data.top_companies.data[i]}
   <\div>
  ))}
  <\div>
  );
}
