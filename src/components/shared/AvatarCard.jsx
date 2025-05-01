import { Avatar, AvatarGroup, Box, Stack, Tooltip } from "@mui/material";
import React from "react";
import { transformImage } from "../../lib/features";
import { mahony, violet } from "../../constants/color";

// To-do transform
const AvatarCard = ({ avatar = [], max = 4 }) => {
  // Calculate the spacing for overlapping avatars
  const spacing = 1.8; // Controls how much avatars overlap
  const totalWidth = avatar.length > 0 ? (avatar.length <= max ? 
    avatar.length * spacing : max * spacing) : 0;

  return (
    <Box sx={{ position: "relative", height: "3rem", width: `${Math.max(totalWidth, 3)}rem` }}>
      {avatar.length > 0 ? (
        <AvatarGroup
          max={max}
          sx={{
            "& .MuiAvatar-root": {
              width: "3rem",
              height: "3rem",
              border: `2px solid rgba(255,255,255,0.1)`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                zIndex: 10,
                transform: "scale(1.05)",
                boxShadow: `0 3px 10px rgba(0,0,0,0.3), 0 0 0 2px ${mahony}50`,
                borderColor: mahony,
              },
            },
            "& .MuiAvatarGroup-avatar": {
              borderColor: "rgba(41,41,45,0.9)",
            },
          }}
        >
          {avatar.map((i, index) => (
            <Tooltip 
              key={Math.random() * 100} 
              title={`Avatar ${index + 1}`}
              arrow
              placement="top"
            >
              <Avatar
                src={transformImage(i)}
                alt={`Avatar ${index}`}
                sx={{
                  position: "absolute",
                  left: {
                    xs: `${index * spacing}rem`,
                    sm: `${index * spacing}rem`,
                  },
                  zIndex: avatar.length - index,
                  backgroundColor: "rgba(41,41,45,0.9)",
                }}
              />
            </Tooltip>
          ))}
        </AvatarGroup>
      ) : (
        <Avatar
          sx={{
            width: "3rem",
            height: "3rem",
            bgcolor: "rgba(229, 151, 87, 0.1)",
            color: mahony,
            border: `2px solid rgba(255,255,255,0.1)`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          ?
        </Avatar>
      )}
    </Box>
  );
};

export default AvatarCard;
