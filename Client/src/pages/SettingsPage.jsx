import React from 'react';
import ChangePasswordForm from '../components/ChangePassword.jsx'
import { useNavigate } from 'react-router-dom';

function SettingsPage() {
    const navigate = useNavigate();

    return (
        <div className="px-6 py-6">
            <div className="flex items-center mb-6">
                <button
                    className="text-blue-500"
                    onClick={() => navigate('/home')}
                >
                    ← Back
                </button>
                <h1 className="ml-4 text-2xl font-bold">Settings</h1>
            </div>

            <div className="grid gap-6">
                {/* Password Change Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Change Password
                    </h2>
                    <ChangePasswordForm />
                </div>

                {/* Add more settings sections here if needed */}
            </div>
        </div>
    );
}

export default SettingsPage;