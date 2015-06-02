Api = {

    _currentMenu : 'informations',

    _scrollPage_Podcasts : '',

    _scrollPage_Videos : '',

    _scrollPage_Contact : '',

    _scrollPage_Informations : '',

    _scrollPage_Dedicace : '',

    _list_destinataire : '',

    init : function(){
        //this.declareScroll();
        this.start('direct');
        this.initVar();
    },

    initVar : function() {
        $('#num_message').attr('href','tel:'+Flux._frap_flux.telephone_msg);
        $('#num_standard').attr('href','tel:'+Flux._frap_flux.telephone_std);

        $('#informations_bloc').html(Flux._frap_flux.informations);
        $('#version_bloc').html(Flux._frap_flux.version);

        for(var d=0;d<Flux._frap_flux.destinataires.length;d++) {
            this._list_destinataire += '<option value="'+Flux._frap_flux.destinataires[d].mail+'">'+Flux._frap_flux.destinataires[d].nom+'</option>';
        }
        $('#c_destinataire').append(this._list_destinataire);
    },
	
    declareScroll : function () {
        this._scrollPage_Podcasts = new iScroll('page_podcasts',{
            useTransform: true,
            useTransition: true,
            vScroll: true,
            handleClick: true
        });
        this._scrollPage_Videos = new iScroll('page_videos',{
            useTransform: true,
            useTransition: true,
            vScroll: true,
            handleClick: true
        });
        this._scrollPage_Contact = new iScroll('page_contact',{
            useTransition: true,
            onBeforeScrollStart: function (e) {
                var target = e.target;
                while (target.nodeType != 1) target = target.parentNode;

                if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                    e.preventDefault();
            }
        });
        this._scrollPage_Informations = new iScroll('page_informations',{
            useTransform: true,
            useTransition: true,
            vScroll: true,
            handleClick: true
        });
        this._scrollPage_Dedicace = new iScroll('page_dedicace',{
            useTransition: true,
            onBeforeScrollStart: function (e) {
                var target = e.target;
                while (target.nodeType != 1) target = target.parentNode;

                if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                    e.preventDefault();
            }
        });
    },
	
    update : function () {
        /*height_page=(window.innerHeight-_menu_height);
        $('.page').css('height',(height_page)+'px');
        $('#container').css('height',height_page+'px');
        if(this._currentPage==='direct') {
            //this._scrollPage.refresh();
        } else if(this._currentPage==='podcasts') {
            //this._scrollPage_Podcasts.refresh();
        } else if(this._currentPage==='informations') {
            //this._scrollPage_Informations.refresh();
        } else if(this._currentPage==='dedicace') {
            //this._scrollPage_Dedicace.refresh();
        }*/
    },

    openNav : function() {
        if(open_nav) {
            $('#header .nav').slideUp();
        } else {
            $('#header .nav').slideDown();
        }
        open_nav=!open_nav;
    },

    switchMenu : function(p_menu) {
        if(this._currentMenu!=p_menu) {
            $('#menu #'+this._currentMenu).removeClass('active');
            $('#partage_direct').animate({'top':'-100px'},400);
            $('#page_'+this._currentMenu).animate({'left':'-100%'},300);
            this._currentMenu=p_menu;
            $('#menu #'+this._currentMenu).addClass('active');
            $('#page_'+this._currentMenu).css('left','100%').animate({'left':'0px'},300);
		
            Videos.stop();

            switch(p_menu){
                case 'direct':
                    $('#jsplayer').removeClass('bg');
                    $('#jsplayer .control .controller').css('display','block');
                    $('#jsplayer').css('bottom','100%').animate({'top':'250px'},300);
                    $('#partage_direct').animate({'top':'125px'},300);
                break;
                case 'podcasts':
                    $('#jsplayer').animate({'top':'-100%'},400);
                break;
                case 'videos':
                    $('#jsplayer').animate({'top':'-100%'},400);
                break;
                case 'contact':
                    $('#jsplayer').animate({'top':'-100%'},400);
                break;
                case 'informations':
                    $('#jsplayer').animate({'top':'-100%'},400);
                    this.openNav();
                break;
                case 'dedicace':
                    $('#jsplayer').animate({'top':'-100%'},400);
                break;
            }
        }
    },

    start : function(p_menu) {
        this._currentMenu=p_menu;
        $('#menu #'+this._currentMenu).addClass('active');
        $('#page_'+this._currentMenu).css('left','0px');

        if(this._currentMenu=='direct') $('#partage_direct').css({'top':'125px'});
    }
}
