import { useFetchData } from "6pp";
import { Avatar, Box, Button, Chip, Paper, Skeleton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";
import { lightGray, violet } from "../../constants/color";
import { FilterAlt as FilterAltIcon } from "@mui/icons-material";

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
    width: 100,
    renderCell: (params) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 120,
    renderCell: (params) => (
      <Chip 
        label={params.row.friends} 
        size="small"
        sx={{ 
          bgcolor: "rgba(33,150,243,0.1)",
          color: "#2196f3",
          fontSize: "0.75rem",
        }}
      />
    ),
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 120,
    renderCell: (params) => (
      <Chip 
        label={params.row.groups} 
        size="small"
        sx={{ 
          bgcolor: "rgba(76,175,80,0.1)",
          color: "#4caf50",
          fontSize: "0.75rem",
        }}
      />
    ),
  },
  {
    field: "status",
    headerName: "Status",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => {
      const status = params.row.id % 3 === 0 ? "Offline" : params.row.id % 2 === 0 ? "Away" : "Online";
      const color = status === "Online" ? "#4caf50" : status === "Away" ? "#ff9800" : "#757575";
      const bgColor = status === "Online" ? "rgba(76,175,80,0.1)" : status === "Away" ? "rgba(255,152,0,0.1)" : "rgba(117,117,117,0.1)";
      
      return (
        <Chip 
          label={status} 
          size="small"
          sx={{ 
            bgcolor: bgColor,
            color: color,
            fontSize: "0.75rem",
          }}
        />
      );
    }
  },
  {
    field: "actions",
    headerName: "Actions",
    headerClassName: "table-header",
    width: 200,
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
          Block
        </Button>
      </Stack>
    )
  }
];

const UserManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/users`,
    "dashboard-users"
  );

  useErrors([
    {
      isError: error,
      error: "error",
    },
  ]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data) {
      setRows(
        data.users.map((i) => ({
          ...i,
          id: i._id,
          avatar: transformImage(i.avatar, 50),
          // Add dummy status field
          status: Math.random() > 0.5 ? "Online" : "Offline",
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
                User Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<FilterAltIcon />}
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
                Filter Users
              </Button>
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
            <Table 
              heading={"All Users"} 
              columns={columns} 
              rows={rows} 
              showHeading={false}
            />
          </Paper>
        </Box>
      )}
    </AdminLayout>
  );
};

export default UserManagement;
