 FrapFlux = {
	
	id: 'sun',
	nom: 'Sun Radio',
	racine: 'http://www.lesonunique.com/',
	//racine_services: 'http://sun.lafrap.fr/',
	//racine_services: 'http://www.lesonunique.com/',
	//racine_services: 'http://80.82.229.204:80/',
	racine_services: 'http://80.82.229.214/',
	repertoire_dedicace: 'dedicace',
	
	mp3_direct: {
	    iOS: 'http://80.82.229.202/sun.aac',
	    android: 'http://80.82.229.202:8000/sun.ogg',
	    hifi: 'http://80.82.229.202:8000/sunhd.mp3',
	    lofi: 'http://80.82.229.202:8000/sunhd.mp3'
	},	
	mp3_ts: 'http://80.82.229.202:8000/.mp3?date=%HMS%',
	mp3_racine_podcast : '/home/www/lesonunique/sites/defaut/files/podcasts',
	ws_meta_direct:'http://lesonunique.com/appli/now.json',
	//ws_meta_direct:'http://80.82.229.204:80/appli/now.json',
	ws_podcasts: 'http://80.82.229.204/services/views/services.json',
	ws_video: 'https://api.dailymotion.com/user/lesonunique/videos&fields=thumbnail_medium_url,id,title,channel,owner,embed_html,duration,views_total,url', 
		
	facebook_url : 'https://www.facebook.com/lesonunique',
	twitter_msg: 'J\'écoute {url} #sunradio #sunapp',
	telephone_std: '0240133213',
	telephone_msg: '0240133212',
	email_contact: 'contact@lesonunique.com',
	url_like: '',
	
	url_dedicace: 'http://www.lesonunique.com/datasun/selection_auditeur/selection_date_jquery.php',
	url_contact: 'http://lesonunique.com/appli/send.php',
	
	refresh_direct:'50000',
	
	destinataires : [
		{nom:'Contact',mail:'contact@lesonunique.com'},
		{nom:'Proposer un titre',mail:'dedicace@lesonunique.com'},
		{nom:'Redaction',mail:'redaction@lesonunique.com'},
		{nom:'Sport',mail:'sport@lesonunique.com'},
		{nom:'Publicité',mail:'commercial@lesonunique.com'},
		{nom:'Equipe',mail:'equipe@lesonunique.com'},
		{nom:'Technique',mail:'technique@lesonunique.com'}
	],

	version : 'version 1.0.3',
	informations : "<center><b>SUN App / MySUN 2015 - <a href=\"http://www.lesonunique.com/mentions-legales\" target=\"_blank\" style=\"color: #fbba00;text-decoration: none;\" >Mentions légales</a></b></center><br><a href=\"http://www.lesonunique.com\" target=\"_blank\"><img src=\"images/logo_sun.png\" border=\"0\" style=\"float:left;width:120px;margin-right:10px;\" /></a>SUN, Le Son Unique est une radio locale généraliste diffusant sur la Loire-Atlantique. Elle travaille au rayonnement et au dynamisme de son territoire et se développe selon différents axes : diffuser une information de qualité, révéler les talents du territoire et être pionnière dans le domaine des nouvelles technologiques.<br><br> Le service MySUN (brevetée avec l'aide du Conseil Régional des Pays de la Loire) permet aux auditeurs d'intéragir en temps réel sur la programmation  et à la radio de renforcer son rôle de média de proximité. Ce service est disponible sur Apple Store et Google Play."
}
