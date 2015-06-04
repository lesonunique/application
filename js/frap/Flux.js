Flux = {

    _url_flux : 'sun.js',

    _frap_flux : '',

    init : function() {
        this.getFlux();
    },

    getFlux : function() {
		//Podcasts.init();
		$(document).ready(function() {
		$.ajax({ 
			type: 'GET',
			url: Flux._url_flux,
			timeout: 3000,
			success: function(data) {
				eval('Flux._frap_flux = '+data);
   				console.log(Flux._frap_flux);
											
				console.log('FLUX.js callback_frap 3');
				if(Flux._frap_flux) {
					console.log('FLUX.js callback_frap 4');
					Podcasts.init();
					Videos.init();
					Api.init();
					Player.init();
					Rater.init();
					Direct.init();
					Dedicace.init();
				} else {
					console.log('FLUX.js callback_frap 5');
					alert('connexion error flux');
				}
				console.log('FLUX.js callback_frap 6');
				console.log('racine_services='+Flux._frap_flux.racine_services);
			},
												//alert(data); },
			error: function() {
				//alert('La requête n\'a pas abouti');
			}
		});
		}); //fin script Jquery    
		
    },

}
