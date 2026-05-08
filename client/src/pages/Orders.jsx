import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../utils/apifetch';
import { ShoppingBag, Calendar, MapPin, Tag } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders', error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maroon"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 lg:py-20">
      <h1 className="text-3xl md:text-5xl font-playfair font-bold text-gray-800 mb-12">My Bookings</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <ShoppingBag className="w-16 h-16 text-gray-100 mx-auto mb-6" />
          <p className="text-xl font-playfair text-gray-400">No bookings yet. Your luxury journey awaits!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gold/10 overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 md:px-8 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                <div className="flex gap-6 text-xs font-poppins font-bold text-gray-400 uppercase tracking-widest">
                  <div>
                    <p className="mb-1">Order Date</p>
                    <p className="text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="mb-1">Order ID</p>
                    <p className="text-gray-800">#{order._id.slice(-6)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    order.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-xl font-bold text-maroon">₹{(order.totalPrice || 0).toLocaleString()}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 md:p-8 space-y-6">
                {order.orderItems.map((item, idx) => (
                  <Link 
                    key={idx} 
                    to={`/product/${item.product}`}
                    className="flex flex-col md:flex-row gap-8 items-center md:items-start group cursor-pointer"
                  >
                    <img src={item.image} alt="" className="w-24 h-32 rounded-xl object-cover shadow-md group-hover:scale-[1.02] transition-transform duration-500" />
                    <div className="flex-1 space-y-3">
                      <h3 className="text-2xl font-playfair font-bold text-gray-800 group-hover:text-maroon transition-colors">{item.name}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-poppins">
                          <Tag className="w-4 h-4 text-gold" /> Size: <span className="font-bold text-maroon">{item.size}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-poppins">
                          <Calendar className="w-4 h-4 text-gold" /> {item.days} Days
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-2 text-xs font-poppins font-bold text-gray-400">
                        <Calendar className="w-4 h-4" /> Rental: <span className="text-gray-800">{item.startDate} — {item.endDate}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Order Footer */}
              <div className="px-6 md:px-8 py-4 bg-maroon/5 flex items-center gap-2 text-xs font-poppins text-maroon/60">
                <MapPin className="w-3 h-3" /> Shipping to: <span className="font-bold">{order.shippingAddress.address}, {order.shippingAddress.city}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
