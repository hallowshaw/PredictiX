import json
import fitz  # PyMuPDF
import re
import joblib
import sys
import numpy as np
import warnings

if len(sys.argv) != 2:
    print("Usage: python scrap.py <pdf_path>")
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
    results['Age'] = extract_value(r'Age:\s+(\d+)', text)
    results['Sex'] = extract_value(r'Sex:\s+(\w+)', text)
    results['Chest pain type'] = extract_value(r'Chest pain type:\s+(\d+)', text)
    results['Resting blood pressure'] = extract_value(r'Resting blood pressure:\s+(\d+)', text)
    results['Serum cholesterol in mg/dl'] = extract_value(r'Serum cholesterol in mg/dl:\s+(\d+)', text)
    results['Fasting blood sugar > 120 mg/dl'] = extract_value(r'Fasting blood sugar > 120 mg/dl:\s+(\w+)', text, 'Negative')
    results['Resting Electrocardiographic Results'] = extract_value(r'Resting Electrocardiographic Results:\s+(\d+)', text)
    results['Maximum Heart Rate Achieved'] = extract_value(r'Maximum Heart Rate Achieved:\s+(\d+)', text)
    results['Exercise Induced Angina'] = extract_value(r'Exercise Induced Angina:\s+(\d+)', text)
    results['Old peak'] = extract_value(r'Old peak:\s+(\d+\.\d+)', text)
    results['Slope of the peak exercise ST Segment'] = extract_value(r'Slope of the peak exercise ST Segment:\s+(\d+)', text)
    results['Number of major vessels (0-3) colored by fluoroscopy'] = extract_value(r'Number of major vessels \(0-3\) colored by fluoroscopy:\s+(\d+)', text)
    results['Thal (Thallium Stress Test Result)'] = extract_value(r'Thal \(Thallium Stress Test Result\):\s+(\d+)', text)
except Exception as e:
    print(f"Error extracting results: {e}")
    sys.exit(1)

# Mapping Sex to a numeric value if needed (e.g., Male=1, Female=0)
sex_mapping = {'Male': 1, 'Female': 0}
results['Sex'] = sex_mapping.get(results['Sex'], -1)  # Default to -1 if sex is not Male or Female

# Print the extracted results
print(json.dumps(results))
