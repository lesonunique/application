var ismobile;
var istablet;
var menu_open_android=false;
var _is_firstTimeOOL = true;
var is_waiting=false;
var _is_alert=false;
var is_started=false;
var isIOS=false;
var isAndroid2=false;
var open_nav=false;
var moveContainer=false;
var espaceTouch=0;
var _header_nav_height= 0;
var _menu_height = 0;
var height_page=0;
var _pos_menu=0;
var _my_date_to_quit = new Date();
var jours = new Array('Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi');
var mois = new Array('Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre');
var getClickEvent = function() {return ('ontouchstart' in window) ? 'touchstart' : 'mousedown';};
var getOnClickEvent = function() {return ('ontouchstart' in window) ? 'ontouchstart' : 'onmousedown';};
var getOnMoveEvent = function() {return ('ontouchmove' in window) ? 'touchmove' : 'mousemove';};
var getOnMoveEndEvent = function() {return ('ontouchend' in window) ? 'touchend' : 'mouseup';};

if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/Chrome/i))) isIOS = true;
if(navigator.userAgent.match(/Android/i)) isAndroid2 = true;

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    document.addEventListener("backbutton", showConfirm, false);
	console.log(navigator.connection.type);
	console.log(navigator.onLine);
	
	function refreshConnect()
	{
		var statutConnect = navigator.onLine;
	
		if (statutConnect==false) 
		{
			onOffline();
			console.log('OFFLINE');
		}
		else
		{
			console.log('ONLINE');
		}
	}
	
	setInterval(refreshConnect,6000);
}

// process the confirmation dialog result
function onConfirm(button) {
    //alert('Vous avez appuyé sur le bouton ' + button);
    if (button == 1) 
    {
    	console.log('App close');
    	navigator.app.exitApp();
    }
    else 
    {
    	console.log('Windows close');
        //window.close();
	return;
    }
}

function showConfirm() {
    navigator.notification.confirm(
        'Voulez-vous quitter l\'application ?',  // message
        onConfirm,            // fonction de callback appelée avec l'indice du bouton pressé
        'Quitter',            // titre
        ['Oui','Non']  // libellés des boutons
    );
}


$(document).ready(function () {
	ismobile = (/iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(navigator.userAgent.toLowerCase()));
	istablet = (/ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase()));
	jembe.settings.set({'param':'status-bar-style', 'value':'dark'});
	jembe.alert.notify({'tickerText': 'Sun Radio', 'contentTitle': 'Sun Radio', 'contentText': '', 'flag': 'service'});
	jembe.control.listenState(minimizeAPI);

    _header_nav_height = $('#header .nav').height();
    _menu_height=($('#menu').height()+20);
    height_page=(window.innerHeight-_menu_height);
	_pos_menu = window.innerHeight-_menu_height+19;


    $('#btn_android_footerHome').on(getClickEvent(), function() {
        jembe.control.quit();
    });
    $('#header .bottom').on(getOnMoveEndEvent(), function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        Api.openNav();
    });
    $('#menu #direct').on(getOnMoveEndEvent(), function() {
        Api.switchMenu('direct');
    });
    $('#menu #podcasts').on(getOnMoveEndEvent(), function() {
        Api.switchMenu('podcasts');
    });
    $('#menu #videos').on(getOnMoveEndEvent(), function() {
        Api.switchMenu('videos');
    });
    $('#menu #contact').on(getOnMoveEndEvent(), function() {
        Api.switchMenu('contact');
    });
    $('#header #informations').on(getOnMoveEndEvent(), function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        Api.switchMenu('informations');
    });
    $('#page_contact .c_telecharger').on(getClickEvent(), function() {
        Contact.select_options();

    });
    $('#box_partage_direct .btn').on(getClickEvent(), function() {
        Direct.menuToggle();
    });

    $('#page_podcasts').swipe( {
        swipe:function(event, direction, distance, duration, fingerCount) {
            console.log("You swiped " + direction );
            if(direction=='right') Podcasts.changeDate('moins');
            else if(direction=='left') Podcasts.changeDate('plus');
        },
        threshold: 130,
        allowPageScroll : 'vertical'
    });

    Flux.init();
});

function minimizeAPI(newState) {
	if(newState=="resume") {
		// come back
	} else {
		_my_date_to_quit=(new Date()).getTime();
	}
}

function openMenuAndroid() {
	if(menu_open_android) {
		$('#btn_android_footerHome').slideUp();
		menu_open_android=false;
	} else {
		$('#btn_android_footerHome').slideDown();
		menu_open_android=true;
	}
}

function onOffline() {
	navigator.notification.confirm(
        'La connexion est perdue. Veuillez vérifier l\'état du réseau.',  // message
        newCheckReseau,            // fonction de callback appelée avec l'indice du bouton pressé
        'Problème réseau',            // titre
        ['Annuler','Réessayer']  // libellés des boutons
    );
}

function newCheckReseau(button) {
	if (button == 1) 
    {
    	console.log('App close');
    	navigator.app.exitApp();
    }
    else 
    {
    	console.log('Retest');
		var statutConnect = navigator.onLine;
		if (statutConnect==false) 
		{
			onOffline();
		}
		else
		{
			Flux.init();
		}
		window.close();
    }
}

var getMouseY = function(e){
    if ('ontouchmove' in window) {
        //iOS & android
        mouseY = e.originalEvent.targetTouches[0].pageY;
        return mouseY;
    } else if(window.navigator.msPointerEnabled) {
        //Win8
        mouseY = e.originalEvent.targetTouches[0].pageY;
        return mouseY;
    } else {
        mouseY = e.pageY;
        return mouseY;
    }
}

function substr (str, start, len) {
    var i = 0,
        allBMP = true,
        es = 0,
        el = 0,
        se = 0,
        ret = '';
    str += '';
    var end = str.length;
    this.php_js = this.php_js || {};
    this.php_js.ini = this.php_js.ini || {};
    switch ((this.php_js.ini['unicode.semantics'] && this.php_js.ini['unicode.semantics'].local_value.toLowerCase())) {
        case 'on':
            for (i = 0; i < str.length; i++) {
                if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) {
                    allBMP = false;
                    break;
                }
            }

            if (!allBMP) {
                if (start < 0) {
                    for (i = end - 1, es = (start += end); i >= es; i--) {
                        if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) {
                            start--;
                            es--;
                        }
                    }
                } else {
                    var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
                    while ((surrogatePairs.exec(str)) != null) {
                        var li = surrogatePairs.lastIndex;
                        if (li - 2 < start) {
                            start++;
                        } else {
                            break;
                        }
                    }
                }

                if (start >= end || start < 0) {
                    return false;
                }
                if (len < 0) {
                    for (i = end - 1, el = (end += len); i >= el; i--) {
                        if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) {
                            end--;
                            el--;
                        }
                    }
                    if (start > end) {
                        return false;
                    }
                    return str.slice(start, end);
                } else {
                    se = start + len;
                    for (i = start; i < se; i++) {
                        ret += str.charAt(i);
                        if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) {
                            se++; // Go one further, since one of the "characters" is part of a surrogate pair
                        }
                    }
                    return ret;
                }
                break;
            }
        case 'off':
        default:
            if (start < 0) {
                start += end;
            }
            end = typeof len === 'undefined' ? end : (len < 0 ? len + end : len + start);
            return start >= str.length || start < 0 || start > end ? !1 : str.slice(start, end);
    }
    return undefined;
}

function print_r(array, return_val) {
    var output = '',
        pad_char = ' ',
        pad_val = 4,
        d = this.window.document,
        getFuncName = function(fn) {
            var name = (/\W*function\s+([\w\$]+)\s*\(/)
                .exec(fn);
            if (!name) {
                return '(Anonymous)';
            }
            return name[1];
        };
    repeat_char = function(len, pad_char) {
        var str = '';
        for (var i = 0; i < len; i++) {
            str += pad_char;
        }
        return str;
    };
    formatArray = function(obj, cur_depth, pad_val, pad_char) {
        if (cur_depth > 0) {
            cur_depth++;
        }

        var base_pad = repeat_char(pad_val * cur_depth, pad_char);
        var thick_pad = repeat_char(pad_val * (cur_depth + 1), pad_char);
        var str = '';

        if (typeof obj === 'object' && obj !== null && obj.constructor && getFuncName(obj.constructor) !==
            'PHPJS_Resource') {
            str += 'Array\n' + base_pad + '(\n';
            for (var key in obj) {
                if (Object.prototype.toString.call(obj[key]) === '[object Array]') {
                    str += thick_pad + '[' + key + '] => ' + formatArray(obj[key], cur_depth + 1, pad_val, pad_char);
                } else {
                    str += thick_pad + '[' + key + '] => ' + obj[key] + '\n';
                }
            }
            str += base_pad + ')\n';
        } else if (obj === null || obj === undefined) {
            str = '';
        } else { // for our "resource" class
            str = obj.toString();
        }

        return str;
    };

    output = formatArray(array, 0, pad_val, pad_char);

    if (return_val !== true) {
        if (d.body) {
            this.echo(output);
        } else {
            try {
                d = XULDocument; // We're in XUL, so appending as plain text won't work; trigger an error out of XUL
                this.echo('<pre xmlns="http://www.w3.org/1999/xhtml" style="white-space:pre;">' + output + '</pre>');
            } catch (e) {
                this.echo(output); // Outputting as plain text may work in some plain XML
            }
        }
        return true;
    }
    return output;
}

function utf8_decode(str_data) {

    var tmp_arr = [],
        i = 0,
        ac = 0,
        c1 = 0,
        c2 = 0,
        c3 = 0,
        c4 = 0;

    str_data += '';

    while (i < str_data.length) {
        c1 = str_data.charCodeAt(i);
        if (c1 <= 191) {
            tmp_arr[ac++] = String.fromCharCode(c1);
            i++;
        } else if (c1 <= 223) {
            c2 = str_data.charCodeAt(i + 1);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            i += 2;
        } else if (c1 <= 239) {
            // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        } else {
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            c4 = str_data.charCodeAt(i + 3);
            c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
            c1 -= 0x10000;
            tmp_arr[ac++] = String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF));
            tmp_arr[ac++] = String.fromCharCode(0xDC00 | (c1 & 0x3FF));
            i += 4;
        }
    }

    return tmp_arr.join('');
}
