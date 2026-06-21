from flask import Flask
from flask_cors import CORS
from routes.upload import upload_bp
from routes.query import query_bp
from routes.documents import documents_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(upload_bp)
app.register_blueprint(query_bp)
app.register_blueprint(documents_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5000)