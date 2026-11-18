from flask import Blueprint, render_template, request, jsonify, session
from models.ai_model import lay_danh_sach_ai, them_cau_hinh_ai, xoa_cau_hinh_ai

ai_bp = Blueprint('ai_quan_ly', __name__, template_folder='../templates')

def kiem_tra_admin():
    user = session.get('user')
    if not user: return False
    ma_vai_tro = user.get('ma_vai_tro') if isinstance(user, dict) else getattr(user, 'ma_vai_tro', None)
    return ma_vai_tro == 'quan_tri' or ma_vai_tro == 2 or str(ma_vai_tro) == '2'

@ai_bp.route('/admin/quan-ly-ai', methods=['GET'])
def trang_quan_ly_ai():
    if not kiem_tra_admin():
        return "Bạn không có quyền truy cập!", 403
    return render_template('admin/quan_ly_ai.html')

@ai_bp.route('/api/admin/ai', methods=['GET'])
def api_lay_danh_sach_ai():
    if not kiem_tra_admin():
        return jsonify({"success": False, "message": "Không có quyền!"}), 403
    tu_khoa = request.args.get('search', '')
    data = lay_danh_sach_ai(tu_khoa)
    return jsonify({"success": True, "data": data})

@ai_bp.route('/api/admin/ai/them', methods=['POST'])
def api_them_ai():
    if not kiem_tra_admin():
        return jsonify({"success": False, "message": "Không có quyền!"}), 403
    data = request.json
    success, msg = them_cau_hinh_ai(data)
    return jsonify({"success": success, "message": msg})

@ai_bp.route('/api/admin/ai/xoa', methods=['POST'])
def api_xoa_ai():
    if not kiem_tra_admin():
        return jsonify({"success": False, "message": "Không có quyền!"}), 403
    ai_id = request.json.get('id')
    xoa_cau_hinh_ai(ai_id)
    return jsonify({"success": True, "message": "Đã xóa cấu hình AI thành công!"})