import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BiTask, BiLogOut } from 'react-icons/bi';
import { logout } from '../services/authService';

function Header() {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userEmail');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="destaque">
            <h1>Gerenciador de Tarefas</h1>
            <BiTask size={48} />
            <div className="user-section">
                {userEmail && <span className="user-email">{userEmail}</span>}
                <button className="logout-btn" onClick={handleLogout}>
                    <BiLogOut size={20} /> Sair
                </button>
            </div>
        </div>
    );
}

export default Header;
