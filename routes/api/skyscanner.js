const router = require("express").Router();
const request = require("request");

router.get("/testing", (req, res) => {

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
      // cabinClass: 'economy',
      children: '0',
      infants: '0',
      country: 'US',
      currency: 'USD',
      locale: 'en-US',
      originPlace: 'HNL-sky',
      destinationPlace: 'SEA-sky',
      outboundDate: '2019-11-07',
      adults: '1'
    }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    const sky = response.headers.location.split("/");
    const skyID = sky[sky.length - 1];
    // console.log(skyID);
    
    res.json(skyID);
    // console.log(body, "body", response, "response");
  });
});

router.get("/flight", (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/uk2/v1.0/0f6b39e8-145b-4a02-ae1d-f0d89a4a14b4',
    qs: { pageIndex: '0', pageSize: '10' },
    headers: {
      'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
      'x-rapidapi-key': process.env.X_RAPID_API
    }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    const jsonBody = JSON.parse(body)
    // console.log(body);
    res.json(jsonBody);
  });
})

module.exports = router;
