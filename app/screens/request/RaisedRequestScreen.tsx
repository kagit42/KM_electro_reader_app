import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const mockRequests = [
  {
    id: '1',
    image: require('../../assets/images/home/usageCard.jpg'),
    serviceNo: '1234567890',
    location: 'RR Nagar (Kalyani Motors Nexa)',
    date: '2025-08-14',
    status: 'Pending',
  },
  {
    id: '2',
    image: require('../../assets/images/home/compareCard.jpg'),
    serviceNo: '9876543210',
    location: 'Mysore (Kalyani Motors Nexa)',
    date: '2025-08-10',
    status: 'Approved',
  },
  {
    id: '3',
    image: require('../../assets/images/home/usageCard.jpg'),
    serviceNo: '4561237890',
    location: 'Chennai (Kalyani Motors Nexa)',
    date: '2025-08-05',
    status: 'Rejected',
  },
  {
    id: '4',
    image: require('../../assets/images/home/usageCard.jpg'),
    serviceNo: '1234567890',
    location: 'RR Nagar (Kalyani Motors Nexa)',
    date: '2025-08-14',
    status: 'Pending',
  },
  {
    id: '5',
    image: require('../../assets/images/home/compareCard.jpg'),
    serviceNo: '9876543210',
    location: 'Mysore (Kalyani Motors Nexa)',
    date: '2025-08-10',
    status: 'Approved',
  },
  {
    id: '6',
    image: require('../../assets/images/home/usageCard.jpg'),
    serviceNo: '4561237890',
    location: 'Chennai (Kalyani Motors Nexa)',
    date: '2025-08-05',
    status: 'Rejected',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved':
      return '#4CAF50';
    case 'Pending':
      return '#FFC107';
    case 'Rejected':
      return '#F44336';
    default:
      return '#999';
  }
};

const RaisedRequestScreen = () => {
  const renderItem = ({ item }: { item: (typeof mockRequests)[0] }) => (
    <View style={styles.card}>
      {/* <Image source={item.image} style={styles.meterImage} /> */}
      <View style={styles.cardContent}>
        <View style={styles.row}>
          <Text style={styles.label}>Service No:</Text>
          <Text style={styles.value}>{item.serviceNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <Text style={[styles.value, { flex: 1 }]} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{item.date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>

        <TouchableOpacity style={styles.viewMoreBtn}>
          <Text style={styles.viewMoreText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialIcons name="keyboard-backspace" size={24} color="#4a4a4a" />
        <Text style={styles.header}>Raised Requests</Text>
      </View> */}
      <FlatList
        data={mockRequests}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default RaisedRequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 2,
    flexDirection: 'row',
  },
  meterImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontWeight: '600',
    color: '#555',
    width: 80,
  },
  value: {
    color: '#333',
    fontWeight: '500',
  },
  status: {
    fontWeight: '700',
  },
  viewMoreBtn: {
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    borderRadius: 5,
    marginTop: 8,
    alignItems: 'center',
  },
  viewMoreText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
