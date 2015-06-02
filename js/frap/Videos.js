Videos = {

    _url_videos : '',

    _list_videos : '',
	
	_partage_videos : '',

    _limit_list : 30,
    
    _player: null,

    init : function() {
        this._url_videos = Flux._frap_flux.ws_video+'&limit='+this._limit_list;
       // jembe.http.get({url:Videos._url_videos, datatype_demande:'json', onSuccess:Videos.callback_videos, onError:Videos.callaback_error});
	   console.log('url video => '+Videos._url_videos);
		var e = document.createElement('script'); e.async = true;
        //e.src = document.location.protocol + '//api.dmcdn.net/all.js';
		e.src = 'http://api.dmcdn.net/all.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(e, s);
		window.dmAsyncInit = function()
    	{
	
	        console.log('window.dmAsyncInit');
			//DM.init({apiKey: 'your app id', status: true, cookie: true});
	
			/*
			Videos._player =  DM.player("dm_player", {params: { html:true, related:false, autoplay:1, fullscreen: false} });
			Videos._player.addEventListener("apiready", function(e)
		        {
				Videos._player.load("");
			});
			*/
		}
     	console.log('video avant requete ajax')
	    $.ajax
		({
			url: Videos._url_videos, 		
			method: 'GET',
			//dataType: 'json',
			success: function(data) 
			{
				
          			   //eval('Videos._list_videos = '+data);
					   Videos._list_videos = data;
						console.log(Videos._list_videos);
           				 Videos.loadVideos();
       				 
			},
			error: function() 
			{
				console.log('error de connexion au JSON Videos '+data)
			}
		});

	
	
    },

    callaback_error : function(msg) {
        console.log('error de connexion au JSON Videos '+msg)
    },

    callback_videos : function(msg) {
        console.log('video.js callback_videos début');
        try {
            eval('Videos._list_videos = '+msg);
			console.log(Videos._list_videos);
            Videos.loadVideos();
        } catch(e) {
            Videos._list_videos="";
        }
    },

    loadVideos : function() {
        var liste = '<table width="100%" cellpadding="4" cellspacing="0" border="0">';
        for(var i=0;i<Videos._list_videos.list.length;i++) {
            liste +=    '<tr class="line_videos">'+
                            '<td>'+'' +
                                '<div style="position:relative;">'+
                                    '<div><img src="'+Videos._list_videos.list[i].thumbnail_medium_url+'" border="0" width="90" height="68" /></div>'+
                                    '<div class="play" '+getOnClickEvent()+'="Videos.playVideo('+i+')"><img src="images/player/play.png" /></div>'+
                                '</div>'+
                            '</td>'+
                            '<td><span class="title">'+Videos._list_videos.list[i].title+'</span><div class="trait"></div><!--'+Videos._list_videos.list[i].channel+' / -->'+Videos._list_videos.list[i].views_total+' vues <!--('+Videos._list_videos.list[i].id+'/'+Videos._list_videos.list[i].owner+')--></td>'+
                            '<td><a href="#" '+getOnClickEvent()+'="Videos.choixFacebookTwitter('+i+')" id="video_like_'+i+'" class="like" data-icon="&#xe0d4;"></a></td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td colspan="3"></td>'+
                        '</tr>';
        }
        liste += '</table>';
        $('#page_videos').find('#scroller').html(liste);
        //Api._scrollPage_Videos.refresh();
    },
	
	choixFacebookTwitter : function(tmp) {	
		Videos._partage_videos=Videos._list_videos.list[tmp].url;
		console.log(Videos._list_videos.list[tmp]);
		navigator.notification.confirm(
			'Sur quel réseau social voulez-vous partager ce contenu ?',  // message
			Videos.callBackChoixFacebookTwitter,   // fonction de callback appelée avec l'indice du bouton pressé
			'Partager le contenu',    // titre
			['Twitter','Facebook']  // libellés des boutons
		);	
	},
	
	callBackChoixFacebookTwitter : function(button) {	
		if (button==1) {
			console.log("Twitter");
			console.log(Videos._partage_videos);
			var shareselect=Videos._partage_videos;
			window.plugins.socialsharing.shareViaTwitter('', null /* img */, shareselect);
        } 
		else if(button==2) {
			console.log("Facebook");
			console.log(Videos._partage_videos);
			var shareselect2=Videos._partage_videos;
			window.plugins.socialsharing.shareViaFacebook('', null /* img */, shareselect2);
        }
	},

    likeVideo : function(p_node) {
        if($('#video_like_'+p_node).hasClass('active')) {
            console.log('deja like video');
        } else {
            console.log('like video');
            console.log('like url => http://www.facebook.com/sharer.php?u='+escape(Videos._list_videos.list[p_node].url));
            $('#video_like_'+p_node).addClass('active');
        }
    },

    playVideo : function(p_node) {
		
        var btn_close= '<div '+getOnClickEvent()+'="Videos.closeVideo()" style="text-align:center;color:#fff;text-transform:uppercase;margin-top:10px;">retour</div>';
        Api.switchMenu('embed_video');
        if(Podcasts._current_podcast_play>=0) {
            Podcasts.pausePodcast(Podcasts._current_podcast_play);
        }
        Player.player.pause();
	
		Videos._player =  DM.player("dm_player", {video: Videos._list_videos.list[p_node].id, width:$("#page_embed_video").width(), params: { html:true, related:false, autoplay:1, fullscreen:1} });
		Videos._player.addEventListener("apiready", function(e)
        {

		console.log("apiReady: " + Videos._player.apiReady);
		setTimeout(function() {
		        Videos._player.play();
		}, 200);
	
		Videos._player.addEventListener("ended", function(e) {
		    Videos.closeVideo();
		});
	});
	
    },
    stop: function() {
	if(Videos._player) {
	    Videos._player.pause();
	    Videos._player = null;
	    $('#dm_player').html('');
	}
//	Videos._player.load("");
    },
    closeVideo : function() {
	Videos.stop();
        Api.switchMenu('videos');
 //       $('#page_embed_video').find('#scroller').html('');
    }
}
