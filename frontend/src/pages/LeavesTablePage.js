import React, { useEffect, useState } from "react";
import { getAllLeaves } from "../api/requestApi";
import LeavesTable from "../components/LeavesTable";
import DaysOffByEmployeeChart from "../components/DaysOffByEmployeeChart";
import LeaveRequestsByTypeChart from "../components/LeaveRequestsByTypeChart";
import LeaveRequestsByMonthChart from "../components/LeaveRequestsByMonthChart";
import AverageLeaveDurationChart from "../components/AverageLeaveDurationChart";
import CombinedLeaveCharts from "../components/CombinedLeaveChart";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../styles.css'; 

const LeavesTablePage = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllLeaves();
      setLeaves(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Table Data</Tab>
          <Tab>Graphs</Tab>
        </TabList>

        <TabPanel>
          <LeavesTable leaves={leaves} />
        </TabPanel>

        <TabPanel>
          <Tabs>
            <TabList>
              <Tab>Days Off by Employee</Tab>
              <Tab>Leave Requests by Type</Tab>
              <Tab>Leave Requests by Month</Tab>
              <Tab>Average Leave Duration</Tab>
              <Tab>Combined Leave Charts</Tab>
            </TabList>

            <TabPanel>
              <DaysOffByEmployeeChart />
            </TabPanel>
            <TabPanel>
              <LeaveRequestsByTypeChart />
            </TabPanel>
            <TabPanel>
              <LeaveRequestsByMonthChart />
            </TabPanel>
            <TabPanel>
              <AverageLeaveDurationChart />
            </TabPanel>
            <TabPanel>
              <CombinedLeaveCharts />
            </TabPanel>
          </Tabs>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default LeavesTablePage;