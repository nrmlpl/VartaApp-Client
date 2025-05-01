import { Box, Typography, Paper, Stack, Avatar } from "@mui/material";
import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { jetBlack, mahony, mostlyBlack, violet } from "../constants/color";
import { Chat as ChatIcon } from "@mui/icons-material";

function Home() {
  return (
    <Box 
      bgcolor={jetBlack} 
      height={"100%"} 
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        elevation={0}
        sx={{
          bgcolor: "transparent",
          textAlign: "center",
          p: 4,
          borderRadius: 3,
          maxWidth: "80%",
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "rgba(229, 146, 87, 0.15)",
              width: 80,
              height: 80,
              mb: 2
            }}
          >
            <ChatIcon sx={{ fontSize: 40, color: mahony }} />
          </Avatar>
          
          <Typography variant="h4" fontWeight="bold" color={mahony}>
            Welcome to VartApp
          </Typography>
          
          <Typography variant="body1" color="rgba(255,255,255,0.7)" sx={{ maxWidth: "500px" }}>
            Select a conversation from the sidebar to start chatting with your friends and groups.
          </Typography>
          
          <Box
            sx={{
              mt: 4,
              p: 2,
              borderRadius: 2,
              bgcolor: "rgba(221, 146, 54, 0.2)",
              border: "1px dashed rgba(219, 92, 13, 0.2)",
              width: "fit-content"
            }}
          >
            <Typography variant="body2" color="rgba(255,255,255,0.5)">
              You can also create a new group or start a new chat using the options in the header
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

export default AppLayout()(Home);
