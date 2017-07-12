var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  port: "8889",
  user: "root",
  password: "root",
  database: "emotiondb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = {
  addEmotion2DB: function(emotiondata){
    Insert2DB(emotiondata.timestamp, emotiondata.user_id, emotiondata.var_i, emotiondata.var_f,
    emotiondata['emotions[happiness]'], emotiondata['emotions[surprise]'], emotiondata['emotions[neutral]'],
    emotiondata['emotions[contempt]'], emotiondata['emotions[anger]'], emotiondata['emotions[disgust]'],
    emotiondata['emotions[fear]'], emotiondata['emotions[sadness]']
  )
    //console.log(JSON.stringify(emotiondata));
  }

 }

 function Insert2DB(time, uid,var_i,var_f,e_happ,e_surp,e_neut,e_cont,e_ang,e_disg,e_fea,e_sad){
   var sql = "INSERT INTO emotion (`timestamp`, `user_id`, `initial_variant`," +
     "`final_variant`, `happiness`, `surprise`, `neutral`, `contempt`, `anger`,"+
     " `disgust`, `fear`, `sadness`) VALUES( ? )";
   var values = [time, uid,var_i,var_f,e_happ,
     e_surp,e_neut,e_cont,e_ang,e_disg,e_fea,e_sad ];
   var query = con.query(sql,[values], function (err, result) {
    if (err) throw err;
    //console.log("1 record inserted");
  });

  //console.log(query.sql);
 }
