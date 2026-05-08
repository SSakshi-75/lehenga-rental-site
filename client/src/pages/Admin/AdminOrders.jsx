import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Check, X, Eye, Phone } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders');
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin orders', error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/orders/${id}/status`, { status });
      fetchOrders();
      if (selectedOrder?._id === id) {
        setSelectedOrder(prev => ({ ...prev, status }));
      }
    } catch (error) {
      alert('Status update failed');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-playfair font-bold text-gray-800">Rental Bookings</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Collection</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-poppins text-sm">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-10">Loading orders...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-10 text-gray-400">No bookings yet.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-[10px] text-gray-400">#{order._id.slice(-8)}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{order.user?.name || 'Deleted User'}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Phone className="w-3 h-3" /> {order.shippingAddress.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {order.orderItems.map((item, idx) => (
                        <img key={idx} src={item.image} className="w-8 h-10 rounded-md border-2 border-white object-cover" title={item.name} alt="" />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-maroon">₹{(order.totalPrice || 0).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      order.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {order.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => updateStatus(order._id, 'Approved')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve Booking"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateStatus(order._id, 'Cancelled')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject Booking"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
                <p className="text-xs text-gray-500 mt-1 font-mono">Order ID: {selectedOrder._id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8 font-poppins">
              {/* Customer & Shipping */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">Customer Information</p>
                  <p className="font-bold text-gray-800 text-lg">{selectedOrder.user?.name || 'Customer'}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.user?.email}</p>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {selectedOrder.shippingAddress.phone}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">Shipping Address</p>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {selectedOrder.shippingAddress.address},<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode},<br />
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4">Rental Items</p>
                <div className="space-y-4">
                  {selectedOrder.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                      <img src={item.image} alt={item.name} className="w-16 h-20 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Size: {item.size} • Qty: {item.qty}</p>
                        <p className="text-maroon font-bold text-sm mt-1">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Payment */}
              <div className="grid grid-cols-2 gap-8 bg-gray-50 p-6 rounded-3xl">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Booking Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                    selectedOrder.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                    selectedOrder.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Total Amount</p>
                  <p className="text-2xl font-bold text-maroon font-playfair">₹{(selectedOrder.totalPrice || 0).toLocaleString()}</p>
                  <p className="text-[10px] text-green-600 font-bold uppercase mt-1">Payment Successful</p>
                </div>
              </div>

              {/* Quick Actions in Modal */}
              {selectedOrder.status === 'Pending' && (
                <div className="flex gap-4">
                  <button 
                    onClick={() => updateStatus(selectedOrder._id, 'Approved')}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" /> Approve Order
                  </button>
                  <button 
                    onClick={() => updateStatus(selectedOrder._id, 'Cancelled')}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" /> Reject Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
