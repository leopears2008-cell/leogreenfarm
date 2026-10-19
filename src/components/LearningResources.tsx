import { BookOpen, Video, FileText } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const resources = [
  {
    title: 'Modern Organic Farming Techniques',
    type: 'video',
    duration: '12 mins',
    image: 'https://images.unsplash.com/photo-1592982537447-6f296d19b78e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Soil Health and Fertilizer Guide',
    type: 'article',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Drip Irrigation Setup Tutorial',
    type: 'video',
    duration: '18 mins',
    image: 'https://images.unsplash.com/photo-1563514222080-60f3801ceb67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  }
];

export default function LearningResources() {
  const { t } = useLanguage();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col" id="resources">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t('learningTitle')}</h2>
          <p className="text-sm text-slate-500">{t('learningDesc')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {resources.map((resource, idx) => (
          <div key={idx} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer group">
            <div className="w-24 h-20 rounded-lg overflow-hidden shrink-0 relative">
              <img src={resource.image} alt={resource.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                {resource.type === 'video' ? (
                  <Video className="w-6 h-6 text-white" />
                ) : (
                  <FileText className="w-6 h-6 text-white" />
                )}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-medium text-slate-800 line-clamp-2 mb-1">{resource.title}</h3>
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-md w-fit">
                {resource.type === 'video' ? resource.duration : resource.readTime}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
