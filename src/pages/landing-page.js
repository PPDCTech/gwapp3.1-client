import React, { useCallback, useEffect, useState } from "react";
import {
    Toolbar,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    TextField,
    Box,
    CssBaseline,
    Modal,
    CardHeader,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import {
    ClipboardDocumentListIcon,
    CreditCardIcon,
    UsersIcon,
    ShoppingCartIcon,
    ChartBarIcon,
    CogIcon,
    ArrowDownCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import * as yup from "yup";
import { toast } from "react-toastify";
import { CheckCircle } from "@mui/icons-material";
import { useAuth } from "../hooks/use-auth";
import { fetchSingleUser } from "../services/api/users.api";
import { neutral, success, info } from "../theme/colors";
import { addCustomerRequest } from "../services/api/customer-requests.api";

const StyledIcon = styled("svg")({
    width: 48,
    height: 48,
    marginBottom: 16,
    color: success.ppdc,
});

const Feature = ({ icon, title, description }) => (
    <Card
        elevation={0}
        sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "transparent",
        }}
    >
        <CardContent>
            <StyledIcon as={icon} />
            <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ color: success.ppdc, fontWeight: "bold" }}
            >
                {title}
            </Typography>
            <Typography variant="body2" sx={{ color: neutral[600] }}>
                {description}
            </Typography>
        </CardContent>
    </Card>
);

const SectionTitle = styled(Typography)(({ theme }) => ({
    position: "relative",
    marginBottom: 48,
    "&::after": {
        content: '""',
        display: "block",
        width: "60px",
        height: "4px",
        backgroundColor: success.ppdc,
        position: "absolute",
        bottom: "-16px",
        left: "50%",
        transform: "translateX(-50%)",
    },
}));

const StyledPriceCard = styled(Card)({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
        transform: "translateY(-10px)",
        boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
    },
});

const PriceTag = styled(Typography)({
    fontSize: "2rem",
    fontWeight: 700,
    color: success.ppdc,
    marginBottom: 16,
});

const LandingPage = () => {
    const auth = useAuth();
    const [user, setUser] = useState(auth?.user);
    const [submitting, setSubmitting] = useState(false);

    const fetchUserData = useCallback(async () => {
        try {
            setSubmitting(true);
            if (!auth.isAuthenticated) return;

            const userId = window.localStorage.getItem("gwapp_userId");
            if (userId) {
                const response = await fetchSingleUser(userId);
                auth.setUser(response?.data);
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        } finally {
            setSubmitting(false);
        }
    }, [auth]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const [openDemoModal, setOpenDemoModal] = useState(false);
    const [modalType, setModalType] = useState("");

    const [openTrialModal, setOpenTrialModal] = useState(false);
    const [trialEmail, setTrialEmail] = useState("");
    const [submittingTrial, setSubmittingTrial] = useState(false);

    const validationSchema = yup.object().shape({
        orgName: yup.string().required("Organization Name is required"),
        address: yup.string().required("Address is required"),
        email: yup
            .string()
            .email("Invalid email format")
            .required("Email is required"),
        contactNumber: yup.string().required("Contact Number is required"),
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const newRequest = { ...values, requestType: modalType };
            console.log(`Submitting ${modalType}:`, newRequest);
            const response = await addCustomerRequest(newRequest);
            console.log("::", response?.data);
            toast.success(
                `${
                    modalType === "demo" ? "Demo" : "Quote"
                } request submitted successfully. We'll get in touch.`
            );
            resetForm();
            setOpenDemoModal(false);
        } catch (error) {
            toast.error("Failed to submit request");
        }
    };

    const handleTrialSubmit = async () => {
        setSubmittingTrial(true);
        try {
            toast.info("Check your inbox for next steps");
            setTrialEmail("");
            setOpenTrialModal(false);
        } catch (error) {
            toast.error("Failed to submit email");
        } finally {
            setSubmittingTrial(false);
        }
    };

    const redirectTo = auth.isAuthenticated ? "/dashboard" : "/user/login";

    return (
        <>
            <CssBaseline />
            <Box
                sx={{
                    backgroundImage:
                        "url(https://images.pexels.com/photos/34069/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "80vh",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    },
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{ position: "relative", zIndex: 1 }}
                >
                    <Toolbar
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 4,
                        }}
                    >
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ color: "white", fontWeight: "bold" }}
                        >
                            GWAPP
                        </Typography>
                        <Box>
                            <Button
                                color="inherit"
                                component={Link}
                                to="#features"
                                sx={{ color: "white" }}
                            >
                                Features
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="#pricing"
                                sx={{ color: "white" }}
                            >
                                Pricing
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                component={Link}
                                to={redirectTo}
                                sx={{ ml: 2, bgcolor: success.ppdc }}
                            >
                                {auth.isAuthenticated ? "Dashboard" : "Login"}
                            </Button>
                        </Box>
                    </Toolbar>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8} lg={6}>
                            <Typography
                                variant="h1"
                                component="h1"
                                gutterBottom
                                sx={{ color: "white" }}
                            >
                                Streamline Your Financial Processes Paperfree
                            </Typography>
                            <Typography
                                variant="h5"
                                component="p"
                                sx={{ color: "white" }}
                                paragraph
                            >
                                Manage requisitions, approvals, vendors, and
                                procurement with ease, and generate financial
                                breakdown.
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => {
                                    setModalType("demo");
                                    setOpenDemoModal(true);
                                }}
                                sx={{ mr: 2, bgcolor: success.ppdc }}
                            >
                                Request a Demo
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <Box py={8} id="features">
                    <SectionTitle
                        variant="h2"
                        component="h2"
                        align="center"
                        gutterBottom
                    >
                        Key Features
                    </SectionTitle>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Feature
                                icon={ClipboardDocumentListIcon}
                                title="Requisition Tracking"
                                description="Manage fund, refund, and petty cash requests efficiently."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Feature
                                icon={CreditCardIcon}
                                title="Payment Approvals"
                                description="Streamline the approval process for all payments."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Feature
                                icon={UsersIcon}
                                title="Vendor Management"
                                description="Comprehensive vendor listing and management system."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Feature
                                icon={ShoppingCartIcon}
                                title="Procurement Management"
                                description="Efficiently manage procurement processes and bids."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Feature
                                icon={ChartBarIcon}
                                title="Financial Data Generation"
                                description="Generate comprehensive financial reports and analytics."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Feature
                                icon={CogIcon}
                                title="Customizable Features"
                                description="Tailor the system to your organization's specific needs."
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            <Box py={8} id="pricing" sx={{ backgroundColor: neutral[100] }}>
                <SectionTitle
                    variant="h2"
                    component="h2"
                    align="center"
                    gutterBottom
                >
                    Pricing Plans
                </SectionTitle>
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={6}>
                            <StyledPriceCard elevation={3}>
                                <CardHeader
                                    title={
                                        <Typography
                                            variant="h5"
                                            sx={{ color: success.ppdc }}
                                        >
                                            Standard Plan
                                        </Typography>
                                    }
                                    subheader={
                                        <Typography
                                            variant="body1"
                                            sx={{ color: neutral[600] }}
                                        >
                                            Perfect for growing businesses
                                        </Typography>
                                    }
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <PriceTag variant="h4" component="p">
                                        60 Days Free
                                    </PriceTag>
                                    <Typography
                                        variant="body1"
                                        sx={{ color: neutral[600] }}
                                        gutterBottom
                                    >
                                        Then from ₦12,000/user/month
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckCircle
                                                    sx={{ color: success.ppdc }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary="Full access to all features" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckCircle
                                                    sx={{ color: success.ppdc }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary="60-day free trial" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckCircle
                                                    sx={{ color: success.ppdc }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary="₦12,000/user/month (annual billing)" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckCircle
                                                    sx={{ color: success.ppdc }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary="₦20,000/user/month (monthly billing)" />
                                        </ListItem>
                                    </List>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        onClick={() => setOpenTrialModal(true)}
                                        sx={{ bgcolor: success.ppdc }}
                                    >
                                        Start Free Trial
                                    </Button>
                                </CardContent>
                            </StyledPriceCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StyledPriceCard elevation={3}>
                                <CardHeader
                                    title={
                                        <Typography
                                            variant="h5"
                                            sx={{ color: success.ppdc }}
                                        >
                                            Custom Plan
                                        </Typography>
                                    }
                                    subheader={
                                        <Typography
                                            variant="body1"
                                            sx={{ color: neutral[600] }}
                                        >
                                            Tailored to your organization's
                                            needs
                                        </Typography>
                                    }
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <PriceTag variant="h4" component="p">
                                        Custom Pricing
                                    </PriceTag>
                                    <Typography
                                        variant="body1"
                                        sx={{ color: neutral[600] }}
                                        gutterBottom
                                    >
                                        Flexible options for enterprises
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckCircle
                                                    sx={{ color: success.ppdc }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary="All Standard Plan features" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckCircle
                                                    sx={{ color: success.ppdc }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary="Custom feature development" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckCircle
                                                    sx={{ color: success.ppdc }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary="Dedicated support team" />
                                        </ListItem>
                                        <ListItem />
                                        <ListItem />
                                    </List>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        size="large"
                                        sx={{
                                            color: success.ppdc,
                                            borderColor: success.ppdc,
                                        }}
                                        onClick={() => {
                                            setModalType("quote");
                                            setOpenDemoModal(true);
                                        }}
                                    >
                                        Request a Quote
                                    </Button>
                                </CardContent>
                            </StyledPriceCard>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ pb: 8 }}>
                <Container maxWidth="lg" sx={{ mt: 8 }}>
                    <SectionTitle
                        variant="h4"
                        component="h4"
                        align="center"
                        gutterBottom
                    >
                        FAQs
                    </SectionTitle>
                    <Accordion>
                        <AccordionSummary expandIcon={<ArrowDownCircleIcon />}>
                            <Typography variant="h6">
                                What is included in the Standard Plan?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                The Standard Plan includes full access to all
                                features, a 60-day free trial, and annual
                                billing options.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ArrowDownCircleIcon />}>
                            <Typography variant="h6">
                                Can I upgrade my plan later?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Yes, you can upgrade your plan at any time.
                                Simply contact our support team for assistance.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ArrowDownCircleIcon />}>
                            <Typography variant="h6">
                                Is there a money-back guarantee?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Yes, we offer a 30-day money-back guarantee if
                                you are not satisfied with our service.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ArrowDownCircleIcon />}>
                            <Typography variant="h6">
                                How do I contact support?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                You can contact our support team via email at
                                tech@ppdc.org.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Container>
            </Box>

            <Box sx={{ bgcolor: neutral[1000], color: "white", py: 4 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="h6" gutterBottom>
                                Gwapp
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: neutral[400] }}
                            >
                                Dedicated to delivering a seamless requisition
                                management solution, our app reduces paperwork,
                                streamlines processes, and enhances
                                productivity.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            {/* Quick Links section removed as per your previous version */}
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="h6" gutterBottom>
                                Contact
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: neutral[400] }}
                            >
                                Email: tech@ppdc.org
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: neutral[400] }}
                            >
                                Phone: +234 703 8334 703
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider color="rgba(255, 255, 255, 0.3)" sx={{ my: 2 }} />
                    <Typography variant="body2" align="center">
                        Gwapp © {new Date().getFullYear()}. All rights reserved.
                    </Typography>
                </Container>
            </Box>

            <Modal open={openDemoModal} onClose={() => setOpenDemoModal(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        p: 4,
                        boxShadow: 24,
                    }}
                >
                    <Typography variant="h6" component="h2" mb={2}>
                        {modalType === "demo"
                            ? "Request a Demo"
                            : "Request a Quote"}
                    </Typography>
                    <Formik
                        initialValues={{
                            orgName: "",
                            address: "",
                            email: "",
                            contactNumber: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <Field
                                    as={TextField}
                                    name="orgName"
                                    label="Organization Name"
                                    fullWidth
                                    margin="normal"
                                    error={
                                        touched.orgName &&
                                        Boolean(errors.orgName)
                                    }
                                    helperText={
                                        touched.orgName && errors.orgName
                                    }
                                />
                                <Field
                                    as={TextField}
                                    name="address"
                                    label="Address"
                                    fullWidth
                                    margin="normal"
                                    error={
                                        touched.address &&
                                        Boolean(errors.address)
                                    }
                                    helperText={
                                        touched.address && errors.address
                                    }
                                />
                                <Field
                                    as={TextField}
                                    name="email"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    margin="normal"
                                    error={
                                        touched.email && Boolean(errors.email)
                                    }
                                    helperText={touched.email && errors.email}
                                />
                                <Field
                                    as={TextField}
                                    name="contactNumber"
                                    label="Contact Number"
                                    fullWidth
                                    margin="normal"
                                    error={
                                        touched.contactNumber &&
                                        Boolean(errors.contactNumber)
                                    }
                                    helperText={
                                        touched.contactNumber &&
                                        errors.contactNumber
                                    }
                                />
                                <Box mt={3} textAlign="center">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ bgcolor: success.ppdc }}
                                    >
                                        {submitting
                                            ? "Submitting..."
                                            : "Submit"}
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Modal>

            <Modal
                open={openTrialModal}
                onClose={() => setOpenTrialModal(false)}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        p: 4,
                        boxShadow: 24,
                    }}
                >
                    <Typography variant="h6" component="h2" mb={2}>
                        Start Your Free Trial
                    </Typography>
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={trialEmail}
                        onChange={(e) => setTrialEmail(e.target.value)}
                    />
                    <Box mt={3} textAlign="center">
                        <Button
                            variant="contained"
                            onClick={handleTrialSubmit}
                            sx={{ bgcolor: success.ppdc }}
                            disabled={submittingTrial}
                        >
                            {submittingTrial ? "Submitting..." : "Submit"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default LandingPage;
