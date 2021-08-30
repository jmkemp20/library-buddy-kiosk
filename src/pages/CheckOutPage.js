import { Helmet } from "react-helmet";
import { useState, useRef } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  CircularProgress,
  Snackbar,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const CheckOutPage = () => {
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const scannedISBN = useRef("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarText, setSnackBarText] = useState("");

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleCheckOut = () => {
    const inputISBN = scannedISBN.current.value;
    console.log(inputISBN);
    if (inputISBN.length !== 10 && inputISBN.length !== 13) {
      scannedISBN.current?.focus();
      scannedISBN.current.value = "";
    } else {
      setOpenConfirmation(true);
    }
  };

  const handleClose = () => {
    scannedISBN.current?.focus();
    scannedISBN.current.value = "";
    setOpenConfirmation(false);
  };

  const handleCloseModal = () => {
    setOpenLoading(false);
  };

  const handleConfirmedCheckout = () => {
    const selectedStudent = JSON.parse(
      sessionStorage.getItem("selectedStudent")
    );
    setOpenConfirmation(false);
    setOpenLoading(true);
    fetch("/checkout", {
      method: "POST",
      body: JSON.stringify({
        userId: selectedStudent.parent_id,
        studentId: selectedStudent._id,
        isbn: scannedISBN.current.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setOpenLoading(false);
          setSnackBarText(data.message);
          setOpenSnackBar(true);
          scannedISBN.current?.focus();
          scannedISBN.current.value = "";
        });
      } else {
        setOpenLoading(false);
        setSnackBarText("Unable to add");
        setOpenSnackBar(true);
        scannedISBN.current?.focus();
        scannedISBN.current.value = "";
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>CheckOut | ClassroomLib</title>
      </Helmet>
      <Typography
        sx={{
          display: "flex",
          justifyContent: "center",
          pt: 2,
        }}
        variant="h4"
      >
        Please scan the barcode on the book, followed by check out...
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 330,
        }}
      >
        <TextField
          autoFocus
          margin="dense"
          id="isbn"
          label="ISBN"
          inputRef={scannedISBN}
          sx={{
            width: 350,
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          color="primary"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={handleCheckOut}
        >
          Check Out
        </Button>
      </Box>
      <Dialog
        open={openConfirmation}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to check out?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your teacher will be notified, make sure to keep good care of the
            book!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmedCheckout} color="primary" autoFocus>
            Check Out
          </Button>
        </DialogActions>
      </Dialog>
      <Modal
        open={openLoading}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableAutoFocus={true}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 3,
          }}
        >
          <CircularProgress />
        </Box>
      </Modal>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        message={snackBarText}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackBar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default CheckOutPage;
