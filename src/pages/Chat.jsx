import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AddReaction as AddReactionIcon,
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";
import { 
  IconButton, 
  Skeleton, 
  Stack, 
  Popover, 
  Box, 
  Paper, 
  Typography, 
  Fade,
  Tooltip,
  Zoom,
  Badge,
  Fab
} from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import FileMenu from "../components/dialogs/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import MessageComponent from "../components/shared/MessageComponent";
import { jetBlack, lightGray, mahony, mostlyBlack, violet } from "../constants/color";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { getSocket } from "../socket";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loaders";
import { InputBox } from "../components/styles/styledComponents";
import { useNavigate } from "react-router-dom";

const Chat = ({ chatId, user }) => {
  const socket = getSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const scrollButtonRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const [emojiPickerAnchor, setEmojiPickerAnchor] = useState(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [2000]);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const handleEmojiClick = (event) => {
    setEmojiPickerAnchor(event.currentTarget);
  };

  const handleEmojiSelect = (event, emojiObject) => {
    const { emoji } = emojiObject;
    setMessage((prevMessage) => prevMessage + emoji);
    setEmojiPickerAnchor(null);
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop } = containerRef.current;
      setShowScrollButton(scrollTop < -100);
    }
  };

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  useEffect(() => {
    containerRef.current?.addEventListener("scroll", handleScroll);
    return () => {
      containerRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Fragment>
      <Stack 
        sx={{
          height: '93%',
          position: 'relative',
          bgcolor: jetBlack,
        }}
      >
        <Box
          ref={containerRef}
          boxSizing={"border-box"}
          padding={"1rem"}
          sx={{
            overflowX: "hidden",
            overflowY: "auto",
            height: "100%",
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "5px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
            },
          }}
        >
          <Stack spacing={"1rem"} pb={1}>
            {allMessages.map((i) => (
              <Fade in={true} key={i._id} timeout={300}>
                <Box>
                  <MessageComponent message={i} user={user} />
                </Box>
              </Fade>
            ))}
            {userTyping && <TypingLoader />}
          </Stack>
          <div ref={bottomRef} />
        </Box>
        
        {showScrollButton && (
          <Zoom in={showScrollButton}>
            <Fab 
              size="small" 
              color="primary" 
              aria-label="scroll down"
              sx={{ 
                position: 'absolute', 
                bottom: 80, 
                right: 20,
                bgcolor: mahony, 
                '&:hover': { 
                  bgcolor: `${mahony}e0` 
                },
                zIndex: 2
              }}
              onClick={scrollToBottom}
            >
              <KeyboardArrowDownIcon />
            </Fab>
          </Zoom>
        )}
      </Stack>

      <Paper
        elevation={3}
        component="form"
        onSubmit={submitHandler}
        sx={{
          height: "7%",
          bgcolor: "rgba(35, 32, 31, 0.7)",
          borderRadius: 0,
          //backdropFilter: "blur(10px)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          }
        }}
      >
        <Stack
          direction={"row"}
          width="100%"
          height={"100%"}
          alignItems={"center"}
          spacing={1}
          padding={"0 0.5rem"}
        >
          <Tooltip title="Add emoji" arrow placement="top">
            <IconButton
              size="small"
              sx={{
                color: mahony,
                bgcolor: `${lightGray}33`,
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: lightGray,
                }
              }}
              onClick={handleEmojiClick}
            >
              <AddReactionIcon />
            </IconButton>
          </Tooltip>
          
          <Popover
            open={Boolean(emojiPickerAnchor)}
            anchorEl={emojiPickerAnchor}
            onClose={() => setEmojiPickerAnchor(null)}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <EmojiPicker onEmojiClick={handleEmojiSelect} />
          </Popover>
          
          <Tooltip title="Attach file" arrow placement="top">
            <IconButton
              size="small"
              sx={{
                color: mahony,
                bgcolor: `${lightGray}33`,
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: lightGray,
                }
              }}
              onClick={handleFileOpen}
            >
              <AttachFileIcon />
            </IconButton>
          </Tooltip>
          
          <InputBox
            placeholder="Type message here..."
            value={message}
            onChange={messageOnChange}
            sx={{
              bgcolor: `${lightGray}33`,
              borderRadius: "30px",
              color: mostlyBlack,
              border: `1px solid ${mahony}`,
              px: 2,
              transition: "all 0.2s",
              "&::placeholder": {
                color: jetBlack,
              },
              "&:focus": {
                borderColor: `${mahony}50`,
                bgcolor: `${lightGray}50`,
              }
            }}
          />
          
          <Tooltip title="Send message" arrow placement="top">
            <IconButton
              size="small"
              type="submit"
              disabled={!message.trim()}
              sx={{
                color: mahony,
                bgcolor: `${lightGray}33`,
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: lightGray,
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>
      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  );
};

export default AppLayout()(Chat);
