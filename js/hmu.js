$(function(){   
   gMaps = {'k':[]};
   
   hmuGen();
});
function initMaps(){
if (gMaps.k.length > 0){
 $.each(gMaps.k,function(k,v){
	 initGmap(gMaps[v]);
 });
}
}

function initGmap(mObj){
   if(mObj.latLng.lat != undefined && mObj.latLng.lng != undefined && mObj.elID != undefined){
	   if(mObj.z == undefined){ mObj.z = 8; };
	   //console.log(mObj);
	   var map = new google.maps.Map(document.getElementById(mObj.elID), {
		   center:mObj.latLng,
		   zoom: mObj.z
	   });
	   var marker = new google.maps.Marker({
           position:mObj.latLng,
           map: map,
           title: mObj.title
       });	   
   } else {
	   //console.log('shmur');
   }
}

//<div class="contactInfo" data-who="Ian Crawford"></div>

function hmuGen(){

    var contacts = {
	    'settings':{'icons':'Y','title':'N'},
		'k':['Tony'],
		'Tony':{
		    'include':['mailto'],
			'email':'tony',
			'domain':'purechoiceuk.com',
			'mtSubject':'Enquiry',
			'mtText':'email',
			'mobile':'0#79#64#70#93#50'
		}/*,
		/*'General':{
		    'include':['mailto','address','map'],
			'email':'ianc',
			'domain':'morpheustraining.co.uk',
			'address':'Riverside Lodge<br>Whitehouses<br>London Road<br>Retford<br>DN22 7JG',
			'map':{'lat':53.3050555,'lng':-0.9320555,'title':'Riverside Lodge'}
		}*/
	};

    $('.contactInfo').each(function(k,v){
	    var who = $(v).data('who');
		if(contacts[who] != undefined && contacts[who] != null){
//			console.log(who);
            if (contacts.settings.title == 'Y'){
                $(v).append($('<h4>').text(who));		
            }
			if($.inArray('email',contacts[who].include) > -1){
				var email = $('<div>').addClass('email');
					email.append( $('<div>').text(contacts[who].email + '@' + contacts[who].domain) );
					/*
					email.append( $('<div>').text('Email: ') );
					email.append( $('<div>').text(contacts[who].email) );
					email.append( $('<div>').addClass('hidden').text('# !') );
					email.append( $('<div>').text('@') ); 
					email.append( $('<div>').addClass('hidden').text('# !') );
					email.append( $('<div>').text(contacts[who].domain) );
					*/
				if(contacts.settings.icons == 'Y'){
                    email.addClass('typeIcon');
				}
				if(contacts.settings.title == 'Y'){
				    email.prepend( 'Email: ' );
				}
				$(v).append(email);		
			}
			
			if($.inArray('mobile',contacts[who].include) > -1){
				var mobile = $('<div>').addClass('mobile').text( contacts[who].mobile.replace(/#/g,'') );
				if(contacts.settings.icons == 'Y'){
                    mobile.addClass('typeIcon');;
				}
				if(contacts.settings.title == 'Y'){
				    mobile.prepend( 'Mobile: ' );
				}
				$(v).append( mobile );				
			}
			
			if($.inArray('phone',contacts[who].include) > -1){
				var phone = $('<div>').addClass('phone').text( contacts[who].phone.replace(/#/g,'') );
				if(contacts.settings.icons == 'Y'){
                    phone.addClass('typeIcon');
				}
				if(contacts.settings.title == 'Y'){
				    phone.prepend( 'Tel: ' );
				}
				$(v).append( phone );
			}
			
			if($.inArray('mailto',contacts[who].include) > -1){
			    var e_add = contacts[who].email + '@' + contacts[who].domain
				var mtText;
				if(contacts[who].mtText == 'email'){
				  mtText = e_add;
				} else {
				  mtText = contacts[who].mtText;
				}
				var mailto = $('<a>').attr({'href':'mailto:' + e_add + '?Subject=' + contacts[who].mtSubject}).text(mtText);
				$(v).append( $('<div>').append(mailto));		
			}

			if($.inArray('address',contacts[who].include) > -1){
                var address = $('<div>').addClass('address').html( contacts[who].address );
				if(contacts.settings.icons == 'Y'){
                    var addressTitle = $('<div>').addClass('addressTitle typeIcon').text('Address:');				
                }
				if(contacts.settings.title == 'Y'){
                    var addressTitle = $('<div>').addClass('addressTitle').text('Address:');				
				}
				$(v).append( addressTitle );		
				$(v).append( address );		
			}

			if($.inArray('map',contacts[who].include) > -1){
				var mapN = $('.map').length;
				if(mapN == undefined || mapN == null){
				 mapN = 0;
				}
				mapN = 'map' + mapN++;
				//console.log(mapN);
				$(v).append( $('<div>').addClass('map right w70').attr('id',mapN).css('height',$(v).height()+20) );	
				gMaps[mapN] = {
				    'latLng':{
				        'lat':contacts[who].map.lat,
					    'lng':contacts[who].map.lng
					},
					'z':18,
					'elID':mapN,
					'title': contacts[who].map.title
				};
				gMaps.k.push(mapN);
				
				//initGmap(contacts[who].map.lat,contacts[who].map.lng,8,mapN);
			}
			
			$(v).append( $('<div>').addClass('clearFloat') );
			
			/*
			if( $(v).next().hasClass('contactInfo') ){
			    $(v).after('<br>');
			}
			*/
        }		
	});

}

