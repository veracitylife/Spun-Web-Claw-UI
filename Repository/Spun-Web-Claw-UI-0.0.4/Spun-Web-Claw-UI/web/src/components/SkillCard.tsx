import { Link } from 'react-router-dom';
import { Skill } from '../types';
import { getIcon } from '../utils';

interface SkillCardProps {
  skill: Skill;
}

export default function SkillCard({ skill }: SkillCardProps) {
  return (
    <Link 
      to={`/skill/${skill.id}`}
      className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 rounded-lg p-3 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-3 relative overflow-hidden"
    >
      <div className="flex-shrink-0 p-2 bg-slate-900/50 rounded-md group-hover:bg-blue-500/10 transition-colors">
        {getIcon(skill)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="text-sm font-bold text-slate-100 truncate group-hover:text-blue-400 transition-colors">
            {skill.name}
          </h3>
          {skill.installed && (
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
          )}
        </div>
        <p className="text-xs text-slate-400 truncate">
          {skill.description}
        </p>
      </div>
    </Link>
  );
}
