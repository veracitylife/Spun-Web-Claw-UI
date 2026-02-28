import { useEffect, useState } from 'react';
import { getSkills } from '../api';
import { Skill } from '../types';
import SkillCard from '../components/SkillCard';
import Layout from '../components/Layout';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(data);
      } catch (err) {
        setError('Failed to load skills. Please ensure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">ClawHub Skills</h1>
        <p className="text-sm text-slate-400">Select a skill to operate.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    </Layout>
  );
}
