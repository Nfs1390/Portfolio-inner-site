import './App.css';
import Desktop from './components/os/Desktop';
import TerminalStandaloneTest from './components/TerminalStandaloneTest';

function App() {
    return (
        <div className="App">
            {/* Debug: Show both Desktop and Standalone Terminal for comparison */}
            <Desktop />
            {/* <TerminalStandaloneTest /> */}
        </div>
    );
}

export default App;
