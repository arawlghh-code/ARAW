import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { useLanguage } from '../context/LanguageContext';
import { LogIn, LogOut, Plus, Trash2, Edit2, Save, X, Settings as SettingsIcon, Image as ImageIcon, Video, FileText, Upload } from 'lucide-react';

export default function Admin() {
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('works');
  const [items, setItems] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(() => {
    return localStorage.getItem('arow_admin_authorized') === 'true';
  });
  const [settings, setSettings] = useState<any>({});
  const [homeContent, setHomeContent] = useState<any>({});
  const [aboutContent, setAboutContent] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    console.log('Admin: Checking auth state...');
    const unsub = onAuthStateChanged(auth, (u) => {
      console.log('Admin: Auth state changed:', u ? 'User logged in' : 'No user');
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user || !isAuthorized) return;
    
    console.log('Admin: Fetching data for tab:', activeTab);
    if (activeTab === 'settings') {
      const unsub = onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data());
        }
      });
      return () => unsub();
    } else if (activeTab === 'content') {
      const unsub = onSnapshot(doc(db, 'settings', 'home'), (docSnap) => {
        if (docSnap.exists()) {
          setHomeContent(docSnap.data());
        }
      });
      return () => unsub();
    } else if (activeTab === 'about') {
      const unsub = onSnapshot(doc(db, 'settings', 'about'), (docSnap) => {
        if (docSnap.exists()) {
          setAboutContent(docSnap.data());
        }
      });
      return () => unsub();
    } else {
      const q = query(collection(db, activeTab), orderBy('sortOrder', 'asc'));
      const unsub = onSnapshot(q, (snapshot) => {
        setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (err) => {
        console.error('Admin: Firestore error:', err);
      });
      return () => unsub();
    }
  }, [user, isAuthorized, activeTab]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Admin: Verifying password...');
    if (password === '1111') {
      console.log('Admin: Password correct');
      setIsAuthorized(true);
      localStorage.setItem('arow_admin_authorized', 'true');
    } else {
      console.log('Admin: Password incorrect');
      alert('Incorrect password');
    }
  };

  const handleLogin = async () => {
    try {
      console.log('Admin: Starting Google login...');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log('Admin: Login successful');
    } catch (err) {
      console.error('Admin: Login failed:', err);
      alert('Login failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setIsAuthorized(false);
    localStorage.removeItem('arow_admin_authorized');
    setPassword('');
  };

  const handleFileUpload = async (file: File, path: string) => {
    try {
      setUploading(true);
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setUploading(false);
      return url;
    } catch (err) {
      console.error('Admin: Upload failed:', err);
      setUploading(false);
      alert('Upload failed');
      return null;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: any = {};
    formData.forEach((value, key) => {
      if (key === 'featured') data[key] = value === 'on';
      else if (key === 'sortOrder') data[key] = parseInt(value as string);
      else data[key] = value;
    });

    try {
      if (activeTab === 'settings') {
        await setDoc(doc(db, 'settings', 'general'), data);
        alert('Settings saved');
      } else if (activeTab === 'content') {
        await setDoc(doc(db, 'settings', 'home'), data);
        alert('Home content saved');
      } else if (activeTab === 'about') {
        await setDoc(doc(db, 'settings', 'about'), data);
        alert('About content saved');
      } else if (editingItem) {
        await updateDoc(doc(db, activeTab, editingItem.id), data);
        setEditingItem(null);
      } else {
        await addDoc(collection(db, activeTab), { ...data, createdAt: serverTimestamp() });
        setIsAdding(false);
      }
    } catch (err) {
      console.error('Admin: Save failed:', err);
      alert('Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      await deleteDoc(doc(db, activeTab, id));
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!user || !isAuthorized) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 bg-black text-white">
        <h1 className="text-4xl font-bold tracking-tighter uppercase mb-8">Admin Access</h1>
        {!user ? (
          <button 
            onClick={handleLogin}
            className="flex items-center space-x-2 bg-purple-point text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-purple-dark transition-colors"
          >
            <LogIn size={16} />
            <span>Login with Google</span>
          </button>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="w-full max-w-xs space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-purple-point text-center tracking-widest"
              autoFocus
            />
            <button 
              type="submit"
              className="w-full bg-purple-point text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-black transition-colors"
            >
              Verify
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 px-6 container mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter uppercase">Dashboard</h1>
        <button onClick={handleLogout} className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100">
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>

      <div className="flex space-x-8 border-b border-black/10 mb-12 overflow-x-auto">
        {['works', 'brands', 'leads', 'content', 'about', 'settings'].map(tab => (
          <button 
            key={tab}
            onClick={() => { setActiveTab(tab); setEditingItem(null); setIsAdding(false); }}
            className={`pb-4 uppercase tracking-widest text-[10px] font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-purple-point text-purple-point' : 'opacity-30'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'settings' ? (
        <div className="max-w-4xl">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-8">Site Settings</h2>
          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 md:col-span-2 p-6 bg-gray-50 border border-black/5">
                <label className="text-[10px] uppercase tracking-widest font-bold block mb-2">Logo Branding</label>
                <div className="flex items-center space-x-6">
                  {settings?.logoUrl && (
                    <div className="w-24 h-24 bg-white border border-black/10 flex items-center justify-center p-2">
                      <img src={settings.logoUrl} alt="Current Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] opacity-50 uppercase">Upload New Logo (Local Image)</p>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file, 'branding');
                            if (url) {
                              await setDoc(doc(db, 'settings', 'general'), { ...settings, logoUrl: url });
                              alert('Logo updated');
                            }
                          }
                        }}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label 
                        htmlFor="logo-upload"
                        className="flex items-center space-x-2 bg-white border border-black/10 px-4 py-2 text-[10px] uppercase font-bold cursor-pointer hover:bg-purple-point hover:text-white transition-all w-fit"
                      >
                        <Upload size={14} />
                        <span>{uploading ? 'Uploading...' : 'Select Image'}</span>
                      </label>
                    </div>
                    <input name="logoUrl" defaultValue={settings?.logoUrl} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point text-xs opacity-50" placeholder="Or enter URL manually" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40">Hero Video URL (Direct Link)</label>
                <input name="heroVideoUrl" defaultValue={settings?.heroVideoUrl} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40">Email</label>
                <input name="email" defaultValue={settings?.email} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40">Phone</label>
                <input name="phone" defaultValue={settings?.phone} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40">Instagram URL</label>
                <input name="instagram" defaultValue={settings?.instagram} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40">Vimeo URL</label>
                <input name="vimeo" defaultValue={settings?.vimeo} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40">Behance URL</label>
                <input name="behance" defaultValue={settings?.behance} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40">LinkedIn URL</label>
                <input name="linkedin" defaultValue={settings?.linkedin} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
              </div>
            </div>
            <button type="submit" className="bg-black text-white px-12 py-4 uppercase tracking-widest text-xs font-bold hover:bg-purple-point transition-colors">
              Save Settings
            </button>
          </form>
        </div>
      ) : activeTab === 'content' ? (
        <div className="max-w-6xl">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-8">Home Page Content (Korean & English)</h2>
          <form onSubmit={handleSave} className="space-y-12">
            <div className="space-y-8">
              <div className="p-8 bg-gray-50 border border-black/5 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest border-b border-black/10 pb-2">About Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-purple-point uppercase tracking-widest">Korean (한국어)</p>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest opacity-40">Intro One-liner</label>
                      <input name="intro_kr" defaultValue={homeContent?.intro_kr} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest opacity-40">About Description</label>
                      <textarea name="about_kr" defaultValue={homeContent?.about_kr} rows={6} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point resize-none" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-purple-point uppercase tracking-widest">English (영어)</p>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest opacity-40">Intro One-liner</label>
                      <input name="intro_en" defaultValue={homeContent?.intro_en} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest opacity-40">About Description</label>
                      <textarea name="about_en" defaultValue={homeContent?.about_en} rows={6} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point resize-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 border border-black/5 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest border-b border-black/10 pb-2">Career Section (LG H&H)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-purple-point uppercase tracking-widest">Korean (한국어)</p>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest opacity-40">Position</label>
                      <input name="career_position_kr" defaultValue={homeContent?.career_position_kr} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest opacity-40">Achievement 1</label>
                      <input name="achievement_1_kr" defaultValue={homeContent?.achievement_1_kr} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest opacity-40">Achievement 2</label>
                      <input name="achievement_2_kr" defaultValue={homeContent?.achievement_2_kr} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest opacity-40">Achievement 3</label>
                      <input name="achievement_3_kr" defaultValue={homeContent?.achievement_3_kr} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-purple-point uppercase tracking-widest">English (영어)</p>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest opacity-40">Position</label>
                      <input name="career_position_en" defaultValue={homeContent?.career_position_en} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest opacity-40">Achievement 1</label>
                      <input name="achievement_1_en" defaultValue={homeContent?.achievement_1_en} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest opacity-40">Achievement 2</label>
                      <input name="achievement_2_en" defaultValue={homeContent?.achievement_2_en} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest opacity-40">Achievement 3</label>
                      <input name="achievement_3_en" defaultValue={homeContent?.achievement_3_en} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest opacity-40">Period (Global)</label>
                    <input name="career_period" defaultValue={homeContent?.career_period} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 border border-black/5 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest border-b border-black/10 pb-2">Footer & Global Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest opacity-40">Owner Name</label>
                    <input name="owner_name" defaultValue={homeContent?.owner_name} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest opacity-40">Portfolio Link URL</label>
                    <input name="portfolio_url" defaultValue={homeContent?.portfolio_url} className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point" />
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" className="bg-black text-white px-12 py-4 uppercase tracking-widest text-xs font-bold hover:bg-purple-point transition-colors">
              Save Home Content
            </button>
          </form>
        </div>
      ) : activeTab === 'about' ? (
        <div className="max-w-4xl">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-8">About Page Content</h2>
          <form onSubmit={handleSave} className="space-y-12">
            <div className="space-y-8">
              <div className="p-8 bg-gray-50 border border-black/5 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest border-b border-black/10 pb-2">Hero Section</h3>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest opacity-40">Hero Video URL (MP4)</label>
                  <div className="flex items-center space-x-4">
                    <input 
                      name="heroVideoUrl" 
                      defaultValue={aboutContent?.heroVideoUrl} 
                      className="flex-1 border-b border-black/10 py-2 outline-none focus:border-purple-point text-sm" 
                      placeholder="https://example.com/video.mp4"
                    />
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="video/mp4"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file, 'about');
                            if (url) {
                              await setDoc(doc(db, 'settings', 'about'), { ...aboutContent, heroVideoUrl: url });
                              alert('Hero video updated');
                            }
                          }
                        }}
                        className="hidden"
                        id="about-hero-video-upload"
                      />
                      <label 
                        htmlFor="about-hero-video-upload"
                        className="flex items-center space-x-2 bg-black text-white px-4 py-2 text-[10px] uppercase font-bold cursor-pointer hover:bg-purple-point transition-all"
                      >
                        <Upload size={14} />
                        <span>{uploading ? '...' : 'Upload Video'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 border border-black/5 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest border-b border-black/10 pb-2">Gallery Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest opacity-40">Image {idx + 1}</label>
                      {aboutContent?.images?.[idx] && (
                        <div className="aspect-square bg-white border border-black/10 flex items-center justify-center p-2 overflow-hidden">
                          <img src={aboutContent.images[idx]} alt={`About ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file, 'about');
                              if (url) {
                                const newImages = [...(aboutContent?.images || [])];
                                newImages[idx] = url;
                                await setDoc(doc(db, 'settings', 'about'), { ...aboutContent, images: newImages });
                                alert(`Image ${idx + 1} updated`);
                              }
                            }
                          }}
                          className="hidden"
                          id={`about-upload-${idx}`}
                        />
                        <label 
                          htmlFor={`about-upload-${idx}`}
                          className="flex items-center justify-center space-x-2 bg-white border border-black/10 px-4 py-2 text-[10px] uppercase font-bold cursor-pointer hover:bg-purple-point hover:text-white transition-all w-full"
                        >
                          <Upload size={14} />
                          <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                        </label>
                      </div>
                      <input 
                        name={`image_${idx}`} 
                        defaultValue={aboutContent?.images?.[idx]} 
                        className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point text-[10px] opacity-50" 
                        placeholder="Or enter URL"
                        onChange={(e) => {
                          const newImages = [...(aboutContent?.images || [])];
                          newImages[idx] = e.target.value;
                          setAboutContent({ ...aboutContent, images: newImages });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-gray-50 border border-black/5 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest border-b border-black/10 pb-2">Why ARAW Section Image</h3>
                <div className="flex items-center space-x-6">
                  {aboutContent?.whyArawImage && (
                    <div className="w-32 h-32 bg-white border border-black/10 flex items-center justify-center p-2 overflow-hidden">
                      <img src={aboutContent.whyArawImage} alt="Why ARAW" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 space-y-4">
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file, 'about');
                            if (url) {
                              await setDoc(doc(db, 'settings', 'about'), { ...aboutContent, whyArawImage: url });
                              alert('Why ARAW image updated');
                            }
                          }
                        }}
                        className="hidden"
                        id="why-araw-upload"
                      />
                      <label 
                        htmlFor="why-araw-upload"
                        className="flex items-center space-x-2 bg-white border border-black/10 px-4 py-2 text-[10px] uppercase font-bold cursor-pointer hover:bg-purple-point hover:text-white transition-all w-fit"
                      >
                        <Upload size={14} />
                        <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                      </label>
                    </div>
                    <input 
                      name="whyArawImage" 
                      defaultValue={aboutContent?.whyArawImage} 
                      className="w-full border-b border-black/10 py-2 outline-none focus:border-purple-point text-xs opacity-50" 
                      placeholder="Or enter URL"
                    />
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" className="bg-black text-white px-12 py-4 uppercase tracking-widest text-xs font-bold hover:bg-purple-point transition-colors">
              Save About Content
            </button>
          </form>
        </div>
      ) : activeTab === 'leads' ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-8">Inquiries</h2>
          <div className="grid grid-cols-1 gap-6">
            {items.map(lead => (
              <div key={lead.id} className="border border-black/10 p-8 bg-gray-50">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tighter uppercase">{lead.name}</h3>
                    <p className="text-[10px] uppercase tracking-widest opacity-40">{lead.brand || 'No Brand'}</p>
                  </div>
                  <button onClick={() => handleDelete(lead.id)} className="text-red-500 hover:opacity-50">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Contact</p>
                    <p className="text-sm">{lead.email}</p>
                    <p className="text-sm">{lead.phone || 'No Phone'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Type</p>
                    <p className="text-sm font-bold">{lead.projectType || 'Not Specified'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Details</p>
                  <p className="text-sm whitespace-pre-wrap">{lead.projectDetails}</p>
                </div>
                <p className="text-[8px] uppercase tracking-widest opacity-20 mt-6">
                  Submitted: {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleString() : 'Recently'}
                </p>
              </div>
            ))}
            {items.length === 0 && <p className="opacity-30 uppercase tracking-widest text-xs">No inquiries yet.</p>}
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold uppercase tracking-tight">{activeTab}</h2>
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center space-x-2 bg-black text-white px-4 py-2 uppercase tracking-widest text-[10px] font-bold hover:bg-gold-point transition-colors"
            >
              <Plus size={14} />
              <span>Add New</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {items.map(item => (
              <div key={item.id} className="border border-black/10 p-6 flex justify-between items-center bg-gray-50 hover:border-gold-point/30 transition-colors">
                <div>
                  <p className="text-lg font-bold uppercase tracking-tight">{item.title_en || item.name}</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-40">ID: {item.id} — Order: {item.sortOrder}</p>
                </div>
                <div className="flex space-x-4">
                  <button onClick={() => setEditingItem(item)} className="p-2 hover:bg-gold-point hover:text-white transition-all rounded-full border border-black/10">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500 hover:text-white transition-all rounded-full border border-black/10">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {(isAdding || editingItem) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-12 relative">
            <button onClick={() => { setEditingItem(null); setIsAdding(false); }} className="absolute top-6 right-6 opacity-50 hover:opacity-100">
              <X />
            </button>
            <h3 className="text-2xl font-bold uppercase tracking-tighter mb-8">{editingItem ? 'Edit Item' : 'Add Item'}</h3>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-40">{activeTab === 'brands' ? 'Brand Name' : 'Title (EN)'}</label>
                  <input name={activeTab === 'brands' ? 'name' : 'title_en'} defaultValue={editingItem?.title_en || editingItem?.name} className="w-full border-b border-black/10 py-2 outline-none focus:border-gold-point" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-40">Title (KR)</label>
                  <input name="title_kr" defaultValue={editingItem?.title_kr} className="w-full border-b border-black/10 py-2 outline-none focus:border-gold-point" />
                </div>
                {activeTab === 'works' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest opacity-40">Slug</label>
                      <input name="slug" defaultValue={editingItem?.slug} className="w-full border-b border-black/10 py-2 outline-none focus:border-gold-point" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest opacity-40">Category (EN)</label>
                      <input name="category_en" defaultValue={editingItem?.category_en} className="w-full border-b border-black/10 py-2 outline-none focus:border-gold-point" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest opacity-40">Year</label>
                      <input name="year" defaultValue={editingItem?.year} className="w-full border-b border-black/10 py-2 outline-none focus:border-gold-point" required />
                    </div>
                    <div className="flex items-center space-x-2 pt-4">
                      <input type="checkbox" name="featured" defaultChecked={editingItem?.featured} id="featured" />
                      <label htmlFor="featured" className="text-[10px] uppercase tracking-widest opacity-40">Featured Project</label>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-40">Sort Order</label>
                  <input name="sortOrder" type="number" defaultValue={editingItem?.sortOrder || 0} className="w-full border-b border-black/10 py-2 outline-none focus:border-gold-point" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-40">Thumbnail URL / Image URL / Logo URL</label>
                  <div className="flex items-center space-x-4">
                    <input 
                      name={activeTab === 'works' ? 'thumbnail' : (activeTab === 'brands' ? 'logo' : 'image')} 
                      defaultValue={editingItem?.thumbnail || editingItem?.image || editingItem?.logo} 
                      className="flex-1 border-b border-black/10 py-2 outline-none focus:border-gold-point" 
                    />
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file, activeTab);
                            if (url) {
                              const input = (e.target.parentElement?.previousElementSibling as HTMLInputElement);
                              if (input) {
                                input.value = url;
                                // Trigger change for form data if needed, but handleSave uses FormData
                              }
                              alert('Image uploaded and URL set');
                            }
                          }
                        }}
                        className="hidden"
                        id="item-image-upload"
                      />
                      <label 
                        htmlFor="item-image-upload"
                        className="flex items-center space-x-2 bg-black text-white px-4 py-2 text-[10px] uppercase font-bold cursor-pointer hover:bg-purple-point transition-all"
                      >
                        <Upload size={14} />
                        <span>{uploading ? '...' : 'Upload'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-black text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-gold-point transition-colors">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
