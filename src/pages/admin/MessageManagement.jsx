import { useFetchData } from "6pp";
import { 
  Avatar, 
  Box, 
  Button, 
  Chip, 
  IconButton,
  Paper, 
  Skeleton, 
  Stack, 
  Typography,
  Tooltip,
  LinearProgress
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import RenderAttachment from "../../components/shared/RenderAttachment";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { fileFormat, transformImage } from "../../lib/features";
import { 
  FilterAlt as FilterAltIcon, 
  Download as DownloadIcon, 
  VisibilityOutlined as VisibilityOutlinedIcon, 
  DeleteOutline as DeleteOutlineIcon, 
  Search as SearchIcon,
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Public as PublicIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";
import { lightGray, matteBlack, violet } from "../../constants/color";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 160,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => {
      const { attachments } = params.row;

      return attachments?.length > 0
        ? attachments.map((i, index) => {
            const url = i.url;
            const file = fileFormat(url);

            return (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="Download Attachment">
                  <IconButton 
                    size="small" 
                    component="a"
                    href={url}
                    download
                    target="_blank"
                    sx={{ 
                      color: violet,
                      mr: 1,
                      '&:hover': {
                        bgcolor: 'rgba(130,87,229,0.1)' 
                      }
                    }}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {RenderAttachment(file, url)}
              </Box>
            );
          })
        : (
          <Chip 
            label="No Attachments" 
            size="small"
            sx={{ 
              bgcolor: "rgba(117,117,117,0.1)",
              color: "#757575",
              fontSize: "0.75rem",
            }}
          />
        );
    },
  },

  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 300,
    renderCell: (params) => (
      <Typography 
        variant="body2" 
        sx={{ 
          color: lightGray,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {params.row.content}
      </Typography>
    ),
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 180,
    renderCell: (params) => (
      <Stack direction={"row"} spacing={1.5} alignItems={"center"}>
        <Avatar 
          alt={params.row.sender.name} 
          src={params.row.sender.avatar} 
          sx={{ border: "2px solid rgba(255,255,255,0.1)" }}
        />
        <Typography variant="body2" sx={{ color: lightGray }}>
          {params.row.sender.name}
        </Typography>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 180,
    renderCell: (params) => (
      <Typography 
        variant="body2" 
        sx={{ 
          color: lightGray,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {params.row.chat}
      </Typography>
    ),
  },
  {
    field: "groupChat",
    headerName: "Type",
    headerClassName: "table-header",
    width: 100,
    renderCell: (params) => {
      const isGroup = params.row.groupChat;
      return (
        <Chip 
          label={isGroup ? "Group" : "Direct"} 
          size="small"
          sx={{ 
            bgcolor: isGroup ? "rgba(76,175,80,0.1)" : "rgba(33,150,243,0.1)",
            color: isGroup ? "#4caf50" : "#2196f3",
            fontSize: "0.75rem",
            minWidth: 70,
            justifyContent: 'center',
          }}
        />
      );
    }
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 180,
    renderCell: (params) => (
      <Typography variant="body2" sx={{ color: lightGray }}>
        {params.row.createdAt}
      </Typography>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    headerClassName: "table-header",
    width: 120,
    renderCell: () => (
      <Stack direction="row" spacing={1}>
        <Tooltip title="View Details">
          <IconButton 
            size="small" 
            sx={{ 
              color: violet,
              '&:hover': {
                bgcolor: 'rgba(130,87,229,0.1)' 
              }
            }}
          >
            <VisibilityOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Message">
          <IconButton 
            size="small" 
            sx={{ 
              color: '#f44336',
              '&:hover': {
                bgcolor: 'rgba(244,67,54,0.1)' 
              }
            }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    )
  }
];

const MessageManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/messages`,
    "dashboard-messages"
  );

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    withAttachments: 0,
    directMessages: 0,
    groupMessages: 0
  });
  
  // Dummy data for visualization
  const platforms = [
    { name: "WhatsApp", icon: <WhatsAppIcon sx={{ color: '#4caf50' }} />, percentage: 45, color: '#4caf50' },
    { name: "Facebook", icon: <FacebookIcon sx={{ color: '#2196f3' }} />, percentage: 30, color: '#2196f3' },
    { name: "Twitter", icon: <TwitterIcon sx={{ color: '#1da1f2' }} />, percentage: 15, color: '#1da1f2' },
    { name: "Other", icon: <PublicIcon sx={{ color: '#ff9800' }} />, percentage: 10, color: '#ff9800' },
  ];

  useEffect(() => {
    if (data) {
      const formattedRows = data.messages.map((i) => ({
        ...i,
        id: i._id,
        sender: {
          name: i.sender.name,
          avatar: transformImage(i.sender.avatar, 50),
        },
        createdAt: moment(i.createdAt).format("MMM Do YYYY, h:mm a"),
      }));
      
      setRows(formattedRows);
      
      // Calculate stats
      setStats({
        total: formattedRows.length,
        withAttachments: formattedRows.filter(msg => msg.attachments?.length > 0).length,
        directMessages: formattedRows.filter(msg => !msg.groupChat).length,
        groupMessages: formattedRows.filter(msg => msg.groupChat).length
      });
    }
  }, [data]);

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Box sx={{ p: 3 }}>
          <Paper
            elevation={3}
            sx={{
              padding: "1.5rem",
              borderRadius: "1rem",
              bgcolor: "background.paper",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              border: `1px solid rgba(255,255,255,0.05)`,
              mb: 3,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                width: "200px",
                height: "200px",
                background: `radial-gradient(circle, ${violet}11 0%, transparent 70%)`,
                top: "-100px",
                right: "20%",
                borderRadius: "50%",
                zIndex: 0,
              },
            }}
          >
            <Stack 
              direction="row" 
              justifyContent="space-between" 
              alignItems="center"
              sx={{ position: "relative", zIndex: 1 }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: violet, mb: 0.5 }}>
                  Message Management
                </Typography>
                <Typography variant="body2" sx={{ color: lightGray, opacity: 0.7 }}>
                  Manage and monitor all messages across your platform
                </Typography>
              </Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="outlined"
                  startIcon={<FilterAltIcon />}
                  sx={{
                    borderColor: violet,
                    color: violet,
                    borderRadius: "8px",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: violet,
                      bgcolor: "rgba(130,87,229,0.05)",
                    },
                  }}
                >
                  Filter Messages
                </Button>
                <IconButton
                  sx={{
                    color: lightGray,
                    bgcolor: "rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    padding: "8px",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Paper>
          
          {/* Stats Cards */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box sx={{ flex: 3 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} height="100%">
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: "1rem",
                    bgcolor: "background.paper",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    border: `1px solid rgba(255,255,255,0.05)`,
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      width: "140px",
                      height: "140px",
                      background: `radial-gradient(circle, ${violet}11 0%, transparent 70%)`,
                      top: "-70px",
                      right: "-70px",
                      borderRadius: "50%",
                      zIndex: 0,
                    },
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      bgcolor: "rgba(130,87,229,0.1)", 
                      borderRadius: "12px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mr: 2
                    }}
                  >
                    <QuestionAnswerIcon sx={{ fontSize: 28, color: violet }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ color: lightGray, fontWeight: 'bold', position: "relative", zIndex: 1 }}>
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" sx={{ color: lightGray, opacity: 0.7, position: "relative", zIndex: 1 }}>
                      Total Messages
                    </Typography>
                  </Box>
                </Paper>
                
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: "1rem",
                    bgcolor: "background.paper",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    border: `1px solid rgba(255,255,255,0.05)`,
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      width: "140px",
                      height: "140px",
                      background: `radial-gradient(circle, #ff980011 0%, transparent 70%)`,
                      top: "-70px",
                      right: "-70px",
                      borderRadius: "50%",
                      zIndex: 0,
                    },
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      bgcolor: "rgba(255,152,0,0.1)", 
                      borderRadius: "12px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mr: 2
                    }}
                  >
                    <DownloadIcon sx={{ fontSize: 28, color: "#ff9800" }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ color: lightGray, fontWeight: 'bold', position: "relative", zIndex: 1 }}>
                      {stats.withAttachments}
                    </Typography>
                    <Typography variant="body2" sx={{ color: lightGray, opacity: 0.7, position: "relative", zIndex: 1 }}>
                      With Attachments
                    </Typography>
                  </Box>
                </Paper>
              </Stack>
            </Box>
            <Box sx={{ flex: 2 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: "1rem",
                  bgcolor: "background.paper",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  border: `1px solid rgba(255,255,255,0.05)`,
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    width: "200px",
                    height: "200px",
                    background: `radial-gradient(circle, ${violet}05 0%, transparent 70%)`,
                    bottom: "-100px",
                    left: "-100px",
                    borderRadius: "50%",
                    zIndex: 0,
                  },
                }}
              >
                <Typography variant="subtitle2" sx={{ color: lightGray, mb: 2, position: "relative", zIndex: 1 }}>
                  Messages by Platform
                </Typography>
                <Stack spacing={1.5} sx={{ position: "relative", zIndex: 1 }}>
                  {platforms.map((platform, index) => (
                    <Box key={index}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {platform.icon}
                          <Typography variant="body2" sx={{ color: lightGray }}>
                            {platform.name}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: platform.color }}>
                          {platform.percentage}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={platform.percentage}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'rgba(255,255,255,0.05)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: platform.color,
                            borderRadius: 3,
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Box>
          </Stack>
          
          <Paper
            elevation={3}
            sx={{
              borderRadius: "1rem",
              overflow: "hidden",
              bgcolor: "background.paper",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              border: `1px solid rgba(255,255,255,0.05)`,
              "& .MuiDataGrid-root": {
                border: "none",
                "& .table-header": {
                  bgcolor: "rgba(255,255,255,0.05)",
                },
              },
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                width: "300px",
                height: "300px",
                background: `radial-gradient(circle, ${violet}05 0%, transparent 70%)`,
                bottom: "-150px",
                right: "-150px",
                borderRadius: "50%",
                zIndex: 0,
              },
            }}
          >
            {/* Search bar */}
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Stack 
                  direction="row" 
                  alignItems="center" 
                  spacing={1}
                  sx={{ 
                    flex: 1,
                    bgcolor: 'rgba(255,255,255,0.03)',
                    borderRadius: '8px',
                    p: '6px 12px',
                  }}
                >
                  <SearchIcon sx={{ color: lightGray, opacity: 0.7, fontSize: 20 }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: lightGray, 
                      opacity: 0.7,
                    }}
                  >
                    Search messages by content, sender, or type...
                  </Typography>
                </Stack>
                <Chip 
                  label={`${stats.total} messages`} 
                  size="small"
                  sx={{ 
                    bgcolor: "rgba(130,87,229,0.1)",
                    color: violet,
                    fontWeight: "medium",
                  }}
                />
              </Stack>
            </Box>
            
            <Box sx={{ p: "0 0.5rem 1rem 0.5rem" }}>
              <Table 
                heading={"All Messages"} 
                columns={columns} 
                rows={rows} 
                rowHeight={100}
                showHeading={false}
              />
            </Box>
          </Paper>
        </Box>
      )}
    </AdminLayout>
  );
};

export default MessageManagement;
