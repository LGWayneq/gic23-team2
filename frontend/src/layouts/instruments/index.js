/**
=========================================================
* Soft UI Dashboard React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-material-ui
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";

// Soft UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Custom styles for the Tables
import styles from "layouts/instruments/styles";

import SuiButton from "components/SuiButton";
import { useState, useEffect } from 'react';
import ImportPopup from "./components/ImportPopup";
import FilterSortTable from "../../components/FilterSortTable"
import Table from "./components/Table";
import { get } from "api/api";

function Instruments() {
  const classes = styles();
  const [open, setOpen] = useState(false);
  const [insertedRows, setInsertedRows] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const res = await get('/instruments/');
    console.log(JSON.parse(res.data))
    setData(JSON.parse(res.data));
  }

  function getColumns() {
    if (insertedRows.length === 0 || !insertedRows[0]) return [];
    else return Object.keys(insertedRows[0])
      .filter(columnName => columnName !== "_id")
      .map((columnName) => {
        return { id: columnName, label: columnName }
      });
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Table data={data}></Table>
    </DashboardLayout>
  );
}

export default Instruments;
