$(function(){

$('body').prepend( $('<p>').text('gallery') );

if (window.app === undefined) {
 app = {};
}

app.gallery = {
  'k':[],
  'fn':{
    'getGallery':function(s){
      if(s){
	    $.ajax({
		  type : 'GET',
		  url : 'gallery1.php',
		  context : $(s),
		  data: {gallery: $(s).attr('data-gallery')},
		  dataType: 'json',
		  beforeSend : function(){
		    /*
			var sctrl = $('<div>').addClass('sctrl');
			    sctrl.append( $('<div>').addClass('min').click(function(){ btnToggle($(this)); toggleSiblings($(this));}) );
			    sctrl.append( $('<div>').addClass('close').click(function(){ removeSection($(this)); }) );
		        sctrl.append( $('<div>').addClass('clearFloat') );
			$(s).append(sctrl);
			*/
			var loading = $('<div>').addClass('loading');
			    loading.append( $('<div>').addClass('loadingImg') );
		        loading.append( $('<div>').addClass('loadingTxt').text('loading...') );
		        loading.append( $('<div>').addClass('clearFloat') );
			
			//$(s).append( $('<h4>').text('Loading...') );
			$(s).append(loading);
		  }
		})
		.done(function(data, textStatus, jqXHR){
		    //console.log('status: ' + textStatus);
		    //console.log(jqXHR);
		    console.log(data);
			//$(this).append( $('<div>').text('done') );
			app.gallery[$(this).data('gallery')].status = 'loaded';
			app.gallery[$(this).data('gallery')].d = data;
		    //populateGallery( $(this),data );
    		$(this).find('.loading').remove();
			
			$(this).find('.container.hidden').removeClass('hidden');
			
			if($(this).hasClass('hidden')){
			    $(this).removeClass('hidden');
			}
		})
		.fail(function( jqXHR, textStatus, error ) {
		    //console.log('status: ' + textStatus);
		    //console.log(jqXHR);
		    //console.log(error);
			app.gallery[$(this).data('gallery')].status = 'Failed';
			$(this).find('.loading').remove();
			$(this).append( $('<div>').text('failed: ' + textStatus) );
			$(this).append( $('<div>').text('failed: ' + error) );
			
		});
	  
	  }
	},
    'outputOnload':function(g){
   	  console.log(app.gallery[g].status);
	  if(app.gallery[g].status == 'loading'){
	    gTimer = setTimeout(function(){
		  app.gallery.fn.outputOnload(g);
		},300);
	  } else {
		clearTimeout(gTimer);
	  }

	}	
  }
};


$('section').each(function(){
    if( $(this).data('gallery') ){
	  var gName = $(this).data('gallery');
	  app.gallery.k.push(gName);
	  app.gallery[gName] = {
	    'status':'loading',
		'd':{}
	  };
	  app.gallery[gName].d = app.gallery.fn.getGallery( $(this) );
	  
	  app.gallery.fn.outputOnload(gName);
	  console.log(app);
	}
});


});

