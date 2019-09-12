const router = require("express").Router();
const request = require("request");

router.post("/pricing", (req, res) => {
  // console.log(req.body[0], "what is being sent?");
  if(req.body[0].origin !== '' && req.body[0].destination !== ''){
    const options = {
      method: 'POST',
      url: 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/v1.0',
      headers: {
        'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
        'x-rapidapi-key': process.env.X_RAPID_API,
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: {
        inboundDate: '2019-11-11',
        cabinClass: 'economy',
        children: '0',
        infants: '0',
        country: 'US',
        currency: 'USD',
        locale: 'en-US',
        originPlace: req.body[0].origin + '-sky',
        destinationPlace: req.body[0].destination + '-sky',
        outboundDate: '2019-11-07',
        adults: '1'
      }
    };
    // console.log(options, "what is options");
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      // console.log("what is response?", response)
      // console.log("what is headers?", response.headers.location);
      const sky = response.headers.location.split("/");
      const skyID = sky[sky.length - 1];
      console.log(skyID);
      
      const secondOptions = {
        method: 'GET',
        url: 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/uk2/v1.0/' + skyID,
        qs: { pageIndex: '0', pageSize: '10' },
        headers: {
          'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
          'x-rapidapi-key': process.env.X_RAPID_API
        }
      };

      request(secondOptions, function (error, response, body) {
        if (error) throw new Error(error);
        const jsonBody = JSON.parse(body)
        // console.log(body);
        res.json(jsonBody);
      });

      // res.json(skyID);
      // console.log(body, "body", response, "response");
    });
  } else {
    res.status(400).send("Incomplete fields");
  }
});

// router.get("/flight", (req, res) => {
//   const options = {
//     method: 'GET',
//     url: 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/uk2/v1.0/0f6b39e8-145b-4a02-ae1d-f0d89a4a14b4',
//     qs: { pageIndex: '0', pageSize: '10' },
//     headers: {
//       'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
//       'x-rapidapi-key': process.env.X_RAPID_API
//     }
//   };

//   request(options, function (error, response, body) {
//     if (error) throw new Error(error);
//     const jsonBody = JSON.parse(body)
//     // console.log(body);
//     res.json(jsonBody);
//   });
// })


module.exports = router;
