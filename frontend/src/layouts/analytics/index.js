// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";
import SuiTypography from "components/SuiTypography";
import SuiInput from "components/SuiInput";

// Soft UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Custom styles for the Tables
import styles from "layouts/instruments/styles";

// Data
import instrumentTable from "layouts/analytics/data/instrumentTable";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TableComponent from "../instruments/components/Table";
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import AggregatedView from "./components/AggregatedView";
import BarChart from "./components/BarChart";
import ChatbotButton from "./components/ChatbotButton";
import TopN from "./components/TopN";

export default function Analytics() {
  const classes = styles();

  const handleChangeTopN = (event) => {
    setTopn(event.target.value);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  function fetchMessages() {
    fetch('http://3.0.49.217:9000/instruments/')
      .then(response => response.json())
      .then(data => {
        const dataArray = JSON.parse(data.data);
        setData(dataArray);
      })
      .catch(error => console.error('Error fetching messages:', error));
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SuiBox py={3}>
        <AggregatedView
          aggregateKey="country" />
        <AggregatedView
          aggregateKey="sector" />
        <AggregatedView
          aggregateKey="instrumentName" />

        {/* <SuiBox mb={3}>
          <Card>
            <SuiBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SuiTypography variant="h5" fontWeight="bold" >
                Monthly Overview
              </SuiTypography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DesktopDatePicker']}>
                  <DemoItem label="Start Date" sx={{ mb: "2px" }} >
                    <DesktopDatePicker defaultValue={dayjs()} />
                  </DemoItem>
                  <DemoItem label="End Date">
                    <DesktopDatePicker defaultValue={dayjs()} />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </SuiBox>
            <SuiTypography >
              <BarChart />
            </SuiTypography>
          </Card>
        </SuiBox> */}

        <TopN />
    
      </SuiBox >
    </DashboardLayout >
  );
}
