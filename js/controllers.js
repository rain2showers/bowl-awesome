angular.module('bowlawesome.controllers', [])
    .controller('IndexCtrl', function ($scope, $ionicActionSheet, $ionicModal, $location, $routeParams, LeaguesService, authenticationService) {
        $scope.leagues = LeaguesService.all();
        $scope.title = "Leagues";
        $ionicModal.fromTemplateUrl('modal.html', function (modal) {
            $scope.modal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        $scope.rightButtons = [
            {
                type: 'button-clear',
                content: '<i class="icon ion-ios7-plus-outline"></i>',
                tap: function (e) {
                    $scope.modal.show();
                }
            }];

        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.closeNewTask = function () {
            $scope.modal.hide();
        };

        $scope.createNewLeague = function (record) {
            LeaguesService.save(record);
            $scope.leagues = LeaguesService.all();
            record.leagueName = "";
            $scope.modal.hide();
        };

        $scope.doRedirect = function (league) {
            var id = league.id;
            $location.path('/seriesDetails/' + id);
        };

        $scope.doActions = function (leagueIndex, league) {

            // Show the action sheet
            $ionicActionSheet.show({
                buttons: [
             { text: 'Edit' },
                ],
                destructiveText: 'Delete',
                cancelText: 'Cancel',
                cancel: function () {
                },
                buttonClicked: function (index) {
                    console.log('BUTTON CLICKED', index);
                    //$scope.editmodal.show();
                    $location.path('/editLeague/' + league.id);
                    //$scope.editLeague(league);
                    return true;
                },
                destructiveButtonClicked: function () {
                    //var id = league.id;
                    var r = confirm("Are you sure you want to delete ?");
                    if (r == true) {
                        var leagues = angular.fromJson(window.localStorage['leagues']);
                        if (leagues.length != null) {
                            leagues.splice(leagueIndex, 1);
                            window.localStorage['leagues'] = angular.toJson(leagues);
                        }

                    }
                    else {
                        alert("You pressed Cancel!");
                    }
                    $scope.leagues = angular.fromJson(window.localStorage['leagues']);
                    return true;
                }
            });

        };

        $scope.leftButtons = [
           {
               type: 'button-clear',
               content: '<i class="icon ion-navicon"></i>',
               tap: function (e) {
                   $scope.sideMenuController.toggleLeft();
               }
           }];

        $scope.IsUserLoggedIn = authenticationService.isUserLoggedIn();
    })
    .controller('FeedbackCtrl', function ($scope, $location) {
        $scope.showZone = function () {
            $location.path('/ideazone/');
        };
    })
    .controller('EditLeagueCtrl', function ($scope, LeaguesService, $location, $routeParams) {
        $scope.league = LeaguesService.get($routeParams.id);
        $scope.editLeague = function (league) {
            LeaguesService.edit(league);
            $scope.leagues = LeaguesService.all();
            $location.path("/");
        };
    })
    .controller('GameDetailCtrl', function ($scope, $routeParams, GameService, $ionicModal, AvgScoreService, $location, GameNumberService) {
        $scope.selectables = [
        { id: '1', value: 1 },
        { id: '2', value: 2 },
        { id: '3', value: 3 },
        { id: '4', value: 4 },
        { id: '5', value: 5 }
        ];

        // this is the model that's used for the data binding in the select directive
        // the default selected item
        $scope.selectedItem = $scope.selectables[0];

        $scope.games = GameService.get($routeParams.leagueId, $routeParams.seriesId);
        $scope.title = "Games";
        $scope.records = GameNumberService.records();
        $scope.rightButtons = [
            {
                type: 'button-clear',
                content: '<i class="icon ion-ios7-plus-outline"></i>',
                tap: function (e) {
                    $scope.modal.show();
                }
            }];

        $ionicModal.fromTemplateUrl('gameModal.html', function (modal) {
            $scope.modal = modal;
        }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        });

        $scope.createNewGame = function (record, selectedItem) {
            var game;
            if (typeof localStorage['game'] != 'undefined') {
                game = angular.fromJson(window.localStorage['game']);
                ;
                game.push({ id: Math.floor((Math.random() * 1000) + 1), game: selectedItem.value, score: record.gameScore, leagueId: $routeParams.leagueId, seriesId: $routeParams.seriesId });
            } else {
                game = new Array();
                game.push({ id: Math.floor((Math.random() * 1000) + 1), game: selectedItem.value, score: record.gameScore, leagueId: $routeParams.leagueId, seriesId: $routeParams.seriesId });
            }
            window.localStorage['game'] = angular.toJson(game);
            record.gameNumber = "";
            record.gameScore = "";
            $scope.games = GameService.get($routeParams.leagueId, $routeParams.seriesId);
            $scope.modal.hide();
            AvgScoreService.updateLeagueAvg($routeParams.leagueId);
            AvgScoreService.updateSeriesAvg($routeParams.seriesId);
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.doRedirect = function (seriesObj) {
            $location.path('/test');

        };

        $scope.leftButtons = [
            {
                type: 'button-clear',
                content: '<i class="icon ion-navicon"></i>',
                tap: function (e) {
                    $scope.sideMenuController.toggleLeft();
                }
            }];

    })
    .controller('EditSeriesCtrl', function ($scope, $ionicActionSheet, $routeParams, SeriesService, $ionicModal, $location) {
        $scope.series = SeriesService.getBySeries($routeParams.id);
        $scope.editSeries = function (series) {
            SeriesService.edit(series);
            $location.path("/seriesDetails/" + series.leagueId);
        };
    })
    .controller('SeriesDetailsCtrl', function ($scope, $ionicActionSheet, $routeParams, SeriesService, $ionicModal, $location) {
        $scope.serieses = SeriesService.get($routeParams.id);
        $scope.leagueId = $routeParams.id;
        $scope.title = "League Summary";
        $scope.record = {
            seriesName: new XDate().toString("MMM d, yyyy")
        };

        $ionicModal.fromTemplateUrl('seriesModal.html', function (modal) {
            $scope.modal = modal;
        }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        });

        $scope.rightButtons = [
            {
                type: 'button-clear',
                content: '<i class="icon ion-ios7-plus-outline"></i>',
                tap: function (e) {
                    $scope.modal.show();
                    //alert('Hello Series details controller');
                }
            }];

        $scope.createNewSeries = function (record) {
            var series;
            if (typeof localStorage['series'] != 'undefined') {
                series = angular.fromJson(window.localStorage['series']);

                series.push({ id: Math.floor((Math.random() * 1000) + 1), name: record.seriesName, avgScore: 0, leagueId: $scope.leagueId });
            } else {
                series = new Array();
                series.push({ id: Math.floor((Math.random() * 1000) + 1), name: record.seriesName, avgScore: 0, leagueId: $scope.leagueId });
            }
            window.localStorage['series'] = angular.toJson(series);
            record.seriesName = new XDate().toString("MMM d, yyyy");
            $scope.series = angular.fromJson(window.localStorage['series']);
            $scope.serieses = SeriesService.get($routeParams.id);
            $scope.modal.hide();
        };

        $scope.closeNewTask = function () {
            $scope.modal.hide();
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.doRedirect = function (seriesObj) {
            $location.path('/league/' + seriesObj.leagueId + '/series/' + seriesObj.id + '/gameDetails/');

        };

        $scope.leftButtons = [
           {
               type: 'button-clear',
               content: '<i class="icon ion-navicon"></i>',
               tap: function (e) {
                   $scope.sideMenuController.toggleLeft();
               }
           }];

        $scope.doActions = function (seriesIndex, seriesObj) {

            // Show the action sheet
            $ionicActionSheet.show({
                buttons: [
             { text: 'Edit' }
                ],
                destructiveText: 'Delete',
                cancelText: 'Cancel',
                cancel: function () {
                },
                buttonClicked: function (index) {
                    console.log('BUTTON CLICKED', index);
                    $location.path('/editSeries/' + seriesObj.id);
                    //$scope.editLeague(seriesObj);
                    return true;
                },
                destructiveButtonClicked: function () {
                    var r = confirm("Are you sure you want to delete ?");
                    if (r == true) {
                        var series = angular.fromJson(window.localStorage['series']);
                        var removalIndex = -1;
                        for (var i = 0; i < series.length; i += 1) {
                            if (series[i].id === seriesObj.id) {
                                removalIndex = i;
                                break;
                            }
                        }
                        if (removalIndex !== -1) {
                            console.log("removing the element from the array, index: ", removalIndex);
                            series.splice(removalIndex, 1);
                        }
                        window.localStorage['series'] = angular.toJson(series);

                    }
                    else {
                        alert("You pressed Cancel!");
                    }
                    $scope.serieses = SeriesService.get($routeParams.id);
                    return true;
                }
            });
        };
    })
    .controller('ModalCtrl', function ($scope, Modal) {

        // Load the modal from the given template URL
        Modal.fromTemplateUrl('modal.html', function (modal) {
            $scope.modal = modal;
        }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        });

        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
    })
    .controller('footerCtrl', function ($scope, $location, constants, authenticationService) {
        $scope.login = function () {
            $location.path('/login');
        };

        $scope.IsUserLoggedIn = authenticationService.isUserLoggedIn();

        $scope.showSettings = function () {
            $location.path("/settings");
        };

        $scope.showNotifications = function () {
            $location.path("/notifications");
        };

        $scope.showFriends = function () {
            $location.path("/friends");
        };
    })
    .controller('LoginCtrl', function ($scope, $location, constants, $http, $ionicLoading, authenticationService) {
        $scope.doLogin = function (userObj) {
            $scope.loading = $ionicLoading.show({

                // The text to display in the loading indicator
                content: 'Loading',

                // The animation to use
                animation: 'fade-in',

                // Will a dark overlay or backdrop cover the entire view
                showBackdrop: true,

                // The maximum width of the loading indicator
                // Text will be wrapped if longer than maxWidth
                maxWidth: 200,

                // The delay in showing the indicator
                showDelay: 500
            });
            authenticationService.login(userObj).then(function (data) {
                $scope.loading.hide();
                $location.path("/");
                $scope.currentUser = data;
            });

        };
    })
    .controller('TestCtrl', function ($scope, $ionicActionSheet, $location, constants, $http) {
        $scope.show = function () {

            // Show the action sheet
            $ionicActionSheet.show({

                // The various non-destructive button choices
                buttons: [
                  { text: 'Share' },
                  { text: 'Move' },
                ],

                // The text of the red destructive button
                destructiveText: 'Delete',

                // The title text at the top
                titleText: 'Modify your album',

                // The text of the cancel button
                cancelText: 'Cancel',

                // Called when the sheet is cancelled, either from triggering the
                // cancel button, or tapping the backdrop, or using escape on the keyboard
                cancel: function () {
                },

                // Called when one of the non-destructive buttons is clicked, with
                // the index of the button that was clicked. Return
                // "true" to tell the action sheet to close. Return false to not close.
                buttonClicked: function (index) {
                    return true;
                },

                // Called when the destructive button is clicked. Return true to close the
                // action sheet. False to keep it open
                destructiveButtonClicked: function () {
                    return true;
                }
            });

        };

        $scope.send = function (parameters) {
        };
    })
    .controller('SettingsCtrl', function ($scope, $location, constants, $http, authenticationService) {
        $scope.Logout = function () {
            authenticationService.logOut().then(function () {
                localStorage["user.isLogged"] = 'false';
                localStorage["authToken"] = '';
                $location.path('/');
            });
        };

        $scope.LovethisApp = function () {
            var ref = window.open('https://play.google.com/store/apps/details?id=com.ionic.bowlAwesome', '_blank', 'location=yes');
        };

        $scope.title = "Settings";
        $scope.leftButtons = [
              {
                  type: 'button-clear',
                  content: '<i class="icon ion-navicon"></i>',
                  tap: function (e) {
                      $scope.sideMenuController.toggleLeft();
                  }
              }];
    })
    .controller('NotificationsCtrl', function ($scope, $location, constants, $http) {
        $scope.title = "Notifications";
        $scope.leftButtons = [
              {
                  type: 'button-clear',
                  content: '<i class="icon ion-navicon"></i>',
                  tap: function (e) {
                      $scope.sideMenuController.toggleLeft();
                  }
              }];

        $scope.rightButtons = [
            {
                type: 'button-clear',
                content: '<i class="icon ion-ios7-people-outline"></i>',
                tap: function (e) {
                    $scope.modal.show();
                }
            }];
    })
    .controller('FriendsCtrl', function ($scope, $location, constants, $http, $ionicLoading) {
        $scope.title = "Friends";

        $scope.loading = $ionicLoading.show({

            // The text to display in the loading indicator
            content: 'Loading',

            // The animation to use
            animation: 'fade-in',

            // Will a dark overlay or backdrop cover the entire view
            showBackdrop: true,

            // The maximum width of the loading indicator
            // Text will be wrapped if longer than maxWidth
            maxWidth: 200,

            // The delay in showing the indicator
            showDelay: 500
        });

        $scope.contacts = [];
        var options = new ContactFindOptions();
        options.filter = "";
        //options.filter = $scope.searchTxt;
        options.multiple = true;
        var fields = ["displayName", "emails", "photos"];
        navigator.contacts.find(fields, function (contacts) {
            $scope.contacts = contacts;
            $scope.$apply();
            $scope.loading.hide();
        }, function (e) {
            console.log("Error finding contacts " + e.code);
            $scope.loading.hide();
        }, options);

        $scope.leftButtons = [
              {
                  type: 'button-clear',
                  content: '<i class="icon ion-navicon"></i>',
                  tap: function (e) {
                      $scope.sideMenuController.toggleLeft();
                  }
              }];

        $scope.rightButtons = [
            {
                type: 'button-clear',
                content: '<i class="icon ion-ios7-people-outline"></i>',
                tap: function (e) {
                    $scope.modal.show();
                }
            }];

        $scope.doActions = function (index, contact) {
            var Mandrill = require('mandrill');
            Mandrill.initialize('T0XmpSEZVE15vGki596G5w');
            Mandrill.sendEmail({
                message: {
                    text: "Hello World!",
                    subject: "Using Cloud Code and Mandrill is great!",
                    from_email: "vkathuluri@gmail.com",
                    from_name: "Cloud Code",
                    to: [
                      {
                          email: contact.emails[0].value,
                          name: contact.displayName
                      }
                    ]
                },
                async: true
            }, {
                success: function (httpResponse) {
                    alert("Email was sent");
                    console.log(httpResponse);
                    response.success("Email sent!");
                },
                error: function (httpResponse) {
                    alert("Email was sent failed");
                    console.error(httpResponse);
                    response.error("Uh oh, something went wrong");
                }
            });
            //alert(contact.displayName);
            //alert(contact.emails[0].value);
        };

    })
    .controller('leftNavCtrl', function ($scope, $location) {
        $scope.items = [{
            id: 1,
            title: 'Leagues'
        }, {
            id: 2,
            title: 'Share'
        }, {
            id: 3,
            title: 'Feedback'
        }];
        $scope.selectNavItem = function (item, $index) {
            if ($index == 0) {
                $location.path("/");
                $scope.sideMenuController.close();
            }
            else if ($index == 2) {
                $location.path("/feedback");
                $scope.sideMenuController.close();
            }

            else {
                $location.path("/friends");
                $scope.sideMenuController.close();
            }
        };
    })
    .controller('RegisterCtrl', function ($scope) {
        $scope.doLogin = function (userObj) {
            // Show the loading overlay and text
            $scope.loading = $ionicLoading.show({

                // The text to display in the loading indicator
                content: 'Loading',

                // The animation to use
                animation: 'fade-in',

                // Will a dark overlay or backdrop cover the entire view
                showBackdrop: true,

                // The maximum width of the loading indicator
                // Text will be wrapped if longer than maxWidth
                maxWidth: 200,

                // The delay in showing the indicator
                showDelay: 500
            });

            var user = new Parse.User();
            //user.set("email", form.email);
            user.set("username", userObj.username);
            user.set("password", userObj.password);
            user.signUp(null, {
                success: function (user) {
                    $scope.currentUser = user;
                    $scope.$apply(); // Notify AngularJS to sync currentUser
                    $scope.loading.hide();
                    if (user) {
                        //localStorage["user.isLogged"] = 'true';
                        //user.isLogged = true;
                        //user.username = data.username;
                        //localStorage["authToken"] = data.token;
                        $location.path("/");
                    } else {
                        $scope.loading.hide();
                        user.isLogged = false;
                        user.username = '';
                        $scope.errorMessage = '<div class="form-group" style="margin-top: 6px;"><div class="alert alert-danger">' + data.errors + '</div></div>';
                    }
                },
                error: function (user, error) {
                    alert("Unable to sign up:  " + error.code + " " + error.message);
                    $scope.loading.hide();
                    user.isLogged = false;
                    user.username = '';
                    $('.js-loading-bar').modal('hide');
                    $scope.errorMessage = '<div class="form-group" style="margin-top: 6px;"><div class="alert alert-danger">' + data.errors + '</div></div>';
                }
            });
        };
    })