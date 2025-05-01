import {
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Chat as ChatIcon,
  MoreVert as MoreVertIcon
} from "@mui/icons-material";
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  Avatar,
  Stack,
  Button,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import React, { Suspense, lazy, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mahony, violet, lightGray } from "../../constants/color";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import toast from "react-hot-toast";
import { server } from "../../constants/config";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";
import { transformImage } from "../../lib/features";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotificationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroups"));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSearch, isNotification, isNewGroup } = useSelector((state) => state.misc);
  const { notificationCount } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);
  const isMenuOpen = Boolean(moreMenuAnchor);

  const handleMobile = () => dispatch(setIsMobile(true));
  const openSearch = () => dispatch(setIsSearch(true));
  const openNewGroup = () => dispatch(setIsNewGroup(true));
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };
  const navigateToGroup = () => navigate("/groups");

  const openMoreMenu = (event) => setMoreMenuAnchor(event.currentTarget);
  const closeMoreMenu = () => setMoreMenuAnchor(null);

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });

      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.respose?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "rgba(25, 25, 30, 0.95)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, sm: 2 } }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                sx={{
                  bgcolor: "rgba(229, 127, 87, 0.15)",
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                  display: { xs: "none", sm: "flex" }
                }}
              >
                <ChatIcon sx={{ color: mahony, fontSize: "1.25rem" }} />
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  display: { xs: "none", sm: "block" },
                  fontWeight: "bold",
                  background: `linear-gradient(90deg, ${mahony},rgb(243, 131, 33))`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                VartApp
              </Typography>
              <Box
                sx={{
                  display: { xs: "block", sm: "none" },
                }}
              >
                <IconButton 
                  onClick={handleMobile}
                  sx={{ 
                    color: mahony,
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Stack>

            {/* Desktop and Medium Screen Layout */}
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={{ xs: 0.5, sm: 1 }}
              sx={{
                "& .action-button": {
                  color: mahony,
                  bgcolor: "rgba(255,255,255,0.03)",
                  borderRadius: "8px",
                  p: { xs: "6px", sm: "8px" },
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "rgba(130,87,229,0.1)",
                    color: lightGray,
                  }
                }
              }}
            >
              {/* Always visible buttons */}
              <Tooltip title="Search" arrow>
                <IconButton 
                  className="action-button"
                  onClick={openSearch}
                  size="small"
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              {/* Hidden on xs screens */}
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: "rgba(255,255,255,0.05)" }} />
              </Box>
              
              {/* New Group button - hidden on very small screens */}
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Tooltip title="New Group" arrow>
                  <IconButton 
                    className="action-button"
                    onClick={openNewGroup}
                    size="small"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              {/* Manage Groups button - hidden on very small screens */}
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Tooltip title="Manage Groups" arrow>
                  <IconButton 
                    className="action-button"
                    onClick={navigateToGroup}
                    size="small"
                  >
                    <GroupIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              {/* Divider hidden on small screens */}
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: "rgba(255,255,255,0.05)" }} />
              </Box>
              
              {/* Notifications - always visible */}
              <Tooltip title="Notifications" arrow>
                <IconButton 
                  className="action-button"
                  onClick={openNotification}
                  size="small"
                >
                  <Badge 
                    badgeContent={notificationCount} 
                    color="error"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.6rem",
                        height: 16,
                        minWidth: 16,
                      }
                    }}
                  >
                    <NotificationsIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              {/* Logout - hidden on very small screens */}
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Tooltip title="Logout" arrow>
                  <IconButton 
                    className="action-button"
                    onClick={logoutHandler}
                    size="small"
                  >
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              {/* More menu for smaller screens */}
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <Tooltip title="More options" arrow>
                  <IconButton 
                    className="action-button"
                    onClick={openMoreMenu}
                    size="small"
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
      
      {/* More Options Menu */}
      <Menu
        anchorEl={moreMenuAnchor}
        open={isMenuOpen}
        onClose={closeMoreMenu}
        PaperProps={{
          sx: {
            bgcolor: "rgba(25, 25, 30, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            mt: 1.5,
            minWidth: 180,
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Only show new group in xs screens since it's hidden there */}
        <MenuItem 
          onClick={() => {
            openNewGroup();
            closeMoreMenu();
          }}
          sx={{ 
            color: "white",
            "&:hover": { bgcolor: "rgba(229, 127, 87, 0.1)" }
          }}
        >
          <ListItemIcon>
            <AddIcon fontSize="small" sx={{ color: mahony }} />
          </ListItemIcon>
          <ListItemText>New Group</ListItemText>
        </MenuItem>
        
        {/* Only show in xs screens since it's hidden there */}
        <MenuItem 
          onClick={() => {
            navigateToGroup();
            closeMoreMenu();
          }}
          sx={{ 
            display: { xs: "flex", sm: "none" },
            color: "white",
            "&:hover": { bgcolor: "rgba(229, 127, 87, 0.1)" }
          }}
        >
          <ListItemIcon>
            <GroupIcon fontSize="small" sx={{ color: mahony }} />
          </ListItemIcon>
          <ListItemText>Manage Groups</ListItemText>
        </MenuItem>
        
        {/* Only show in xs screens since logout is hidden there */}
        <MenuItem 
          onClick={() => {
            logoutHandler();
            closeMoreMenu();
          }}
          sx={{ 
            display: { xs: "flex", sm: "none" },
            color: "white",
            "&:hover": { bgcolor: "rgba(229, 127, 87, 0.1)" }
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: mahony }} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
        
        {/* Show user name in dropdown - good for small screens */}
        {user && (
          <MenuItem 
            sx={{ 
              color: "white",
              "&:hover": { bgcolor: "rgba(229, 127, 87, 0.1)" },
              borderTop: "1px solid rgba(255,255,255,0.1)",
              mt: 1,
              pt: 1
            }}
          >
            <ListItemIcon>
              <Avatar 
                src={transformImage(user?.avatar?.url)} 
                alt={user?.name}
                sx={{ width: 24, height: 24, bgcolor: mahony }}
              />
            </ListItemIcon>
            <ListItemText>{user?.name || "Profile"}</ListItemText>
          </MenuItem>
        )}
      </Menu>
      
      {/* Dialog components */}
      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotificationDialog />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
};

export default Header;
