import React from 'react';
import { Box } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="bg-gradient-to-br from-blue-600 to-teal-400 p-2 rounded-xl shadow-lg shadow-blue-600/20">
        <Box className="text-white w-6 h-6" strokeWidth={2.5} />
      </div>
      <span className="font-bold text-xl tracking-tight text-slate-900">
        Bloktastic
      </span>
    </div>
  );
};

export default Logo;