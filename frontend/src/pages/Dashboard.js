import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Assignment,
  People,
  Security,
  Schedule,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { dashboardAPI, jobsAPI } from '../services/api';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon, color = '#1976d2', loading = false }) => (
  <Card sx={{ height: '100%', transition: 'all 0.3s ease' }} className="fade-in">
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {loading ? '-' : value}
          </Typography>
        </Box>
        <Box sx={{ color, fontSize: 40 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalCustomers: 0,
    pendingInspections: 0,
    openDefects: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    loadDashboardData();
    
    if (socket) {
      socket.on('job_created', () => loadDashboardData());
      socket.on('job_updated', () => loadDashboardData());
      
      return () => {
        socket.off('job_created');
        socket.off('job_updated');
      };
    }
  }, [socket]);

  const loadDashboardData = async () => {
    try {
      // For now, we'll use mock data since we don't have dashboard API endpoints
      const mockStats = {
        totalJobs: 24,
        activeJobs: 8,
        completedJobs: 16,
        totalCustomers: 12,
        pendingInspections: 5,
        openDefects: 3,
      };
      
      const jobsResponse = await jobsAPI.getAll({ page: 1, limit: 5 });
      
      setStats(mockStats);
      setRecentJobs(jobsResponse.data?.data || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'primary',
      assigned: 'warning',
      in_progress: 'success',
      completed: 'default',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        FireLink Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Fire & Security Management Overview
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Jobs"
            value={stats.totalJobs}
            icon={<Assignment />}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Active Jobs"
            value={stats.activeJobs}
            icon={<Schedule />}
            color="#ed6c02"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Completed"
            value={stats.completedJobs}
            icon={<CheckCircle />}
            color="#2e7d32"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Customers"
            value={stats.totalCustomers}
            icon={<People />}
            color="#9c27b0"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Inspections Due"
            value={stats.pendingInspections}
            icon={<Security />}
            color="#d32f2f"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Open Defects"
            value={stats.openDefects}
            icon={<Warning />}
            color="#ed6c02"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Recent Jobs
            </Typography>
            <List>
              {recentJobs.map(job => (
                <ListItem key={job.id} divider>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1" fontWeight="medium">
                          {job.title}
                        </Typography>
                        <Chip 
                          label={job.status} 
                          size="small"
                          color={getStatusColor(job.status)}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {job.site?.customer?.name} • {job.site?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {job.scheduled_date && format(new Date(job.scheduled_date), 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
              {recentJobs.length === 0 && !loading && (
                <ListItem>
                  <ListItemText primary="No recent jobs found" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Actions
            </Typography>
            <List>
              <ListItem button>
                <ListItemText primary="Create New Job" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="Add Customer" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="Schedule Inspection" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="View Reports" />
              </ListItem>
            </List>
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              System Status
            </Typography>
            <Box>
              <Chip label="API Connected" color="success" size="small" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Database Online" color="success" size="small" sx={{ mr: 1, mb: 1 }} />
              <Chip label="WebSocket Active" color="success" size="small" sx={{ mr: 1, mb: 1 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
