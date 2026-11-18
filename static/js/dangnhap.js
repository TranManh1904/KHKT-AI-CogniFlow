/* ============================================================
   CogniFlow — dangnhap.js (Chỉ chuyên xử lý trang đăng nhập)
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form") || document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault(); // Ngăn không cho form reload trang theo cách truyền thống

            const emailInput = document.getElementById("loginEmail") || document.querySelector('input[name="loginEmail"]');
            const passwordInput = document.getElementById("loginPassword") || document.querySelector('input[name="loginPassword"]');

            if (!emailInput || !passwordInput) {
                console.error("Không tìm thấy input đăng nhập!");
                return;
            }

            const formData = new FormData();
            formData.append("loginEmail", emailInput.value);
            formData.append("loginPassword", passwordInput.value);

            try {
                const response = await fetch("/dang-nhap", {
                    method: "POST",
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    // Đăng nhập thành công -> Chuyển hướng sang trang chủ
                    window.location.href = result.redirect;
                } else {
                    // Đăng nhập thất bại -> Hiển thị thông báo lỗi
                    alert(result.message || "Tên đăng nhập hoặc mật khẩu không chính xác!");
                }
            } catch (error) {
                console.error("Lỗi kết nối:", error);
                alert("Đã xảy ra lỗi kết nối đến máy chủ.");
            }
        });
    }
});