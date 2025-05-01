import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
  People as PeopleIcon,
  Info as InfoIcon
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Paper,
  Chip,
  Avatar,
  Divider,
  Fade
} from "@mui/material";
import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LayoutLoader } from "../components/layout/Loaders";
import AvatarCard from "../components/shared/AvatarCard";
import UserItem from "../components/shared/UserItem";
import { Link } from "../components/styles/styledComponents";
import { jetBlack, mahony, mostlyBlack, offWhite, violet, lightGray } from "../constants/color";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { setIsAddMember } from "../redux/reducers/misc";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);
  const myGroups = useMyGroupsQuery("");
  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

  const [members, setMembers] = useState([]);

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupName = () => {
    setIsEdit(false);

    updateGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/Groups");
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
  };

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
            zIndex: 10
          },
        }}
      >
        <IconButton 
          onClick={handleMobile}
          sx={{
            bgcolor: "rgba(255,255,255,0.05)",
            color: mahony,
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.1)",
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      <Tooltip title="Back to chat" arrow placement="right">
        <IconButton
          sx={{
            position: "absolute",
            top: "1.5rem",
            left: "1.5rem",
            bgcolor: "rgba(255,255,255,0.05)",
            color: lightGray,
            zIndex: 5,
            "&:hover": {
              bgcolor: `${mahony}22`,
              color: mahony,
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <Paper 
      elevation={0}
      sx={{ 
        padding: "2rem",
        bgcolor: "rgba(255,255,255,0.02)",
        borderRadius: "1rem",
        border: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden",
        mb: 3,
        "&::before": {
          content: '""',
          position: "absolute",
          width: "200px",
          height: "200px",
          background: `radial-gradient(circle, ${mahony}11 0%, transparent 70%)`,
          top: "-100px",
          right: "5%",
          borderRadius: "50%",
          zIndex: 0,
        },
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        spacing={"1rem"}
        sx={{ position: "relative", zIndex: 1 }}
      >
        {isEdit ? (
          <>
            <TextField
              value={groupNameUpdatedValue}
              onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
              variant="outlined"
              sx={{
                width: "300px",
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: 2,
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&:hover fieldset": { borderColor: mahony },
                  "&.Mui-focused fieldset": { borderColor: mahony }
                },
                "& .MuiFormLabel-root": {
                  color: "rgba(255,255,255,0.7)",
                  "&.Mui-focused": { color: mahony }
                }
              }}
            />
            <Tooltip title="Save" arrow>
              <IconButton
                onClick={updateGroupName}
                disabled={isLoadingGroupName}
                sx={{
                  color: "white",
                  bgcolor: mahony,
                  "&:hover": {
                    bgcolor: `${mahony}cc`,
                  }
                }}
              >
                <DoneIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Typography 
              variant="h4" 
              fontWeight="bold"
              sx={{ 
                color: lightGray, 
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: "30%",
                  height: "3px",
                  background: `linear-gradient(90deg, ${mahony}, transparent)`,
                  left: 0,
                  bottom: "-8px",
                }
              }}
            >
              {groupName}
            </Typography>
            <Tooltip title="Edit group name" arrow>
              <IconButton
                onClick={() => setIsEdit(true)}
                disabled={isLoadingGroupName}
                sx={{
                  color: lightGray,
                  bgcolor: "rgba(255,255,255,0.05)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                    color: mahony,
                  }
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Stack>
    </Paper>
  );

  const ButtonGroup = (
    <Stack
      direction={{
        xs: "column-reverse",
        sm: "row",
      }}
      spacing={"1rem"}
      p={{
        xs: "1rem 0",
        sm: "1rem",
        md: "1rem 0",
      }}
      justifyContent="center"
    >
      <Button
        size="large"
        color="error"
        variant="outlined"
        startIcon={<DeleteIcon />}
        onClick={openConfirmDeleteHandler}
        sx={{
          borderRadius: "0.75rem",
          textTransform: "none",
          px: 3,
          borderColor: "rgba(244,67,54,0.5)",
          "&:hover": {
            borderColor: "#f44336",
            bgcolor: "rgba(244,67,54,0.08)",
          }
        }}
      >
        Delete Group
      </Button>
      <Button
        size="large"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openAddMemberHandler}
        sx={{
          bgcolor: mahony,
          borderRadius: "0.75rem",
          textTransform: "none",
          px: 3,
          boxShadow: "none",
          "&:hover": {
            bgcolor: `${mahony}e0`,
            boxShadow: "0 4px 12px rgba(229, 149, 87, 0.3)",
          }
        }}
      >
        Add Member
      </Button>
    </Stack>
  );

  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <Grid container height={"100vh"}>
      <Grid
        item
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
          borderRight: "1px solid rgba(255,255,255,0.05)",
          bgcolor: "rgba(21, 21, 25, 0.95)",
        }}
        sm={4}
      >
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem",
          bgcolor: jetBlack,
        }}
      >
        {IconBtns}

        {groupName && (
          <>
            {GroupName}

            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={1} 
              alignSelf="flex-start" 
              mb={2}
            >
              <PeopleIcon sx={{ color: mahony, fontSize: 20 }} />
              <Typography
                variant="subtitle1"
                fontWeight={"bold"}
                color={lightGray}
              >
                Members ({members.length})
              </Typography>
            </Stack>
            
            <Paper
              elevation={0}
              sx={{
                maxWidth: "45rem",
                width: "100%",
                borderRadius: "1rem",
                border: "1px solid rgba(255,255,255,0.05)",
                bgcolor: "rgba(255,255,255,0.02)",
                height: "50vh",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  p: {
                    xs: "1rem",
                    md: "1rem 2rem",
                  },
                  height: "100%",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#444",
                    borderRadius: "5px",
                  },
                }}
              >
                {/* Members */}
                {isLoadingRemoveMember ? (
                  <Box sx={{ display: "flex", justifyContent: "center", pt: 5 }}>
                    <CircularProgress size={40} sx={{ color: mahony }} />
                  </Box>
                ) : (
                  <Stack spacing={"1rem"}>
                    {members.map((i) => (
                      <Fade in={true} key={i._id} timeout={300}>
                        <div>
                          <UserItem
                            user={i}
                            isAdded
                            styling={{
                              bgcolor: "rgba(255,255,255,0.03)",
                              borderRadius: "0.75rem",
                              padding: "0.75rem 1.5rem",
                              transition: "all 0.2s",
                              border: "1px solid rgba(255,255,255,0.05)",
                              "&:hover": {
                                bgcolor: "rgba(255,255,255,0.05)",
                                borderColor: "rgba(255,255,255,0.1)",
                              }
                            }}
                            handler={removeMemberHandler}
                          />
                        </div>
                      </Fade>
                    ))}
                  </Stack>
                )}
              </Box>
            </Paper>
            {ButtonGroup}
          </>
        )}
      </Grid>

      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
          "& .MuiDrawer-paper": {
            width: "80%",
            maxWidth: "300px",
            bgcolor: "rgba(21, 21, 25, 0.95)",
            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
          }
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
      >
        <GroupsList
          w={"100%"}
          myGroups={myGroups?.data?.groups}
          chatId={chatId}
        />
      </Drawer>
    </Grid>
  );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => (
  <Box
    width={w}
    sx={{
      height: "100vh",
      overflow: "auto",
      p: 2,
      "&::-webkit-scrollbar": {
        width: "4px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#444",
        borderRadius: "5px",
      },
    }}
  >
    <Stack direction="row" alignItems="center" spacing={1} mb={3}>
      <PeopleIcon sx={{ color: mahony }} />
      <Typography 
        variant="h6" 
        fontWeight="bold" 
        color={lightGray}
      >
        Your Groups
      </Typography>
    </Stack>
    
    <Stack spacing={0.5}>
      {myGroups.length > 0 ? (
        myGroups.map((group) => (
          <GroupListItems group={group} chatId={chatId} key={group._id} />
        ))
      ) : (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3,
            bgcolor: "rgba(255,255,255,0.03)",
            borderRadius: "0.75rem",
            border: "1px dashed rgba(255,255,255,0.1)",
            textAlign: "center",
            mt: 2
          }}
        >
          <InfoIcon sx={{ color: "rgba(255,255,255,0.4)", fontSize: 40, mb: 1 }} />
          <Typography textAlign={"center"} color={lightGray} sx={{ opacity: 0.7 }}>
            No Groups Available
          </Typography>
          <Typography variant="body2" textAlign={"center"} color={lightGray} sx={{ opacity: 0.5, mt: 1 }}>
            Create a new group using the "+" button in the header
          </Typography>
        </Paper>
      )}
    </Stack>
  </Box>
);

const GroupListItems = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  const isActive = chatId === _id;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: "0.75rem",
          bgcolor: isActive ? `${mahony}15` : "rgba(255,255,255,0.03)",
          border: `1px solid ${isActive ? `${mahony}40` : "rgba(255,255,255,0.05)"}`,
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: isActive ? `${mahony}20` : "rgba(255,255,255,0.05)",
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }
        }}
      >
        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
          <AvatarCard avatar={avatar} max={3} />
          <Box>
            <Typography color={isActive ? violet : "white"} fontWeight={"bold"}>
              {name}
            </Typography>
            <Typography 
              variant="body2" 
              color="rgba(255,255,255,0.5)"
              sx={{ mt: 0.5 }}
            >
              {_id.substring(0, 8)}...
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Link>
  );
});

export default Groups;
