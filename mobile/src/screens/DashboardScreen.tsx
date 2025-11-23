import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Title, Card, Text, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchTodayJobs } from '../store/slices/jobsSlice';

export default function DashboardScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { todayJobs, loading } = useSelector((state: RootState) => state.jobs);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    dispatch(fetchTodayJobs() as any);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      SCHEDULED: '#3b82f6',
      'IN_PROGRESS': '#f59e0b',
      COMPLETED: '#10b981',
      CANCELLED: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadData} />
      }
    >
      <View style={styles.header}>
        <Title>Welcome, {user?.email}</Title>
        <Text>Today's Schedule</Text>
      </View>

      {todayJobs.map((job) => (
        <Card key={job.id} style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) }]}>
                <Text style={styles.statusText}>{job.status.replace('_', ' ')}</Text>
              </View>
            </View>
            
            <Text style={styles.customer}>{job.customer?.companyName}</Text>
            
            {job.scheduledStart && (
              <Text style={styles.time}>
                {new Date(job.scheduledStart).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            )}
            
            <Text style={styles.description} numberOfLines={2}>
              {job.description}
            </Text>
          </Card.Content>
          
          <Card.Actions>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('JobDetails', { jobId: job.id })}
            >
              View Details
            </Button>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('JobDetails', { jobId: job.id })}
            >
              Start Job
            </Button>
          </Card.Actions>
        </Card>
      ))}

      {todayJobs.length === 0 && (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text style={styles.emptyText}>No jobs scheduled for today</Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  customer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#ef4444',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  emptyCard: {
    margin: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
});
