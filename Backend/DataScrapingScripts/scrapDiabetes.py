import json
import fitz  # PyMuPDF
import re
import sys

if len(sys.argv) != 2:
    print("Usage: python scrapDiabetes.py <pdf_path>")
    sys.exit(1)

# Path to the PDF file
pdf_path = sys.argv[1]

try:
    # Open the PDF file
    pdf_document = fitz.open(pdf_path)
    page = pdf_document.load_page(0)
    text = page.get_text()
except Exception as e:
    print(f"Error opening or reading PDF: {e}")
    sys.exit(1)

# Function to extract values using regular expressions with error handling
def extract_value(pattern, text, default=None):
    try:
        match = re.search(pattern, text)
        if match:
            return match.group(1)
        return default
    except Exception as e:
        print(f"Error extracting value with pattern '{pattern}': {e}")
        return default

# Extract values with error handling
results = {}
try:
    results['Pregnancies'] = extract_value(r'Pregnancies:\s+(\d+)', text)
    results['Glucose'] = extract_value(r'Glucose:\s+(\d+)', text)
    results['BloodPressure'] = extract_value(r'Blood Pressure:\s+(\d+)', text)
    results['SkinThickness'] = extract_value(r'Skin Thickness:\s+(\d+)', text)
    results['Insulin'] = extract_value(r'Insulin:\s+(\d+)', text)
    results['BMI'] = extract_value(r'BMI:\s+(\d+\.\d+)', text)
    results['DiabetesPedigreeFunction'] = extract_value(r'Diabetes Pedigree Function:\s+(\d+\.\d+)', text)
    results['Age'] = extract_value(r'Age:\s+(\d+)', text)
except Exception as e:
    print(f"Error extracting results: {e}")
    sys.exit(1)

# Print the extracted results
print(json.dumps(results))
