import { Box, Typography } from "@mui/material";
import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { jetBlack } from "../constants/color";

function Home() {
  return (
    <Box bgcolor={jetBlack} height={"100%"}>
      <Typography padding={"2rem"} textAlign={"center"} variant="h5">
        Select a friend and chat
      </Typography>
    </Box>
  );
}

export default AppLayout()(Home);
