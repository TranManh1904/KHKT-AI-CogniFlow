from flask import Blueprint, render_template, request, jsonify, session
from models.chude_model import lay_tat_ca_chu_de, them_chu_de, xoa_chu_de
from routes.connect_db import get_db_connection

chu_de_bp = Blueprint('chu_de_quan_ly', __name__, template_folder='../templates')

def kiem_tra_admin():
    user = session.get('user')
    if not user: return False
    ma_vai_tro = user.get('ma_vai_tro') if isinstance(user, dict) else getattr(user, 'ma_vai_tro', None)
    return ma_vai_tro == 'quan_tri' or ma_vai_tro == 2 or str(ma_vai_tro) == '2'

@chu_de_bp.route('/admin/quan-ly-chu-de', methods=['GET'])
def trang_quan_ly_chu_de():
    if not kiem_tra_admin():
        return "Bạn không có quyền truy cập!", 403
    return render_template('admin/chu_de.html')

@chu_de_bp.route('/api/admin/chu-de', methods=['GET'])
def api_lay_danh_sach_chu_de():
    if not kiem_tra_admin():
        return jsonify({"success": False, "message": "Không có quyền!"}), 403
    tu_khoa = request.args.get('search', '')
    data = lay_tat_ca_chu_de(tu_khoa)
    return jsonify({"success": True, "data": data})

@chu_de_bp.route('/api/admin/chu-de/them', methods=['POST'])
def api_them_chu_de():
    if not kiem_tra_admin():
        return jsonify({"success": False, "message": "Không có quyền!"}), 403
    data = request.json
    success, msg = them_chu_de(data)
    return jsonify({"success": success, "message": msg})

@chu_de_bp.route('/api/admin/chu-de/xoa', methods=['POST'])
def api_xoa_chu_de():
    if not kiem_tra_admin():
        return jsonify({"success": False, "message": "Không có quyền!"}), 403
    chu_de_id = request.json.get('id')
    xoa_chu_de(chu_de_id)
    return jsonify({"success": True, "message": "Đã xóa chủ đề thành công!"})

@chu_de_bp.route('/api/admin/chu-de/tao-ma', methods=['GET'])
def api_tao_ma_chu_de():
    if not kiem_tra_admin():
        return jsonify({"success": False, "ma_tu_dong": ""}), 403
    
    ten_chu_de = request.args.get('ten', '')
    if not ten_chu_de:
        return jsonify({"success": True, "ma_tu_dong": ""})
    
    # Lấy chữ cái đầu của từng từ, viết hoa (VD: "Hướng dẫn giải" -> "HDG")
    import re
    words = ten_chu_de.strip().split()
    prefix = "".join([w[0].upper() for w in words if w])
    # Lọc bỏ dấu tiếng Việt cho tiền tố chuẩn ASCII nếu muốn, hoặc giữ nguyên
    import unicodedata
    prefix = ''.join(c for c in unicodedata.normalize('NFD', prefix) if unicodedata.category(c) != 'Mn')
    
    # Tìm mã lớn nhất hiện tại có tiền tố này trong CSDL để tăng số thứ tự lên 1
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT ma_chu_de FROM DM_ChuDe WHERE ma_chu_de LIKE ?", (f"{prefix}%",))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    
    max_num = 0
    for r in rows:
        ma = r[0]
        # Tách phần số phía sau prefix ra
        num_part = ma.replace(prefix, "")
        if num_part.isdigit():
            val = int(num_part)
            if val > max_num:
                max_num = val
                
    next_num = max_num + 1
    ma_tu_dong = f"{prefix}{str(next_num).zfill(5)}" # Định dạng 5 chữ số: 00001, 00002...
    
    return jsonify({"success": True, "ma_tu_dong": ma_tu_dong})