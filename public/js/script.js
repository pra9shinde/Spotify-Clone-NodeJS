let currentPlayList = [];//store the playlist
let shufflePlayList = [];//store the Shuffle playlist
let tempPlaylist = [];//Store playlist temporarily when user switches to another album

let audioElement;//store the Audio class object
let mouseDown = false; //Flag for song progressbar clicks

let currentSongIndex = 0; //Holds the index of currently playing song
let repeat = false; //Repeat Song after playing flag
let shuffle = false;//Suffle Songs Flag
let timer; //Search page timer


let loggedInUserName;


// class to handle audio API of browser
class Audio {
    constructor() {
        this.currentlyPlaying;//current playing song
        this.audio = document.createElement('audio');//create a html audio element

        // Update Song Duration in UI, Event fires when audio is ready to play
        this.audio.addEventListener('canplay', function () {
            // here 'this' refers to the event object of the audio
            const duration = formatTime(this.duration);
            document.querySelector('.progressTime.remaining').innerText = duration;
        });

        // EVENT when song is playing
        this.audio.addEventListener('timeupdate', function () {
            if (this.duration) {
                updateTimeProgressBar(this);
            }
        });

        // Volume change event
        this.audio.addEventListener('volumechange', function () {
            updateVolumeProgressBar(this);
        });

        // Song ends - EVENT listener
        this.audio.addEventListener('ended', function () {
            nextSong();
        })

    }

    setTrack(track) {
        this.currentlyPlaying = track;
        this.audio.src = track.path;
    }

    setTime(seconds) {
        this.audio.currentTime = seconds;
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }
}

//Events to hide options menu
$(document).click(function (click) {
    let target = $(click.target);
    if (!target.hasClass('item') && !target.hasClass('optionsBtn')) {
        hideOptionsMenu();
    }
});
//Events to hide options menu
$(window).scroll(function () {
    hideOptionsMenu();
});

//function to get html page content like AJAX to keep Single Page App feel. Used instead of <a> tag
function openPage(url) {
    if (timer != null) {
        clearTimeout(timer); //clear timer, user sometimes click link before timeout is finished hence clear it
    }


    if (url.indexOf('?') === -1) {
        url = url + '?';
    }

    // let encodedURL = encodeURI(url + '?userLoggedIn=' + loggedInUserName);
    let encodedURL = encodeURI(url);
    $('#mainContent').load(encodedURL);
    $('body').scrollTop(0);//Scroll top when new page is loaded
    history.pushState(null, null, url); //Add the url to browser's URL coz load() function keeps base url only 
}


// Pause the song
function pauseSong() {
    $('.control-btn.pause').hide();
    $('.control-btn.play').show();
    audioElement.pause();
}

//Converts Seconds to Video Duration Time Format (00:00)
function formatTime(seconds) {
    let time = Math.round(seconds);
    let minutes = Math.floor(time / 60);
    let second = time - (minutes * 60);

    if (second < 10) {
        second = '0' + second;
    }
    return minutes + ':' + second;
}

// Skip the Song on progressbar click
function timeFromOffset(mouse, progressBar) {
    let percentage = mouse.offsetX / progressBar.getBoundingClientRect().width * 100;
    let seconds = audioElement.audio.duration * (percentage / 100);
    audioElement.setTime(seconds);
}

//Update the progress bar as the music is playing
function updateTimeProgressBar(audio) {
    document.querySelector('.progressTime.current').innerText = formatTime(audio.currentTime);
    // document.querySelector('.progressTime.remaining').innerText = formatTime(audio.duration - audio.currentTime);
    let progress = audio.currentTime / audio.duration * 100;
    document.querySelector('.playbackBar .progress').style.width = `${progress}%`;
}

// Update the volume progress bar on change
function updateVolumeProgressBar(audio) {
    let volume = audio.volume * 100;
    document.querySelector('.volumeBar .progress').style.width = `${volume}%`;
}

// Next Song
function nextSong() {
    if (repeat) {
        //Repeat the song
        audioElement.setTime(0);
        playSong();
        return;
    }

    // Play next song
    if (currentSongIndex == currentPlayList.length - 1) {
        currentSongIndex = 0;
    } else {
        currentSongIndex++;
    }
    let trackToPlay = shuffle ? shufflePlayList[currentSongIndex] : currentPlayList[currentSongIndex];
    setTrack(trackToPlay, currentPlayList, true);
}

// Previous Song
function prevSong() {
    if (repeat) {
        audioElement.setTime(0);
        playSong();
        return;
    }

    if (audioElement.audio.currentTime >= 5 || currentSongIndex === 0) {
        audioElement.setTime(0);
    } else {
        currentSongIndex = currentSongIndex - 1;
        setTrack(currentPlayList[currentSongIndex], currentPlayList, true);
    }
}

// Change Repeat mode
function setRepeat() {
    repeat = !repeat;
    let repeatImage = repeat ? 'repeat-active.png' : 'repeat.png';
    document.querySelector('.control-btn.repeat img').src = '/images/icons/' + repeatImage;
}

// Change Mute Unmute
function setMute() {
    audioElement.audio.muted = !audioElement.audio.muted;
    let repeatImage = audioElement.audio.muted ? 'volume-mute.png' : 'volume.png';
    document.querySelector('.control-btn.volume img').src = '/images/icons/' + repeatImage;
}

// Play first song of the album(artist page)
function playFirst() {
    setTrack(tempPlaylist[0], tempPlaylist, true);
}

// Shuffle Playlist
function setShuffle() {
    shuffle = !shuffle;
    let repeatImage = shuffle ? 'shuffle-active.png' : 'shuffle.png';
    document.querySelector('.control-btn.shuffle img').src = '/images/icons/' + repeatImage;

    if (shuffle) {
        // Randomize playlist
        shuffleArray(shufflePlayList);
        currentSongIndex = shufflePlayList.indexOf(audioElement.currentlyPlaying.id);
    } else {
        // Regular Playlist
        currentSongIndex = currentPlayList.indexOf(audioElement.currentlyPlaying.id);

    }

}

//Add to playlist,share button event
function showOptionsMenu(button) {
    let menu = $('.optionsMenu');
    let menuWidth = menu.width();

    let scrollTop = $(window).scrollTop(); //Distance from top of the document
    let elementOffset = $(button).offset().top; //Distance from top to button element

    let top = elementOffset - scrollTop;
    let left = $(button).position().left;

    menu.css({ 'top': top + 'px', 'left': left - menuWidth + 'px', 'display': 'inline' });
}



//hide options menu
function hideOptionsMenu() {
    let menu = $('.optionsMenu');
    if (menu.css('display') != 'none') {
        menu.css('display', 'none');
    }
}

function shuffleArray(arr) {
    let j, x, i;
    for (i = arr.length; i; i--) {
        j = Math.floor(Math.random() - i);
        x = arr[i - 1];
        arr[i - 1] = arr[j];
        arr[j] = x;
    }
}


/**************** AJAX Calls ******************/
// Play the song
function playSong() {
    // Update song listen count only if song is freshly played 
    if (audioElement.audio.currentTime === 0) {
        $.ajax({
            url: 'http://localhost:3000/updatePlays',
            type: 'POST',
            data: { songid: audioElement.currentlyPlaying.id },
            dataType: 'json',
            success: function (result) {
                // console.log(result);
            },
            error: function (e) {
                console.log(e);
            }
        });
    }

    $('.control-btn.play').hide();
    $('.control-btn.pause').show();
    audioElement.play();
}

// AJAX call to set playing song
function setTrack(trackId, newPlaylist, play) {
    //save a copy of original playlist
    if (newPlaylist != currentPlayList) {
        currentPlayList = newPlaylist;
        shufflePlayList = currentPlayList.slice();
        shuffleArray(shufflePlayList);
    }

    //Update the Current Play Index Variable based on shuffle flag
    if (shuffle) {
        currentSongIndex = shufflePlayList.indexOf(trackId);
    } else {
        currentSongIndex = currentPlayList.indexOf(trackId);
    }

    pauseSong(); //Pause the song if already playing

    $.ajax({
        url: 'http://localhost:3000/getSongByID',
        type: 'POST',
        data: { songId: trackId },
        dataType: 'json',
        success: function (result) {
            audioElement = new Audio(); //Create audio object
            audioElement.setTrack(result.songDetails); //set playing track

            //Update Track Details on UI
            document.querySelectorAll('.trackName span')[0].innerText = result.songDetails.title;
            setArtist(result.songDetails.artist);
            setAlbum(result.songDetails.album);

            if (play) {
                playSong();
            }
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
}

// Set Artist Name in Now Playing Section via AJAX
function setArtist(id) {
    $.ajax({
        url: 'http://localhost:3000/getArtistByID',
        type: 'POST',
        data: { artistId: id },
        dataType: 'json',
        success: function (result) {
            document.querySelectorAll('.trackInfo .artistName span')[0].innerText = result.artistDetails.name;
            document.querySelectorAll('.trackInfo .artistName span')[0].setAttribute("onclick", "openPage('/artist?id=" + id + "')"); //make it clickable link
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
}

// Set Album Image in Now Playing Section via AJAX
function setAlbum(id) {
    $.ajax({
        url: 'http://localhost:3000/getAlbumByID',
        type: 'POST',
        data: { albumId: id },
        dataType: 'json',
        success: function (result) {
            document.querySelectorAll('.content .albumLink img')[0].src = result.albumDetails.artworkPath;
            document.querySelectorAll('.trackInfo .trackName span')[0].setAttribute("onclick", "openPage('/album?id=" + id + "')"); //make it clickable link
            document.querySelectorAll('.content img')[0].setAttribute("onclick", "openPage('/album?id=" + id + "')"); //make it clickable link
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });
}

//Create New Playlist
function createPlaylist() {
    const playlistName = prompt('Please enter the name of your playlist');
    if (playlistName !== null) {
        $.ajax({
            url: 'http://localhost:3000/createPlaylist',
            type: 'POST',
            data: {
                name: playlistName
            },
            dataType: 'json',
            success: function (res) {
                if (res.status === 'Success') {
                    openPage('/yourmusic');
                } else {
                    window.location.href = 'http://localhost:3000/register';
                }
            },
            error: function (e) {
                console.log(e.responseText);
            }
        });
    }
}

//Delete Playlist
function deletePlaylist(id) {
    const prompt = confirm('Are you sure yo want to delete this playlist?');

    if (prompt) {
        $.ajax({
            url: 'http://localhost:3000/deletePlaylist',
            type: 'POST',
            data: {
                playlistId: id
            },
            dataType: 'json',
            success: function (res) {
                openPage('/yourmusic');
            },
            error: function (e) {
                console.log(e.responseText);
            }
        });
    }
}

// AJAX call to get random playlist
$(document).ready(function () {
    $.ajax({
        url: 'http://localhost:3000/getPlaylist',
        type: 'GET',
        data: {},
        dataType: 'json',
        success: function (res) {
            let newPlayList = res.playlistArray;
            audioElement = new Audio(); //create audio object
            setTrack(newPlayList[0], newPlayList, false); //set the track to now playing
            updateVolumeProgressBar(audioElement.audio); //Update the volume progress bar
        },
        error: function (e) {
            console.log(e.responseText);
        }
    });


    /*------------- Event Listeners --------------*/
    $('#nowPlayingBarContainer').on('mousedown touchstart mousemove touchmove', function (e) {
        e.preventDefault();
    });

    // Progressbar skip song event
    const progressBarEl = document.querySelector('.playbackBar .progressBar');
    progressBarEl.addEventListener('mousedown', function () {
        mouseDown = true;
    });
    progressBarEl.addEventListener('mousemove', function (e) {
        if (mouseDown) {
            // Set Time of the song depending on the posotion of the click
            timeFromOffset(e, progressBarEl);
        }
    });
    progressBarEl.addEventListener('mouseup', function (e) {
        timeFromOffset(e, progressBarEl);
    });


    // Change Volume Bar events
    const volumeBarEl = document.querySelector('.volumeBar .progressBar');
    volumeBarEl.addEventListener('mousedown', function () {
        mouseDown = true;
    });
    volumeBarEl.addEventListener('mousemove', function (e) {
        if (mouseDown) {
            // Set Volume song depending on the posotion of the click
            const percent = e.offsetX / this.getBoundingClientRect().width;
            if (percent >= 0 && percent <= 1) {
                audioElement.audio.volume = percent;
            }
        }
    });
    volumeBarEl.addEventListener('mouseup', function (e) {
        const percent = e.offsetX / this.getBoundingClientRect().width;
        if (percent >= 0 && percent <= 1) {
            audioElement.audio.volume = percent;
        }
    });

    //close the event when user mouseup anywhere in the document
    document.addEventListener('mouseup', function () {
        mouseDown = false;
    });

    /*------------- Event Listeners --------------*/

});
/**************** AJAX Calls ******************/

