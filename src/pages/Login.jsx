import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  Box,
  InputAdornment,
  Divider,
  Fade,
} from "@mui/material";
import {
  LockOutlined,
  PersonOutline,
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
} from "@mui/icons-material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VisuallyHiddenInput } from "../components/styles/styledComponents";
import { mahony, mostlyBlack, jetBlack, violet } from "../constants/color";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";

import appBg from "../assets/images/appBG.jpg";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const toggleLogin = () => setIsLogin((prev) => !prev);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");

  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("logging in...");

    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );

      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");

    setIsLoading(true);

    const formData = new FormData();

    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );

      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToAdminPanel = () => {
    navigate("/admin");
  };

  return (
    <Box
      sx={{
        background: `url(${appBg}) no-repeat center / cover`,
        minHeight: "100vh",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <Button
        startIcon={<AdminPanelSettings />}
        onClick={goToAdminPanel}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          bgcolor: `${mahony}60`,
          color: "white",
          "&:hover": {
            bgcolor: `${mahony}d0`,
          },
        }}
      >
        Admin Dashboard
      </Button>
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          py: 3,
        }}
      >
        <Fade in={true} timeout={800}>
          <Paper
            elevation={24}
            sx={{
              padding: isLogin ? 4 : 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 3,
              backgroundColor: "rgba(20, 20, 25, 0.85)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              maxHeight: "90vh",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#444",
                borderRadius: "5px",
              },
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {isLogin ? (
              <>
                <Box
                  sx={{
                    mb: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      mb: 2,
                      width: 60,
                      height: 60,
                      backgroundColor: mahony,
                      boxShadow: "0 4px 12px rgba(229, 139, 87, 0.3)",
                    }}
                  >
                    <LockOutlined />
                  </Avatar>
                  <Typography
                    variant="h4"
                    color={mahony}
                    fontWeight="bold"
                    gutterBottom
                  >
                    VartApp
                  </Typography>
                  <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                    Log in to your account
                  </Typography>
                </Box>
                <form
                  style={{
                    width: "100%",
                  }}
                  onSubmit={handleLogin}
                >
                  <TextField
                    required
                    fullWidth
                    label="Username"
                    margin="normal"
                    variant="outlined"
                    value={username.value}
                    onChange={username.changeHandler}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutline
                            sx={{ color: "rgba(255,255,255,0.7)" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderRadius: 2,
                        "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                        "&:hover fieldset": { borderColor: mahony },
                        "&.Mui-focused fieldset": { borderColor: mahony },
                      },
                      "& .MuiFormLabel-root": {
                        color: "rgba(255,255,255,0.7)",
                        "&.Mui-focused": { color: mahony },
                      },
                    }}
                  />

                  <TextField
                    required
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    margin="normal"
                    variant="outlined"
                    value={password.value}
                    onChange={password.changeHandler}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined
                            sx={{ color: "rgba(255,255,255,0.7)" }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{ color: "rgba(255,255,255,0.7)" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderRadius: 2,
                        "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                        "&:hover fieldset": { borderColor: mahony },
                        "&.Mui-focused fieldset": { borderColor: mahony },
                      },
                      "& .MuiFormLabel-root": {
                        color: "rgba(255,255,255,0.7)",
                        "&.Mui-focused": { color: mahony },
                      },
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      mt: 1,
                      mb: 3,
                      bgcolor: mahony,
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(229, 130, 87, 0.3)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: `${mahony}e0`,
                        boxShadow: "0 6px 16px rgba(229, 130, 87, 0.3)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Login
                  </Button>

                  <Divider
                    sx={{
                      my: 2,
                      color: "rgba(255,255,255,0.5)",
                      "&::before, &::after": {
                        borderColor: "rgba(229, 130, 87, 0.3)",
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="white"
                      sx={{ opacity: 0.7, px: 1 }}
                    >
                      OR
                    </Typography>
                  </Divider>

                  <Stack spacing={2}>
                    <Button
                      disabled={isLoading}
                      fullWidth
                      variant="outlined"
                      onClick={toggleLogin}
                      sx={{
                        borderColor: "rgba(255,255,255,0.3)",
                        color: "white",
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(229, 130, 87, 0.3)",
                        },
                      }}
                    >
                      Create New Account
                    </Button>
                  </Stack>
                </form>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    color={mahony}
                    fontWeight="bold"
                    gutterBottom
                  >
                    VartApp
                  </Typography>
                  <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                    Create your account
                  </Typography>
                </Box>
                <form
                  style={{
                    width: "100%",
                  }}
                  onSubmit={handleSignUp}
                >
                  <Stack
                    position={"relative"}
                    width={"6rem"}
                    margin={"auto"}
                    mb={2}
                  >
                    <Avatar
                      sx={{
                        width: "6rem",
                        height: "6rem",
                        objectFit: "contain",
                        border: avatar.preview
                          ? "3px solid rgba(130, 87, 229, 0.5)"
                          : "3px dashed rgba(229, 130, 87, 0.3)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                      }}
                      src={avatar.preview}
                    />

                    <IconButton
                      sx={{
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                        color: "white",
                        bgcolor: mahony,
                        "&:hover": {
                          bgcolor: `${mahony}d0`,
                        },
                        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                      }}
                      component="label"
                    >
                      <>
                        <CameraAltIcon />
                        <VisuallyHiddenInput
                          type="file"
                          onChange={avatar.changeHandler}
                        />
                      </>
                    </IconButton>
                  </Stack>

                  {avatar.error && (
                    <Typography
                      m={"0.5rem auto 1rem"}
                      width={"fit-content"}
                      display={"block"}
                      color="error"
                      variant="caption"
                    >
                      {avatar.error}
                    </Typography>
                  )}

                  <TextField
                    required
                    fullWidth
                    label="Name"
                    margin="normal"
                    variant="outlined"
                    value={name.value}
                    onChange={name.changeHandler}
                    sx={{
                      mb: 1.5,
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderRadius: 2,
                        "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                        "&:hover fieldset": { borderColor: mahony },
                        "&.Mui-focused fieldset": { borderColor: mahony },
                      },
                      "& .MuiFormLabel-root": {
                        color: "rgba(255,255,255,0.7)",
                        "&.Mui-focused": { color: mahony },
                      },
                    }}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Bio"
                    margin="normal"
                    variant="outlined"
                    value={bio.value}
                    onChange={bio.changeHandler}
                    sx={{
                      mb: 1.5,
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderRadius: 2,
                        "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                        "&:hover fieldset": { borderColor: mahony },
                        "&.Mui-focused fieldset": { borderColor: mahony },
                      },
                      "& .MuiFormLabel-root": {
                        color: "rgba(255,255,255,0.7)",
                        "&.Mui-focused": { color: mahony },
                      },
                    }}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Username"
                    margin="normal"
                    variant="outlined"
                    value={username.value}
                    onChange={username.changeHandler}
                    sx={{
                      mb: username.error ? 0.5 : 1.5,
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderRadius: 2,
                        "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                        "&:hover fieldset": { borderColor: mahony },
                        "&.Mui-focused fieldset": { borderColor: mahony },
                      },
                      "& .MuiFormLabel-root": {
                        color: "rgba(255,255,255,0.7)",
                        "&.Mui-focused": { color: mahony },
                      },
                    }}
                  />

                  {username.error && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ mb: 0.5, display: "block" }}
                    >
                      {username.error}
                    </Typography>
                  )}

                  <TextField
                    required
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    margin="normal"
                    variant="outlined"
                    value={password.value}
                    onChange={password.changeHandler}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{ color: "rgba(255,255,255,0.7)" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderRadius: 2,
                        "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                        "&:hover fieldset": { borderColor: mahony },
                        "&.Mui-focused fieldset": { borderColor: mahony },
                      },
                      "& .MuiFormLabel-root": {
                        color: "rgba(255,255,255,0.7)",
                        "&.Mui-focused": { color: mahony },
                      },
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      mt: 1,
                      mb: 2,
                      bgcolor: mahony,
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(229, 130, 87, 0.2)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: `${mahony}e0`,
                        boxShadow: "0 6px 16px rgba(229, 130, 87, 0.3)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                  <Divider
                    sx={{
                      my: 1.5,
                      color: "rgba(255,255,255,0.5)",
                      "&::before, &::after": {
                        borderColor: "rgba(229, 130, 87, 0.1)",
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="white"
                      sx={{ opacity: 0.7, px: 1 }}
                    >
                      OR
                    </Typography>
                  </Divider>
                  <Stack spacing={2}>
                    <Button
                      disabled={isLoading}
                      fullWidth
                      variant="outlined"
                      onClick={toggleLogin}
                      sx={{
                        mt: 0.5,
                        borderColor: "rgba(255,255,255,0.3)",
                        color: "white",
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.05)",
                        },
                      }}
                    >
                      Already have an account? Login
                    </Button>
                  </Stack>
                </form>
              </>
            )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
