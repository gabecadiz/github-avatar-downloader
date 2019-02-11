var request = require('request');
var secret = require('./secret.js');
var fs = require('fs');

const gitHubUser = process.argv.slice(2)[0];
const gitHubRepository = process.argv.slice(2)[1];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

  if(repoOwner === undefined || repoName === undefined){
    return console.log("Error!!! \nBoth repo owner and repo name arguments are required in order to run the program");
  }

  var options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request',
      'Authorization': secret.GITHUB_TOKEN
    }
  };
  request(options, function(err,res,body){
    cb(err,body);
      var info = JSON.parse(body);

      //gets each user's avatar url
      info.forEach(function(eachUser){
        var avatarUrl = eachUser.avatar_url;
        //creates filepath for coming download
        var imagePath = `avatars/${eachUser.login}.jpg`;

        downloadImageByURL(avatarUrl, imagePath);
      });
  });
}

//downloads image
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
          console.log("Download Complete");
       });
}

getRepoContributors(gitHubUser, gitHubRepository, function(err, result) {

  console.log("Errors:", err);
  //console.log("Result:", result);
});


// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")