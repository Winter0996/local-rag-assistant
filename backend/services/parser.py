import pdfplumber

def parse_file(filepath: str, filename: str) -> str:
    if filename.endswith(".pdf"):
        text = ""
        with pdfplumber.open(filepath) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        return text
    elif filename.endswith((".txt", ".md")):
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()
    else:
        raise ValueError(f"Unsupported file type: {filename}")