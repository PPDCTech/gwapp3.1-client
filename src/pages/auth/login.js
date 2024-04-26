import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../../hooks/use-auth";
import { useNProgress } from "../../hooks/use-nprogress";
// import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
    useNProgress();
  const navigate = useNavigate();
  const auth = useAuth();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [method, setMethod] = useState("email");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      setLoadingSubmit(true);
      try{
        const res = await auth.signIn(values.email, values.password);
        if (res && res.status === 200) {
          navigate("/");
        } else {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: "Sorry, something went wrong. Please try again." });
          helpers.setSubmitting(false);
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      } finally {
        setLoadingSubmit(false);
      }
    },
  });

  const handleMethodChange = useCallback((event, value) => {
    setMethod(value);
  }, []);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Login</Typography>
              {/* <Typography
                color="text.secondary"
                variant="body2"
              >
                Don&apos;t have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
              </Typography> */}
            </Stack>
            <Tabs
              onChange={handleMethodChange}
              sx={{
                mb: 3,
                "& .MuiTab-root.Mui-selected": {
                  color: "success.dark",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "success.dark",
                },
              }}
              value={method}
            >
              <Tab label="Login to your account" value="email" />
              {/* <Tab label="Reset password" value="phoneNumber" /> */}
            </Tabs>
            {method === "email" && (
              <form noValidate onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email Address"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                  />
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="Password"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                  />
                </Stack>

                {formik.errors.submit && (
                  <Typography color="error" sx={{ mt: 3 }} variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
                <Button
                  fullWidth
                  size="large"
                  sx={{
                    mt: 3,
                    backgroundColor: "success.darkest",
                    "&:hover": {
                      backgroundColor: "success.main",
                      transform: "scale(1.01)",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                  type="submit"
                  variant="contained"
                  disabled={loadingSubmit}
                >
                  {loadingSubmit ? "Logging in..." : "Continue"}
                </Button>
              </form>
            )}
            {method === "phoneNumber" && (
              <div>
                <Typography color="text.secondary">Loading form...</Typography>
              </div>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
};



export default Login;
