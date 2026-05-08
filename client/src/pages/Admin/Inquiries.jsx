import React, { useState, useEffect } from 'react';
import { getInquiries, updateInquiryStatus } from '../../utils/apifetch';
import { toast } from 'react-hot-toast';
import { Mail, Phone, MapPin, Calendar, Clock, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data } = await getInquiries();
      setInquiries(data);
    } catch (error) {
      toast.error('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateInquiryStatus(id, status);
      toast.success(`Inquiry status updated to ${status}`);
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-medium text-gray-800 uppercase tracking-widest">Product Inquiries</h1>
          <p className="text-xs text-gray-400 font-poppins uppercase tracking-widest mt-1">Customer questions and requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {inquiries.length > 0 ? (
          inquiries.map((inquiry) => (
            <div key={inquiry._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  {/* Customer Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{inquiry.name}</h3>
                        <p className="text-xs text-maroon font-bold uppercase tracking-widest mt-1">
                          Inquiry for: <span className="text-gray-600">{inquiry.productName}</span>
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        inquiry.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        inquiry.status === 'Replied' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {inquiry.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-gray-500">
                        <Mail className="w-4 h-4 text-luxury-gold" />
                        <span className="text-xs font-medium">{inquiry.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500">
                        <Phone className="w-4 h-4 text-luxury-gold" />
                        <span className="text-xs font-medium">{inquiry.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500">
                        <MapPin className="w-4 h-4 text-luxury-gold" />
                        <span className="text-xs font-medium">{inquiry.city}, {inquiry.address}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500">
                        <Calendar className="w-4 h-4 text-luxury-gold" />
                        <span className="text-xs font-medium">{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Message:</p>
                      <p className="text-sm text-gray-700 italic leading-relaxed">"{inquiry.message}"</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 justify-end">
                    {inquiry.status === 'Pending' && (
                      <button 
                        onClick={() => handleStatusChange(inquiry._id, 'Replied')}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <Mail className="w-3 h-3" /> Mark Replied
                      </button>
                    )}
                    {inquiry.status !== 'Closed' && (
                      <button 
                        onClick={() => handleStatusChange(inquiry._id, 'Closed')}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all"
                      >
                        <CheckCircle className="w-3 h-3" /> Close Inquiry
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-display font-medium text-gray-800 uppercase tracking-widest">No Inquiries Found</h3>
            <p className="text-sm text-gray-400 font-poppins mt-2 uppercase tracking-widest">Sab shant hai! Customers ne koi inquiry nahi ki hai.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inquiries;
