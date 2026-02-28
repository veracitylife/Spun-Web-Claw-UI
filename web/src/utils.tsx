import { Skill } from './types';
import { 
  Globe, 
  Mail, 
  Terminal, 
  Code, 
  Zap, 
  Video, 
  Calendar, 
  Music, 
  Image, 
  MessageSquare
} from 'lucide-react';

export const getIcon = (skill: Skill) => {
  switch (skill.type) {
    case 'browser': return <Globe className="w-5 h-5 text-blue-400" />;
    case 'email': return <Mail className="w-5 h-5 text-yellow-400" />;
    case 'cli': return <Terminal className="w-5 h-5 text-green-400" />;
    case 'api': return <Code className="w-5 h-5 text-purple-400" />;
    case 'automation': return <Zap className="w-5 h-5 text-orange-400" />;
    case 'other': 
      if (skill.id.includes('video') || skill.id.includes('youtube')) return <Video className="w-5 h-5 text-red-400" />;
      if (skill.id.includes('calendar')) return <Calendar className="w-5 h-5 text-blue-500" />;
      if (skill.id.includes('spotify')) return <Music className="w-5 h-5 text-green-500" />;
      if (skill.id.includes('image')) return <Image className="w-5 h-5 text-pink-500" />;
      if (skill.id.includes('chat') || skill.id.includes('twitter')) return <MessageSquare className="w-5 h-5 text-blue-400" />;
      return <Code className="w-5 h-5 text-slate-400" />;
    default: return <Code className="w-5 h-5 text-slate-400" />;
  }
};
