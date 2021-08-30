import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { AuthContext } from '../context/auth-context';
import {
  Card,
  Box,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Snackbar,
} from "@material-ui/core";
import bookColumnNames from "../utils/bookColumnNames";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const CheckInPage = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [studentBooks, setStudentBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [open, setOpen] = useState(false);
  const confirmationISBN = useRef("");
  const [openLoading, setOpenLoading] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarText, setSnackBarText] = useState("");

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseModal = () => {
    setOpenLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const selectedStudent = JSON.parse(
      sessionStorage.getItem("selectedStudent")
    );
    fetch(`/api/students/${selectedStudent._id}/books`, {
      method: "GET",
      headers: {
        'X-API-KEY': auth.token,
        'Accept': 'application/json'
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const studentBookList = [];
        for (let i = 0; i < data.length; i++) {
          const temp = {
            id: i,
            isbn_10: data[i].libraryInfo.isbn_10,
            isbn_13: data[i].libraryInfo.isbn_13,
            library_id: data[i].libraryInfo._id,
            userbook_id: data[i].userInfo._id,
            title: data[i].libraryInfo.title,
            author: data[i].libraryInfo.author,
            pages: data[i].libraryInfo.pages,
            checkout_date: new Date(data[i].checkout_date*1000).toLocaleString()
          };
          studentBookList.push(temp);
        }
        const sortedStudentBookList = studentBookList.sort((a, b) =>
          a.libraryInfo.title < b.libraryInfo.title ? -1 : 1
        );
        setStudentBooks(sortedStudentBookList);
        setIsLoading(false);
      });
  }, []);

  const handleRowSelection = (row) => {
    console.log(row.row);
    setSelectedRow(row.row);
  };

  const checkInHandler = () => {
    if (selectedRow !== undefined) setOpen(true);
  };

  const finalCheckIn = () => {
    if (
      confirmationISBN.current.value === selectedRow.isbn13 ||
      confirmationISBN.current.value === selectedRow.isbn10
    ) {
      setOpenLoading(true);
      const selectedStudent = JSON.parse(
        sessionStorage.getItem("selectedStudent")
      );
      fetch("/api/students/checkin", {
        method: "POST",
        body: JSON.stringify({
          student_id: selectedStudent._id,
          userbook_id: selectedRow.userbook_id,
        }),
        headers: {
          'X-API-KEY': auth.token,
          'Accept': 'application/json',
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            const removalIndex = studentBooks.findIndex((element) => element.userbook_id)
            if (studentBooks.includes(selectedRow)) {
              setOpen(false);
              const removalIndex = studentBooks.indexOf(selectedRow);
              const tempStudentBooks = [...studentBooks];
              tempStudentBooks.splice(removalIndex, 1);
              setStudentBooks(tempStudentBooks);
              setOpenLoading(false);
              setSnackBarText(data.message);
              setOpenSnackBar(true);
              if (tempStudentBooks.length === 0) {
                navigate("/app/dashboard", { replace: true });
              }
            } else {
              setOpen(false);
              setOpenLoading(false);
              navigate("/app/dashboard", { replace: true });
            }
          });
        } else {
          setOpenLoading(false);
          setSnackBarText("Unable to Checkin");
          setOpenSnackBar(true);
          confirmationISBN.current?.focus();
          confirmationISBN.current.value = "";
        }
      });
    } else {
      setSnackBarText("Incorrect Book or Barcode");
      setOpenSnackBar(true);
      confirmationISBN.current?.focus();
      confirmationISBN.current.value = "";
    }
  };

  return (
    <>
      <Helmet>
        <title>CheckIn | ClassroomLib</title>
      </Helmet>

      <Card>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 3,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box style={{ height: 370, width: "100%" }}>
            <DataGrid
              rows={studentBooks}
              columns={bookColumnNames}
              rowHeight={studentBooks.length > 5 ? 40 : 55}
              hideFooterPagination
              hideFooter
              headerHeight={40}
              onRowClick={(selectedRow) => handleRowSelection(selectedRow)}
            />
          </Box>
        )}
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
            onClick={checkInHandler}
          >
            Check In
          </Button>
        </Box>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{`Check In: ${
          selectedRow !== undefined ? selectedRow.title : ""
        }`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please scan the barcode to complete check in...
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="isbn"
            label="ISBN"
            fullWidth
            inputRef={confirmationISBN}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={finalCheckIn} color="primary">
            Check In
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

export default CheckInPage;
