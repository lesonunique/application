Dedicace = {

    _url_get_hour : '',

    _url_get_min : '',

    _url_get_list : '',

    _url_get_info : '',

    _url_send_dedicace : '',

    _list_days : new Array('Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'),

    _list_month : new Array('Jan','Fév','Mars','Avr','Mai','Juin','Juil','Août','Sept','Oct','Nov','Déc'),

    _today : new Date(),

    _json_hour : new Array(),

    _json_min : '',

    _json_list : '',

    _json_info : '',

    _json_adressbook : '',

    _json_callback_send_dedicace : '',

    _select_hour : '',

    _select_min : '',

    _select_day : '',

    _line_open : '',

    _num_of_tel : 0,

    _num_of_tel_max : 5,

    _num_line_adressbook : 1,

    _current_dedicace_play : -1,

    _search_open : true,

    _search_words : '',

    _id_music : 0,

    _adressBook_name : '',

    _adressBook_lastname : '',

    _adressBook_phone : '',

    _list_telephone_number : '',

    _canChange : false,

    init : function() {
		console.log('Dedicace init : '+Flux._frap_flux.racine_services);
			
        if(Dedicace._select_hour) {
            Dedicace._select_hour.destroy();
            Dedicace._canChange=false;
        }

		if(Dedicace._select_min) {
			Dedicace._select_min.destroy();
            Dedicace._canChange=false;
        }
        Dedicace._num_of_tel = 0;
        Dedicace._select_hour = new CardView('#wrapperH', {
            effect: 'rotate',
            direction: 'h',
            //startPage: Dedicace._today.getHours(),
            dataset: Dedicace._json_hour,
            onUpdateContent: function (el, data) {
                //console.log('************************************* '+typeof(data));
				
				
                el.querySelector('div').innerHTML = data.heures+'H';
				//el.querySelector('div').innerHTML = '<img src="'+'http://www.lesonunique.com/applitest/image.jpg'+'" style="position:relative;top:-15px;height:60px;" />';
				
				
                if(Dedicace._canChange) Dedicace.changeMinutes();
                //console.log('data.heures = '+ data.heures);
                //console.log('currCard = '+ this.currCard);
                //console.log('*********************');
            }
        });
        Dedicace._select_min = new CardView('#wrapperM', {
            effect: 'rotate',
            direction: 'h',
            //startPage: Math.ceil((Dedicace._today.getMinutes())/5),
            dataset: Dedicace._json_min,
            onUpdateContent: function (el, data) {
                
                //el.querySelector('div').innerHTML = '<img src="'+'http://www.lesonunique.com/applitest/image.jpg'+'" style="position:relative;top:-15px;height:60px;" />';
				if(data.element_image && data.element_image!='') el.querySelector('div').innerHTML = '<img src="'+data.element_image+'" style="position:relative;top:-15px;height:60px;" />';
                else el.querySelector('div').innerHTML = data.minutes+'MIN';
                Dedicace._canChange=true;
            }
        });
        //setTimeout(Dedicace.changeMinutes,100);
    },

    launch : function() {
        Api.switchMenu('dedicace');
		Dedicace._url_get_hour = Flux._frap_flux.racine_services+Flux._frap_flux.repertoire_dedicace+'/selection_auditeur/selecteur_heures.php';
	    Dedicace._url_get_min = Flux._frap_flux.racine_services+Flux._frap_flux.repertoire_dedicace+'/selection_auditeur/selecteur_minutes.php';
	    Dedicace._url_get_list = Flux._frap_flux.racine_services+Flux._frap_flux.repertoire_dedicace+'/selection_auditeur/recherche_creation_tableau.php';
	    Dedicace._url_get_info = Flux._frap_flux.racine_services+Flux._frap_flux.repertoire_dedicace+'/selection_auditeur/traitement_musiqueEnAvant.php';
	    Dedicace._url_send_dedicace = Flux._frap_flux.racine_services+Flux._frap_flux.repertoire_dedicace+'/selection_auditeur/validation.php';

        //this.displayHourAvailable();
        $('#step1').css('display','block');
        $('#step1bis').css('display','none');
        $('#step2, #step3').fadeOut().html('<div align="center"><img src="images/player/301.gif" border="0" width="50" /></div>');
        //Api._scrollPage_Dedicace.refresh();
    },

    changeMinutes : function() {
        var h=0;
        if(Dedicace._select_hour.nextCard>0) h=$('#wrapperH ul#deck li:nth-child('+Dedicace._select_hour.nextCard+')').find('div').html();
        else h=$('#wrapperH ul#deck li:last-child').find('div').html();
        h=substr(h,0,-1);
        Dedicace._today.setHours(h);
        jembe.http.post({
            url: Dedicace._url_get_min,
            data: 'jour='+Dedicace.returnTimeStamp()+'&heures='+Dedicace._today.getHours(),
            onSuccess: Dedicace.callback_minute_change,
            onError: Dedicace.callback_error
        });
    },

    callback_minute_change : function(msg) {
        //console.log('******************************************************************');
        //console.log('msg : '+msg);
        eval('Dedicace._json_min = '+msg);
        if(Dedicace._select_min) Dedicace._select_min.destroy();
        Dedicace._select_min = new CardView('#wrapperM', {
            effect: 'rotate',
            direction: 'h',
            //startPage: Math.ceil((Dedicace._today.getMinutes())/5),
            dataset: Dedicace._json_min,
            onUpdateContent: function (el, data) {
			
			//el.querySelector('div').innerHTML = '<img src="'+'http://www.lesonunique.com/applitest/image.jpg'+'" style="position:relative;top:-15px;height:60px;" />';
			
                if(data.element_image && data.element_image!='') el.querySelector('div').innerHTML = '<img src="'+data.element_image+'" style="position:relative;top:-15px;height:60px;" />';
                else el.querySelector('div').innerHTML = data.minutes+'MIN';

            }
        });
    },

    displayMinuteAvailable : function() {
        jembe.http.post({
            url: Dedicace._url_get_min,
            //data: 'jour='+Dedicace.returnTimeStamp()+'&heures='+Dedicace._today.getHours(),
            data: 'jour='+Dedicace.returnTimeStamp()+'&heures='+Dedicace._json_hour[0].heures,
            onSuccess: Dedicace.callback_minute,
            onError: Dedicace.callback_error
        });
    },

    callback_minute : function(msg) {
		console.log('callback_minute '+msg)
        eval('Dedicace._json_min = '+msg);
        //console.log('Dedicace._json_min = '+print_r(Dedicace._json_min[0],true));
        if(Dedicace._json_min.length < 3) {
            Dedicace._json_min.push({"status":"1","minutes":"--"});
            Dedicace._json_min.push({"status":"1","minutes":"--"});
        }
        Dedicace.init();
    },

    displayHourAvailable : function() {
		console.log(Dedicace._url_get_hour+'?'+'valeur='+Dedicace.returnTimeStamp()+'&idtel='+jembe.info.uuid)
        jembe.http.post({
            url: Dedicace._url_get_hour,
            data: 'valeur='+Dedicace.returnTimeStamp()+'&platform='+jembe.info.platform+'&idtel='+jembe.info.uuid,
            onSuccess: Dedicace.callback_hour,
            onError: Dedicace.callback_error
        });
    },

    callback_error : function(msg) {
        console.log('Error hour or min function = '+JSON.stringify(msg));
    },

    callback_hour : function(msg) {
		console.log('callback_hour '+msg);
        eval('Dedicace._json_hour = '+msg);
        //console.log('callback_hour ('+Dedicace._json_hour.length+') '+Dedicace._json_hour);

        if(Dedicace._json_hour[0].code==3) {
            console.log('******************************************* code 3');
            Dedicace.backStep1();
            alert(Dedicace._json_hour[0].message);
        } else if(Dedicace._json_hour[0].code==2) {
            console.log('******************************************* code 2');
            alert(Dedicace._json_hour[0].message);
        } else if(Dedicace._json_hour[0].code==1) {
            console.log('******************************************* code 1');
            //alert(Dedicace._json_hour[0].message);
        }
        Dedicace._json_hour.shift();
        if(Dedicace._json_hour.length < 3) {
            Dedicace._json_hour.push({"heures":"--","rowheures":"--"});
            Dedicace._json_hour.push({"heures":"--","rowheures":"--"});
        }
        //console.log('callback_hour ('+Dedicace._json_hour.length+') '+Dedicace._json_hour);
        Dedicace.displayMinuteAvailable();
    },

    selectDay : function(p_param) {
        this._select_day=p_param;
        if(this._select_day=='tomorrow'){
            Dedicace._today = null;
            Dedicace._today = new Date();
            Dedicace._today.setTime(Dedicace._today.getTime()+86400000);
	        Dedicace._today.setMinutes(00);
	        Dedicace._today.setHours(00);
        } else {
            Dedicace._today = null;
            Dedicace._today = new Date();
        }

        Dedicace._today.setSeconds(00);
        //Dedicace._today.setMilliseconds(000);

        $('#step1').css('display','none');
        $('#step1bis').fadeIn(function() {
            $('#datetime').html(Dedicace.returnDayString());
        });
        this.displayHourAvailable();
    },

    returnDayString : function() {
        var content ='';
        content += Dedicace._list_days[Dedicace._today.getDay()]+' ';
        content += Dedicace._today.getDate()+' ';
        content += Dedicace._list_month[Dedicace._today.getMonth()];

        return content;
    },

    returnTimeString : function() {
        var content ='';
        content += ((Dedicace._today.getHours()<10)? '0':'')+Dedicace._today.getHours();
        content += ':';
        content += ((Dedicace._today.getMinutes()<10)? '0':'')+Dedicace._today.getMinutes();

        return content;
    },

    returnTimeStamp : function() {
        Dedicace._today.setSeconds(00);
        return Math.ceil(Dedicace._today.getTime()/1000);
    },

    valideDedicace : function() {
        var h=0;
        var m=0;
        var test_m='';

        if(Dedicace._select_hour.nextCard>0) h=$('#wrapperH ul#deck li:nth-child('+Dedicace._select_hour.nextCard+')').find('div').html();
        else h=$('#wrapperH ul#deck li:last-child').find('div').html();
        h=substr(h,0,-1);
        if(Dedicace._select_min.nextCard>0) m=$('#wrapperM ul#deck li:nth-child('+Dedicace._select_min.nextCard+')').find('div').html();
        else m=$('#wrapperM ul#deck li:last-child').find('div').html();
        m=substr(m,0,-3);

        test_m=m*3;
        //alert('test_m= '+test_m);

        if(!isNaN(test_m)) {
            Dedicace._today.setHours(h,m,0);
            //Dedicace._today.setMinutes(m);

            //Dedicace._today.setSeconds(00);
            //Dedicace._today.setMilliseconds(000);

            $('#step1bis').css('display','none');
            $('#step2').fadeIn();
            $('.seach-dedicace .champs').fadeOut();
            $('#step2').html('<div align="center"><img src="images/player/301.gif" border="0" width="50" /></div>');
            //alert('&dateheure='+Dedicace._today.getTime());
            //console.log('&dateheure='+(Dedicace._today.getTime()/1000)+', heure='+h+', m='+m);
            console.log('jembe.http.post url: '+Dedicace._url_get_list+',artiste=&chaine_recherche='+escape(Dedicace._search_words)+'&dateheure='+(Dedicace._today.getTime()/1000)+'&mode');
           
			jembe.http.post({
                url: Dedicace._url_get_list,
               // data: 'artiste=&chaine_recherche='+escape(Dedicace._search_words)+'&dateheure='+(Dedicace._today.getTime()/1000)+'&mode=',
			    data: 	'artiste='
						+'&chaine_recherche='+escape(Dedicace._search_words)
						+'&dateheure='+(Dedicace._today.getTime()/1000)
						+'&platform='+jembe.info.platform
						+'&idtel='+jembe.info.uuid
						+'&mode=',
			   
                onSuccess: Dedicace.callback_selectDay,
                onError: Dedicace.callback_error_search
            });
        }else {
            alert('Le créneau horaire que vous avez choisi n\'est pas disponible');
        }
    },

    callback_selectDay : function(msg) {
        console.log('callback_search : msg='+msg);
		try {
			
			eval('Dedicace._json_list = '+msg);
			//console.log('Dedicace._json_list.length'+Dedicace._json_list.length);
			
			if (Dedicace._json_list.code!=10)
				{
					console.log('affichage des résultats');
				}
				else
				{
					console.log('Pas de résultat affichage pop up code 10');
					if (jembe.info.platform=="server") 
						{
						    console.log('serveur');
							//jembe.alert.show({
							//		message : 'Aucun résultat.'
								
									//onSuccess : Dedicace.callback_select_options
							//});
			
						}
						else
						{
						    console.log('mobile');
							jembe.alert.show({
									message : 'Aucun résultat.',
									buttons : 'Envoyer un email|Annuler',
									onSuccess : Dedicace.callback_select_options
							});
						}	
				}
			Dedicace.displayTitles();				
				
		} catch(e) {
		    console.log('Pas de résultat affichage pop up');
	        jembe.alert.show({
				message : 'Aucun résultat.',
	            buttons : 'Envoyer un email|Annuler',
	            onSuccess : Dedicace.callback_select_options
	        });
		}
    },

	callback_error_search:function(err) {
		console.log('search error :'+JSON.stringify(err));
	},

	callback_select_options : function(button) {
	    if (button==0) {
			Api.switchMenu('contact');
			$('#c_message').val('La recherche "'+Dedicace._search_words+'" ne renvoie aucun résultat.');
		} else {
			console.log('retour à la liste');
			Dedicace._search_words='';
			Dedicace.valideDedicace();
		}
	},

    displayTitles : function() {
        var content ='';
        content += ' <table cellpadding="0" cellspacing="0" border="0" class="table-dedicace">' +
                    '<tr>' +
                        '<td class="title">' +
                            'sélectionner<br />votre titre<br /><span id="datetime2"></span>' +
                            '<div class="fs1" aria-hidden="true" onclick="Dedicace.backStep1bis();" data-icon="&#xe136;"></div>' +
                            '<div class="seach-dedicace">' +
                                '<div class="champs"><input type="text" value="" placeholder="Recherche #disco, #pop..." id="input_recherche" value="'+Dedicace._search_words+'" /></div>' +
                                '<div class="button" aria-hidden="true" data-icon="&#xe07f;" onclick="Dedicace.launch_search();"></div>' +
                            '</div>' +
                        '</td>' +
                    '</tr>';
        for(var i=0;i<Dedicace._json_list.length;i++) {
            content +=  '<tr>'+
                            '<td class="line-artiste" onclick="Dedicace.openLineArtiste('+i+');">' +
                                '<table width="100%" cellpadding="5" cellspacing="0" border="0" style="background-color: '+Dedicace._json_list[i].background_color+';">' +
                                    '<tr>' +
                                        '<td valign="top" width="60">' +
                                            '<div style="position:relative;" id="btn_play_pause_dedicace_'+i+'">' +
                                                '<div>'+Dedicace._json_list[i].element_image+'</div>';
            if (Dedicace._json_list[i].extrait_audio!='')
            content +=                          '<div class="play" onclick="Dedicace.play('+i+')"><img src="images/player/play.png" /></div>'+
                                                '<div class="pause" onclick="Dedicace.pause('+i+')"><img src="images/player/pause.png" /></div>';
            content +=                      '</div>' +
                                            '<div class="line_play_dedicace" id="line_'+i+'_play_dedicace"><div class="timer_dedicace"></div></div>' +
                                        '</td>' +
                                        '<td valign="top">' +
                                            '<strong style="text-transform:uppercase;">'+Dedicace._json_list[i].artiste+' - '+Dedicace._json_list[i].titre+'</strong><br /><small>'+Dedicace._json_list[i].fld_next_available+'</small>' +
                                        '</td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<td colspan="2">' +
                                            '<div id="line-artiste-'+i+'" style="display:none;">' +
                                                '<div>Album : '+Dedicace._json_list[i].album+'</div>' +
                                                '<div><em>'+Dedicace._json_list[i].annee+' - '+Dedicace._json_list[i].duree+'</em></div>' +
                                                '<div class="popularite">'+Dedicace._json_list[i].popularite+'</div>' +
                                                '<div>' +
                                                    ((Dedicace._json_list[i].fld_next_available.indexOf('red-cross')<0) ? '<a href="javascript:" onclick="Dedicace.dedicacer('+Dedicace._json_list[i].id_musique+');"><span class="fs1" aria-hidden="true" data-icon="&#xe008;"></span> dédicacer</a>' : '') +
                                                    //((Dedicace._json_list[i].extrait_audio!='') ? '<a href="javascript:" onclick="Dedicace.playPause('+i+');" class="playPause" id="btn_playpause_'+i+'"><span class="fs1" aria-hidden="true" data-icon="&#xe105;"></span></a><a href="javascript:" class="playPause"  onclick="Dedicace.stop('+i+');Player.playDirect()"><img src="images/player/refresh.png" border="0" height="30"></a>' : '')+
                                                '</div>' +
                                            '</div>' +
                                        '</td>' +
                                    '</tr>' +
                                '</table>' +
                            '</td>'+
                        '</tr>';
        }

        content += '</table>';

        $('#step2').html(content);
        $('#datetime2').html(Dedicace.returnDayString()+' à '+Dedicace.returnTimeString());
		
		
		 $('.seach-dedicace .champs').show();
       // this._search_open=true; 
		
		
        //Api._scrollPage_Dedicace.refresh();
    },
	
	stop : function(p_id) {
        console.log('****************************************** stop ='+p_id);
        $('#line_'+p_id+'_play_dedicace').fadeOut();
        $('#btn_play_pause_dedicace_'+p_id).find('.pause').css('display','none');
        $('#btn_play_pause_dedicace_'+p_id).find('.play').css('display','block');
        Dedicace._current_dedicace_play=-1;
	},

    play : function(p_id) {
        console.log('-------------------------------------------------------------------***********'+Dedicace._current_dedicace_play+'!='+p_id);
        if(Dedicace._current_dedicace_play!=p_id) {
            Dedicace.stop(Dedicace._current_dedicace_play);
        }
        $('#line_'+p_id+'_play_dedicace').fadeIn().find('.timer_dedicace').css('width','0%').stop().animate({'width':'100%'},31000);
        $('#btn_play_pause_dedicace_'+p_id).find('.pause').css('display','block').delay(31000).fadeOut();
        $('#btn_play_pause_dedicace_'+p_id).find('.play').css('display','none').delay(31000).fadeIn(function() {
            //$(this).css('display','block');
            //Dedicace._current_dedicace_play='-1';
            //$('#line_'+p_id+'_play_dedicace').fadeOut();
            if(Dedicace._current_dedicace_play==p_id) {
                Dedicace.stop(p_id);
                Player.player.pause();
            }
        });
        Player.refresh_status('dedicace');
        Player.player.aod({
            'track_url': Dedicace._json_list[p_id].extrait_audio,
            'time_end': getTimeStamp()+10000,
            'time_start': getTimeStamp()
        });
        Dedicace._current_dedicace_play=p_id;
    },

    pause : function(p_id) {
        Player.refresh_status('dedicace');
        Player.player.pause();
        Dedicace.stop(p_id);
    },

    playPause : function(p_id) {
        console.log('playPause function');
		Player.refresh_status('dedicace');
        if(Dedicace._current_dedicace_play==p_id) {
            //pause
            console.log('pause dedicace');
            Dedicace.stop(p_id);
        } else {
            //play
            $('#line_'+p_id+'_play_dedicace').fadeIn().find('.timer_dedicace').css('width','0%').stop().animate({'width':'100%'},31000);
            $('#btn_playpause_'+p_id).html('<span class="fs1" aria-hidden="true" data-icon="&#xe107;"></span>').delay(31000).fadeIn(function() {
                $(this).html('<span class="fs1" aria-hidden="true" data-icon="&#xe105;"></span>');
                Dedicace._current_dedicace_play='-1';
                $('#line_'+p_id+'_play_dedicace').fadeOut();
            });


            Player.player.aod({
                'track_url': Dedicace._json_list[p_id].extrait_audio,
                'time_end': getTimeStamp()+10000,
                'time_start': getTimeStamp()
            });
            Player.refresh_status('dedicace');

            Dedicace._current_dedicace_play=p_id;
        }
    },

    openLineArtiste : function(p_num) {
        if(this._line_open!=='' && this._line_open!==p_num) $('#line-artiste-'+this._line_open).slideUp();
        this._line_open=p_num;
        $('#line-artiste-'+this._line_open).slideDown(function() {
            //Api._scrollPage_Dedicace.refresh();
        });
    },

    launch_search : function() {
        //if(this._search_open) {
		    console.log('launch_search OPEN');
		
            // lance la recherche
            Dedicace._search_words=$('#input_recherche').val();
            this.valideDedicace();
           // this._search_open=false;
		   
		   
			Dedicace.refreshMenu();
			//setTimeout(Dedicace.refreshMenu,1000);

       // } else {
		 //   console.log('launch_search CLOSED');
           // $('.seach-dedicace .champs').toggle();
            this._search_open=true;
       // }

    },

	refreshMenu : function() {
		console.log('refreshMenu >'+_pos_menu)
		//document.getElementById('menu').style.bottom:
		$('#menu').css('top',(_pos_menu)+'px');
	},

    backStep1 : function() {
        $('#step3').fadeOut().html('<div align="center"><img src="images/player/301.gif" border="0" width="50" /></div>');
        $('#step2').fadeOut().html('<div align="center"><img src="images/player/301.gif" border="0" width="50" /></div>');
        $('#step1bis').fadeOut();
        $('#step1').fadeIn(function() {
            //Api._scrollPage_Dedicace.refresh();
        });
    },

    backStep1bis : function() {
        $('#step3').fadeOut().html('<div align="center"><img src="images/player/301.gif" border="0" width="50" /></div>');
        $('#step2').fadeOut().html('<div align="center"><img src="images/player/301.gif" border="0" width="50" /></div>');
        $('#step1bis').fadeIn();
        $('#step1').fadeOut(function() {
            //Api._scrollPage_Dedicace.refresh();
        });
    },

    backStep2 : function() {
        $('#step3').fadeOut().html('<div align="center"><img src="images/player/301.gif" border="0" width="50" /></div>');
        $('#step2').fadeIn(function() {
            //Api._scrollPage_Dedicace.refresh();
        });
    },

    dedicacer :function(p_id) {
        $('#step2').css('display','none');
        $('#step3').fadeIn();

        Dedicace._id_music = p_id;

        jembe.http.post({
            url: Dedicace._url_get_info,
            data: 'id='+p_id,
            onSuccess: Dedicace.callback_dedicacer,
            onError: Dedicace.callback_error
        });
    },

    callback_dedicacer : function(msg) {
        console.log('callback_dedicacer');
        eval('Dedicace._json_info = '+msg);
        console.log(Dedicace._json_info);
        Dedicace._list_telephone_number = '';
        var content = ' <table cellpadding="0" cellspacing="0" border="0" class="table-dedicace">' +
                    '<tr>' +
                        '<td class="title">' +
                            'dédicacer<br /><span id="datetime3"></span>' +
                            '<div class="fs1" aria-hidden="true" onclick="Dedicace.backStep2();" data-icon="&#xe136;"></div>' +
                        '</td>' +
                    '</tr>';

        content +=  '<tr>' +
                        '<td class="line-artiste">' +
                            '<table width="100%" cellpadding="5" cellspacing="0" border="0">' +
                                '<tr>' +
                                    '<td valign="top" width="100"><img src="'+Dedicace._json_info[0].chemin_image+'" border="0" width="95" height="95" /></td>' +
                                    '<td valign="top">' +
                                        ''+Dedicace._json_info[0].artiste+' - '+Dedicace._json_info[0].titre+'<br /><small>'+Dedicace._json_info[0].duree+'</small>' +
                                        '<div>Album : '+Dedicace._json_info[0].album+'</div>' +
                                        '<div>'+Dedicace._json_info[0].annee+'</div>' +
                                        '<div><a href="'+Dedicace._json_info[0].lien_achat+'" target="_blank">Acheter le morceau</a></div>' +
                                    '</td>' +
                                '</tr>' +
                            '</table>' +
                        '</td>' +
                    '</tr>' +


					'<tr>' +
                        '<td class="line-artiste">' +
                            '<div id="retour_phone_number"></div>' +
                            '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
                                '<tr>' +
                                    '<td valign="top">' +
                                        '<div><a href="javascript:" onclick="Dedicace.choseInAdressBook();" class="add_phone">Informer des amis par SMS</a></div>' +
                            
                                    '</td>' +
                                '</tr>' +
                            '</table>' +
                        '</td>' +
                    '</tr>'+
					

					'<tr>' +
                        '<td>' +
						    '<div class="prenom_libeller">Votre prénom :</div>'+
							'<input type="text" class="prenom" value="" id="mon_identifiant_pour_dedicacer">'+ 
//                            '<textarea placeholder="Taper votre message" id="message_textarea" class="line-artiste" onkeydown="Dedicace.countCaract();" maxlength="255">Hello, je souhaite partager avec toi "'+Dedicace._json_info[0].titre+'" de '+Dedicace._json_info[0].artiste+'. Branche toi sur SUN à '+Dedicace.returnTimeString()+' le '+Dedicace.returnDayString()+' 93FM/RNT. Tu peux répondre à ce message musical en installant la nouvelle appli de SUN. http://www.lesonunique.com/appli</textarea>' +
                            '<textarea placeholder="Taper votre message" id="message_textarea" class="line-artiste" onkeydown="Dedicace.countCaract();" maxlength="255">Salut, je souhaite partager avec toi "'+Dedicace._json_info[0].titre+'" de '+Dedicace._json_info[0].artiste+'. Branche toi à '+Dedicace.returnTimeString()+' sur SUN 93FM/RNT. Pour installer la nouvelle application MySun clique ici http://mysun.mx et à toi de jouer \;\)</textarea>' +
                            '<div id="caract_message" style="text-align:right;font-size:11px;color:#333;padding-right:50px;"></div>' +
                        '</td>' +
                    
					'</tr>'+



					


	
                    

					
					
					'<tr>' +
                        '<td class="line-artiste">' +
//                            '<div id="retour_phone_number"></div>' +
                            '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
                                '<tr>' +
                                    '<td valign="top">' +
  //                                      '<div><a href="javascript:" onclick="Dedicace.choseInAdressBook();" class="add_phone">Informer des amis par SMS</a></div>' +
                                        '<div style="margin-top:15px;">' +
                                            '<table width="100%">' +
                                                '<tr>' +
                                                    '<td width="50%"><div><a href="javascript:" onclick="Dedicace.sendDedicace();" class="send2">envoyer ma dédicace</a></div></td>' +
													
                                                '</tr>' +
                                            '</table>' +
                                        '</div>' +
                                    '</td>' +
                                '</tr>' +
                            '</table>' +
                        '</td>' +
                    '</tr>';

        content += '</table>';

        $('#step3').html(content).fadeIn(function() {
            $('#datetime3').html(Dedicace.returnDayString()+' à '+Dedicace.returnTimeString());
            var num_caract=$('#message_textarea').val();
            $('#caract_message').text(num_caract.length+'/256');
            //Api._scrollPage_Dedicace.refresh();
        });
    },

    countCaract : function() {
        var num_caract=$('#message_textarea').val();
        $('#caract_message').text(num_caract.length+'/256');
    },

    choseInAdressBook : function() {
	     if (jembe.info.platform!="server") {
				jembe.alert.show({
						message : 'Choisir',
						onSuccess : Dedicace.choseInAdressBookDevice,
						buttons : 'dans le repertoire|nouveau numero'
				});
			}
		else{
		  Dedicace.choseInAdressBookDevice(1);
		}			
		
    },

    choseInAdressBookDevice : function(button) {
        if (button==0) {
            jembe.addressbook.search({
                onSelected : Dedicace.callback_addressbook_selected,
                onCancel : Dedicace.callback_error_addressbook
            });
        } else if(button==1) {
            Dedicace._num_of_tel++;
            Dedicace._num_line_adressbook++;
            var content =   '<div id="line_addressbook_'+Dedicace._num_line_adressbook+'" style="padding:5px;background:#fff;margin-bottom:2px;">' +
                                '<table cellpadding="0" cellspacing="0" border="0" width="100%">' +
                                    '<tr>' +
                                        '<td>' +
                                            '<div>Nouveau numéro</div>' +
                                            '<div><input type="tel" value="" onblur="Dedicace.sms_params();" id="phone_number_'+Dedicace._num_of_tel+'" /></div>' +
                                        '</td>' +
                                        '<td align="center" width="30" onclick="Dedicace.delete_adressbook('+Dedicace._num_line_adressbook+');"><a href="javascript:" data-icon="&#xe0fd;"></a></td>' +
                                    '</tr>' +
                                '</table>' +
                            '</div>';

            if(Dedicace._num_of_tel<=Dedicace._num_of_tel_max) $('#retour_phone_number').append(content);
            if(Dedicace._num_of_tel==Dedicace._num_of_tel_max) {
                $('a.add_phone').css('display','none');
                alert('Vous avez atteint le nombre maximal de numéro téléphone!');
            }
        }

    },

    callback_addressbook_selected : function(msg) {
        var options_tel='';
        Dedicace._json_adressbook = msg;
        Dedicace._adressBook_name=Dedicace._json_adressbook.firstname;
        Dedicace._adressBook_lastname=Dedicace._json_adressbook.lastname;
        //alert(JSON.stringify(msg));
        for(var i=0;i<Dedicace._json_adressbook.phones.length;i++) {
            options_tel += ((options_tel!='')? '|':'')+Dedicace._json_adressbook.phones[i];
        }
        //alert('Dedicace._json_adressbook.phones.lenght ='+Dedicace._json_adressbook.phones.length);
        //alert('options_tel='+options_tel);
        jembe.alert.show({
            buttons : options_tel,
            onSuccess : Dedicace.callback_addressbook
        });
    },

    callback_addressbook : function(button) {
        //console.log('callback_addressbook');
        Dedicace._adressBook_phone=Dedicace._json_adressbook.phones[button];
        Dedicace._num_of_tel++;
        Dedicace._num_line_adressbook++;
        var content =   '<div id="line_addressbook_'+Dedicace._num_line_adressbook+'" style="padding:5px;background:#fff;margin-bottom:2px;">' +
                            '<table cellpadding="0" cellspacing="0" border="0" width="100%">' +
                                '<tr>' +
                                    '<td>' +
                                        '<div>'+Dedicace._adressBook_name+' '+Dedicace._adressBook_lastname+'</div>' +
                                        '<div><input type="text" value="'+Dedicace._adressBook_phone+'" id="phone_number_'+Dedicace._num_of_tel+'" readonly="readonly"  /></div>' +
                                    '</td>' +
                                    '<td align="center" width="30" onclick="Dedicace.delete_adressbook('+Dedicace._num_line_adressbook+');"><a href="javascript:" data-icon="&#xe0fd;"></a></td>' +
                                '</tr>' +
                            '</table>' +
                        '</div>';

        if(Dedicace._num_of_tel<=Dedicace._num_of_tel_max) $('#retour_phone_number').append(content);
        if(Dedicace._num_of_tel==Dedicace._num_of_tel_max) {
            $('a.add_phone').css('display','none');
            alert('Vous avez atteint le nombre maximal de numéro téléphone!');
        }
        Dedicace.sms_params();
        //Api._scrollPage_Dedicace.refresh();
    },

    callback_error_addressbook : function(msg) {
        console.log('cancel adressbook ='+msg);
    },

    delete_adressbook : function(p_id) {
        Dedicace._num_of_tel--;
        $('a.add_phone').css('display','block');
        $('#line_addressbook_'+p_id).remove();
        Dedicace.sms_params();
    },

    sms_params : function() {
        Dedicace._list_telephone_number = '';
        var compteur_num=0;
        $('#retour_phone_number input').each(function() {
            Dedicace._list_telephone_number += ((Dedicace._list_telephone_number!='') ? ',' : '')+$(this).val();
            compteur_num++;
        });
        /*if(compteur_num>0) {
            $('#smsid').fadeIn();
        } else $('#smsid').fadeOut();
        if(isIOS){
			console.log('iOS sms:'+Dedicace._list_telephone_number);
			$('#smsid').attr('href','sms:'+Dedicace._list_telephone_number);
        } else {
			console.log('Android sms://'+Dedicace._list_telephone_number+'?body='+$('#message_textarea').val());
			$('#smsid').attr('href','sms://'+Dedicace._list_telephone_number+'?body='+$('#message_textarea').val());
		}*/
    },

    sendDedicace : function() {
        //console.log('nb de tel : '+Dedicace._num_of_tel);
        var phoneNumber = Dedicace._list_telephone_number.split(',');
		jembe.http.post({
            url: Dedicace._url_send_dedicace,
            //data: 'date_recherche='+Dedicace.returnTimeStamp()+'&dedicaceOuiNom=oui&id='+Dedicace._id_music+'&nomtelephone=&telephone1='+phoneNumber[0]+'&telephone2='+phoneNumber[1]+'&telephone3='+phoneNumber[2]+'&telephone4='+phoneNumber[3]+'&telephone5='+phoneNumber[4]+'&telephonenumber='+Dedicace._list_telephone_number+'&message='+escape($('#message_textarea').val())+'&platform='+jembe.info.platform+'&platformversion='+jembe.info.platformversion+'&idtel='+jembe.info.uuid,
			
			//data: 'date_recherche='+Dedicace.returnTimeStamp()+'&dedicaceOuiNom=oui&id='+Dedicace._id_music+'&telephone1='+phoneNumber[0]+'&telephone2='+phoneNumber[1]+'&telephone3='+phoneNumber[2]+'&telephone4='+phoneNumber[3]+'&telephone5='+phoneNumber[4],
			
			//data: 'date_recherche='+Dedicace.returnTimeStamp()+'&dedicaceOuiNom=oui&id='+Dedicace._id_music+'&nomtelephone=&telephone1='+phoneNumber[0]+'&telephone2='+phoneNumber[1]+'&telephone3='+phoneNumber[2]+'&telephone4='+phoneNumber[3]+'&telephone5='+phoneNumber[4]+'&message='+escape($('#message_textarea').val())+'&platform='+jembe.info.platform+'&prenom='+escape($('#mon_identifiant_pour_dedicacer').val())+'&idtel='+jembe.info.uuid,
			
			
  			 data: 'date_recherche='+Dedicace.returnTimeStamp()
					+'&dedicaceOuiNom=oui'
					+'&id='+Dedicace._id_music
					+'&nomtelephone='
					+'&telephone1='+phoneNumber[0]
					+'&telephone2='+phoneNumber[1]
					+'&telephone3='+phoneNumber[2]
					+'&telephone4='+phoneNumber[3]
					+'&telephone5='+phoneNumber[4]
					+'&message='+escape($('#message_textarea').val())
					+'&platform='+jembe.info.platform
					+'&prenom='+escape($('#mon_identifiant_pour_dedicacer').val())
					+'&idtel='+jembe.info.uuid,
			
            onSuccess: Dedicace.callback_sendDedicace,
            onError: Dedicace.callback_error
        });
    },

    callback_sendDedicace : function(msg) {
          console.log('callback_sendDedicace test = '+msg);
        eval('Dedicace._json_callback_send_dedicace = '+msg);
        //alert(Dedicace._json_callback_send_dedicace.code);
        if(Dedicace._json_callback_send_dedicace.code==100 || Dedicace._json_callback_send_dedicace.code==101)
			{
			    console.log('100 101 renvoi dédicace');
				alert(Dedicace._json_callback_send_dedicace.message);
				//Dedicace.backStep1();
				Api.switchMenu('direct');
			} 
			else
			if(Dedicace._json_callback_send_dedicace.code==102) 
				{
				    console.log('102 renvoi dédicace');
					alert(Dedicace._json_callback_send_dedicace.message);
					Dedicace.backStep1();
				} 
				else
				if(Dedicace._json_callback_send_dedicace.code==103) 
					{
					    console.log('103 renvoi dédicace');
						alert(Dedicace._json_callback_send_dedicace.message);
						Dedicace.backStep1();
					} 
					else
					if(Dedicace._json_callback_send_dedicace.code==301) 
					{
					    console.log('301 renvoi dédicace');
						alert(Dedicace._json_callback_send_dedicace.message);
						
						//jembe.alert.show({
						//	message : Dedicace._json_callback_send_dedicace.message,
						//	buttons : 'valider',
						//	onSuccess : Dedicace.callback_renvoyer_dedicace
						//});
						
						Dedicace.callback_renvoyer_dedicace();
						Dedicace.backStep1();						
					} 
	    
    },
	
	
	callback_renvoyer_dedicace : function() {
					var phoneNumber = Dedicace._list_telephone_number.split(',');	
					console.log('renvoyer dedicace');
					console.log('id_musique'+Dedicace._json_callback_send_dedicace.id_musique);
					console.log('verrou'+Dedicace._json_callback_send_dedicace.verrou);
					console.log('date_recherche='+Dedicace._json_callback_send_dedicace.timestamps);
			
					jembe.http.post({
					    url: Dedicace._url_send_dedicace,
						data: 'date_recherche='+Dedicace._json_callback_send_dedicace.timestamp
								+'&dedicaceOuiNom=oui'
								+'&id='+Dedicace._json_callback_send_dedicace.id_musique
								+'&verrou='+Dedicace._json_callback_send_dedicace.verrou
								+'&nomtelephone=&telephone1='+phoneNumber[0]
								+'&telephone2='+phoneNumber[1]
								+'&telephone3='+phoneNumber[2]
								+'&telephone4='+phoneNumber[3]
								+'&telephone5='+phoneNumber[4]
								+'&message='+escape($('#message_textarea').val())
								+'&platform='+jembe.info.platform
								+'&prenom='+escape($('#mon_identifiant_pour_dedicacer').val())
								+'&idtel='+jembe.info.uuid,
					    onSuccess: Dedicace.callback_sendDedicace,
					    onError: Dedicace.callback_error
					});						
				},		
	
}
