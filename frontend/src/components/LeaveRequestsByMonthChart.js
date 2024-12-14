import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { getAllLeaves } from "../api/requestApi";
import { Box, Typography, CircularProgress } from "@mui/material";

Chart.register(CategoryScale, LineElement, LinearScale, PointElement, Tooltip);

const LeaveRequestsByMonthChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const leaves = await getAllLeaves();
        if (Array.isArray(leaves) && leaves.length > 0) {
          const months = Array(12).fill(0); // Initialize an array with 12 months

          leaves.forEach((leave) => {
            const start = new Date(leave.zacetek);
            const monthIndex = start.getMonth(); // 0 = January, 11 = December
            months[monthIndex] += 1;
          });

          setChartData({
            labels: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            datasets: [
              {
                label: "Leave Requests by Month",
                data: months,
                backgroundColor: "rgba(75, 192, 192, 0.4)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                fill: true,
              },
            ],
          });
        } else {
          setError("No data available for leave requests by month.");
        }
      } catch (error) {
        console.error("Error fetching leave data:", error);
        setError("Failed to fetch data.");
      }
    };

    fetchLeaveData();
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
        Leave Requests by Month
      </Typography>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : chartData ? (
        <Box sx={{ height: "400px" }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Requests",
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

export default LeaveRequestsByMonthChart;