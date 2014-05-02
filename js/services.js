angular.module('bowlawesome.services', [])

/**
 * A simple example service that returns some data.
 */
    .factory('LeaguesService', function () {
        var leagues = angular.fromJson(localStorage['leagues']);

        return {
            all: function () {
                leagues = angular.fromJson(localStorage['leagues']);
                return leagues;
            },
            get: function (leagueId) {
                // Simple index lookup
                leagues = angular.fromJson(localStorage['leagues']);
                var leagueByLeagueId = {};
                if (typeof leagues != 'undefined') {
                    for (var i = 0, l = leagues.length; i < l; i++) {
                        if (leagues[i].id == leagueId) {
                            leagueByLeagueId = leagues[i];
                        }
                    }
                }
                return leagueByLeagueId;
            },
            edit: function (league) {
                leagues = angular.fromJson(localStorage['leagues']);
                if (typeof leagues != 'undefined') {
                    for (var i = 0, l = leagues.length; i < l; i++) {
                        if (leagues[i].id == league.id) {
                            leagues[i].name = league.name;
                        }
                    }
                }
                window.localStorage['leagues'] = angular.toJson(leagues);
                return leagues;
            },
            save: function (record) {
                var leaguesRecord;
                if (typeof localStorage["leagues"] != 'undefined') {
                    leaguesRecord = angular.fromJson(window.localStorage['leagues']);
                    leaguesRecord.push({ id: Math.floor((Math.random() * 1000) + 1), name: record.leagueName, avgScore: 0 });
                } else {
                    leaguesRecord = new Array();
                    leaguesRecord.push({ id: Math.floor((Math.random() * 1000) + 1), name: record.leagueName, avgScore: 0 });
                }
                window.localStorage['leagues'] = angular.toJson(leaguesRecord);
            }
        };
    })
    .factory('SeriesService', function () {
        var serieses = angular.fromJson(localStorage['series']);

        return {
            all: function () {
                return serieses;
            },
            get: function (leagueId) {
                // Simple index lookup
                serieses = angular.fromJson(localStorage['series']);
                var seriesesByLeague = [];
                if (typeof serieses != 'undefined') {
                    for (var i = 0, l = serieses.length; i < l; i++) {
                        if (serieses[i].leagueId == leagueId) {
                            seriesesByLeague.push(serieses[i]);
                        }
                    }
                }
                return seriesesByLeague;
            },
            getBySeries: function (seriesId) {
                serieses = angular.fromJson(localStorage['series']);
                var seriesesBySeries = {};
                if (typeof serieses != 'undefined') {
                    for (var i = 0, l = serieses.length; i < l; i++) {
                        if (serieses[i].id == seriesId) {
                            seriesesBySeries = serieses[i];
                        }
                    }
                }
                return seriesesBySeries;
            },
            edit: function (series) {
                serieses = angular.fromJson(localStorage['series']);
                if (typeof serieses != 'undefined') {
                    for (var i = 0, l = serieses.length; i < l; i++) {
                        if (serieses[i].id == series.id) {
                            serieses[i].name = series.name;
                        }
                    }
                }
                window.localStorage['series'] = angular.toJson(serieses);
                return serieses;
            },
        };
    })
    .factory('GameService', function () {
        var games = angular.fromJson(localStorage['game']);

        return {
            all: function () {
                return serieses;
            },
            get: function (leagueId, seriesId) {
                // Simple index lookup
                games = angular.fromJson(localStorage['game']);
                var gamesBySeries = [];
                if (typeof games != 'undefined') {
                    for (var i = 0, l = games.length; i < l; i++) {
                        if (games[i].leagueId == leagueId && games[i].seriesId == seriesId) {
                            gamesBySeries.push(games[i]);
                        }
                    }
                }
                return gamesBySeries;
            }
        };
    })
    .factory('AvgScoreService', function () {
        var games = new Array();
        var leagues = new Array();
        var series = new Array();
        return {
            all: function () {
                return serieses;
            },
            leagueAvg: function (leagueId) {
                var leagueAvg = 0;
                games = angular.fromJson(localStorage['game']);
                if (typeof games != 'undefined') {
                    for (var i = 0, l = games.length; i < l; i++) {
                        if (games[i].leagueId == leagueId) {
                            leagueAvg += games[i].score;
                        }
                    }
                }
                return leagueAvg;
            },
            seriesAvg: function () {
                return null;
            },
            updateLeagueAvg: function (leagueId) {
                var leagueAvg = 0;
                var gameCount = 0;
                games = angular.fromJson(localStorage['game']);
                leagues = angular.fromJson(window.localStorage['leagues']);
                if (typeof games != 'undefined') {
                    for (var i = 0, l = games.length; i < l; i++) {
                        if (games[i].leagueId == leagueId) {
                            leagueAvg += games[i].score;
                            gameCount++;
                        }
                    }
                }
                if (typeof leagues != 'undefined') {
                    for (var j = 0; j < leagues.length; j++) {
                        if (leagues[j].id == leagueId) {
                            leagues[j].avgScore = Math.floor((leagueAvg / gameCount) * 100) / 100;
                            break;
                        }
                    }
                    window.localStorage['leagues'] = angular.toJson(leagues);
                }

            },
            updateSeriesAvg: function (seriesId) {
                var seriesAvg = 0;
                var gameCount = 0;
                games = angular.fromJson(localStorage['game']);
                series = angular.fromJson(window.localStorage['series']);
                if (typeof games != 'undefined') {
                    for (var i = 0, l = games.length; i < l; i++) {
                        if (games[i].seriesId == seriesId) {
                            seriesAvg += games[i].score;
                            gameCount++;
                        }
                    }
                }
                if (typeof series != 'undefined') {
                    for (var j = 0; j < series.length; j++) {
                        if (series[j].id == seriesId) {
                            series[j].avgScore = Math.floor((seriesAvg / gameCount) * 100) / 100;
                            break;
                        }
                    }
                    window.localStorage['series'] = angular.toJson(series);
                }


            }
        };
    })
    .factory('GameNumberService', function () {
        var gameNumber = [
    { id: 1, title: 1 },
    { id: 2, title: 2 },
    { id: 3, title: 3 },
    { id: 4, title: 4 }
        ];
        return {
            records: function () {
                return gameNumber;

            }
        };
    })
    .factory('authenticationService', function (constants, $q) {
        Parse.initialize("NR9QRuzsk74hLarz3r8TvtWClf2FfSvSjoyWlxM4", "ZNcrOMYsqKYQQ5zDaMicZpD2vUt9FKV9LkKq9Zww");
        return {
            login: function (userObj) {
                var defered = $q.defer();
                var username = userObj.username;
                var password = userObj.password;
                Parse.User.logIn(username, password, {
                    success: function (user) {
                        defered.resolve(user);
                        localStorage["user.isLogged"] = 'true';
                        user.isLogged = true;
                        constants.isLogged = 'true';
                    },
                    error: function (user, error) {
                        defered.reject(error);
                        alert("Unable to sign up:  " + error.code + " " + error.message);
                        user.userLoggedIn = false;
                        user.username = '';
                        localStorage["user.isLogged"] = 'false';
                        constants.isLogged = 'false';
                    }
                });
                return defered.promise;
            },
            register: function () {
            },
            resetPassword: function () {
            },
            isUserLoggedIn: function () {
                return localStorage["user.isLogged"];
            },
            logOut: function () {
                var defered = $q.defer();
                localStorage["user.isLogged"] = 'false';
                Parse.User.logOut();
                defered.resolve(true);
                return defered.promise;
            }
        };
    })
    // phonegap ready service - listens to deviceready
    .factory('phonegapReady', function () {
        return function (fn) {
            var queue = [];
            var impl = function () {
                queue.push(Array.prototype.slice.call(arguments));
            };

            document.addEventListener('deviceready', function () {
                queue.forEach(function (args) {
                    fn.apply(this, args);
                });
                impl = fn;
            }, false);

            return function () {
                return impl.apply(this, arguments);
            };
        };
    })
    .factory('contacts', function ($rootScope, phonegapReady) {
        return {
            findContacts: phonegapReady(function (onSuccess, onError) {
                var options = new ContactFindOptions();
                options.filter = "";
                options.multiple = true;
                var fields = ["displayName", "name"];
                navigator.contacts.find(fields, function (r) {
                    console.log("Success" + r.length);
                    var that = this,
                        args = arguments;
                    if (onSuccess) {
                        $rootScope.$apply(function () {
                            onSuccess.apply(that, args);
                        });
                    }
                }, function () {
                    var that = this,
                        args = arguments;

                    if (onError) {
                        $rootScope.$apply(function () {
                            onError.apply(that, args);
                        });
                    }
                }, options);
            })
        };
    })
    .factory('cordovaReady', function () {
        return function (fn) {

            var queue = [];

            var impl = function () {
                queue.push(Array.prototype.slice.call(arguments));
            };

            document.addEventListener('deviceready', function () {
                queue.forEach(function (args) {
                    fn.apply(this, args);
                });
                impl = fn;
            }, false);

            return function () {
                return impl.apply(this, arguments);
            };
        };
    })
    .factory('geolocation', function ($rootScope, cordovaReady) {
        return {
            getCurrentPosition: cordovaReady(function (onSuccess, onError, options) {
                alert("in geo location");
                navigator.geolocation.getCurrentPosition(function () {
                    var that = this,
                      args = arguments;

                    if (onSuccess) {
                        $rootScope.$apply(function () {
                            onSuccess.apply(that, args);
                        });
                    }
                }, function () {
                    var that = this,
                      args = arguments;

                    if (onError) {
                        $rootScope.$apply(function () {
                            onError.apply(that, args);
                        });
                    }
                },
                options);
            })
        };
    })
