/**
 * Copyright (c) 2007 Ariel Flesler - aflesler ○ gmail • com | https://github.com/flesler
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 2.1.2
 */
;(function(f){"use strict";"function"===typeof define&&define.amd?define(["jquery"],f):"undefined"!==typeof module&&module.exports?module.exports=f(require("jquery")):f(jQuery)})(function($){"use strict";function n(a){return!a.nodeName||-1!==$.inArray(a.nodeName.toLowerCase(),["iframe","#document","html","body"])}function h(a){return $.isFunction(a)||$.isPlainObject(a)?a:{top:a,left:a}}var p=$.scrollTo=function(a,d,b){return $(window).scrollTo(a,d,b)};p.defaults={axis:"xy",duration:0,limit:!0};$.fn.scrollTo=function(a,d,b){"object"=== typeof d&&(b=d,d=0);"function"===typeof b&&(b={onAfter:b});"max"===a&&(a=9E9);b=$.extend({},p.defaults,b);d=d||b.duration;var u=b.queue&&1<b.axis.length;u&&(d/=2);b.offset=h(b.offset);b.over=h(b.over);return this.each(function(){function k(a){var k=$.extend({},b,{queue:!0,duration:d,complete:a&&function(){a.call(q,e,b)}});r.animate(f,k)}if(null!==a){var l=n(this),q=l?this.contentWindow||window:this,r=$(q),e=a,f={},t;switch(typeof e){case "number":case "string":if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(e)){e= h(e);break}e=l?$(e):$(e,q);case "object":if(e.length===0)return;if(e.is||e.style)t=(e=$(e)).offset()}var v=$.isFunction(b.offset)&&b.offset(q,e)||b.offset;$.each(b.axis.split(""),function(a,c){var d="x"===c?"Left":"Top",m=d.toLowerCase(),g="scroll"+d,h=r[g](),n=p.max(q,c);t?(f[g]=t[m]+(l?0:h-r.offset()[m]),b.margin&&(f[g]-=parseInt(e.css("margin"+d),10)||0,f[g]-=parseInt(e.css("border"+d+"Width"),10)||0),f[g]+=v[m]||0,b.over[m]&&(f[g]+=e["x"===c?"width":"height"]()*b.over[m])):(d=e[m],f[g]=d.slice&& "%"===d.slice(-1)?parseFloat(d)/100*n:d);b.limit&&/^\d+$/.test(f[g])&&(f[g]=0>=f[g]?0:Math.min(f[g],n));!a&&1<b.axis.length&&(h===f[g]?f={}:u&&(k(b.onAfterFirst),f={}))});k(b.onAfter)}})};p.max=function(a,d){var b="x"===d?"Width":"Height",h="scroll"+b;if(!n(a))return a[h]-$(a)[b.toLowerCase()]();var b="client"+b,k=a.ownerDocument||a.document,l=k.documentElement,k=k.body;return Math.max(l[h],k[h])-Math.min(l[b],k[b])};$.Tween.propHooks.scrollLeft=$.Tween.propHooks.scrollTop={get:function(a){return $(a.elem)[a.prop]()}, set:function(a){var d=this.get(a);if(a.options.interrupt&&a._last&&a._last!==d)return $(a.elem).stop();var b=Math.round(a.now);d!==b&&($(a.elem)[a.prop](b),a._last=this.get(a))}};return p});

const controlsAlt = [
    'play', // Play/pause playback
    'progress', // The progress bar and scrubber for playback and buffering
    'current-time', // The current time of playback
    'duration', // The full duration of the media
    'volume', // Volume control
]

const controls = `
<div class="plyr__controls">
    <button type="button" class="plyr__control" aria-label="Play, {title}" data-plyr="play">
        <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
        <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg>
    </button>
    <div class="plyr__progress">
        <input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek">
        <progress class="plyr__progress__buffer" min="0" max="100" value="0">% buffered</progress>
        <span role="tooltip" class="plyr__tooltip">00:00</span>
    </div>
    <div class="plyr__time plyr__time--current" aria-label="Current time">00:00</div>
    <div class="plyr__time plyr__time--duration" aria-label="Duration">00:00</div>
</div>
`;

const player = new Plyr('.player', { controls, "debug":true, "provider":"youtube", "autoplay":true, "hideControls":false, "tooltips":{ controls: false, seek:false} });

(function($) {
    $.fn.clickToggle = function(func1, func2) {
        var funcs = [func1, func2];
        this.data('toggleclicked', 0);
        this.click(function() {
            var data = $(this).data();
            var tc = data.toggleclicked;
            $.proxy(funcs[tc], this)();
            data.toggleclicked = (tc + 1) % 2;
        });
        return this;
    };
}(jQuery));

$(document).ready(function(){

    var lazyLoadInstance = new LazyLoad({
      elements_selector: ".lazy"
    });

    $('.clip').each(function(){
      $(this).click(function(e){
        e.preventDefault();

        $('.player-container').removeClass('collapsed');
        $('.player-container').addClass('open');

        let clipURL = $(this).attr('data-clip');
        let format = $(this).attr('data-format');
        let title = $(this).attr('data-title');
        let type;
        let provider;
        let video_id;
        let iframeContents;

        if (format == 'youtube'){
          $('.player-container .player-and-title-wrapper').show();
          $('.player-container .embed-iframe-wrapper').hide();
          $('.embed-iframe-wrapper iframe').attr('src', '');
          $('.player-container').attr('data-theme', 'default');
          type = 'video';
          provider = 'youtube';
          clipURL = clipURL+'&origin=http://localhost:8888&autoplay=true';
          $('.track-title span').html(title);
          player.source = {
            type:       type,
            title:      title,
            sources: [{
              src:      clipURL,
              provider: provider,
            }]
          };
        } else if (format == 'bandcamp') {
          player.pause();
          iframeContents = `https://bandcamp.com/EmbeddedPlayer/album=${clipURL}/size=large/artwork=small/bgcol=ffffff/linkcol=F05022/transparent=true/`
          $('.player-container .player-and-title-wrapper').hide();
          $('.player-container .embed-iframe-wrapper').show();
          $('.player-container').attr('data-theme', 'bandcamp');
          $('.embed-iframe-wrapper iframe').attr('src', iframeContents).attr('data-provider', 'bandcamp');
          $('.track-title span').empty();
        } else if (format == 'soundcloud') {
          player.pause();
          iframeContents = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${clipURL}&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`
          $('.player-container .player-and-title-wrapper').hide();
          $('.player-container .embed-iframe-wrapper').show();
          $('.player-container').attr('data-theme', 'soundcloud');
          $('.embed-iframe-wrapper iframe').attr('src', iframeContents).attr('data-provider', 'soundcloud');
          $('.track-title span').empty();
        } else if (format == 'beatport') {
          player.pause();
          iframeContents = `https://embed.beatport.com/?id=${clipURL}&type=track`;
          $('.player-container .player-and-title-wrapper').hide();
          $('.player-container .embed-iframe-wrapper').show();
          $('.player-container').attr('data-theme', 'beatport');
          $('.embed-iframe-wrapper iframe').attr('src', iframeContents).attr('data-provider', 'beatport');
          $('.track-title span').empty();
        } else if (format == 'juno') {
          player.pause();
          iframeContents = `https://www.junodownload.com/player-embed/${clipURL}.m3u/?pl=false&pn=false&jd=true`;
          $('.player-container .player-and-title-wrapper').hide();
          $('.player-container .embed-iframe-wrapper').show();
          $('.player-container').attr('data-theme', 'juno');
          $('.embed-iframe-wrapper iframe').attr('src', iframeContents).attr('data-provider', 'juno');
          $('.track-title span').empty();
        } else if (format == 'mp3'){
          $('.player-container .player-and-title-wrapper').show();
          $('.player-container .embed-iframe-wrapper').hide();
          $('.player-container').attr('data-theme', 'default');
          $('.embed-iframe-wrapper iframe').attr('src', '');
          type = 'audio';
          $('.track-title span').html(title);
          player.source = {
            type:       type,
            title:      title,
            sources: [{
              src:      clipURL,
              type:  'audio/mp3',
            }]
          };
        }

        player.on('canplay', function(){
          player.play();
        });

        player.on('statechange', function(){
          console.log(event);
        });
      });
    });

});
