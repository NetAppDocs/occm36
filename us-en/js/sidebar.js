$(document).ready(function() {
        // Initialize navgoco with default options
        $("#mysidebar").navgoco({
            caretHtml: '',
            accordion: true,
            openClass: 'active', // open
            save: false, // leave false or nav highlighting doesn't work right
            cookie: {
                name: 'navgoco',
                expires: false,
                path: '/'
            },
            slide: {
                duration: 400,
                easing: 'swing'
            }
        });

        $("#collapseAll").click(function(e) {
            e.preventDefault();
            $("#mysidebar").navgoco('toggle', false);
        });

        $("#expandAll").click(function(e) {
            e.preventDefault();
            $("#mysidebar").navgoco('toggle', true);
        });

    });

    $(document).ready(function() {
        $("#tg-sb-link").click(function() {
            $("#tg-sb-sidebar").toggle();
            $("#tg-sb-content").toggleClass('col-md-9');
            $("#tg-sb-content").toggleClass('col-md-12');
            $("#tg-sb-icon").toggleClass('fa-toggle-on');
            $("#tg-sb-icon").toggleClass('fa-toggle-off');
        });
    });
