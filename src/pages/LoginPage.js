import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { Formik } from "formik";
import { AuthContext } from '../context/auth-context';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Snackbar,
} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const LoginPage = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarText, setSnackBarText] = useState('');

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleLogin = (values) => {
    console.log(values['linkid']);
    const loginURL = (values['linkid'] !== '') ? `/api/user/login/${values.linkid}` : "/api/user/login"
    fetch(loginURL, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          if (data) {
            auth.login();
            auth.setUserID(data.info._id);
            auth.setToken(data.token);
            navigate("/app/dashboard", { replace: true });
          }
        });
      } else { 
        setSnackBarText('Invalid Email, Password or LinkID');
        setOpenSnackBar(true);
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>Login | LibraryBuddy</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: "",
              password: "",
              linkid: ""
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Must be a valid email")
                .max(255),
              password: Yup.string().max(255),
              linkid: Yup.string().min(23.).max(25)
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              handleLogin(values);
              resetForm();
              setSubmitting(false);
            }}
          >
            {({
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              values,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography color="textPrimary" variant="h2">
                    Sign in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Sign in to your LibraryBuddy Kiosk:
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                  autoFocus
                />
                <TextField
                  fullWidth
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Typography
                  align="center"
                  color="textSecondary"
                  variant="body1"
                >
                  or login with your LinkID
                </Typography>
                <TextField
                  fullWidth
                  helperText={"Find this in your LibraryBuddy Dashboard"}
                  label="LinkID"
                  margin="normal"
                  name="linkid"
                  onChange={handleChange}
                  value={values.linkid}
                  variant="outlined"
                />
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        message={snackBarText}
        action={(
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackBar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      />
    </>
  );
};

export default LoginPage;
