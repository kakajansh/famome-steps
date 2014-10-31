var Twit = Meteor.npmRequire('twit');

T = new Twit({
    consumer_key: 'rgQLtMtTd8F5ognwgFGtgC2yN',
    consumer_secret: 'oBZ9BaagZNoDE08ptzqkhAJLIiLEow2IaVTDQCfNH9yiVSMKRA',
    access_token: '2796023118-flIqTUDXq3Ujv4AbLchPvyWSYpMT2PPRPQ4FlA3',
    access_token_secret: 'gePzF4AIB4irmnHXW5ajEL7Ni4srIxBtLrNRH0fUj2Zel'
});

Meteor.methods({
    getTweets: function (tag, count) {
        var tag = tag || "meteorjs";
        var count = count || 5;
        var q = "#" + tag + " since:2011-11-11"

        console.log(tag, count, q)

        var tweets = Async.runSync(function(done) {
            T.get('search/tweets', { q: q, count: count }, function(err, data, response) {
                if (err) console.info(err);
                // console.info(data);
                done(null, data);
            });
        });

        return tweets.result;
    }
});