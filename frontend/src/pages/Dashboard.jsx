import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader2, User, Check, X, Clock, MessageSquare } from 'lucide-react';

const Dashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const response = await api.get('/connections/alumni');
                setRequests(response.data);
            } catch (err) {
                console.error("Gelen istekler alınamadı:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConnections();
    }, []);

    const handleAction = async (connectionId, action) => {
        setActionLoading(connectionId);
        try {
            await api.put(`/connections/${connectionId}/${action}`);
            // Update UI optimistically or refetch. Let's update state directly:
            setRequests(requests.map(req =>
                req.id === connectionId ? { ...req, status: action === 'accept' ? 'ACCEPTED' : 'REJECTED' } : req
            ));
        } catch (err) {
            alert(err.response?.data?.message || "İşlem sırasında bir hata oluştu.");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    const pendingRequests = requests.filter(req => req.status === 'PENDING');
    const pastRequests = requests.filter(req => req.status !== 'PENDING');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Gelen Mentorluk İstekleri</h1>
                <p className="text-gray-500 mt-2">Öğrencilerden gelen mentorluk taleplerini yönetin.</p>
            </div>

            <div className="bg-white/50 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-6 md:p-10">
                <h2 className="text-xl font-bold flex items-center mb-6">
                    <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                    Bekleyen İstekler ({pendingRequests.length})
                </h2>

                {pendingRequests.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-300">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">Şu an için bekleyen bir isteğiniz yok.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingRequests.map(req => (
                            <div key={req.id} className="bg-white border border-gray-100/50 shadow-sm rounded-2xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <Link to={`/students/${req.studentId}`} className="font-bold text-blue-600 hover:text-blue-800 transition-colors text-lg inline-flex items-center">
                                            {req.studentName}
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-1">Tarih: {new Date(req.requestedAt).toLocaleDateString('tr-TR')}</p>
                                        {req.message && (
                                            <div className="mt-3 p-3 bg-blue-50/50 text-blue-900 text-sm italic rounded-xl border border-blue-100">
                                                "{req.message}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex w-full md:w-auto gap-3 shrink-0">
                                    <button
                                        disabled={actionLoading === req.id}
                                        onClick={() => handleAction(req.id, 'accept')}
                                        className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                                    >
                                        <Check className="w-4 h-4 mr-2" /> Kabul Et
                                    </button>
                                    <button
                                        disabled={actionLoading === req.id}
                                        onClick={() => handleAction(req.id, 'reject')}
                                        className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition-colors disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4 mr-2" /> Reddet
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {pastRequests.length > 0 && (
                <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-3xl p-6 md:p-10 opacity-75 grayscale-[30%] focus-within:grayscale-0 focus-within:opacity-100 transition-all">
                    <h2 className="text-lg font-bold text-gray-700 mb-6">Geçmiş İşlemler</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pastRequests.map(req => (
                            <div key={req.id} className="bg-gray-50/50 border border-gray-200 rounded-2xl p-4 flex justify-between items-center">
                                <div>
                                    <Link to={`/students/${req.studentId}`} className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                                        {req.studentName}
                                    </Link>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {req.status === 'ACCEPTED' ? 'ONAYLANDI' : 'REDDEDİLDİ'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
