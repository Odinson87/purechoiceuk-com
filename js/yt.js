$(function(){
  if(typeof appData == 'undefined'){
    appData = {};
  }
  if (typeof appData.yt == 'undefined'){
    appData.yt = {'token':'AIzaSyB-UR8_UVGuQeztJljbJXqnfvLsMDEpVZM'};
  }
  if (typeof appData.yt.channel_id == 'undefined'){
     appData.yt.channel_id = 'UCzTONu2J1ILpnYbsb8ynmtQ';
     appData.yt.uploads_id = 'UUzTONu2J1ILpnYbsb8ynmtQ';
     appData.yt.defaultVid = 'V4L31yszbkc';
  }
  
  getYtFeed();
});


function getData(){

}
function getYtFeed(){
  // ants feed https://www.youtube.com/feeds/videos.xml?channel_id=UCzTONu2J1ILpnYbsb8ynmtQ
  //https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=Maroon5VEVO&key=
  if ( $('.ytEmbed').length > 0) {
      
    $.ajax({ 
//      url : 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id='+ appData.yt.channel_id +'&key='+ appData.yt.token,
      url : ' https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId='+appData.yt.uploads_id+'&maxResults=10&key='+ appData.yt.token,
      context : $('.latestVid'),
      dataType:'json',
    })
    .done(function(data, textStatus, jqXHR){
        //console.log('status: ' + textStatus);
        //console.log(jqXHR);
        //console.log(data);
        //$(this).text(data.stringify());
        appData.yt.latestVid = getLatestVid( data );
        $(this).find('iframe').attr('src','http://www.youtube.com/embed/'+ appData.yt.latestVid +'?wmode=transparent');
    })
    .fail(function( jqXHR, textStatus, error ) {
        console.log('status: ' + textStatus);
        console.log(jqXHR);
        console.log(error);
        //$(this).append( $('<div>').text('failed: ' + textStatus) );
        //$(this).append( $('<div>').text('failed: ' + error) );
        $(this).find('iframe').attr('src','http://www.youtube.com/embed/'+ appData.yt.defaultVid +'?wmode=transparent');
    });

  }
}

function getLatestVid(obj){  
/*    
    obj.items.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
        return new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt);
    });
*/
    //console.log(obj);
    return obj.items[0].snippet.resourceId.videoId;
}