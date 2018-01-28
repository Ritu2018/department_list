function ontouch(el, callback){

    var touchsurface = el,
        dir,
        swipeType,
        startX,
        startY,
        distX,
        distY,
        threshold = 80, //required min distance traveled to be considered swipe
        restraint = 100, // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 500, // maximum time allowed to travel that distance
        elapsedTime,
        startTime,
        handletouch = callback || function(evt, dir, phase, swipetype, distance){};

    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0];
        dir = 'none';
        swipeType = 'none';
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime(); // record time when finger first makes contact with surface
        handletouch(e, 'none', 'start', swipeType, 0); // fire callback function with params dir="none", phase="start", swipetype="none" etc
        e.preventDefault()
    }, false);


    touchsurface.addEventListener('touchmove', function(e){
        var touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
        if (Math.abs(distX) > Math.abs(distY)){ // if distance traveled horizontally is greater than vertically, consider this a horizontal movement
            dir = (distX < 0)? 'left' : 'right';
            handletouch(e, dir, 'move', swipeType, distX) // fire callback function with params dir="left|right", phase="move", swipetype="none" etc
        }
        else{ // else consider this a vertical movement
            dir = (distY < 0)? 'up' : 'down';
            handletouch(e, dir, 'move', swipeType, distY) // fire callback function with params dir="up|down", phase="move", swipetype="none" etc
        }
        e.preventDefault() // prevent scrolling when inside DIV
    }, false);

    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0];
        elapsedTime = new Date().getTime() - startTime; // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                swipeType = dir // set swipeType to either "left" or "right"
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipeType = dir // set swipeType to either "top" or "down"
            }
        }
        // Fire callback function with params dir="left|right|up|down", phase="end", swipetype=dir etc:
        handletouch(e, dir, 'end', swipeType, (dir ==='left' || dir ==='right')? distX : distY);
        e.preventDefault()
    }, false)
}

 function pagenation () {
    var count = document.getElementsByClassName('swiper-slide').length;
    var e = document.getElementsByClassName('pagenation')[0];
    for(i=0;i<count;i++) {
        $('<div class="' + (i) +' page'+'">'+(i+1)+ '</div>').appendTo(e);
    }
    $(".page").first().addClass(" active")
}

window.addEventListener('load', function(){
    var el = document.getElementById('swiper-container'); // reference gallery's main DIV container
    var gallerywidth = el.offsetWidth;
    var warpper = el.getElementsByClassName('swiper-wrapper')[0];
    var count = warpper.getElementsByClassName('swiper-slide').length, curindex = 0, ulLeft = 0;
    var slides = document.getElementsByClassName("swiper-slide")
    warpper.style.width = gallerywidth * count + 'px'; // set width of gallery to parent container's width * total images
    pagenation();



    // Temp ------ For providing background colors only
    function color() {
        random_color="#";
        var letters = 'BCDEF'.split('');
        for (var i = 0; i < 6; i++ ) {
            random_color += letters[Math.floor(Math.random() * 5)];
        }
        return random_color
    }
    console.log($(slides[0])[0].style.backgroundColor = color());
    console.log($(slides[1])[0].style.backgroundColor = color());
    console.log($(slides[2])[0].style.backgroundColor = color());
    console.log($(slides[3])[0].style.backgroundColor = color());
    console.log($(slides[4])[0].style.backgroundColor = color());
    console.log($(slides[5])[0].style.backgroundColor = color());

    //------------

    ontouch(el, function(evt, dir, phase, swipetype, distance){
        if (phase === 'start'){ // on touchstart
            ulLeft = parseInt(warpper.style.left) || 0 // initialize ulLeft var with left position of UL
        }
        else if (phase === 'end'){ // on touchend
            if (swipetype === 'left' || swipetype === 'right'){ // if a successful left or right swipe is made
                curindex = (swipetype === 'left')? Math.min(curindex+1, count-1) : Math.max(curindex-1, 0) // get new index of image to show
            }
            warpper.style.left = -curindex * gallerywidth + 'px'; // move UL to show the new image
            cur_page(document.getElementsByClassName(curindex)[0]);
            console.log(curindex);
        }
    });// end ontouch

    $(".page").click(function (e) {
        // $(this)[0].parent.children.removeClass(" .active");
        var i = this.classList[0];
        curindex = i;
         warpper.style.left = -i * gallerywidth + 'px';// move UL to show the new image
        cur_page(this);
    });

    function cur_page(elem) {
        $(".page.active").removeClass(" active");
        $(elem).addClass(" active");
    }
}, false);

