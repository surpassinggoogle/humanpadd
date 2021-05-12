$(document).ready(function($) {

  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    $msnry;

  mobileMenu(w);
  mobileFooterMenu(w);

  $(window).on('resize', function(event) {
    w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    mobileMenu(w);
    mobileFooterMenu(w);

    if($('.js-using-snt').length){
      if(w > 767){
        if($msnry == null){
          $msnry = $('.js-items').masonry({
            itemSelector: '.js-item'
          });
          $msnry.masonry('layout');
        }
      }else{
        if($msnry != null){
          $msnry.masonry('destroy');
          $msnry = null;
        }
      }
    }

  });

  $('.js-language-selector').on('mouseover', function (event) {
    event.preventDefault();
    $('.js-language-selector-list').removeClass('invisible opacity-0 pointer-events-none scale-95 mb-12');
    $('.js-language-selector-trigger').addClass('bg-black text-white');
  });
  $('.js-language-selector').on('mouseleave', function (event) {
    event.preventDefault();
    $('.js-language-selector-list').addClass('invisible opacity-0 pointer-events-none scale-95 mb-12');
    $('.js-language-selector-trigger').removeClass('bg-black text-white');
  });

  $('.js-using-snt').imagesLoaded( function() {
    if(w > 767){
      $msnry = $('.js-items').masonry({
        itemSelector: '.js-item'
      });
      $msnry.masonry('layout');
    }
  });

  // box-remember styling wrapper (part of the b9lab documentation update)
  $(".js-box-remember").wrap("<div class='bg-gray-100 flex my-12 shadow-lg'></div>");
  $(".js-box-remember").before("<div class='bg-primary-base py-12 flex flex-shrink-0 w-32 items-center justify-center'><img src='/img/box-remember.svg' width='64')'></div>");

  function mobileMenu(w) {
    if (w < 1199) {
      $('.js-header .js-nav, .js-header .js-btns').appendTo('.js-mobile-nav-inner');
    } else {
      $('.js-mobile-nav .js-nav, .js-mobile-nav .js-btns').insertBefore('.js-mobile-nav-trigger');
      $('.js-has-submenu').on('mouseover', function (event) {
        event.preventDefault();
        $(this).find('.js-submenu').removeClass('invisible opacity-0 pointer-events-none');
      });
      $('.js-has-submenu').on('mouseleave', function (event) {
        event.preventDefault();
        $(this).find('.js-submenu').addClass('invisible opacity-0 pointer-events-none');
      });
    }
  }2

  function mobileFooterMenu(w) {
    if (w < 768) {
      $('.js-footer .js-collapse').attr('aria-expanded', 'false').addClass('js-collapsed');
      $('.js-footer .js-collapse').addClass('hidden collapsed');
      $('.js-footer .js-collapse-trigger').addClass('collapsed');
    } else { $('.js-footer .js-collapse').attr('aria-expanded', 'true').removeClass('js-collapsed');
      $('.js-footer .js-collapse').removeClass('hidden collapsed');
    }
  }

  $('.js-mobile-nav-trigger').on('click', function(event) {
    event.preventDefault();
    $('.js-mobile-nav').removeClass('invisible opacity-0 pointer-events-none scale-95 mt-8');
    $('.js-backdrop').removeClass('invisible opacity-0 pointer-events-none');
  });

  $('.js-backdrop, .js-mobile-nav-trigger-close').on('click', function (event) {
    event.preventDefault();

    $('.js-mobile-nav').addClass('invisible opacity-0 pointer-events-none scale-95 mt-8');
    $('.js-backdrop').addClass('invisible opacity-0 pointer-events-none');
    $('.js-sidebar-inner').addClass('invisible opacity-0 pointer-events-none scale-95 mt-8');
  });

  $('.js-community-nav-trigger-close, .js-backdrop-community-nav, .js-community-nav-trigger').on('click', function (event) {
    event.preventDefault();
    $('.js-community-nav').toggleClass('invisible opacity-0 pointer-events-none scale-95 mt-8');
    $('.js-backdrop-community-nav').toggleClass('invisible opacity-0 pointer-events-none scale-95');
  });

  try {
    highlight();
  } catch (err) {
    setTimeout(function() {
      highlight();
    }, 2500);
  }

  function highlight() {
    $('.js-editor-content pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  }

  if ($('.recently-updated').length) {

    var html = '';

    if (typeof Cookies.get('recently-updated') !== 'undefined') {
      $('.recently-updated').append(Cookies.get('recently-updated'));
    } else {
      fetch('https://api.github.com/users/status-im/repos?sort=updated&per_page=3')
        .then(
          function(response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: '
              + response.status);
              return;
            }

            response.json().then(function(data) {

              data.forEach(function(element) {
                html += '<li><a href="' + element.html_url + '">' + element.full_name + '</a></li>';
              });

              Cookies.set('recently-updated', html, { expires: 1 });
              $('.recently-updated').append(html);

            });

          }
        )
        .catch(function(err) {
          console.log('Fetch Error :-S', err);
        });
    }

  }

  if ($('#advocacy-programs').length) {
    function retrieveAdvocacyPrograms() {
      $.ajax({
        type: 'get',
        url: 'https://statusphere.status.im/api/v1/boards/public/?is_featured=true&org=375',
        success: function(response) {
          $.each(response, function(index, program) {
            var description = program.description.substr(0, 200) + '...';
            $('#advocacy-programs').prepend('<div class="inner"> \
                <a href="https://statusphere.status.im/b/'+ program.uuid+'/view" class="card-inner"> \
                  '+program.title+'\
                </a> \
                <p class="details">'+description+'</p> \
              </div>');
          });
        }
      });
    }

    retrieveAdvocacyPrograms();

  }

  $('.js-sidebar').stick_in_parent({
    offset_top: 30
  });

  if ($('input[name="userSearch"]').length) {
    window.addEventListener('click', function(e) {
      if (document.getElementById('search-form').contains(e.target)) {
        $('#search-form').removeClass('inactive');
      } else {
        $('#search-form').addClass('inactive');
      }
    });
    $('input[name="userSearch"]').on('keyup', function() {
      var val = $(this).val();
      $('#search-results').empty();
      $.ajax({
        url: 'https://search.status.im/status.im/_search?size=10&_source=title,url&&q=' + val
      })
        .done(function(results) {
          $.each(results.hits.hits, function(index, value) {
            $('<a class="border-t border-gray-100 py-4 text-gray-900 block first:border-t-0 hover:text-primary-base" href="' + value._source.url + '">' + value._source.title + '</a>').appendTo('#search-results');
          });
        });
    });
  }

  $('.js-scrollto').on('click', function(event) {
    event.preventDefault();
    var id = $(this).attr('href');
    $('html, body').animate({
      scrollTop: $(id).offset().top
    }, 300);
  });

  if ($('.js-announcement').length) {
    var ghostContentKey = '10e7f8c1f793d2945ea1177076';
    $.ajax({
      url: 'https://our.status.im/ghost/api/v2/content/posts/?key='+ ghostContentKey +'&limit=1&fields=title,url'
    })
    .done(function(results) {
      $('.js-announcement b').text(results.posts[0].title);
      $('.js-announcement').attr('href', results.posts[0].url).removeClass('inactive');
    })
    .fail(function() {
      $.ajax({
        url: 'https://our.status.im/ghost/api/v0.1/posts/?include=tags&formats=plaintext&client_id=ghost-frontend&client_secret=2b055fcd57ba&limit=1'
      })
      .done(function(results) {
        $('.js-announcement b').text(results.posts[0].title);
        $('.js-announcement').attr('href', 'https://our.status.im' + results.posts[0].url).removeClass('inactive');
      });
    })
  }

  $('.js-sidebar-mobile-trigger').on('click', function(event) {
    event.preventDefault();
    $('.js-sidebar-inner').removeClass('invisible opacity-0 pointer-events-none scale-95 mt-8');
    $('.js-backdrop').removeClass('invisible opacity-0 pointer-events-none');
  });

  $('.js-mobile-sidebar-trigger-close').on('click', function (event) {
    event.preventDefault();
    $('.js-sidebar-inner').addClass('invisible opacity-0 pointer-events-none scale-95 mt-8');
    $('.js-backdrop').addClass('invisible opacity-0 pointer-events-none');
  });

  if ($('.js-quick-nav').length) {
    var quickNavOffset = $('.js-quick-nav').offset().top;
    $(window).on('resize', function () {
      quickNavOffset = $('.js-quick-nav').offset().top;
    });
    $(window).on('scroll', function () {
      var y = $(window).scrollTop();
      if (y > quickNavOffset) {
        $('.js-quick-nav, .js-quick-nav-sub').addClass('fixed');
        $('.js-quick-nav, .js-quick-nav-sub').removeClass('absolute');
      } else {
        $('.js-quick-nav, .js-quick-nav-sub').removeClass('fixed');
        $('.js-quick-nav, .js-quick-nav-sub').addClass('absolute');
      }
    });
    $('.js-quick-nav-sub ul li a').on('click', function(event) {
      event.preventDefault();
      var id = $(this).attr('href');
      $('html, body').animate({
        scrollTop: $(id).offset().top - 100
      }, 300);
    });
  }

  if ($('.open-issues').length) {

    var htmlReact = '';

    if (typeof Cookies.get('open-issues-react') !== 'undefined') {
      $('.open-issues-react').append(localStorage.getItem('open-issues-react'));
    } else {
      fetch('https://api.github.com/repos/status-im/status-react/issues?sort=created&per_page=30')
        .then(
          function(response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' + response.status);
              return;
            }

            response.json().then(function(data) {

              var i = 0;

              data.forEach(function(element) {
                if (typeof element.pull_request === 'undefined') {
                  if(i < 4){
                    var current= new Date();
                    var labelsHtml = '<div class="tags">';
                    var labels = element.labels;
                    labels.forEach(function(label){
                      labelsHtml += '<div class="tag">'+ label.name +'</div>'
                    });
                    labelsHtml += '</div>';
                    htmlReact += '<li> \
                        <div class="number">#'+ element.number +'</div> \
                        <div class="details"> \
                          <b><a href="'+ element.html_url +'" target="_blank">' + element.title + '</a></b> \
                            '+ labelsHtml +' \
                          <div class="opened"> \
                            Opened: <time>'+ timeDifference(current, new Date(element.created_at)) +'</time> \
                          </div> \
                          <div class="activity"> \
                            Last activity: <time>'+ timeDifference(current, new Date(element.updated_at)) +'</time> \
                          </div> \
                        </div> \
                      </li>';
                    i++;
                  }
                }
              });

              localStorage.removeItem('open-issues-react');
              localStorage.setItem('open-issues-react', htmlReact);
              Cookies.set('open-issues-react', true, { expires: 1 });
              $('.open-issues-react').append(htmlReact);

            });

          }
        )
        .catch(function(err) {
          console.log('Fetch Error :-S', err);
        });
    }

    var htmlGo = '';

    if (typeof Cookies.get('open-issues-go') !== 'undefined') {
      $('.open-issues-go').append(localStorage.getItem('open-issues-go'));
    } else {
      fetch('https://api.github.com/repos/status-im/status-go/issues?sort=created&per_page=30')
        .then(
          function(response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: '
                + response.status);
              return;
            }

            response.json().then(function(data) {

              var i = 0;

              data.forEach(function(element) {
                if (typeof element.pull_request === 'undefined') {
                  if(i < 4){
                    var current= new Date();
                    var labelsHtml = '<div class="tags">';
                    var labels = element.labels;
                    labels.forEach(function(label){
                      labelsHtml += '<div class="tag">'+ label.name +'</div>'
                    });
                    labelsHtml += '</div>';
                    htmlGo += '<li> \
                        <div class="number">#'+ element.number +'</div> \
                        <div class="details"> \
                          <b><a href="'+ element.html_url +'" target="_blank">' + element.title + '</a></b> \
                            '+ labelsHtml +' \
                          <div class="opened"> \
                            Opened: <time>'+ timeDifference(current, new Date(element.created_at)) +'</time> \
                          </div> \
                          <div class="activity"> \
                            Last activity: <time>'+ timeDifference(current, new Date(element.updated_at)) +'</time> \
                          </div> \
                        </div> \
                      </li>';
                    i++;
                  }
                }
              });

              localStorage.removeItem('open-issues-go');
              localStorage.setItem('open-issues-go', htmlGo);
              Cookies.set('open-issues-go', true, { expires: 1 });
              $('.open-issues-go').append(htmlGo);

            });

          }
        )
        .catch(function(err) {
          console.log('Fetch Error :-S', err);
        });
    }

  }

  $(window).scroll(function() {
    const sticky = {
      position: 'sticky',
      width: '100%',
      top: '0',
      background: '#FFFFFF',
      boxShadow: '0px 3px 40px rgba(0, 0, 0, 0.04)',
    }

    const relative = {
      position: '',
      width: '%',
      top: '',
      background: '',
      boxShadow: '',
    }

    const header = $('#header');
    let scroll = $(window).scrollTop();
  
    if (scroll) header.css(sticky);
    else header.css(relative);
  });

  // Partner campaign landing page start
  if (document.title === 'Status - Partner Campaign Template' || document.title === 'Status - criptomaniacos') {

    let width =  w;

    const statusLogoMobile = {
      "position": "absolute",
      "left": "50%",
      "transform": "translate(-50%)"
    }

    const statusLogoDesktop = {
      "position": "",
      "left": "",
      "transform": ""
    }

    const partnerHeroDesktop = {
      "width": "65%",
      "padding-left": "45px",
      "padding-bottom": "50px",
      "height": ""
    }

    const partnerHeroMobile = {
      "height": "400px",
      "width": "",
      "padding-left": "",
      "padding-bottom": ""
    }

    const partnerPhone = {
      "margin": "100px auto 0 auto",
      "height": "400px"
    }

    const partnerPhoneMobile = {
      "margin-top": "30px",
      "width": "300px",
      "height": "350px"
    }

    $('footer').css("display", "none");
    $('.splide__arrow').css("display", "none");
    $('.splide__pagination').css("bottom", "-3rem");
    $('.splide__pagination__page.is-active').css("background", "#ccc");
    $('.partner-phone img').css(partnerPhone);
    $('.partner-phone-mobile img').css(partnerPhoneMobile);

    if (w < 768) {
      $('.logo img').css(statusLogoMobile);
      $('header').css("margin-top", "5px");
      $('.partner-hero-image img').css(partnerHeroMobile);
      $('.image-slider').show();
      $('.desktop-tiles').hide();
      $('.partner-cta-mobile').show();
      $('.desktop-features').hide();
    } else {
      $('.logo img').css(statusLogoDesktop);
      $('.partner-hero-image img').css(partnerHeroDesktop);
      $('.image-slider').hide();
      $('.desktop-tiles').show();
      $('.partner-cta-mobile').hide();
      $('.desktop-features').show();
    }

    window.addEventListener("resize", function(event) {
      width = document.body.clientWidth;
      if (width < 768) {
        $('.logo img').css(statusLogoMobile);
        $('.partner-hero-image img').css(partnerHeroMobile);
        $('header').css("margin-top", "5px");
        $('.image-slider').show();
        $('.desktop-tiles').hide();
        $('.partner-cta-mobile').show();
        $('.desktop-features').hide();
      } else {
        $('.logo img').css(statusLogoDesktop);
        $('.partner-hero-image img').css(partnerHeroDesktop);
        $('.image-slider').hide();
        $('.desktop-tiles').show();
        $('.partner-cta-mobile').hide();
        $('.desktop-features').show();
      }
    })
  }
  // Partner campaign landing page end

  if($('.js-right-sub-navigation').length){
    $('.js-editor-content h1, .js-editor-content h2, .js-editor-content h3').each(function (index, element) {
      var id = $(this).attr('id');
      var title = $(this).text();
      if (title === 'Jobs at Status') {
        $('.js-right-sub-navigation').css("display", "none");
        return false;
      }
      $('.js-right-sub-navigation ul').append('<li class="mt-8 hover:text-primary-base transition-all duration-200 linear text-lg li-'+ $(this)[0].nodeName.toLowerCase() +'"><a href="#'+ id +'" class="text-gray-500 antialiased">' + title + '</a></li>');
    });
    $('.js-right-sub-navigation').stick_in_parent({
      offset_top: 30
    });
    $('.js-right-sub-navigation a').on('click', function() {
      var id = $(this).attr('href');
      $('html, body').animate({
        scrollTop: $(id).offset().top - 50
      }, 500);
      return false;
    });
  }

  // Animate Keycard Intro Elements
  ScrollReveal().reveal('.keycard-animate-1', {
    opacity: 1,
    duration: 0,
    viewFactor: 0.5,
    afterReveal: function(){

      // Animate Card
      anime({
        targets: '.keycard-animate-1 .card',
        scale: [0.7, 1],
        rotateX: [-10, 0],
        rotateY: [10, 0],
        rotateZ: [15, 0],
        duration: 750,
        easing: 'easeInOutQuad',
        delay: 100
      });

      // Animate Phone
      anime({
        targets: '.keycard-animate-1 .phone',
        scale: [0.95, 1],
        translateX: [-30, 0],
        duration: 750,
        easing: 'easeInOutQuad',
        delay: 100
      });

      // Animate Circles
      anime({
        targets: '.keycard-animate-1 .circles',
        scale: [0.9, 1],
        duration: 750,
        easing: 'easeInOutQuad',
        delay: 100
      });
    }
  });

  // Animate Keycard Cards
  ScrollReveal().reveal('.keycard-animate-2', {
    opacity: 1,
    duration: 0,
    viewFactor: 0.5,
    afterReveal: function(){

      // Animate Black Card
      anime({
        targets: '.keycard-animate-2 .front-1',
        translateX: [-50, 0],
        scale: [0.7, 1],
        rotateX: [-10, 0],
        rotateY: [0, 0],
        rotateZ: [-10, 0],
        duration: 750,
        easing: 'easeInOutQuad',
      });

      // Animate White Card
      anime({
        targets: '.keycard-animate-2 .front-2',
        scale: [0.7, 1],
        rotateX: [-10, 0],
        rotateY: [0, 0],
        rotateZ: [-10, 0],
        duration: 750,
        easing: 'easeInOutQuad',
        delay: 100
      });

      // Animate Cyan Card
      anime({
        targets: '.keycard-animate-2 .front-3',
        translateX: [50, 0],
        scale: [0.7, 1],
        rotateX: [0, 0],
        rotateY: [0, 0],
        rotateZ: [-10, 0],
        duration: 750,
        easing: 'easeInOutQuad',
        delay: 200
      });
    }
  });


  // Animate Keycard Transaction

  var keycardAnimate3Viewfactor = 1;

  if(w < 1200){
    keycardAnimate3Viewfactor = 0.8;
  }

  ScrollReveal().reveal('.keycard-animate-3', {
    opacity: 1,
    duration: 0,
    viewFactor: keycardAnimate3Viewfactor,
    afterReveal: function(){

      // Animate Morph Element
      anime({
        targets: '.keycard-animate-3 .morph',
        opacity: [0, 1],
        translateY: [20,0],
        scale: [0.8, 1],
        duration: 500,
        easing: 'easeInOutQuad',
        complete: function(anim) {

          // Delete amount
          setTimeout(function() {
            typeWriterDelete($('.keycard-animate-3 .amount span'), typeWriter);
          }, 300);

        }
      });
    }
  });

  function typeWriterDelete(e, f) {
    var t = e.text();
    if (t.length > 0) {
      e.text(t.substring(0, t.length - 1));
      setTimeout(function() {
        typeWriterDelete(e, f)
      }, 200);
    }else{

      // Write amount
      $('.keycard-animate-3 .amount span').addClass('active');
      typeWriter($('.keycard-animate-3 .amount span'), '15', 0);
    }
  }

  function typeWriter(e, txt, i) {
    var t = e.text();
    if (t.length < txt.length) {
      e.text(e.text() + txt.charAt(i));
      i++;
      setTimeout(function() {
        typeWriter($('.keycard-animate-3 .amount span'), '15', i);
      }, 200);
    }else{

      // Animate Morph Element
      anime({
        targets: '.keycard-animate-3 .morph',
        left: 0,
        width: '100%',
        bottom: 0,
        duration: 500,
        delay: 300,
        height: '160px',
        zIndex: '4',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: '22px',
        borderBottomLeftRadius: '22px',
        easing: 'easeInOutQuad',
        changeBegin: function(anim) {
          $('.keycard-animate-3').attr('data-step', 2);
        },
        complete: function(anim) {

          // Animate Circles
          anime({
            targets: '.keycard-animate-3 .morph .step-2 .circles',
            duration: 3000,
            keyframes: [
              {
                opacity: 0.6,
                scale: 0.6
              },
              {
                opacity: 0.3,
                scale: 1
              },
              {
                opacity: 0.6,
                scale: 0.6
              },
              {
                opacity: 0.3,
                scale: 1
              },
              {
                opacity: 0.6,
                scale: 0.6
              },
              {
                opacity: 0.3,
                scale: 1
              },
            ],
            easing: 'easeInOutQuad'
          });

          // Animate Keycard behind phone

          var translateXFront4 = 70;

          anime({
            targets: '.keycard-animate-3 .front-4',
            duration: 2000,
            keyframes: [
              {
                translateX: 0,
                opacity: 1
              },
              {
                translateX: translateXFront4,
                delay: 1200
              },
            ],
            easing: 'easeInOutQuad',
            complete: function(anim) {

              var keycardAnimate3MorphWidth = 'calc(100% + 140px)',
                keycardAnimate3MorphLeft = '-70px',
                keycardAnimate3MorphHeight = '102px';

                if(w < 1200){
                  keycardAnimate3MorphWidth = 'calc(100% + 100px)',
                  keycardAnimate3MorphLeft = '-50px',
                  keycardAnimate3MorphHeight = '82px';
                }

              // Animate transaction complete
              anime({
                targets: '.keycard-animate-3 .morph',
                left: keycardAnimate3MorphLeft,
                width: keycardAnimate3MorphWidth,
                bottom: '20px',
                duration: 500,
                height: keycardAnimate3MorphHeight,
                backgroundColor: '#4EBC60',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                borderBottomRightRadius: '12px',
                borderBottomLeftRadius: '12px',
                easing: 'easeInOutQuad',
                begin: function(anim) {
                  $('.keycard-animate-3').attr('data-step', 3);
                },
              })

              anime({
                targets: '.keycard-animate-3 .front-4',
                opacity: 0,
                delay: 1000,
                duration: 500,
                easing: 'linear',
              })

            }
          });

        }
      });
    }
  }

  // Animate Keycard Lock

  var keycardAnimate4Viewfactor = 1;

  if(w < 1200){
    keycardAnimate4Viewfactor = 0.8;
  }

  ScrollReveal().reveal('.keycard-animate-4', {
    opacity: 1,
    duration: 0,
    viewFactor: keycardAnimate4Viewfactor,
    afterReveal: function(){

      var phoneNumbersToAnimate = [2,7,6,0,1,5];
      for (var i = 0; i < phoneNumbersToAnimate.length; i++) {
        anime({
          targets: '.keycard-animate-4 .numbers .nr-' + phoneNumbersToAnimate[i],
          delay: i*500,
          backgroundColor: '#536DE1',
          color: '#fff',
          duration: 200,
          easing: 'easeInOutQuad',
          direction: 'alternate'
        });
        anime({
          targets: '.keycard-animate-4 .dots .dot-' + i,
          delay: i*500,
          backgroundColor: '#536DE1',
          duration: 200,
          easing: 'easeInOutQuad',
        });
      };

      setTimeout(function() {

        // Animate Morph Element
        anime({
          targets: '.keycard-animate-4 .morph',
          duration: 500,
          delay: 300,
          translateY: ['100%', 0],
          easing: 'easeInOutQuad',
          changeBegin: function(anim) {
            $('.keycard-animate-4').attr('data-step', 2);
          },
          complete: function(anim) {
            // Animate Circles
            anime({
              targets: '.keycard-animate-4 .morph .step-2 .circles',
              duration: 3000,
              keyframes: [
                {
                  opacity: 0.6,
                  scale: 0.6
                },
                {
                  opacity: 0.3,
                  scale: 1
                },
                {
                  opacity: 0.6,
                  scale: 0.6
                },
                {
                  opacity: 0.3,
                  scale: 1
                },
                {
                  opacity: 0.6,
                  scale: 0.6
                },
                {
                  opacity: 0.3,
                  scale: 1
                },
              ],
              easing: 'easeInOutQuad'
            });

            // Animate Keycard behind phone

            var translateXFront4 = 70;

            anime({
              targets: '.keycard-animate-4 .front-4',
              duration: 2000,
              keyframes: [
                {
                  translateX: 0,
                  opacity: 1
                },
                {
                  translateX: translateXFront4,
                  delay: 1200
                },
              ],
              easing: 'easeInOutQuad',
              complete: function(anim) {

                // Animate transaction complete

                var keycardAnimate3MorphWidth = '360px',
                  keycardAnimate3MorphLeft = '-70px',
                  keycardAnimate3MorphHeight = '102px';

                  if(w < 1200){
                    keycardAnimate3MorphWidth = '281px',
                    keycardAnimate3MorphLeft = '-50px',
                    keycardAnimate3MorphHeight = '82px';
                  }

                anime({
                  targets: '.keycard-animate-4 .morph',
                  left: keycardAnimate3MorphLeft,
                  width: keycardAnimate3MorphWidth,
                  bottom: '20px',
                  duration: 500,
                  height: keycardAnimate3MorphHeight,
                  backgroundColor: '#4EBC60',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                  borderBottomRightRadius: '12px',
                  borderBottomLeftRadius: '12px',
                  easing: 'easeInOutQuad',
                  begin: function(anim) {
                    $('.keycard-animate-4').attr('data-step', 3);
                  },
                })

                anime({
                  targets: '.keycard-animate-4 .front-4',
                  opacity: 0,
                  delay: 1000,
                  duration: 500,
                  easing: 'linear',
                })

              }
            });
          }
        });

      }, 3000);

    }
  });

  ScrollReveal().reveal('.private-and-secure', {
    opacity: 1,
    duration: 0,
    viewFactor: 1,
    afterReveal: function(){

      privateAndSecureAnimation();

    }
  });

  function privateAndSecureAnimation(){

    anime({
      targets: '.private-and-secure .avatar',
      keyframes: [
        {scale: 1},
        {scale: 0.7},
        {scale: 1},
      ],
      duration: 1000,
      easing: 'easeInOutQuad',
    });

    anime({
      targets: '.private-and-secure .key',
      opacity: 1,
      duration: 300,
      translateX: 72,
      translateY: -100,
      scale: [0, 1],
      delay: 800,
      easing: 'linear',
      complete: function(anim) {
        anime({
          targets: '.private-and-secure .key',
          rotate: 90,
          duration: 400,
          easing: 'linear',
          delay: 300,
          complete: function(anim) {
            anime({
              targets: '.private-and-secure .lock .absolute',
              translateY: -3,
              easing: 'linear',
              duration: 300,
              delay: 200,
              complete: function(anim) {
                anime({
                  targets: '.private-and-secure .overlay',
                  opacity: [1, 0],
                  duration: 300,
                  easing: 'linear',
                  delay: 200,
                  complete: function(anim) {
                    anime({
                      targets: '.private-and-secure .lock .absolute',
                      translateY: 0,
                      duration: 300,
                      easing: 'linear',
                      delay: 1000,
                    });
                    anime({
                      targets: '.private-and-secure .overlay',
                      opacity: [0, 1],
                      duration: 300,
                      easing: 'linear',
                      delay: 1000,
                    });
                    anime({
                      targets: '.private-and-secure .key',
                      rotate: 0,
                      translateX: 0,
                      translateY: 0,
                      scale: [1, 0],
                      duration: 300,
                      easing: 'linear',
                      delay: 1000,
                      complete: function(anim) {
                        setTimeout(function() {
                          privateAndSecureAnimation();
                        }, 500);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });

  }

  ScrollReveal().reveal('.home-all', {
    opacity: 1,
    delay: 500,
    duration: 0,
    viewFactor: .5,
    afterReveal: function(){

      homeAllAnimation();

    }
  });

  function homeAllAnimation(){
    anime({
      targets: '.home-all .img-1',
      translateX: [-160, 0],
      duration: 1000,
      easing: 'linear',
    });
    anime({
      targets: '.home-all .img-3',
      translateX: [160, 0],
      duration: 1000,
      easing: 'linear',
      complete: function(anim) {
        anime({
          targets: '.home-all .overlay',
          opacity: [0, 1],
          duration: 500,
          easing: 'linear',
          complete: function(anim) {
            anime({
              targets: '.home-all .circles-container',
              scale: [0, 1],
              opacity: [0, 1],
              duration: 1500,
              easing: 'linear',
              complete: function(anim) {
                anime({
                  targets: '.home-all .circles-container',
                  scale: [1, 0],
                  opacity: [1, 0],
                  duration: 1500,
                  delay: 500,
                  easing: 'linear',
                  complete: function(anim) {
                    anime({
                      targets: '.home-all .overlay',
                      opacity: [1, 0],
                      duration: 500,
                      easing: 'linear',
                      complete: function(anim) {
                        anime({
                          targets: '.home-all .img-1',
                          translateX: [0, -160],
                          duration: 1000,
                          easing: 'linear',
                        });
                        anime({
                          targets: '.home-all .img-3',
                          translateX: [0, 160],
                          duration: 1000,
                          easing: 'linear',
                          complete: function(anim) {
                            setTimeout(function() {
                              homeAllAnimation();
                            }, 1500);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  function messengerIntroAnimation(){
    anime({
      targets: '.privacy-first-step-1 .lock .absolute',
      translateY: -3,
      easing: 'linear',
      duration: 300,
      delay: 500,
      complete: function(anim) {
        anime({
          targets: '.privacy-first-step-1',
          opacity: [1,0],
          easing: 'linear',
          duration: 300,
          delay: 300,
        })
        anime({
          targets: '.privacy-first-step-2',
          opacity: [0,1],
          easing: 'linear',
          duration: 300,
          delay: 500,
          complete: function(anim) {
            anime({
              targets: '.privacy-first-step-1',
              opacity: [0,1],
              easing: 'linear',
              duration: 300,
              delay: 2000,
            })
            anime({
              targets: '.privacy-first-step-2',
              opacity: [1,0],
              easing: 'linear',
              duration: 300,
              delay: 2000,
              complete: function(anim) {
                anime({
                  targets: '.privacy-first-step-1 .lock .absolute',
                  translateY: 0,
                  easing: 'linear',
                  duration: 300,
                  delay: 500,
                  complete: function(anim) {
                    setTimeout(function() {
                      messengerIntroAnimation();
                    }, 1500);
                  }
                })
              }
            })
          }
        })
      }
    })
  }

  messengerIntroAnimation();

  function timeDifference(current, previous) {
    
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    
    var elapsed = current - previous;
    
    if (elapsed < msPerMinute) {
      return Math.round(elapsed/1000) + ' seconds ago';   
    }
    
    else if (elapsed < msPerHour) {
      return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }
    
    else if (elapsed < msPerDay ) {
      return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
      return Math.round(elapsed/msPerDay) + ' days ago';   
    }
    
    else if (elapsed < msPerYear) {
      return Math.round(elapsed/msPerMonth) + ' months ago';   
    }
    
    else {
      return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

});

/**
 * Sticky Sidebar JavaScript Plugin.
 * @version 3.3.4
 * @author Ahmed Bouhuolia <a.bouhuolia@gmail.com>
 * @license The MIT License (MIT)
 */
 const StickySidebar = (() => {

  // ---------------------------------
  // # Define Constants
  // ---------------------------------
  //
  const EVENT_KEY = '.stickySidebar';
  const VERSION   = '3.3.4';

  const DEFAULTS = {
      /**
       * Additional top spacing of the element when it becomes sticky.
       * @type {Numeric|Function}
       */
      topSpacing: 0,

      /**
       * Additional bottom spacing of the element when it becomes sticky.
       * @type {Numeric|Function}
       */
      bottomSpacing: 0,

      /**
       * Container sidebar selector to know what the beginning and end of sticky element.
       * @type {String|False}
       */
      containerSelector: false,

      /**
       * Inner wrapper selector.
       * @type {String}
       */
      innerWrapperSelector: '.inner-wrapper-sticky',

      /**
       * The name of CSS class to apply to elements when they have become stuck.
       * @type {String|False}
       */
      stickyClass: 'is-affixed',

      /**
       * Detect when sidebar and its container change height so re-calculate their dimensions.
       * @type {Boolean}
       */
      resizeSensor: true,

      /**
       * The sidebar returns to its normal position if its width below this value.
       * @type {Numeric}
       */
      minWidth: false
  };

  // ---------------------------------
  // # Class Definition
  // ---------------------------------
  //
  /**
   * Sticky Sidebar Class.
   * @public
   */
  class StickySidebar{

      /**
       * Sticky Sidebar Constructor.
       * @constructor
       * @param {HTMLElement|String} sidebar - The sidebar element or sidebar selector.
       * @param {Object} options - The options of sticky sidebar.
       */
      constructor(sidebar, options = {}){
          this.options = StickySidebar.extend(DEFAULTS, options);

          // Sidebar element query if there's no one, throw error.
          this.sidebar = ('string' === typeof sidebar ) ? document.querySelector(sidebar) : sidebar;
          if( 'undefined' === typeof this.sidebar )
              throw new Error("There is no specific sidebar element.");

          this.sidebarInner = false;
          this.container = this.sidebar.parentElement;

          // Current Affix Type of sidebar element.
          this.affixedType = 'STATIC';
          this.direction = 'down';
          this.support = {
              transform:   false,
              transform3d: false
          };

          this._initialized = false;
          this._reStyle = false;
          this._breakpoint = false;

          // Dimensions of sidebar, container and screen viewport.
          this.dimensions = {
              translateY: 0,
              maxTranslateY: 0,
              topSpacing: 0,
              lastTopSpacing: 0,
              bottomSpacing: 0,
              lastBottomSpacing: 0,
              sidebarHeight: 0,
              sidebarWidth: 0,
              containerTop: 0,
              containerHeight: 0,
              viewportHeight: 0,
              viewportTop: 0,
              lastViewportTop: 0,
          };

          // Bind event handlers for referencability.
          ['handleEvent'].forEach( (method) => {
              this[method] = this[method].bind(this);
          });

          // Initialize sticky sidebar for first time.
          this.initialize();
      }

      /**
       * Initializes the sticky sidebar by adding inner wrapper, define its container,
       * min-width breakpoint, calculating dimensions, adding helper classes and inline style.
       * @private
       */
      initialize(){
          this._setSupportFeatures();

          // Get sticky sidebar inner wrapper, if not found, will create one.
          if( this.options.innerWrapperSelector ){
              this.sidebarInner = this.sidebar.querySelector(this.options.innerWrapperSelector);

              if( null === this.sidebarInner )
                  this.sidebarInner = false;
          }

          if( ! this.sidebarInner ){
              let wrapper = document.createElement('div');
              wrapper.setAttribute('class', 'inner-wrapper-sticky');
              this.sidebar.appendChild(wrapper);

              while( this.sidebar.firstChild != wrapper )
                  wrapper.appendChild(this.sidebar.firstChild);

              this.sidebarInner = this.sidebar.querySelector('.inner-wrapper-sticky');
          }

          // Container wrapper of the sidebar.
          if( this.options.containerSelector ){
              let containers = document.querySelectorAll(this.options.containerSelector);
              containers = Array.prototype.slice.call(containers);

              containers.forEach((container, item) => {
                  if( ! container.contains(this.sidebar) ) return;
                  this.container = container;
              });

              if( ! containers.length )
                  throw new Error("The container does not contains on the sidebar.");
          }

          // If top/bottom spacing is not function parse value to integer.
          if( 'function' !== typeof this.options.topSpacing )
              this.options.topSpacing = parseInt(this.options.topSpacing) || 0;

          if( 'function' !== typeof this.options.bottomSpacing )
              this.options.bottomSpacing = parseInt(this.options.bottomSpacing) || 0;

          // Breakdown sticky sidebar if screen width below `options.minWidth`.
          this._widthBreakpoint();

          // Calculate dimensions of sidebar, container and viewport.
          this.calcDimensions();

          // Affix sidebar in proper position.
          this.stickyPosition();

          // Bind all events.
          this.bindEvents();

          // Inform other properties the sticky sidebar is initialized.
          this._initialized = true;
      }

      /**
       * Bind all events of sticky sidebar plugin.
       * @protected
       */
      bindEvents(){
          window.addEventListener('resize', this, {passive: true, capture: false});
          window.addEventListener('scroll', this, {passive: true, capture: false});

          this.sidebar.addEventListener('update' + EVENT_KEY, this);

          if( this.options.resizeSensor && 'undefined' !== typeof ResizeSensor ){
              new ResizeSensor(this.sidebarInner, this.handleEvent);
              new ResizeSensor(this.container, this.handleEvent);
          }
      }

      /**
       * Handles all events of the plugin.
       * @param {Object} event - Event object passed from listener.
       */
      handleEvent(event){
          this.updateSticky(event);
      }

      /**
       * Calculates dimensions of sidebar, container and screen viewpoint
       * @public
       */
      calcDimensions(){
          if( this._breakpoint ) return;
          var dims = this.dimensions;

          // Container of sticky sidebar dimensions.
          dims.containerTop    = StickySidebar.offsetRelative(this.container).top;
          dims.containerHeight = this.container.clientHeight;
          dims.containerBottom = dims.containerTop + dims.containerHeight;

          // Sidebar dimensions.
          dims.sidebarHeight = this.sidebarInner.offsetHeight;
          dims.sidebarWidth  = this.sidebarInner.offsetWidth;

          // Screen viewport dimensions.
          dims.viewportHeight = window.innerHeight;

          // Maximum sidebar translate Y.
          dims.maxTranslateY = dims.containerHeight - dims.sidebarHeight;

          this._calcDimensionsWithScroll();
      }

      /**
       * Some dimensions values need to be up-to-date when scrolling the page.
       * @private
       */
      _calcDimensionsWithScroll(){
          var dims = this.dimensions;

          dims.sidebarLeft = StickySidebar.offsetRelative(this.sidebar).left;

          dims.viewportTop    = document.documentElement.scrollTop || document.body.scrollTop;
          dims.viewportBottom = dims.viewportTop + dims.viewportHeight;
          dims.viewportLeft   = document.documentElement.scrollLeft || document.body.scrollLeft;

          dims.topSpacing    = this.options.topSpacing;
          dims.bottomSpacing = this.options.bottomSpacing;

          if( 'function' === typeof dims.topSpacing )
              dims.topSpacing = parseInt(dims.topSpacing(this.sidebar)) || 0;

          if( 'function' === typeof dims.bottomSpacing )
              dims.bottomSpacing = parseInt(dims.bottomSpacing(this.sidebar)) || 0;

          if( 'VIEWPORT-TOP' === this.affixedType ){
              // Adjust translate Y in the case decrease top spacing value.
              if( dims.topSpacing < dims.lastTopSpacing ){
                  dims.translateY += dims.lastTopSpacing - dims.topSpacing;
                  this._reStyle = true;
              }
          } else if( 'VIEWPORT-BOTTOM' === this.affixedType ){
              // Adjust translate Y in the case decrease bottom spacing value.
              if( dims.bottomSpacing < dims.lastBottomSpacing ){
                  dims.translateY += dims.lastBottomSpacing - dims.bottomSpacing;
                  this._reStyle = true;
              }
          }

          dims.lastTopSpacing    = dims.topSpacing;
          dims.lastBottomSpacing = dims.bottomSpacing;
      }

      /**
       * Determine whether the sidebar is bigger than viewport.
       * @public
       * @return {Boolean}
       */
      isSidebarFitsViewport(){
          let dims = this.dimensions;
          let offset = this.scrollDirection === 'down' ? dims.lastBottomSpacing : dims.lastTopSpacing;
          return this.dimensions.sidebarHeight + offset < this.dimensions.viewportHeight;
      }

      /**
       * Observe browser scrolling direction top and down.
       */
      observeScrollDir(){
          var dims = this.dimensions;
          if( dims.lastViewportTop === dims.viewportTop ) return;

          var furthest = 'down' === this.direction ? Math.min : Math.max;

          // If the browser is scrolling not in the same direction.
          if( dims.viewportTop === furthest(dims.viewportTop, dims.lastViewportTop) )
              this.direction = 'down' === this.direction ?  'up' : 'down';
      }

      /**
       * Gets affix type of sidebar according to current scroll top and scrolling direction.
       * @public
       * @return {String|False} - Proper affix type.
       */
      getAffixType(){
          this._calcDimensionsWithScroll();
          var dims = this.dimensions;
          var colliderTop = dims.viewportTop + dims.topSpacing;
          var affixType = this.affixedType;

          if( colliderTop <= dims.containerTop || dims.containerHeight <= dims.sidebarHeight ){
              dims.translateY = 0;
              affixType = 'STATIC';
          } else {
              affixType = ( 'up' === this.direction ) ?
                  this._getAffixTypeScrollingUp() : this._getAffixTypeScrollingDown();
          }

          // Make sure the translate Y is not bigger than container height.
          dims.translateY = Math.max(0, dims.translateY);
          dims.translateY = Math.min(dims.containerHeight, dims.translateY);
          dims.translateY = Math.round(dims.translateY);

          dims.lastViewportTop = dims.viewportTop;
          return affixType;
      }

      /**
       * Get affix type while scrolling down.
       * @private
       * @return {String} - Proper affix type of scrolling down direction.
       */
      _getAffixTypeScrollingDown(){
          var dims = this.dimensions;
          var sidebarBottom = dims.sidebarHeight + dims.containerTop;
          var colliderTop = dims.viewportTop + dims.topSpacing;
          var colliderBottom = dims.viewportBottom - dims.bottomSpacing;
          var affixType = this.affixedType;

          if( this.isSidebarFitsViewport() ){
              if( dims.sidebarHeight + colliderTop >= dims.containerBottom ){
                  dims.translateY = dims.containerBottom - sidebarBottom;
                  affixType = 'CONTAINER-BOTTOM';

              } else if( colliderTop >= dims.containerTop ){
                  dims.translateY = colliderTop - dims.containerTop;
                  affixType = 'VIEWPORT-TOP';
              }
          } else {
              if( dims.containerBottom <= colliderBottom ){
                  dims.translateY = dims.containerBottom - sidebarBottom;
                  affixType = 'CONTAINER-BOTTOM';

              } else if( sidebarBottom + dims.translateY <= colliderBottom ){
                  dims.translateY = colliderBottom - sidebarBottom;
                  affixType = 'VIEWPORT-BOTTOM';

              } else if( dims.containerTop + dims.translateY <= colliderTop &&
                  (0 !== dims.translateY && dims.maxTranslateY !== dims.translateY) ){
                  affixType = 'VIEWPORT-UNBOTTOM';
              }
          }

          return affixType;
      }

      /**
       * Get affix type while scrolling up.
       * @private
       * @return {String} - Proper affix type of scrolling up direction.
       */
      _getAffixTypeScrollingUp(){
          var dims = this.dimensions;
          var sidebarBottom = dims.sidebarHeight + dims.containerTop;
          var colliderTop = dims.viewportTop + dims.topSpacing;
          var colliderBottom = dims.viewportBottom - dims.bottomSpacing;
          var affixType = this.affixedType;

          if( colliderTop <= dims.translateY + dims.containerTop ){
              dims.translateY = colliderTop - dims.containerTop;
              affixType = 'VIEWPORT-TOP';

          } else if( dims.containerBottom <= colliderBottom ){
              dims.translateY = dims.containerBottom - sidebarBottom;
              affixType = 'CONTAINER-BOTTOM';

          } else if( ! this.isSidebarFitsViewport() ){

              if( dims.containerTop <= colliderTop &&
                  (0 !== dims.translateY && dims.maxTranslateY !== dims.translateY) ){
                  affixType = 'VIEWPORT-UNBOTTOM';
              }
          }

          return affixType;
      }

      /**
       * Gets inline style of sticky sidebar wrapper and inner wrapper according
       * to its affix type.
       * @private
       * @param {String} affixType - Affix type of sticky sidebar.
       * @return {Object}
       */
      _getStyle(affixType){
          if( 'undefined' === typeof affixType ) return;

          var style = {inner: {}, outer: {}};
          var dims = this.dimensions;

          switch( affixType ){
              case 'VIEWPORT-TOP':
                  style.inner = {position: 'fixed', top: dims.topSpacing,
                      left: dims.sidebarLeft - dims.viewportLeft, width: dims.sidebarWidth};
                  break;
              case 'VIEWPORT-BOTTOM':
                  style.inner = {position: 'fixed', top: 'auto', left: dims.sidebarLeft,
                      bottom: dims.bottomSpacing, width: dims.sidebarWidth};
                  break;
              case 'CONTAINER-BOTTOM':
              case 'VIEWPORT-UNBOTTOM':
                  let translate = this._getTranslate(0, dims.translateY + 'px');

                  if( translate )
                      style.inner = {transform: translate};
                  else
                      style.inner = {position: 'absolute', top: dims.translateY, width: dims.sidebarWidth};
                  break;
          }

          switch( affixType ){
              case 'VIEWPORT-TOP':
              case 'VIEWPORT-BOTTOM':
              case 'VIEWPORT-UNBOTTOM':
              case 'CONTAINER-BOTTOM':
                  style.outer = {height: dims.sidebarHeight, position: 'relative'};
                  break;
          }

          style.outer = StickySidebar.extend({height: '', position: ''}, style.outer);
          style.inner = StickySidebar.extend({position: 'relative', top: '', left: '',
              bottom: '', width: '',  transform: ''}, style.inner);

          return style;
      }

      /**
       * Cause the sidebar to be sticky according to affix type by adding inline
       * style, adding helper class and trigger events.
       * @function
       * @protected
       * @param {string} force - Update sticky sidebar position by force.
       */
      stickyPosition(force){
          if( this._breakpoint ) return;

          force = this._reStyle || force || false;

          var offsetTop = this.options.topSpacing;
          var offsetBottom = this.options.bottomSpacing;

          var affixType = this.getAffixType();
          var style = this._getStyle(affixType);

          if( (this.affixedType != affixType || force) && affixType ){
              let affixEvent = 'affix.' + affixType.toLowerCase().replace('viewport-', '') + EVENT_KEY;
              StickySidebar.eventTrigger(this.sidebar, affixEvent);

              if( 'STATIC' === affixType )
                  StickySidebar.removeClass(this.sidebar, this.options.stickyClass);
              else
                  StickySidebar.addClass(this.sidebar, this.options.stickyClass);

              for( let key in style.outer ){
                  let unit = ('number' === typeof style.outer[key]) ? 'px' : '';
                  this.sidebar.style[key] = style.outer[key] + unit;
              }

              for( let key in style.inner ){
                  let unit = ('number' === typeof style.inner[key]) ? 'px' : '';
                  this.sidebarInner.style[key] = style.inner[key] + unit;
              }

              let affixedEvent = 'affixed.'+ affixType.toLowerCase().replace('viewport-', '') + EVENT_KEY;
              StickySidebar.eventTrigger(this.sidebar, affixedEvent);
          } else {
              if( this._initialized ) this.sidebarInner.style.left = style.inner.left;
          }

          this.affixedType = affixType;
      }

      /**
       * Breakdown sticky sidebar when window width is below `options.minWidth` value.
       * @protected
       */
      _widthBreakpoint(){

          if( window.innerWidth <= this.options.minWidth ){
              this._breakpoint = true;
              this.affixedType = 'STATIC';

              this.sidebar.removeAttribute('style');
              StickySidebar.removeClass(this.sidebar, this.options.stickyClass);
              this.sidebarInner.removeAttribute('style');
          } else {
              this._breakpoint = false;
          }
      }

      /**
       * Switches between functions stack for each event type, if there's no
       * event, it will re-initialize sticky sidebar.
       * @public
       */
      updateSticky(event = {}){
          if( this._running ) return;
          this._running = true;

          ((eventType) => {
              requestAnimationFrame(() => {
                  switch( eventType ){
                      // When browser is scrolling and re-calculate just dimensions
                      // within scroll.
                      case 'scroll':
                          this._calcDimensionsWithScroll();
                          this.observeScrollDir();
                          this.stickyPosition();
                          break;

                      // When browser is resizing or there's no event, observe width
                      // breakpoint and re-calculate dimensions.
                      case 'resize':
                      default:
                          this._widthBreakpoint();
                          this.calcDimensions();
                          this.stickyPosition(true);
                          break;
                  }
                  this._running = false;
              });
          })(event.type);
      }

      /**
       * Set browser support features to the public property.
       * @private
       */
      _setSupportFeatures(){
          var support = this.support;

          support.transform = StickySidebar.supportTransform();
          support.transform3d = StickySidebar.supportTransform(true);
      }

      /**
       * Get translate value, if the browser supports transfrom3d, it will adopt it.
       * and the same with translate. if browser doesn't support both return false.
       * @param {Number} y - Value of Y-axis.
       * @param {Number} x - Value of X-axis.
       * @param {Number} z - Value of Z-axis.
       * @return {String|False}
       */
      _getTranslate(y = 0, x = 0, z = 0){
          if( this.support.transform3d ) return 'translate3d(' + y +', '+ x +', '+ z +')';
          else if( this.support.translate ) return 'translate('+ y +', '+ x +')';
          else return false;
      }

      /**
       * Destroy sticky sidebar plugin.
       * @public
       */
      destroy(){
          window.removeEventListener('resize', this, {capture: false});
          window.removeEventListener('scroll', this, {capture: false});

          this.sidebar.classList.remove(this.options.stickyClass);
          this.sidebar.style.minHeight = '';

          this.sidebar.removeEventListener('update' + EVENT_KEY, this);

          var styleReset = {inner: {}, outer: {}};

          styleReset.inner = {position: '', top: '', left: '', bottom: '', width: '',  transform: ''};
          styleReset.outer = {height: '', position: ''};

          for( let key in styleReset.outer )
              this.sidebar.style[key] = styleReset.outer[key];

          for( let key in styleReset.inner )
              this.sidebarInner.style[key] = styleReset.inner[key];

          if( this.options.resizeSensor && 'undefined' !== typeof ResizeSensor ){
              ResizeSensor.detach(this.sidebarInner, this.handleEvent);
              ResizeSensor.detach(this.container, this.handleEvent);
          }
      }

      /**
       * Determine if the browser supports CSS transform feature.
       * @function
       * @static
       * @param {Boolean} transform3d - Detect transform with translate3d.
       * @return {String}
       */
      static supportTransform(transform3d){
          var result = false,
              property = (transform3d) ? 'perspective' : 'transform',
              upper = property.charAt(0).toUpperCase() + property.slice(1),
              prefixes = ['Webkit', 'Moz', 'O', 'ms'],
              support = document.createElement('support'),
              style = support.style;

          (property + ' ' + prefixes.join(upper + ' ') + upper).split(' ').forEach(function(property, i) {
              if (style[property] !== undefined) {
                  result = property;
                  return false;
              }
          });
          return result;
      }

      /**
       * Trigger custom event.
       * @static
       * @param {DOMObject} element - Target element on the DOM.
       * @param {String} eventName - Event name.
       * @param {Object} data -
       */
      static eventTrigger(element, eventName, data){
          try{
              var event = new CustomEvent(eventName, {detail: data});
          } catch(e){
              var event = document.createEvent('CustomEvent');
              event.initCustomEvent(eventName, true, true, data);
          }
          element.dispatchEvent(event);
      }

      /**
       * Extend options object with defaults.
       * @function
       * @static
       */
      static extend(defaults, options){
          var results = {};
          for( let key in defaults ){
              if( 'undefined' !== typeof options[key] ) results[key] = options[key];
              else results[key] = defaults[key];
          }
          return results;
      }

      /**
       * Get current coordinates left and top of specific element.
       * @static
       */
      static offsetRelative(element){
          var result = {left: 0, top: 0};

          do{
              let offsetTop = element.offsetTop;
              let offsetLeft = element.offsetLeft;

              if( ! isNaN(offsetTop) )
                  result.top += offsetTop;

              if( ! isNaN(offsetLeft) )
                  result.left += offsetLeft;

              element = ( 'BODY' === element.tagName ) ?
                  element.parentElement : element.offsetParent;
          } while(element)
          return result;
      }

      /**
       * Add specific class name to specific element.
       * @static
       * @param {ObjectDOM} element
       * @param {String} className
       */
      static addClass(element, className){
          if( ! StickySidebar.hasClass(element, className) ){
              if (element.classList)
                  element.classList.add(className);
              else
                  element.className += ' ' + className;
          }
      }

      /**
       * Remove specific class name to specific element
       * @static
       * @param {ObjectDOM} element
       * @param {String} className
       */
      static removeClass(element, className){
          if( StickySidebar.hasClass(element, className) ){
              if (element.classList)
                  element.classList.remove(className);
              else
                  element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
          }
      }

      /**
       * Determine weather the element has specific class name.
       * @static
       * @param {ObjectDOM} element
       * @param {String} className
       */
      static hasClass(element, className){
          if (element.classList)
              return element.classList.contains(className);
          else
              return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
      }

      /**
       * Gets default values of configuration options.
       * @static
       * @return {Object}
       */
      static get defaults(){
          return DEFAULTS;
      }
  }

  return StickySidebar;
})();

/**
 * For privacy page to make sidebar sticky and to scroll after clicking on links.
 */
 new StickySidebar('.sidebar');

 var sidebarLinks = document.querySelectorAll('.js-scroll-to'),
   i;
 
 for (i = 0; i < sidebarLinks.length; ++i) {
   sidebarLinks[i].addEventListener('click', function (event) {
     var targetLink = event.target;
     var targetAnchor = document.querySelector('#' + targetLink.dataset.anchor);
 
     event.preventDefault();
 
     for (var j = 0; j < sidebarLinks.length; ++j) {
       sidebarLinks[j].classList.remove('highlighted');
     }
 
     targetLink.classList.add('highlighted');
 
     targetAnchor.scrollIntoView({ behavior: 'smooth' });
   });
 }
 
 if (sidebarLinks.length > 0) {
   var anchor = window.location.hash.substr(1);
 
   if (anchor) {
     var targetAnchor = document.querySelector('#' + anchor);
 
     if (targetAnchor) {
       targetAnchor.scrollIntoView({ behavior: 'smooth' });
     }
   }
 }
 
 var tags = document.querySelectorAll('.js-tags');
 
 for (j = 0; j < tags.length; ++j) {
   tags[j].addEventListener('click', function (event) {
     var targetTag = event.target;
     var targetAnchor = document.getElementById(targetTag.dataset.anchor);
 
     document.getElementById('act-togle-4').checked = true;
     targetAnchor.scrollIntoView({ behavior: 'smooth' });
   })
 }
 
 var checkers = document.querySelectorAll('.act-checker');
 var openAllLink = document.querySelector('.js-open-all');
 var closeAllLink = document.querySelector('.js-close-all');
 
 openAllLink.addEventListener('click', function () {
   openAllLink.classList.add('bs--hidden');
   closeAllLink.classList.add('bs--visible');
 
   for (var i = 0; i < checkers.length; i++) {
     checkers[i].checked = true;
   }
 });
 
 closeAllLink.addEventListener('click', function () {
   closeAllLink.classList.remove('bs--visible');
   openAllLink.classList.remove('bs--hidden');
 
   for (var i = 0; i < checkers.length; i++) {
     checkers[i].checked = false;
   }
 });


// Global
// -------------------------
window.StickySidebar = StickySidebar;

