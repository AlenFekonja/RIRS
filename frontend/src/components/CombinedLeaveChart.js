import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, BarElement, LinearScale, Tooltip } from "chart.js";
import { getAllLeaves } from "../api/requestApi";
import { Box, Typography, CircularProgress } from "@mui/material";

Chart.register(CategoryScale, BarElement, LinearScale, Tooltip);

const CombinedLeaveChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const leaves = await getAllLeaves();
        if (Array.isArray(leaves) && leaves.length > 0) {
          const currentDate = new Date();

          // Categorizing the leave data
          const inProgressCount = leaves.filter(
            (leave) =>
              new Date(leave.zacetek) <= currentDate &&
              new Date(leave.konec) > currentDate
          ).length;

          const completedCount = leaves.filter(
            (leave) =>
              new Date(leave.zacetek) < currentDate &&
              new Date(leave.konec) < currentDate
          ).length;

          const notStartedCount = leaves.filter(
            (leave) =>
              new Date(leave.zacetek) > currentDate &&
              new Date(leave.konec) > currentDate
          ).length;

          setChartData({
            labels: ["In Progress", "Completed", "Not Started"],
            datasets: [
              {
                label: "Leave Count",
                data: [inProgressCount, completedCount, notStartedCount],
                backgroundColor: ["#5fa9fd", "#ff9f40", "#4bc0c0"],
                borderColor: ["rgba(135,206,250,1)", "rgba(255,159,64,1)", "rgba(75,192,192,1)"],
                borderWidth: 1,
              },
            ],
          });
        } else {
          setError("No data available for leaves.");
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
        Combined Leave Status Chart
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
                    text: "Count",
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
                      return `Count: ${value}`;
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

export default CombinedLeaveChart;