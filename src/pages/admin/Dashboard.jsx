import { useFetchData } from "6pp";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Share as ShareIcon,
  CalendarMonth as CalendarMonthIcon,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
  Avatar,
  Divider,
  Badge,
  LinearProgress,
  AvatarGroup,
  Chip,
} from "@mui/material";
import moment from "moment";
import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";
import {
  CurveButton,
  SearchField,
} from "../../components/styles/styledComponents";
import { matteBlack, lightGray, violet } from "../../constants/color";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";

const Dashboard = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/stats`,
    "dashboard-stats"
  );

  const { stats } = data || {
    stats: {
      usersCount: 0,
      totalChatsCount: 0,
      messagesCount: 0,
      groupsCount: 0,
      messagesChart: [0, 0, 0, 0, 0, 0, 0],
    }
  };

  useErrors([
    {
      isError: error,
      error: "error",
    },
  ]);

  // Dummy data for enhanced dashboard
  const dummyTrendingTopics = [
    { topic: "Project Updates", count: 156 },
    { topic: "Weekend Plans", count: 129 },
    { topic: "Tech Support", count: 87 },
    { topic: "Design Feedback", count: 65 },
  ];

  const dummyActiveUsers = [
    { name: "Alex Morgan", avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Jamie Smith", avatar: "https://i.pravatar.cc/150?img=2" },
    { name: "Taylor Doe", avatar: "https://i.pravatar.cc/150?img=3" },
    { name: "Jordan Lee", avatar: "https://i.pravatar.cc/150?img=4" },
    { name: "Casey Kim", avatar: "https://i.pravatar.cc/150?img=5" },
  ];

  const dummyMetrics = [
    { name: "User Engagement", value: 78, color: "#4caf50" },
    { name: "Content Activity", value: 64, color: "#ff9800" },
    { name: "Response Rate", value: 92, color: "#2196f3" },
  ];

  const Appbar = (
    <Paper
      elevation={3}
      sx={{
        padding: "1.5rem 2rem",
        margin: "1.5rem 0",
        borderRadius: "1rem",
        bgcolor: matteBlack,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        border: `1px solid rgba(255,255,255,0.05)`,
      }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <AdminPanelSettingsIcon
          sx={{
              fontSize: "2.5rem",
              color: violet,
              marginRight: "0.5rem",
          }}
        />
          <Typography variant="h5" fontWeight="bold" color={violet}>
            Admin
          </Typography>
        </Box>

        <SearchField placeholder="Search anything..." />

        <CurveButton sx={{ backgroundColor: violet }}>
          <SearchIcon />
        </CurveButton>
        <Box flexGrow={1} />
        <Stack 
          direction="row" 
          spacing={2} 
          alignItems="center"
          sx={{
            display: {
            xs: "none",
              md: "flex"
            }
          }}
        >
          <Typography
            variant="body2"
            textAlign={"center"}
            sx={{ color: lightGray }}
          >
            {moment().format("MMMM Do YYYY")}
        </Typography>
          <Badge color="error" badgeContent={4} sx={{ cursor: 'pointer' }}>
            <NotificationsIcon sx={{ color: lightGray }} />
          </Badge>
        </Stack>
      </Stack>
    </Paper>
  );

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Container component={"main"}>
          {Appbar}
          
          {/* Main Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Total Users"
                value={stats?.usersCount || 0}
                icon={<PersonIcon sx={{ fontSize: 40, color: violet }} />}
                trend="+12%"
                bgGradient="linear-gradient(135deg, rgba(130,87,229,0.15) 0%, rgba(41,26,76,0.05) 100%)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Total Chats"
                value={stats?.totalChatsCount || 0}
                icon={<GroupIcon sx={{ fontSize: 40, color: "#2196f3" }} />}
                trend="+5%"
                bgGradient="linear-gradient(135deg, rgba(33,150,243,0.15) 0%, rgba(13,71,161,0.05) 100%)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Messages"
                value={stats?.messagesCount || 0}
                icon={<MessageIcon sx={{ fontSize: 40, color: "#ff9800" }} />}
                trend="+18%"
                bgGradient="linear-gradient(135deg, rgba(255,152,0,0.15) 0%, rgba(230,81,0,0.05) 100%)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Group Chats"
                value={stats?.groupsCount || 0}
                icon={<SpeedIcon sx={{ fontSize: 40, color: "#4caf50" }} />}
                trend="+7%"
                bgGradient="linear-gradient(135deg, rgba(76,175,80,0.15) 0%, rgba(27,94,32,0.05) 100%)"
              />
            </Grid>
          </Grid>
          
          {/* Charts section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{
                  padding: "1.5rem",
                borderRadius: "1rem",
                bgcolor: matteBlack,
                  height: "100%",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  border: `1px solid rgba(255,255,255,0.05)`,
              }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: lightGray }}>
                    Message Activity
              </Typography>
                  <Chip 
                    label="Last 7 Days" 
                    size="small" 
                    sx={{ 
                      bgcolor: "rgba(130,87,229,0.1)", 
                      color: violet,
                      borderRadius: "8px"
                    }} 
                    icon={<CalendarMonthIcon sx={{ color: `${violet} !important` }} />}
                  />
                </Stack>
                <LineChart value={stats?.messagesChart || [0, 10, 15, 8, 20, 18, 25]} />
            </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
            <Paper
                elevation={3}
              sx={{
                  padding: "1.5rem",
                borderRadius: "1rem",
                  bgcolor: matteBlack,
                  height: "100%",
                display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  border: `1px solid rgba(255,255,255,0.05)`,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", color: lightGray, mb: 2 }}>
                  Chat Distribution
                </Typography>
                <Box sx={{ position: "relative", flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DoughnutChart
                labels={["Single Chats", "Group Chats"]}
                value={[
                  stats?.totalChatsCount - stats?.groupsCount || 0,
                  stats?.groupsCount || 0,
                ]}
              />
              <Stack
                position="absolute"
                    direction="column"
                justifyContent="center"
                alignItems="center"
                spacing="0.5rem"
                width="100%"
                height="100%"
              >
                    <Typography variant="h6" sx={{ color: violet, fontWeight: "bold" }}>
                      {stats?.totalChatsCount || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: lightGray }}>
                      Total Chats
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 12, height: 12, borderRadius: 6, bgcolor: "#8257e5" }} />
                      <Typography variant="body2" sx={{ color: lightGray }}>Single Chats</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: lightGray }}>
                      {stats?.totalChatsCount - stats?.groupsCount || 0}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 12, height: 12, borderRadius: 6, bgcolor: "#4caf50" }} />
                      <Typography variant="body2" sx={{ color: lightGray }}>Group Chats</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: lightGray }}>
                      {stats?.groupsCount || 0}
                    </Typography>
                  </Stack>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Additional Content */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  padding: "1.5rem",
                  borderRadius: "1rem",
                  bgcolor: matteBlack,
                  height: "100%",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  border: `1px solid rgba(255,255,255,0.05)`,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.05,
                    zIndex: 0,
                    background: `linear-gradient(120deg, ${violet}44 0%, transparent 40%),
                                radial-gradient(circle at 90% 10%, ${violet}22 0%, transparent 50%)`,
                    borderRadius: "1rem",
                  },
                  position: "relative",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", color: lightGray, mb: 2 }}>
                  Trending Topics
                </Typography>
                <Stack spacing={2}>
                  {dummyTrendingTopics.map((topic, index) => (
                    <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <TrendingUpIcon sx={{ color: violet, fontSize: 18 }} />
                        <Typography variant="body2" sx={{ color: lightGray }}>{topic.topic}</Typography>
                      </Stack>
                      <Chip 
                        label={topic.count} 
                        size="small" 
                        sx={{ 
                          bgcolor: "rgba(130,87,229,0.1)",
                          color: violet,
                          minWidth: 45,
                          height: 24,
                          fontSize: "0.75rem",
                        }} 
                      />
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  padding: "1.5rem",
                  borderRadius: "1rem",
                  bgcolor: matteBlack,
                  height: "100%",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  border: `1px solid rgba(255,255,255,0.05)`,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.05,
                    zIndex: 0,
                    background: `linear-gradient(120deg, ${violet}44 0%, transparent 40%),
                                radial-gradient(circle at 10% 90%, ${violet}22 0%, transparent 50%)`,
                    borderRadius: "1rem",
                  },
                  position: "relative",
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: lightGray }}>
                    Most Active Users
                  </Typography>
                  <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.8rem' } }}>
                    {dummyActiveUsers.map((user, i) => (
                      <Avatar key={i} src={user.avatar} alt={user.name} />
                    ))}
                  </AvatarGroup>
                </Stack>
                <Stack spacing={2}>
                  {dummyActiveUsers.slice(0, 4).map((user, index) => (
                    <Stack key={index} direction="row" spacing={2} alignItems="center">
                      <Avatar src={user.avatar} alt={user.name} sx={{ width: 36, height: 36 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ color: lightGray, fontWeight: "medium" }}>
                          {user.name}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={95 - index * 15} 
                          sx={{ 
                            mt: 0.5, 
                            height: 4, 
                            borderRadius: 2,
                            bgcolor: 'rgba(255,255,255,0.05)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: index === 0 ? violet : index === 1 ? '#2196f3' : index === 2 ? '#ff9800' : '#4caf50',
                            }
                          }} 
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: lightGray }}>
                        {95 - index * 15}%
                      </Typography>
                    </Stack>
                  ))}
              </Stack>
            </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  padding: "1.5rem",
                  borderRadius: "1rem",
                  bgcolor: matteBlack,
                  height: "100%",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  border: `1px solid rgba(255,255,255,0.05)`,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    width: "140px",
                    height: "140px",
                    background: `radial-gradient(circle, ${violet}11 0%, transparent 70%)`,
                    top: "-20px",
                    right: "-20px",
                    borderRadius: "50%",
                    zIndex: 0,
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "100px",
                    height: "100px",
                    background: `radial-gradient(circle, ${violet}11 0%, transparent 70%)`,
                    bottom: "-20px",
                    left: "-20px",
                    borderRadius: "50%",
                    zIndex: 0,
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", color: lightGray, mb: 2 }}>
                  Platform Metrics
                </Typography>
                <Stack spacing={3}>
                  {dummyMetrics.map((metric, index) => (
                    <Box key={index}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="body2" sx={{ color: lightGray }}>{metric.name}</Typography>
                        <Typography variant="body2" sx={{ color: metric.color, fontWeight: "medium" }}>
                          {metric.value}%
                        </Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={metric.value} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: 'rgba(255,255,255,0.05)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: metric.color,
                            borderRadius: 4,
                          }
                        }} 
                      />
                    </Box>
                  ))}
                  
                  <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                  
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ShareIcon sx={{ color: violet, fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: lightGray }}>Platform Health</Typography>
                    </Stack>
                    <Chip 
                      label="Excellent" 
                      size="small" 
                      sx={{ 
                        bgcolor: "rgba(76,175,80,0.1)",
                        color: "#4caf50",
                        height: 24,
                        fontSize: "0.75rem",
                      }} 
                    />
                  </Stack>
          </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      )}
    </AdminLayout>
  );
};

// Enhanced stat card component
const StatCard = ({ title, value, icon, trend, bgGradient }) => (
  <Paper
    elevation={3}
    sx={{
      padding: "1.5rem",
      borderRadius: "1rem",
      background: bgGradient || "linear-gradient(135deg, rgba(130,87,229,0.15) 0%, rgba(41,26,76,0.05) 100%)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      border: `1px solid rgba(255,255,255,0.05)`,
      height: "100%",
      overflow: "hidden",
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        width: "140px",
        height: "140px",
        background: `radial-gradient(circle, ${violet}11 0%, transparent 70%)`,
        top: "-20px",
        right: "-20px",
        borderRadius: "50%",
        zIndex: 0,
      },
      "&::after": {
        content: '""',
        position: "absolute",
        width: "100px",
        height: "100px",
        background: `radial-gradient(circle, ${violet}11 0%, transparent 70%)`,
        bottom: "-20px",
        left: "-20px",
        borderRadius: "50%",
        zIndex: 0,
      },
    }}
  >
    <Stack spacing={1}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        {icon}
        <Chip 
          label={trend} 
          size="small" 
        sx={{
            bgcolor: "rgba(76,175,80,0.1)", 
            color: "#4caf50", 
            height: 24,
            fontSize: "0.75rem",
          }} 
        />
      </Box>
      <Typography variant="h3" sx={{ fontWeight: "bold", color: lightGray, my: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
        {title}
      </Typography>
    </Stack>
  </Paper>
);

export default Dashboard;
