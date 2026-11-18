let globalChuDeList = [];
let currentPage = 1;
let pageSize = 25;
let currentSearch = "";

document.addEventListener("DOMContentLoaded", function () {
    loadChuDeList();

    // 1. Lắng nghe sự kiện tìm kiếm
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", function() {
            currentSearch = this.value.trim();
            currentPage = 1; // Reset về trang 1 khi tìm kiếm
            renderTableAndPagination();
        });
    }

    // 2. Tự động sinh mã khi gõ tên chủ đề
    let timeoutId = null;
    const tenChuDeInput = document.getElementById("tenChuDe");
    if (tenChuDeInput) {
        tenChuDeInput.addEventListener("input", function() {
            const tenVal = this.value.trim();
            clearTimeout(timeoutId);
            if(!tenVal) {
                document.getElementById("maChuDe").value = "";
                return;
            }
            timeoutId = setTimeout(async () => {
                try {
                    const res = await fetch(`/api/admin/chu-de/tao-ma?ten=${encodeURIComponent(tenVal)}`);
                    const result = await res.json();
                    if(result.success && result.ma_tu_dong) {
                        document.getElementById("maChuDe").value = result.ma_tu_dong;
                    }
                } catch(err) { console.error("Lỗi tạo mã tự động:", err); }
            }, 300);
        });
    }

    // 3. Xử lý submit form thêm chủ đề
    const chuDeForm = document.getElementById("chuDeForm");
    if (chuDeForm) {
        chuDeForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const payload = {
                ma_chu_de: document.getElementById("maChuDe").value.trim(),
                ten_chu_de: document.getElementById("tenChuDe").value.trim(),
                chu_de_cha_id: document.getElementById("selectChuDeCha").value,
                linh_vuc: document.getElementById("linhVuc").value.trim(),
                mo_ta: document.getElementById("moTa").value.trim()
            };

            const res = await fetch("/api/admin/chu-de/them", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            alert(result.message);
            if(result.success) {
                dongModal();
                loadChuDeList();
                this.reset();
            }
        });
    }
});

async function loadChuDeList() {
    try {
        const res = await fetch('/api/admin/chu-de');
        const result = await res.json();
        if(result.success) {
            globalChuDeList = result.data;
            renderDropdownCha(globalChuDeList);
            renderTableAndPagination();
        }
    } catch (err) { console.error(err); }
}

// Thuật toán sắp xếp: Chủ đề cha đứng trên, Chủ đề con nằm ngay bên dưới
function sapXepCayChuDe(data) {
    let roots = data.filter(item => !item.chu_de_cha_id);
    let children = data.filter(item => item.chu_de_cha_id);
    let sortedList = [];

    roots.forEach(root => {
        sortedList.push(root);
        let childsOfRoot = children.filter(c => c.chu_de_cha_id === root.id);
        childsOfRoot.forEach(child => {
            sortedList.push(child);
        });
    });

    // Thêm các chủ đề con mồ côi (nếu có)
    children.forEach(item => {
        if (!sortedList.some(s => s.id === item.id)) {
            sortedList.push(item);
        }
    });

    return sortedList;
}

function renderTableAndPagination() {
    // Lọc theo từ khóa tìm kiếm
    let filtered = globalChuDeList.filter(item => 
        item.ten_chu_de.toLowerCase().includes(currentSearch.toLowerCase()) ||
        item.ma_chu_de.toLowerCase().includes(currentSearch.toLowerCase()) ||
        (item.linh_vuc && item.linh_vuc.toLowerCase().includes(currentSearch.toLowerCase()))
    );

    // Sắp xếp phân cấp cha - con
    let sorted = sapXepCayChuDe(filtered);

    // Phân trang
    let totalItems = sorted.length;
    let totalPages = Math.ceil(totalItems / pageSize) || 1;
    if(currentPage > totalPages) currentPage = totalPages;

    let startIdx = (currentPage - 1) * pageSize;
    let endIdx = startIdx + pageSize;
    let paginatedItems = sorted.slice(startIdx, endIdx);

    const tbody = document.getElementById("chuDeTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if(paginatedItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #888; padding: 25px;">Không tìm thấy chủ đề nào phù hợp.</td></tr>`;
        document.getElementById("tableInfo").innerText = `Hiển thị 0 trên tổng số ${totalItems} chủ đề`;
        document.getElementById("paginationContainer").innerHTML = "";
        return;
    }

    paginatedItems.forEach((item, index) => {
        let stt = startIdx + index + 1;
        let displayName = item.chu_de_cha_id ? `<span style="padding-left: 20px; color: #ccc;">↳ ${item.ten_chu_de}</span>` : `<b style="color: #fff;">${item.ten_chu_de}</b>`;
        
        tbody.innerHTML += `
            <tr>
                <td style="text-align: center; color: #888;">${stt}</td>
                <td>${displayName}</td>
                <td><code>${item.ma_chu_de}</code></td>
                <td><span style="background: #2a2a2a; padding: 3px 8px; border-radius: 4px; font-size: 12px;">${item.linh_vuc || 'Chung'}</span></td>
                <td style="color: #aaa;">${item.ten_chu_de_cha}</td>
                <td style="color: #bbb;">${item.mo_ta || ''}</td>
                <td style="text-align: center;">
                    <button onclick="xoaChuDe(${item.id})" style="padding: 4px 10px; background: #dc3545; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Xóa</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("tableInfo").innerText = `Hiển thị từ ${startIdx + 1} đến ${Math.min(endIdx, totalItems)} trên tổng số ${totalItems} chủ đề`;
    renderPaginationControls(totalPages);
}

function renderPaginationControls(totalPages) {
    const container = document.getElementById("paginationContainer");
    if (!container) return;
    container.innerHTML = "";

    if(totalPages <= 1) return;

    container.innerHTML += `<button class="page-btn" ${currentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} onclick="changePage(${currentPage - 1})">«</button>`;

    for(let i = 1; i <= totalPages; i++) {
        container.innerHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }

    container.innerHTML += `<button class="page-btn" ${currentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} onclick="changePage(${currentPage + 1})">»</button>`;
}

function changePage(page) {
    currentPage = page;
    renderTableAndPagination();
}

function changePageSize() {
    pageSize = parseInt(document.getElementById("pageSizeSelect").value);
    currentPage = 1;
    renderTableAndPagination();
}

function renderDropdownCha(data) {
    const select = document.getElementById("selectChuDeCha");
    if (!select) return;
    select.innerHTML = `<option value="">-- Là chủ đề gốc (Cấp cao nhất) --</option>`;
    data.forEach(item => {
        select.innerHTML += `<option value="${item.id}">${item.ten_chu_de} (${item.linh_vuc || 'Chung'})</option>`;
    });
}

function moModalThem() { 
    const modal = document.getElementById("chuDeModal");
    if (modal) modal.style.display = "flex"; 
}

function dongModal() { 
    const modal = document.getElementById("chuDeModal");
    if (modal) modal.style.display = "none"; 
}

async function xoaChuDe(id) {
    if(confirm("Xóa chủ đề này sẽ bao gồm cả các chủ đề con bên trong. Bạn có chắc không?")) {
        const res = await fetch("/api/admin/chu-de/xoa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        const result = await res.json();
        alert(result.message);
        loadChuDeList();
    }
}