/**
 * Player.
 * @class Player
 * @static
 **/


Player = {

    player: null,

    is_open: true,

    y_top: 0,

    y_bottom: 200,

    drag_limit: 80,

    diffusion: "direct",

    metadatas_interval: false,

    _list_meta_direct : '',

	_status : '',
	
	isLoading : false,

    init: function() {
        console.log("Player.init()");
        console.log("jembe.info.platform = "+jembe.info.platform);

		// -----------------------------------
        // Player du direct

		if (jembe.info.platform=="server") {
	        this.player = JsPlayer.addPlayer({
	            'id': '1',
	            'el': $("#jsplayer"),
	            'template_id': 'player-template',
	            'swf_path': 'flash/JsPlayer/jsplayer.swf',
                'on_ready': Player.playDirect
	        });
		} else {
			this.player = JsPlayer.addPlayer({
	            'id': '1',
	            'el': $("#jsplayer"),
	            'template_id': 'player-template',
	            'swf_path': 'flash/JsPlayer/jsplayer.swf',
	            'on_ready': Player.playDirect
	        });
		}
		
		// initialisation des éléments visibles ou cachés
		this.player.model.set('show_mode', false);
		this.player.model.set('show_slider', false);
		this.player.model.set('show_time_end', false);
		this.player.model.set('show_time_now', false);
		this.player.model.set('show_time_start', false);
		this.player.model.set('show_mute_btn', true);
		this.player.model.set('show_seektime', true);
        this.player.model.set('show_volume_slider', false);
		$("#separateur").hide();
		
		// Configuration du format des durées / heures.
        this.player.model.set('render_time_start_direct', function(timestamp, timecode) {
            return toHMS(timestamp);
        });
        this.player.model.set('render_time_start_ts', function(timestamp, timecode) {
            return toHMS(timestamp);
        });
        this.player.model.set('render_time_start_aod', function(timestamp, timecode) {
            return secondsToHMS(timecode);
        });

        this.player.model.set('render_time_playing_direct', function(timestamp, timecode, percent) {
            return toHMS(timestamp);
        });
        this.player.model.set('render_time_playing_ts', function(timestamp, timecode, percent) {
            return toHMS(timestamp);
        });
        this.player.model.set('render_time_playing_aod', function(timestamp, timecode, percent) {
            return secondsToHMS(timecode);
        });

        this.player.model.set('render_time_now_direct', function(timestamp, timecode, percent) {
            return toHMS(timestamp);
        });
        this.player.model.set('render_time_now_ts', function(timestamp, timecode, percent) {
            return toHMS(timestamp);
        });
        this.player.model.set('render_time_now_aod', function(timestamp, timecode, percent) {
            return secondsToHMS(timecode);
        });

		this.player.model.set('render_time_end', function(timestamp, timecode) {
            return toHMS(timestamp);
        });

        this.player.model.set('render_time_end_direct', function(timestamp, timecode) {
            return toHMS(timestamp);
        });
        this.player.model.set('render_time_end_ts', function(timestamp, timecode) {
            return toHMS(timestamp);
        });
        this.player.model.set('render_time_end_aod', function(timestamp, timecode) {
            return secondsToHMS(timecode);
        });

		// Evenements
		this.player.on("direct_enter", function(event) {
           	this.model.set('show_slider', false);
			this.model.set('show_time_end', false);
			this.model.set('show_time_now', true);
			$("#separateur").hide();
        });
		this.player.on("aod_enter", function(event) {
           	this.model.set('show_slider', true);
			this.model.set('show_time_end', true); // a voir ?
			this.model.set('show_time_now', true); // a voir ?
			$("#separateur").show(); // a voir ?
        });

        this.player.on("direct_exit", function(event) {
            console.log('direct_exit');
        });

		this.player.on("stop_enter", function(event) {
		    console.log('stop_enter');
			
			
        });

		this.player.on("can_play", function(event) {
			console.log('CAN PLAY !!!!!!');
			Player.isLoading = false;
			document.getElementById('voile').style.display="none";
			
		 });

		this.player.on("play_enter", function(event) {
		    console.log('play_enter');
		    clearInterval(Player.interval);
		
        });

		this.player.on("load_enter", function(event) {
		   	console.log('load_enter');
			Player.isLoading = true;
			document.getElementById('voile').style.display="block";
		    		
        });

		this.player.on("buffering_enter", function(event) {
		   	if (Player.interval) clearInterval(Player.interval);
			Player.time_loading = (new Date()).getTime();
			console.log('buffering_enter >> time_loading: '+Player.time_loading);
			Player.interval = setInterval(Player.checkloadfeed,1000);
			
        });

		this.player.on("audio_error", function(event) {
		   	jembe.alert.show({
				message : 'Voulez-vous relancer le flux ?',
	            buttons : 'OK|Annuler',
	            onSuccess : Player.relaunchFlux
	        });
        });


		
    },

	checkloadfeed : function() {
		var time_stop = (new Date()).getTime();
		var tps = (time_stop-Player.time_loading)/1000;
		console.log('check load feed >> tps:'+tps);
		if (tps>10) {
			clearInterval(Player.interval);
				jembe.alert.show({
		            title : "Réseau insuffisant",
		            message : "Il semble que le réseau soit insuffisant. Voulez-vous relancer le flux ?",
					buttons : "ok|annuler",
		            onSuccess : Player.relaunchFlux
		        });
		}
	},

	relaunchFlux : function(button) {
		console.log('relaunchFlux button='+button)
		if (button==0) {
			console.log('>>> RELAUNCH')
	    	if (Player._status=="direct") Player.playDirect()
			else Podcasts.playPodcast();
		} else {
			console.log('ne pas relancer')
		}
	},


    choseQuality : function() {
        //alert('Flux._frap_flux.mp3_direct.iOS = '+Flux._frap_flux.mp3_direct.iOS);
        if (jembe.info.platform=="server") return Flux._frap_flux.mp3_direct.hifi;
        else if (jembe.info.platform=="iPhone OS") return Flux._frap_flux.mp3_direct.iOS;
        else if (jembe.info.platform=="android") return Flux._frap_flux.mp3_direct.android;
        else return Flux._frap_flux.mp3_direct.lofi;
    },
	
	playDirect: function() {
        console.log("playDirect : "+Player.choseQuality());

		if(Podcasts._current_podcast_play>=0) {
            Podcasts.pausePodcast(Podcasts._current_podcast_play);
        }

		Player.player.direct({
            'track_url': Player.choseQuality(),
            'track_url_ts': '',
			//'track_url_ts': Flux._frap_flux.mp3_ts,
            'time_end': getTimeStamp() + 2400,
            'time_start': getTimeStamp() - 3600
        });


        $('#player_up .container_player .titre_player').html('');
        $('#player_up .container_player .texte_player.row1').html('');
        $('#player_up .container_player .texte_player.row2').html('');
        $('#player_up .container_player img.icon_player').attr('src', '');

		Player.refresh_status("direct");
        //Player.onMetadatas();
        Player.startMetadatasInterval();

        Player.diffusion = "direct";
        //Player.update();

        
    },

    startMetadatasInterval : function() {
        jembe.http.get({url:Flux._frap_flux.ws_meta_direct, onSuccess:Player.callback_meta_direct, onError:Player.callaback_error});
    },

    callaback_error : function(msg) {
        console.log('error de connexion au JSON meta_direct '+msg);
    },

    callback_meta_direct : function(msg) {
        try {
            eval('Player._list_meta_direct = '+msg);
            Player.setMetaDirect();
        } catch(e) {
            console.log('rien dans le json Player._list_meta_direct ='+ e.message);
            Player._list_meta_direct="";
        }
    },

    setMetaDirect : function() {
        $('#player_picture').html('<img src="'+Player._list_meta_direct.node.field_image+'" border="0" />');
        setTimeout(Player.startMetadatasInterval(),10000);
    },

	refresh_status : function(p_status) {
		Player._status = p_status;
        console.log('=============================================');
        console.log('=============================================');
        console.log('=============================================================== refresh_status='+p_status+' ================');
        console.log('=============================================');
        console.log('=============================================');
		if (p_status!="direct") {
            document.getElementById("btns_player").style.display="none";
            document.getElementById("btn_reload").style.display="inline-block";
        } else {
            document.getElementById("btns_player").style.display="inline-block";
            document.getElementById("btn_reload").style.display="none";
        }
	}

};

