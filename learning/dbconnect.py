import mysql.connector
import pandas as pd
from flask import *
app = Flask(__name__)



@app.route("/")
def hello():
    cnx = mysql.connector.connect(user='root', password='root',
                                  host='127.0.0.1',
                                  port='8889',
                                  database='emotiondb')

    df_emot = pd.read_sql('select * from emotion', con=cnx)

    print(df_emot)

    return df_emot.to_string()


#cnx.close()
