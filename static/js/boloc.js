let globalBoLocList = [];
let currentPage = 1;
let pageSize = 25;
let currentSearch = "";

document.addEventListener("DOMContentLoaded", function () {
    loadBoLocList();
    loadChuDeDropdown();

    // Tìm kiếm real-time
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", function() {
            currentSearch = this.value.trim();
            currentPage = 1;
            renderTableAndPagination();
        });
    }

    // Submit form thêm / sửa bộ lọc
    const boLocForm = document.getElementById("boLocForm");
    if (boLocForm) {
        boLocForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const id = document.getElementById("boLocId").value;
            const payload = {
                id: id ? parseInt(id) : null,
                ten_bo_loc: document.getElementById("tenBoLoc").value.trim(),
                doi_tuong_ap_dung: document.getElementById("doiTuong").value,
                khoi_lop: document.getElementById("khoiLop").value.trim(),
                mon_hoc: document.getElementById("monHoc").value.trim(),
                ky_thi: document.getElementById("kyThi").value.trim(),
                muc_dich_su_dung: document.getElementById("mucDich").value.trim(),
                do_kho: document.getElementById("doKho").value,
                muc_do_nhan_thuc: document.getElementById("mucDoNhanThuc").value
            };

            const url = id ? "/api/admin/bo-loc/sua" : "/api/admin/bo-loc/them";
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            alert(result.message);
            if(result.success) {
                dongModal();
                loadBoLocList();
                this.reset();
            }
        });
    }
});

async function loadBoLocList() {
    try {
        const res = await fetch('/api/admin/bo-loc');
        const result = await res.json();
        if(result.success) {
            globalBoLocList = result.data;
            renderTableAndPagination();
        }
    } catch (err) { console.error(err); }
}

function renderTableAndPagination() {
    let filtered = globalBoLocList.filter(item => 
        item.ten_bo_loc.toLowerCase().includes(currentSearch.toLowerCase()) ||
        item.ma_bo_loc.toLowerCase().includes(currentSearch.toLowerCase()) ||
        item.mon_hoc.toLowerCase().includes(currentSearch.toLowerCase()) ||
        item.ky_thi.toLowerCase().includes(currentSearch.toLowerCase())
    );

    let totalItems = filtered.length;
    let totalPages = Math.ceil(totalItems / pageSize) || 1;
    if(currentPage > totalPages) currentPage = totalPages;

    let startIdx = (currentPage - 1) * pageSize;
    let endIdx = startIdx + pageSize;
    let paginatedItems = filtered.slice(startIdx, endIdx);

    const tbody = document.getElementById("boLocTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if(paginatedItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #888; padding: 25px;">Không tìm thấy bộ lọc nào phù hợp.</td></tr>`;
        document.getElementById("tableInfo").innerText = `Hiển thị 0 trên tổng số ${totalItems} bộ lọc`;
        document.getElementById("paginationContainer").innerHTML = "";
        return;
    }

    paginatedItems.forEach((item, index) => {
        let stt = startIdx + index + 1;
        tbody.innerHTML += `
            <tr>
                <td style="text-align: center; color: #888;">${stt}</td>
                <td><b>${item.ten_bo_loc}</b><br><span style="font-size:12px; color:#888;">${item.ma_bo_loc}</span></td>
                <td><span style="background: #252525; padding: 3px 8px; border-radius: 4px; font-size: 12px; color: #007bff;">${item.doi_tuong_ap_dung || 'Chung'}</span></td>
                <td>${item.khoi_lop || '--'}</td>
                <td>${item.mon_hoc || '--'}</td>
                <td>${item.ky_thi || '--'}</td>
                <td>${item.muc_dich_su_dung || '--'}</td>
                <td><span style="font-size: 12px; color: #ffc107;">${item.do_kho || '--'} (${item.muc_do_nhan_thuc || '--'})</span></td>
                <td style="text-align: center;">
                    <button onclick='suaBoLoc(${JSON.stringify(item)})' style="padding: 4px 8px; background: #ffc107; color: #000; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 5px;">Sửa</button>
                    <button onclick="xoaBoLoc(${item.id})" style="padding: 4px 8px; background: #dc3545; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Xóa</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("tableInfo").innerText = `Hiển thị từ ${startIdx + 1} đến ${Math.min(endIdx, totalItems)} trên tổng số ${totalItems} bộ lọc`;
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

function moModalThem() {
    document.getElementById("modalTitle").innerText = "Thêm Bộ Lọc Yêu Cầu Mới";
    document.getElementById("boLocId").value = "";
    document.getElementById("boLocForm").reset();
    document.getElementById("boLocModal").style.display = "flex";
}

function suaBoLoc(item) {
    document.getElementById("modalTitle").innerText = "Chỉnh Sửa Bộ Lọc Yêu Cầu";
    document.getElementById("boLocId").value = item.id;
    document.getElementById("tenBoLoc").value = item.ten_bo_loc;
    document.getElementById("doiTuong").value = item.doi_tuong_ap_dung;
    document.getElementById("khoiLop").value = item.khoi_lop;
    document.getElementById("monHoc").value = item.mon_hoc;
    document.getElementById("kyThi").value = item.ky_thi;
    document.getElementById("mucDich").value = item.muc_dich_su_dung;
    document.getElementById("doKho").value = item.do_kho;
    document.getElementById("mucDoNhanThuc").value = item.muc_do_nhan_thuc;
    document.getElementById("boLocModal").style.display = "flex";
}

function dongModal() {
    document.getElementById("boLocModal").style.display = "none";
}

async function xoaBoLoc(id) {
    if(confirm("Bạn có chắc chắn muốn xóa bộ lọc này không?")) {
        const res = await fetch("/api/admin/bo-loc/xoa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        const result = await res.json();
        alert(result.message);
        loadBoLocList();
    }
}

async function loadChuDeDropdown() {
    try {
        // Đảm bảo đường dẫn này khớp với route API lấy danh sách chủ đề của bạn
        const res = await fetch('/api/admin/chu-de');
        const result = await res.json();
        
        // Hỗ trợ cả 2 trường hợp cấu trúc trả về: result.data hoặc trực tiếp là mảng result
        const danhSach = result.data || result;
        
        const select = document.getElementById("selectChuDe");
        if(select) {
            select.innerHTML = `<option value="">-- Chọn chủ đề liên kết --</option>`;
            if(Array.isArray(danhSach)) {
                danhSach.forEach(item => {
                    let displayName = item.chu_de_cha_id ? `↳ ${item.ten_chu_de}` : item.ten_chu_de;
                    select.innerHTML += `<option value="${item.id}">${displayName} (${item.linh_vuc || 'Chung'})</option>`;
                });
            }
        }
    } catch (err) { 
        console.error("Lỗi tải danh sách chủ đề cho dropdown:", err); 
    }
}