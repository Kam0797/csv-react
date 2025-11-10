# Expenses Analyzr

A tool to categorise and provide a summary of expenses, for given data in csv file.

This tool is live [here](https://kam0797.github.io/csv-react)

## Note:
 - This is NOT completed yet.
 - I've tried a good part in applying OOP concepts, creating classes - Category, Categoriser, FinReport etc.
 This tool does all the work on user's device, that is without a backend server.
 - However, I'd like to port backend logic to a spring-boot REST API server, as mentioned in *bonus*. And I look forward for your feedback on my work so far; so that upcoming parts can better meet your expectations.
 - There are a few places, esp closer to react that have not yet been implemented in OOP way (uses plain js objects - without type-checking). I would like to get your feedback on this too. (Should that be enforced, or taken care just in server envs?)
 - A primitive chart is implemented. (I didnt want to use a lib for this task)
 - Regarding PDF parsing - What would a typical input pdf look like? Can i get a sample? - because the predictability of format makes a LOT of difference in parsing work.

 Thank you for reviewing.


### possible categories:

- Food
- entertainment
- Utilites
- Travel
- Housing
- PetCare
- Health
- Insurance

The data given is just of one month, so recurring experses have to be guessed based only on description
Make a big set of related terms and check against each to determine category.
optim: maybe, make a Map() of arrays, where set has words that begin with same letter

 

## todo
- make a standard response object for returning data