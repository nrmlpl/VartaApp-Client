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
  Tooltip
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import RenderAttachment from "../../components/shared/RenderAttachment";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { fileFormat, transformImage } from "../../lib/features";
import { FilterAlt as FilterAltIcon, Download as DownloadIcon, VisibilityOutlined as VisibilityOutlinedIcon, DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";
import { lightGray, violet } from "../../constants/color";

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

  useEffect(() => {
    if (data) {
      setRows(
        data.messages.map((i) => ({
          ...i,
          id: i._id,
          sender: {
            name: i.sender.name,
            avatar: transformImage(i.sender.avatar, 50),
          },
          createdAt: moment(i.createdAt).format("MMM Do YYYY, h:mm a"),
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
                Message Management
              </Typography>
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
