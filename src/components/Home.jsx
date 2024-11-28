import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemText,ListItemIcon, Typography, TextField, Button, Grid, Card, CardContent, IconButton, FormControl,InputLabel, Select, MenuItem,} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EditNoteIcon from '@mui/icons-material/EditNote';

const cards = [
  {
    chatLogName: "Log 1",
    department: "Finance and Accounting",
    askedBy: "Sushma",
    summary: "Summary of the finance report generation process.",
    type: "Profit and Loss Statement",
    visualizationType: "Line Graph",
    timeRange: "Yearly",
  },
  {
    chatLogName: "Log 2",
    department: "Information Technology (IT)",
    askedBy: "Priya",
    summary: "Technical details about server setup.",
    type: "System Uptime and Downtime Report",
    visualizationType: "Line Graph",
    timeRange: "Monthly",
  },
  {
    chatLogName: "Log 3",
    department: "Sales and Marketing",
    askedBy: "Rahul",
    summary: "Overview of the market share",
    type: "Market Share",
    visualizationType: "Heatmap",
    timeRange: "Monthly",
  },
  {
    chatLogName: "Log 4",
    department: "Sales and Marketing",
    askedBy: "Rahul",
    summary: "Overview of the effectiveness",
    type: "Campaign Effectiveness",
    visualizationType: "Bar Chart",
    timeRange: "Weekly",
  },
];


const Home = ({ onLogout }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole]  = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  //const [filters] = useState(['Bar Chart', 'Profit/Loss Report', 'Revenue Summary']); // Static filters for now
  const [filterVisible, setFilterVisible] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedReportType, setSelectedReportType] = useState("");
  const [selectedVisType, setSelectedVisType] = useState(""); // Chart type state
  const [selectedTimeRange, setSelectedTimeRange] = useState("");

  const departments = [
    "Underwriting",
    "Claims",
    "Actuarial",
    "Sales and Marketing",
    "Customer Service",
    "Policy Administration",
    "Finance and Accounting",
    "Legal and Compliance",
    "Information Technology (IT)",
    "Human Resources (HR)",
    "Risk Management",
    "Reinsurance",
    "Product Development",
  ];

  const reportTypesByDepartment = {
    Underwriting: [
      "Risk Assessment",
      "Premium Analysis",
      "Claim Analysis",
      "Portfolio Analysis",
      "Loss Ratio Analysis",
    ],
    Claims: [
      "Claim Summary Report",
      "Claim Status Report",
      "Claims Paid Report",
      "Claims Denied Report",
      "Claims by Department Report",
    ],
    Actuarial: [
      "Risk Assessment",
      "Claims Analysis",
      "Pricing Analysis",
      "Loss Reserve Analysis",
      "Experience Analysis",
    ],
    "Sales and Marketing": [
      "Sales Performance",
      "Lead Generation",
      "Campaign Effectiveness",
      "Customer Acquisition Cost",
      "Conversion Rate",
      "Customer Retention",
      "Market Share",
      "Ad Spend",
      "Return on Investment (ROI)",
    ],
    "Customer Service": [
      "Customer Feedback Summary",
      "Agent Performance Report",
      "Issue Resolution Analysis",
      "Call Center Statistics",
      "Customer Satisfaction (CSAT) Report",
      "First Response Time (FRT) Report",
    ],
    "Policy Administration": [
      "Policy Performance",
      "Policy Renewals",
      "Claim Ratios",
      "Policy Lapse",
      "New Policies Issued",
      "Claim Settlements",
    ],
    "Legal and Compliance": [
      "Contract Summary Report",
      "Litigation Report",
      "Compliance Audit Report",
      "Regulatory Filing Report",
      "Risk Assessment Report",
      "Code of Conduct Violation Report",
      "Data Privacy Report",
      "Anti-Money Laundering (AML) Report",
      "Whistleblower Report",
      "Intellectual Property Report",
      "Policy Review Report",
    ],
    "Information Technology (IT)": [
      "Incident Report",
      "IT Asset Report",
      "Network Performance Report",
      "Software License Management",
      "User Access Management",
      "System Uptime and Downtime Report",
      "Vulnerability Assessment Report",
      "Change Management Report",
      "IT Service Ticket Summary",
      "Backup and Recovery Report",
      "Capacity Planning Report",
    ],
    "Risk Management": [
      "Risk Assessment Report",
      "Risk Register Report",
      "Incident Report",
      "Mitigation Plan Report",
      "Risk Treatment Report",
      "Compliance Risk Report",
      "Operational Risk Report",
      "Financial Risk Report",
      "Strategic Risk Report",
      "Reputational Risk Report",
    ],
    Reinsurance: [
      "Treaty Overview Report",
      "Claims Report",
      "Financial Summary Report",
      "Premiums & Ceding Commissions Report",
      "Loss Experience Report",
      "Retrocessions Report",
      "Portfolio Review Report",
      "Risk Transfer Analysis Report",
      "Reinsurance Recoverables Report",
      "Market Analysis Report",
    ],
    "Product Development": [
      "Product Performance Review",
      "Market Research Report",
      "Development Status Update",
      "User Feedback Analysis Report",
      "Feature Prioritization Report",
      "Competitor Analysis Report",
      "Product Launch Report",
      "Product Roadmap Overview",
      "Sales Performance Report",
      "Customer Satisfaction Report",
    ],
    "Finance and Accounting": [
      "Profit and Loss Statement",
      "Balance Sheet",
      "Cash Flow Statement",
      "Budget Report",
      "Accounts Payable Report",
      "Accounts Receivable Report",
      "Expense Report",
      "Tax Report",
      "Audit Report",
      "Variance Report",
      "Revenue Report",
    ],
    "Human Resources (HR)": [
      "Employee Report",
      "Recruitment Summary",
      "Payroll Report",
      "Attendance Report",
      "Performance Evaluation Report",
      "Training and Development Report",
      "Employee Engagement Report",
      "Diversity and Inclusion Report",
      "Attrition Report",
      "Leave Report",
      "Compliance Report",
    ],
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:6001/api/isAuth', {
          method: 'GET',
          credentials: 'include'
        });
        if (response.ok) {
          const userSession = await response.json();
          //console.log(userSession);
          setUserEmail(userSession.email);
          setUserName(userSession.name);
          setUserRole(userSession.role);
          return;
        } else {
          const errorData = await response.text(); 
          console.log('User is not authenticated:', errorData);
        }
      } catch (error) {
        console.log(error);
        setError('An error occurred during Authentication');
      }
    }
    checkAuth();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Add logic to filter cards dynamically based on search term.
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    setSelectedReportType(""); // Reset report type when department changes
  };

  const handleReportTypeChange = (event) => {
    setSelectedReportType(event.target.value);
  };

  const handleVisTypeChange = (event) => {
    setSelectedVisType(event.target.value);
  };

  const handleTimeRangeChange = (event) => {
    setSelectedTimeRange(event.target.value);
  };

  const toggleFilterVisibility = () => {
    setFilterVisible((prev) => !prev);
  };

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.chatLogName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.askedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.summary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = selectedDepartment
      ? card.department === selectedDepartment
      : true;

    const matchesReportType = selectedReportType
      ? card.type === selectedReportType
      : true;

    const matchesVisType = selectedVisType
      ? card.visualizationType.toLowerCase() === selectedVisType.toLowerCase()
      : true;

    const matchesTimeRange = selectedTimeRange
      ? card.timeRange === selectedTimeRange
      : true;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesReportType &&
      matchesVisType &&
      matchesTimeRange
    );
  });

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "rgb(34, 34, 34)",
      }}
    >
      {/* Left Drawer */}
      <Drawer
      variant="permanent"
      sx={{
        width: 240,
        '& .MuiDrawer-paper': {
          width: 240,
          backgroundColor: 'rgb(51, 50, 50)',
          color: '#b3b3cc',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      {/* Top Section */}
      <Box>
        <Typography
          variant="h5"
          sx={{
            color: '#007bff',
            padding: '16px',
            fontWeight: 'bold',
            textAlign: 'center',
            borderBottom: '1px solid rgb(75, 72, 72)',
          }}
        >
          Elicitation Tool
        </Typography>
        <List sx={{ paddingTop: 2 }}>
        <ListItem button sx={{ ':hover': { backgroundColor: 'rgb(75, 72, 72)' } }}>
            <ListItemIcon sx={{ color: '#b3b3cc' }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home Page" />
          </ListItem>
          {userRole === 'admin' && (
            <>
              <ListItem button sx={{ ':hover': { backgroundColor: 'rgb(75, 72, 72)' } }}>
                <ListItemIcon sx={{ color: '#b3b3cc' }}>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Request Received" />
              </ListItem>
              <ListItem button sx={{ ':hover': { backgroundColor: 'rgb(75, 72, 72)' } }}>
                <ListItemIcon sx={{ color: '#b3b3cc' }}>
                  <EditNoteIcon />
                </ListItemIcon>
                <ListItemText primary="Update Meta Model" />
              </ListItem>
            </>
          )}
          <ListItem button sx={{ ':hover': { backgroundColor: 'rgb(75, 72, 72)' } }}>
            <ListItemIcon sx={{ color: '#b3b3cc' }}>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary="New Conversation" />
          </ListItem>
          
          <ListItem button sx={{ ':hover': { backgroundColor: 'rgb(75, 72, 72)' } }}>
            <ListItemIcon sx={{ color: '#b3b3cc' }}>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary="My ChatLogHistory" />
          </ListItem>
          <ListItem button sx={{ ':hover': { backgroundColor: 'rgb(75, 72, 72)' } }}>
            <ListItemIcon sx={{ color: '#b3b3cc' }}>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About Us" />
          </ListItem>
        </List>
      </Box>

        {/* Bottom Section */}
        <Box sx={{ padding: 2 }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            startIcon={<LogoutIcon />}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              fontWeight: "bold",
            }}
            onClick={onLogout}
          >
            Logout
          </Button>
        </Box>
      </Drawer>
      {/* Main Content */}
      <Box sx={{ flex: 1, padding: 3, color: "#b3b3cc" }}>
        <Typography variant="h4" sx={{ marginBottom: 2, color: "#007bff" }}>
          Welcome to Conversation Elicitation Tool
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            sx={{
              flex: 1,
              backgroundColor: "#fff",
              color: "#b3b3cc",
              marginRight: 1,
              borderRadius: "5px",
            }}
            onChange={handleSearch}
          />
          <IconButton sx={{ color: "#b3b3cc" }}>
            <SearchIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            sx={{ backgroundColor: "#28a745", marginLeft: 1 }}
            onClick={toggleFilterVisibility}
          >
            Filter
          </Button>
        </Box>

        {/* Department & Report Type Filters */}
        {filterVisible && (
          <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#b3b3cc" }}>Department</InputLabel>
                <Select
                  value={selectedDepartment}
                  label="Department"
                  onChange={handleDepartmentChange}
                  sx={{
                    backgroundColor: "rgb(51, 51, 51)",
                    color: "#b3b3cc",
                  }}
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {departments.map((department) => (
                    <MenuItem key={department} value={department}>
                      {department}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#b3b3cc" }}>Report Type</InputLabel>
                <Select
                  value={selectedReportType}
                  label="Report Type"
                  onChange={handleReportTypeChange}
                  sx={{
                    backgroundColor: "rgb(51, 51, 51)",
                    color: "#b3b3cc",
                  }}
                >
                  <MenuItem value="">All Reports</MenuItem>
                  {selectedDepartment &&
                    reportTypesByDepartment[selectedDepartment]?.map(
                      (reportType) => (
                        <MenuItem key={reportType} value={reportType}>
                          {reportType}
                        </MenuItem>
                      )
                    )}
                </Select>
              </FormControl>
            </Grid>

            {/* Vis Type Filter */}
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#b3b3cc" }}>
                  Visualization Type
                </InputLabel>
                <Select
                  value={selectedVisType}
                  label="Chart Type"
                  onChange={handleVisTypeChange}
                  sx={{
                    backgroundColor: "rgb(51, 51, 51)",
                    color: "#b3b3cc",
                  }}
                >
                  <MenuItem value="">All Visualizations</MenuItem>
                  <MenuItem value={"Bar Chart"}>Bar Chart</MenuItem>
                  <MenuItem value={"Pie Chart"}>Pie Chart</MenuItem>
                  <MenuItem value={"Line Graph"}>Line Graph</MenuItem>
                  <MenuItem value={"scatter Plot"}>Scatter Plot</MenuItem>
                  <MenuItem value={"Heatmap"}>Heatmap</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/*Time Range */}
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#b3b3cc" }}>Time Range</InputLabel>
                <Select
                  value={selectedTimeRange}
                  label="Time Range"
                  onChange={handleTimeRangeChange}
                  sx={{
                    backgroundColor: "rgb(51, 51, 51)",
                    color: "#b3b3cc",
                  }}
                >
                  <MenuItem value="">All Time</MenuItem>
                  {/* "Daily", "Weekly", "Monthly", "Quarterly", "Yearly", */}
                  <MenuItem value={"Daily"}>Daily</MenuItem>
                  <MenuItem value={"Weekly"}>Weekly</MenuItem>
                  <MenuItem value={"Monthly"}>Monthly</MenuItem>
                  <MenuItem value={"Quarterly"}>Quarterly</MenuItem>
                  <MenuItem value={"Yearly"}>Yearly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {/* Cards Section */}
        <Grid container spacing={2}>
          {filteredCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{ backgroundColor: "rgb(51, 50, 50)", color: "#b3b3cc" }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#007bff" }}>
                    {card.chatLogName}
                  </Typography>
                  <Typography>Department: {card.department}</Typography>
                  <Typography>Asked By: {card.askedBy}</Typography>
                  <Typography>Report Type: {card.type}</Typography>
                  <Typography>
                    Visualization Type: {card.visualizationType}
                  </Typography>
                  <Typography>Time Range: {card.timeRange}</Typography>
                  <br></br>
                  <Typography variant="body2">{card.summary}</Typography>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#0056b3", marginTop: 2 }}
                    fullWidth
                  >
                    View Conversation
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
