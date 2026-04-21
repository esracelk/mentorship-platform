import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Loader2, User } from 'lucide-react';

const Mentors = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const response = await api.get('/alumni');
                setMentors(response.data);
            } catch (err) {
                console.error("Mentorler yüklenirken hata oluştu:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, []);

    const filteredMentors = mentors.filter(m =>
        m.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.currentCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.currentTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mentor Bul</h1>
                    <p className="text-gray-500 mt-1">Sektördeki deneyimli mezunlarımızla bağlantı kurun</p>
                </div>

                <div className="relative w-full md:w-72">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 shadow-sm"
                        placeholder="İsim, Şirket, Pozisyon..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                </div>
            ) : filteredMentors.length === 0 ? (
                <div className="bg-white/50 backdrop-blur-md rounded-2xl p-12 text-center border border-white/20 shadow-sm">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Mentor Bulunamadı</h3>
                    <p className="text-gray-500">Arama kriterlerinize uygun kayıt eşleşmedi.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMentors.map((mentor) => (
                        <div key={mentor.alumniId} className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/40 hover:shadow-2xl hover:scale-[1.02] transition-all flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-1 mb-4 shadow-lg shadow-blue-500/30">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.fullName)}&background=ffffff&color=2563eb`}
                                    alt="Avatar"
                                    className="w-full h-full rounded-full border-2 border-white object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{mentor.fullName}</h3>
                            <p className="text-sm font-medium text-blue-600 mt-1">{mentor.currentTitle || 'Pozisyon Belirtilmemiş'}</p>
                            <p className="text-sm text-gray-500 mb-3">{mentor.currentCompany || 'Şirket Belirtilmemiş'}</p>

                            {mentor.skills && mentor.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-4 justify-center">
                                    {mentor.skills.slice(0, 4).map((skill, index) => (
                                        <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold border border-blue-100">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="mt-auto w-full">
                                <Link
                                    to={`/mentors/${mentor.alumniId}`}
                                    className="block w-full py-2.5 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors"
                                >
                                    Profili İncele
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Mentors;
