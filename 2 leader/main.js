// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Mongo.Collection("players");

if (Meteor.isClient) {

  Meteor.startup(function () {
      famous.polyfills;
      famous.core.famous;

      Logger.setLevel("famous-views", "debug");
   
      Transform = famous.core.Transform;
  });

  Template.home.helpers({
    players: function () {
      return Players.find({}, { sort: { score: -1, name: 1 } });
    },
  });

  Template.leaderboard.helpers({
    selectedName: function () {
      var player = Players.findOne(Session.get("selectedPlayer"));
      return player && player.name;
    }
  });

  Template.leaderboard.events({
    'click .inc': function () {
      Players.update(Session.get("selectedPlayer"), {$inc: {score: 5}});
    }
  });

  Template.player.helpers({
    selected: function () {
      return Session.equals("selectedPlayer", this._id) ? "selected" : '';
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selectedPlayer", this._id);
    }
  });

  var queue = [];

  Template.player.rendered = function() {
    var modifier = FView.from(this).modifier;

    modifier.setTransform(Transform.translate(0,window.innerHeight));

    queue.push(function() {
      modifier.setTransform(
        Transform.translate(0,0), { duration : 1000, curve: 'easeInOut' }
      );
    });
  }

  Meteor.setInterval(function() {
    if (queue.length) queue.shift()();
  }, 100);
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace", "Grace Hopper", "Marie Curie",
                   "Carl Friedrich Gauss", "Nikola Tesla", "Claude Shannon"];
      _.each(names, function (name) {
        Players.insert({
          name: name,
          score: Math.floor(Random.fraction() * 10) * 5
        });
      });
    }
  });
}
