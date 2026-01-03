
import React, { useEffect, useState } from 'react';
import { fetchVideos } from '../services/api';
import { VideoContent } from '../types';
import { telegram } from '../services/telegram';

const VideoPage: React.FC = () => {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos().then((data) => {
      setVideos(data);
      setLoading(false);
    });
  }, []);

  const handleWatch = (video: VideoContent) => {
    telegram.hapticFeedback('medium');
    
    // Distinguish between Telegram links and external links
    if (video.link.includes('t.me/')) {
      telegram.openTelegramLink(video.link);
    } else {
      // Use openLink for YouTube and other external sites
      telegram.openLink(video.link);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black uppercase tracking-tight">Help & Education</h2>
        <p className="text-gray-600 text-sm font-bold">Official tutorials to help you maximize earnings</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-5">
          {videos.map((v) => {
            const isOfficial = v.topic.toLowerCase().includes('official');
            return (
              <div 
                key={v.id}
                className={`bg-white rounded-[2.5rem] p-6 border transition-all duration-300 flex flex-col gap-4 overflow-hidden relative group active:scale-[0.98] cursor-pointer shadow-sm ${
                  isOfficial ? 'border-blue-200 ring-4 ring-blue-50/50' : 'border-gray-100'
                }`}
                onClick={() => handleWatch(v)}
              >
                {isOfficial && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-blue-600 text-white text-[8px] font-black uppercase px-4 py-1.5 rounded-bl-2xl tracking-widest shadow-lg">
                      Must Watch
                    </div>
                  </div>
                )}

                <div className="flex gap-5">
                  <div className={`w-24 h-24 rounded-3xl flex-shrink-0 flex items-center justify-center relative overflow-hidden transition-colors ${
                    isOfficial ? 'bg-blue-600' : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <span className="text-3xl">{isOfficial ? '🎯' : '📚'}</span>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                      <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4.5 2.691a.75.75 0 011.125-.65l11.25 6.5a.75.75 0 010 1.3l-11.25 6.5a.75.75 0 01-1.125-.65V2.691z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 py-1 flex flex-col justify-center">
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        isOfficial ? 'text-blue-700' : 'text-gray-500'
                      }`}>
                        {v.topic}
                      </span>
                      <h4 className="font-black text-gray-900 line-clamp-2 uppercase leading-tight mt-1 text-[13px] tracking-tight">
                        {v.title}
                      </h4>
                    </div>
                    <div className="mt-3">
                      <span className="text-[9px] font-black bg-gray-100 text-gray-600 px-2 py-1 rounded-md uppercase tracking-tighter">
                        YouTube Resource
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {videos.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
              <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No educational content yet</p>
            </div>
          )}
        </div>
      )}
      
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

export default VideoPage;
