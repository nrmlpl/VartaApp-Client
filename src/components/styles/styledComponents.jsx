import { Skeleton, createTheme, keyframes, styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";
import {
  jetBlack,
  lightGray,
  mahony,
  matteBlack,
  mostlyBlack,
} from "../../constants/color";

const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "react(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidde",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

const Link = styled(LinkComponent)`
  text-decoration: none;
  color: black;
  padding: 1rem;
  &:hover {
    background-color: #28282b;
  }
`;

const InputBox = styled("input")`
  color: ${lightGray};
  font-size: medium;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 3rem;
  border-radius: 1.5rem;
  background-color: ${mostlyBlack};
`;

const SearchField = styled("input")`
  padding: 0.95rem 2rem;
  width: 20vmax;
  border: none;
  outline: none;
  border-radius: 2rem;
  background-color: ${jetBlack};
  color: black;
  font-size: 1.1rem;
`;

const CurveButton = styled("button")`
  border-radius: 2rem;
  padding: 0.5rem 0.5rem;
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${matteBlack};
  color: ${"black"};
  &:hover {
    background-color: ${jetBlack};
  }
`;

const bounceAnimation = keyframes`
0% { transform: scale(1); }
50% { transform: scale(1.5); }
100% { transform: scale(1); }
`;


const BouncingSkeleton = styled(Skeleton)(() => ({
  backgroundColor: mahony,
  animation: `${bounceAnimation} 1s infinite`,
}));

export {
  CurveButton,
  SearchField,
  InputBox,
  Link,
  VisuallyHiddenInput,
  BouncingSkeleton,
};
