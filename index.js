"use strict";

let tweetsFileList,
    userFilelist,
    results,
    tweetsFileOutput,
    userFileOutput,
    finaleOutput,
    finalTweetObject = [],
    followerMap = [];

window.onload = function () {
    tweetsFileList = document.getElementById('tweetsFile');
    userFilelist = document.getElementById('userFile');
    tweetsFileOutput = document.getElementById('tweetsFileOutput');
    userFileOutput = document.getElementById('userFileOutput');
    finaleOutput = document.getElementById('finaleOutput');
};

//processing tweets file
function processTweestFiles() {
    writeTweetsfiles(tweetsFileList.files[0]);
}

//processing User file
function processUsersFiles() {
    writeUsersfiles2(userFilelist.files[0]);
}

//reading tweets file
function writeTweetsfiles(file) {
    if (file.type.match('text.*')) {
        let reader = new FileReader();
        reader.onload = function () {
            results = reader.result;
            tweetsFileOutput.innerText = results;
            manageTweets(results);
            //document.getElementById('output').innerText += reader.result;
        };
        reader.readAsText(file, "UTF-8");
    } else {
        tweetsFileOutput.innerText = "File type not supported!";
    }
}

//reading User file
function writeUsersfiles2(file) {
    if (file.type.match('text.*')) {
        let reader2 = new FileReader();
        reader2.onload = function () {
            userFileOutput.innerText += reader2.result;
            manageFollowers(reader2.result);
        };
        reader2.readAsText(file, "UTF-8");
    }
}

function finalOutPut(e) {
    e.preventDefault();
    for (let x = 0; x < followerMap.length; x++) {

        for (let i = 0; i < finalTweetObject.length; i++) {
            followerMap[x].followers.forEach((follower) => {
                modifyFollowerMap(follower); // Implement modifyFollowerMap by passing followers
            });
        }
    }
    console.log('finalTweetObject ', finalTweetObject);
    console.log('FollowerMap', followerMap);
    displayResults();
}

function displayResults () {
    let output = "";
    followerMap = _.orderBy(followerMap,'user','asc'); // order by user ascending
    console.log(followerMap);
    followerMap.forEach((obj)=>{
        output += obj.user + '\n';
        //Print own tweets
        for(let i = 0 ; i<finalTweetObject.length; i++){
            if(obj.user.trim() === finalTweetObject[i].name.trim()){
                for(let j = 0; j<finalTweetObject[i].tweets.length; j++){
                    output += '@'+obj.user+': '+finalTweetObject[i].tweets[j]+'\n'
                }
            }
        }

        //Print Followers tweets
        for(let i = 0; i<obj.followers.length; i++){
            for(let j = 0; j<finalTweetObject.length; j++){
                if(obj.followers[i].trim() === finalTweetObject[j].name.trim()){
                    for(let k = 0; k<finalTweetObject[j].tweets.length; k++){
                        output += "@"+finalTweetObject[j].name+': '+finalTweetObject[j].tweets[k]+'\n'
                    }
                }
            }
        }
    });
    finaleOutput.innerHTML = output; // Final Print Out
    console.log(output);
}
// Modify the followerMap array to include the user without tweets
function modifyFollowerMap(user){
    let userPresent = false;
    for(let i = 0; i<followerMap.length; i++){ // check if user has tweets
        if(followerMap[i].user.trim() === user.trim()){
            userPresent = true;
        }
    }
    if(userPresent == false){ // if no tweets available then modify the followerMap
        followerMap.push({
            followers: [],
            user: user
        })
    }
}


function manageTweets(tweets) {
    let tweetArray = tweets.split('\n');
    let userArray = [];

    tweetArray.forEach((tweet) => {
        userArray.push(tweet.split('>')[0]);
    });

    userArray =_.uniqBy(userArray); // Lodash remove duplicates from array

    //Create users with tweets
    userArray.forEach((user) => {
        finalTweetObject.push({
            name: user,
            tweets: []
        })
    });

    finalTweetObject.forEach((userTweet) => {
        tweetArray.forEach((tweet) => {
            if (tweet.split('>')[0] === userTweet.name) {
                userTweet.tweets.push(tweet.split('>')[1]);
            }
        });
    });
}

function manageFollowers(users) {
    let userEntryArray = users.split('\n')
    //Create followerMap
    userEntryArray.forEach((entry) => {
        followerMap.push({
            user: entry.indexOf('follows') > -1 ? entry.split('follows')[0].trim() : [entry],
            followers: entry.indexOf('follows') > -1 ? entry.split('follows')[1].trim().split(',') : [entry]
        });
    });

    //get follower and merging all the followers based on the user
    for (let i = 0; i < followerMap.length; i++) {
        for (let j = i + 1; j < followerMap.length; j++) {
            if (followerMap[i].user === followerMap[j].user) {
                followerMap[i].followers = _.merge(followerMap[i].followers, followerMap[j].followers);
                followerMap.splice(j, 1);
            }
        }
    }
}