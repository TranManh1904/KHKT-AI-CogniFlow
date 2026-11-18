from flask import Blueprint, render_template, request, jsonify, session
from models.boloc_model import lay_danh_sach_bo_loc, them_bo_loc, sua_bo_loc, xoa_bo_loc

bo_loc_bp = Blueprint('bo_loc_quan_ly', __name__, template_folder='../templates')

def kiem_tra_admin():
    user = session.get('user')
    if not user: return False
    ma_vai_tro = user.get('ma_vai_tro') if isinstance(user, dict) else getattr(user, 'ma_vai_tro', None)
    return ma_vai_tro == 'quan_tri' or ma_vai_tro == 2 or str(ma_vai_tro) == '2'

@bo_loc_bp.route('/admin/quan-ly-bo-loc', methods=['GET'])
def trang_quan_ly_bo_loc():
    if not kiem_tra_admin():
        return "Bạn không có quyền truy cập!", 403
    return render_template('admin/quan_ly_bo_loc.html')

@bo_loc_bp.route('/api/admin/bo-loc', methods=['GET'])
def api_lay_danh_sach_bo_loc():
    if not kiem_tra_admin():
        return jsonify({"success": False, "message": "Không có quyền!"}), 403
    tu_khoa = request.args.get('search', '')
    data = lay_danh_sach_bo_loc(tu_khoa)
    return jsonify({"success": True, "data": data})

@bo_loc_bp.route('/api/admin/bo-loc/them', methods=['POST'])
def api_them_bo_loc():
    if not kiem_tra_admin():
        return jsonify({"success": False, "message": "Không có quyền!"}), 403
    data = request.json
    success, msg = them_bo_loc(data)
    return jsonify({"success": success, "message": msg})

@bo_loc_bp.route('/api/admin/bo-loc/sua', methods=['POST'])
def api_sua_bo_loc():
    if not kiem_tra_admin():
        return jsonify({"success": False, "message": "Không có quyền!"}), 403
    data = request.json
    success, msg = sua_bo_loc(data)
    return jsonify({"success": success, "message": msg})

@bo_loc_bp.route('/api/admin/bo-loc/xoa', methods=['POST'])
def api_xoa_bo_loc():
    if not kiem_tra_admin():
        return jsonify({"success": False, "message": "Không có quyền!"}), 403
    bo_loc_id = request.json.get('id')
    xoa_bo_loc(bo_loc_id)
    return jsonify({"success": True, "message": "Đã xóa bộ lọc thành công!"})