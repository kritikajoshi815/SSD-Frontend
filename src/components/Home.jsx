import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemText,ListItemIcon, Typography, TextField, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';

const Home = ({ userRole = 'User',onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters] = useState(['Bar Chart', 'Profit/Loss Report', 'Revenue Summary']); // Static filters for now
  const [cards, setCards] = useState([
    {
      chatLogName: 'Log 1',
      department: 'Finance',
      askedBy: 'Sushma',
      summary: 'Summary of the finance report generation process.',
    },
    {
      chatLogName: 'Log 2',
      department: 'IT',
      askedBy: 'Priya',
      summary: 'Technical details about server setup.',
    },
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Add logic to filter cards dynamically based on search term.
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: 'rgb(34, 34, 34)' }}>
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
          {userRole === 'Admin' && (
            <>
              <ListItem button sx={{ ':hover': { backgroundColor: 'rgb(75, 72, 72)' } }}>
                <ListItemIcon sx={{ color: '#b3b3cc' }}>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Request Received" />
              </ListItem>
              <ListItem button sx={{ ':hover': { backgroundColor: 'rgb(75, 72, 72)' } }}>
                <ListItemIcon sx={{ color: '#b3b3cc' }}>
                  <AssignmentIcon />
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
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home Page" />
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
            justifyContent: 'flex-start',
            textTransform: 'none',
            fontWeight: 'bold',
          }}
          onClick={onLogout}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
      {/* Main Content */}
      <Box sx={{ flex: 1, padding: 3, color: '#b3b3cc' }}>
        <Typography variant="h4" sx={{ marginBottom: 2, color: '#007bff' }}>
          Welcome to Conversation Elicitation Tool 
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            sx={{ flex: 1, backgroundColor: 'rgb(51, 50, 50)', color: '#b3b3cc', marginRight: 1 }}
            onChange={handleSearch}
          />
          <IconButton sx={{ color: '#b3b3cc' }}>
            <SearchIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            sx={{ backgroundColor: '#28a745', marginLeft: 1 }}
          >
            Filter
          </Button>
        </Box>

        {/* Static Filters */}
        <Box sx={{ display: 'flex', gap: 1, marginBottom: 3 }}>
          {filters.map((filter, index) => (
            <Button key={index} variant="outlined" sx={{ color: '#007bff', borderColor: '#007bff' }}>
              {filter}
            </Button>
          ))}
        </Box>

        {/* Cards Section */}
        <Grid container spacing={2}>
          {cards
            .filter(
              (card) =>
                card.chatLogName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                card.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                card.askedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                card.summary.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ backgroundColor: 'rgb(51, 50, 50)', color: '#b3b3cc' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#007bff' }}>
                      {card.chatLogName}
                    </Typography>
                    <Typography>Department: {card.department}</Typography>
                    <Typography>Asked By: {card.askedBy}</Typography>
                    <Typography variant="body2">{card.summary}</Typography>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: '#0056b3', marginTop: 2 }}
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
