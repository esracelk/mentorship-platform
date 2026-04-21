import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Settings, Save, Loader2, Edit3, Building, MapPin, Briefcase, GraduationCap, Link as LinkIcon, BadgeAlert, CheckCircle2, UserCircle } from 'lucide-react';

const Profile = () => {
    const { role } = useAuth();
    const isAlumni = role === 'ALUMNI';

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        aboutMe: '',
        skills: '',

        currentCompany: '',
        currentTitle: '',
        yearsOfExperience: '',
        graduationYear: '',

        department: '',
        grade: '',
        experience: '',
        employmentStatus: 'UNEMPLOYED',

        linkedinUrl: ''
    });

    useEffect(() => {
        const fetchMyProfile = async () => {
            try {
                const endpoint = isAlumni ? '/alumni/me' : '/profiles/student/me';
                const response = await api.get(endpoint);
                const data = response.data;

                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    aboutMe: data.aboutMe || '',
                    skills: data.skills ? data.skills.join(', ') : '',

                    currentCompany: data.currentCompany || '',
                    currentTitle: data.currentTitle || '',
                    yearsOfExperience: data.yearsOfExperience || '',
                    graduationYear: data.graduationYear || '',

                    department: data.department || '',
                    grade: data.grade || '',
                    experience: data.experience || '',
                    employmentStatus: data.employmentStatus || 'UNEMPLOYED',

                    linkedinUrl: data.linkedinUrl || ''
                });
            } catch (err) {
                console.error("Profil yüklenemedi", err);
                setError("Profil bilgileri yüklenirken bir sorun oluştu.");
            } finally {
                setPageLoading(false);
            }
        };
        fetchMyProfile();
    }, [isAlumni]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            if (isAlumni) {
                await api.put('/alumni/update', {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    aboutMe: formData.aboutMe,
                    skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
                    currentCompany: formData.currentCompany,
                    currentTitle: formData.currentTitle,
                    yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience, 10) : null,
                    graduationYear: formData.graduationYear ? parseInt(formData.graduationYear, 10) : null,
                    linkedinUrl: formData.linkedinUrl
                });
            } else {
                await api.put('/profiles/student/update-profile', {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    aboutMe: formData.aboutMe,
                    skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
                    department: formData.department,
                    grade: formData.grade,
                    experience: formData.experience,
                    employmentStatus: formData.employmentStatus,
                    linkedinUrl: formData.linkedinUrl
                });
            }
            setSuccessMessage('Profiliniz başarıyla güncellendi!');
            setIsEditing(false); // Switch back to view mode
        } catch (err) {
            console.error(err);
            setError('Hesap güncellenirken bir hata oluştu. Lütfen formatları kontrol edin.');
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <UserCircle className="w-9 h-9 text-blue-600" />
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Profilim</h1>
                        <p className="text-gray-500 mt-1">{isAlumni ? 'Mentor' : 'Öğrenci'} Özgeçmişiniz ve Kariyer Detaylarınız</p>
                    </div>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center justify-center px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-medium shadow-md shadow-gray-900/20"
                    >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Profili Düzenle
                    </button>
                )}
            </div>

            {successMessage && (
                <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-4 rounded-xl flex items-center shadow-sm">
                    <CheckCircle2 className="w-6 h-6 mr-3 flex-shrink-0" />
                    <span className="font-medium">{successMessage}</span>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-4 rounded-xl flex items-center shadow-sm">
                    <BadgeAlert className="w-6 h-6 mr-3 flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {!isEditing ? (
                // --- VIEW MODE ---
                <div className="bg-white/60 backdrop-blur-3xl shadow-xl rounded-3xl p-8 border border-white/40 space-y-8">
                    <div className="flex items-start gap-6 border-b pb-6 border-gray-200/50">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-1 flex-shrink-0 shadow-lg">
                            <img src={`https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=ffffff&color=4f46e5`} alt="Avatar" className="w-full h-full rounded-full border-2 border-white object-cover" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-3xl font-bold text-gray-900">{formData.firstName} {formData.lastName}</h2>
                            <p className="text-lg text-blue-600 font-medium">
                                {isAlumni ? (formData.currentTitle || 'Pozisyon Belli Değil') : (formData.department || 'Bölüm Belli Değil')}
                            </p>
                            {formData.linkedinUrl && (
                                <a href={formData.linkedinUrl.startsWith('http') ? formData.linkedinUrl : `https://${formData.linkedinUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm text-blue-500 hover:text-blue-700 mt-2 font-medium">
                                    <LinkIcon className="w-4 h-4 mr-1" /> LinkedIn Profili
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold text-gray-400 uppercase tracking-wider text-sm mb-3">Hakkımda</h3>
                            <p className="text-gray-800 leading-relaxed bg-white/50 p-4 rounded-xl border border-gray-100">
                                {formData.aboutMe || <span className="italic text-gray-400">Henüz hakkımda bilgisi girilmemiş.</span>}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-400 uppercase tracking-wider text-sm mb-3">Yetenekler</h3>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills ? formData.skills.split(',').map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                                        {skill.trim()}
                                    </span>
                                )) : <span className="italic text-gray-400 ml-4">Yetenek eklenmemiş.</span>}
                            </div>
                        </div>

                        {/* Role Specific Details Section */}
                        <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-200/50">
                            <h3 className="font-semibold text-gray-400 uppercase tracking-wider text-sm mb-3">
                                {isAlumni ? 'Kariyer Detayları' : 'Akademik Durum'}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {isAlumni ? (
                                    <>
                                        <div className="bg-white/50 p-4 rounded-2xl border border-gray-100">
                                            <Building className="w-5 h-5 text-gray-400 mb-2" />
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Şirket</p>
                                            <p className="font-bold text-gray-900 mt-0.5 truncate">{formData.currentCompany || '-'}</p>
                                        </div>
                                        <div className="bg-white/50 p-4 rounded-2xl border border-gray-100">
                                            <Briefcase className="w-5 h-5 text-gray-400 mb-2" />
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Deneyim</p>
                                            <p className="font-bold text-gray-900 mt-0.5">{formData.yearsOfExperience ? `${formData.yearsOfExperience} Yıl` : '-'}</p>
                                        </div>
                                        <div className="bg-white/50 p-4 rounded-2xl border border-gray-100">
                                            <GraduationCap className="w-5 h-5 text-gray-400 mb-2" />
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Mezuniyet Yılı</p>
                                            <p className="font-bold text-gray-900 mt-0.5">{formData.graduationYear || '-'}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-white/50 p-4 rounded-2xl border border-gray-100">
                                            <GraduationCap className="w-5 h-5 text-gray-400 mb-2" />
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Bölüm</p>
                                            <p className="font-bold text-gray-900 mt-0.5 truncate">{formData.department || '-'}</p>
                                        </div>
                                        <div className="bg-white/50 p-4 rounded-2xl border border-gray-100">
                                            <UserCircle className="w-5 h-5 text-gray-400 mb-2" />
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Sınıf</p>
                                            <p className="font-bold text-gray-900 mt-0.5">{formData.grade || '-'}</p>
                                        </div>
                                        <div className="bg-white/50 p-4 rounded-2xl border border-gray-100">
                                            <Briefcase className="w-5 h-5 text-gray-400 mb-2" />
                                            <p className="text-xs text-gray-500 uppercase font-semibold">İş Durumu</p>
                                            <p className="font-bold text-gray-900 mt-0.5">
                                                {formData.employmentStatus === 'EMPLOYED' ? 'Çalışıyor' : formData.employmentStatus === 'INTERN' ? 'Stajyer' : 'Öğrenci'}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // --- EDIT MODE ---
                <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-3xl shadow-xl rounded-3xl p-8 border border-gray-200 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center border-b pb-4 mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Profili Düzenle</h3>
                        <button type="button" onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-800 text-sm font-medium">İptal Et</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Adınız</label>
                            <input disabled name="firstName" value={formData.firstName} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed" />
                            <p className="text-xs text-gray-400 mt-1">İsim kayıt sırasında alınır ve güvenlik için değiştirilemez.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Soyadınız</label>
                            <input disabled name="lastName" value={formData.lastName} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Hakkımda</label>
                            <textarea name="aboutMe" value={formData.aboutMe} onChange={handleChange} rows="3" className="w-full p-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Kendinizden kısaca bahsedin..."></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Yetenekler (Virgülle ayırın)</label>
                            <input name="skills" value={formData.skills} onChange={handleChange} placeholder="Örn: Java, Spring Boot, React" className="w-full p-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-blue-500" />
                        </div>

                        {/* Rol Bölümü */}
                        <div className="md:col-span-2 border-t pt-6 mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {isAlumni ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                            <Briefcase className="w-4 h-4 mr-1 text-gray-400" /> Mevcut Pozisyon
                                        </label>
                                        <input name="currentTitle" value={formData.currentTitle} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                            <Building className="w-4 h-4 mr-1 text-gray-400" /> Şirket
                                        </label>
                                        <input name="currentCompany" value={formData.currentCompany} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mezuniyet Yılı</label>
                                        <input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} placeholder="Örn: 2018" className="w-full p-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Deneyim (Yıl)</label>
                                        <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} placeholder="Örn: 5" className="w-full p-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                            <GraduationCap className="w-4 h-4 mr-1 text-gray-400" /> Bölüm / Program
                                        </label>
                                        <input name="department" value={formData.department} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-blue-500" placeholder="Örn: Bilgisayar Mühendisliği" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Sınıf</label>
                                        <input name="grade" value={formData.grade} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-blue-500" placeholder="Örn: 3. Sınıf" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">İş Durumu</label>
                                        <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-blue-500">
                                            <option value="UNEMPLOYED">Öğrenci / Çalışmıyor</option>
                                            <option value="EMPLOYED">Çalışıyor</option>
                                            <option value="INTERN">Stajyer</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mevcut Deneyim</label>
                                        <input name="experience" value={formData.experience} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-blue-500" placeholder="Örn: X Şirketinde Yarı Zamanlı vs." />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                <LinkIcon className="w-4 h-4 mr-1 text-blue-500" /> LinkedIn Profil Linki
                            </label>
                            <input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-blue-500" placeholder="https://linkedin.com/in/..." />
                        </div>
                    </div>

                    <div className="flex gap-4 justify-end pt-4">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                            Değişiklikleri Kaydet
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Profile;
