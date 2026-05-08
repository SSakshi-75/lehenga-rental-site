
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const AdminPortal = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: statsData } = await axios.get('/api/admin/stats');
        setStats(statsData);
        
        const { data: ordersData } = await axios.get('/api/orders');
        setRecentOrders(ordersData.slice(0, 4));
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 font-poppins">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Command Center</h1>
          <p className="text-gray-500">Welcome back, Super Admin. Here is your system overview.</p>
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold">
          <ShieldCheck className="w-4 h-4" /> System Online
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Customers" 
          value={stats.totalUsers} 
          icon={Users} 
          color="blue" 
          trend="Registered"
          to="/rani-manager/users"
        />
        <StatCard 
          title="Active Bookings" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          color="maroon" 
          trend="Total"
          to="/rani-manager/orders"
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${(stats.totalRevenue || 0).toLocaleString()}`} 
          icon={IndianRupee} 
          color="gold" 
          trend="Received"
          to="/rani-manager/orders"
        />
        <StatCard 
          title="Pending Approvals" 
          value={stats.pendingOrders} 
          icon={Clock} 
          color="orange" 
          trend="Needs Action"
          to="/rani-manager/orders"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent System Activity</h2>
            <Link to="/rani-manager/orders" className="text-maroon text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-gray-400 py-10 text-center uppercase tracking-widest">No recent activity found</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-maroon/10 rounded-full flex items-center justify-center text-maroon">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Booking Request from {order.user?.name || 'Customer'}</p>
                      <p className="text-xs text-gray-500">Order ID: #{order._id.slice(-6)} • Total: ₹{(order.totalPrice || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Help/Notes */}
        <div className="bg-luxury-gold/10 border border-luxury-gold/20 p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-luxury-black">Manager Notes</h2>
            <p className="text-luxury-muted text-sm mb-6 leading-relaxed">
              Use this dashboard to monitor your rental flow. Keep your inventory updated and manage bookings efficiently.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm font-semibold text-luxury-black">
                <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>
                New bookings require approval
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-luxury-black">
                <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>
                Check inventory for returns
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, trend, to }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    maroon: 'bg-red-50 text-red-600',
    gold: 'bg-yellow-50 text-yellow-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <Link to={to} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group block">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors[color]} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        <TrendingUp className="w-4 h-4 text-green-500" />
      </div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-bold">{trend}</p>
    </Link>
  );
};

export default AdminPortal;
