export interface Skill {
  id: string;
  name: string;
  description: string;
  url: string;
  installed: boolean;
  enabled: boolean;
  type: 'browser' | 'email' | 'cli' | 'api' | 'automation' | 'other';
}
