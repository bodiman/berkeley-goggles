import React from 'react';
import { StatsSection } from '../components/StatsSection';

export const StatsPage: React.FC = () => {
  return (
    <div className="min-h-screen safe-area-inset pb-20">
      {/* Header */}
      <header className="px-6 py-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white">Stats</h1>
      </header>

      {/* Main Content */}
      <main className="px-6 py-4">
        <div className="max-w-md mx-auto">
          <StatsSection />
        </div>
      </main>
    </div>
  );
};