import './App.css';
import Desktop from './components/os/Desktop';
import TerminalStandaloneTest from './components/TerminalStandaloneTest';
import { Analytics } from "@vercel/analytics/react";

function App() {
    return (
        <div className="App">
            {/* Debug: Show both Desktop and Standalone Terminal for comparison */}
            <Desktop />
            {/* <TerminalStandaloneTest /> */}
            <Analytics />
        </div>
    );
}

export default App;
