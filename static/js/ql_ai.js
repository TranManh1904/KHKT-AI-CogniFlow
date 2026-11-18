document.addEventListener("DOMContentLoaded", function () {
        loadAIList();

        const searchInput = document.getElementById("searchInput");
        if(searchInput) {
            searchInput.addEventListener("input", function() {
                loadAIList(this.value.trim());
            });
        }
    });

    async function loadAIList(search = "") {
        try {
            const res = await fetch(`/api/admin/ai?search=${encodeURIComponent(search)}`);
            const result = await res.json();
            if(result.success) {
                renderTable(result.data);
            }
        } catch (err) {
            console.error(err);
        }
    }

    function renderTable(data) {
        const tbody = document.getElementById("aiTableBody");
        tbody.innerHTML = "";
        if(data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #888; padding: 20px;">Chưa có cấu hình AI nào.</td></tr>`;
            return;
        }

        data.forEach(item => {
            const statusBadge = item.dang_su_dung === 1 
                ? '<span style="color: #28a745; font-weight: bold;">● Đang sử dụng</span>' 
                : '<span style="color: #888;">Không dùng</span>';

            tbody.innerHTML += `
                <tr>
                    <td><b>${item.ten_hien_thi}</b><br><span style="font-size:12px; color:#888;">${item.ma_cau_hinh}</span></td>
                    <td><span style="background: #2a2a2a; padding: 3px 8px; border-radius: 4px; font-size: 12px;">${item.nha_cung_cap}</span></td>
                    <td>${item.ten_model}</td>
                    <td>${item.so_token_toi_da}</td>
                    <td>${statusBadge}</td>
                    <td>${item.nguoi_tao}</td>
                    <td style="text-align: center;">
                        <button onclick="xoaAI(${item.id})" style="padding: 4px 10px; background: #dc3545; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Xóa</button>
                    </td>
                </tr>
            `;
        });
    }

    function moModalThem() {
        document.getElementById("aiModal").style.display = "flex";
    }

    function dongModal() {
        document.getElementById("aiModal").style.display = "none";
    }

    document.getElementById("aiForm").addEventListener("submit", async function(e) {
        e.preventDefault();
        const payload = {
            ma_cau_hinh: document.getElementById("maCauHinh").value.trim(),
            nha_cung_cap: document.getElementById("nhaCungCap").value,
            ten_hien_thi: document.getElementById("tenHienThi").value.trim(),
            dia_chi_api: document.getElementById("diaChiApi").value.trim(),
            khoa_api_ma_hoa: document.getElementById("khoaApi").value.trim(), // Lưu ý mã hóa thực tế ở backend nếu cần
            ten_model: document.getElementById("tenModel").value.trim(),
            so_token_toi_da: parseInt(document.getElementById("soToken").value) || 1000,
            dang_su_dung: parseInt(document.getElementById("dangSuDung").value)
        };

        const res = await fetch("/api/admin/ai/them", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const result = await res.json();
        alert(result.message);
        if(result.success) {
            dongModal();
            loadAIList();
            this.reset();
        }
    });

    async function xoaAI(id) {
        if(confirm("Bạn có chắc chắn muốn xóa cấu hình AI này không?")) {
            const res = await fetch("/api/admin/ai/xoa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            const result = await res.json();
            alert(result.message);
            loadAIList();
        }
    }