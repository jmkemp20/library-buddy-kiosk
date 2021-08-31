import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { AuthContext } from '../context/auth-context';
import {
  Divider,
  Box,
  CircularProgress,
  Button
} from "@material-ui/core";
import studentColumnNames from "../utils/studentColumnNames";

const Dashboard = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [selectedRow, setSelectedRow] = useState();

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/students", {
      method: "GET",
      headers: {
        'X-API-KEY': auth.token,
        'Accept': 'application/json'
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const students = [];
        for (let i = 0; i < data.length; i++) {
          const temp = {
            id: i,
            _id: data[i]._id,
            name: data[i].name,
            classroom_name: data[i].classroom_name,
            current_books: data[i].checkout_list.length
          };
          students.push(temp);
        }
        const sortedStudents = students.sort((a, b) =>
          a.name < b.name ? -1 : 1
        );
        setStudentList(sortedStudents);
        setIsLoading(false);
      });
  }, [auth.token]);

  const handleRowSelection = (row) => {
    setSelectedRow(row.row);
  };

  const checkIn = () => {
    sessionStorage.clear();
    if (selectedRow !== undefined) {
      if (selectedRow.current_books > 0) {
        sessionStorage.setItem("selectedStudent", JSON.stringify(selectedRow));
        navigate("/app/checkin", { replace: true });
      }
    }
  };

  const checkOut = () => {
    sessionStorage.clear();
    if (selectedRow !== undefined) {
      sessionStorage.setItem("selectedStudent", JSON.stringify(selectedRow));
      navigate("/app/checkout", { studentId: selectedRow._id });
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | LibraryBuddy</title>
      </Helmet>

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
        <Box style={{ height: (window.innerHeight - 110), width: "100%" }}>
          <DataGrid
            rows={studentList}
            columns={studentColumnNames}
            rowHeight={40}
            hideFooterPagination
            hideFooter
            headerHeight={50}
            disableColumnMenu
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
          disabled={isLoading}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={checkIn}
        >
          Check In
        </Button>
        <Divider orientation="vertical" />
        <Button
          color="primary"
          disabled={isLoading}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={checkOut}
        >
          CheckOut
        </Button>
      </Box>
    </>
  );
};

export default Dashboard;
