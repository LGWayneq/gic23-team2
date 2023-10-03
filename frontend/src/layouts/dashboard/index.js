// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";

// Soft UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import LineGraph from "./components/LineGraph";
import { useEffect, useState } from "react";
import { get } from "api/api";
import PieChart from "components/PieChart";
import Loading from "components/Loading";

function Dashboard() {
  const [countryData, setCountryData] = useState([]);
  const [fundData, setFundData] = useState([]);
  const [loading, setLoading] = useState(false);

  function processCountryData(data) {
    const res = [];
    const combinedMarketValue = data.reduce((acc, item) => acc + item.totalMarketValue, 0);
    const other = { name: 'Other', y: 0 };
    data.forEach((item) => {
      if (item.totalMarketValue / combinedMarketValue < 0.01) other.y += item.totalMarketValue;
      else res.push({ name: item._id, y: item.totalMarketValue });
    });

    res.push(other);
    return res;
  }

  function processFundData(inputData) {
    const outputData = [];
    const fundMap = new Map();
    for (const item of inputData) {
      const fundName = item._id.fund;
      const marketValue = item.totalMarketValue;
      const date = item._id.reportedDate;
      if (!fundMap.has(fundName)) {
        fundMap.set(fundName, new Array(8).fill(null));
      }
      const index = new Date(date).getMonth();
      fundMap.get(fundName)[index] = marketValue/1000000;
    }
    for (const [fundName, marketValues] of fundMap) {
      outputData.push({
        name: fundName,
        data: marketValues.map(x => x ? Math.round(x) : null)
      });
    }
    return outputData;
  }

  async function fetchData() {
    setLoading(true);
    const countryRes = await get(`/analytics/country`)
    setCountryData(processCountryData(countryRes.data));
    const fundRes = await get(`/analytics/performance`)
    setFundData(processFundData(fundRes.data));
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SuiBox py={3}>
        <SuiBox mb={3}>
          {loading && <Loading />}
          <PieChart
            title="Positions by Country"
            labelName="Country"
            data={countryData} />
          <LineGraph
            title='Total Positions Market Value (in millions)'
            yAxisTitle="Market Value"
            data={fundData} />
        </SuiBox>
      </SuiBox>
    </DashboardLayout>
  );
}

export default Dashboard;
