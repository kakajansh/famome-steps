Router.map(function() {
    this.route('home', { 
        path: '/',
        onAfterAction: function() {
            Session.set("pageTitle", "Home page");
        },
    });

    this.route('about', {
        path: '/about',
        onAfterAction: function() {
            Session.set("pageTitle", "About page");
        },
    });

    this.route('login', {
        path: '/login',
        onAfterAction: function() {
            Session.set("pageTitle", "Login page");
        }
    });

    this.route('profile', {
        path: '/profile',
        onAfterAction: function() {
            Session.set("pageTitle", "Profile page");
        }
    })
});