$(window).scroll(function(){
       if($('.navbar').offset().top > 50) {
           $('.navbar-fixed-top').addClass('colapsar-nav');
       }else{
           $('.navbar-fixed-top').removeClass('colapsar-nav');
       }
});

$(function(){
       $('.pagina-scroll a').bind('click', function(){
         var $anchor = $(this);
         $('html, body').stop().animate({
             scrollTop: $($anchor.attr('href')).offset().top
         }, 1500, 'easeInOutExpo');
         });

       });
