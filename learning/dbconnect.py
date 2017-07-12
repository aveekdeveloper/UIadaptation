import mysql.connector
import pandas as pd
import numpy as np
from scipy import stats
from scipy.spatial.distance import pdist, squareform
from scipy.cluster.hierarchy import linkage, dendrogram
import seaborn as sns; sns.set(color_codes=True)

import emotionanalysis as em




from flask import *
app = Flask(__name__)


emotiondata = 0;
cnx = mysql.connector.connect(user='root', password='root',
                              host='127.0.0.1',
                              port='8889',
                              database='emotiondb')

@app.route("/")
def init():

    emotiondata = pd.read_sql('select * from emotion', con=cnx)

    #print(emotiondata)

    return "Emotion data loaded: "+str(len(emotiondata)) + " rows"


#cnx.close()
