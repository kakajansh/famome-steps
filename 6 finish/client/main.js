
/// ‫*** Bismillahi Rahmani Rahim *** ///

// DEFAULTS //
Session.setDefault('pageTitle', 'Home Page');

// COLLECTION //
Tweets = new Meteor.Collection( null );

// ROUTER //
navbar = null;

Template.footer.rendered = function() {
    this.autorun(function() {
        navbar = $('.tabs');
        navbarActive(Router.current().options.route.path());
    });
}

var navbarActive = function(path) {
    if (!navbar) return;
    if (this.path) path = this.path;

    navbar.find('a.active').removeClass('active');
    navbar.find('a[href="'+path+'"]').addClass('active');
}
  
Router.configure({
    onAfterAction: navbarActive,
    layoutTemplate: 'layout',
    yieldTemplates: {
        'header': { to: 'header' },
        'footer': { to: 'footer' }
    }
})


//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
 
Meteor.startup(function () {
    StateModifier = famous.modifiers.StateModifier;
    Surface = famous.core.Surface;
    Transform = famous.core.Transform;
    Easing = famous.transitions.Easing;

    Meteor.call("getTweets", function(error, result) {
        _.each(result.statuses, function(tweet) {
            Tweets.insert({ tweet: tweet.text });
            console.log("inserted " + tweet.text)
        });
    });
});


Template.header.helpers({
    pageTitle: function() {
        return Session.get("pageTitle");
    }
})

Template.header.rendered = function() {
    var fview = FView.from(this).view;

    var titleModifier = new StateModifier();

    var titleSurface  = new Surface({
        content: Session.get("pageTitle"),
        properties: {
            fontSize: '24px',
            textAlign: 'center',
            color: '#fff',
            lineHeight: '44px',
            zIndex: 10
        }
    });


    fview.header.add(titleModifier).add(titleSurface)

    this.autorun(function() {
        titleSurface.setContent(Session.get("pageTitle"))

        titleModifier.setTransform(
            Transform.translate(0, -100, 0),
            { duration : 300, curve: Easing.outExpo }
        );
        titleModifier.setTransform(
            Transform.translate(0, 0, 0),
            { duration : 300, curve: Easing.outExpo }
        );
    })
}

Template.layout.helpers({
    inO: function() {
        return {curve: Easing.inOutBack, duration: 500}
    },
    outO: function() {
        return {duration: 300}
    }
});

Template.home.helpers({
    tweets: function() {
        tweets = Tweets.find();
        if (tweets.count() > 0) {
            return tweets;
        } else { 
            return false; 
        }
    }
});

var queue = [];
Meteor.setInterval(function () {
    if (queue.length) queue.shift()();
}, 100);

Template.tweet.rendered = function() {
    var tweet = FView.from(this);

    tweet.modifier.setTransform(Transform.translate(window.innerWidth,0));

    queue.push(function() {
        tweet.modifier.setTransform(Transform.translate(0,0),{
            duration: 500, curve: 'easeOut'
        });
    });
}


Template.input.rendered = function() {
    fview = FView.from(this);
    fview.surface.setProperties({"z-index": 10});
}

Template.input.events({
    'click button#search': function(e, tmpl) {
        var tag = $("#tag").val();

        FView.byId("tweets").preventDestroy();

        _.each(_.last(FView.byId('tweets').children).children, function(tweet) {
            tweet = tweet.blazeView.fview.children[0];

            queue.push(function() {
                tweet.modifier.setTransform(Transform.translate(-window.innerWidth,0),{
                    duration: 300, curve: 'easeOut'
                }, function() {
                    tweet.destroy();
                });
            });
        });
        
        Meteor.call("getTweets", tag, 5, function(error, result) {
            Tweets.remove({ });
            _.each(result.statuses, function(tweet) {
                Tweets.insert({ tweet: tweet.text });
            });
        });
    }
});


// 4
// [Log] Exception from Tracker afterFlush function: Can't find variable: StateModifier (meteor.js, line 883)
// [Log] Exception from Tracker afterFlush function: Can't find variable: Surface (meteor.js, line 883)

// 5
// meteor add accounts-twitter
// meteor add accounts-ui
// meteor add meteorhacks-npm

// http://iag.me/socialmedia/how-to-create-a-twitter-app-in-8-easy-steps/
// https://github.com/ttezel/twit