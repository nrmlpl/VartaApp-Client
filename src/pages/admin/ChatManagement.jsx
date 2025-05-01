import { useFetchData } from "6pp";
import { 
  Avatar, 
  Box, 
  Button, 
  Chip, 
  Paper, 
  Skeleton, 
  Stack, 
  Typography 
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import AvatarCard from "../../components/shared/AvatarCard";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";
import { FilterAlt as FilterAltIcon, Add as AddIcon } from "@mui/icons-material";
import { lightGray, matteBlack, violet } from "../../constants/color";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <AvatarCard avatar={params.row.avatar} />
      </Box>
    ),
  },

  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Typography sx={{ color: lightGray, fontWeight: 'medium' }}>
        {params.row.name}
      </Typography>
    ),
  },

  {
    field: "groupChat",
    headerName: "Type",
    headerClassName: "table-header",
    width: 120,
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
    field: "totalMembers",
    headerName: "Members",
    headerClassName: "table-header",
    width: 120,
    renderCell: (params) => (
      <Chip 
        label={params.row.totalMembers} 
        size="small"
        sx={{ 
          bgcolor: "rgba(130,87,229,0.1)",
          color: violet,
          fontSize: "0.75rem",
        }}
      />
    ),
  },
  {
    field: "members",
    headerName: "Participants",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
        <AvatarCard max={5} avatar={params.row.members} />
      </Box>
    ),
  },
  {
    field: "totalMessages",
    headerName: "Messages",
    headerClassName: "table-header",
    width: 120,
    renderCell: (params) => (
      <Chip 
        label={params.row.totalMessages} 
        size="small"
        sx={{ 
          bgcolor: "rgba(255,152,0,0.1)",
          color: "#ff9800",
          fontSize: "0.75rem",
          fontWeight: "medium",
        }}
      />
    ),
  },
  {
    field: "creator",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 220,
    renderCell: (params) => (
      <Stack direction="row" alignItems="center" spacing={"1rem"}>
        <Avatar 
          alt={params.row.creator.name} 
          src={params.row.creator.avatar}
          sx={{ border: "2px solid rgba(255,255,255,0.1)" }} 
        />
        <Typography variant="body2" sx={{ color: lightGray }}>
          {params.row.creator.name}
        </Typography>
      </Stack>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    headerClassName: "table-header",
    width: 180,
    renderCell: () => (
      <Stack direction="row" spacing={1}>
        <Button 
          variant="outlined" 
          size="small"
          sx={{ 
            borderColor: violet,
            color: violet,
            fontSize: "0.7rem",
            minWidth: "60px",
            height: "28px",
            borderRadius: "4px",
            textTransform: "none",
            "&:hover": {
              borderColor: violet,
              backgroundColor: "rgba(130,87,229,0.05)",
            }
          }}
        >
          View
        </Button>
        <Button 
          variant="outlined" 
          size="small"
          sx={{ 
            borderColor: "#f44336",
            color: "#f44336",
            fontSize: "0.7rem",
            minWidth: "60px",
            height: "28px",
            borderRadius: "4px",
            textTransform: "none",
            "&:hover": {
              borderColor: "#f44336",
              backgroundColor: "rgba(244,67,54,0.05)",
            }
          }}
        >
          Archive
        </Button>
      </Stack>
    )
  }
];

const ChatManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/chats`,
    "dashboard-chats"
  );

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data) {
      setRows(
        data.chats.map((i) => ({
          ...i,
          id: i._id,
          avatar: i.avatar.map((i) => transformImage(i, 50)),
          members: i.members.map((i) => transformImage(i.avatar, 50)),
          creator: {
            name: i.creator.name,
            avatar: transformImage(i.creator.avatar, 50),
          },
        }))
      );
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
            }}
          >
            <Stack 
              direction="row" 
              justifyContent="space-between" 
              alignItems="center"
            >
              <Typography variant="h5" sx={{ fontWeight: "bold", color: violet }}>
                Chat Management
              </Typography>
              <Stack direction="row" spacing={2}>
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
                  Filter Chats
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    bgcolor: violet,
                    borderRadius: "8px",
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: `${violet}dd`,
                      boxShadow: "0 4px 10px rgba(130,87,229,0.2)",
                    },
                  }}
                >
                  New Chat
                </Button>
              </Stack>
            </Stack>
          </Paper>
          
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
            }}
          >
            <Box sx={{ p: "0 0.5rem 1rem 0.5rem" }}>
              <Table 
                heading={"All Chats"} 
                columns={columns} 
                rows={rows}
                showHeading={false}
                rowHeight={65}
              />
            </Box>
          </Paper>
        </Box>
      )}
    </AdminLayout>
  );
};

export default ChatManagement;