import React, { useState } from 'react';
import { User, Mail, Lock, Trash2, Save, Link as LinkIcon } from 'lucide-react';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saved, setSaved] = useState(false);

  const connectedPlatforms = JSON.parse(localStorage.getItem('connectedPlatforms') || '{}');
  const userNiches = JSON.parse(localStorage.getItem('userNiches') || '[]');

  const handleSaveProfile = () => {
    const updatedUser = { ...user, name, email };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative z-10">
      {/* Header */}
      <div className="fade-in">
        <h1 className="mb-2">Profile & Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      {/* Profile Information */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 slide-in-up">
        <h2 className="mb-6">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white"
              />
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className={`px-6 py-3 rounded-lg transition-all flex items-center gap-2 ${
              saved
                ? 'bg-green-500/80 text-white'
                : 'bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white hover:shadow-lg hover:shadow-blue-500/30'
            }`}
          >
            <Save className="w-5 h-5" />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Content Niches */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover">
        <h2 className="mb-4">Content Niches</h2>
        <div className="flex flex-wrap gap-2">
          {userNiches.length > 0 ? (
            userNiches.map((niche: string, index: number) => (
              <span key={index} className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg">
                {niche}
              </span>
            ))
          ) : (
            <p className="text-gray-400">No niches selected</p>
          )}
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover">
        <h2 className="mb-6">Connected Accounts</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-all bg-zinc-800/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">TT</span>
              </div>
              <div>
                <p className="text-white">TikTok</p>
                <p className="text-gray-400">
                  {connectedPlatforms.tiktok ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            {connectedPlatforms.tiktok ? (
              <button className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all">
                Disconnect
              </button>
            ) : (
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                Connect
              </button>
            )}
          </div>

          <div className="flex items-center justify-between p-4 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-all bg-zinc-800/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 rounded-lg"></div>
              <div>
                <p className="text-white">Instagram</p>
                <p className="text-gray-400">
                  {connectedPlatforms.instagram ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            {connectedPlatforms.instagram ? (
              <button className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all">
                Disconnect
              </button>
            ) : (
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                Connect
              </button>
            )}
          </div>

          <div className="flex items-center justify-between p-4 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-all bg-zinc-800/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white">▶</span>
              </div>
              <div>
                <p className="text-white">YouTube</p>
                <p className="text-gray-400">
                  {connectedPlatforms.youtube ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            {connectedPlatforms.youtube ? (
              <button className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all">
                Disconnect
              </button>
            ) : (
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                Connect
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover">
        <h2 className="mb-6">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white"
              />
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            className="px-6 py-3 bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Saved Content */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover">
        <h2 className="mb-4">Saved Content</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
            <p className="text-white mb-1">24</p>
            <p className="text-gray-400">Saved Videos</p>
          </div>
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
            <p className="text-white mb-1">12</p>
            <p className="text-gray-400">Saved Scripts</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border-2 border-red-500/30 p-6">
        <h2 className="text-red-400 mb-4">Danger Zone</h2>
        <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div>
            <p className="text-white mb-1">Delete Account</p>
            <p className="text-gray-400">
              Permanently delete your account and all associated data
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="px-6 py-3 bg-red-600/80 text-white rounded-lg hover:bg-red-700/80 hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
