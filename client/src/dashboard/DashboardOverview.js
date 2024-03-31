
import React, { useEffect, useState } from "react";

function DashboardOverview(){
  const userData = JSON.parse(localStorage.getItem('data'));
  const [companyName, setCompanyName] = useState(null);

  useEffect(() => {
    if(userData){
      setCompanyName(userData['Companyname']);
    }
  },[userData])

  return (
    <div>
      <p>{companyName}財會系統</p>
    </div>
  );
}
export default DashboardOverview;
