// bootstrap-rating - v1.5.0 - (c) 2018 dreyescat 
// https://github.com/dreyescat/bootstrap-rating MIT
!function(a,b){"use strict";function c(c,e){this.$input=a(c),this.$rating=a("<span></span>").css({cursor:"default"}).insertBefore(this.$input),this.options=function(c){return c.start=parseInt(c.start,10),c.start=isNaN(c.start)?b:c.start,c.stop=parseInt(c.stop,10),c.stop=isNaN(c.stop)?c.start+d||b:c.stop,c.step=parseInt(c.step,10)||b,c.fractions=Math.abs(parseInt(c.fractions,10))||b,c.scale=Math.abs(parseInt(c.scale,10))||b,c=a.extend({},a.fn.rating.defaults,c),c.filledSelected=c.filledSelected||c.filled,c}(a.extend({},this.$input.data(),e)),this._init()}var d=5;c.prototype={_init:function(){for(var c=this,d=this.$input,e=this.$rating,f=function(a){return function(c){d.prop("disabled")||d.prop("readonly")||d.data("readonly")!==b||a.call(this,c)}},g=1;g<=this._rateToIndex(this.options.stop);g++){var h=a('<div class="rating-symbol"></div>').css({display:"inline-block",position:"relative"});a('<div class="rating-symbol-background '+this.options.empty+'"></div>').appendTo(h),a('<div class="rating-symbol-foreground"></div>').append('<span class="'+this.options.filled+'"></span>').css({display:"inline-block",position:"absolute",overflow:"hidden",left:0,right:0,width:0}).appendTo(h),e.append(h),this.options.extendSymbol.call(h,this._indexToRate(g))}this._updateRate(d.val()),d.on("change",function(){c._updateRate(a(this).val())});var i,j=function(b){var d=a(b.currentTarget),e=Math.abs((b.pageX||b.originalEvent.touches[0].pageX)-(("rtl"===d.css("direction")&&d.width())+d.offset().left));return e=e>0?e:.1*c.options.scale,d.index()+e/d.width()};e.on("mousedown touchstart",".rating-symbol",f(function(a){d.val(c._indexToRate(j(a))).change()})).on("mousemove touchmove",".rating-symbol",f(function(d){var e=c._roundToFraction(j(d));e!==i&&(i!==b&&a(this).trigger("rating.rateleave"),i=e,a(this).trigger("rating.rateenter",[c._indexToRate(i)])),c._fillUntil(e)})).on("mouseleave touchend",".rating-symbol",f(function(){i=b,a(this).trigger("rating.rateleave"),c._fillUntil(c._rateToIndex(parseFloat(d.val())))}))},_fillUntil:function(a){var b=this.$rating,c=Math.floor(a);b.find(".rating-symbol-background").css("visibility","visible").slice(0,c).css("visibility","hidden");var d=b.find(".rating-symbol-foreground");d.width(0),d.slice(0,c).width("auto").find("span").attr("class",this.options.filled),d.eq(a%1?c:c-1).find("span").attr("class",this.options.filledSelected),d.eq(c).width(a%1*100+"%")},_indexToRate:function(a){return this.options.start+Math.floor(a)*this.options.step+this.options.step*this._roundToFraction(a%1)},_rateToIndex:function(a){return(a-this.options.start)/this.options.step},_roundToFraction:function(a){var b=Math.ceil(a%1*this.options.fractions)/this.options.fractions,c=Math.pow(10,this.options.scale);return Math.floor(a)+Math.floor(b*c)/c},_contains:function(a){var b=this.options.step>0?this.options.start:this.options.stop,c=this.options.step>0?this.options.stop:this.options.start;return b<=a&&a<=c},_updateRate:function(a){var b=parseFloat(a);this._contains(b)?(this._fillUntil(this._rateToIndex(b)),this.$input.val(b)):""===a&&(this._fillUntil(0),this.$input.val(""))},rate:function(a){return a===b?this.$input.val():void this._updateRate(a)}},a.fn.rating=function(d){var e,f=Array.prototype.slice.call(arguments,1);return this.each(function(){var b=a(this),g=b.data("rating");g||b.data("rating",g=new c(this,d)),"string"==typeof d&&"_"!==d[0]&&(e=g[d].apply(g,f))}),e!==b?e:this},a.fn.rating.defaults={filled:"glyphicon glyphicon-star",filledSelected:b,empty:"glyphicon glyphicon-star-empty",start:0,stop:d,step:1,fractions:1,scale:3,extendSymbol:function(a){}},a(function(){a("input.rating").rating()})}(jQuery);


var adv_preroll = "";
var adv_postroll = "";
var user_playfrom = "";
var user_played = "";

var vod_hash = "";
var vod_time = 0;

var player_init = false;
var player_paused = true;
var check_timeout = 5000;

var log_timeout = 30000;
var log_write = false;
var log_update_time = 0;
var init_time = pause_time = Math.floor(Date.now() / 1000);
var storage_support = StorageSupport();

function StorageSupport() {
    try {
        var storage = window['localStorage'],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true
    } catch (e) {
        return false
    }
}

function PlayerjsEvents(event, id, info) {
    if (event == "init") {
        player_init = true;
    }
    if (event == "start") {
        log_write = true;
    }
    if (event == "pause") {
        player_paused = true;
        pause_time = Math.floor(Date.now() / 1000);
    }
    if (event == "play") {
        player_paused = false;
        pause_time = 0;
    }
}

function uppodEvent(e) {
    var event = e.type;

    if (event == "init") {
        player_init = true;
    }
    if (event == "pause") {
        player_paused = true;
        pause_time = Math.floor(Date.now() / 1000);
    }
    if (event == "play") {
        player_paused = false;
        pause_time = 0;
    }
}

function userlog() {
    if (log_write == false) {
        return setTimeout(function() {userlog();}, log_timeout);
    }
  
    var h = location.hostname;
    var x = '';
    var p = '';
    var n = 0;
    if (localStorage.getItem("pljsplayfrom_" + h + PLAYER_CUID) != null) {
        x = localStorage.getItem("pljsplayfrom_" + h + PLAYER_CUID);
        n = parseInt(x.split("--")[2]) || 0;
    }
    if (localStorage.getItem("pljsplayed_" + h + PLAYER_CUID) != null) {
        p = localStorage.getItem("pljsplayed_" + h + PLAYER_CUID);
    }
    if (log_update_time == n) {
        return setTimeout(function() {userlog();}, log_timeout);
    }
    var post = $.post("/log", {playfrom: x, played: p, cuid: PLAYER_CUID});
    post.always(function() {
        log_update_time = n;
        setTimeout(function() {userlog();}, log_timeout);
    });
}

function hop() {
    var now = Math.floor(Date.now() / 1000);
    var bool = false;
    $.ajax({
        url: '/hop',
        type: 'GET',
        async: false,
        data: {h: now},
        success: function(data) {
            if (now == data) {
                bool = true;
            }
        }
    });
    return bool;
}

function check_reload() {
    var now = Math.floor(Date.now() / 1000);
    if (player_paused == true && pause_time > 0) {
        if (now - pause_time >= 14400) {
            if (hop()) {
                window.location.reload();
            }
        }
    }

    setTimeout(function() {check_reload();}, check_timeout);
}

function user_data() {
    $.ajax({
        dataType: "json",
        url: "/user_data",
        data: { page: "movie", movie_id: MOVIE_ID, cuid: PLAYER_CUID },
        success: function(data) {
            if (storage_support && CURRENT_USER_ID > 0) {
                var h = location.hostname;
                var x = 0;
                var y = 0;
                if (localStorage.getItem("pljsplayfrom_" + h + PLAYER_CUID) != null) {
                    x = parseInt(localStorage.getItem("pljsplayfrom_" + h + PLAYER_CUID).split("--")[2]) || 0;
                }
                if (data.playfrom) {
                    y = parseInt(data.playfrom.split("--")[2]) || 0;
                }
                if (y > x) {
                    if (data.playfrom) {
                        user_playfrom = data.playfrom;
                    }
                    if (data.played) {
                        user_played = data.played;
                    }
                }
            }

            adv_preroll = data.preroll;
            adv_postroll = data.postroll;

            vod_hash = data.vod_hash;
            vod_time = data.vod_time;

            if (data.allow_watch == 0) {
                $('#watch').html('<div class="alert">'+
                    '<h3>Видео недоступно для просмотра в вашей стране</h3>'+
                    '<p>Вы можете использовать <a href="https://ru.wikipedia.org/wiki/VPN" target="_blank">VPN</a> для смены вашей геолокации.</p>'+
                    '<p>1. Перейдите на сайт <a href="http://sravni-vpn.org" target="_blank" class="error">sravni-vpn.org</a> и выберите один из VPN сервисов, или установите бесплатное <a href="https://chrome.google.com/webstore/search/VPN?hl=ru&_category=extensions" target="_blank">расширение</a> для браузера (но у бесплатных расширений могут отсутствовать сервера расположенные в тех странах, с которых разрешен просмотр).</p>'+
                    '<p>2. Скачайте приложение и в настройках VPN укажите одну из следующих стран: Украина, Россия, Белоруссия, Казахстан, Армения, Азербайджан, Грузия, Узбекистан, Киргизия, Туркмения, Молдова, Турция.</p>'+
                    '<p>3. Включите VPN, зайдите на сайт и наслаждайтесь просмотром.</p>'+
                '</div>');
            }
            else if(!MOVIE_IS_COMING) {
                resize_player();
                load_vod();
            }

            if (data.client_country == "RU") {
                $("#movie").css({'padding-right': '20px'});
                $("#sidebar .info").show();
            }

            if(!player_init) {
                $("body").prepend(data.branding);
                $("#footer").append(data.sticker);

                if (data.banner_side != "" && window.screen.width > 1280) {
                    $("#movie").css({'padding-right': '20px'});
                    $("#sidebar").append(data.banner_side);
                }
            }
        }
    });
}

function init_player(data) {    
    if (PLAYER_TYPE == "old") {
        var vod = data.split("|");
        var opt = {
            m: "video",
            uid: "videoplayer",
            st: "uppodvideo",
            preroll: adv_preroll,
            postroll: adv_postroll
        };
        if (vod[0] == "file") {
            opt.file = vod[1];
        } else {
            opt.pl = vod[1];
        }

        new Uppod(opt);

        document.getElementById('videoplayer').addEventListener('init',uppodEvent,false);
        document.getElementById('videoplayer').addEventListener('start',uppodEvent,false);
        document.getElementById('videoplayer').addEventListener('play',uppodEvent,false);
        document.getElementById('videoplayer').addEventListener('pause',uppodEvent,false);
    }
    else {
        var vod = data.split("|");
        var opt = {
            id: "videoplayer", 
            file: vod[1],
            cuid: PLAYER_CUID,
            preroll: adv_preroll,
            postroll: adv_postroll,
            playfrom: user_playfrom,
            played: user_played,
            globalfont: 1,
            globalfontname: 'system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif'
        };
        if (vod[0] == "file") {
            opt.subtitle = vod[2];
            opt.default_subtitle = vod[3];
        } else {
            opt.default_subtitle = vod[2];
        }
        new Playerjs(opt);
    }
}

function resize_player() {
    var width = $("#watch").width();
    var height = width*9/16;
    if (window.screen.width < 600) {
        height += 100;
    }
    if (PLAYER_TYPE == "old" && MOVIE_TYPE != "films") {
        height += 60;
    }
    $("#videoplayer").css({"height":height});
}

function load_vod() {
    var url = "/vod/"+MOVIE_ID;
    var params = {
        'identifier': IDENTIFIER,
        'player_type': PLAYER_TYPE,
        'file_type': FILE_TYPE,
        'st': vod_hash,
        'e': vod_time
    };
    $.ajax({
        type: "HEAD",
        async: true,
        url: url,
        success: function(message, status, response) {
            $.ajax({
                type: "GET",
                async: true,
                url: url,
                data: params,
                success: function(message, status, response) {
                    init_player(message, PLAYER_TYPE);
                }
            });
        }
    });
}


$(document).ready(function() {
    if (storage_support && CURRENT_USER_ID > 0 && PLAYER_TYPE == "new") {
        setTimeout(function() {userlog();}, log_timeout);
    }

    user_data();
    check_reload();

    if(!MOVIE_IS_COMING) {
        $("#tab-options a:first").tab("show");
        $("#tab-options a").click(function() {
            $(this).tab("show");
            return false;
        });
    }


    var movie_info_toggle = true;
    $("#show_movie_info").click(function() {
        if (movie_info_toggle) {
            $(this).text("Меньше информации");
            movie_info_toggle = false;
        }
        else {
            $(this).text("Больше информации");
            movie_info_toggle = true;
        }
        $('#info > .info_items .hide').toggle();
        return false;
    });

    var trailer_init = false;
    $('#tab-options a[href="#trailer"]').click(function(e) {
        if (trailer_init) return;
        e.preventDefault();
        $('#trailer').html('<div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="'+MOVIE_TRAILER+'" allowfullscreen></iframe></div>');
        trailer_init = true;
    });

    $("#comment").focus(function() {
        $(this).height(100);
    });

    var new_comment = $("#comments_entries .new_comment");
    $("#comment_form").submit(function() {
        var btn = $(this);
        btn.attr("disabled","disabled");

        var c = $("#comment").val();
        c = c.trim().replace(/<\/?[^>]+>/gi, '');

        if(!c) {
            alert("Укажите ваш комментарий");
            $("#comment").focus()
        } 
        else {            
            $.post("/add_comment", {movie_id: MOVIE_ID, comment: c}, function(data) {
                $("#comment").val("");
                if(!data) return;
                var j = jQuery.parseJSON(data);
                if (j.error !== undefined) {
                    alert(j.error);
                    return;
                }
                if(j.avatar) {
                    avatar_uri = IMAGES_URL + "/storage/40x40/avatars/"+j.avatar;
                } else {
                    avatar_uri = IMAGES_URL + "/static/images/avatar.svg";
                }
                var comment = new_comment.clone(true).removeClass("new_comment");
                comment.attr("data-comment-id", j.id);
                comment.find(".comment_avatar img").attr("src", avatar_uri);
                comment.find(".comment_body p").html(j.comment);
                comment.find(".comment_head span.username").text(j.username);
                comment.find(".comment_head span.comment_date").text(j.added);
                comment.show();

                $("#comments_entries").prepend(comment);
            });
        }

        btn.removeAttr("disabled");

        return false;
    });

    $(document).on("click", "#comments_entries .showfull a", function() {
        $(this).closest("li").hide();
        $(this).closest(".comment_body").find("p").removeClass("short");
        return false;
    });

    $(document).on("click", "#comments_entries .remove a", function() {
        var comment_id = $(this).closest(".comment").attr("data-comment-id");
        var posting = $.post("/delete_comment", {comment_id: comment_id});
        posting.done(function() {
            $('#comments_entries .comment[data-comment-id="'+comment_id+'"]').remove();
        });
        return false;
    });

    $("#comment_form > #comment").click(function() {
        $(this).attr("rows", 5);
    });


    var comments_page = 1;

    setTimeout(function() { 
        var get = $.get("/comments", {movie_id: MOVIE_ID, page: comments_page});
        get.done(function(data) {
            comments_page++;

            $("#comments_entries").html(data); 
            $("#comments_entries p").each(function() { 
                if ($(this).height() > 175) {
                    $(this).addClass("short");
                    $(this).closest(".comment_body").find(".showfull").css("display", "inline-block");
                }
            });
        });
    }, 200);


    $("#load_more_comments").click(function(event) {
        var btn = $(this);
        btn.text("Загружаются...");

        setTimeout(function() { 
            var get = $.get("/comments", {movie_id: MOVIE_ID, page: comments_page});
            get.done(function(data) {
                if (COMMENTS_PAGES == comments_page) {
                    btn.hide();
                    
                    $("#load_all_comments").hide();
                }
                else {
                    btn.text("Показать еще комментарии");
                }
                comments_page++;

                $("#comments_entries").append(data); 
                $("#comments_entries p").each(function() { 
                    if ($(this).height() > 175) {
                        $(this).addClass("short");
                        $(this).closest(".comment_body").find(".showfull").css("display", "inline-block");
                    }
                });
            });
        }, 200);

        return false;
    });


    $("#btn_fav").click(function(event) {
        if (CURRENT_USER_ID <= 0) {
            login_favorite_id = MOVIE_ID;
            login_invoked_type = "favorite";
            login_modal("login");
            return;
        }

        var favorite_btn = $(".favorite");

        var t = $(this);
        var state = t.hasClass("is_favorited")?1:0;
        if(!state) {
            var posting = $.post("/add_favorite", {movie_id:MOVIE_ID});
            posting.done(function() {
                notify("Добавлен в избранное");

                t.attr("title","Удалить из избранного");
                t.text("В избранном");
                t.addClass("is_favorited");

                favorite_btn.addClass("is_favorited");
                favorite_btn.css({"display":"block"});
                favorite_btn.attr("title","Удалить из избранного");
            });
        }
        else {
            var posting = $.post("/delete_favorite", {movie_id:MOVIE_ID});
            posting.done(function() {
                notify("Удален из избранного");

                t.attr("title","Добавить в избранное");
                t.text("В избранное");
                t.removeClass("is_favorited");

                favorite_btn.removeClass("is_favorited");
                favorite_btn.css({"display":""});
                favorite_btn.attr("title","Добавить в избранное");
            });
        }
        return false;
    });

    $("#rating").rating({
        start: 0,
        stop: 10,
        step: 1,
        filled: "star_filled",
        empty: "star",
        extendSymbol: function (rate) {
            $(this).attr('tooltip', rate);
        }
    });

    var old_rating;
    $("#rating").on("change", function() {
        var rating = $(this).val();
        if (rating < 1) {
            rating = 1;
        }
        if (rating > 10) {
            rating = 10;
        }
        if (old_rating == rating) {
            return;
        }
        var posting = $.post("/vote", {movie_id:MOVIE_ID, rating:rating});
        posting.done(function(data) {
            old_rating = rating;
            $("#rating_text").text("Ваша оценка: "+rating);
            $("#rating_success").show();
        });
        posting.fail(function(data) {
            alert("Произошла ошибка, пожалуйста попробуйте чуть позже");
        });
    });

    $("#remove_rating").on("click", function() {
        var posting = $.post("/delete_vote", {movie_id:MOVIE_ID});
        posting.done(function(data) {
            $("#rating_success").hide();
        });
        posting.fail(function(data) {
            alert("Произошла ошибка, пожалуйста попробуйте чуть позже");
        });
    });
});
