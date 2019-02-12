var request = require('request');
var secret = require('./secret.js');
var fs = require('fs');

// execute program in command line like this:
// node download_avatars.js <owner> <repo>

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
  });
}

//downloads image
function downloadImageByURL(url, filePath) {
  request.get(url)
       .on('error', function(err) {
         console.log("error occured:", err);
       })
       .pipe(fs.createWriteStream(filePath))
       .on('finish',function(){
          console.log("Image Download Complete");
       });
}

getRepoContributors(gitHubUser, gitHubRepository, function(err, result) {
  console.log("Errors:", err);
        var info = JSON.parse(result);
      //gets each user's avatar url
        info.forEach(function(eachUser){
          var avatarUrl = eachUser.avatar_url;
        //creates filepath for coming download
          var imagePath = `./avatars/${eachUser.login}.jpg`;
          downloadImageByURL(avatarUrl, imagePath);
        });
});
