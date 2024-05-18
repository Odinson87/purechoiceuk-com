$(function(){
  if(typeof appData == 'undefined'){
    appData = {};
  }
  if (typeof appData.fb == 'undefined'){
    appData.fb = {};
  }
  if (typeof appData.fb.token == 'undefined'){
     appData.fb.token = 'access_token=168439686888602|RL2jj_xuToyE3XCHcTqw0X_Bkxg';
  }
  if (typeof appData.fb.fields == 'undefined'){
      appData.fb.fields = 'fields=message,created_time,story,full_picture,type,name,description,caption,source,permalink_url,likes.limit(0).summary(true),comments.summary(true)';
  }
  getFbFeed();
});


function getFbFeed(){
    // ants feed https://graph.facebook.com/antmacmusic/posts?fields=message,created_time,story,full_picture,type,name,description,caption,source,permalink_url
	$('section[data-getFb]').each(function(ks,s){
	  if( $(s).attr('data-getFb') != null ){
		$.ajax({ 
		  url : $(s).attr('data-getFb') + '?' + appData.fb.token + '&' + appData.fb.fields,
		  context : $(s),
		  dataType:'json',
		  beforeSend : function(){			
			var loading = $('<div>').addClass('loading');
			    loading.append( $('<div>').addClass('loadingImg') );
		        loading.append( $('<div>').addClass('loadingTxt').text('loading...') );
		        loading.append( $('<div>').addClass('clearFloat') );
			
			$(s).append(loading);
		  }
		})
		.done(function(data, textStatus, jqXHR){
		    //console.log('status: ' + textStatus);
		    //console.log(jqXHR);
		    //console.log(data);
			//$(this).text(data.stringify());
			populateFbFeed($(this),data);
			$(this).find('.loading').remove();
			
		})
		.fail(function( jqXHR, textStatus, error ) {
		    //console.log('status: ' + textStatus);
		    //console.log(jqXHR);
		    //console.log(error);
			$(this).find('.loading').remove();
			$(this).append( $('<div>').text('failed: ' + textStatus) );
			$(this).append( $('<div>').text('failed: ' + error) );
			
		});
	  }
	});
}

function populateFbFeed(el,d){
    if(el != null && el != undefined && d != null && d != undefined){
	    var postObjs = [];
		var nextPostsUrl = ''; 
		var prevPostsUrl = ''; 
		
		if(d.data != undefined){
		    postObjs = d.data
		    if(d.paging != undefined){
		        nextPostsUrl = d.paging.next;
		        prevPostsUrl = d.paging.previous;
		    }
		    
			var clearFloat = $('<div>').addClass('clearFloat');
			var postsEl = $('<div>').addClass('items').data('sort','dateDesc');
			$.each(postObjs,function(pk,p){
			  if (p.message || p.type == 'link' || p.type == 'photo' || p.type == 'video' || p.type == 'event'){//console.log(p);
                  var item = $('<div>').addClass('item');
                  
                  //add time
                  if(p.created_time){
                      item.append($('<p>').addClass('date').text(fb_dateTime(p.created_time)));
                  }
                  //add likes
                  if(p.likes.summary.total_count){
                      item.append($('<p>').addClass('note').text(p.likes.summary.total_count + ' likes'));
                  }
                  
                  // add message
                  if(p.message){
                      p.message = processLinks(p.message);
                      item.append($('<p>').html(p.message));
                  }
                  
                  // add object
                  var obj,name,desc,caption,image,vid,story;
                  if(p.type == 'link'){
                      var objUrl = p.permalink_url;
                          objUrl = getPostedLink(item);
                      obj = $('<a>').attr({'href':objUrl,'target':'_blank'});
                  } else if (p.type == 'video'|| p.type == 'event'){
                      obj = $('<div>');
                  } else {
                     obj = item;
                  }  
                  obj.addClass(p.type + 'Obj');
                  
                  if(p.story && (p.type == 'photo')){
                      story = $('<a>').text(p.story).attr({'href':p.permalink_url,'target':'_blank'});
                      item.append(story);
                  }
                  if(p.full_picture && (p.type == 'photo' || p.type == 'link' || p.type == 'event')){
                          image = $('<img>').attr('src',p.full_picture).load(function(){imageCropped($(this));});
                      if (p.type == 'link' || p.type == 'event'){
                          image = $('<figure>').addClass('floatL').append(image);
                      } else {
                          image = $('<a>').addClass('image noMaxHeight').attr({'href':p.permalink_url,'target':'_blank'}).append(image);
                      }
                      obj.append(image);
                  }
                  if(p.source && p.type == 'video'){
                      var src = p.source;
                      var srcType = getSrcType(src);
                      if (srcType == 'yt'){
                          src = src.replace('autoplay=1','wmode=transparent');
                          vid = $('<div>').addClass('ytEmbed').append($('<iframe>').attr({'frameborder':0,'allowfullscreen':true,'src':src}));
                      } else {
                          vid = $('<video>').attr({'controls':true}).removeAttr('autoplay').text('video tag not supported').append($('<source>').attr({'src':src,'type':'video/'+srcType}));
                      }
                      obj.addClass('video noMaxHeight').append(vid);
                  }
                  if(p.name && (p.type == 'video' || p.type == 'link' || p.type == 'event')){
                      name = $('<h4>').text(p.name);
                      obj.append(name);
                  }
                  if(p.description && (p.type == 'video' || p.type == 'link' || p.type == 'event')){
                      desc = $('<p>').html( processLinks(p.description) );
                      obj.append(desc);
                  }
                  if(p.caption){
                      caption = $('<p>').addClass('caption').text(p.caption);
                      obj.append(caption);
                  }
                  
                  if(p.type == 'link' || p.type == 'video' || p.type == 'event'){
                      item.append(obj);
                  }
                  
                  //add comments
                  if(p.comments){
                    if (p.comments.summary.total_count > 0){
                      var comments = $('<div>').addClass('items comments');
                      comments.append($('<p>').text('comments:'))
                      $.each(p.comments.data,function(cv,c){
                          var c_item = $('<div>').addClass('item');
                          c_item.append($('<p>').text(c.from.name + ' - ' + c.message));
                          c_item.append($('<p>').text(fb_dateTime(c.created_time)));
                          if(cv > 1){ c_item.addClass('hidden'); }
                          comments.append(c_item);
                      });
                      if(p.comments.summary.total_count > 2){
                          var nMore = p.comments.summary.total_count - 2;
                          var nMoreT = 'show ' + nMore + ' more comment';
                          if(nMore > 1){nMoreT = nMoreT + 's';}
                          comments.append($('<a>').addClass('moreComments').text(nMoreT).click(function(){ moreComments($(this));}));
                      }
                      item.append(comments);
                    }
                  }

                  
                  item.append(clearFloat.clone());
                  postsEl.append(item);
              }
			});
			postsEl.append(clearFloat.clone());
			
			el.append(postsEl);
		}
	}
}

function processLinks(str){
    
  str = str.replace(/\n/g,'<br>')
  
  var urls = str.match(/(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/ig);
  if (urls != null){
    $.each(urls,function(uk,url){
	  url = url.replace(/(\n|\s)/gi,'');
	  urls[uk] = url;
	  
	  var linkText,linkTitle;
	  if(url.length > 70){
	    linkText = url.substr(0,70) + '...';
		linkTitle = url;
	  } else {
	    linkText = url;
		linkTitle = '';
	  }
	  var urlLink = $('<a>').text(linkText).attr({'href':url,'title':linkTitle,'target':'_blank'});
	  str = str.replace(url,urlLink[0].outerHTML);
	  
    });
  //var hashTags = str.match(/^#.*\s$/i);
  var hashTags = str.match(/(^|\s)(#[a-z\d]+)/ig);
  if (hashTags != null){
    $.each(hashTags,function(tk,tag){
	  tag = tag.replace(/(\n|\s)/gi,'');
	  hashTags[tk] = tag;
	  var hashLink = $('<a>').text(tag).attr({'href':'https://www.facebook.com/hashtag/' + tag.replace('#',''),'target':'_blank'});
	  str = str.replace(tag,hashLink[0].outerHTML);
    });
  }
  //console.log(hashTags);
  //console.log(hashLinks);
  }
  
  var mentions = str.match(/\@\[.*?\]/g);
  if(mentions != null){
      $.each(mentions,function(mk,tag){
        mArr = mentions[mk].replace(/(\@|\[|\])/g,'').split(':');  
        var mLink = $('<a>').text(mArr[2]).attr({'href':'http://facebook.com/profile.php?id='+mArr[0],})
        str = str.replace(tag,mLink[0].outerHTML);
      });
     // console.log(mentions);
  }

  return str;
}

function getPostedLink(item){
    var links = $(item).find('a');
	if(links.length == 1){
	    return $(links[0]).attr('href');
	} else {
	    var rLink;
	    $.each(links,function(lk,link){
		    if($(link).attr('href').match($(link).text().substr(0,10)) != null){
			    rLink = $(link).attr('href');
			}
		});
		return rLink;
	}
}

function getSrcType(src){
    if (src.match(/(youtube|youtu.be)/i) != null){
	    return 'yt';
	} else if (src.match(/mp4/i) != null) {
	    return 'mp4';
	} else
	    return 'default';
}


function toHtml(str){
  var d = document.createElement('div');
  d.innerHTML = str;	
  return d.firstChild;
}


function fb_dateTime(dateTime){
    dateTime = dateTime.replace('+0000','Z');
    var d = new Date(dateTime);
	var dObj = {
	    'k':['yyyy','mm','dd','hh','mi','ss'],
		'dd':d.getDate(),
		'mm':d.getMonth()+1,
		'yyyy':d.getFullYear(),
		'hh':d.getHours(),
		'mi':d.getMinutes(),
		'ss':d.getSeconds()
	};
	for (i=1; i<dObj.k.length; i++){
	    dObj[dObj.k[i]] = ('0'+dObj[dObj.k[i]]).substr(-2);
	}
	var str =  dObj.dd + '/' + dObj.mm + '/' + dObj.yyyy + ' @ ' + dObj.hh + ':' + dObj.mi; 
    return str;
}

function timeAgo(time){
var date = new Date(time.replace('+0000','Z'));
    diff = (((new Date()).getTime() - date.getTime()) / 1000),
    day_diff = Math.floor(diff / 86400);
	
	console.log(date);

if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 ){
    return;}

return day_diff == 0 && (
        diff < 60 && "just now" ||
        diff < 120 && "1 minute ago" ||
        diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
        diff < 7200 && "1 hour ago" ||
        diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
    day_diff == 1 && "Yesterday" ||
    day_diff < 7 && day_diff + " days ago" ||
    day_diff > 7 && Math.ceil( day_diff / 7 ) + " weeks ago";
}

function moreComments(el){
    var c_items = el.parent('.comments').find('.item');
	var bType = el.text().match(/(show|hide)/gi);
    if(bType[0] == 'show'){
	    c_items.removeClass('hidden');
		el.text( 'hide comments' );
	} else {
		if(c_items.length > 2){
		    var nMore = c_items.length - 2;
		    var nMoreT = 'show ' + nMore + ' more comment';
		    if(nMore > 1){nMoreT = nMoreT + 's';}
		    el.text(nMoreT);

			$.each(c_items,function(ck,c){
				if (ck > 1){
					$(c).addClass('hidden');
				}
			});
		}
	}
	//$.each(c_items,function(){});
}

/*
<div class="items comments" data-sort="dateDesc">

<div class="item">
	<div class="icon">
		<img src="img/ui_icons/comment.png">
	</div>
	<h4 id="h3">Shaun Jackson - The Railway - Oakham</h4>
	<p>We've had Ant play here a couple of times &amp; he never disappoints!</p>
	<p>We've booked him to return &amp; will continue to do so. Highly recommended!</p>
	<p class="date">03/02/2016</p>
</div>
<div class="clearFloat"></div>
</div>
*/