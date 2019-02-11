var request = require('request');
var secret = require('./secret.js');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request',
      'Authorization': secret.GITHUB_TOKEN
    }
  };
  request(options, function(err,res,body){
    cb(err,body)
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);

  var info = JSON.parse(result);
  info.forEach(function(eachUser){
    console.log(eachUser.avatar_url);
  });
  //console.log("Result:", result);
});

function downloadImageByURL(url, filePath) {
  request.get(url)
       .on('error', function(err) {
         console.log("error occured:", err);
       })
       .on('response', function(response) {
         console.log('Response Status Code: ', response.statusCode);
         console.log(response.headers['content-type']);

       })
       .on('data', function(data){
          console.log("Downloading image...");
       })
       .pipe(fs.createWriteStream(filePath))
       .on('finish',function(){
          console.log("Download Complete")
       });
};
downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")