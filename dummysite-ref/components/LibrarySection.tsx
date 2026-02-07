import React from 'react';
import { Search } from 'lucide-react';

const LibrarySection: React.FC = () => {
  return (
    <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Browse Library</h2>
        <div className="relative max-w-2xl">
          <input 
            type="text" 
            placeholder="Search components..." 
            className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mock Component 1 */}
        <div className="bg-gray-100 rounded-3xl p-4 group cursor-pointer hover:bg-gray-200 transition-colors">
          <div className="bg-white rounded-2xl p-4 h-48 mb-4 border border-gray-200/50 shadow-sm overflow-hidden relative">
            <div className="font-mono text-xs text-blue-600 mb-2">Button.tsx</div>
             <pre className="text-[10px] text-gray-400 leading-tight font-mono">
{`export const Button = ({ 
  children, 
  variant 
}) => {
  return (
    <button className={
       clsx('px-4 py-2',
       variants[variant])
    }>
      {children}
    </button>
  )
}`}
            </pre>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80"></div>
          </div>
          <div className="px-2">
             <h4 className="font-bold text-gray-800">Minimalist Button</h4>
             <p className="text-xs text-gray-500 mt-1">Foundational UI element</p>
          </div>
        </div>

        {/* Mock Component 2 */}
        <div className="bg-gray-100 rounded-3xl p-4 group cursor-pointer hover:bg-gray-200 transition-colors">
          <div className="bg-white rounded-2xl p-4 h-48 mb-4 border border-gray-200/50 shadow-sm flex flex-col gap-2 items-center justify-center">
             <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-blue-500 rounded-full"></div>
             </div>
             <div className="w-full flex justify-between text-[10px] text-gray-400">
                <span>0%</span>
                <span>100%</span>
             </div>
          </div>
          <div className="px-2">
             <h4 className="font-bold text-gray-800">Progress Bar</h4>
             <p className="text-xs text-gray-500 mt-1">Visual indicator for loading states</p>
          </div>
        </div>

         {/* Mock Component 3 */}
         <div className="bg-gray-100 rounded-3xl p-4 group cursor-pointer hover:bg-gray-200 transition-colors">
          <div className="bg-white rounded-2xl p-4 h-48 mb-4 border border-gray-200/50 shadow-sm flex items-center justify-center relative overflow-hidden">
             <img src="https://picsum.photos/300/200" alt="card preview" className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all" />
             <div className="z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-sm">
                Image Card
             </div>
          </div>
          <div className="px-2">
             <h4 className="font-bold text-gray-800">Media Card</h4>
             <p className="text-xs text-gray-500 mt-1">Responsive media container</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibrarySection;