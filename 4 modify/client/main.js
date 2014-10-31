
/// ‫*** Bismillahi Rahmani Rahim *** ///

// DEFAULTS //
Session.setDefault('pageTitle', 'Home Page');

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


// [Log] Exception from Tracker afterFlush function: Can't find variable: StateModifier (meteor.js, line 883)
// [Log] Exception from Tracker afterFlush function: Can't find variable: Surface (meteor.js, line 883)
