import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
    Loader2, Users, GraduationCap, ChevronRight,
    CalendarCheck, Inbox
} from 'lucide-react';

const MyMentees = () => {
    const [mentees, setMentees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMentees = async () => {
            try {
                const res = await api.get('/connections/alumni/mentees');
                setMentees(res.data);
            } catch (err) {
                console.error('Menteeler alınamadı:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMentees();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Başlık */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                            <Users className="w-6 h-6 text-white" />
                        </span>
                        Menteelerim
                    </h1>
                    <p className="text-gray-500 mt-2 ml-14">
                        Kabul ettiğiniz öğrencilerin listesi. Profil detaylarına ulaşmak için karta tıklayın.
                    </p>
                </div>
                <span className="px-4 py-1.5 bg-blue-100 text-blue-700 font-semibold text-sm rounded-full border border-blue-200">
                    {mentees.length} / 3 Aktif Mentee
                </span>
            </div>

            {/* Kapasite çubuğu */}
            <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                        <span>Mentee kapasitesi</span>
                        <span className="font-semibold text-gray-700">{mentees.length} / 3</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-700 ${
                                mentees.length >= 3
                                    ? 'bg-gradient-to-r from-orange-400 to-red-500'
                                    : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                            }`}
                            style={{ width: `${(mentees.length / 3) * 100}%` }}
                        />
                    </div>
                </div>
                {mentees.length >= 3 && (
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full whitespace-nowrap">
                        Kapasite Dolu
                    </span>
                )}
            </div>

            {/* Mentee Listesi */}
            {mentees.length === 0 ? (
                <div className="bg-white/50 backdrop-blur-md rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                    <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Henüz Menteeniz Yok</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Öğrencilerden gelen mentorluk isteklerini kabul ettiğinizde burada görünecekler.
                    </p>
                    <Link
                        to="/dashboard"
                        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm"
                    >
                        Gelen İsteklere Git
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mentees.map(mentee => (
                        <div
                            key={mentee.id}
                            className="group bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                        >
                            {/* Avatar + İsim */}
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-md flex-shrink-0 text-white font-extrabold text-xl">
                                    {mentee.studentName.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="font-bold text-gray-900 text-lg leading-tight truncate">
                                        {mentee.studentName}
                                    </h2>
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mt-1">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                        Aktif Mentee
                                    </span>
                                </div>
                            </div>

                            {/* Kabul Tarihi */}
                            {mentee.requestedAt && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-gray-50/70 rounded-xl px-3 py-2 border border-gray-100">
                                    <CalendarCheck className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                    <span>
                                        İstek Tarihi: {new Date(mentee.requestedAt).toLocaleDateString('tr-TR', {
                                            day: '2-digit', month: 'long', year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            )}

                            {/* İstek Notu */}
                            {mentee.message && (
                                <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-3 mb-5 flex-1">
                                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                                        Menteenin Notu
                                    </p>
                                    <p className="text-blue-900 text-sm italic line-clamp-3">
                                        "{mentee.message}"
                                    </p>
                                </div>
                            )}

                            {/* Profil Butonu */}
                            <Link
                                to={`/students/${mentee.studentId}`}
                                className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold transition-all duration-300 group-hover:shadow-lg"
                            >
                                <GraduationCap className="w-4 h-4" />
                                Profili Görüntüle
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyMentees;
