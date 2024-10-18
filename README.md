# PredictiX - Multi-Disease Prediction System

PredictiX is a comprehensive multi-disease prediction platform designed to predict heart disease, diabetes, breast cancer, and lung cancer. Built using the MERN stack and integrated with machine learning models, PredictiX offers an intuitive interface for users to input data and receive accurate health predictions, enhancing the diagnostic experience.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Machine Learning Models](#machine-learning-models)
- [Usage](#usage)
- [Frontend Design](#frontend-design)
- [File Structure](#file-structure)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Features

- **User Authentication:** Secure sign-up and login functionality with protected routes using Context API.
- **Predictive Models:**
  - Heart disease prediction using Logistic Regression.
  - Diabetes prediction using Support Vector Machine (SVM).
  - Breast cancer prediction using Convolutional Neural Network (CNN).
  - Lung cancer prediction using the InceptionResNet model.
- **Image Upload for Cancer Predictions:** Users can upload medical images for breast and lung cancer detection.
- **Prescription Upload:** Automatic form filling for heart disease and diabetes predictors using regex to scan user-uploaded prescriptions.
- **Custom PDF Reports:** Generate a downloadable PDF report of prediction results.
- **Real-time Notifications:** Integrated React Toasts for user-friendly notifications.
- **Single Server Deployment:** Node.js Child Process is used to run all models, eliminating the need for a separate Flask server.

## Tech Stack

- **Frontend:** React JS (with Vite), Context API, React Toasts, Figma for design.
- **Backend:** Node.js, Express.js, Node.js Child Process for running machine learning models.
- **Database:** MongoDB (for user data and predictions).
- **Machine Learning Models:** Logistic Regression, SVM, CNN, InceptionResNet.
- **Other Libraries:** 
  - `pdf-lib` for generating custom PDF reports.
  - `multer` for file uploads (images and prescriptions).
  - `concurrently` for running client and server simultaneously.

## Machine Learning Models

- **Heart Disease Prediction:**
  - Algorithm: Logistic Regression.
  - Input Features:
    - Age, Sex, Chest Pain Type, Resting Blood Pressure, Serum Cholesterol, Fasting Blood Sugar, ECG Results, Max Heart Rate, Exercise Induced Angina, ST Depression, Peak ST Slope, Number of Vessels, Thalassemia.

- **Diabetes Prediction:**
  - Algorithm: Support Vector Machine (SVM).
  - Input Features:
    - Pregnancies, Glucose, Blood Pressure, Skin Thickness, Insulin, BMI, Diabetes Pedigree Function, Age.

- **Breast Cancer Prediction:**
  - Algorithm: Convolutional Neural Network (CNN).
  - Input: Breast tissue image.

- **Lung Cancer Prediction:**
  - Algorithm: InceptionResNet.
  - Input: Lung X-ray or CT scan image.

## Usage

1. **Sign up** or **Log in** to access the predictors.
2. Navigate to the respective disease predictor (Heart, Diabetes, Breast, Lung).
3. **For heart disease and diabetes:** Fill in the form manually or upload a prescription, and the system will auto-populate the fields using regex.
4. **For breast and lung cancer:** Upload an image (X-ray or CT scan).
5. Submit the form and view the prediction result.
6. Download the custom PDF report for future reference.

## Frontend Design

The frontend design has been created using [Figma](https://www.figma.com/design/psQyNMetXUsjCcvmvvjqIg/PredictiX---Final-Year-Project?node-id=0-1&t=KuA0zys1uwoHgMxW-1). It outlines the structure and user flow of the application, ensuring a seamless user experience.

## File Structure

```bash
predictix/
├── client/                # Frontend React code
├── server/                # Backend Node.js code
├── models/                # Machine learning models (.pkl and .h5 files)
├── Screenshots/           # App screenshots (SS1, SS2, SS3, SS4)
└── README.md
```

## Screenshots

### Homepage
![Homepage](https://raw.githubusercontent.com/hallowshaw/PredictiX/main/Screenshots/SS1.png)

### Sign Up Page
![Sign Up](https://raw.githubusercontent.com/hallowshaw/PredictiX/main/Screenshots/SS2.png)

### Predictors Page
![Predictors](https://raw.githubusercontent.com/hallowshaw/PredictiX/main/Screenshots/SS3.png)

### About Page
![About](https://raw.githubusercontent.com/hallowshaw/PredictiX/main/Screenshots/SS4.png)


## Future Enhancements

- **OCR Integration:** Plan to replace regex with Optical Character Recognition (OCR) for extracting prescription data more efficiently.
- **Mobile Application:** Expand PredictiX into a cross-platform mobile app using React Native.
- **Additional Predictors:** Add more disease predictors to extend the functionality.
- **Enhanced Image Processing:** Use more advanced techniques for image analysis, improving accuracy for cancer detection.
- **Integration with Wearables:** Sync health data from wearables for real-time predictions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
