Direct = {

    _url_site : 'http://lesonunique.com',

    _open_menu : false,

    _box_titre : $('#box_titre_direct'),

    _box_partage : $('#box_partage_direct'),
	
	_url_direct : '',
	
	_meta : '',
	
	_intervalle : '',

    _current_direct : '',
	
	_shareFace : '',
	
	_shareTweet : '',
	
	_txtShareTweet : '',

	init : function() {
		this._url_direct = Flux._frap_flux.ws_meta_direct;
        console.log('************************************ Direct.init()');
        Direct.refreshData();
		if (Direct._intervalle) clearInterval(Direct._intervalle);
		Direct._intervalle = setInterval(Direct.refreshData,5000);
	},

	refreshData : function() {
		$.ajax
		({
			url: Direct._url_direct, 		
			method: 'GET',
			dataType: 'json',
			success: function(data) 
			{
				//console.log('********************************************* Direct.callback_direct='+msg);
				Direct._meta = data;
				console.log('Direct._meta');
				console.log(Direct._meta.current.title+' '+Direct._meta.current.artiste);
				console.log(Direct._meta);
				//console.log('typeof(Direct._meta)='+typeof(Direct._meta)+', '+Direct._meta.current.title);
				//alert('Direct._meta.current.length = '+Direct._meta.current.length);
				if(Direct._current_direct != Direct._meta.current.title) {
					Direct._current_direct = Direct._meta.current.title;
					console.log('Show title');
					Direct.showTitle();
				}
			},
			error: function() 
			{
				console.log('********************************************* Direct.callback_error=');
				//$('#box_titre_direct').html('DATA Direct indisponible !');
				//$('#player_picture').html('<img src="images/sun-radio-logo.png" border="0" height="158">');
			}
		});
		
		//jembe.http.get({url:Direct._url_direct, datatype_demande:'json', onSuccess:Direct.callback_direct, onError:Direct.callaback_error});		
	},


	callback_direct : function(msg) {
        try {
            //console.log('********************************************* Direct.callback_direct='+msg);
            Direct._meta = '';
            eval('Direct._meta = '+msg);
            //console.log('typeof(Direct._meta)='+typeof(Direct._meta)+', '+Direct._meta.current.title);
            //alert('Direct._meta.current.length = '+Direct._meta.current.length);
            if(Direct._current_direct != Direct._meta.current.title) {
                Direct.showTitle();
                Direct._current_direct = Direct._meta.current.title;
            }
        } catch(e) {
            console.log('********************************************* erreur eval callback ='+e);
        }
	},

    callaback_error : function(msg) {
        console.log('********************************************* Direct.callback_error='+JSON.stringify(msg));
        $('#box_titre_direct').html('DATA Direct indisponible !'+msg);
        $('#player_picture').html('<img src="images/sun-radio-logo.png" border="0" height="158">');
    },

    menuToggle : function() {
        if(!this._open_menu) {
            //ouvert
            //this._box_titre.html('');
            this._box_titre.animate({'left':'100%'},400);
            this._box_partage.animate({'left':'0%'},400);
            this._box_partage.find('.btn').html('-');
            this._box_partage.parent().addClass('open');
        } else {
            //fermer
            //this._box_titre.html(this.showTitle());
            this._box_titre.animate({'left':'10%'},400);
            this._box_partage.animate({'left':'-90%'},400);
            this._box_partage.find('.btn').html('+');
            this._box_partage.parent().removeClass('open');
        }
        this._open_menu = !this._open_menu;
    },

    showTitle : function() {
		var showArtiste = Direct._meta.current.artiste;
		//var showArtiste2 = showArtiste.replace(' ','%20');
		var showArtiste2 = showArtiste.replace(/\s/g,'%20');
		console.log(showArtiste);
		console.log(showArtiste2);
		
		var showTitle = Direct._meta.current.title;
		//var showTitle2 = showTitle.replace(' ','%20');
		var showTitle2 = showTitle.replace(/\s/g,'%20');
		console.log(showTitle);
		console.log(showTitle2);
		
		Direct._txtShareTweet=showArtiste2+'%20-%20'+showTitle2+'%20http://mysun.mx%20%23NowPlaying%20http://www.lesonunique.com'+Direct._meta.current.url;
        Direct._shareFace='http://www.lesonunique.com'+Direct._meta.current.url;
		Direct._shareTweet='https://twitter.com/intent/tweet?text='+Direct._txtShareTweet;
		
		console.log(Direct._shareFace);
		console.log(Direct._shareTweet);
		
        $('#facebook_share').attr('href','javascript: window.plugins.socialsharing.shareViaFacebook("", null, "'+encodeURI(Direct._shareFace)+'");');
        $('#twitter_share').attr('href','javascript: window.open("'+encodeURI(Direct._shareTweet)+'","_system","location=yes");');
		//$('#facebook_share').attr('href','javascript: window.open("'+encodeURI(Direct._meta.current.facebook)+'","_blank","location=yes");');
        //$('#twitter_share').attr('href','javascript: window.open("'+encodeURI(Direct._meta.current.twitter)+'","_blank","location=yes");');
		href="javascript: window.open('#', '_blank', 'location=yes');"
        var meta =  '<table width="100%" height="80" cellpadding="0" celcspacing="0" border="0">' +
                    '<tr>' +
                        '<td>' +
                            '<div>'+Direct._meta.current.title+'</div>' +
                            '<div>'+((Direct._meta.current.artiste && Direct._meta.current.artiste!='')?Direct._meta.current.artiste:'')+'</div>' +
                        '</td>' +
                    '</tr>' +
                    '</table>';
		console.log('title = '+meta)
		//$('#box_titre_direct').html('<a href="'+Direct._url_site+Direct._meta.current.url+'" target="_blank" style="color:#fff;text-decoration:none;">'+meta+'</a>');
		$('#box_titre_direct').html('<a style="color:#fff;text-decoration:none;">'+meta+'</a>');
        $('#player_picture').html('<img src="'+Direct._meta.current.cover_url+'" border="0" height="158">');
        //return title;
    },

    share_facebook : function() {
        $('#facebook_share').attr('href',Direct._meta.current.facebook);
    }

}
