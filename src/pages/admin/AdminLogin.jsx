import { useInputValidation } from "6pp";
import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Avatar,
  InputAdornment,
  IconButton,
  Fade,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { lightGray, mahony, matteBlack, violet } from "../../constants/color";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";
import dashboardBg from "../../assets/images/dashboardBG.jpg";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";

const AdminLogin = () => {
  const { isAdmin } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const secretKey = useInputValidation("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretKey.value));
  };

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (isAdmin) return <Navigate to="/admin/dashboard" />;

  return (
    <Box
      sx={{
        background: `url(${dashboardBg}) no-repeat center / cover`,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <Fade in={true} timeout={800}>
          <Paper
            elevation={24}
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "rgba(25, 25, 25, 0.9)",
              borderRadius: "1rem",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: violet,
                  mb: 2,
                  boxShadow: "0 4px 12px rgba(130, 87, 229, 0.3)",
                }}
              >
                <LockOutlined fontSize="large" />
              </Avatar>
              <Typography
                variant="h4"
                color={violet}
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.8rem",
                  letterSpacing: "0.5px",
                }}
              >
                VartApp
              </Typography>
              <Typography
                variant="subtitle1"
                color={lightGray}
                sx={{
                  opacity: 0.8,
                  mt: 0.5,
                  fontSize: "1rem",
                }}
              >
                Admin Portal
              </Typography>
            </Box>

            <form
              style={{
                width: "100%",
              }}
              onSubmit={submitHandler}
            >
              <TextField
                required
                fullWidth
                placeholder="Enter admin password"
                label="Password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                variant="outlined"
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.75rem",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: `${violet}80`,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: violet,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: lightGray,
                    "&.Mui-focused": {
                      color: violet,
                    },
                  },
                  "& input": {
                    color: lightGray,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: lightGray }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={secretKey.value}
                onChange={secretKey.changeHandler}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  py: 1.5,
                  mt: 1,
                  bgcolor: violet,
                  borderRadius: "0.75rem",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(130, 87, 229, 0.3)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: `${violet}e0`,
                    boxShadow: "0 6px 16px rgba(130, 87, 229, 0.4)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Login to Dashboard
              </Button>
              
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ 
                    color: lightGray, 
                    opacity: 0.7,
                    p: 1,
                    border: "1px dashed rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <b>Hint:</b> Use "kaliyug" as the password
                </Typography>
              </Box>
            </form>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default AdminLogin;
