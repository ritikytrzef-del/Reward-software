
import React, { useState, useEffect } from 'react';
import { 
  addEarningBot, 
  deleteEarningBot, 
  fetchEarningBots, 
  addVideo, 
  deleteVideo, 
  fetchVideos, 
  addSocialLink, 
  deleteSocialLink, 
  fetchSocials, 
  fetchAppLogo, 
  updateAppLogo 
} from '../services/api';
import { telegram } from '../services/telegram';
import { TaskCategory, EarningBot, SocialLink, VideoContent } from '../types';

const AdminPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeSubTab, setActiveSubTab] = useState<'bots' | 'videos' | 'socials' | 'settings'>('bots');
  const [loading, setLoading] = useState(false);

  // Lists for Management
  const [botsList, setBotsList] = useState<EarningBot[]>([]);
  const [socialsList, setSocialsList] = useState<SocialLink[]>([]);
  const [videosList, setVideosList] = useState<VideoContent[]>([]);

  // Bot Form State
  const [botName, setBotName] = useState('');
  const [botLink, setBotLink] = useState('');
  const [botCategory, setBotCategory] = useState<string>(TaskCategory.TAP);
  const [botDesc, setBotDesc] = useState('');
  const [botIcon, setBotIcon] = useState<string>('🤖');
  
  // Video Form State
  const [vidTitle, setVidTitle] = useState('');
  const [vidTopic, setVidTopic] = useState('');
  const [vidLink, setVidLink] = useState('');

  // Social Form State
  const [socPlatform, setSocPlatform] = useState('Telegram');
  const [socName, setSocName] = useState('');
  const [socLink, setSocLink] = useState('');
  const [socIcon, setSocIcon] = useState('✈️');
  
  // Settings State
  const [currentLogo, setCurrentLogo] = useState('');
  const [logoInput, setLogoInput] = useState('');

  const refreshData = async () => {
    const [b, s, v] = await Promise.all([
      fetchEarningBots(),
      fetchSocials(),
      fetchVideos()
    ]);
    setBotsList(b);
    setSocialsList(s);
    setVideosList(v);
  };

  useEffect(() => {
    fetchAppLogo().then(logo => {
        setCurrentLogo(logo);
        setLogoInput(logo);
    });
    refreshData();
  }, []);

  const handleUpdateLogo = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!logoInput) return telegram.showAlert("Logo URL is required");
      setLoading(true);
      try {
          const newLogo = await updateAppLogo(logoInput);
          setCurrentLogo(newLogo);
          telegram.showAlert("App Logo updated successfully!");
      } finally {
          setLoading(false);
      }
  };

  const handleAddBot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!botName || !botLink || !botCategory) return telegram.showAlert("Name, Link and Category are required");
    setLoading(true);
    try {
      await addEarningBot({ 
        name: botName, 
        link: botLink, 
        category: botCategory,
        description: botDesc || 'No description provided.', 
        rewardRate: 'High', 
        icon: botIcon 
      });
      telegram.showAlert("Partner Bot deployed successfully!");
      setBotName(''); 
      setBotLink(''); 
      setBotDesc('');
      setBotIcon('🤖');
      refreshData();
    } finally { setLoading(false); }
  };

  const handleDeleteBot = async (id: string) => {
    telegram.hapticFeedback('medium');
    setLoading(true);
    try {
      await deleteEarningBot(id);
      telegram.showAlert("Bot removed from hub.");
      refreshData();
    } finally { setLoading(false); }
  };

  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socName || !socLink) return telegram.showAlert("Name and Link are required");
    setLoading(true);
    try {
      const colors: Record<string, string> = {
        'Telegram': 'bg-[#24A1DE]',
        'YouTube': 'bg-[#FF0000]',
        'X (Twitter)': 'bg-[#000000]',
        'Instagram': 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
        'Facebook': 'bg-[#1877F2]',
        'Support': 'bg-[#34B7F1]'
      };

      await addSocialLink({
        platform: socPlatform,
        name: socName,
        link: socLink,
        color: colors[socPlatform] || 'bg-blue-500',
        icon: socIcon || '🔗'
      });
      telegram.showAlert("Social link added!");
      setSocName(''); setSocLink(''); setSocIcon('✈️');
      refreshData();
    } finally { setLoading(false); }
  };

  const handleDeleteSocial = async (id: string) => {
    telegram.hapticFeedback('medium');
    setLoading(true);
    try {
      await deleteSocialLink(id);
      telegram.showAlert("Social link removed.");
      refreshData();
    } finally { setLoading(false); }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitle || !vidLink) return telegram.showAlert("Title and Link are required");
    setLoading(true);
    try {
      await addVideo({ title: vidTitle, topic: vidTopic || 'General', link: vidLink, reward: 0 });
      telegram.showAlert("Video resource added!");
      setVidTitle(''); setVidTopic(''); setVidLink('');
      refreshData();
    } finally { setLoading(false); }
  };

  const handleDeleteVideo = async (id: string) => {
    telegram.hapticFeedback('medium');
    setLoading(true);
    try {
      await deleteVideo(id);
      telegram.showAlert("Video resource removed.");
      refreshData();
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack} 
          className="p-3 bg-gray-50 rounded-2xl border border-gray-100 active:scale-90 transition-transform"
        >
          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">Control Center</h2>
          <p className="text-[11px] font-black text-blue-700 uppercase tracking-widest">Master Admin Privileges</p>
        </div>
      </div>

      <div className="flex bg-gray-100/50 p-1.5 rounded-[2rem] border border-gray-100 overflow-x-auto no-scrollbar">
        {(['bots', 'videos', 'socials', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`flex-1 py-3.5 px-4 whitespace-nowrap text-[11px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all duration-300 ${
              activeSubTab === tab 
                ? 'bg-white text-blue-700 shadow-sm border border-gray-200' 
                : 'text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-50 space-y-8">
        
        {activeSubTab === 'settings' && (
            <form onSubmit={handleUpdateLogo} className="space-y-6">
                <div className="text-center space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-800">App Branding</h3>
                    <p className="text-[11px] font-black text-gray-500">Change the global application logo</p>
                </div>
                
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                        {currentLogo ? (
                            <img src={currentLogo} className="w-full h-full object-contain p-2" alt="App Logo" />
                        ) : (
                            <span className="text-2xl opacity-20">🖼️</span>
                        )}
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Logo URL (Icon)</label>
                    <input 
                        type="text" 
                        value={logoInput} 
                        onChange={e => setLogoInput(e.target.value)} 
                        placeholder="https://.../logo.png" 
                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm font-black outline-none focus:bg-white focus:border-blue-100 transition-all" 
                    />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-gray-900 to-black py-5 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-gray-100 active:scale-95 disabled:opacity-50 transition-all">
                    {loading ? "SAVING..." : "UPDATE LOGO"}
                </button>
            </form>
        )}

        {activeSubTab === 'socials' && (
          <div className="space-y-8">
            <form onSubmit={handleAddSocial} className="space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-800">Community Management</h3>
                <p className="text-[11px] font-black text-gray-500">Add official follow links for users</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Platform</label>
                  <select value={socPlatform} onChange={e => setSocPlatform(e.target.value)} className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm font-black outline-none focus:bg-white focus:border-blue-100 transition-all">
                    {['Telegram', 'YouTube', 'X (Twitter)', 'Instagram', 'Facebook', 'Support'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Display Name</label>
                  <input type="text" value={socName} onChange={e => setSocName(e.target.value)} placeholder="Official Channel" className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm font-black outline-none focus:bg-white focus:border-blue-100 transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Direct Link</label>
                  <input type="text" value={socLink} onChange={e => setSocLink(e.target.value)} placeholder="https://..." className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm font-black outline-none focus:bg-white focus:border-blue-100 transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Icon (Emoji or Image URL)</label>
                  <input type="text" value={socIcon} onChange={e => setSocIcon(e.target.value)} placeholder="✈️ or https://..." className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm font-black outline-none focus:bg-white focus:border-blue-100 transition-all" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-5 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50 transition-all">
                {loading ? "SAVING..." : "ADD SOCIAL LINK"}
              </button>
            </form>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">Manage Links</h4>
              <div className="space-y-3">
                {socialsList.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 text-xl overflow-hidden">
                        {item.icon.startsWith('http') ? <img src={item.icon} className="w-full h-full object-contain p-2" /> : item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-800">{item.name}</p>
                        <p className="text-[9px] font-black text-gray-500 uppercase">{item.platform}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteSocial(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'bots' && (
          <div className="space-y-8">
            <form onSubmit={handleAddBot} className="space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-800">Partner Deployment</h3>
                <p className="text-[11px] font-black text-gray-500">Add verified earning bots to the hub</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Bot Name</label>
                  <input type="text" value={botName} onChange={e => setBotName(e.target.value)} placeholder="Bot Name" className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm font-black outline-none focus:bg-white focus:border-blue-100 transition-all" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Bot Link (Telegram)</label>
                  <input type="text" value={botLink} onChange={e => setBotLink(e.target.value)} placeholder="https://t.me/ExampleBot" className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm font-black outline-none focus:bg-white focus:border-blue-100 transition-all" />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    value={botDesc} 
                    onChange={e => setBotDesc(e.target.value)} 
                    placeholder="Tell users what this bot does..." 
                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm font-black outline-none focus:bg-white focus:border-blue-100 transition-all min-h-[100px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                  <select value={botCategory} onChange={e => setBotCategory(e.target.value)} className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm font-black outline-none focus:bg-white focus:border-blue-100 transition-all">
                    {Object.values(TaskCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Icon (Emoji or Image URL)</label>
                  <input type="text" value={botIcon} onChange={e => setBotIcon(e.target.value)} placeholder="🤖 or https://..." className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm font-black outline-none focus:bg-white focus:border-blue-100 transition-all" />
                </div>
              </div>
              
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-5 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50 transition-all mt-4">
                {loading ? "COMMITTING..." : "PUBLISH PARTNER"}
              </button>
            </form>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">Active Directory</h4>
              <div className="space-y-3">
                {botsList.map(bot => (
                  <div key={bot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100 text-2xl overflow-hidden">
                        {bot.icon.startsWith('http') ? <img src={bot.icon} className="w-full h-full object-contain p-2" /> : bot.icon}
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-900">{bot.name}</p>
                        <p className="text-[9px] font-black text-blue-700 uppercase tracking-widest">{bot.category}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteBot(bot.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'videos' && (
          <div className="space-y-8">
            <form onSubmit={handleAddVideo} className="space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-800">Educational Resources</h3>
                <p className="text-[11px] font-black text-gray-500">Add video guides to help users</p>
              </div>
              <div className="space-y-4">
                <input type="text" value={vidTitle} onChange={e => setVidTitle(e.target.value)} placeholder="Video Title" className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm font-black outline-none focus:bg-white focus:border-blue-100" />
                <input type="text" value={vidTopic} onChange={e => setVidTopic(e.target.value)} placeholder="Topic (e.g. Official Guide)" className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm font-black outline-none focus:bg-white focus:border-blue-100" />
                <input type="text" value={vidLink} onChange={e => setVidLink(e.target.value)} placeholder="YouTube Link" className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm font-black outline-none focus:bg-white focus:border-blue-100" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-600 to-red-800 py-5 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-red-100 active:scale-95 disabled:opacity-50 transition-all">
                {loading ? "UPLOADING..." : "SAVE VIDEO"}
              </button>
            </form>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">Library Management</h4>
              <div className="space-y-3">
                {videosList.map(v => (
                  <div key={v.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📺</span>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-gray-800 truncate">{v.title}</p>
                        <p className="text-[9px] font-black text-gray-500 uppercase">{v.topic}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteVideo(v.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="flex justify-center pt-8 pb-12">
        <div className="px-10 py-5 rounded-[2.5rem] bg-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-50 transform transition-all active:scale-95">
          <p className="text-[16px] font-black uppercase tracking-[0.15em] text-center flex flex-wrap justify-center gap-x-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-600 to-black">
              Powered by
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 via-purple-500 to-indigo-600">
              Reward Software
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminPanel;
