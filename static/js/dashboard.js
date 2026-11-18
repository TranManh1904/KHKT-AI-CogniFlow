/* ============================================================
   CogniFlow — dashboard.js (Xử lý toàn bộ sự kiện trang chủ & Cài đặt)
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
    // --- 1. XỬ LÝ NÚT ĐỔI NGÔN NGỮ (VN/EN) ---
    const btnToggleLang = document.getElementById("btnToggleLang");
    const langLabel = document.getElementById("langLabel");
    const maVaiTro = document.body.getAttribute("data-ma-vai-tro");
    const adminSection = document.getElementById("adminSection");

    function updateLabel() {
        if (window.CogniFlowI18n) {
            const current = window.CogniFlowI18n.getLang();
            if (langLabel) langLabel.textContent = current === "vi" ? "VI" : "EN";
        }
    }

    if (btnToggleLang) {
        updateLabel();
        btnToggleLang.addEventListener("click", function () {
            if (window.CogniFlowI18n) {
                const current = window.CogniFlowI18n.getLang();
                const next = current === "vi" ? "en" : "vi";
                window.CogniFlowI18n.setLang(next);
                updateLabel();
            }
        });
    }
    if (adminSection) {
        // Kiểm tra nếu là quan_tri hoặc id/mã vai trò phù hợp
        if (maVaiTro === "quan_tri" || maVaiTro === "2") {
            adminSection.classList.remove("hidden");
            adminSection.style.display = "block";
        } else {
            adminSection.classList.add("hidden");
            adminSection.style.display = "none";
        }
    }

    // --- 2. XỬ LÝ MỞ / ĐÓNG BẢNG CÀI ĐẶT (SETTINGS) ---
    const btnSettings = document.getElementById("btnSettings");
    const settingsOverlay = document.getElementById("settingsOverlay");
    
    // Tìm nút đóng (dấu X) linh hoạt hơn
    const btnCloseSettings = document.querySelector("#settingsOverlay .close-btn, #settingsOverlay [data-close], #settingsOverlay button[title*='Close'], #settingsOverlay .btn-close") || document.getElementById("btnCloseSettings");
    const btnDoneSettings = document.getElementById("btnDoneSettings");

    function openSettings() {
        if (settingsOverlay) {
            settingsOverlay.classList.remove("hidden");
            settingsOverlay.style.display = "flex";
        }
    }

    function closeSettings() {
        if (settingsOverlay) {
            settingsOverlay.classList.add("hidden");
            settingsOverlay.style.display = "none";
        }
    }

    if (btnSettings) {
        btnSettings.addEventListener("click", openSettings);
    }

    // Bắt sự kiện nút X ở góc trên modal (nếu có dạng icon SVG)
    const closeIcon = settingsOverlay ? settingsOverlay.querySelector("svg")?.closest("button") : null;
    if (closeIcon) {
        closeIcon.addEventListener("click", closeSettings);
    }

    if (btnCloseSettings) {
        btnCloseSettings.addEventListener("click", closeSettings);
    }

    if (btnDoneSettings) {
        btnDoneSettings.addEventListener("click", closeSettings);
    }

    if (settingsOverlay) {
        settingsOverlay.addEventListener("click", function (e) {
            if (e.target === settingsOverlay) {
                closeSettings();
            }
        });
    }

    // --- 3. XỬ LÝ CHỌN CHỦ ĐỀ & GIAO DIỆN ---
    const themeButtons = document.querySelectorAll("#settingsOverlay button");
    themeButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            const text = this.textContent.trim().toLowerCase();
            if (text === "sáng" || text === "light") {
                document.body.setAttribute("data-theme", "light");
                localStorage.setItem("cogniflow_theme", "light");
            } else if (text === "tối" || text === "dark") {
                document.body.setAttribute("data-theme", "dark");
                localStorage.setItem("cogniflow_theme", "dark");
            } else if (text === "mặc định" || text === "default") {
                document.body.removeAttribute("data-theme");
                localStorage.removeItem("cogniflow_theme");
            }
        });
    });

    const savedTheme = localStorage.getItem("cogniflow_theme");
    if (savedTheme) {
        document.body.setAttribute("data-theme", savedTheme);
    }

    // --- 4. XỬ LÝ CHUYỂN TAB TRONG BẢNG CÀI ĐẶT (Đảm bảo bắt đúng các mục cột trái) ---
    if (settingsOverlay) {
        const panes = settingsOverlay.querySelectorAll(".tab-pane");
        
        // Lấy tất cả các mục nằm trong thanh sidebar/menu bên trái của cài đặt
        const sidebarButtons = settingsOverlay.querySelectorAll("aside div, aside button, .settings-sidebar div, .settings-sidebar button, .sidebar-item, nav div, nav button");

        sidebarButtons.forEach((item) => {
            item.addEventListener("click", function () {
                const text = this.textContent.trim();
                let targetPaneName = "";

                if (text.includes("Giao diện") || text.toLowerCase().includes("appearance")) targetPaneName = "appearance";
                else if (text.includes("Tùy chỉnh") || text.toLowerCase().includes("customization")) targetPaneName = "customization";
                else if (text.includes("Mô hình") || text.toLowerCase().includes("models")) targetPaneName = "models";
                else if (text.includes("Tiện ích") || text.toLowerCase().includes("extensions")) targetPaneName = "extensions";

                if (targetPaneName) {
                    // Xóa trạng thái active cũ của các mục menu khác
                    sidebarButtons.forEach(el => el.classList.remove("active", "selected"));
                    this.classList.add("active");

                    // Hiển thị pane tương ứng, ẩn các pane còn lại
                    panes.forEach(pane => {
                        if (pane.getAttribute("data-pane") === targetPaneName) {
                            pane.style.display = "block";
                            pane.classList.add("active");
                        } else {
                            pane.style.display = "none";
                            pane.classList.remove("active");
                        }
                    });
                }
            });
        });
    }

    // --- 5. XỬ LÝ LƯU THAY ĐỔI TÙY CHỈNH (Tên hiển thị & Mật khẩu) ---
    const btnSaveCustomize = document.getElementById("btnSaveCustomize");
    if (btnSaveCustomize) {
        btnSaveCustomize.addEventListener("click", async function () {
            const displayName = document.getElementById("inputDisplayName")?.value;
            const oldPassword = document.getElementById("inputOldPass")?.value;
            const newPassword = document.getElementById("inputNewPass")?.value;

            if (newPassword && !oldPassword) {
                alert("Vui lòng nhập mật khẩu cũ để xác nhận đổi mật khẩu!");
                return;
            }

            try {
                const response = await fetch("/api/cap-nhat-tai-khoan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        displayName: displayName,
                        oldPassword: oldPassword,
                        newPassword: newPassword
                    })
                });

                const result = await response.json();
                if (result.success) {
                    alert(result.message);
                    if (document.getElementById("inputOldPass")) document.getElementById("inputOldPass.value") = ""; // fixed
                    if (document.getElementById("inputNewPass")) document.getElementById("inputNewPass.value") = "";
                } else {
                    alert("Lỗi: " + result.message);
                }
            } catch (error) {
                console.error("Lỗi kết nối:", error);
                alert("Không thể kết nối đến máy chủ.");
            }
        });
    }
});

const btnAdminTerminal = document.getElementById("btnAdminTerminal");
if (btnAdminTerminal) {
    btnAdminTerminal.addEventListener("click", function () {
        window.location.href = "/admin/quan-ly-tai-khoan";
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // --- XỬ LÝ KIỂM TRA QUYỀN ADMIN ĐỂ HIỆN/ẨN NÚT QUẢN TRỊ ---
    async function checkAdminPermission() {
        try {
            // Gọi route kiểm tra thông tin user đang đăng nhập (hoặc bạn có thể trả về role từ backend)
            const response = await fetch("/api/kiem tra-quyen"); // Hoặc dùng API lấy thông tin session hiện có của bạn
            const result = await response.json();
            
            const adminSection = document.getElementById("adminSection");

            // Kiểm tra điều kiện: Nếu là admin (hoặc idvaitro thỏa mãn yêu cầu của bạn)
            if (result.success && (result.role === 'admin' || result.idvaitro === 2)) {
                if (adminSection) {
                    adminSection.classList.remove("hidden");
                    adminSection.style.display = "block";
                }
            } else {
                if (adminSection) {
                    adminSection.classList.add("hidden");
                    adminSection.style.display = "none";
                }
            }
        } catch (e) {
            console.error("Không thể kiểm tra phân quyền:", e);
        }
    }

    // Chạy kiểm tra quyền khi tải trang
    checkAdminPermission();

    // Xử lý sự kiện bấm nút chuyển sang trang quản lý tài khoản
    const btnGoToAdminPage = document.getElementById("btnGoToAdminPage");
    if (btnGoToAdminPage) {
        btnGoToAdminPage.addEventListener("click", function () {
            window.location.href = "/admin/quan-ly-tai-khoan";
        });
    }
});