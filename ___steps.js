/**
 * JWT --secure your api
 * ____________________
 * create token
 * _______________________
 * 
 * 1.after user log in send user basic info to create token
 * 2.in the server side install ---npm install jsonwebtoken
 * 3.import jsonwebtoken
 * 4.jwt.sign(payload,secret,expire)
 * 5.return token to the client side
 * 
 * 6.in the client side after receiving the token store it in http only cookies or local storage=>(second best solution)
 * _________________________________
 * 7.use a general space onAuthStateChange > AuthProvider
 * 
 * ________________________________
 * 8.send token to server
 * 1.for sensitive api call () send authorization headers:{authorization:'Bearer' ${token}}
 * 
 * _____________________________________
 * VERIFY TOKEN
 * 1.create a function verifyJWT -----middleware
 * 2.will have three parameter req,res,next 
 * 3.first check the whether the authorization headers exists
 * 4.if not return error message
 * 5.else get the token out of the authorization headers
 * 6.call jwt.verify(token,secret,(error,decoded))
 * 7.if error return error message
 * 8.else send decoded of the req object
 * 9.call the next() to  go the next function
 * 
 * 
 * _______________________________
 * 
 *check whether token has the  email that matched the req email 
 *
 * 
 * **/