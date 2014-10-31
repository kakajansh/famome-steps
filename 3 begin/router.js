Router.configure({
    layoutTemplate: 'layout',
    yieldTemplates: {
        'header': { to: 'header' },
        'footer': { to: 'footer' }
    }
});

Router.map(function() {
    this.route('home', { path: '/' });

    this.route('about', { });

    this.route('login', { });

    this.route('profile', { });
});