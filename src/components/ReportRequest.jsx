import React, { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, ListItemIcon, Typography, TextField, Button, Grid, Card, CardContent, IconButton, FormControl, InputLabel, Select, MenuItem, } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';


const ReportRequest = ({ }) => {

    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    //const [filters] = useState(['Bar Chart', 'Profit/Loss Report', 'Revenue Summary']); // Static filters for now
    const [filterVisible, setFilterVisible] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedReportType, setSelectedReportType] = useState("");
    const [selectedVisType, setSelectedVisType] = useState(""); // Chart type state
    const [selectedTimeRange, setSelectedTimeRange] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cards, setCards] = useState([
        {
            chatLogName: "Log 1",
            department: "Finance",
            askedBy: "Sushma",
            summary: "Summary of the finance report generation process.",
        },
        {
            chatLogName: "Log 2",
            department: "IT",
            askedBy: "Priya",
            summary: "Technical details about server setup.",
        },
    ]);

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

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch("http://localhost:6001/api/getAllReports", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch reports");
                }

                const data = await response.json();
                setReports(data.reports);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const [selectedCard, setSelectedCard] = useState(null);
    const [newMessage, setNewMessage] = useState("");

    const handleViewConversation = (card) => {
        setSelectedCard(card);
    };

    const handleBack = () => {
        setSelectedCard(null); // Reset selected card to go back to the grid
    };

    const handleSendReply = async () => {
        try {
            const response = await fetch(`http://localhost:6001/api/sendReply/${selectedCard._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ comment: newMessage }),
            });

            if (response.ok) {
                const updatedReport = await response.json();
                setSelectedCard(updatedReport); // Update the selected report
                setNewMessage(""); // Clear the reply input
                alert("Reply sent, report sent for resubmition");
            } else {
                alert("Failed to send reply");
            }
        } catch (error) {
            console.error("Error sending reply:", error);
            alert("Error sending reply");
        }
    };


    const handleAccept = async () => {
        try {
            const response = await fetch(`http://localhost:6001/api/accept/${selectedCard._id}`, {
                method: "PUT",
                credentials: "include",
            });

            if (response.ok) {
                const updatedReport = await response.json();
                setSelectedCard(updatedReport); // Update the selected report
                alert("Report Accepted");
            } else {
                alert("Failed to accept the report");
            }
        } catch (error) {
            console.error("Error accepting report:", error);
            alert("Error accepting report");
        }
    };

    const handleReject = async () => {
        try {
            const response = await fetch(`http://localhost:6001/api/reject/${selectedCard._id}`, {
                method: "PUT",
                credentials: "include",
            });

            if (response.ok) {
                const updatedReport = await response.json();
                setSelectedCard(updatedReport); // Update the selected report
                alert("Report Rejected");
            } else {
                alert("Failed to reject the report");
            }
        } catch (error) {
            console.error("Error rejecting report:", error);
            alert("Error rejecting report");
        }
    };



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

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
        console.log("hello ",selectedStatus);
    }

    const toggleFilterVisibility = () => {
        setFilterVisible((prev) => !prev);
    };

    const filteredReports = reports.filter((card) => {
        const matchesSearch =
            card.conversationHistory.logName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.summary.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDepartment = selectedDepartment
            ? card.department === selectedDepartment
            : true;

        const matchesReportType = selectedReportType
            ? card.reportType === selectedReportType
            : true;

        const matchesVisType = selectedVisType
            ? card.visualization.toLowerCase() === selectedVisType.toLowerCase()
            : true;

        const matchesTimeRange = selectedTimeRange
            ? card.timeRange === selectedTimeRange
            : true;

        const matchesStatus = selectedStatus
            ? card.status === selectedStatus : true;

        return (
            matchesSearch &&
            matchesDepartment &&
            matchesReportType &&
            matchesVisType &&
            matchesTimeRange &&
            matchesStatus
        );
    });




    return <Box sx={{ flex: 1, padding: 3, color: "#b3b3cc" }}>
        <Typography variant="h4" sx={{ marginBottom: 2, color: "#ffffff" }}>
            Reports Request Received
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
                <Grid item xs={2}>
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

                <Grid item xs={2}>
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
                <Grid item xs={2}>
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
                <Grid item xs={2}>
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

                {/*Status */}
                <Grid item xs={2}>
                    <FormControl fullWidth>
                        <InputLabel sx={{ color: "#b3b3cc" }}>Status</InputLabel>
                        <Select
                            value={selectedStatus}
                            label="Status"
                            onChange={handleStatusChange}
                            sx={{
                                backgroundColor: "rgb(51, 51, 51)",
                                color: "#b3b3cc",
                            }}
                        >
                            <MenuItem value="">All Status</MenuItem>
                            <MenuItem value={"pending"}>Pending to review</MenuItem>
                            <MenuItem value={"Accepted"}>Accepted</MenuItem>
                            <MenuItem value={"resubmit"}>Sent for resubmit</MenuItem>
                            <MenuItem value={"rejected"}>Rejected</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        )}

        {/* Cards Section */}
        <div>
            {selectedCard ? (
                <Card
                    sx={{
                        padding: 2,
                        backgroundColor: "rgb(51, 50, 50)",
                        color: "#b3b3cc",
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h6"
                            sx={{ color: "#ffffff", marginBottom: 2 }}
                        >
                            {selectedCard.summary}
                        </Typography>
                        {/* Mocked previous comments */}
                        <Box sx={{ marginBottom: 2 }}>
                            {selectedCard.previousComments?.map((comment, idx) => (
                                <Typography
                                    key={idx}
                                    variant="body2"
                                    sx={{ marginBottom: 1 }}
                                >
                                    {comment}
                                </Typography>
                            ))}
                        </Box>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            placeholder="Enter your reply..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            sx={{
                                marginBottom: 2,
                                "& .MuiOutlinedInput-root": {
                                    "& ::placeholder": {
                                        color: "white", // Set placeholder color to white
                                        opacity: 1, // Ensure full opacity for visibility
                                    }, "& .MuiInputBase-input": {
                                        color: "white", // Set text color to white
                                    },
                                },
                            }}
                            disabled={selectedCard.status === "Accepted"}
                        />

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "#28a745" }}
                                onClick={handleAccept}
                                disabled={selectedCard.status === "Accepted"}
                            >
                                Accept
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "#dc3545" }}
                                onClick={handleReject}
                                disabled={selectedCard.status === "Accepted"}
                            >
                                Reject
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "#0056b3" }}
                                onClick={handleSendReply}
                                disabled={selectedCard.status === "Accepted"}
                            >
                                Send Reply
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ color: "#007bff", borderColor: "#007bff" }}
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={2} sx={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
                    {
                        filteredReports.map((card, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card
                                        sx={{
                                            backgroundColor: "rgb(51, 50, 50)",
                                            color: "#b3b3cc",
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="h6" sx={{ color: "#ffffff" }}>
                                                {card.conversationHistory.logName}
                                            </Typography>
                                            <Typography>Department: {card.department}</Typography>
                                            <Typography>Asked By: {card.conversationHistory.userEmail}</Typography>
                                            <Typography variant="body2">{card.summary}</Typography>
                                            <Button
                                                variant="contained"
                                                sx={{ backgroundColor: "#007bff", marginTop: 2 }}
                                                fullWidth
                                                onClick={() => handleViewConversation(card)}
                                            >
                                                View
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                </Grid>
            )}
        </div>
    </Box>;
}

export default ReportRequest;