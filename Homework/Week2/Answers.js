##- hw2-1
db.movieDetails.find({year:2013,rated:'PG-13',"awards.wins":0},{title:true}).pretty()

##- hw2-3
db.MovieDetails.count({"countries.1":'Sweden'})

##- hw2-4
db.movieDetails.count({genres:['comedy','Crime']})

##- hw2-5
db.movieDetails.count({$and:[{genres:'Crime'},{genres:'Comedy'}]})

db.movieDetails.count({genres:{$all:['Crime','Comedy']}})




