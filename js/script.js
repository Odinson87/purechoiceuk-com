$(function(){
    getExternal();
	getItems();
    ready();
});

function getExternal(){
	$('section[data-get]').each(function(ks,s){
	  if( $(s).attr('data-get') != null ){
		$.ajax({ 
		  url : $(s).attr('data-get'),
		  context : $(s),
		  beforeSend : function(){
		    var sctrl = $('<div>').addClass('sctrl');
			    sctrl.append( $('<div>').addClass('min').click(function(){ btnToggle($(this)); toggleSiblings($(this));}) );
			    sctrl.append( $('<div>').addClass('close').click(function(){ removeSection($(this)); }) );
		        sctrl.append( $('<div>').addClass('clearFloat') );
			
			var loading = $('<div>').addClass('loading');
			    loading.append( $('<div>').addClass('loadingImg') );
		        loading.append( $('<div>').addClass('loadingTxt').text('loading...') );
		        loading.append( $('<div>').addClass('clearFloat') );
			
			$(s).append(sctrl);
			//$(s).append( $('<h4>').text('Loading...') );
			$(s).append(loading);
		  }
		})
		.done(function(data, textStatus, jqXHR){
		    //console.log('status: ' + textStatus);
		    //console.log(jqXHR);
		    //console.log(data);
			//$(this).append( $('<div>').text('done') );
			populateSection( $(this),data );
    		$(this).find('.loading').remove();
			
			var intro = data.match(/class="intro"/);
			if(intro.length == 0){
			}
			    $(this).find('.container.hidden').removeClass('hidden');
			
			if($(this).hasClass('hidden')){
			    $(this).removeClass('hidden');
			}
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

function getItems(){
	$('section[data-getitems]').each(function(ks,s){
	  if( $(s).attr('data-getitems') != null ){
	    var pageUrl,pageItem = $(s).attr('data-getitems');
		    pageItem = pageItem.split(',');
		    pageUrl = pageItem[0];
		
		$.ajax({ 
		  url : pageUrl,
		  context : $(s),
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
		    //console.log($('<div>').html('test'));
			//$(this).append( $('<div>').text('done') );
			placeItems( $(this),$('<div>').html(data).find('.items') );
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


// <<<==== On Page Load ====>>>
function ready(){
     //console.log('init...');
	appData = {};
	
	// add revealIcon button to images
	$('section .image').each(function(k,v){
	  if (!$(v).hasClass('noMaxHeight')){
	    if($(v).find('.revealIcon').length == 0){
			var revealIcon = $('<div>').addClass('revealIcon hidden').text('reveal image +');
			$(v).prepend(revealIcon);
			$(v).click(function(){ revealImage($(this)); });
		}
	  }
	});
	
	// on image load check if image is cropped, if so show revealIcon button
	$('img').load(function(){
		if( $(this).parent().hasClass('image') ){
			imageCropped($(this));
		}
	});
	$('img').each(function(){
		if( $(this).parent().hasClass('image') ){
			imageCropped($(this));
		}
	});
	
	// add read more button to items with read_more class
	$('.read_more').each(function(){
		    var rmt = $('<div>').addClass('rmt').text('read more +').click(function(){ rmtBtn($(this)); });
    	    $(this).prepend($('<br>'));
			$(this).children().toggleClass('hidden');
		    $(this).prepend(rmt);
	});
	
	// set tiles
	$('.tiles').addClass('w');
	
    // add show/hide description button to items div with a heading
	$('.itemsTitle').each(function(){
	    if($(this).parents('.items').first().find('.rm').length == 0){    
			var rmBtn = $('<div>').addClass('rm btn d');//.click(function(){ $(this).toggleClass('u d').parents('.items').find('.item').toggleClass('hidden'); });
		    $(this).prepend(rmBtn);
			
			toggleItems( $(this) );
			$(this).click(function(){ 
			    $(this).find('.rm').toggleClass('u d');
				toggleItems( $(this) );
			});
		}
	});
	
	// add show/hide description button to item titles/links
	$('.description').each(function(){
        var descBtn = $('<div>').addClass('desc btn i')
		    descBtn.click(function(){ 
			    $(this).siblings('.description').toggleClass('hidden');
				$(this).parent().find('.image > img').each(function(){ imageCropped($(this)); });
			});

		if($(this).parent().find('h4').length > 0){
		    $(this).parent().find('h4').first().addClass();
		}
	    
		
		$(this).parents('.item').first().prepend(descBtn);
		$(this).toggleClass('hidden');
		
		
	});

	// convert items to tiles // <<<==== write tile toggle function so user can choose layout
	$('.items .item').each(function(){
		//if($(this).find('.description').length > 0){
		//    var descBtn = $('<div>').addClass('desc btn i').click(function(){ $(this).siblings('.description').toggleClass('hidden'); });
		//    $(this).prepend(descBtn);
		//	$(this).find('.description').toggleClass('hidden');			
		//}
		
		if( $(this).parents('.tiles').length > 0 ){
		    
			if( !$(this).parent().hasClass('tile') ){
		        $(this).wrap('<div class="tile"></div>')
			}
		}

	});
	
	setPageState();
	setSideBars();
	fixMainNav();
	// window resize
	$(window).resize(function(){
		$('section .image .revealIcon').each(function(k,v){
			imageCropped($(v));
		});
		fixMainNav();
	});
	
	// window scroll - fix top bar
	$(window).scroll(function(){
        fixMainNav();
	    b2t();
    });	
    
	// hide back to top if necessary
    b2t();
	
	// sort comments
	//var commentsEl = $('.items.comments');
	//if( commentsEl.length > 0){
	// $.each(commentsEl,function(){sortElements($(this),'dateDesc')});
	//}
	
    // sort items
	var itemSet = $('.items[data-sort]');
	if( itemSet.length > 0){
	 $.each(itemSet,function(){sortElements($(this))});
	}
	
	//construct contents links
	getContents('init');
	getContents();	

}

// toggle tiles/items
function toggleItems(el){
	var isTiles = el.parent().find('.tiles');	
	if(isTiles.length > 0){
		isTiles.toggleClass('hidden');
	} else {
		el.parents('.items').first().find('.item').toggleClass('hidden'); 
	}
}

// toggle siblings/section content (excluding title and sctrl)
function toggleSiblings(el){
    var firstH = el.parents('section').find(':header').first();
	if(firstH.length > 0){
	    var sSiblings = firstH.nextAll();
	} else {
	    var sSiblings = el.next().nextAll();
	}	
	
	sSiblings.toggleClass('hidden');
}

// remove section from dom
function removeSection(el){
    el.parents('section').remove();
}


//toggle reveal of cropped images
function revealImage(el){
	el.toggleClass('noMaxHeight');
	var icon = el.find('.revealIcon');
	//console.log(icon);
	var ri = 'reveal image +';
	var hi = 'hide image -';
	if(icon.text() == ri){
		newText = hi;
	} else{
		newText = ri;
	}
	icon.text(newText);
	imageCropped(el.find('img'));
}

// read more text button (show hide content)
function rmtBtn(el){
    el.siblings().toggleClass('hidden');
	var rm = 'read more +';
	var sl = 'show less -';
	if(el.text() == rm){
		newText = sl;
	} else{
		newText = rm;
	}
    el.text(newText);
}


// check if image cropped
function imageCropped(el){
    var pObj = el.parents('.photoObj');
	if (pObj.length == 0) {
		el = el.parent();
		var imgH = el.find('img').height();
		var imageH = el.height();
		var revealIcon = el.find('.revealIcon');
		// !el.hasClass('noMaxHeight')
		if( imageH = 300 ){
			if(imageH < imgH-30){
				tarClass(revealIcon,'show');
			} else if(imageH >= imgH-30){
				tarClass(revealIcon,'hide');
			}
		}
	    //console.log('imgH: ' + imgH + ' : ' + el.find('img').attr('src') );
	    //console.log('imageH: ' + imageH + ' : ' + el.find('img').attr('src') );
	} else {
		//console.log('h: '+ el.height() + ', w: ' + el.width());
	    if (el.height() > el.width()){
		    el.addClass('photoObjP');
		}
	}
}

// redraw image elements
function redrawImages(){
	var redraw = [];
	$('.image').each(function(){redraw.push(this);});
	$('img').each(function(){redraw.push(this);});
	//console.log(redraw);
	$.each(redraw,function(){
	    //console.log(this);
        var redraw = this.offsetHeight;
	    //console.log('height: ' + $(this).height());
	});
}

// toggle/add/remove class to element
// el: element, a: action, c: class
function tarClass(el,a,c){
	if(el != undefined){
		if(c == undefined){
			c = 'hidden' 
		}
		if(a == undefined){
			el.toggleClass(c);
		} else if(a == 'show' || a == 'remove'){
			el.removeClass(c);
		} else if(a == 'hide' || a == 'add'){
			el.addClass(c);
		}
	}
}

// swap buttons
function btnToggle(el){
//console.log(el);
	var btns = {'keys':['l','r','u','d','up','dn','max','min'],
	            'l':'r','r':'l','u':'d','d':'u',
				'up':'dn','dn':'up','max':'min','min':'max'
				}
	
	$.each(btns.keys,function(k,v){
        if(el.hasClass(v)){
		    //console.log('has: ' + v + ', swap for: ' + char[v]);
			el.toggleClass(btns[v] + ' ' + v);
			return false;
		}
	});
}

function setPageState(){
    appData.pageState = $('.pageState').css('z-index');
}

function pageStateChange(){
    var pageState = $('.pageState').css('z-index');
	if (appData.pageState != pageState){
	    appData.pageState = pageState;
	    return true;
	} else {
	    return false;
	}
}

// fix navigation bar to top on scroll
// fix sidebar position
function fixMainNav(){
   	//setSideBars();

	var st = $(document).scrollTop();
	var sl = Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
	var wh = $(window).innerHeight();
	var nav = $('nav.main'); 
	var banner = $('.topBar .banner');
	var footer = $('.footer');
	var f = footer.outerHeight();
	var sb = 0;
	var extra = 0; 
	
	//main nav
	if(banner == undefined){
		var h = 169;
	} else {
		var h = banner.height();
	}
	
	if( $('.pageState').css('z-index') == 2 ){
	    extra = 20;
	}

	// define main nav margin top
	if(st > h){
		nav.addClass('fixed')
		//$('section').first().css({'margin-top': nav.height()+ extra +'px'});
	} else if(st <= h){
		nav.removeClass('fixed')
		//$('section').first().css({'margin-top': 0 + extra + 'px'});
	}
	
	// define sidebar bottom offset
	if(footer != undefined){
		sl = sl - wh;
		if(st > sl-f){
	        sb = f-(sl-st);
		}
	}
	
	//sidebars height & margin-top
	$('.sideBar').each(function(){
	  
	  if($(this).hasClass('fixed')){
	    $(this).css({});
		// top position and height
		if(st > h){
			$(this).css({
			    'margin-top':nav.height()+'px',
			    'height':$(window).height() - nav.height() - sb + 'px'
			});
		} else if(st <= h){
			$(this).css({
			    'margin-top': (h-st) + nav.height() +'px',
				'height':$(window).height() - nav.height() - sb - (h-st) + 'px'
			});
		}
	  } else {
	    /* height only
	    if(st > h){
			$(this).css({'height':$(window).height() - nav.height() - sb + 'px'});
		} else if(st <= h){
			$(this).css({'height':$(window).height() - nav.height() - sb - (h-st) + 'px'});
		}*/
	  	$(this).css({'height':''});
	  }
	  
	});
	
	if(pageStateChange()){
	  setSideBars();
	}
}

function setSideBars(){
	// get page state
	var pageState = $('.pageState').css('z-index');
    //console.log('ps: '+pageState);
    
	// get number of side bars
	var barNum = getBarNum();
	
	var sideBarState = 'inPage'
	if( (pageState < 3 && barNum == 2) || (pageState < 2 && barNum == 1) ){
	   sideBarState = 'fixed';
	} else {
	   sideBarState = 'inPage'
	}
	
    //console.log(sideBarState);
    //console.log(barNum);
	
	$('.sideBar').each(function(){
        
		// set side
		var side;
		if($(this).hasClass('right')){
			side = 'right';
		} else if($(this).hasClass('left')){
			side = 'left';
		}
		
		var currentState;
		if($(this).hasClass('inPage')){
		    currentState = 'inPage';
			$('.pageState').addClass('inPage ' + side +'Bar' );
		} else {
		    currentState = 'fixed';
		}
		
		// check if sidebar state needs to change, then run if needed.
	    if (sideBarState != currentState || ($(this).hasClass('menu') && !$(this).hasClass('fixed')) ){ 
			if(sideBarState == 'fixed' || $(this).hasClass('menu')){

				if(sideBarState == 'fixed'){
				    // set content margins
				    $('.pageState').removeClass('inPage');
				}
				
                
                if( !$(this).hasClass('merge') ){
                    
                    // set side bar fixed
                    $(this).addClass('fixed closed').removeClass('inPage');
                    
                    // create or show side bar buttons
                    if ($('.iconBtn.'+side).length == 0){
                      var sideBtn = $('<a>').addClass('iconBtn ' + side).text(side + ' panel').click(function(){ toggleSideBar($(this)); });
                      if(side == 'right'){
                          $('nav.main').find('.rightBtns').append(sideBtn);
                      } else {
                          $('nav.main').find('.leftBtns').prepend(sideBtn);
                      }
                    }
                }
				
			} else if (sideBarState == 'inPage') {
			    if(!$(this).hasClass('menu')){
					// set side bar inPage
					$(this).addClass('inPage fixed').removeClass('fixed');
					$('.pageState').addClass('inPage');
					$(this).removeClass('closed');
					$('.iconBtn.'+side).remove();
					$(this).css({'margin-top':''});
			    }
			}
		}
	});
}

function getBarNum(){
    var barNum = 0;
    $('.sideBar').each(function(){
      if( !$(this).hasClass('menu') && !$(this).hasClass('merge') ){
          barNum++;
      }  
    });
    
	//if($('.sideBar.left').length > 0 && !$('.sideBar.left').hasClass('menu') && $()){barNum++;}
	//if($('.sideBar.right').length > 0 && !$('.sideBar.right').hasClass('menu')){barNum++;}
	return barNum;
}


function toggleSideBar(el){
   var pageState = $('.pageState').css('z-index');
   if(el.hasClass('right')){
     $('.sideBar.right').toggleClass('closed');
	 if(!$('.sideBar.left').hasClass('closed') && pageState == 0){
       $('.sideBar.left').addClass('closed');
	 }
   } else if(el.hasClass('left')){
     $('.sideBar.left').toggleClass('closed');
	 if(!$('.sideBar.right').hasClass('closed') && pageState == 0){
       $('.sideBar.right').addClass('closed');
	 }
   }
}

// hide back to top if necessary
function b2t(){
    var st = $(document).scrollTop();
	if( st > 600 ){
		if( $('.b2t').hasClass('hidden') ){
			$('.b2t').removeClass('hidden');
        	//console.log('b2t revealed');
		}
	} else {
		if( !$('.b2t').hasClass('hidden') ){
			$('.b2t').addClass('hidden');
        	//console.log('b2t hidden');
		}
	}
}

// contents
function getContents(a){
	if(a == 'init'){
	    //console.log('init_contents');
		appData = {
			'c':{
				'titles':[],
				'count':0,
				'scrolled':0
			}
		}
		
		if($('nav.contents').length > 0){
    	    //console.log('construct_contents_wrap');
		    $('nav.contents').wrap('<div class="contents_wrap hidden"></div>');
			var xBtn = $('<div>').addClass('xBtn').click(function(){ toggle_contents(); });
			$('nav.contents').prepend(xBtn);
			
			var contentsBtn = $('<a>').addClass('iconBtn tree').text('contents').click(function(){ toggle_contents(); });
			$('nav.main').find('.rightBtns').prepend(contentsBtn);
		}
		
	} else {
	    //console.log('getContents');
        if($('nav.contents a').length > 0){
		    $('nav.contents a').each(function(){
			    var href = $(this).attr('href');
				if(href == '#'){
				    href = '.page'
				}
				$(this).attr({'data-href': href}).click(function(){scroll_nudge({'el':$(this)});});
				$(this).removeAttr('href');
			});
		}        
		
		$(':header').each(function(){
			appData.c.titles.push(this);
		});
		
		$.each(appData.c.titles,function(k,v){
			//build link item
			appData.c.count++;
			var hID = 'h' + appData.c.count;
			var tier = $(v).prop('tagName').replace(/h/i,'');
				
			$(v).attr('id',hID);
			var item = $('<a>');
				item.attr({'data-href':'#'+hID});
				item.addClass('t'+tier);
				item.text($(v).text());
				item.click(function(){				
				    scroll_nudge({'el':$(this)}); 
				});
			$('nav.contents').append(item);
		});
	
	}
}

function toggle_contents(){
    /*console.log('t_contents');
	if( $('.contents_wrap').hasClass('panelhidden') ){
	    var st = $(window).scrollTop();
        console.log('show contents - st: ' + st);
        console.log('topbar - offset: ');
		console.log($('.contents_wrap').offset());
	
        var ftop = $('.contents_wrap').offset().top;
        $('.contents_wrap').removeClass('panelhidden');
	
	} else {
        $('.contents_wrap').addClass('panelhidden');
	}*/
    $('.contents_wrap').toggleClass('hidden');
	
}

function populateSection(el,data){
   if(el != null && el != undefined && data != null && data != undefined){
    //console.log('populate');
	   // current scripts on page
	   var pageScripts = [];
	   $('head > script').each(function(ks,s){ 
	       pageScripts.push( $(s).attr('src') ); 
	   });
	   // current css on page
	   var pageCss = [];
	   $('head > link').each(function(kc,c){ 
		   pageCss.push( $(c).attr('href') ); 
	   });
       
	   // new scripts from extra page/content
	   var newScripts = [];
	   $(data).filter('script').each(function(ks,s){ 
	       newScripts.push( $(s).attr('src') ); 
	       //console.log($(s).attr('src'));
	   });
	  
	   // new css from extra page/content
	   var newCss = [];
	   $(data).filter('link').each(function(kc,c){ 
		   newCss.push( $(c).attr('href') ); 
	   });
	   
	   // location and file name of extra page/content
	   var location = el.data('get').split('/');
	   var file = location.pop();
	   var location = location.join('/');
	   
	   
	   
	   // add only new css links to page
	   $.each(newCss,function(kc,c){
	       if($.inArray(c,pageCss) == -1){
			   $('head').append( $('<link>').attr({'type':'text/css','rel':'stylesheet','href': location + '/' + c}) );
		   } else {
		       //console.log('css already loaded');
		   }
	   });
	   	   
	   // contents of section from extra page/content
	   var newSection = $(data).filter('section').first();
	   el.append(newSection.find(':header').first());
	   
	   newSection.find('img').each(function(ki,i){
	       $(i).attr('src', location + '/' + $(i).attr('src'));
	       //console.log($(i).attr('src'));
	   });
	  
	  
	  // set data type
	  if(newSection.attr('data-type') != undefined){
	      el.attr('data-type',newSection.attr('data-type'));
	  }
	  // add new content
	  //el.append(newSection.find('.intro').first());
	  el.append( $('<div>').addClass('container hidden').append(newSection.children()) );
	  
	  // add only new script tags to page
	  $.each(newScripts,function(ks,src){
	      if($.inArray(src,pageScripts) == -1){
		      var s= document.createElement('script');
				s.type= 'text/javascript';
				s.src= location + '/' + src;
				document.getElementsByTagName('head')[0].appendChild(s);
		      //$('head').append( $('<script>').attr({'type':'text/javascript','src': location + '/' + src}) );
		  } else {
		      //console.log('script already loaded');
		  }
	   }); 
   }
}

function placeItems(el,elArr){
    var pageUrl,itemGroup,itemLimit,pageItems = el.data('getitems');
	    pageItems = pageItems.split(',');
	if(pageItems.length == 1){
	    pageUrl = pageItems[0];
		var urlArr = pageUrl.split('/');
		itemGroup = urlArr[urlArr.length-1].replace(/(.php,.html)/ig,'');
	}
	if (pageItems.length > 1) {
	    pageUrl = pageItems[0];
	    itemGroup = pageItems[1];
	}
	if (pageItems.length > 2){
	   itemLimit = pageItems[2]; 
	}
    var items = filterItems(elArr,itemGroup,itemLimit);
	var itemsEl = $('<div>').addClass('items');
	$.each(items,function(){
	    itemsEl.append($(this));
	});
	el.append($('<h3>').text(itemGroup));
    el.append(itemsEl);
	if (items.length >= itemLimit){
	    el.append($('<a>').addClass('btn txt').attr('href',pageUrl).text('more'));
	}
}

function filterItems(elArr,itemGroup,itemLimit){
    var dObj = dt('now_obj');
    var items = [];
    
    if (itemGroup == 'gigs'){
	    $.each(elArr,function(ek,el){
			$(el).find('.item').each(function(ik,i){
				var dText = $(i).find('p.date').text();
				var dArr = dText.split('/');
				var dMs = new Date(dArr[2],dArr[1]-1,dArr[0]).getTime();
				var today = new Date(dObj.yyyy,dObj.mm-1,dObj.dd).getTime();
				if (dMs >= today){
					items.push(i);
				}
			});
	    });
		if (items.length == 0){
		    items.push($('<div>').addClass('item').text('sorry, no future gigs available'));
		}
    }
    if (items.length > itemLimit){
        items.splice(itemLimit-1,items.length - itemLimit);
    }
    return items;
}

function sortElements(el){
  // remove clearFloat element
  var clearFloat = el.children('.clearFloat').length;
  if(clearFloat == 1){
      el.children('.clearFloat').remove();
  }
  // get array of list items 
  var elArr = el.children();
  
  var orderBy = el.data('sort');
  // sort list items
  elArr.sort(function(a,b){
	if(orderBy == 'az' || orderBy == 'za' ){
	    var tA = $(a).text();
	    var tB = $(b).text();
		if (orderBy == 'az'){
		  return tA.trim() > tB.trim();
		} else {
		  return tA.trim() < tB.trim();
		}
	}
	if(orderBy == 'random'){
		// Get a random number between 0 and 10
		var temp = parseInt( Math.random()*10 );
		// Get 1 or 0, whether temp is odd or even
		var isOddOrEven = temp%2;
		// Get +1 or -1, whether temp greater or smaller than 5
		var isPosOrNeg = temp>5 ? 1 : -1;
		// Return -1, 0, or +1
		return( isOddOrEven*isPosOrNeg );
	}
	if(orderBy == 'dateAsc' || orderBy == 'dateDesc'){
	    // get dates and split on /
		var str1 = $(a).find('p.date').first().text();
		var str2 = $(b).find('p.date').first().text();
		if( str1 != undefined && str2 != undefined){
			var arr1 = str1.split('/');
			var arr2 = str2.split('/');
			// get milliseconds from 1970
			var ms1 = new Date( arr1[2],arr1[1],arr1[0] ).getTime();
			var ms2 = new Date( arr2[2],arr2[1],arr2[0] ).getTime();
			if(orderBy == 'dateAsc'){
				return ms1 - ms2;
			}
			if(orderBy == 'dateDesc'){
				return ms2 - ms1;
			}
		} else { return false;}
	}
  })
  // append list items to ul
  .appendTo(el);
  
  // add clearFloat element
  if(clearFloat == 1){
      el.append( $('<div>').addClass('clearFloat') );
  }
}

// get date time in ms
function dt(p){
    var d = new Date();
	var days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
	var days_abbr = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
	var date_suffix = ['st','nd','rd','th','th','th','th','th','th','th','th','th','th','th','th','th','th','th','th','th','st','nd','rd','th','th','th','th','th','th','th','st']
	var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var months_abbr = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
	
    if (p == 'now'){
        return d.getTime();
    } else if (p == 'now_obj'){
        var d = new Date();
	    var dObj = {
	        'k':['yyyy','yy','m','mm','month','month_abbr','d','dd','day','day_abbr','hh','mi','ss','now'],
		    'yyyy':d.getFullYear(),
		    'yy': d.getFullYear().toString().substr(-2),
			'm':d.getMonth()+1,
		    'mm':('0' + (d.getMonth()+1)).substr(-2),
		    'month':months[d.getMonth()],
		    'month_abbr':months_abbr[d.getMonth()],
			'd':d.getDate(),
			'ds':date_suffix[d.getDate()-1],
			'dd':('0' + d.getDate()).substr(-2),
			'day':days[d.getDay()],
			'day_abbr':days_abbr[d.getDay()],
		    'hh':('0' + d.getHours()).substr(-2),
		    'mi':('0' + d.getMinutes()).substr(-2),
		    'ss':('0' + d.getSeconds()).substr(-2),
			'now':d.getTime()
	    };
		return dObj;
	} else if (p == 'month'){
		return months[d.getMonth()];
	} else if (p == 'month_abbr'){
		return months_abbr[d.getMonth()];
	} else  if (p == 'day'){
	    return days[d.getDay()];
	} else  if (p == 'day_abbr'){
	    return days_abbr[d.getDay()];
    }
}

// get all key names of an object
function getKeys(obj){
   var keys = [];
   for(var key in obj){
      keys.push(key);
   }
   return keys;
}

// nudge page  by n (if element provide use offset as scroll position)
function scroll_nudge(p){
//p:{'el':'','n':''} object can have elements and specified nudge amount
	//console.log('scroll_nudge');
	if(p != undefined){		
	    var st = 0;
		if(p.el != undefined){
			if(p.el.attr('data-href')){
				var heading = $( p.el.attr('data-href') );
				//console.log(heading);
				st = heading.offset().top;
			} else {
    			st = p.el.offset().top;
			}
		}
		
		var n = $('nav.main').height() + 20;
		//console.log(n);
		if(p.n != undefined){
		    st = st - p.n;
		} else { 
		    st = st - n;
		}
		
		smoothScroll( st );
	}
}

function smoothScroll(n) {
//console.log(n);
	if( n != undefined ){ 
		$('html, body').animate({
			scrollTop: n
		}, 1000);
		return false;
	}
}


