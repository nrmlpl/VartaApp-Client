import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Groups as GroupsIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpOutlineIcon,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Typography,
  Avatar,
  Tooltip,
  Badge,
  Divider,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
import { matteBlack, mostlyBlack, violet, lightGray } from "../../constants/color";
import { adminLogout } from "../../redux/thunks/admin";

const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 0.75rem;
  padding: 0.75rem 1.25rem;
  width: 100%;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  color: ${lightGray};
  &:hover {
    background-color: rgba(130, 87, 229, 0.1);
    color: ${violet};
  }
`;

export const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupsIcon />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageIcon />,
  },
];

const Sidebar = ({ w = "100%" }) => {
  const location = useLocation();

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(adminLogout());
  };

  return (
    <Stack 
      width={w} 
      direction="column" 
      sx={{ 
        height: "100%",
        p: 3,
        position: "relative",
      }}
    >
      <Stack spacing={4}>
        {/* Logo */}
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Avatar
            sx={{ 
              width: 42, 
              height: 42, 
              bgcolor: violet,
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            V
          </Avatar>
          <Typography
            variant="h5"
            color={violet}
            sx={{ fontWeight: "bold", fontFamily: "Arial, sans-serif" }}
          >
            VartApp
          </Typography>
        </Stack>

        {/* Admin Profile */}
        <Box
          sx={{
            p: 2,
            borderRadius: "1rem",
            bgcolor: "rgba(130, 87, 229, 0.1)",
            mb: 2,
            border: "1px solid rgba(130, 87, 229, 0.2)",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src="https://i.pravatar.cc/150?img=12"
              sx={{ width: 48, height: 48 }}
            />
            <Box>
              <Typography color={lightGray} fontWeight="bold">
                Admin User
              </Typography>
              <Typography variant="body2" color={lightGray} sx={{ opacity: 0.7 }}>
                System Administrator
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Navigation */}
        <Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: lightGray, 
              opacity: 0.6, 
              fontWeight: "medium", 
              pl: 1.5, 
              mb: 1 
            }}
          >
            MAIN NAVIGATION
          </Typography>
          <Stack>
            {adminTabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                sx={
                  location.pathname === tab.path
                    ? {
                        bgcolor: violet,
                        color: "white",
                        boxShadow: "0 4px 10px rgba(130, 87, 229, 0.3)",
                        "&:hover": {
                          bgcolor: violet,
                          color: "white",
                        },
                      }
                    : {}
                }
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  {tab.path === "/admin/messages" ? (
                    <Badge color="error" badgeContent={4} sx={{ "& .MuiBadge-badge": { top: 5, right: 5 } }}>
                      {tab.icon}
                    </Badge>
                  ) : (
                    tab.icon
                  )}
                  <Typography fontWeight="medium">{tab.name}</Typography>
                </Stack>
              </Link>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

        {/* Settings Section */}
        <Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: lightGray, 
              opacity: 0.6, 
              fontWeight: "medium", 
              pl: 1.5, 
              mb: 1 
            }}
          >
            SETTINGS
          </Typography>
          <Stack>
            <Link to="#settings">
              <Stack direction="row" alignItems="center" spacing={2}>
                <SettingsIcon />
                <Typography fontWeight="medium">Settings</Typography>
              </Stack>
            </Link>
            <Link to="#help">
              <Stack direction="row" alignItems="center" spacing={2}>
                <HelpOutlineIcon />
                <Typography fontWeight="medium">Help & Support</Typography>
              </Stack>
            </Link>
            <Link onClick={logoutHandler}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <ExitToAppIcon />
                <Typography fontWeight="medium">Logout</Typography>
              </Stack>
            </Link>
          </Stack>
        </Box>
      </Stack>

      {/* Footer */}
      <Box sx={{ position: "absolute", bottom: "1.5rem", left: 0, width: "100%", px: 3 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: "1rem",
            bgcolor: "rgba(130, 87, 229, 0.05)",
            border: "1px solid rgba(130, 87, 229, 0.1)",
          }}
        >
          <Typography 
            variant="body2" 
            color={lightGray} 
            sx={{ opacity: 0.7, textAlign: "center" }}
          >
            VartApp Admin v1.2.0
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
};

const AdminLayout = ({ children }) => {
  const { isAdmin } = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(false);

  const handleMobile = () => setIsMobile(!isMobile);

  const handleClose = () => setIsMobile(false);

  if (!isAdmin) return <Navigate to="/admin" />;

  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
          zIndex: 1100,
        }}
      >
        <IconButton 
          onClick={handleMobile}
          sx={{ 
            bgcolor: mostlyBlack,
            color: lightGray,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            }
          }}
        >
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Grid
        item
        md={3}
        lg={2.5}
        sx={{
          display: { xs: "none", md: "block" },
          bgcolor: mostlyBlack,
        }}
      >
        <Sidebar />
      </Grid>
      <Grid
        item
        xs={12}
        md={9}
        lg={9.5}
        sx={{
          bgcolor: matteBlack,
          minHeight: "100vh",
        }}
      >
        {children}
      </Grid>
      <Drawer
        open={isMobile}
        onClose={handleClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: "280px",
            bgcolor: mostlyBlack,
            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
          }
        }}
      >
        <Sidebar w={"100%"} />
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;
