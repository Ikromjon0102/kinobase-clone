var PLAYER_TYPE = "new";
var FILE_TYPE = "hls";

var ini_recaptcha = false;
var login_movie_id = 0;
var login_favorite_id = 0;
var login_invoked_type = '';

var current_page = window.location.href;
var pathname = window.location.pathname;

function setCookie(name,value,exp_days) {
    var d = new Date();
    d.setTime(d.getTime() + (exp_days*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    var cname = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while(c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) == 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

function deleteCookie(name) {
    var d = new Date();
    d.setTime(d.getTime() - (60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = name + "=;" + expires + ";path=/";
}

function siteHost() {
    var proto = window.location.protocol;
    var host = window.location.hostname;
    var port = window.location.port;

    var site = proto +"//"+ host;
    if (port != 80) {
        site+=":"+port;
    }
    return site;
}

function reset_login_datas() {
    login_movie_id = 0;
    login_favorite_id = 0;
    login_invoked_type = '';
}

function reCaptchaCallback() {
    grecaptcha.render('grecaptcha_modal', {
        'sitekey': RECAPTCHA_SITEKEY,
        'theme': getCookie("theme") ? getCookie("theme") : 'dark'
    });
}

function reCaptcha() {
    if(!ini_recaptcha) {
        $.getScript("https://www.google.com/recaptcha/api.js?onload=reCaptchaCallback&render=explicit&hl=ru", function(data, textStatus, jqxhr) {
            if (textStatus == "success") {
                ini_recaptcha = true;
            }
        });
    }
    else if (grecaptcha !== undefined) {
        grecaptcha.reset();
    }
}

function notify(text) {
    $.notify({message: text, url: ''},{
        type: 'message',
        placement: {
            from: "bottom",
            align: "right"
        },
        allow_dismiss: false,
        delay: 500,
        template: '<div data-notify="container" class="alert alert-{0}" role="alert">' +
            '<span data-notify="message">{2}</span>' +
        '</div>'
    });
}

var ulogin = {
    vkontakte: function(redirect_url) {
        this.openPopup('vkontakte', redirect_url, 680, 400);
    },
    odnoklassniki: function(redirect_url) {
        this.openPopup('odnoklassniki', redirect_url, 620, 400);
    },
    callback: function(uid) {
        CURRENT_USER_ID = uid;

        if (login_favorite_id > 0 && login_invoked_type == "favorite") {
            $(".favorite[data-movie-id='"+login_favorite_id+"']").trigger("click");
        }
        else if (login_invoked_type == "comment") {
            $("#comment_form").submit();
        }

        if (pathname.indexOf("/login") > -1 
            || pathname.indexOf("/registration") > -1 
            || pathname.indexOf("/reset_password") > -1) {
            current_page = siteHost();
        }
        if (login_invoked_type) {
            setTimeout(function() { window.location = current_page; }, 500);
        }
        else {
            window.location = current_page;
        }
    },
    openPopup: function(service, redirect_url, width, height) {
        var left = Math.round(screen.width/2 - width/2);
        var top = 0;
        if (screen.height > height) {
            top = Math.round(screen.height/3 - height/2);
        }
        var url = "https://api.cdngate.org/social/auth.php?provider=" + service + "&redirect_url="+encodeURIComponent(redirect_url);
        var win = window.open(url, 'social_auth_' + service, 'left=' + left + ',top=' + top + ',' +
           'width=' + width + ',height=' + height + ',' +
           'personalbar=0,toolbar=0,scrollbars=1,resizable=1');
        if (win) {
            win.focus();
        }
        else {
            location.href = url;
        }
    }
};

function init_login_modal(t) {
    if (t == "register") {
        $('#modal_login .modal_error').empty();
        $('#modal_login .modal_success').empty();
        $('#modal_login .modal-title').text('Регистрация');
        $('#modal_login_form').hide();
        $('#modal_recover_form').hide();
        $('#modal_register_form').show();
        $('#modal_login').modal("show");
    }
    else if (t == "recover") {
        $('#modal_login .modal_error').empty();
        $('#modal_login .modal_success').empty();
        $('#modal_login .modal-title').text('Восстановление пароля');
        $('#modal_login_form').hide();
        $('#modal_register_form').hide();
        $('#modal_recover_form').show();
        $('#modal_login').modal("show");
    }
    else {
        $('#modal_login .modal_error').empty();
        $('#modal_login .modal_success').empty();
        $('#modal_login .modal-title').text('Вход');
        $('#modal_register_form').hide();
        $('#modal_recover_form').hide();
        $('#modal_login_form').show();
        $('#modal_login').modal("show");
    }
}

var ajax_ml = false;
function login_modal(t) {
    if (ajax_ml) {
        init_login_modal(t);
    } else {
        $.ajax({
            url: "/modal",
            data: { type: "login" },
            success: function(data) {
                ajax_ml = true;
                $(document.body).append(data);
                init_login_modal(t);
            }
        });
    }
}

var MOVIES_URL = '';
var MOVIES_SORT = '';

var selected = [];
var genres = [],
    countries = [],
    years = [],
    video = [],
    audio = [];

var filter_genres_draw = false;
var filter_countries_draw = false;
var filter_years_draw = false;
var filter_video_draw = false;
var filter_audio_draw = false;

function dropdown_filter(type, back) {
    if (back == false) {
        document.getElementById("filter_"+type).style.display = 'none';
        document.getElementById("filter_main").style.display = 'block';
    }
    else {
        document.getElementById("filter_main").style.display = 'none';
        document.getElementById("filter_"+type).style.display = 'block';
    }

    if (type == "genres" && filter_genres_draw == false) {
        filter_genres_draw = true;
        var gn = document.getElementById("genres");
        for(var i = 0; i < genres.length - 1; ++i) {
            gn.innerHTML += '<li><div class="form-check"><input class="form-check-input" type="checkbox" id="f1_'+genres[i].url+'" value="'+genres[i].url+'" '+genres[i].ch+'/><label class="form-check-label" for="f1_'+genres[i].url+'">'+genres[i].title+'</label></div></li>';
        }
    }
    if (type == "countries" && filter_countries_draw == false) {
        filter_countries_draw = true;
        var cn = document.getElementById("countries");
        for(var i = 0; i < countries.length - 1; ++i) {
            cn.innerHTML += '<li><div class="form-check"><input class="form-check-input" type="checkbox" id="f2_'+countries[i].url+'" value="'+countries[i].url+'" '+countries[i].ch+'/><label class="form-check-label" for="f2_'+countries[i].url+'">'+countries[i].title+'</label></div></li>';
        }
    }
    if (type == "years" && filter_years_draw == false) {
        filter_years_draw = true;
        var yr = document.getElementById("years");
        for(var i = 0; i < years.length - 1; ++i) {
            yr.innerHTML += '<li><div class="form-check"><input class="form-check-input" type="checkbox" id="f3_'+years[i].url+'" value="'+years[i].url+'" '+years[i].ch+'/><label class="form-check-label" for="f3_'+years[i].url+'">'+years[i].title+'</label></div></li>';
        }
    }
    if (type == "video" && filter_video_draw == false) {
        filter_video_draw = true;
        var vi = document.getElementById("video");
        for(var i = 0; i < video.length - 1; ++i) {
            vi.innerHTML += '<li><div class="form-check"><input class="form-check-input" type="checkbox" id="f4_'+video[i].url+'" value="'+video[i].url+'" '+video[i].ch+'/><label class="form-check-label" for="f4_'+video[i].url+'">'+video[i].title+'</label></div></li>';
        }
    }
    if (type == "audio" && filter_audio_draw == false) {
        filter_audio_draw = true;
        var au = document.getElementById("audio");
        for(var i = 0; i < audio.length - 1; ++i) {
            au.innerHTML += '<li><div class="form-check"><input class="form-check-input" type="checkbox" id="f5_'+audio[i].url+'" value="'+audio[i].url+'" '+audio[i].ch+'/><label class="form-check-label" for="f5_'+audio[i].url+'">'+audio[i].title+'</label></div></li>';
        }
    }
}

function switch_theme(theme) {
    $("body, #root").removeClass("light dark").addClass(theme);
    $('meta[name=color-scheme]').attr('content', theme);
    setCookie("theme", theme, 365);
}

function init_player_settings() {
    $("#modal_player_form input[name='player_type'][value='"+PLAYER_TYPE+"']").attr('checked', 'checked');
    $("#modal_player_form input[name='file_type'][value='"+FILE_TYPE+"']").attr('checked', 'checked');
    $('#modal_player').modal('show');
}

function MseIsSupported() {
    var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    var mediaSource = window.MediaSource = window.MediaSource || window.WebKitMediaSource;
    var sourceBuffer = window.SourceBuffer = window.SourceBuffer || window.WebKitSourceBuffer;
    var isTypeSupported = mediaSource && typeof mediaSource.isTypeSupported === 'function' && mediaSource.isTypeSupported(mimeCodec);
    var sourceBufferValidAPI = !sourceBuffer || sourceBuffer.prototype && typeof sourceBuffer.prototype.appendBuffer === 'function' && typeof sourceBuffer.prototype.remove === 'function';
    return isTypeSupported && sourceBufferValidAPI;
}

$(document).ready(function() {
    $.ajaxSetup({
        cache: false
    });

    if (getCookie("player_type")) {
        PLAYER_TYPE = getCookie("player_type");
    }
    else {
        setCookie("player_type", PLAYER_TYPE, 365);
    }

    if (getCookie("file_type")) {
        FILE_TYPE = getCookie("file_type");
    }
    else {
        if(!MseIsSupported()) {
            FILE_TYPE = "mp4";
        }
        setCookie("file_type", FILE_TYPE, 365);
    }

    if(!getCookie("player_type") || !getCookie("file_type")) {
        var ua = navigator.userAgent;
        var temp;
        var match = ua.match(/(opera|chrome|chromium|firefox|msie|trident|edg|yabrowser|vivaldi)\/?\s*(\.?\d+(\.\d+)*)/i);
        if (match && (temp = ua.match(/version\/([\.\d]+)/i)) != null) {
            match[2] = temp[1];
        }
        var browser = match ? match[1] : "";
        var version = match ? match[2] : 0;
        version = parseInt(version) || 0;

        var major_browsers = {
            "Chrome": 10,
            "Chromium": 10,
            "Firefox": 55,
            "Opera": 45,
            "Vivaldi": 2,
            "YaBrowser": 15,
            "Trident": 7
        };

        var is_major = false;
        if (major_browsers[browser] !== undefined) {
            if (version >= major_browsers[browser]) {
                is_major = true;
            }
        }

        if (is_major) {
            PLAYER_TYPE = "new";
            FILE_TYPE = MseIsSupported() ? "hls" : "mp4";
        }
        else {
            PLAYER_TYPE = "old";
            FILE_TYPE = "mp4";
        }
    }


    $('#player_help').text(((PLAYER_TYPE == "new") ? "Новый" : "Старый") + ((FILE_TYPE == "hls") ? ", HLS" : ", MP4"));

    $("#swdark").click(function() {
        if(!$("body").hasClass("dark")) {
            $("#theme_switch").prop("checked", false);
            $("#theme_switch").focus();
            switch_theme("dark");
        }
        else {
            $("#theme_switch").prop("checked", true);
            switch_theme("light");
        }
        return false;
    });
    $("#swlight").click(function() {
        if(!$("body").hasClass("light")) {
            $("#theme_switch").prop("checked", true);
            switch_theme("light");
        }
        else {
            $("#theme_switch").prop("checked", false);
            $("#theme_switch").focus();
            switch_theme("dark");
        }
        return false;
    });
    $("#theme_switch").change(function() {
        var theme = $('meta[name=color-scheme]').attr('content');
        switch_theme((theme == "light") ? "dark" : "light");
        return false;
    });

    if (window.matchMedia && getCookie("theme") == undefined) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            switch_theme('dark');
        } else {
            switch_theme('light');
        }
        //window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', function(e) {});
    }

    var items = $('#main .items');
    var items_count = items.length;
    
    var spacer = function() {
        $('#main .items li.spacer').remove();
        for(var i=0; i<items_count; i++) {
            if(!items.eq(i).hasClass("with_spacer")) {
                continue;
            }
            var num = 0;
            var w = window.screen.width;
            if (w >= 540 && w <= 899) {
                num = 3;
            }
            else if (w >= 900) {
                num = 5;
            }
            for(var r=0; r<num; r++) {
                var li = document.createElement('li'),
                    txt = document.createTextNode(" ");
                li.setAttribute("class", "spacer"), items.eq(i).append(li), items.eq(i).append(txt);
            }
        }
    };

    window.addEventListener("resize", function() {
        setTimeout(function(){
            if (items_count > 0) {
                spacer();
            }
        }, 100);
    }, true);

    if (items_count > 0) {
        spacer();
    }

    document.body.addEventListener("click", function(e) {
        if (document.getElementById("open_search").style.display == "none" && e.target.id != "search_input") {
            document.getElementById("header_search").style = "none";
            document.getElementById("open_search").style = "";
        }
    });

    $(document).on("click", "#filter", function(e) {
        e.stopPropagation();

        for(var i=0;i<e.target.childNodes.length;i++) {
            var child = e.target.childNodes[i];
            if (child.className == "form-check-input") {
                if (child.checked == false) {
                    child.checked = true;
                    selected.push(child.defaultValue);
                }
                else {
                    child.checked = false;
                    var idx = selected.indexOf(child.defaultValue);
                    selected.splice(idx, 1);
                }
            }
        }
 
        if (e.target.checked !== undefined) {
            if (e.target.checked == false) {
                var idx = selected.indexOf(e.target.defaultValue);
                selected.splice(idx, 1);
            }
            else {
                selected.push(e.target.defaultValue);
            }
        }

    });

    $("#submit_filters").click(function() {
        var url = MOVIES_URL;
        if (selected.length > 0) {
            url += "/"+selected.join("_");
        }
        if (MOVIES_SORT) {
            url += "?sort=" + MOVIES_SORT;
        }
        window.location.href = url;
    });

    $("#clear_filters").click(function() {
        var url = MOVIES_URL;
        if (MOVIES_SORT) {
            url += "?sort=" + MOVIES_SORT;
        }
        window.location.href = url;
    });


    $("#pg_small select").change(function() {
        window.location.href = $(this).attr("action")+"page="+$(this).val();
    });

    $("#slide").click(function() {
        $("#slide_menu").css({"height": window.screen.height}).show();
        $(this).hide();
        $("#slide_close").show();
        return false;
    });

    $("#slide_close").click(function() {
        $("#slide_menu").hide();
        $(this).hide();
        $("#slide").show();
        return false;
    });

    $('#tab-options a:first').tab('show');
    $('#tab-options a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $("#search_input").autocomplete({
        noCache: true,
        type: 'POST',
        paramName: 'query',
        serviceUrl: '/search',
        minChars: 2,
        deferRequestBy: 200,
        maxHeight: 900,
        preventBadQueries: false,
        triggerSelectOnValidInput: false,
        appendTo: "#search_form",
        onSelect: function(suggestion) {
            window.location.href = suggestion.url;
        },
        formatResult: function (suggestion, currentValue) {
            if (suggestion.type == "movie") {
                var r = '<img src="'+suggestion.image+'">';
                r += '<div class="info">';
                r += '<div class="title"><span>'+suggestion.value+'</span></div>';
                r += '<span class="rating">' + suggestion.rating + '</span>';
                r += '<span class="year">'+suggestion.year;
                if (suggestion.video) {
                    r += ', '+suggestion.video;
                }
                r += '</span></div>';
                return r;
            }
            return suggestion.value;
        }
    });

    $("#search_form").submit(function(event) {
        if(!$("#search_input").val()) {
            $("#search_input").focus();
            return false;
        }
    });

    $("#open_search").click(function() {
        $(this).hide();
        $("#header_search").show();
        $("#search_input").focus();

        $("#slide_menu").hide();
        $("#slide_close").hide();
        $("#slide").show();
        return false;
    });

    $("#settings").click(function() {
        $("#slide_menu").hide();
        $("#slide_close").hide();
        $("#slide").show();
    });

    $("#search_back").click(function() {
        $("#search_input").val("");
        $("#header_search").hide();
        $("#open_search").show();
        return false;
    });

    var ajax_ps = false;
    $(".player_settings").click(function() {
        if (ajax_ps) {
            init_player_settings();
        }
        else {
            $.ajax({
                url: "/modal",
                data: { type: "player" },
                success: function(data) {
                    ajax_ps = true;
                    $(document.body).append(data);
                    init_player_settings();
                }
            });
        }
        return false;
    });

    $(document).on("submit", "#modal_player_form", function() {
        var pt = "new";
        if ($('#modal_player_form #player_type_old').is(':checked')) {
            pt = "old";
        }

        var ft = "hls";
        if ($('#modal_player_form #file_type_mp4').is(':checked')) {
            ft = "mp4";
        }

        setCookie("player_type", pt, 365);
        setCookie("file_type", ft, 365);

        window.location.reload();
        return false;
    });


    $(document).on("click", ".login", function() {
        login_modal("login");
        return false;
    });
    $(document).on("click", ".recover", function() {
        login_modal("recover");
        return false;
    });
    $(document).on("click", ".register", function() {
        login_modal("register");
        reCaptcha();
        return false;
    });
    $(document).on("submit", "#modal_login_form", function() {
        var btn = $(this).find('button');
        btn.attr("disabled","disabled");

        $.post("/login", $(this).serialize(), function(data) {
            btn.removeAttr("disabled");
            
            if(!data) return;
            var j = jQuery.parseJSON(data);
            if (j.type == "success") {
                CURRENT_USER_ID = j.user_id;
                if (login_favorite_id > 0 && login_invoked_type == "favorite") {
                    $(".favorite[data-movie-id='"+login_favorite_id+"']").trigger("click");
                }
                else if (login_invoked_type == "comment") {
                    $("#comment_form").submit();
                }

                if (pathname.indexOf("/login") > -1 
                    || pathname.indexOf("/registration") > -1 
                    || pathname.indexOf("/reset_password") > -1) {
                    current_page = siteHost();
                }
                if (login_invoked_type) {
                    setTimeout(function() { window.location = current_page; }, 500);
                }
                else {
                    window.location = current_page;
                }
            }
            else if (j.type == "error") {
                var alert = $('#modal_login .modal_error');
                alert.html('<p>'+j.msg+'</p>');
                alert.show();
            }
        });

        return false;
    });
    $(document).on("submit", "#modal_register_form", function() {
        var btn = $(this).find('button');
        btn.attr("disabled","disabled");

        $.post("/registration", $(this).serialize(), function(data) {
            btn.removeAttr("disabled");

            if(!data) return;
            var j = jQuery.parseJSON(data);
            if (j.type == "success") {
                CURRENT_USER_ID = j.user_id;
                if (login_favorite_id > 0 && login_invoked_type == "favorite") {
                    $(".favorite[data-movie-id='"+login_favorite_id+"']").trigger("click");
                }
                else if (login_invoked_type == "comment") {
                    $("#comment_form").submit();
                }
     
                if (pathname.indexOf("/login") > -1 
                    || pathname.indexOf("/registration") > -1 
                    || pathname.indexOf("/reset_password") > -1) {
                    current_page = siteHost();
                }
                if (login_invoked_type) {
                    setTimeout(function() { window.location = current_page; }, 500);
                }
                else {
                    window.location = current_page;
                }
            }
            else if (j.type == "error") {
                grecaptcha.reset();
                var alert = $('#modal_login .modal_error');
                alert.html('<p>'+j.msg+'</p>');
                alert.show();
            }
        });

        return false;
    });
    $(document).on("submit", "#modal_recover_form", function() {
        var btn = $(this).find('button');
        btn.attr("disabled","disabled");

        $.post("/recover", $(this).serialize(), function(data) {
            btn.removeAttr("disabled");
            if(!data) return;
            var j = jQuery.parseJSON(data);
            if (j.type == "success") {
                $('#modal_login .modal_error').empty();
                var alert = $('#modal_login .modal_success');
                alert.html('<p>'+j.msg+'</p>');
                alert.show();
            }
            else if (j.type == "error") {
                var alert = $('#modal_login .modal_error');
                alert.html('<p>'+j.msg+'</p>');
                alert.show();
            }
        });

        return false;
    });

    $(".favorite").click(function() {
        var btn_fav = $('#btn_fav');

        var t = $(this);
        var movie_id = t.attr("data-movie-id");
        if (CURRENT_USER_ID <= 0) {
            login_favorite_id = movie_id;
            login_invoked_type = "favorite";
            login_modal("login");
            return;
        }

        if (t.hasClass("is_favorited")) {
            var posting = $.post("/delete_favorite", {movie_id:movie_id});
            posting.done(function() {
                notify("Удален из избранного");

                t.removeClass("is_favorited");
                t.css({"display":""});
                t.attr("title","Добавить в избранное");

                btn_fav.attr("title","Добавить в избранное");
                btn_fav.text("В избранное");
                btn_fav.removeClass("is_favorited");
            });
        }
        else {
            var posting = $.post("/add_favorite", {movie_id:movie_id});
            posting.done(function() {
                notify("Добавлен в избранное");

                t.addClass("is_favorited");
                t.css({"display":"block"});
                t.attr("title","Удалить из избранного");

                btn_fav.attr("title","Удалить из избранного");
                btn_fav.text("В избранном");
                btn_fav.addClass("is_favorited");
            });
        }
        return false;
    });

    $('#footer_mail').attr("href", "mailto:"+SITE_MAIL).text(SITE_MAIL);
});
