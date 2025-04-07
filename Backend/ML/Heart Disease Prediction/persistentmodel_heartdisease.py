# -*- coding: utf-8 -*-
"""PersistentModel_HeartDisease.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/11QYWiMp9iLn3wN5P32E84V6DALVw_X9l

# Loading persistent model and testing it
"""

import pickle

with open("heart_disease.pkl","rb") as file:
  model = pickle.load(file)

prediction = model.predict([[58,0,0,100,248,0,0,122,0,1,1,0,2]])

prediction

if (prediction[0] == 0):
 print("The person is not suffering from Heart Disease")
else:
  print("The person is suffering from Heart Disease")