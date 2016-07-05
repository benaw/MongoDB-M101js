//6.1

// mongoimport --drop -d week6 -c companies companies.json

db.companies.aggregate( [
    { $match: { "relationships.person": { $ne: null } } },
    { $project: { relationships: 1, _id: 0 } },
    { $unwind: "$relationships" },
    { $group: {
        _id: "$relationships.person",
        count: { $sum: 1 }
    } },
    {$match: {"_id.permalink":"roger-ehrenberg"}},
    { $sort: { count: -1 } }
] ).pretty()



var person = 'eric-di-benedetto';
db.companies.aggregate([
  { $match: { "relationships.person.permalink": person} },
    { $group: {
        _id: { "relationships.person.permalink": person },
        uniqueCompanies: { $addToSet: "$permalink" }
    } },
    { $project: {
        uniqueCompaniesNumber: { $size: '$uniqueCompanies' }
    } }
]).pretty()

// 6.2

// mongoimport --drop -d week6 -c grades grades.json

db.grades.aggregate([
    { $project: { 
      class_id : 1,
      scores:{
        $filter:{
          input:'$scores',
          as:'scoreFilter',
          cond:{$ne: ['$$scoreFilter.type', 'quiz']}
        }
      }
     } },
    { $unwind: "$scores" },
    { $group: {
        _id: {class_id: '$class_id'},
        studentAverage: { $avg: '$scores.score'},

    } },
    { $sort: { "studentAverage": -1 } }
    
]).pretty()

// 6.3

db.companies.aggregate( [
    { $match : { founded_year : 2004 } }, //filter for 2004 founded
    { $project :
      {
      _id: 0,
      name : 1,
      funding_rounds:1,
      numRounds:{$size:"$funding_rounds"}, //Determine Size (length) of array funding_rounds
     }
   },
   { $match : { numRounds : {$gte: 5} } }, //match only those whos funding_rounds lengths exceed 4
   { $project :
     {
     _id: 0,
     name : 1,
 
    sumOfRounds: {$sum:'$funding_rounds.raised_amount'},//total sum of all rounds
    raisedPerRound: { $divide: [ {$sum:'$funding_rounds.raised_amount'}, '$numRounds' ] }//average round capital raise
    }
  },
  {$sort: {'raisedPerRound':1}}//sort low to high
] ).pretty()



/*
For companies in our collection founded in 2004 and having 5 or more rounds of
funding, calculate the average amount raised in each round of funding. Which
company meeting these criteria raised the smallest average amount of money per
funding round? You do not need to distinguish between currencies. Write an
aggregation query to answer this question.

As a check on your solution, Facebook had the largest funding round average.
