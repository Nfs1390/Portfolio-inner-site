import React from 'react';
import AITerminal from './applications/AITerminal';

const TerminalStandaloneTest: React.FC = () => {
  return (
    <div style={{ padding: 40, background: '#222', minHeight: '100vh' }}>
      <h2 style={{ color: '#fff' }}>Standalone AI Terminal Test</h2>
      <AITerminal width={600} height={400} />
    </div>
  );
};

export default TerminalStandaloneTest;
