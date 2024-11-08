import React, { useCallback, useEffect, useState } from 'react';
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
    AccordionDetails
} from '@mui/material';
import { styled } from '@mui/system';
import {
    ClipboardDocumentListIcon,
    CreditCardIcon,
    UsersIcon,
    ShoppingCartIcon,
    ChartBarIcon,
    CogIcon,
    ArrowDownCircleIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { CheckCircle } from '@mui/icons-material';
import { useAuth } from '../hooks/use-auth';
import { fetchSingleUser } from '../services/api/users.api';
import { neutral, success, info } from '../theme/colors';

const StyledIcon = styled('svg')({
    width: 48,
    height: 48,
    marginBottom: 16,
    color: success.ppdc,
});

const Feature = ({ icon, title, description }) => (
    <Card elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'transparent' }}>
        <CardContent>
            <StyledIcon as={icon} />
            <Typography variant="h6" component="h3" gutterBottom sx={{ color: success.ppdc, fontWeight: 'bold' }}>
                {title}
            </Typography>
            <Typography variant="body2" sx={{ color: neutral[600] }}>
                {description}
            </Typography>
        </CardContent>
    </Card>
);

const SectionTitle = styled(Typography)(({ theme }) => ({
    position: 'relative',
    marginBottom: 48,
    '&::after': {
        content: '""',
        display: 'block',
        width: '60px',
        height: '4px',
        backgroundColor: success.ppdc,
        position: 'absolute',
        bottom: '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
    },
}));

const StyledPriceCard = styled(Card)({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0px 10px 20px rgba(0,0,0,0.1)',
    },
});

const PriceTag = styled(Typography)({
    fontSize: '2rem',
    fontWeight: 700,
    color: success.ppdc,
    marginBottom: 16,
});

const LandingPage = () => {
    const auth = useAuth();
    const [user, setUser] = useState(auth?.user);

    const fetchUserData = useCallback(async () => {
        try {
            const userId = window.localStorage.getItem("gwapp_userId");
            if (userId) {
                const response = await fetchSingleUser(userId);
                console.log("User data fetched successfully:", response?.data);
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const [openDemoModal, setOpenDemoModal] = useState(false);

    const validationSchema = yup.object().shape({
        orgName: yup.string().required('Organization Name is required'),
        address: yup.string().required('Address is required'),
        email: yup.string().email('Invalid email format').required('Email is required'),
        contactNumber: yup.string().required('Contact Number is required')
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            await axios.post('/api/request-demo', values);
            toast.success('Demo request submitted successfully');
            resetForm();
            setOpenDemoModal(false);
        } catch (error) {
            toast.error('Failed to submit demo request');
        }
    };

    return (
        <>
            <CssBaseline />
            <Box
                sx={{
                    backgroundImage: 'url(https://images.pexels.com/photos/34069/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '80vh',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h6" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
                            GWAPP
                        </Typography>
                        <Box>
                            <Button color="inherit" component={Link} to="#features" sx={{ color: 'white' }}>Features</Button>
                            <Button color="inherit" component={Link} to="#pricing" sx={{ color: 'white' }}>Pricing</Button>
                            <Button variant="contained" color="primary" component={Link} to="user/login" sx={{ ml: 2, bgcolor: success.ppdc }}>
                                Login
                            </Button>
                        </Box>
                    </Toolbar>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8} lg={6}>
                            <Typography variant="h1" component="h1" gutterBottom sx={{ color: 'white' }}>
                                Streamline Your Financial Processes Paperfree
                            </Typography>
                            <Typography variant="h5" component="p" sx={{ color: 'white' }} paragraph>
                                Manage requisitions, approvals, vendors, and procurement with ease. Generate financial data effortlessly.
                            </Typography>
                            <Button variant="contained" size="large" onClick={() => setOpenDemoModal(true)} sx={{ mr: 2, bgcolor: success.ppdc }}>
                                Request a Demo
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <Box py={8} id="features">
                    <SectionTitle variant="h2" component="h2" align="center" gutterBottom>
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
                <SectionTitle variant="h2" component="h2" align="center" gutterBottom>
                    Pricing Plans
                </SectionTitle>
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={6}>
                            <StyledPriceCard elevation={3}>
                                <CardHeader
                                    title={<Typography variant="h5" sx={{ color: success.ppdc }}>Standard Plan</Typography>}
                                    subheader={<Typography variant="body1" sx={{ color: neutral[600] }}>Perfect for growing businesses</Typography>}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <PriceTag variant="h4" component="p">
                                        60 Days Free
                                    </PriceTag>
                                    <Typography variant="body1" sx={{ color: neutral[600] }} gutterBottom>
                                        Then from ₦10,000/user/month
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckCircle sx={{ color: success.ppdc }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Full access to all features" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckCircle sx={{ color: success.ppdc }} />
                                            </ListItemIcon>
                                            <ListItemText primary="60-day free trial" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckCircle sx={{ color: success.ppdc }} />
                                            </ListItemIcon>
                                            <ListItemText primary="₦10,000/user/month (annual billing)" />
                                        </ListItem>
                                    </List>
                                    <Button variant="contained" fullWidth size="large" onClick={() => setOpenDemoModal(true)} sx={{ bgcolor: success.ppdc }}>
                                        Start Free Trial
                                    </Button>
                                </CardContent>
                            </StyledPriceCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StyledPriceCard elevation={3}>
                                <CardHeader
                                    title={<Typography variant="h5" sx={{ color: success.ppdc }}>Custom Plan</Typography>}
                                    subheader={<Typography variant="body1" sx={{ color: neutral[600] }}>Tailored to your organization's needs</Typography>}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <PriceTag variant="h4" component="p">
                                        Custom Pricing
                                    </PriceTag>
                                    <Typography variant="body1" sx={{ color: neutral[600] }} gutterBottom>
                                        Flexible options for enterprises
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckCircle sx={{ color: success.ppdc }} />
                                            </ListItemIcon>
                                            <ListItemText primary="All Standard Plan features" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckCircle sx={{ color: success.ppdc }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Custom feature development" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckCircle sx={{ color: success.ppdc }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Dedicated support team" />
                                        </ListItem>
                                    </List>
                                    <Button variant="outlined" fullWidth size="large" sx={{ color: success.ppdc, borderColor: success.ppdc }}>
                                        Request a Quote
                                    </Button>
                                </CardContent>
                            </StyledPriceCard>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box>
                <Container maxWidth="lg" sx={{ mt: 8 }}>
                    <SectionTitle variant="h4" component="h4" align="center" gutterBottom>
                        Frequently Asked Questions
                    </SectionTitle>
                    <Accordion>
                        <AccordionSummary expandIcon={<ArrowDownCircleIcon />}>
                            <Typography variant="h6">What is included in the Standard Plan?</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                The Standard Plan includes full access to all features, a 60-day free trial, and annual billing options.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ArrowDownCircleIcon />}>
                            <Typography variant="h6">Can I upgrade my plan later?</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Yes, you can upgrade your plan at any time. Simply contact our support team for assistance.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ArrowDownCircleIcon />}>
                            <Typography variant="h6">Is there a money-back guarantee?</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Yes, we offer a 30-day money-back guarantee if you are not satisfied with our service.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ArrowDownCircleIcon />}>
                            <Typography variant="h6">How do I contact support?</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                You can contact our support team via email at support@fintrackpro.com or through our contact form on the website.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Container>
            </Box>

            <Box sx={{ bgcolor: neutral[1000], color: 'white', py: 4 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="h6" gutterBottom>
                                Gwapp
                            </Typography>
                            <Typography variant="body2">
                                © {new Date().getFullYear()}. All rights reserved.
                            </Typography>
                            <Typography variant="body2" sx={{ color: neutral[400] }}>
                                Dedicated to providing the best requisition management solutions to streamline your processes and enhance productivity.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            {/* Quick Links section removed as per your previous version */}
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="h6" gutterBottom>
                                Contact
                            </Typography>
                            <Typography variant="body2" sx={{ color: neutral[400] }}>
                                Email: tech@ppdc.org
                            </Typography>
                            <Typography variant="body2" sx={{ color: neutral[400] }}>
                                Phone: +234 703 8334 703
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Modal open={openDemoModal} onClose={() => setOpenDemoModal(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, boxShadow: 24 }}>
                    <Typography variant="h6" component="h2" mb={2}>Request a Demo</Typography>
                    <Formik
                        initialValues={{ orgName: '', address: '', email: '', contactNumber: '' }}
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
                                    error={touched.orgName && Boolean(errors.orgName)}
                                    helperText={touched.orgName && errors.orgName}
                                />
                                <Field
                                    as={TextField}
                                    name="address"
                                    label="Address"
                                    fullWidth
                                    margin="normal"
                                    error={touched.address && Boolean(errors.address)}
                                    helperText={touched.address && errors.address}
                                />
                                <Field
                                    as={TextField}
                                    name="email"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    margin="normal"
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                />
                                <Field
                                    as={TextField}
                                    name="contactNumber"
                                    label="Contact Number"
                                    fullWidth
                                    margin="normal"
                                    error={touched.contactNumber && Boolean(errors.contactNumber)}
                                    helperText={touched.contactNumber && errors.contactNumber}
                                />
                                <Box mt={3} textAlign="center">
                                    <Button type="submit" variant="contained" sx={{ bgcolor: success.ppdc }}>Submit</Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Modal>
        </>
    );
}

export default LandingPage;


// import React, { useCallback, useEffect, useState } from 'react';
// import {
//     Toolbar,
//     Typography,
//     Button,
//     Container,
//     Grid,
//     Card,
//     CardContent,
//     TextField,
//     Box,
//     ThemeProvider,
//     createTheme,
//     CssBaseline,
//     Modal,
//     Divider,
//     CardHeader,
//     List,
//     ListItem,
//     ListItemIcon,
//     ListItemText,
//     Accordion,
//     AccordionSummary,
//     AccordionDetails
// } from '@mui/material';
// import { styled } from '@mui/system';
// import {
//     ClipboardDocumentListIcon,
//     CreditCardIcon,
//     UsersIcon,
//     ShoppingCartIcon,
//     ChartBarIcon,
//     CogIcon,
//     ArrowDownCircleIcon
// } from '@heroicons/react/24/outline';
// import { Link } from 'react-router-dom';
// import { Field, Form, Formik } from 'formik';
// import axios from 'axios';
// import * as yup from 'yup';
// import { toast } from 'react-toastify';
// import { CheckCircle } from '@mui/icons-material';
// import { useAuth } from '../hooks/use-auth';
// import { fetchSingleUser } from '../services/api/users.api';

// const theme = createTheme({
//     palette: {
//         primary: {
//             main: '#006c37',
//         },
//         secondary: {
//             main: '#000080',
//         },
//         background: {
//             default: '#ffffff',
//             paper: '#f7f7f7',
//         },
//         text: {
//             primary: '#1a1a1a',
//             secondary: '#4a4a4a',
//         },
//     },
//     typography: {
//         h1: {
//             fontSize: '3.5rem',
//             fontWeight: 700,
//         },
//         h2: {
//             fontSize: '2.5rem',
//             fontWeight: 600,
//         },
//         h3: {
//             fontSize: '2rem',
//             fontWeight: 600,
//         },
//     },
//     components: {
//         MuiAppBar: {
//             styleOverrides: {
//                 root: {
//                     backgroundColor: '#ffffff',
//                     color: '#1a1a1a',
//                 },
//             },
//         },
//         MuiButton: {
//             styleOverrides: {
//                 root: {
//                     borderRadius: 8,
//                     textTransform: 'none',
//                     fontWeight: 600,
//                 },
//                 containedPrimary: {
//                     backgroundColor: '#006c37',
//                     '&:hover': {
//                         backgroundColor: '#005c2f',
//                     },
//                 },
//                 outlinedPrimary: {
//                     borderColor: '#006c37',
//                     color: '#006c37',
//                     '&:hover': {
//                         backgroundColor: 'rgba(0, 108, 55, 0.04)',
//                     },
//                 },
//             },
//         },
//     },
// });

// const StyledIcon = styled('svg')(({ theme }) => ({
//     width: 48,
//     height: 48,
//     marginBottom: theme.spacing(2),
//     color: theme.palette.primary.main,
// }));

// const Feature = ({ icon, title, description }) => (
//     <Card elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'transparent' }}>
//         <CardContent>
//             <StyledIcon as={icon} />
//             <Typography variant="h6" component="h3" gutterBottom color="primary" fontWeight="bold">
//                 {title}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//                 {description}
//             </Typography>
//         </CardContent>
//     </Card>
// );

// const SectionTitle = styled(Typography)(({ theme }) => ({
//     position: 'relative',
//     marginBottom: theme.spacing(6),
//     '&::after': {
//         content: '""',
//         display: 'block',
//         width: '60px',
//         height: '4px',
//         backgroundColor: theme.palette.primary.main,
//         position: 'absolute',
//         bottom: '-16px',
//         left: '50%',
//         transform: 'translateX(-50%)',
//     },
// }));

// const StyledPriceCard = styled(Card)(({ theme }) => ({
//     height: '100%',
//     display: 'flex',
//     flexDirection: 'column',
//     transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//     '&:hover': {
//         transform: 'translateY(-10px)',
//         boxShadow: theme.shadows[10],
//     },
// }));

// const PriceTag = styled(Typography)(({ theme }) => ({
//     fontSize: '2rem',
//     fontWeight: 700,
//     color: theme.palette.primary.main,
//     marginBottom: theme.spacing(2),
// }));

// const LandingPage = () => {
//     const auth = useAuth();
// 	const [user, setUser] = useState(auth?.user);

// 	const fetchUserData = useCallback(async () => {
// 		try {
// 			const userId = window.localStorage.getItem("gwapp_userId");
// 			if (userId) {
// 				const response = await fetchSingleUser(userId);
// 				// setUser(response?.data);
// 				// auth.fetchUserData();
//                 console.log("User data fetched successfully:", response?.data);
// 			}
// 		} catch (error) {
// 			console.error("Failed to fetch user data:", error);
// 		}
// 	}, [auth]);

// 	useEffect(() => {
// 		fetchUserData();
// 	}, [fetchUserData]);

//     const [openDemoModal, setOpenDemoModal] = useState(false);

//     const validationSchema = yup.object().shape({
//         orgName: yup.string().required('Organization Name is required'),
//         address: yup.string().required('Address is required'),
//         email: yup.string().email('Invalid email format').required('Email is required'),
//         contactNumber: yup.string().required('Contact Number is required')
//     });

//     const handleSubmit = async (values, { resetForm }) => {
//         try {
//             // Example API call, replace with your endpoint
//             await axios.post('/api/request-demo', values);
//             toast.success('Demo request submitted successfully');
//             resetForm();
//             setOpenDemoModal(false);
//         } catch (error) {
//             toast.error('Failed to submit demo request');
//         }
//     };

//     const setIsDemoModalOpen = () => { };

//     return (
//         <ThemeProvider theme={theme}>
//             <CssBaseline />
//             <Box
//                 sx={{
//                     // backgroundImage: 'url(https://images.pexels.com/photos/7947849/pexels-photo-7947849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
//                     backgroundImage: 'url(https://images.pexels.com/photos/34069/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
//                     // backgroundImage: 'url(https://images.pexels.com/photos/577210/pexels-photo-577210.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center',
//                     minHeight: '80vh',
//                     display: 'flex',
//                     alignItems: 'center',
//                     position: 'relative',
//                     '&::before': {
//                         content: '""',
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                     },
//                 }}
//             >
//                 <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
//                     <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//                         <Typography variant="h6" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
//                             GWAPP
//                         </Typography>
//                         <Box>
//                             <Button color="inherit" component={Link} to="#features" sx={{ color: 'white' }}>Features</Button>
//                             <Button color="inherit" component={Link} to="#pricing" sx={{ color: 'white' }}>Pricing</Button>
//                             <Button variant="contained" color="primary" component={Link} to="user/login" sx={{ ml: 2 }}>
//                                 Login
//                             </Button>
//                         </Box>
//                     </Toolbar>
//                     <Grid container spacing={4}>
//                         <Grid item xs={12} md={8} lg={6}>
//                             <Typography variant="h1" component="h1" gutterBottom color="white">
//                                 Streamline Your Financial Processes Paperfree
//                             </Typography>
//                             <Typography variant="h5" component="p" color="white" paragraph>
//                                 Manage requisitions, approvals, vendors, and procurement with ease. Generate financial data effortlessly.
//                             </Typography>
//                             <Button variant="contained" size="large" onClick={() => setIsDemoModalOpen(true)} sx={{ mr: 2 }}>
//                                 Request a Demo
//                             </Button>
//                         </Grid>
//                     </Grid>
//                 </Container>
//             </Box>

//             <Container maxWidth="lg">
//                 {/* Key Features */}
//                 <Box py={8} id="features">
//                     <SectionTitle variant="h2" component="h2" align="center" gutterBottom>
//                         Key Features
//                     </SectionTitle>
//                     <Grid container spacing={4}>
//                         <Grid item xs={12} sm={6} md={4}>
//                             <Feature
//                                 icon={ClipboardDocumentListIcon}
//                                 title="Requisition Tracking"
//                                 description="Manage fund, refund, and petty cash requests efficiently."
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={4}>
//                             <Feature
//                                 icon={CreditCardIcon}
//                                 title="Payment Approvals"
//                                 description="Streamline the approval process for all payments."
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={4}>
//                             <Feature
//                                 icon={UsersIcon}
//                                 title="Vendor Management"
//                                 description="Comprehensive vendor listing and management system."
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={4}>
//                             <Feature
//                                 icon={ShoppingCartIcon}
//                                 title="Procurement Management"
//                                 description="Efficiently manage procurement processes and bids."
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={4}>
//                             <Feature
//                                 icon={ChartBarIcon}
//                                 title="Financial Data Generation"
//                                 description="Generate comprehensive financial reports and analytics."
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={4}>
//                             <Feature
//                                 icon={CogIcon}
//                                 title="Customizable Features"
//                                 description="Tailor the system to your organization's specific needs."
//                             />
//                         </Grid>
//                     </Grid>
//                 </Box>
//             </Container>

//             {/* Pricing Section */}
//             <Box py={8} id="pricing" sx={{ backgroundColor: 'background.paper' }}>
//                 <SectionTitle variant="h2" component="h2" align="center" gutterBottom>
//                     Pricing Plans
//                 </SectionTitle>
//                 <Container maxWidth="lg">
//                     <Grid container spacing={4} justifyContent="center">
//                         <Grid item xs={12} md={6}>
//                             <StyledPriceCard elevation={3}>
//                                 <CardHeader
//                                     title={<Typography variant="h5" color="primary">Standard Plan</Typography>}
//                                     subheader={<Typography variant="body1" color="text.secondary">Perfect for growing businesses</Typography>}
//                                 />
//                                 <CardContent sx={{ flexGrow: 1 }}>
//                                     <PriceTag variant="h4" component="p">
//                                         60 Days Free
//                                     </PriceTag>
//                                     <Typography variant="body1" color="text.secondary" gutterBottom>
//                                         Then from ₦10,000/user/month
//                                     </Typography>
//                                     <List>
//                                         <ListItem>
//                                             <ListItemIcon>
//                                                 <CheckCircle color="primary" />
//                                             </ListItemIcon>
//                                             <ListItemText primary="Full access to all features" />
//                                         </ListItem>
//                                         <ListItem>
//                                             <ListItemIcon>
//                                                 <CheckCircle color="primary" />
//                                             </ListItemIcon>
//                                             <ListItemText primary="60-day free trial" />
//                                         </ListItem>
//                                         <ListItem>
//                                             <ListItemIcon>
//                                                 <CheckCircle color="primary" />
//                                             </ListItemIcon>
//                                             <ListItemText primary="₦10,000/user/month (annual billing)" />
//                                         </ListItem>
//                                     </List>
//                                     <Button variant="contained" fullWidth size="large" onClick={() => setIsDemoModalOpen(true)}>
//                                         Start Free Trial
//                                     </Button>
//                                 </CardContent>
//                             </StyledPriceCard>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                             <StyledPriceCard elevation={3}>
//                                 <CardHeader
//                                     title={<Typography variant="h5" color="primary">Custom Plan</Typography>}
//                                     subheader={<Typography variant="body1" color="text.secondary">Tailored to your organization's needs</Typography>}
//                                 />
//                                 <CardContent sx={{ flexGrow: 1 }}>
//                                     <PriceTag variant="h4" component="p">
//                                         Custom Pricing
//                                     </PriceTag>
//                                     <Typography variant="body1" color="text.secondary" gutterBottom>
//                                         Flexible options for enterprises
//                                     </Typography>
//                                     <List>
//                                         <ListItem>
//                                             <ListItemIcon>
//                                                 <CheckCircle color="primary" />
//                                             </ListItemIcon>
//                                             <ListItemText primary="All Standard Plan features" />
//                                         </ListItem>
//                                         <ListItem>
//                                             <ListItemIcon>
//                                                 <CheckCircle color="primary" />
//                                             </ListItemIcon>
//                                             <ListItemText primary="Custom feature development" />
//                                         </ListItem>
//                                         <ListItem>
//                                             <ListItemIcon>
//                                                 <CheckCircle color="primary" />
//                                             </ListItemIcon>
//                                             <ListItemText primary="Dedicated support team" />
//                                         </ListItem>
//                                     </List>
//                                     <Button variant="outlined" fullWidth size="large">
//                                         Request a Quote
//                                     </Button>
//                                 </CardContent>
//                             </StyledPriceCard>
//                         </Grid>
//                     </Grid>
//                 </Container>
//             </Box>

//             {/* FAQs Section */}
//             <Box>
//                 <Container maxWidth="lg" sx={{ mt: 8 }}>
//                     <SectionTitle variant="h4" component="h4" align="center" gutterBottom>
//                         Frequently Asked Questions
//                     </SectionTitle>
//                     <Accordion>
//                         <AccordionSummary expandIcon={<ArrowDownCircleIcon />}>
//                             <Typography variant="h6">What is included in the Standard Plan?</Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                             <Typography>
//                                 The Standard Plan includes full access to all features, a 60-day free trial, and annual billing options.
//                             </Typography>
//                         </AccordionDetails>
//                     </Accordion>
//                     <Accordion>
//                         <AccordionSummary expandIcon={<ArrowDownCircleIcon />}>
//                             <Typography variant="h6">Can I upgrade my plan later?</Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                             <Typography>
//                                 Yes, you can upgrade your plan at any time. Simply contact our support team for assistance.
//                             </Typography>
//                         </AccordionDetails>
//                     </Accordion>
//                     <Accordion>
//                         <AccordionSummary expandIcon={<ArrowDownCircleIcon />}>
//                             <Typography variant="h6">Is there a money-back guarantee?</Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                             <Typography>
//                                 Yes, we offer a 30-day money-back guarantee if you are not satisfied with our service.
//                             </Typography>
//                         </AccordionDetails>
//                     </Accordion>
//                     <Accordion>
//                         <AccordionSummary expandIcon={<ArrowDownCircleIcon />}>
//                             <Typography variant="h6">How do I contact support?</Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                             <Typography>
//                                 You can contact our support team via email at support@fintrackpro.com or through our contact form on the website.
//                             </Typography>
//                         </AccordionDetails>
//                     </Accordion>
//                 </Container>
//             </Box>

//             {/* Footer */}
//             <Box sx={{ bgcolor: '#1a1a1a', color: 'white', py: 4 }}>
//                 <Container maxWidth="lg">
//                     <Grid container spacing={4}>
//                         <Grid item xs={12} sm={6} md={4}>
//                             <Typography variant="h6" gutterBottom>
//                                 Gwapp
//                             </Typography>
//                             <Typography variant="body2">
//                                 © {new Date().getFullYear()}. All rights reserved.
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary">
//                                 Dedicated to providing the best requisition management solutions to streamline your processes and enhance productivity.
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={4}>
//                             {/* <Typography variant="h6" gutterBottom>
//                                 Quick Links
//                             </Typography>
//                             <Box>
//                                 <Link href="#features" color="white" sx={{ textDecoration: 'none' }}>T & C</Link><br />
//                             </Box> */}
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={4}>
//                             <Typography variant="h6" gutterBottom>
//                                 Contact
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary">
//                                 Email: tech@ppdc.org
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary">
//                                 Phone: +234 703 8334 703
//                             </Typography>
//                         </Grid>
//                     </Grid>
//                 </Container>
//             </Box>

//             <Modal open={openDemoModal} onClose={() => setOpenDemoModal(false)}>
//                 <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, boxShadow: 24 }}>
//                     <Typography variant="h6" component="h2" mb={2}>Request a Demo</Typography>
//                     <Formik
//                         initialValues={{ orgName: '', address: '', email: '', contactNumber: '' }}
//                         validationSchema={validationSchema}
//                         onSubmit={handleSubmit}
//                     >
//                         {({ errors, touched }) => (
//                             <Form>
//                                 <Field
//                                     as={TextField}
//                                     name="orgName"
//                                     label="Organization Name"
//                                     fullWidth
//                                     margin="normal"
//                                     error={touched.orgName && Boolean(errors.orgName)}
//                                     helperText={touched.orgName && errors.orgName}
//                                 />
//                                 <Field
//                                     as={TextField}
//                                     name="address"
//                                     label="Address"
//                                     fullWidth
//                                     margin="normal"
//                                     error={touched.address && Boolean(errors.address)}
//                                     helperText={touched.address && errors.address}
//                                 />
//                                 <Field
//                                     as={TextField}
//                                     name="email"
//                                     label="Email"
//                                     type="email"
//                                     fullWidth
//                                     margin="normal"
//                                     error={touched.email && Boolean(errors.email)}
//                                     helperText={touched.email && errors.email}
//                                 />
//                                 <Field
//                                     as={TextField}
//                                     name="contactNumber"
//                                     label="Contact Number"
//                                     fullWidth
//                                     margin="normal"
//                                     error={touched.contactNumber && Boolean(errors.contactNumber)}
//                                     helperText={touched.contactNumber && errors.contactNumber}
//                                 />
//                                 <Box mt={3} textAlign="center">
//                                     <Button type="submit" variant="contained" color="primary">Submit</Button>
//                                 </Box>
//                             </Form>
//                         )}
//                     </Formik>
//                 </Box>
//             </Modal>
//         </ThemeProvider>
//     );
// }

// export default LandingPage;