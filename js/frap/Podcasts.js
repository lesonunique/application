Podcasts = {

    _url_podcasts : '',

    _list_podcasts : '',
	
	_url_like_pod : '',

    _current_podcast_play : '',
	
	_partage_podcast : '',

    _date_select : new Date(),

    _date_today : new Date(),

    _div_date : $('#date_podcasts #date_list'),

    init : function() {
        this._url_podcasts = Flux._frap_flux.ws_podcasts+'?field_date_de_diffusion_value[value][year]='+this._date_select.getFullYear()+'&field_date_de_diffusion_value[value][month]='+(this._date_select.getMonth()+1)+'&field_date_de_diffusion_value[value][day]='+this._date_select.getDate();
		console.log('init podcast DEBUT');
		console.log(this._url_podcasts);
			
		$.ajax
		({
			url: Podcasts._url_podcasts, 		
			method: 'GET',
			dataType: 'json',
			success: function(data) 
			{
				console.log("requereajax");
				Podcasts._list_podcasts=data;
				console.log(Podcasts._list_podcasts);
				Podcasts.loadPodcasts();
			},
				error: function() 
			{
				console.log("Pas d'éléments");
			}
		});
		
		console.log('init podcast FIN');
    },

    changeDate : function(p_num) {
        $('#page_podcasts').find('#scroller').html('<div align="center" style="margin-top:50px;"><img src="images/player/301.gif" width="64" /></div>');
        if(p_num=='plus') {
            this._date_select = new Date(this._date_select.getTime() + (24 * 60 * 60 * 1000));
        } else {
            this._date_select = new Date(this._date_select.getTime() - (24 * 60 * 60 * 1000));
        }
        //console.log('date = '+this._date_select);
        if(this._date_select<this._date_today) $('#dateSup').fadeIn();
        else $('#dateSup').fadeOut();
        Podcasts.init();
    },

    dateList : function() {
        var the_date='';
        the_date += jours[this._date_select.getDay()];
        the_date += ' '+this._date_select.getDate();
        the_date += ' '+mois[this._date_select.getMonth()];
        the_date += ' '+this._date_select.getFullYear();

        return the_date;
    },

    loadPodcasts : function() {
		console.log('podcasts load');
        Podcasts._div_date.html(Podcasts.dateList());
        if(Podcasts._list_podcasts.length>0) {
            var liste = '<table width="100%" cellpadding="4" cellspacing="0" border="0" style="margin: 40px 0;">';
            for(var i=0;i<Podcasts._list_podcasts.length;i++) {
				//Podcasts._url_like_pod='http://www.facebook.com/sharer.php?u=http://www.lesonunique.com'+Podcasts._list_podcasts[i].url;
                liste +=    '<tr class="line_podcasts">'+
                                '<td>'+
                                    '<div style="position: relative;" id="podcast_'+i+'">'+
                                        '<div><img src="'+Podcasts._list_podcasts[i].image+'" border="0" height="90" /></div>'+
                                        '<div class="play" '+getOnClickEvent()+'="Podcasts.playPodcast('+i+')"><img src="images/player/play.png" /></div>'+
                                        '<div class="pause" '+getOnClickEvent()+'="Podcasts.pausePodcast('+i+')"><img src="images/player/pause.png" /></div>'+
                                    '</div>'+
                                '</td>'+
                                '<td><span class="title">'+Podcasts._list_podcasts[i].node_title+'</span><div class="trait"></div>'+((Podcasts._list_podcasts[i].body!=null) ? Podcasts._list_podcasts[i].body : "")+' '+Podcasts._list_podcasts[i].nid+'</td>'+
                                '<td><a href="#" '+getOnClickEvent()+'="Podcasts.choixFacebookTwitter('+i+')" id="podcast_like_'+i+'" class="like" data-icon="&#xe0d4;"></a></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td colspan="3"></td>'+
                            '</tr>';
            }
            liste += '</table>';
            $('#page_podcasts').find('#scroller').html(liste);
            //Api._scrollPage_Podcasts.refresh();
        } else {
            $('#page_podcasts').find('#scroller').html('<div align="center" style="margin-top:45px;">Aucun Podcast disponible<br />pour cette date.</div>');
        }
    },

    playPodcast : function(p_node) {
        console.log('playPodcast');
		if(this._current_podcast_play!='' || this._current_podcast_play==0) this.pausePodcast(this._current_podcast_play);
        this._current_podcast_play=p_node;
        var elm=$('#podcast_'+p_node);
        //$('#player_podcasts').animate({'bottom':'0px'},400);
        elm.parents('.line_podcasts').addClass('active');
        elm.find('.play').css('display','none');
        elm.find('.pause').css('display','block');

        this.updatePlayer();

		Player.player.aod({
            'track_url': Podcasts._list_podcasts[p_node].son,
            'time_end': getTimeStamp()+10000,
            'time_start': getTimeStamp()
        });
		Player.refresh_status('aod');

    },

    pausePodcast : function(p_node) {
        var elm=$('#podcast_'+p_node);
		//$('#player_podcasts').animate({'bottom':'-100%'},400);
        elm.parents('.line_podcasts').removeClass('active');
        elm.find('.play').css('display','block');
        elm.find('.pause').css('display','none');
		Player.player.pause();
        this._current_podcast_play='';
    },
	
	choixFacebookTwitter : function(tmp) {	
		Podcasts._partage_podcast=Podcasts._list_podcasts[tmp].son;
		console.log(Podcasts._partage_podcast);
		navigator.notification.confirm(
			'Sur quel réseau social voulez-vous partager ce contenu ?',  // message
			Podcasts.callBackChoixFacebookTwitter,   // fonction de callback appelée avec l'indice du bouton pressé
			'Partagez le contenu',    // titre
			['Twitter','Facebook']  // libellés des boutons
		);	
	},
	
	callBackChoixFacebookTwitter : function(button) {	
		if (button==1) {
			console.log("Twitter");
			console.log(Podcasts._partage_podcast);
			//var shareselect='https://twitter.com/intent/tweet?text=http://www.lesonunique.com'+Podcasts._partage_podcast;
			//window.open(shareselect,'_system','location=yes');
			var shareselect='http://www.lesonunique.com'+Podcasts._partage_podcast;
			window.plugins.socialsharing.shareViaTwitter('', null /* img */, shareselect);
        } 
		else if(button==2) {
			console.log("Facebook");
			console.log(Podcasts._partage_podcast);
			//var shareselect2='https://www.facebook.com/sharer/sharer.php?u='+escape('http%3A%2F%2Fwww.lesonunique.com'+Podcasts._partage_podcast);
            //window.open(shareselect2,'_system','location=yes');
			//var shareselect2='http://www.lesonunique.com'+Podcasts._partage_podcast;
			var shareselect2=Podcasts._partage_podcast;
			window.plugins.socialsharing.shareViaFacebook('', null /* img */, shareselect2);
        }
	},

    likePodcasts : function(p_node) {
        if($('#podcast_like_'+p_node).hasClass('active')) {
            console.log('deja like');
        } else {
            console.log('like url => http://www.facebook.com/sharer.php?u='+escape('J\'écoute '+Flux._frap_flux.racine+' #sunradio #sunapp'));
            $('#podcast_like_'+p_node).addClass('active');
        }
    },

	updatePlayer : function() {
        console.log('********************************************************************************* height_page '+height_page+'-'+$('#jsplayer').height());
        $('#jsplayer').css('height','45px');
        $('#jsplayer').addClass('bg');
        $('#jsplayer .control .controller').css('display','none');
        $('#jsplayer').css('top','100%').animate({'top':(height_page-$('#jsplayer').height())+'px'},800);
	}
}

