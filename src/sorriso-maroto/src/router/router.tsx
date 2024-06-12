import { Route, Routes } from 'react-router-dom';
import NotfoundPage from '../pages/Notfound/NotfoundPage';
import { DashBoard } from '../pages/Dashboard';


export default function AppRouter() {
    return (
        <Routes>
            <Route path='/' element={<DashBoard />} />
            <Route path='/home' element={<DashBoard />} />
            <Route path='competences' element={<DashBoard />} />
            <Route path='*' element={<NotfoundPage />} />
        </Routes>
    );
}