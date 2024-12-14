import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";

const Footer = () => {
  return (
    <AppBar
      className="footer"
      position="static"
      color="primary"
      sx={{ padding: "20px 0", marginTop: "75px", backgroundColor: "#3366cc" }}
      role="contentinfo"
    >
      <Container maxWidth="md">
        <Toolbar sx={{ justifyContent: "center" }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ textTransform: "none", fontSize: "16px", mx: 2 }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/request"
            sx={{ textTransform: "none", fontSize: "16px", mx: 2 }}
          >
            Request
          </Button>
        </Toolbar>
        <Typography
          variant="body2"
          color="inherit"
          align="center"
          sx={{ marginTop: "10px", fontSize: "14px" }}
        >
          © 2024 Leave Management. All rights reserved.
        </Typography>
      </Container>
    </AppBar>
  );
};

export default Footer;
