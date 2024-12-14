import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  BarElement,
  LinearScale,
  Tooltip,
  Title,
} from "chart.js";
import { getAllLeaves } from "../api/requestApi"; // Updated import
import { Box, Typography, CircularProgress } from "@mui/material";

Chart.register(CategoryScale, BarElement, LinearScale, Tooltip, Title);

const LeaveRequestsByTypeChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const leaves = await getAllLeaves();
        if (Array.isArray(leaves) && leaves.length > 0) {
          // Grouping leave requests by type
          const leaveTypeCounts = {};
          leaves.forEach((leave) => {
            const type = leave.tip_dopusta || "Unknown"; // Assuming `tip_dopusta` is the field for leave type
            if (leaveTypeCounts[type]) {
              leaveTypeCounts[type] += 1;
            } else {
              leaveTypeCounts[type] = 1;
            }
          });

          const leaveTypeLabels = Object.keys(leaveTypeCounts);
          const leaveTypeData = Object.values(leaveTypeCounts);

          setChartData({
            labels: leaveTypeLabels,
            datasets: [
              {
                label: "Leave Requests by Type",
                data: leaveTypeData,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
            ],
          });
        } else {
          setError("No data available for leave requests by type.");
        }
      } catch (error) {
        console.error("Error fetching leave requests by type:", error);
        setError("Failed to fetch data.");
      }
    };

    fetchLeaveTypes();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: "980px",
        margin: "auto",
        padding: "2rem",
        boxShadow: 3,
        borderRadius: 2,
        marginTop: "40px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #e0e0e0",
      }}
    >
      <Typography variant="h5" component="h3" sx={{ marginBottom: "1rem" }}>
        Leave Requests by Type
      </Typography>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : chartData ? (
        <Box sx={{ height: "400px" }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Number of Requests",
                  },
                  ticks: {
                    color: "#333",
                  },
                },
                x: {
                  ticks: {
                    color: "#333",
                  },
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      const value = tooltipItem.raw;
                      return `Requests: ${value}`;
                    },
                  },
                },
              },
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default LeaveRequestsByTypeChart;