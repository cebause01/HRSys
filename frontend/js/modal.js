// Modal Functions
function openInviteModal() {
    const modal = document.createElement('div');
    modal.id = 'inviteModal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 class="text-xl font-semibold text-gray-900">Invite New User</h2>
                <button onclick="closeInviteModal()" class="p-1 text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <form id="inviteForm" class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" id="inviteName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" id="inviteEmail" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select id="inviteRole" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                        <option value="hr_manager">HR Manager</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                    </select>
                </div>
                <div class="flex justify-end gap-3 pt-4">
                    <button type="button" onclick="closeInviteModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button type="submit" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Send Invite</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('inviteForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('inviteName').value;
        const email = document.getElementById('inviteEmail').value;
        const role = document.getElementById('inviteRole').value;

        try {
            const response = await api.post('/invitations', { name, email, role });
            if (response.data?.invitationLink) {
                alert(`Invitation created! Email service not configured. Use this link: ${response.data.invitationLink}`);
            } else {
                alert('Invitation email sent successfully!');
            }
            closeInviteModal();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to send invitation');
        }
    });
}

function closeInviteModal() {
    const modal = document.getElementById('inviteModal');
    if (modal) modal.remove();
}
