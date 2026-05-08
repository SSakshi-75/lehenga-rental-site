import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, ShoppingBag, PlusCircle, Users, Settings, Package, Bell, Search, LogOut, ArrowLeft, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { adminLogout } = useAuth();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [pendingInquiries, setPendingInquiries] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [{ data: orders }, { data: inquiries }] = await Promise.all([
          axios.get('/api/orders'),
          axios.get('/api/inquiries')
        ]);
        
        const pendingO = Array.isArray(orders) ? orders.filter(o => o.status === 'Pending') : [];
        const pendingI = Array.isArray(inquiries) ? inquiries.filter(i => i.status === 'Pending') : [];
        
        setPendingOrders(pendingO);
        setPendingInquiries(pendingI);
        setPendingCount(pendingO.length + pendingI.length);
      } catch (error) {
        console.error('Error fetching notifications', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/rani-manager', icon: LayoutDashboard },
    { name: 'Rental Bookings', path: '/rani-manager/orders', icon: Package },
    { name: 'Product Inquiries', path: '/rani-manager/inquiries', icon: MessageCircle },
    { name: 'Inventory Control', path: '/rani-manager/inventory', icon: ShoppingBag },
    { name: 'Add Collection', path: '/rani-manager/add-product', icon: PlusCircle },
    { name: 'User Management', path: '/rani-manager/users', icon: Users },
    { name: 'Content Management', path: '/rani-manager/content', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-poppins font-black text-maroon flex items-center gap-2">
            <span className="text-gold text-2xl">⚡</span> AUTHORITY
          </h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-poppins text-sm ${
                location.pathname === item.path
                  ? 'bg-maroon text-white shadow-md'
                  : 'text-gray-600 hover:bg-red-50 hover:text-maroon'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-4">
          <Link to="/" className="flex items-center gap-2 text-xs text-gray-400 hover:text-maroon font-poppins transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Back to Storefront
          </Link>
          <button 
            onClick={adminLogout}
            className="flex items-center gap-2 w-full text-left text-xs text-red-400 hover:text-red-600 font-bold uppercase tracking-widest transition-colors"
          >
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-8 flex-1">
            <h1 className="text-lg font-poppins font-bold text-gray-800 uppercase tracking-widest hidden lg:block">
              {menuItems.find(item => item.path === location.pathname)?.name || 'Admin'}
            </h1>
            <div className="relative max-w-md w-full">
              <input 
                type="text" 
                placeholder="Search rentals, customers, orders..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-full px-10 py-2 text-sm focus:ring-1 focus:ring-maroon outline-none"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-gray-400 hover:text-maroon transition-colors group p-2 rounded-full hover:bg-gray-100"
              >
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {pendingCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-xl shadow-red-600/40 font-black border-2 border-white">
                    {pendingCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Notifications</h3>
                    <span className="bg-maroon text-white text-[8px] px-2 py-0.5 rounded-full font-bold">{pendingCount} NEW</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {pendingOrders.length > 0 || pendingInquiries.length > 0 ? (
                      <>
                        {/* Orders */}
                        {pendingOrders.map((order) => (
                          <Link
                            key={order._id}
                            to="/rani-manager/orders"
                            onClick={() => setShowNotifications(false)}
                            className="flex items-center gap-4 p-4 hover:bg-red-50/50 transition-colors border-b border-gray-50 last:border-0"
                          >
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700">
                              <ShoppingBag className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800">New Booking: {order.user?.name || 'Customer'}</p>
                              <p className="text-[10px] text-gray-400 font-mono italic">#{order._id.slice(-6).toUpperCase()}</p>
                            </div>
                          </Link>
                        ))}
                        {/* Inquiries */}
                        {pendingInquiries.map((inquiry) => (
                          <Link
                            key={inquiry._id}
                            to="/rani-manager/inquiries"
                            onClick={() => setShowNotifications(false)}
                            className="flex items-center gap-4 p-4 hover:bg-red-50/50 transition-colors border-b border-gray-50 last:border-0"
                          >
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                              <MessageCircle className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800">New Inquiry: {inquiry.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono italic">Re: {inquiry.productName}</p>
                            </div>
                          </Link>
                        ))}
                      </>
                    ) : (
                      <div className="p-10 text-center">
                        <p className="text-sm text-gray-400">Sab sahi hai! Koi naya update nahi hai.</p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 border-t border-gray-100">
                    <Link 
                      to="/rani-manager/orders" 
                      onClick={() => setShowNotifications(false)}
                      className="p-4 text-center text-[8px] font-black uppercase tracking-widest text-maroon hover:bg-gray-50 transition-colors border-r border-gray-50"
                    >
                      All Bookings
                    </Link>
                    <Link 
                      to="/rani-manager/inquiries" 
                      onClick={() => setShowNotifications(false)}
                      className="p-4 text-center text-[8px] font-black uppercase tracking-widest text-maroon hover:bg-gray-50 transition-colors"
                    >
                      All Inquiries
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 border-l pl-6 border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-800">Sakshi Manager</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-maroon rounded-xl shadow-lg shadow-maroon/20 flex items-center justify-center text-white font-bold">
                S
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
