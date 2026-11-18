from flask import Blueprint, render_template, request, jsonify, session
from models.taikhoan_model import (
    lay_danh_sach_tai_khoan, them_tai_khoan, 
    cap_nhat_trang_thai_khoa, reset_mat_khau, xoa_tai_khoan
)

qltaikhoan_bp = Blueprint('qltaikhoan', __name__, template_folder='../templates')

def kiem_tra_admin():
    user = session.get('user')
    if not user:
        return False
    
    # Lấy trực tiếp ma_vai_tro từ dictionary của user trong session
    ma_vai_tro = user.get('ma_vai_tro') if isinstance(user, dict) else getattr(user, 'ma_vai_tro', None)
    
    print("DEBUG kiem_tra_admin -> ma_vai_tro:", ma_vai_tro)
    
    # Chấp nhận cả chuỗi 'quan_tri' hoặc số 2 (để linh hoạt)
    return ma_vai_tro == 'quan_tri' or ma_vai_tro == 2 or str(ma_vai_tro) == '2'

@qltaikhoan_bp.route('/admin/quan-ly-tai-khoan', methods=['GET'])
def trang_quan_ly():
    if not kiem_tra_admin():
        return "Bạn không có quyền truy cập!", 403
    return render_template('tai_khoan/ql_tai_khoan.html')

@qltaikhoan_bp.route('/api/admin/tai-khoan', methods=['GET'])
def api_danh_sach():
    if not kiem_tra_admin():
        return jsonify({"success": False, "message": "Không có quyền!"}), 403
    tu_khoa = request.args.get('search', '').strip()
    data = lay_danh_sach_tai_khoan(tu_khoa)
    return jsonify({"success": True, "data": data})

@qltaikhoan_bp.route('/api/admin/tai-khoan/them', methods=['POST'])
def api_them():
    if not kiem_tra_admin():
        return jsonify({"success": False, "message": "Không có quyền!"}), 403
    req = request.json
    success, msg = them_tai_khoan(
        req.get('username'), 
        req.get('password'), 
        req.get('displayName'), 
        req.get('idvaitro', 1)
    )
    return jsonify({"success": success, "message": msg})

@qltaikhoan_bp.route('/api/admin/tai-khoan/trang-thai', methods=['POST'])
def api_trang_thai():
    if not kiem_tra_admin():
        return jsonify({"success": False, "message": "Không có quyền!"}), 403
    req = request.json
    cap_nhat_trang_thai_khoa(req.get('username'), req.get('isLocked'))
    return jsonify({"success": True, "message": "Cập nhật trạng thái thành công!"})

@qltaikhoan_bp.route('/api/admin/tai-khoan/reset-mat-khau', methods=['POST'])
def api_reset():
    if not kiem_tra_admin():
        return jsonify({"success": False, "message": "Không có quyền!"}), 403
    req = request.json
    reset_mat_khau(req.get('username'), req.get('newPassword', '123456'))
    return jsonify({"success": True, "message": "Đã reset mật khẩu thành công!"})

@qltaikhoan_bp.route('/api/admin/tai-khoan/xoa', methods=['POST'])
def api_xoa():
    if not kiem_tra_admin():
        return jsonify({"success": False, "message": "Không có quyền!"}), 403
    req = request.json
    xoa_tai_khoan(req.get('username'))
    return jsonify({"success": True, "message": "Đã xóa tài khoản thành công!"})

@qltaikhoan_bp.route('/api/admin/tai-khoan/sua', methods=['POST'])
def api_sua():
    if not kiem_tra_admin():
        return jsonify({"success": False, "message": "Không có quyền!"}), 403
    
    req = request.json
    if not req:
        return jsonify({"success": False, "message": "Dữ liệu không hợp lệ!"}), 400
        
    username_goc = req.get('usernameGoc')
    username_moi = req.get('username')
    ho_ten = req.get('displayName')
    ma_vai_tro = req.get('role')
    dang_hoat_dong = 1 if req.get('isLocked') == 0 or req.get('isLocked') == False else 0
    password_moi = req.get('password') # Có thể để trống nếu không muốn đổi pass
    
    success, msg = sua_tai_khoan(username_goc, username_moi, ho_ten, ma_vai_tro, dang_hoat_dong, password_moi)
    return jsonify({"success": success, "message": msg})