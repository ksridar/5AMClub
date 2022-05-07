
import { BrowserRouter as Router, Link, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="*" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
            </Router>
        </div>
    );
}



export default App;

