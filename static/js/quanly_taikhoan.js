document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const userTableBody = document.getElementById("userTableBody");
    const btnOpenAddModal = document.getElementById("btnOpenAddModal");
    const addUserModal = document.getElementById("addUserModal");
    const btnCloseAddModal = document.getElementById("btnCloseAddModal");
    const btnSubmitAddUser = document.getElementById("btnSubmitAddUser");

    // 1. Tải danh sách tài khoản từ API
    async function loadUsers(search = "") {
        try {
            const response = await fetch(`/api/admin/tai-khoan?search=${encodeURIComponent(search)}`);
            const result = await response.json();

            if (result.success) {
                renderTable(result.data);
            } else {
                console.error("Lỗi:", result.message);
            }
        } catch (error) {
            console.error("Lỗi kết nối máy chủ:", error);
        }
    }

    // 2. Đổ dữ liệu ra bảng HTML (Đã thêm nút Sửa tích hợp JSON.stringify(user))
    function renderTable(users) {
        userTableBody.innerHTML = "";
        if (users.length === 0) {
            userTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #888;">Không có dữ liệu tài khoản.</td></tr>`;
            return;
        }

        users.forEach(user => {
            const tr = document.createElement("tr");
            tr.style.borderBottom = "1px solid #333";

            const isLocked = user.isLocked === 1 || user.isLocked === true;
            const statusText = isLocked ? '<span style="color: #ff4d4d;">Đã khóa</span>' : '<span style="color: #28a745;">Hoạt động</span>';
            const lockBtnLabel = isLocked ? 'Mở khóa' : 'Khóa';
            const lockBtnColor = isLocked ? '#28a745' : '#ffc107';

            tr.innerHTML = `
                <td style="padding: 14px;">${user.username}</td>
                <td style="padding: 14px;">${user.displayName || ''}</td>
                <td style="padding: 14px;">${user.role}</td>
                <td style="padding: 14px;">${statusText}</td>
                <td style="padding: 14px; text-align: center; display: flex; gap: 8px; justify-content: center;">
                    <button class="btn-edit" type="button" onclick='moModalSua(${JSON.stringify(user)})' style="padding: 5px 10px; background: #ffc107; color: #000; border: none; border-radius: 4px; cursor: pointer;" title="Chỉnh sửa tài khoản">Sửa</button>
                    <button class="btn-reset" data-username="${user.username}" style="padding: 5px 10px; background: #17a2b8; color: #fff; border: none; border-radius: 4px; cursor: pointer;" title="Reset mật khẩu về 123456">Reset MK</button>
                    <button class="btn-lock" data-username="${user.username}" data-locked="${isLocked ? 1 : 0}" style="padding: 5px 10px; background: ${lockBtnColor}; color: #000; border: none; border-radius: 4px; cursor: pointer;">${lockBtnLabel}</button>
                    <button class="btn-delete" data-username="${user.username}" style="padding: 5px 10px; background: #dc3545; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Xóa</button>
                </td>
            `;
            userTableBody.appendChild(tr);
        });
    }

    // Tải danh sách lần đầu khi mở trang
    loadUsers();

    // 3. Tìm kiếm trực tiếp khi gõ phím
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            loadUsers(this.value.trim());
        });
    }

    // 4. Đóng/Mở Modal thêm tài khoản
    if (btnOpenAddModal) btnOpenAddModal.addEventListener("click", () => addUserModal.style.display = "flex");
    if (btnCloseAddModal) btnCloseAddModal.addEventListener("click", () => addUserModal.style.display = "none");

    // 5. Thêm tài khoản mới qua API
    if (btnSubmitAddUser) {
        btnSubmitAddUser.addEventListener("click", async function () {
            const username = document.getElementById("newUsername").value.trim();
            const password = document.getElementById("newPassword").value.trim();
            const displayName = document.getElementById("newDisplayName").value.trim();
            const role = document.getElementById("newRole").value;

            if (!username || !password) {
                alert("Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu!");
                return;
            }

            try {
                const res = await fetch("/api/admin/tai-khoan/them", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password, displayName, role })
                });
                const result = await res.json();
                alert(result.message);
                if (result.success) {
                    addUserModal.style.display = "none";
                    document.getElementById("newUsername").value = "";
                    document.getElementById("newPassword").value = "";
                    document.getElementById("newDisplayName").value = "";
                    loadUsers();
                }
            } catch (err) {
                console.error(err);
                alert("Lỗi kết nối máy chủ.");
            }
        });
    }

    // 6. Xử lý các sự kiện trong bảng (Reset MK, Khóa/Mở khóa, Xóa)
    if (userTableBody) {
        userTableBody.addEventListener("click", async function (e) {
            const username = e.target.getAttribute("data-username");
            if (!username) return;

            // Reset mật khẩu
            if (e.target.classList.contains("btn-reset")) {
                if (confirm(`Bạn có chắc muốn reset mật khẩu của tài khoản [${username}] về mặc định (123456)?`)) {
                    const res = await fetch("/api/admin/tai-khoan/reset-mat-khau", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username })
                    });
                    const result = await res.json();
                    alert(result.message);
                }
            }

            // Khóa / Mở khóa tài khoản
            if (e.target.classList.contains("btn-lock")) {
                const currentLocked = parseInt(e.target.getAttribute("data-locked"));
                const newLockedState = currentLocked === 1 ? 0 : 1;
                const actionName = newLockedState === 1 ? "khóa" : "mở khóa";

                if (confirm(`Bạn có chắc muốn ${actionName} tài khoản [${username}]?`)) {
                    const res = await fetch("/api/admin/tai-khoan/trang-thai", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, isLocked: newLockedState })
                    });
                    const result = await res.json();
                    alert(result.message);
                    loadUsers(searchInput.value);
                }
            }

            // Xóa tài khoản
            if (e.target.classList.contains("btn-delete")) {
                if (confirm(`CẢNH BÁO: Hành động này sẽ xóa vĩnh viễn tài khoản [${username}]. Bạn có chắc chắn không?`)) {
                    const res = await fetch("/api/admin/tai-khoan/xoa", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username })
                    });
                    const result = await res.json();
                    alert(result.message);
                    loadUsers(searchInput.value);
                }
            }
        });
    }

    // Xử lý submit form sửa
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const payload = {
                usernameGoc: document.getElementById('editUsernameGoc').value,
                username: document.getElementById('editUsername').value,
                displayName: document.getElementById('editDisplayName').value,
                role: document.getElementById('editRole').value,
                password: document.getElementById('editPassword').value
            };

            try {
                const response = await fetch('/api/admin/tai-khoan/sua', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();
                
                if (result.success) {
                    alert(result.message);
                    dongModalSua();
                    loadUsers(); // Tải lại bảng không cần F5 lại trang
                } else {
                    alert("Lỗi: " + result.message);
                }
            } catch (err) {
                console.error(err);
                alert("Có lỗi xảy ra khi kết nối đến server!");
            }
        });
    }
});

// Đưa hàm mở/đóng modal ra global scope để onclick trong HTML nhận diện được
window.moModalSua = function(user) {
    document.getElementById('editUsernameGoc').value = user.username;
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editDisplayName').value = user.displayName || '';
    document.getElementById('editRole').value = user.role || 'hoc_sinh';
    document.getElementById('editPassword').value = ''; // Reset trống ô mật khẩu
    
    document.getElementById('editModal').style.display = 'flex';
};

window.dongModalSua = function() {
    document.getElementById('editModal').style.display = 'none';
};