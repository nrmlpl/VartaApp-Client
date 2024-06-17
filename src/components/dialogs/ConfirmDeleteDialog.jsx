import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  //DialogTitle,
} from "@mui/material";
import React from "react";

const ConfirmDeleteDialog = ({ open, handleClose, deleteHandler }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
      <DialogContentText>
          Are you sure you want to delete this group?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" >Cancel</Button>
        <Button onClick={deleteHandler} color="error" variant="contained">Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
