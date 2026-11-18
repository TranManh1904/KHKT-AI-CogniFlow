import pyodbc

def get_db_connection():
    try:
        conn = pyodbc.connect(
            'DRIVER={ODBC Driver 17 for SQL Server};'
            'SERVER=ADMINISTRATOR\\SQL2019;'  # Thay đổi tên Server SQL Server cho khớp với máy của bạn
            'DATABASE=CogniFlow;'
            'Trusted_Connection=yes;'
        )
        return conn
    except Exception as e:
        print(f"Lỗi kết nối CSDL: {e}")
        return None