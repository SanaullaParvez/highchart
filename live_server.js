"use strict";
var app = angular.module("idlcApp", [
    "ngSanitize",
    "ui.router",
    "ui.bootstrap",
    "ui-leaflet",
    "google.places",
    "oitozero.ngSweetAlert",
    "angular-owl-carousel",
    "ngAnimate",
    "highcharts-ng",
    "ngMeta",
]);
app.run([
    "$rootScope",
    "$location",
    "$state",
    function (a, b, c) {
        a.$on("$stateChangeSuccess", function () {
            (document.body.scrollTop = document.documentElement.scrollTop = 0),
                (a.navToggle = !1);
        });
    },
]),
    app
        .config([
            "$stateProvider",
            "$urlRouterProvider",
            "$httpProvider",
            "$locationProvider",
            "ngMetaProvider",
            function (a, b, c, d, e) {
                var f = function (a, b, c, d, e) {
                        return {
                            name: a,
                            url: b,
                            templateUrl: "views/" + c,
                            controller: d || "generalCtrl",
                        };
                    },
                    g = function (a, b, c, d) {
                        return { name: a, url: b, abstract: !0, templateUrl: "views/" + c };
                    };
                a
                    .state(f("home", "/home", "home.html"))
                    .state(f("whoWeAre", "/who-we-are", "whoWeAre.html"))
                    .state(
                        f(
                            "whoWeAreAll",
                            "/who-we-are-leadership?cat&id",
                            "whoWeAreAll.html"
                        )
                    )
                    .state(f("research", "/research", "research.html"))
                    .state(f("download", "/download", "download.html"))
                    .state(f("marketWatch", "/market-watch", "marketWatch.html"))
                    .state(
                        f(
                            "whyInvestInBangladesh",
                            "/invest-in-bangladesh",
                            "whyInvestInBangladesh.html"
                        )
                    )
                    .state(
                        f("contactUs", "/contact-us", "contactUs.html", "storeLocatorCtrl")
                    )
                    .state(g("whatWeOffer", "/what-we-offer", "whatWeOffer/index.html"))
                    .state(
                        f(
                            "whatWeOffer.list",
                            "/list",
                            "whatWeOffer/list.html",
                            "whatWeOfferCtrl"
                        )
                    )
                    .state(
                        f(
                            "whatWeOffer.single",
                            "/:id",
                            "whatWeOffer/single.html",
                            "whatWeOfferSingleCtrl"
                        )
                    )
                    .state(
                        g("knowledgeBase", "/knowledge-base", "knowledgeBase/index.html")
                    )
                    .state(
                        f(
                            "knowledgeBase.list",
                            "/list",
                            "knowledgeBase/list.html",
                            "knowledgeBaseCtrl"
                        )
                    )
                    .state(
                        f(
                            "knowledgeBase.single",
                            "/:id",
                            "knowledgeBase/single.html",
                            "knowledgeBaseSingleCtrl"
                        )
                    )
                    .state("boAccount", {
                        url: "/bo-account",
                        templateUrl: "views/boAccount.html",
                        controller: "boAccountCtrl",
                        params: { shortBo: {}, hiddenParam: "YES" },
                    })
                    .state("search", {
                        url: "/search?query",
                        templateUrl: "views/search.html",
                        controller: "searchController",
                    }),
                    b.otherwise("/home"),
                    d.html5Mode(!0);
            },
        ])
        .run([
            "ngMeta",
            function (a) {
                a.init();
            },
        ]),
    app.factory("GetData", [
        "$http",
        function (a) {
            var b = {
                async: function (b) {
                    var c = a.get(b).then(
                        function (a) {
                            return console.log(a), a.data;
                        },
                        function (a) {
                            return [];
                        }
                    );
                    return c;
                },
            };
            return b;
        },
    ]),
    app.factory("call", [
        "$http",
        "config",
        function (a, b) {
            function c(c, d, e) {
                a({
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: b.apiUrl + d,
                    data: c,
                }).then(
                    function (a) {
                        e(a);
                    },
                    function (a) {
                        console.log("error", a);
                    }
                );
            }
            return { postOrder: c };
        },
    ]),
    app.filter("trusted", [
        "$sce",
        function (a) {
            return function (b) {
                return a.trustAsResourceUrl(b);
            };
        },
    ]),
    app.filter("removeHTMLTags", function () {
        return (
            console.log("Remove html filter"),
                function (a) {
                    return a
                        ? String(a)
                            .replace(/\s/g, "")
                            .replace(/<[^>]+>/gm, "")
                        : "";
                }
        );
    }),
    app.directive("iframeOnload", [
        function () {
            return {
                scope: { callBack: "&iframeOnload" },
                link: function (a, b, c) {
                    b.on("load", function () {
                        return a.callBack();
                    });
                },
            };
        },
    ]),
    app.controller("ModalInstanceCtrl", [
        "$uibModalInstance",
        "$scope",
        "file",
        "$http",
        "config",
        "GetData",
        function (a, b, c, d, e, f) {
            var g = this;
            (g.cancel = function () {
                a.dismiss("cancel");
            }),
                (b.researchData = {}),
                (b.researchData.slug = c),
                console.log("File", c),
            "bo" == c &&
            f.async(e.urlMaker("terms-and-conditions")).then(function (a) {
                console.log("GetData", a), (b.tnc = a);
            }),
                (b.submit = function () {
                    d({
                        method: "POST",
                        url: e.urlMaker("research/getPremiumReport"),
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        data: $.param(b.researchData),
                    }).then(
                        function (b) {
                            a.dismiss("cancel"),
                                swal("Done", "You successfully authenticate", "success");
                        },
                        function (a) {
                            console.log("Error"), swal("Sorry", a.data.error, "error");
                        }
                    );
                });
        },
    ]),
    app.controller("MainCtrl", [
        "$scope",
        "GetData",
        "config",
        "$location",
        "$anchorScroll",
        "call",
        "$state",
        "$uibModal",
        "$rootScope",
        "$filter",
        function (a, b, c, d, e, f, g, h, i, j) {
            console.time("start"),
                console.log(a.data),
                (i.lastUpdate = j("date")(new Date(), "medium")),
                (a.iframeLoadedCallBack = function () {
                    console.log("Loading");
                }),
                (i.navToggle = !0),
                (a.navOpen = function () {
                    i.navToggle = !i.navToggle;
                }),
                (a.currentYear = new Date()),
                b.async(c.urlMaker("setting")).then(function (b) {
                    a.setting = b;
                }),
                (a.open = function (a, b, c) {
                    console.log("Click", c);
                    h.open({
                        animation: !0,
                        ariaLabelledBy: "modal-title",
                        ariaDescribedBy: "modal-body",
                        templateUrl: a,
                        controller: "ModalInstanceCtrl",
                        controllerAs: "$ctrl",
                        size: b,
                        resolve: {
                            file: function () {
                                return c;
                            },
                        },
                    });
                }),
                (a.searchData = {}),
                (a.search = function () {
                    return a.searchData.query
                        ? void g.go("search", { query: a.searchData.query })
                        : (console.log("Empty Data"), !1);
                }),
                console.timeEnd("start");
        },
    ]),
    app.controller("whatWeOfferCtrl", [
        "$scope",
        "$stateParams",
        "$state",
        "config",
        "GetData",
        "ngMeta",
        function (a, b, c, d, e, f) {
            e.async(d.urlMaker("what-we-offer")).then(function (b) {
                (a.data = b),
                    console.log(a.data.meta.title),
                    f.setTitle(a.data.meta.title),
                    f.setTag("image", a.data.meta.image),
                    f.setTag("author", a.data.meta.description),
                    f.setTag("keywords", a.data.meta.keywords);
            });
        },
    ]),
    app.controller("whatWeOfferSingleCtrl", [
        "$scope",
        "$stateParams",
        "$state",
        "config",
        "GetData",
        function (a, b, c, d, e) {
            e.async(d.urlMaker("what-we-offer/" + b.id)).then(function (b) {
                a.singleData = b;
            });
        },
    ]),
    app.controller("knowledgeBaseCtrl", [
        "$scope",
        "$stateParams",
        "$state",
        "config",
        "GetData",
        "ngMeta",
        function (a, b, c, d, e, f) {
            e.async(d.urlMaker("knowledge")).then(function (b) {
                (a.data = b),
                    f.setTitle(a.data.meta.title),
                    f.setTag("keywords", a.data.meta.keywords),
                a.data.knowledge.articles.length > 0 &&
                (a.limit = a.data.knowledge.articles.length);
            });
        },
    ]),
    app.controller("knowledgeBaseSingleCtrl", [
        "$scope",
        "$stateParams",
        "$state",
        "config",
        "GetData",
        "ngMeta",
        function (a, b, c, d, e, f) {
            e.async(d.urlMaker("knowledge/" + b.id)).then(function (b) {
                a.singleData = b;
            });
        },
    ]),
    app.controller("boAccountCtrl", [
        "$scope",
        "call",
        "GetData",
        "$stateParams",
        "$uibModal",
        function (a, b, c, d, e) {
            (a.modalOpen = function (a, b, c) {
                console.log("Click", c);
                e.open({
                    animation: !0,
                    ariaLabelledBy: "modal-title",
                    ariaDescribedBy: "modal-body",
                    templateUrl: a,
                    controller: "ModalInstanceCtrl",
                    controllerAs: "$ctrl",
                    size: b,
                    resolve: {
                        file: function () {
                            return "bo";
                        },
                    },
                });
            }),
                console.log("$stateParams", d),
                (a.dateOptions = { formatYear: "yy", startingDay: 1 }),
                (a.open = function (b) {
                    (a.popup.opened = !0), b.preventDefault(), b.stopPropagation();
                }),
                (a.popup = { opened: !1 }),
                (a.datePopup = {
                    applicantInfo: {
                        dateOfBirth: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.applicantInfo.dateOfBirth.opened = !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                        authDateOfBirth: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.applicantInfo.authDateOfBirth.opened = !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                        marriageAnniversary: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.applicantInfo.marriageAnniversary.opened = !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                    },
                    jointInfo: {
                        jointAccountHolderDob: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.jointInfo.jointAccountHolderDob.opened = !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                        marriageAnniversary: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.jointInfo.marriageAnniversary.opened = !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                    },
                    byeLaw: {
                        accountOpendDate: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.byeLaw.accountOpendDate.opened = !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                        issueDate: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.byeLaw.issueDate.opened = !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                        expiryDate: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.byeLaw.expiryDate.opened = !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                        dateOfBirth: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.byeLaw.dateOfBirth.opened = !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                        refDateOfBirth: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.byeLaw.refDateOfBirth.opened = !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                    },
                    nomineeInfo: {
                        nomineeOnePassportIssueDate: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.nomineeInfo.nomineeOnePassportIssueDate.opened =
                                    !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                        nomineeOnePassportExpiryDate: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.nomineeInfo.nomineeOnePassportExpiryDate.opened =
                                    !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                        nomineeOneDob: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.nomineeInfo.nomineeOneDob.opened = !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                        nomineeOneMinorDob: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.nomineeInfo.nomineeOneMinorDob.opened = !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                        nomineeOneMaturityDate: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.nomineeInfo.nomineeOneMaturityDate.opened = !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                        nomineeOneMinorPassportIssueDate: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.nomineeInfo.nomineeOneMinorPassportIssueDate.opened =
                                    !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                        nomineeOneMinorPassportExpiryDate: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.nomineeInfo.nomineeOneMinorPassportExpiryDate.opened =
                                    !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                    },
                    powerOfAttorney: {
                        attorneyHolderDate: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.powerOfAttorney.attorneyHolderDate.opened = !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                        attorneyHolderExpireDate: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.powerOfAttorney.attorneyHolderExpireDate.opened =
                                    !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                        attorneyHolderDob: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.powerOfAttorney.attorneyHolderDob.opened = !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                        attorneyEffectiveFrom: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.powerOfAttorney.attorneyEffectiveFrom.opened = !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                        attorneyEffectiveTo: {
                            opened: !1,
                            open: function (b) {
                                (a.datePopup.powerOfAttorney.attorneyEffectiveTo.opened = !0),
                                    b.preventDefault(),
                                    b.stopPropagation();
                            },
                        },
                    },
                }),
                (a.boInfo = {}),
            d.shortBo &&
            ((a.boInfo.applicant_info = {}),
                Object.assign(a.boInfo.applicant_info, d.shortBo)),
                (a.formHold = !1),
                (a.postBo = function () {
                    (a.formHold = !0),
                        console.log("postBo"),
                        b.postOrder($.param(a.boInfo), "form/boForm", function (b) {
                            (a.formHold = !1),
                                console.log(b.data),
                                b.data.error
                                    ? swal("Sorry", "Something wrong", "error")
                                    : ((a.formData = {}),
                                        swal("Good job!", "You clicked the button!", "success"));
                        });
                });
        },
    ]),
    app.controller("generalCtrl", [
        "$scope",
        "$stateParams",
        "$state",
        "config",
        "GetData",
        "$filter",
        "$window",
        "ngMeta",
        function (a, b, c, d, e, f, g, h) {
            (a.stateParams = b),
                console.log("URL", c.$current.parent.parent),
                (a.activePage = c.current.url.replace("/", "")),
                e.async(d.urlMaker(a.activePage)).then(function (b) {
                    (a.data = b),
                        h.setTitle(a.data.meta.title),
                        h.setTag("image", a.data.meta.image),
                        h.setTag("description", a.data.meta.description),
                        h.setTag("keywords", a.data.meta.keywords);
                }),
                (a.expended = function (a) {
                    return b.id == a;
                }),
                (a.leadership = function (a, d) {
                    console.log("Type", a),
                        console.log("ID", d),
                        c.go("whoWeAreAll", { cat: a, id: d }).then(function () {
                            console.log("Done", b);
                        });
                }),
                (a.type = ""),
                (a.tabToggle = function (b) {
                    a.type = b;
                }),
                (a.oneAtATime = !0),
                (a.status = {
                    isCustomHeaderOpen: !1,
                    isFirstOpen: !0,
                    isFirstDisabled: !1,
                });
            var i = new Date();
            5 != i.getDay()
                ? (a.date = f("date")(i, "yyyy-MM-dd"))
                : (a.date = f("date")(i.setDate(i.getDate() - 1), "yyyy-MM-dd")),
                (a.alertMaker = function () {
                    swal({
                        title: "Server not responding",
                        allowOutsideClick: !1,
                        type: "warning",
                    }).then(function () {
                        c.go("home");
                    });
                });
        },
    ]),
    app
        .directive("homeSlider", function () {
            return {
                restrict: "E",
                link: function (a, b) {
                    a.initOneCarousel = function () {
                        setInterval(function () {
                            $(b).owlCarousel({ items: 1, autoplay: !0, loop: !0, nav: !1 }),
                                a.$apply();
                        }, 0);
                    };
                },
            };
        })
        .directive("homeSliderItem", function () {
            return {
                restrict: "E",
                transclude: !1,
                link: function (a, b) {
                    a.$last && a.initOneCarousel(b.parent());
                },
            };
        })
        .directive("accordionGroup", function () {
            return {
                require: "^accordion",
                restrict: "EA",
                transclude: !0,
                replace: !0,
                templateUrl: "template/accordion/accordion-group.html",
                scope: {
                    heading: "@",
                    isOpen: "=?",
                    isDisabled: "=?",
                    initiallyOpen: "=?",
                },
                controller: function () {
                    this.setHeading = function (a) {
                        this.heading = a;
                    };
                },
                link: function (a, b, c, d) {
                    d.addGroup(a),
                    a.initiallyOpen && (a.isOpen = !0),
                        a.$watch("isOpen", function (b) {
                            b && d.closeOthers(a);
                        }),
                        (a.toggleOpen = function () {
                            a.isDisabled || (a.isOpen = !a.isOpen);
                        });
                },
            };
        }),
    app
        .directive("multiCarouselSlider", function () {
            return {
                restrict: "E",
                link: function (a, b) {
                    (a.test = "dsd"),
                        (a.initCarousel = function (b) {
                            console.log("initCarousel"),
                                setInterval(function () {
                                    $(b).owlCarousel({
                                        loop: !1,
                                        dots: !0,
                                        responsive: {
                                            0: { items: 1 },
                                            600: { items: 4 },
                                            1e3: { items: 4, margin: 20 },
                                        },
                                    }),
                                        a.$apply();
                                }, 0),
                                console.log("dsdsd");
                        });
                },
            };
        })
        .directive("multiCarouselSliderItem", function () {
            return {
                restrict: "AE",
                link: function (a, b) {
                    console.log("multiCarouselSliderItem", b.parent()),
                    a.$last &&
                    (a.initCarousel(b.parent()), console.log("last", a.test));
                },
            };
        }),
    app
        .directive("formWidget", [
            "call",
            "$filter",
            function (a, b) {
                return {
                    restrict: "AE",
                    scope: !0,
                    templateUrl: "views/directive/formWidget.html",
                    controller: [
                        "$scope",
                        function (c) {
                            (c.formData = {}),
                                (c.dateOptions = {
                                    formatYear: "yy",
                                    maxDate: new Date(2020, 5, 22),
                                    minDate: new Date(),
                                    startingDay: 1,
                                }),
                                (c.open = function (a) {
                                    (c.popup.opened = !0),
                                        a.preventDefault(),
                                        a.stopPropagation();
                                }),
                                (c.popup = { opened: !1 }),
                                (c.formHold = !1),
                                (c.postOrder = function () {
                                    (c.formHold = !0), console.log("postorder");
                                    var d = c.formData;
                                    (d.date = b("date")(d.date, "dd-MM-yyyy")),
                                        a.postOrder($.param(d), "form/contactUs", function (a) {
                                            (c.formHold = !1),
                                                console.log(a.data),
                                                a.data.error
                                                    ? swal("Sorry", "Something wrong", "error")
                                                    : ((c.formData = {}),
                                                        swal(
                                                            "Thank you!",
                                                            "We will call you within 2 working days.",
                                                            "success"
                                                        ));
                                        });
                                });
                        },
                    ],
                };
            },
        ])
        .directive("formWidgetBo", [
            "$state",
            function (a) {
                return {
                    restrict: "AE",
                    scope: !0,
                    templateUrl: "views/directive/formWidgetBo.html",
                    controller: [
                        "$scope",
                        function (b) {
                            (b.formData = {}),
                                (b.postOrder = function () {
                                    a.go("boAccount", { shortBo: b.formData });
                                });
                        },
                    ],
                };
            },
        ]),
    app.directive("numbersOnly", function () {
        return {
            restrict: "EA",
            require: "?ngModel",
            scope: {
                allowDecimal: "@",
                allowNegative: "@",
                minNum: "@",
                maxNum: "@",
            },
            link: function (a, b, c, d) {
                d &&
                d.$parsers.unshift(function (a) {
                    var b = !1,
                        e = a
                            .split("")
                            .filter(function (a, d) {
                                var e = !isNaN(a) && " " != a;
                                return (
                                    !e &&
                                    c.allowDecimal &&
                                    "true" == c.allowDecimal &&
                                    "." == a &&
                                    0 == b &&
                                    ((b = !0), (e = !0)),
                                    !e &&
                                    c.allowNegative &&
                                    "true" == c.allowNegative &&
                                    (e = "-" == a && 0 == d),
                                        e
                                );
                            })
                            .join("");
                    return (
                        c.maxNum &&
                        !isNaN(c.maxNum) &&
                        parseFloat(e) > parseFloat(c.maxNum) &&
                        (e = c.maxNum),
                        c.minNum &&
                        !isNaN(c.minNum) &&
                        parseFloat(e) < parseFloat(c.minNum) &&
                        (e = c.minNum),
                            (d.$viewValue = e),
                            d.$render(),
                            e
                    );
                });
            },
        };
    }),
    app.controller("storeLocatorCtrl", [
        "$scope",
        "$stateParams",
        "leafletData",
        "$http",
        "GetData",
        "config",
        "ngMeta",
        function (a, b, c, d, e, f, g) {
            (a.storeLocatorControl = "nav-close"),
                (a.toggleStoreLocatorControl = function () {
                    a.storeLocatorControl = h(a.storeLocatorControl);
                }),
                (a.buttonText = "ALL"),
                (a.districtName = "ALL");
            var h = function (a) {
                return (
                    (a = "nav-close" === a ? "nav-open" : "nav-close"), console.log(a), a
                );
            };
            a.catStatus = "all";
            angular.extend(a, {
                london: { lat: 23.815183, lng: 90.411205, zoom: 11 },
                layers: {
                    baselayers: {
                        openStreetMap: {
                            name: "OpenStreetMap",
                            type: "xyz",
                            url: "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        },
                    },
                    overlays: {
                        security: { type: "group", name: "security", visible: !0 },
                        finance: { type: "group", name: "finance", visible: !0 },
                    },
                },
                markers: {},
                toggleLayer: function (b, c) {
                    (a.buttonText = c), (a.catStatus = b);
                    var d = [];
                    if ("all" === b) {
                        d = [];
                        for (var e in a.markers)
                            (a.markers[e].visible = !0),
                                d.push([a.markers[e].lat, a.markers[e].lng]);
                        console.log(d), a.centerJSON(d);
                    } else {
                        d = [];
                        for (var e in a.markers)
                            a.markers[e].layer === b
                                ? (d.push([a.markers[e].lat, a.markers[e].lng]),
                                    (a.markers[e].visible = !0))
                                : (a.markers[e].visible = !1);
                        console.log(d), a.centerJSON(d);
                    }
                },
                updateMap: function (b) {
                    (a.storeLocatorControl = "nav-close"),
                        (a.markers[b].focus = !0),
                        (a.london.lat = a.markers[b].lat),
                        (a.london.lng = a.markers[b].lng),
                        (a.london.zoom = 17),
                        (a.place = ""),
                        console.log("name", b);
                },
                districtFilter: function (b) {
                    var c = [];
                    if (((a.districtName = b), "All" === b)) {
                        c = [];
                        for (var d in a.markers)
                            (a.markers[d].visible = !0),
                                c.push([a.markers[d].lat, a.markers[d].lng]);
                        console.log(c), a.centerJSON(c);
                    } else
                        (c = []),
                            angular.forEach(a.markers, function (d, e) {
                                d.district.toLowerCase() == b.toLowerCase()
                                    ? ((a.markers[e].visible = !0), c.push([d.lat, d.lng]))
                                    : (a.markers[e].visible = !1);
                            });
                    a.centerJSON(c), console.log("District", b);
                },
            }),
                d({ method: "GET", url: f.urlMaker("contact-us") }).then(
                    function (b) {
                        console.log("success", b),
                            (a.data = b.data),
                            g.setTitle(a.data.meta.title),
                            g.setTag("keywords", a.data.meta.keywords),
                            angular.extend(a, { markers: b.data.branches }),
                            angular.forEach(a.markers, function (a) {
                                console.log(a),
                                    (a.visible = !0),
                                    (a.message =
                                        "<h3>" +
                                        a.name +
                                        "</h3><p><strong>Address: </strong>" +
                                        a.address +
                                        "</p><p><strong>Telephone:</strong>" +
                                        a.phone +
                                        "</p><p><strong>Fax: </strong>" +
                                        a.fax +
                                        "</p>");
                            });
                    },
                    function (a) {
                        console.log("error", a);
                    }
                ),
                (a.place = null),
                (a.autocompleteOptions = {
                    componentRestrictions: { country: "bd" },
                    types: ["geocode"],
                }),
                a.$watch("place", function (b) {
                    console.log("place", a.place),
                    "object" == typeof a.place &&
                    a.place &&
                    ((a.london.lat = a.place.geometry.location.lat()),
                        (a.london.lng = a.place.geometry.location.lng()));
                }),
                (a.centerJSON = function (a) {
                    console.log("center JSON"),
                        c.getMap().then(function (b) {
                            b.fitBounds(a);
                        });
                });
        },
    ]),
    app.filter("unique", function () {
        return function (a, b) {
            if (b === !1) return a;
            if ((b || angular.isUndefined(b)) && angular.isArray(a)) {
                var c = [],
                    d = function (a) {
                        return angular.isObject(a) && angular.isString(b) ? a[b] : a;
                    };
                angular.forEach(a, function (a) {
                    for (var b = !1, e = 0; e < c.length; e++)
                        if (angular.equals(d(c[e]), d(a))) {
                            b = !0;
                            break;
                        }
                    b || c.push(a);
                }),
                    (a = c);
            }
            return a;
        };
    }),
    app.filter("camelCase", function () {
        return function (a) {
            return a.replace(/([A-Z])/g, " $1").replace(/^./, function (a) {
                return a.toUpperCase();
            });
        };
    }),
    app.controller("searchController", [
        "$scope",
        "config",
        "$stateParams",
        "$http",
        "$rootScope",
        "ngMeta",
        function (a, b, c, d, e, f) {
            console.log("from search Ctrl---------", c),
                console.log(a),
                (a.query = { query: c.query }),
                (a.results = {}),
                (a.statusMsg = "Loading......"),
                d({
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: b.apiUrl + "search",
                    data: $.param(a.query),
                }).then(
                    function (b) {
                        (a.results = b.data),
                            console.log("Search success----", a.results.length),
                            a.results.length > 0 ? (a.statusMsg = !0) : (a.statusMsg = !1);
                    },
                    function (b) {
                        (a.results = b.data),
                            (a.statusMsg = !1),
                            console.log("Search Failed----", b);
                    }
                );
        },
    ]),
    app
        .directive("marketToday", function () {
            return {
                restrict: "AE",
                templateUrl: "views/marketWatch/marketToday.directive.html",
                controller: [
                    "$scope",
                    "GetData",
                    "config",
                    "$filter",
                    "$rootScope",
                    function (a, b, c, d, e) {
                        var f = {
                            chart: { type: "area", height: 350 },
                            credits: { enabled: !1 },
                            legend: { enabled: !1 },
                            yAxis: { title: { text: null } },
                            colors: ["pink"],
                            series: [
                                { threshold: null, data: [], name: "Index", id: "Value" },
                            ],
                            title: { text: "" },
                            xAxis: { categories: [], type: "datetime" },
                        };
                        (a.dsesChart = JSON.parse(JSON.stringify(f))),
                            (a.ds30Chart = JSON.parse(JSON.stringify(f))),
                            (a.dsexChart = JSON.parse(JSON.stringify(f))),
                            (a.dsesChart.title.text = "DSES Index"),
                            (a.ds30Chart.title.text = "DS30 Index"),
                            (a.dsexChart.title.text = "DSEX Index"),
                            b
                                .async(c.urlMaker("market-watch/market-index/" + a.date))
                                .then(function (b) {
                                    angular.equals({}, b.marketIndexes) ||
                                    angular.equals([], b.marketIndexes) ||
                                    angular.forEach(b.marketIndexes, function (c, f) {
                                        "DSES" == c.INDEXNAME
                                            ? (a.dsesChart.series[0].data.push(
                                                Number(c.INDEXVALUE)
                                            ),
                                                a.dsesChart.xAxis.categories.push(
                                                    d("date")(c.TIME, "HH:mm:ss")
                                                ))
                                            : "DS30" == c.INDEXNAME
                                                ? (a.ds30Chart.series[0].data.push(
                                                    Number(c.INDEXVALUE)
                                                ),
                                                    a.ds30Chart.xAxis.categories.push(
                                                        d("date")(c.TIME, "HH:mm:ss")
                                                    ),
                                                f == b.marketIndexes.length - 1 &&
                                                (e.lastUpdate = d("date")(c.TIME, "medium")))
                                                : "DSEX" == c.INDEXNAME &&
                                                (a.dsexChart.series[0].data.push(
                                                    Number(c.INDEXVALUE)
                                                ),
                                                    a.dsexChart.xAxis.categories.push(
                                                        d("date")(c.TIME, "HH:mm:ss")
                                                    ));
                                    });
                                });
                    },
                ],
                link: function (a, b) {},
            };
        })
        .directive("strengthMeter", function () {
            return {
                restrict: "AE",
                templateUrl: "views/marketWatch/strengthMeter.directive.html",
                controller: [
                    "$scope",
                    "config",
                    "GetData",
                    function (a, b, c) {
                        (a.pieConfig = {
                            chart: {
                                plotBackgroundColor: null,
                                plotBorderWidth: 0,
                                plotShadow: !1,
                                marginTop: -50,
                                marginBottom: -75,
                                marginLeft: 0,
                                marginRight: 0,
                            },
                            title: {
                                text: "DSE Gainer Loser Meter",
                                align: "center",
                                verticalAlign: "top",
                                y: 40,
                            },
                            legend: {
                                verticalAlign: "bottom",
                                labelFormatter: function () {
                                    return this.name + (" " + this.percentage.toFixed(1) + "%");
                                },
                            },
                            credits: { enabled: !1 },
                            plotOptions: {
                                pie: {
                                    dataLabels: {
                                        enabled: !0,
                                        distance: -50,
                                        style: { fontWeight: "bold" },
                                    },
                                    showInLegend: !0,
                                    startAngle: -90,
                                    endAngle: 90,
                                    center: ["50%", "75%"],
                                    colors: ["#61C46E", "#FF5A5A", "#00B0FF"],
                                },
                            },
                            series: [
                                { type: "pie", name: "Percentage", innerSize: "50%", data: [] },
                            ],
                        }),
                            c
                                .async(b.urlMaker("market-watch/strength-meter/" + a.date))
                                .then(function (b) {
                                    if (!angular.equals({}, b) && !angular.equals([], b)) {
                                        var c = [];
                                        c.push(["Gainer", b.gainerP]),
                                            c.push(["Loser", b.looserP]),
                                            c.push(["Unchanged", b.unchangedP]),
                                            (a.pieConfig.series = [{ data: c }]);
                                    }
                                });
                    },
                ],
                link: function (a, b) {},
            };
        })
        .directive("industryUpdate", function () {
            return {
                restrict: "AE",
                templateUrl: "views/marketWatch/industryUpdate.directive.html",
                controller: [
                    "$scope",
                    "config",
                    "GetData",
                    function (a, b, c) {
                        (a.barConfig = {
                            chart: { type: "bar" },
                            colors: ["#00B0FF", "#6f6f6f"],
                            title: { text: "Today's Value" },
                            xAxis: { categories: [], title: { text: null } },
                            yAxis: {
                                min: 0,
                                title: { text: null },
                                labels: { overflow: "justify" },
                            },
                            tooltip: { valueSuffix: " m" },
                            plotOptions: { bar: { dataLabels: { enabled: !0 } } },
                            credits: { enabled: !1 },
                            series: [],
                        }),
                            c
                                .async(b.urlMaker("market-watch/sector-status/" + a.date))
                                .then(function (b) {
                                    if (!angular.equals({}, b) && !angular.equals([], b)) {
                                        var c = [],
                                            d = [];
                                        angular.forEach(b, function (b, e) {
                                            a.barConfig.xAxis.categories.push(e),
                                                console.log("value['TTVal']", b.TTVal),
                                                c.push(Number(b.TTVal.toFixed(1))),
                                                d.push(Number(b.YTTVal.toFixed(1)));
                                        }),
                                            a.barConfig.series.push({ name: "Today", data: c }),
                                            a.barConfig.series.push({ name: "Yesterday", data: d });
                                    }
                                });
                    },
                ],
            };
        })
        .directive("industryUpdateGainerLooser", function () {
            return {
                restrict: "AE",
                templateUrl:
                    "views/marketWatch/industryUpdateGainerLooser.directive.html",
                controller: [
                    "$scope",
                    "GetData",
                    "config",
                    function (a, b, c) {
                        (a.gainerLooserConfig = {
                            chart: { type: "bar" },
                            colors: ["#61C46E", "#FF5A5A", "#00B0FF"],
                            title: { text: "Gainer Loser" },
                            credits: { enabled: !1 },
                            xAxis: { categories: [] },
                            yAxis: { min: 0, title: { text: null } },
                            legend: { reversed: !0 },
                            plotOptions: { series: { stacking: "normal" } },
                            series: [],
                        }),
                            b
                                .async(c.urlMaker("market-watch/sector-status/" + a.date))
                                .then(function (b) {
                                    if (!angular.equals({}, b) && !angular.equals([], b)) {
                                        var c = [],
                                            d = [],
                                            e = [];
                                        angular.forEach(b, function (b, f) {
                                            a.gainerLooserConfig.xAxis.categories.push(f),
                                                c.push(b.gainer),
                                                d.push(b.looser),
                                                e.push(b.unchanged);
                                        }),
                                            (a.gainerLooserConfig.series = []),
                                            a.gainerLooserConfig.series.push({
                                                name: "Gainer",
                                                data: c,
                                            }),
                                            a.gainerLooserConfig.series.push({
                                                name: "Looser",
                                                data: d,
                                            }),
                                            a.gainerLooserConfig.series.push({
                                                name: "Unchanged",
                                                data: e,
                                            });
                                    }
                                });
                    },
                ],
            };
        })
        .directive("topChart", function () {
            return {
                restrict: "AE",
                templateUrl: "views/marketWatch/topChart.directive.html",
                controller: [
                    "$scope",
                    "config",
                    "GetData",
                    function (a, b, c) {
                        var d = {
                                chart: {
                                    margin: [0, 0, 0, 0],
                                    height: 50,
                                    style: { overflow: "visible" },
                                    colors: ["#FF5A5A"],
                                },
                                title: { text: "" },
                                credits: { enabled: !1 },
                                legend: { enabled: !1 },
                                xAxis: { labels: { enabled: !1 }, tickLength: 0 },
                                yAxis: {
                                    title: { text: null },
                                    labels: { enabled: !1 },
                                    tickLength: 0,
                                },
                                series: [],
                            },
                            e = function (a) {
                                for (var b in a) {
                                    var c = [],
                                        e = [];
                                    (a[b].chart = JSON.parse(JSON.stringify(d))),
                                        (a[b].column = JSON.parse(JSON.stringify(d)));
                                    for (var f in a[b].TH)
                                        c.push({ x: Number(f) + 1, y: a[b].TH[f].CP }),
                                            e.push({ x: Number(f) + 1, y: a[b].TH[f].TTVol });
                                    (a[b].chart.series[0] = {
                                        fillColor: "rgba(124, 181, 236, 0.3)",
                                        type: "area",
                                        name: "Price",
                                        data: c,
                                    }),
                                        (a[b].column.series[0] = {
                                            fillColor: "rgba(124, 181, 236, 0.3)",
                                            type: "column",
                                            name: "Volume",
                                            data: e,
                                        });
                                }
                                return a;
                            };
                        c.async(b.urlMaker("market-watch/top-status/" + a.date)).then(
                            function (b) {
                                angular.equals({}, b) ||
                                angular.equals([], b) ||
                                ((a.topVal = e(b.topVal)),
                                    (a.topVol = e(b.topVol)),
                                    (a.topLooser = e(b.topLooser)),
                                    (a.topGainer = e(b.topGainer)),
                                    (a.topTrade = e(b.topTrade)));
                            }
                        );
                    },
                ],
            };
        })
        .directive("newsWidget", function () {
            return {
                restrict: "AE",
                templateUrl: "views/marketWatch/newsWidget.directive.html",
                controller: [
                    "$scope",
                    "config",
                    "GetData",
                    function (a, b, c) {
                        c.async(b.urlMaker("market-watch/news/" + a.date)).then(function (
                            b
                        ) {
                            angular.equals({}, b) || angular.equals([], b) || (a.news = b);
                        });
                    },
                ],
            };
        }),
    app.directive("topValueTest", function () {
        return {
            restrict: "AE",
            templateUrl: "views/marketWatch/test.directive.html",
            controller: [
                "$scope",
                "$http",
                "config",
                "GetData",
                function (a, b, c, d) {
                    var e = {
                            chart: { margin: [0, 0, 0, 0], style: { overflow: "visible" } },
                            title: { text: "" },
                            credits: { enabled: !1 },
                            legend: { enabled: !1 },
                            xAxis: { labels: { enabled: !1 }, tickLength: 0 },
                            yAxis: {
                                title: { text: null },
                                labels: { enabled: !1 },
                                tickLength: 0,
                            },
                            series: [],
                        },
                        f = function (a) {
                            for (var b in a) {
                                var c = [],
                                    d = [];
                                (a[b].chart = JSON.parse(JSON.stringify(e))),
                                    (a[b].column = JSON.parse(JSON.stringify(e)));
                                for (var f in a[b].TH)
                                    c.push({ x: Number(f) + 1, y: a[b].TH[f].CP }),
                                        d.push({ x: Number(f) + 1, y: a[b].TH[f].TTVol });
                                (a[b].chart.series[0] = {
                                    fillColor: "rgba(124, 181, 236, 0.3)",
                                    type: "area",
                                    name: "Price",
                                    data: c,
                                }),
                                    (a[b].column.series[0] = {
                                        fillColor: "rgba(124, 181, 236, 0.3)",
                                        type: "column",
                                        name: "Volume",
                                        data: d,
                                    }),
                                    console.log("obj", a[b].chart);
                            }
                            return console.log("Fullobj", a), a;
                        };
                    d.async(c.urlMaker("market-watch/top-status/" + a.date)).then(
                        function (b) {
                            console.log(b),
                                angular.equals({}, b) || angular.equals([], b)
                                    ? a.alertMaker()
                                    : ((a.topVal = f(b.topVal)),
                                        (a.topVol = f(b.topVol)),
                                        (a.topLooser = f(b.topLooser)),
                                        (a.topGainer = f(b.topGainer)),
                                        (a.topTrade = f(b.topTrade)));
                        }
                    );
                },
            ],
        };
    }),
    angular.module("idlcApp").run([
        "$templateCache",
        function (a) {
            a.put(
                "views/boAccount.html",
                '<!--<pre class="debugger">{{boInfo | json}}</pre>--> <div class="bio"> <ul class="bio-account-list list-inline text-center" ng-init="selected = 1"> <li ng-class="selected == 1?\'active\':\'\'"> <a ng-click="selected=1" class="btn btn-bio">Applicant Info</a> </li> <li ng-class="selected == 2?\'active\':\'\'"> <a ng-click="selected=2" class="btn btn-bio">Joint Holder</a> </li> <li ng-class="selected == 3?\'active\':\'\'"> <a ng-click="selected=3" class="btn btn-bio">BO : Bye Law</a> </li> <li ng-class="selected == 4?\'active\':\'\'"> <a ng-click="selected=4" class="btn btn-bio">Nominee Info</a> </li> <li ng-class="selected == 5?\'active\':\'\'" ng-show="boInfo[\'applicant_info\'][\'listed_company\'] == \'Yes\'"> <a ng-click="selected=5" class="btn btn-bio">Power of Attorney</a> </li> <!--<li ng-class="selected == 6?\'active\':\'\'">--> <!--<a ng-click="selected=6" class="btn btn-bio">File Attachment</a>--> <!--</li>--> </ul> <div class="container"> <div class="row"> <div class="col-md-12"> <form ng-submit="postBo()" ng-class="formHold?\'active\':\'\'"> <div class="tab-content"> <div role="tabpanel" ng-class="selected == 1?\'active\':\'\'" class="tab-pane"> <div ng-include="\'views/boForm/applicantInfo.html\'"></div> </div> <div role="tabpanel" ng-class="selected == 2?\'active\':\'\'" class="tab-pane"> <div ng-include="\'views/boForm/jointHolder.html\'"></div> </div> <div role="tabpanel" ng-class="selected == 3?\'active\':\'\'" class="tab-pane"> <div ng-include="\'views/boForm/byeLaw.html\'"></div> </div> <div role="tabpanel" ng-class="selected == 4?\'active\':\'\'" class="tab-pane"> <div ng-include="\'views/boForm/nomineeInfo.html\'"></div> </div> <div role="tabpanel" ng-class="selected == 5?\'active\':\'\'" class="tab-pane"> <div ng-include="\'views/boForm/powerOfAttorney.html\'"></div> </div> <!--<div role="tabpanel" ng-class="selected == 6?\'active\':\'\'" class="tab-pane">--> <!--<h3 class="bio-heading">Customer Account Information</h3>--> <!--<div class="bio-form-section">--> <!--</div>--> <!--</div>--> </div> </form> <div class="btn-container"> <button class="btn btn-form" ng-show="selected == 1" type="button" ng-click="selected=2">Next</button> <button class="btn btn-form" ng-show="selected == 2" type="button" ng-click="selected=3">Next</button> <button class="btn btn-form" ng-show="selected == 3" type="button" ng-click="selected=4">Next</button> <button class="btn btn-form" ng-show="selected == 4 && boInfo[\'applicant_info\'][\'listed_company\'] == \'Yes\'" type="button" ng-click="selected=5">Next</button> </div> <!--<ul class="bio-account-list list-inline text-center"  ng-init="selected = 1">--> <!--<li ng-class="selected == 1?\'active\':\'\'">--> <!--<a ng-click="selected=1" class="btn btn-bio">Applicant Info</a>--> <!--</li>--> <!--<li ng-class="selected == 2?\'active\':\'\'">--> <!--<a ng-click="selected=2" class="btn btn-bio">Joint Holder</a>--> <!--</li>--> <!--<li ng-class="selected == 3?\'active\':\'\'">--> <!--<a ng-click="selected=3" class="btn btn-bio">BO : Bye Law</a>--> <!--</li>--> <!--<li ng-class="selected == 4?\'active\':\'\'">--> <!--<a ng-click="selected=4" class="btn btn-bio">Nominee Info</a>--> <!--</li>--> <!--<li ng-class="selected == 5?\'active\':\'\'">--> <!--<a ng-click="selected=5" class="btn btn-bio">Power of Attorney</a>--> <!--</li>--> <!--<li ng-class="selected == 6?\'active\':\'\'">--> <!--<a ng-click="selected=6" class="btn btn-bio">File Attachment</a>--> <!--</li>--> <!--</ul>--> </div> </div> </div> </div>'
            ),
                a.put(
                    "views/boForm/applicantInfo.html",
                    '<h3 class="bio-heading">Customer Account Information</h3> <div class="bio-form-section"> <div class="form-horizontal fr-horizon"> <div class="form-group fr-group"> <label class="control-label c-label col-sm-3">Client account no.</label> <div class="col-sm-6 no-padding"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'client_account_no\']" type="text"> </div> </div> <div class="form-group fr-group"> <label class="control-label c-label col-sm-3">BO ID no.</label> <div class="col-sm-7 no-padding"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'bo_id_no\']" type="text"> </div> </div> <div class="form-group fr-group"> <label class="control-label c-label col-sm-3">Account type:</label> <div class="col-sm-2 no-padding"> <label class="radio-inline"> <input name="account_type" value="Cash" ng-model="boInfo[\'applicant_info\'][\'account_type\']" type="radio">Cash </label> <label class="radio-inline"> <input name="account_type" value="Margin" ng-model="boInfo[\'applicant_info\'][\'account_type\']" type="radio">Margin </label> </div> <label class="control-label c-label col-sm-1">NRB:</label> <div class="col-sm-2 no-padding"> <label class="radio-inline"> <input name="nrb" value="Cash" ng-model="boInfo[\'applicant_info\'][\'nrb\']" type="radio">Cash </label> <label class="radio-inline"> <input name="nrb" value="Margin" ng-model="boInfo[\'applicant_info\'][\'nrb\']" type="radio">Margin </label> </div> <label class="control-label c-label col-sm-2">Status:</label> <div class="col-sm-2 no-padding"> <label class="radio-inline"> <input name="status" value="Cash" ng-model="boInfo[\'applicant_info\'][\'status\']" type="radio"> Cash</label> <label class="radio-inline"> <input name="status" value="Margin" ng-model="boInfo[\'applicant_info\'][\'status\']" type="radio"> Margin</label> </div> </div> <div class="form-group fr-group"> <label class="control-label c-label c-belel col-sm-3">Special Remarks. <br> <span class="small-font">if any</span> </label> <div class="col-sm-8 no-padding"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'special_remarks\']" type="text"> </div> </div> </div> <div class="form-padding clearfix"> <div class="form-group fr-group clearfix"> <label class="col-md-12 no-padding c-label">Name of the Customer/ Account Holder:</label> <input class="col-md-12 form-control f-control" ng-model="boInfo[\'applicant_info\'][\'account_holder\']" type="text"> </div> <div class="col-md-9 no-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Father’s / Husbands Name:</label> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'father_name\']" type="text"> </div> </div> <div class="col-md-5 no-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Date of birth:</label> <div class="col-md-12 no-padding-left"> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'date_of_birth\']" ng-click="datePopup.applicantInfo.dateOfBirth.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.applicantInfo.dateOfBirth.opened" datepicker-options="dateOptions" type="text" placeholder="Date of Birth"> </div> </div> </div> </div> <div class="col-md-2 no-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Sex:</label> <select class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'sex\']"> <option selected disabled>Select</option> <option value="Male">Male</option> <option value="Female">Female</option> <option value="Other">Other</option> </select> </div> </div> <div class="col-md-5 no-padding padding-left no-padding-right"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Marriage Anniversary:</label> <div class="col-md-12 no-padding-left"> <div class="form-group fr-group clearfix"> <input class="form-control f-control" type="text" ng-model="boInfo[\'applicant_info\'][\'marriage_anniversary\']" ng-click="datePopup.applicantInfo.marriageAnniversary.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.applicantInfo.marriageAnniversary.opened" datepicker-options="dateOptions" placeholder="Date"> </div> </div> </div> </div> <div class="form-second-section clearfix"> <div class="col-md-12 no-padding"> <div class="col-md-6 no-padding-left"> <label class="c-label clearfix">Occupation:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'occupation\']" type="text" placeholder="Occupation"> </div> </div> <div class="col-md-6 no-padding-right"> <label class="c-label clearfix">Nationality:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'nationality\']" type="text" placeholder="Nationality"> </div> </div> <div class="col-md-12 no-padding"> <label class="no-padding c-label clearfix">Present Address:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'present_address\']" type="text" placeholder="Present Address"> </div> </div> <div class="col-md-6 no-padding-left"> <label class="no-padding c-label clearfix">Phone:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'present_phone\']" type="text" placeholder="Phone"> </div> </div> <div class="col-md-6 no-padding-right"> <label class="no-padding c-label clearfix">Fax:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'present_fax\']" type="text" placeholder="Fax"> </div> </div> <div class="col-md-6 no-padding-left"> <label class="no-padding c-label clearfix">Email:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'present_email\']" type="email" placeholder="Email"> </div> </div> <div class="col-md-12 no-padding"> <label class="no-padding c-label clearfix">Permanent Address:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'permanent_address\']" type="text" placeholder="Permanent\r\nAddress"> </div> </div> <div class="col-md-6 no-padding-left"> <label class="no-padding c-label clearfix">Phone:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'permanent_phone\']" type="text" placeholder="Phone"> </div> </div> <div class="col-md-6 no-padding-right"> <label class="no-padding c-label clearfix">Fax:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'permanent_fax\']" type="text" placeholder="Fax"> </div> </div> <div class="col-md-6 no-padding-left"> <label class="no-padding c-label clearfix">Email:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'permanent_email\']" type="email" placeholder="Email"> </div> </div> <div class="col-md-12 no-padding"> <label class="no-padding c-label clearfix">Name of the Authorized Person:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'auth_person\']" type="text" placeholder="Name of the Auth Person"> </div> </div> <div class="col-md-12 no-padding"> <label class="no-padding c-label clearfix">Father’s / Husbands Name:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'auth_father_name\']" type="text" placeholder="Father’s/Husbands Name"> </div> </div> <div class="col-md-5 no-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Date of birth</label> <div class="col-md-12 no-padding-left"> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'auth_date_of_birth\']" type="text" ng-click="datePopup.applicantInfo.authDateOfBirth.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.applicantInfo.authDateOfBirth.opened" datepicker-options="dateOptions" placeholder="Date of birth"> </div> </div> </div> </div> <div class="col-md-3 phone-padding-zero"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Sex:</label> <select class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'auth_sex\']"> <option selected disabled>Select</option> <option value="Male">Male</option> <option value="Female">Female</option> <option value="Other">Other</option> </select> </div> </div> <div class="col-md-4 no-padding-right"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Nationality:</label> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'auth_nationality\']" type="text" placeholder="Nationality"> </div> </div> <div class="col-md-12 no-padding"> <label class="no-padding c-label clearfix">Present Address:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'auth_present_address\']" type="text" placeholder="Present Address"> </div> </div> <div class="col-md-4 no-padding-left"> <label class="no-padding c-label clearfix">Phone:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'auth_present_phone\']" type="text" placeholder="Phone"> </div> </div> <div class="col-md-4 phone-padding-zero"> <label class="no-padding c-label clearfix">Fax:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'auth_present_fax\']" type="text" placeholder="Fax"> </div> </div> <div class="col-md-4 no-padding-right"> <label class="no-padding c-label clearfix">Email:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'auth_present_email\']" type="email" placeholder="Email"> </div> </div> <div class="col-md-12 no-padding"> <label class="no-padding c-label clearfix">Permanent Address:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'auth_permanent_address\']" type="text" placeholder="Permanent Address"> </div> </div> <div class="col-md-4 no-padding-left"> <label class="no-padding c-label clearfix">Phone:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'auth_permanent_phone\']" type="text" placeholder="Phone"> </div> </div> <div class="col-md-4 phone-padding-zero"> <label class="no-padding c-label clearfix">Fax:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'auth_permanent_fax\']" type="text" placeholder="Fax"> </div> </div> <div class="col-md-4 no-padding-right"> <label class="no-padding c-label clearfix">Email:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'auth_permanent_email\']" type="email" placeholder="Email"> </div> </div> <div class="col-md-12 no-padding-left"> <div class="form-group fr-group clearfix"> <p class="">Whether the Customer or Joint Holder is an Officer or Director of any Stock Exchange/Listed Company?</p> <label class="radio-inline"> <input type="radio" value="Yes" ng-model="boInfo[\'applicant_info\'][\'listed_company\']" name="listed_company">Yes </label> <label class="radio-inline"> <input type="radio" value="No" ng-model="boInfo[\'applicant_info\'][\'listed_company\']" name="listed_company">No </label> </div> </div> <div class="col-md-8 no-padding-left"> <label class="no-padding c-label clearfix">Name of the Stock Exchange/Listed Company:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'company_name\']" placeholder="Name of the Stock Exchange"> </div> </div> <div class="col-md-12 no-padding-left no-padding-right"> <label class="no-padding c-label clearfix">Address of the Stock Exchange/Listed Company:</label> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'applicant_info\'][\'company_address\']" placeholder="Address of the Stock Exchange"> </div> </div> </div> </div> </div> <div class="form-padding"> <div class="checkbox"> <label><input type="checkbox" value="true" ng-model="boInfo[\'applicant_info\'][\'t_and_c\']">Agreed to our Terms and confirm that you have read our <a href="" ng-click="modalOpen(\'modal-tnc.html\',\'md\')">Terms and conditions.</a> </label> </div> </div> </div>'
                ),
                a.put(
                    "views/boForm/byeLaw.html",
                    '<h3 class="bio-heading">Customer Account Information</h3> <div class="bio-form-section clearfix"> <div class="for-bgs clearfix"> <div class="col-md-8"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Application no:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'bye_law\'][\'application_no\']"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">BO Category:</label> <input type="text" class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'bo_category\']"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">BO type:</label> <input type="text" class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'bo_type\']"> </div> </div> <div class="col-md-10"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Name of CDBL Participant:</label> <input class="form-control f-control f-active" type="text" placeholder="IDLC SECURITIES LIMITED" ng-model="boInfo[\'bye_law\'][\'cdbl_name\']"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">CDBL Participant ID:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'bye_law\'][\'cdbl_id\']"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">BO ID:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'bye_law\'][\'bo_id\']"> </div> </div> <div class="col-md-6 phone-padding phone-padding-left"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Date Account Opened:</label> <input class="form-control f-control" type="text" placeholder="Account Opened Date" ng-model="boInfo[\'bye_law\'][\'account_opend_date\']" ng-click="datePopup.byeLaw.accountOpendDate.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.byeLaw.accountOpendDate.opened" datepicker-options="dateOptions"> </div> </div> <div class="col-md-12 no-padding"> <p class="bg-co-white text">I / We request you to open a Depository Account in my / our name as per the following details.</p> </div> </div> <div class="clearfix"> <div class="col-md-9"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Short Name of Account Holder:<small class="small-text">(Abbreviate only if over 30 characters)</small></label> <input class="form-control f-control" type="text" ng-model="boInfo[\'bye_law\'][\'short_name_account_holder\']"> </div> </div> <div class="col-md-3"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Title</label> <select class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'title\']"> <option selected disabled>Select</option> <option value="Mr.">Mr.</option> <option value="Ms.">Ms.</option> </select> </div> </div> <div class="col-md-12"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Name of Contact Person:<small class="small-text">(In case of a Company / Firm / Statury Body)</small></label> <input class="form-control f-control" type="text" ng-model="boInfo[\'bye_law\'][\'name_contact_person\']"> </div> </div> <div class="col-md-3"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Sex:</label> <select class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'sex\']"> <option selected disabled>Select</option> <option value="Male">Male</option> <option value="Female">Female</option> <option value="Other">Other</option> </select> </div> </div> <div class="col-md-8"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Occupation:</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'occupation\']" type="text"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Father’s or Husband’s Name:</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'father_husband_name\']" type="text"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Mother’s Name:</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'mother_name\']" type="text"> </div> </div> <div class="col-md-8"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Address:</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'address\']" type="text"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Post Code:</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'post_code\']" type="text"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Country</label> <select class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'country\']"> <option selected disabled>Select</option> <option value="Bangaladesh">Bangladesh</option> </select> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">State / Division:</label> <select class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'state\']"> <option selected disabled>Select</option> <option value="Barisal">Barisal</option> <option value="Chittagong">Chittagong</option> <option value="Dhaka">Dhaka</option> <option value="Khulna">Khulna</option> <option value="Rajshahi">Rajshahi</option> <option value="Rangpur">Rangpur</option> <option value="Sylhet">Sylhet</option> <option value="Mymensingh">Mymensingh</option> </select> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">City / Upazilla:</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'city\']" type="text"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Telephone:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'bye_law\'][\'telephone\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Mobile No:</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'mobile\']" type="text"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Fax No.</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'fax\']" type="text"> </div> </div> <div class="col-md-9"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Email</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'email\']" type="email"> </div> </div> <div class="col-md-8"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Passport No.</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'passport\']" type="text"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Issue Place:</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'issue_place\']" type="text"> </div> </div> <div class="col-md-5 no-padding phone-padding phone-padding-left padding-left"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Issue Date:</label> <input class="form-control f-control" type="text" placeholder="Account Opened Date" ng-model="boInfo[\'bye_law\'][\'issue_date\']" ng-click="datePopup.byeLaw.issueDate.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.byeLaw.issueDate.opened" datepicker-options="dateOptions"> </div> </div> <div class="col-md-5 no-padding phone-padding-left phone-padding padding-left"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Expiry Date:</label> <input class="form-control f-control" type="text" placeholder="Account Opened Date" ng-model="boInfo[\'bye_law\'][\'expiry_date\']" ng-click="datePopup.byeLaw.expiryDate.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.byeLaw.expiryDate.opened" datepicker-options="dateOptions"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Bank Name:</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'bank_name\']" type="text"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Branch Name:</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'branch_name\']" type="text"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Account No:</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'account_no\']" type="text"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label small-text-label">Electronic Dividend Credit:</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'electronic_credit\']" type="text"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Tax Exemption:</label> <input type="text" class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'tax_exemption\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">TIN / Tax ID:</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'tin\']" type="text"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Residency:</label> <input type="text" class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'residency\']"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Nationality:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'bye_law\'][\'nationality\']"> </div> </div> <div class="col-md-6 phone-padding-left phone-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Date of Birth:</label> <input class="form-control f-control" type="text" placeholder="Account Opened Date" ng-model="boInfo[\'bye_law\'][\'date_of_birth\']" ng-click="datePopup.byeLaw.dateOfBirth.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.byeLaw.dateOfBirth.opened" datepicker-options="dateOptions"> </div> </div> <div class="col-md-12"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label col-md-12">Statement Cycle Code:</label> <label class="radio-inline"> <input type="radio" name="statement_cycle_code" value="Daily" ng-model="boInfo[\'bye_law\'][\'statement_cycle_code\']">Daily </label> <label class="radio-inline"> <input type="radio" name="statement_cycle_code" value="Weekly" ng-model="boInfo[\'bye_law\'][\'statement_cycle_code\']">Weekly </label> <label class="radio-inline"> <input type="radio" name="statement_cycle_code" value="Fortnightly" ng-model="boInfo[\'bye_law\'][\'statement_cycle_code\']">Fortnightly </label> <label class="radio-inline"> <input type="radio" name="statement_cycle_code" value="Monthly" ng-model="boInfo[\'bye_law\'][\'statement_cycle_code\']">Monthly </label> <label class="radio-inline"> <input type="radio" name="statement_cycle_code" value="Other" ng-model="boInfo[\'bye_law\'][\'statement_cycle_code\']">Other </label> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Internal Ref. No.</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'intr_ref_no\']" type="text"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Registration No</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'registration_no\']" type="text"> </div> </div> <div class="col-md-6 phone-padding-left phone-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Date of Birth:</label> <input class="form-control f-control" type="text" placeholder="Account Opened Date" ng-model="boInfo[\'bye_law\'][\'ref_date_of_birth\']" ng-click="datePopup.byeLaw.refDateOfBirth.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.byeLaw.refDateOfBirth.opened" datepicker-options="dateOptions"> </div> </div> <div class="col-md-8"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Name of Second Account Holder:(Joint Applicant)</label> <input class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'joint_applicant_name\']" type="text"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Title:</label> <select class="form-control f-control" ng-model="boInfo[\'bye_law\'][\'joint_applicant_title\']"> <option selected disabled>Select</option> <option value="Mr.">Mr.</option> <option value="Ms.">Ms.</option> </select> </div> </div> <div class="col-md-12"> <div class="form-group fr-group clearfix"> <p class="f-sm-s">Would you like to create a link to your existing Depository Account?</p> <label class="radio-inline"> <input type="radio" name="depository_account" value="yes" ng-model="boInfo[\'bye_law\'][\'depository_account\']">Yes </label> <label class="radio-inline"> <input type="radio" name="depository_account" value="no" ng-model="boInfo[\'bye_law\'][\'depository_account\']">No </label> </div> </div> <div class="col-md-8"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">The Depository BO Account Code:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'bye_law\'][\'depository_account_code\']"> </div> </div> <div class="col-md-8"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Special Instructions on operation of Joint Account?</label> <label class="radio-inline"> <input type="radio" name="depository_account_instructions" value="Either or Survivor" ng-model="boInfo[\'bye_law\'][\'depository_account_instructions\']">Either or Survivor </label> <label class="radio-inline"> <input type="radio" name="depository_account_instructions" value="Any one can operate" ng-model="boInfo[\'bye_law\'][\'depository_account_instructions\']">Any one can operate </label> <label class="radio-inline"> <input type="radio" name="depository_account_instructions" value="Any two will operate jointly" ng-model="boInfo[\'bye_law\'][\'depository_account_instructions\']">Any two will operate jointly </label> <label class="radio-inline"> <input type="radio" name="depository_account_instructions" value="Any two will operate jointly With any one of the others" ng-model="boInfo[\'bye_law\'][\'depository_account_instructions\']">Any two will operate jointly With any one of the others </label> </div> </div> </div> </div>'
                ),
                a.put("views/boForm/fileAttachment.html", ""),
                a.put(
                    "views/boForm/jointHolder.html",
                    '<h3 class="bio-heading">Joint Account Holder Information</h3> <div class="bio-form-section clearfix"> <div class="col-md-12"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Name of the Customer/ Account Holder:</label> <input class="form-control f-control" ng-model="boInfo[\'joint_info\'][\'joint_account_holder\']" type="text"> </div> </div> <div class="col-md-12"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Father’s / Husbands Name:</label> <input class="form-control f-control" ng-model="boInfo[\'joint_info\'][\'joint_account_holder_father_name\']" type="text"> </div> </div> <div class="col-md-5 no-padding padding-left phone-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Date of Birth:</label> <div class="col-md-12 no-padding-left"> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'joint_info\'][\'joint_account_holder_birth_date\']" ng-click="datePopup.jointInfo.jointAccountHolderDob.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.jointInfo.jointAccountHolderDob.opened" datepicker-options="dateOptions" type="text" placeholder="Date of Birth"> </div> </div> </div> </div> <div class="col-md-2 no-padding padding-left phone-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Sex</label> <select class="form-control f-control" ng-model="boInfo[\'joint_info\'][\'joint_account_holder_sex\']"> <option selected disabled>Select</option> <option value="Male">Male</option> <option value="Female">Female</option> <option value="Other">Other</option> </select> </div> </div> <div class="col-md-5 no-padding padding-left phone-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Marriage Anniversary:</label> <div class="col-md-12 no-padding-left"> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'joint_info\'][\'joint_account_holder_marriage\']" ng-click="datePopup.jointInfo.marriageAnniversary.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.jointInfo.marriageAnniversary.opened" datepicker-options="dateOptions" placeholder="Date" type="text" placeholder="Marriage Anniversary"> </div> </div> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Occupation:</label> <input class="form-control f-control" ng-model="boInfo[\'joint_info\'][\'joint_account_holder_occupation\']" type="text"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Nationality:</label> <input class="form-control f-control" ng-model="boInfo[\'joint_info\'][\'joint_account_holder_nationality\']" type="text"> </div> </div> <div class="col-md-12"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Present Address:</label> <input class="form-control f-control" ng-model="boInfo[\'joint_info\'][\'joint_account_holder_pre_address\']" type="text"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Phone:</label> <input class="form-control f-control" ng-model="boInfo[\'joint_info\'][\'joint_account_holder_phone\']" type="text"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Fax:</label> <input class="form-control f-control" ng-model="boInfo[\'joint_info\'][\'joint_account_holder_fax\']" type="text"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Email:</label> <input class="form-control f-control" ng-model="boInfo[\'joint_info\'][\'joint_account_holder_pre_email\']" type="email"> </div> </div> <div class="col-md-12"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Permament Address:</label> <input class="form-control f-control" ng-model="boInfo[\'joint_info\'][\'joint_account_holder_premanent_address\']" type="text"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Phone:</label> <input class="form-control f-control" ng-model="boInfo[\'joint_info\'][\'joint_account_holder_premanent_phone\']" type="text"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Fax:</label> <input class="form-control f-control" ng-model="boInfo[\'joint_info\'][\'joint_account_holder_premanent_fax\']" type="text"> </div> </div> <div class="col-md-12"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Email:</label> <input class="form-control f-control" ng-model="boInfo[\'joint_info\'][\'joint_account_holder_premanent_email\']" type="email"> </div> </div> </div>'
                ),
                a.put(
                    "views/boForm/nomineeInfo.html",
                    '<h3 class="bio-heading">BO Account Nomination</h3> <div class="bio-form-section clearfix"> <div class="for-bgs clearfix"> <div class="col-md-5"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Name of CDBL Participant:</label> <input class="form-control f-control f-active" type="text" placeholder="IDLC SECURITIES LIMITED" ng-model="boInfo[\'nominee_info\'][\'cdbl_participant_name\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">CDBL Participant ID:</label> <input class="form-control f-control f-active" type="text" placeholder="3 6 8 0 0" ng-model="boInfo[\'nominee_info\'][\'cdbl_participant_id\']"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Account Holder’s BO ID:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'account_holder_bo_id\']"> </div> </div> <div class="col-md-9"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Short Name of Account Holder:<small class="small-text">(Abbreviate only if over 30 characters)</small></label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'account_holder_short_name\']"> </div> </div> <div class="col-md-3"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Title</label> <select class="form-control f-control" ng-model="boInfo[\'nominee_info\'][\'account_holder_title\']"> <option selected disabled>Select</option> <option value="Mr.">Mr.</option> <option value="Ms.">Ms.</option> </select> </div> </div> <div class="col-md-12 no-padding"> <p class="bg-co-white text">I / We nominate the following person(s) who is / are entitled to recieve securities outstanding in my / our account in the event of the death of the sole holders.</p> </div> </div> <div class="clearfix"> <div class="col-md-9"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Name of Nominee 1:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'nominee_1_name\']"> </div> </div> <div class="col-md-3"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Title</label> <select class="form-control f-control" ng-model="boInfo[\'nominee_info\'][\'nominee_1_type\']"> <option selected disabled>Select</option> <option value="Mr.">Mr.</option> <option value="Ms.">Ms.</option> </select> </div> </div> <div class="col-md-8"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Relationship with A/C Holder:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'nominee_1_relationship\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Percentage:%</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'nominee_1_percentage\']"> </div> </div> <div class="col-md-8"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Address:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'nominee_1_address\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Post Code:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'nominee_1_post_code\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Country</label> <select class="form-control f-control" ng-model="boInfo[\'nominee_info\'][\'nominee_1_country\']"> <option selected disabled>Select</option> <option value="Bangaladesh">Bangladesh</option> </select> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">State / Division:</label> <select class="form-control f-control" ng-model="boInfo[\'nominee_info\'][\'nominee_1_state\']"> <option selected disabled>Select</option> <option value="Barisal">Barisal</option> <option value="Chittagong">Chittagong</option> <option value="Dhaka">Dhaka</option> <option value="Khulna">Khulna</option> <option value="Rajshahi">Rajshahi</option> <option value="Rangpur">Rangpur</option> <option value="Sylhet">Sylhet</option> <option value="Mymensingh">Mymensingh</option> </select> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">City / Upazilla:</label> <input class="form-control f-control" ng-model="boInfo[\'nominee_info\'][\'nominee_1_city\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Telephone:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'nominee_1_telephone\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Mobile No:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'nominee_1_mobile\']"> </div> </div> <div class="col-md-8"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Passport No.</label> <input class="form-control f-control" type="number" ng-model="boInfo[\'nominee_info\'][\'nominee_1_passport\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Issue Place:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'nominee_1_passport_issue_place\']"> </div> </div> <div class="col-md-5 no-padding padding-left phone-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Issue Date:</label> <input class="form-control f-control" type="text" placeholder="Issue Date" ng-model="boInfo[\'nominee_info\'][\'nominee_1_passport_issue_date\']" ng-click="datePopup.nomineeInfo.nomineeOnePassportIssueDate.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.nomineeInfo.nomineeOnePassportIssueDate.opened" datepicker-options="dateOptions"> </div> </div> <div class="col-md-5 no-padding padding-left phone-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Expiry Date:</label> <input class="form-control f-control" type="text" placeholder="Issue Date" ng-model="boInfo[\'nominee_info\'][\'nominee_1_passport_expiry_date\']" ng-click="datePopup.nomineeInfo.nomineeOnePassportExpiryDate.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.nomineeInfo.nomineeOnePassportExpiryDate.opened" datepicker-options="dateOptions"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Residency:</label> <input class="form-control f-control" ng-model="boInfo[\'nominee_info\'][\'nominee_1_residency\']" type="text"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Nationality:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'nominee_1_nationality\']"> </div> </div> <div class="col-md-6 padding-left phone-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Date of Birth:</label> <input class="form-control f-control" type="text" placeholder="Date of Birth" ng-model="boInfo[\'nominee_info\'][\'nominee_1_dob\']" ng-click="datePopup.nomineeInfo.nomineeOneDob.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.nomineeInfo.nomineeOneDob.opened" datepicker-options="dateOptions"> </div> </div> <div class="col-md-8"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Name of Guardian: (if Nominee is a Minor)</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'nominee_1_name_of_guardian\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Title:</label> <select class="form-control f-control" ng-model="boInfo[\'nominee_info\'][\'nominee_1_guardian_title\']"> <option selected disabled>Select</option> <option value="Mr.">Mr.</option> <option value="Ms.">Ms.</option> </select> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label" style="font-size: 13px">Relationship with Nominee:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'nominee_1_relationship_minor\']"> </div> </div> <div class="col-md-6 phone-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Date of Birth of Minor:</label> <input class="form-control f-control" type="text" placeholder="Date of Birth of Minor:" ng-model="boInfo[\'nominee_info\'][\'nominee_1_minor_dob\']" ng-click="datePopup.nomineeInfo.nomineeOneMinorDob.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.nomineeInfo.nomineeOneMinorDob.opened" datepicker-options="dateOptions"> </div> </div> <div class="col-md-6 padding-left phone-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Maturity Date of Minor:</label> <input class="form-control f-control" type="text" placeholder="Maturity Date of Minor:" ng-model="boInfo[\'nominee_info\'][\'nominee_1_minor_maturity_date\']" ng-click="datePopup.nomineeInfo.nomineeOneMaturityDate.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.nomineeInfo.nomineeOneMaturityDate.opened" datepicker-options="dateOptions"> </div> </div> <div class="col-md-8"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Address:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'nominee_1_minor_address\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Post Code:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'nominee_1_minor_post_code\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Country</label> <select class="form-control f-control" ng-model="boInfo[\'nominee_info\'][\'nominee_1_minor_country\']"> <option selected disabled>Select</option> <option value="Bangaladesh">Bangladesh</option> </select> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">State / Division:</label> <select class="form-control f-control" ng-model="boInfo[\'nominee_info\'][\'nominee_1_minor_state\']"> <option selected disabled>Select</option> <option value="Barisal">Barisal</option> <option value="Chittagong">Chittagong</option> <option value="Dhaka">Dhaka</option> <option value="Khulna">Khulna</option> <option value="Rajshahi">Rajshahi</option> <option value="Rangpur">Rangpur</option> <option value="Sylhet">Sylhet</option> <option value="Mymensingh">Mymensingh</option> </select> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">City / Upazilla:</label> <input type="text" class="form-control f-control" ng-model="boInfo[\'nominee_info\'][\'nominee_1_minor_city\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Telephone:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'nominee_1_minor_telephone\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Mobile No:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'nominee_1_minor_mobile\']"> </div> </div> <div class="col-md-8"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Passport No.</label> <input class="form-control f-control" type="number" ng-model="boInfo[\'nominee_info\'][\'nominee_1_minor_passport_no\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Issue Place:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'nominee_1_minor_passport_issue_place\']"> </div> </div> <div class="col-md-5 no-padding padding-left phone-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Issue Date:</label> <input class="form-control f-control" type="text" placeholder="Issue Date" ng-model="boInfo[\'nominee_info\'][\'nominee_1_minor_passport_issue_date\']" ng-click="datePopup.nomineeInfo.nomineeOneMinorPassportIssueDate.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.nomineeInfo.nomineeOneMinorPassportIssueDate.opened" datepicker-options="dateOptions"> </div> </div> <div class="col-md-5 no-padding padding-left phone-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Expiry Date:</label> <input class="form-control f-control" type="text" placeholder="Issue Date" ng-model="boInfo[\'nominee_info\'][\'nominee_1_minor_passport_expiry_date\']" ng-click="datePopup.nomineeInfo.nomineeOneMinorPassportExpiryDate.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.nomineeInfo.nomineeOneMinorPassportExpiryDate.opened" datepicker-options="dateOptions"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Residency:</label> <input type="text" class="form-control f-control" ng-model="boInfo[\'nominee_info\'][\'nominee_1_minor_residency\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Nationality:</label> <input class="form-control f-control" type="text" ng-model="boInfo[\'nominee_info\'][\'nominee_1_minor_nationality\']"> </div> </div> <div class="col-md-12" ng-hide="boInfo[\'applicant_info\'][\'listed_company\'] == \'Yes\'"> <div class="b-o-form clearfix"> <button class="btn btn-form" type="submit">Submit</button> </div> </div> <!--<div class="col-md-4 no-padding padding-left phone-padding">--> <!--<div class="form-group  fr-group clearfix">--> <!--<label class=" no-padding c-label clearfix col-md-12">Date of Birth:</label>--> <!--<input class="form-control f-control" type="text" placeholder="Issue Date" ng-model="boInfo[\'nominee_info\'][\'nominee_1_minor_dob\']" >--> <!--</div>--> <!--</div>--></div></div>'
                ),
                a.put(
                    "views/boForm/powerOfAttorney.html",
                    '<h3 class="bio-heading">Power of attorney (POA)</h3> <div class="bio-form-section"> <div class="for-bg clearfix"> <div class="col-md-5"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Name of CDBL Participant:</label> <input class="form-control f-control f-active" ng-model="boInfo[\'power_of_attorney\'][\'cdbl_participant_name\']" type="text" placeholder="IDLC SECURITIES LIMITED"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">CDBL Participant ID:</label> <input class="form-control f-control f-active" ng-model="boInfo[\'power_of_attorney\'][\'cdbl_participant_id\']" type="text" placeholder="3 6 8 0 0"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Account Holder’s BO ID:</label> <input class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'account_holder_id\']" type="text"> </div> </div> <div class="col-md-9"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Short Name of Account Holder:<small class="small-text">(Abbreviate only if over 30 characters)</small></label> <input class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'account_holder_short_name\']" type="text"> </div> </div> <div class="col-md-3"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Title</label> <select class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'account_holder_title\']"> <option selected disabled>Select</option> <option value="Mr.">Mr.</option> <option value="Ms.">Ms.</option> </select> </div> </div> </div> <div class="clearfix"> <div class="col-md-9"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Name of Power of attorney Holder:</label> <input class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_name\']" type="text"> </div> </div> <div class="col-md-3"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Title</label> <select class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_title\']"> <option selected disabled>Select</option> <option value="Mr.">Mr.</option> <option value="Ms.">Ms.</option> </select> </div> </div> <div class="col-md-8"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Address</label> <input class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_address\']" type="text"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Postcode</label> <input class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_postcode\']" type="text"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Country</label> <select class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_country\']"> <option selected disabled>Select</option> <option value="Bangaladesh">Bangladesh</option> </select> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">State / Division:</label> <select class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_division\']"> <option selected disabled>Select</option> <option value="Barisal">Barisal</option> <option value="Chittagong">Chittagong</option> <option value="Dhaka">Dhaka</option> <option value="Khulna">Khulna</option> <option value="Rajshahi">Rajshahi</option> <option value="Rangpur">Rangpur</option> <option value="Sylhet">Sylhet</option> <option value="Mymensingh">Mymensingh</option> </select> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">City / Upazilla:</label> <input type="text" class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_upazilla\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Telephone:</label> <input class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_telephone\']" type="text"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Phone:</label> <input class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_phone\']" type="text"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Fax:</label> <input class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_fax\']" type="text"> </div> </div> <div class="col-md-6"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Email:</label> <input class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_email\']" type="Email"> </div> </div> <div class="col-md-8"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Passport No.</label> <input class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_passport_no\']" type="text"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Issue Place:</label> <input class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_issue_place\']" type="text"> </div> </div> <div class="col-md-5 no-padding padding-left phone-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Issue Date:</label> <div class="col-md-12 no-padding-left"> <div class="form-group fr-group clearfix"> <input class="form-control f-control" type="text" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_date\']" placeholder="Issue Date" ng-click="datePopup.powerOfAttorney.attorneyHolderDate.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.powerOfAttorney.attorneyHolderDate.opened" datepicker-options="dateOptions"> </div> </div> </div> </div> <div class="col-md-5 no-padding padding-left phone-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Expiry Date:</label> <div class="col-md-12 no-padding-left"> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_expire_date\']" type="text" placeholder="Expiry Date" ng-click="datePopup.powerOfAttorney.attorneyHolderExpireDate.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.powerOfAttorney.attorneyHolderExpireDate.opened" datepicker-options="dateOptions"> </div> </div> </div> </div> <div class="col-md-12"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Other Information of Power of Attorney Holder</label> <input class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_other_info\']" type="text"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Residency:</label> <input type="text" class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_residency\']"> </div> </div> <div class="col-md-4"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Nationality:</label> <input class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_nationality\']" type="text"> </div> </div> <div class="col-md-4 no-padding padding-left phone-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Date of Birth:</label> <div class="col-md-12 no-padding-left"> <div class="form-group fr-group clearfix"> <input class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_dob\']" type="text" placeholder="Date of Birth" ng-click="datePopup.powerOfAttorney.attorneyHolderDob.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.powerOfAttorney.attorneyHolderDob.opened" datepicker-options="dateOptions"> </div> </div> </div> </div> <div class="col-md-8 no-padding padding-left phone-padding"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label clearfix col-md-12">Power of Attorney Effective From:</label> <div class="col-md-4 no-padding-left"> <div class="form-group fr-group clearfix"> <input class="form-control f-control" type="text" ng-model="boInfo[\'power_of_attorney\'][\'attorney_effective_from\']" placeholder="Date" ng-click="datePopup.powerOfAttorney.attorneyEffectiveFrom.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.powerOfAttorney.attorneyEffectiveFrom.opened" datepicker-options="dateOptions"> </div> </div> <div class="col-md-1 no-padding-left"> <div class="form-group fr-group clearfix text-center"> TO </div> </div> <div class="col-md-4 no-padding-left"> <div class="form-group fr-group clearfix"> <input class="form-control f-control" type="text" ng-model="boInfo[\'power_of_attorney\'][\'attorney_effective_to\']" placeholder="Date" ng-click="datePopup.powerOfAttorney.attorneyEffectiveTo.open($event)" data-type="string" uib-datepicker-popup="yyyy/MM/dd" is-open="datePopup.powerOfAttorney.attorneyEffectiveTo.opened" datepicker-options="dateOptions"> </div> </div> </div> </div> <div class="col-md-12"> <div class="form-group fr-group clearfix"> <label class="no-padding c-label">Remarks: (Insert reference to POA document i.e. Specific POA or General POA etc.)</label> <input class="form-control f-control" ng-model="boInfo[\'power_of_attorney\'][\'attorney_holder_remarks\']" type="text"> </div> </div> <div class="col-md-12"> <div class="b-o-form clearfix"> <button class="btn btn-form" type="submit">Submit</button> </div> </div> </div> </div>'
                ),
                a.put(
                    "views/contactUs.html",
                    '<div class="banner-who" style="background-image:url({{data.titlePhoto.image}})"> <div class="d-table"> <div class="d-cell"> <!-- <h3>Contact us</h3> --> <h3>{{data.titlePhoto.title}}</h3> </div> </div> </div> <div class="contact-section"> <div class="container"> <div class="row"> <div class="contact-full-section"> <div class="col-md-6"> <div class="contact-left-section"> <h2>{{data.message.title}}</h2> <h5 ng-bind-html="data.message.text"></h5> <p ng-if="(data[\'locateUsTitle\'].text | removeHTMLTags) != \'N/A\'" ng-bind-html="data.locateUsTitle.text"></p> <h3>{{data.branches.topBranch.name}}</h3> <ul class="list-unstyled l-style"> <li> <a href=""><i class="fa fa-flag" aria-hidden="true"></i>{{data.branches.topBranch.address}}</a> </li> <li> <a href=""><i class="fa fa-envelope-o" aria-hidden="true"></i>{{data.branches.topBranch.email}}</a> </li> <li> <a href=""><i class="fa fa-phone" aria-hidden="true"></i>{{data.branches.topBranch.phone}}</a> </li><li> <a href=""><i class="fa fa-phone" aria-hidden="true"></i>+88 01730701644</a> </li> </ul> </div> </div> <div class="col-md-6"> <div class="form-slider-section contact-section-right"> <h2>Request for a Call</h2> <form-widget></form-widget> </div> </div> </div> </div> </div> </div> <div class="store-locator-container clarfix"> <div class="container"> <div class="row"> <div class="col-md-12"> <div class="page-heading"> <h3>Locate us</h3> </div> <div class="store-locator-content"> <div class="custom-map-header"> <div class="row"> <div class="col-md-3"> <div uib-dropdown> <button type="button" class="btn btn-dropdown btn-block" uib-dropdown-toggle>{{districtName}}<i class="fa fa-chevron-down pull-right" aria-hidden="true"></i> </button> <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button"> <li><a type="button" ng-click="districtFilter(\'All\')" href="javascript:void(0)">All </a></li> <li ng-repeat="marker in markers | unique:\'district\'"><a type="button" ng-click="districtFilter(marker.district)" href="javascript:void(0)">{{marker.district}}</a></li> <!--<li><a type="button" ng-click="districtFilter(\'dhaka\',\'Dhaka\')" href="javascript:void(0)">Dhaka</a></li>--> </ul> </div> </div> <div class="col-md-6"> <div class="form-group"> <input type="text" class="form-control" placeholder="Enter your location" g-places-autocomplete options="autocompleteOptions" ng-model="place"> </div> </div> <div class="col-md-3"> <div uib-dropdown> <!-- <a type="button" ng-init="toggleLayer(\'security\',\'IDLC Securities\')"></a> --> <button type="button" class="btn btn-dropdown btn-block" href="javascript:void(0)" ng-init="(\'security\',\'IDLC Securities\')">IDLC Securities </button> <!-- <button type="button" class="btn btn-dropdown btn-block" uib-dropdown-toggle>{{buttonText}} <i class="fa fa-chevron-down pull-right" aria-hidden="true"></i>\r\n                  </button> --> <!-- <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button"> --> <!-- <li><a type="button" ng-click="toggleLayer(\'all\',\'All\')" href="javascript:void(0)">All </a></li> --> <!-- <li><a type="button" ng-click="toggleLayer(\'security\',\'IDLC Securities\')" href="javascript:void(0)">IDLC Securities </a></li> --> <!-- <li><a type="button" ng-click="toggleLayer(\'finance\',\'IDLC Finance\')" href="javascript:void(0)">IDLC Finance</a></li> --> <!-- </ul> --> </div> <!--<ul>--> <!--<li ng-class="{active : catStatus === \'all\'}"><a type="button"  ng-click="toggleLayer(\'all\')" href="javascript:void(0)">All</a></li>--> <!--<li ng-class="{active : catStatus === \'qubeeStore\'}"><a type="button" ng-click="toggleLayer(\'qubeeStore\')" href="javascript:void(0)">QUBEE Store</a></li>--> <!--<li ng-class="{active : catStatus === \'brandedRetail\'}"><a type="button"  ng-click="toggleLayer(\'brandedRetail\')" href="javascript:void(0)">Branded Retail</a></li>--> <!--</ul>--> </div> </div> </div> <div class="custom-map-body clearfix"> <button class="nav-toggle nav-open btn" style="" ng-click="toggleStoreLocatorControl()"><i class="fa fa-bars" aria-hidden="true"></i></button> <div class="custom-map-sidebar {{storeLocatorControl}}"> <div class="store-locator-scroller"> <div class="text-center"> <button class="nav-open btn btn-close-sidebar" style="" ng-click="toggleStoreLocatorControl()"><i class="fa fa-times" aria-hidden="true"></i> Close</button> </div> <!-- {{markers.branches}} --> <!--<pre>{{ markers|json}}</pre>--> <ul class="list-unstyled"> <li ng-repeat="(key,val) in markers" ng-show="val.visible" ng-class="val.focus ? \'active\' : \'\'"> <a ng-click="updateMap(key)" href="javascript:void(0)"> <h4>{{val.name}}</h4> <p>{{val.address}}</p> <p>Telephone : {{val.phone }}</p> <p>Email : {{val.email}}</p> <p>Fax : {{val.fax}}</p> </a> </li> </ul> </div> </div> <div class="custom-map-layer-container"> <leaflet lf-center="london" markers="markers" layers="layers" width="100%" class="store-locator"></leaflet> </div> </div> </div> </div> </div> </div> </div>'
                ),
                a.put(
                    "views/directive/formWidget.html",
                    '<!--<pre>{{formData | json}}</pre>--> <form class="slider-form-section" ng-submit="postOrder()" ng-class="formHold?\'active\':\'\'"> <div class="form-group f-group"> <input type="text" class="form-control f-control" placeholder="Full Name" ng-model="formData.name" required> </div> <div class="form-group f-group"> <input type="text" class="form-control f-control" placeholder="Phone Number" numbers-only maxlength="11" minlength="11" ng-model="formData.phone" required> </div> <div class="input-group form-group f-group"> <input type="text" class="form-control f-control" placeholder="Select Date" ng-click="open($event)" uib-datepicker-popup="yyyy/MM/dd" ng-model="formData.date" is-open="popup.opened" ng-required="true"> <span class="input-group-btn"> <button type="button" class="btn btn-col-primary" ng-click="open($event)"><span class="fa fa-calendar" aria-hidden="true"></span></button> </span> </div> <div class="form-group f-group"> <input type="text" class="form-control f-control" placeholder="Nearest City" ng-model="formData.city" required> </div> <button type="submit" class="btn btn-form"> <i class="fa fa-phone" aria-hidden="true"></i>Call Me </button> </form>'
                ),
                a.put(
                    "views/directive/formWidgetBo.html",
                    '<!--<pre>{{formData | json}}</pre>--> <form class="slider-form-section" ng-submit="postOrder()" ng-class="formHold?\'active\':\'\'"> <div class="form-group f-group"> <input type="text" class="form-control f-control" placeholder="Name" ng-model="formData[\'account_holder\']" required> </div> <div class="form-group f-group"> <input type="text" class="form-control f-control" placeholder="Present Address" ng-model="formData[\'present_address\']" required> </div> <div class="form-group f-group"> <input type="text" class="form-control f-control" placeholder="Phone Number" numbers-only maxlength="11" minlength="11" ng-model="formData[\'present_phone\']" required> </div> <div class="form-group f-group"> <input type="text" class="form-control f-control" placeholder="Email" ng-model="formData[\'present_email\']" required> </div> <button type="submit" class="btn btn-form"> Open Account </button> </form>'
                ),
                a.put(
                    "views/download.html",
                    '<div class="banner-who" style="background-image:url({{data[\'titlePhoto\'].image}})"> <div class="d-table"> <div class="d-cell"> <h3>{{data[\'titlePhoto\'].title}}</h3> </div> </div> </div> <div class="bg-col-leader"> <div class="container"> <div class="row"> <div class="pro-leadership"> <h3 class="pro-leadership-top text-center">{{data.slogan.title}}</h3> <!--<p class="pro-leadership-paragraph text-center" ng-bind-html="data.slogan.text"></p>--> </div> <div class="slogan-description" ng-if="(data.slogan.text | removeHTMLTags) != \'N/A\'" ng-bind-html="data.slogan.text"></div> <!--<div class="bt-center-leader">--> <!--<ul class="list-inline text-center">--> <!--<li ng-class="type == \'\'?\'active\': \'\'">--> <!--<a href="" class="btn btn-leader btn-lead" ng-click="tabToggle(\'\')">All</a>--> <!--</li>--> <!--<li ng-repeat="(tab,value) in data.forms.type" ng-class="tab == type?\'active\': \'\'">--> <!--<a href="" class="btn btn-leader btn-lead" ng-click="tabToggle(tab)">{{value}}</a>--> <!--</li>--> <!--</ul>--> <!--</div>--> </div> <div class="row"> <div class="col-md-4" ng-repeat="download in data.forms.data"> <div class="download-images"> <img src="images/mask.d7fc1d04.png" alt=""> <h3 class="download-heading">{{download.title}}</h3> </div> <a ng-href="{{download[\'file\']}}" target="_blank" class="download-bottom"> <h3><i class="fa fa-cloud-download" aria-hidden="true"></i>Download</h3> </a> </div> </div> </div> </div>'
                ),
                a.put(
                    "views/footer.html",
                    '<div class="border-color-section no-border-section clearfix"> <div class="container"> <div class="row"> <div class="bottom-menu clearfix"> <ul class="list-inline text-center l-center"> <li><a href="//i-trade.idlc.com/Mobile/" target="_blank">i-Trade</a></li> <li ui-sref-active="active"><a ui-sref="whyInvestInBangladesh">Why Invest in Bangladesh</a></li> <li ui-sref-active="active"><a ui-sref="knowledgeBase.list">Digital Booth</a></li> <li><a href="//idlc.com/careers.php" target="_blank">Careers</a></li> <li ui-sref-active="active"><a ui-sref="contactUs">Contact us</a></li> </ul> </div> </div> </div> </div> <footer> <div class="container"> <div class="row"> <div class="footer-left clearfix"> <div class="col-md-6"> <div class="footer-logo"> <a href=""> <img ng-src="{{setting.setting.logo||\'images/logo.eba779e9.svg\'}}" alt=""> </a> </div> <div class="footer-paragarph"> <p>{{setting.setting.footerText}}</p> </div> </div> <div class="footer-right clearfix"> <div class="col-md-3"> <h3>{{setting.setting.socialTitle}}</h3> <ul class="list-inline l-lines"> <li ng-if="setting.setting.facebook"> <a target="_blank" href="{{setting.setting.facebook}}"><i class="fa fa-facebook-square" aria-hidden="true"></i></a> </li> <li ng-if="setting.setting.twitter"> <a target="_blank" href="{{setting.setting.twitter}}"><i class="fa fa-twitter-square" aria-hidden="true"></i></a> </li> <li ng-if="setting.setting.youtube"> <a target="_blank" href="{{setting.setting.youtube}}"><i class="fa fa-youtube-square" aria-hidden="true"></i></a> </li> <li ng-if="setting.setting.pinterest"> <a target="_blank" href="{{setting.setting.pinterest}}"><i class="fa fa-pinterest-square" aria-hidden="true"></i></a> </li> <li ng-if="setting.setting.googlePlus"> <a target="_blank" href="{{setting.setting.googlePlus}}"><i class="fa fa-google-plus-square" aria-hidden="true"></i></a> </li> <li ng-if="setting.setting.linkedin"> <a target="_blank" href="{{setting.setting.linkedin}}"> <i class="fa fa-linkedin" aria-hidden="true"></i> </a> </li> <li ng-if="setting.setting.instagram"> <a target="_blank" href="{{setting.setting.instagram}}"> <i class="fa fa-instagram" aria-hidden="true"></i> </a> </li> </ul> </div>  <div class="col-md-3"> <div class="mujib-logo"> <img src="https://investments.idlc.com/images/mujiblogo.jpg" width="100%"/> </div></div> </div> </div> </div> </div> </footer> <div class="footer-last"> <!--{{currentYear | date:\'yyyy\'}}--> <p>{{setting.setting.copyright}}</p> </div> <script type="text/ng-template" id="required-doc.html"><div class="modal-header">\r\n      <h3 class="modal-title" id="modal-title">{{researchData.slug.title}}</h3>\r\n    </div>\r\n    <div class="modal-body m-home-body" id="modal-body">\r\n      <div ng-if="(researchData.slug.text | removeHTMLTags) != \'N/A\'" ng-bind-html="researchData.slug.text"></div>\r\n    </div>\r\n    <div class="modal-footer modal-home-footer">\r\n      <button class="btn btn-normal btn-home-modal" type="button" ng-click="$ctrl.cancel()">Cancel</button>\r\n    </div></script> <script type="text/ng-template" id="modal-tnc.html"><div class="modal-header">\r\n      <h3 class="modal-title" id="modal-title">{{tnc.title}}</h3>\r\n    </div>\r\n    <div class="modal-body m-home-body" id="modal-body">\r\n      <div ng-if="(tnc.text | removeHTMLTags) != \'N/A\'" ng-bind-html="tnc.text"></div>\r\n    </div>\r\n    <div class="modal-footer modal-home-footer">\r\n      <button class="btn btn-normal btn-home-modal" type="button" ng-click="$ctrl.cancel()">Cancel</button>\r\n    </div></script> <script type="text/ng-template" id="modal-form.html"><div class="modal-header"> \r\n        <button class="close" ng-click="$ctrl.cancel()">x</button>\r\n        <h3 class="modal-title" id="modal-title">Need Discussion?</h3>\r\n    </div>\r\n    <div class="modal-body m-home-body m-home-body-s" id="modal-body">\r\n      <h2 class="home-modal-s">Request for a Call</h2>\r\n      <form-widget></form-widget>\r\n    </div>\r\n    <!-- <div class="modal-footer modal-home-footer">\r\n      <button class="btn btn-normal btn-home-modal" type="button" ng-click="$ctrl.cancel()">Cancel</button>\r\n    </div></script>'
                ),
                a.put(
                    "views/home.html",
                    '<div class="slider-secion"> <home-slider class="owl-carousel owl-theme home-slider"> <home-slider-item class="item" ng-repeat="item in data.slider"> <div class="slider-image" style="background-image:url({{item.image}})"> <div class="d-table"> <div class="d-cell"> <div class="container"> <div class="row"> <div class="slider-left-section"> <h1>{{item.title}}</h1> <p>{{item.description}}</p> <a href="{{item.action}}" class="btn btn-home"> {{item.actionTitle}} </a> </div> </div> </div> </div> </div> </div> </home-slider-item> </home-slider> </div> <div class="section-just-for clearfix"> <div class="container"> <div class="row"> <div class="just-for-heading"> <h6 class="just-for-des-heads">{{data[\'productAndService\'].slogan.title}}</h6> <h3 class="just-for-des-para" ng-if="(data[\'productAndService\'].slogan.text | removeHTMLTags) != \'N/A\'" ng-bind-html="data[\'productAndService\'].slogan.text"></h3> </div> </div> <div class="row"> <div class="just-for-description"> <div class="col-md-3" ng-repeat="product in data[\'productAndService\'].data"> <div class="just-for-des"> <img ng-src="{{product.homeImage}}" alt=""> <h3 class="justheads">{{product.title}}</h3> <p class="justpara">{{product.description}}</p> <a class="btn btn-customs" href="{{product.action}}">{{product.actionTitle}}</a> </div> </div> </div> </div> </div> </div> <div class="wh-choose-section"> <div class="container"> <div class="row"> <div class="just-for-heading just-for-head-second"> <h3 class="just-for-des-heads" ng-bind-html="data[\'whyChooseUs\'].slogan.title"></h3> <h6 class="just-for-des-para" ng-bind-html="data[\'whyChooseUs\'].slogan.text"></h6> </div> <div class="col-md-6"> <div class="embed-responsive embed-responsive-16by9" ng-show="(data.youtubeLink.text | removeHTMLTags) != \'N/A\'"> <!--{{data.youtubeLink.text}}--> <iframe class="embed-responsive-item" ng-src="{{data.youtubeLink.text | trusted}}"></iframe> </div> </div> <div class="col-md-6" ng-repeat="choose in data[\'whyChooseUs\'].data"> <div class="insight-section"> <div class="media insight-section-main"> <div class="media-left insight-section-left"> <img class="media-object" ng-src="{{choose.image}}" alt="{{choose.title}}"> </div> <div class="media-body insight-section-body"> <h4 class="media-heading insight-section-head">{{choose.title}}</h4> <p class="insight-section-paragraph">{{choose.description}}</p> </div> </div> </div> </div> </div> <div class="row"> <div class="bt-service text-center"> <a ui-sref="whatWeOffer.list" class="btn btn-service">Our Services</a> </div> </div> </div> </div> <div class="explore-section"> <div class="container"> <div class="row"> <div class="just-for-heading"> <h6 class="just-for-des-heads" ng-bind-html="data.report.slogan.title"></h6> <h3 class="just-for-des-para" ng-if="(data.report.slogan.text | removeHTMLTags) != \'N/A\'" ng-bind-html="data.report.slogan.text"></h3> </div> <div class="explore-section-main"> <div class="col-md-6" ng-repeat="report in data.report.data"> <div class="media explore-section-media"> <div class="media-left exploren-media-head"> <a target="_blank" href="{{report.file}}"> <img class="media-object" src="images/analytics.70805051.svg" alt="..."> </a> </div> <div class="media-body exploren-media-body"> <h4 class="media-heading exploren-media-he">{{report.title}}</h4> <div class="report-down-load"> <ul class="list-inline report-section-left"> <li class="active" ng-show="report.trendReport"> <span>Trend Report</span> </li> <li> <span>{{report.date}}</span> </li> </ul> <a target="_blank" href="{{report.file}}" class="report-section-right"> <i class="fa fa-download" aria-hidden="true"></i>Download Report </a> </div> </div> </div> </div> </div> </div> <div class="row"> <div class="bt-service bt-reports text-center"> <a ui-sref="research" class="btn btn-service">Explore More Reports</a> </div> </div> </div> </div> <!--<div class="knowledge-section">--> <!--<div class="container">--> <!--<div class="row">--> <!--<div class="just-for-heading">--> <!--<h6 class="just-for-des-heads">KNowledge is power</h6>--> <!--<h3 class="just-for-des-para">Get access to latest view</h3>--> <!--</div>--> <!--</div>--> <!--<div class="row">--> <!--<div class="bt-service text-center">--> <!--<a href="" class="btn btn-service">Explore More</a>--> <!--</div>--> <!--</div>--> <!--</div>--> <!--</div>--> <div class="bghome-cover"> <div class="bghome-table"> <div class="bghome-cell"> <div class="container"> <div class="row"> <div class="col-md-6"> <div class="bghome-left"> <h5 class="bghome-first"> It’s EASIER THAN EVER BEFORE</h5> <h3 class="bghome-second">Open a BO Account Online</h3> <h4 class="bghome-third"><a href="" ng-click="open(\'required-doc.html\',\'md\',data.boRequireDoc)"></a></h4> </div> </div> <div class="col-md-6"> <div class="form-slider-section bghome-right" style="min-height:350px; display:flex; flex-direction:column; justify-content:center"> <button type="submit" class="btn btn-form" style="width:100%;border-radius:10px"> <a href="https://cmdfs.idlc.com/capmktonlineonboarding/#/" target="_blank">Click Here to Open a BO Account</a> </button> </div> </div> </div> </div> </div> </div> </div> <div class="fixed-middle"> <a href="" class="btn btn-red" ng-click="open(\'modal-form.html\',\'sm\',data.boRequireDoc)"> <div class="icon"> <i class="fa fa-phone" aria-hidden="true"></i> </div> <span>Call me</span> </a> </div>'
                ),
                a.put(
                    "views/knowledgeBase.html",
                    '<!--<pre>{{data | json}}</pre>--> <div class="banner-who" style="background-image:url({{data[\'titlePhoto\'].image}})"> <div class="d-table"> <div class="d-cell"> <h3>{{data[\'titlePhoto\'].title}}</h3> </div> </div> </div> <div class="pro-bg-color bg-col-leader no-tab-space clearfix"> <div class="product-trade togle-btn clearfix"> <uib-tabset> <uib-tab heading="Location"><div class="container" style="text-align:center;"> <div class="row"><h3 class="pro-leadership-top text-center ng-binding">Will be updated shortly</h3></div></div></uib-tab><uib-tab heading="Services"><div class="container" style="text-align:center;"> <div class="row"><img src="https://idlc.com/securities/public/upload/images/DigitalBoothServices.jpg" alt=""></div></div></uib-tab><uib-tab heading="FAQ"> <div class="container"> <div class="row"> <div class="ex-article"> <div class="pro-leadership"> <h3 class="pro-leadership-top text-center ng-binding">Frequently Asked Questions</h3> </div> <!--<div class="bt-center-leader">--> <!--<ul class="list-inline text-center">--> <!--<li ng-class="type == \'\'?\'active\': \'\'">--> <!--<a href="" class="btn btn-leader btn-lead" ng-click="tabToggle(\'\')">All</a>--> <!--</li>--> <!--<li ng-class="type == \'\'?\'active\': \'\'">--> <!--<a href="" class="btn btn-leader btn-lead" ng-click="tabToggle(\'\')">Type 1</a>--> <!--</li>--> <!--<li ng-class="type == \'\'?\'active\': \'\'">--> <!--<a href="" class="btn btn-leader btn-lead" ng-click="tabToggle(\'\')">Typ</a>--> <!--</li>--> <!--</ul>--> <!--</div>--> <uib-accordion close-others="oneAtATime"> <div uib-accordion-group class="panel panel-customs panel-faq" ng-repeat="faq in data.knowledge.faqs" heading="{{faq.title}}"> <p>{{faq.content}}</p> </div> </uib-accordion> <!--<div class="panel-group" role="tablist" aria-multiselectable="true">--> <!--<div class="panel panel-customs panel-faq">--> <!--<div class="panel-heading p-heads panel-faq-head" role="tab">--> <!--<h4 class="panel-title panel-faq-title">--> <!--<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">--> <!--Why Invest in Bangladesh--> <!--</a>--> <!--</h4>--> <!--</div>--> <!--<div class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">--> <!--<div class="panel-body">--> <!--Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute,--> <!--non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,--> <!--sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,--> <!--craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings--> <!--occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven\'t heard of them accusamus--> <!--labore sustainable VHS.--> <!--</div>--> <!--</div>--> <!--</div>--> <!--</div>--> <!--<div class="panel-group" role="tablist" aria-multiselectable="true">--> <!--<div class="panel panel-customs panel-faq">--> <!--<div class="panel-heading p-heads panel-faq-head" role="tab">--> <!--<h4 class="panel-title panel-faq-title">--> <!--<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">--> <!--Why Invest in Bangladesh--> <!--</a>--> <!--</h4>--> <!--</div>--> <!--<div class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">--> <!--<div class="panel-body">--> <!--Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute,--> <!--non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,--> <!--sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,--> <!--craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings--> <!--occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven\'t heard of them accusamus--> <!--labore sustainable VHS.--> <!--</div>--> <!--</div>--> <!--</div>--> <!--</div>--> </div> </div> <div class="row"> <div class="know-single"> <h3 class="know-single-heading">How can (A)I help you? The rise of the bot in financial services</h3> <p class="know-single-description">Using data to truly understand consumers is the starting point for all of this. It’s critical that we learn not just who our customers are, but their behaviours, motivations, and intent. And digital data provides especially rich Julieta is a graphic designer and owner of ZkySky, a design studio which she co-founded in 1989 after earning a degree in Typeface Design. She lives and works in Montserrat, the first and oldest neighborhood in Buenos Aires. Julieta admires many type designers including Harald Geisler, and fellow Argentines Juan Pablo del Peral and Alejandro Paul. She is currently developing new variants of Montserrat—italics, plus new weights and styles—and dreams that it will soon become a large, extended family. Julieta is a graphic designer and owner of ZkySky, a design studio which she co-founded in 1989 after earning a degree in Typeface Design. She lives and works in Montserrat, the first and oldest neighborhood in Buenos Aires. Julieta admires many type designers including Harald Geisler, and fellow Argentines Juan Pablo del Peral and Alejandro Paul. She is currently developing new variants of Montserrat—italics, plus new weights and styles—and dreams that it will soon become a large, extended family. </p> <div class="konwledge-catagory"> <ul class="list-inline"> <li>Categories: </li> <li>Finance</li> <li>Finance</li> </ul> </div> </div> </div> </div> </uib-tab> </uib-tabset> </div> </div>'
                ),
                a.put("views/knowledgeBase/index.html", "<ui-view></ui-view>"),
                a.put(
                    "views/knowledgeBase/list.html",
                    '<!--<pre>{{data | json}}</pre>--> <div class="banner-who" style="background-image:url({{data[\'titlePhoto\'].image}})"> <div class="d-table"> <div class="d-cell"> <h3>{{data[\'titlePhoto\'].title}}</h3> </div> </div> </div> <div class="pro-bg-color bg-col-leader no-tab-space clearfix"> <div class="product-trade togle-btn clearfix"> <uib-tabset> <uib-tab heading="Location"><div class="container" style="text-align:center;"> <div class="row"><h3 class="pro-leadership-top text-center ng-binding"><img src="images/Booth_Bogura.png" alt="aaa"></h3></div></div></uib-tab><uib-tab heading="Services"><div class="container" style="text-align:center;"> <div class="row"><img src="https://idlc.com/securities/public/upload/images/DigitalBoothServices.jpg" alt=""></div></div></uib-tab><uib-tab heading="FAQ"> <h3 ng-show="data.knowledge.faqs.length == 0" class="pro-leadership-top aritic-space text-center">No FAQ</h3> <div class="container" ng-show="data.knowledge.faqs.length > 0"> <div class="row"> <div class="ex-article"> <div class="pro-leadership"> <h3 class="pro-leadership-top aritic-space text-center">Frequently Asked Questions</h3> </div> <!--<div class="bt-center-leader">--> <!--<ul class="list-inline text-center">--> <!--<li ng-class="type == \'\'?\'active\': \'\'">--> <!--<a href="" class="btn btn-leader btn-lead" ng-click="tabToggle(\'\')">All</a>--> <!--</li>--> <!--<li ng-class="type == \'\'?\'active\': \'\'">--> <!--<a href="" class="btn btn-leader btn-lead" ng-click="tabToggle(\'\')">Type 1</a>--> <!--</li>--> <!--<li ng-class="type == \'\'?\'active\': \'\'">--> <!--<a href="" class="btn btn-leader btn-lead" ng-click="tabToggle(\'\')">Typ</a>--> <!--</li>--> <!--</ul>--> <!--</div>--> <uib-accordion close-others="oneAtATime"> <div uib-accordion-group class="panel panel-customs panel-faq panel-width-auto panel-fq" ng-repeat="faq in data.knowledge.faqs" heading="{{faq.title}}"> <div ng-bind-html="faq.content"></div> </div> </uib-accordion> <!--<div class="panel-group" role="tablist" aria-multiselectable="true">--> <!--<div class="panel panel-customs panel-faq">--> <!--<div class="panel-heading p-heads panel-faq-head" role="tab">--> <!--<h4 class="panel-title panel-faq-title">--> <!--<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">--> <!--Why Invest in Bangladesh--> <!--</a>--> <!--</h4>--> <!--</div>--> <!--<div class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">--> <!--<div class="panel-body">--> <!--Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute,--> <!--non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,--> <!--sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,--> <!--craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings--> <!--occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven\'t heard of them accusamus--> <!--labore sustainable VHS.--> <!--</div>--> <!--</div>--> <!--</div>--> <!--</div>--> <!--<div class="panel-group" role="tablist" aria-multiselectable="true">--> <!--<div class="panel panel-customs panel-faq">--> <!--<div class="panel-heading p-heads panel-faq-head" role="tab">--> <!--<h4 class="panel-title panel-faq-title">--> <!--<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">--> <!--Why Invest in Bangladesh--> <!--</a>--> <!--</h4>--> <!--</div>--> <!--<div class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">--> <!--<div class="panel-body">--> <!--Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute,--> <!--non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,--> <!--sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,--> <!--craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings--> <!--occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven\'t heard of them accusamus--> <!--labore sustainable VHS.--> <!--</div>--> <!--</div>--> <!--</div>--> <!--</div>--> </div> </div> </div> </uib-tab> </uib-tabset> </div> </div>'
                ),
                a.put(
                    "views/knowledgeBase/single.html",
                    '<!--<pre>{{data | json}}</pre>--> <div class="banner-who" style="background-image:url({{singleData.knowledge.image}})"> <!--<div class="d-table">--> <!--<div class="d-cell">--> <!--<h3>{{data[\'titlePhoto\'].title}}</h3>--> <!--</div>--> <!--</div>--> </div> <div class="pro-bg-color bg-col-leader no-tab-space clearfix"> <div class="product-trade togle-btn clearfix"> <div class="row"> <div class="know-single"> <h3 class="know-single-heading">{{singleData.knowledge.title}}</h3> <p class="know-single-description" ng-bind-html="singleData.knowledge.content"></p> <!--<div class="konwledge-catagory">--> <!--<ul class="list-inline">--> <!--<li>Categories: </li>--> <!--<li>Finance</li>--> <!--<li>Finance</li>--> <!--</ul>--> <!--</div>--> </div> </div> </div> <!--<div class="container">--> <!--<div class="row">--> <!--<div class="also-like-section clearfix">--> <!--<h2 class="also-like-head">You may also read</h2>--> <!--<div class="card-section">--> <!--<multi-carousel-slider class="owl-carousel owl-theme">--> <!--<div class="item panel panel-sets" multi-carousel-slider-item="" ng-repeat="product in singleData.relatedKnowledge">--> <!--<div class="panel-body panel-sets-body">--> <!--<a ui-sref="whatWeOffer.single({id: product.slug})">--> <!--<img ng-src="{{product.image}}" alt="aaa">--> <!--<div class="card-text">--> <!--<p>{{product.title}}</p>--> <!--</div>--> <!--</a>--> <!--</div>--> <!--</div>--> <!--</multi-carousel-slider>--> <!--</div>--> <!--</div>--> <!--</div>--> <!--</div>--> </div>'
                ),
                a.put(
                    "views/marketWatch.html",
                    '<div class="loading" ng-class="loadStatus ? \'active\' : \'\'"></div> <div class="market-watch-section"> <div class="container"> <div class="row"> <div class="col-md-12"> <div class="heads"> {{data.slogan.title || \'Analytical View of the Market\'}} <div class="slogan-description" ng-if="(data.slogan.text | removeHTMLTags) != \'N/A\'" ng-bind-html="data.slogan.text"></div> </div> </div> </div> <div class="row"> <div class="space-t-section clearfix"> <div ng-if="(data.headers.theMarketToday.text | removeHTMLTags) != \'N/A\'" ng-bind-html="data.headers.theMarketToday.text" class="market-news-heading"> </div> <div class="col-md-6"> <div market-today=""></div> </div> <div class="col-md-6" style="margin-top:5px"> <div strength-meter=""></div> </div> </div> </div> <!-- <div class="row">\r\n          <div class="space-t-section clearfix">\r\n\r\n              <div class="col-md-6">\r\n\r\n              </div>\r\n          </div>\r\n        </div> --> <div class="row"> <div class="space-t-section clearfix"> <div ng-if="(data.headers.industryUpdate.text | removeHTMLTags) != \'N/A\'" ng-bind-html="data.headers.industryUpdate.text" class="market-news-heading"> </div> <div class="col-md-6"> <div industry-update=""></div> </div> <div class="col-md-6"> <div industry-update-gainer-looser=""></div> </div> </div> </div> <div class="row"> <div class="space-t-section clearfix"> <!-- <div top-chart=""></div> --> <!-- <h3 class="market-news-heading">Top Gainers/Losers</h3> --> <div ng-if="(data.headers.topGainersLosers.text | removeHTMLTags) != \'N/A\'" ng-bind-html="data.headers.topGainersLosers.text" class="market-news-heading"> </div> <div top-chart=""></div> </div> </div> <div class="row"> <!-- <div class="col-md-12"> --> <div class="space-t-section clearfix"> <!-- <div top-chart=""></div> --> <div ng-if="(data.headers.marketNews.text | removeHTMLTags) != \'N/A\'" ng-bind-html="data.headers.marketNews.text" class="market-news-heading"> </div> <div news-widget=""></div> </div> <!-- </div> --> </div> </div> </div>'
                ),
                a.put(
                    "views/marketWatch/industryUpdate.directive.html",
                    '<div class="single-chart"> <highchart config="barConfig" class="full-width-chart"></highchart> </div>'
                ),
                a.put(
                    "views/marketWatch/industryUpdateGainerLooser.directive.html",
                    '<div class="single-chart"> <!--<pre>{{gainerLooserConfig | json}}</pre>--> <highchart id="chart1" config="gainerLooserConfig" class="col-md-12"></highchart> </div>'
                ),
                a.put(
                    "views/marketWatch/marketToday.directive.html",
                    '<div class="single-chart"> <uib-tabset type="pills" class="pil-left"> <uib-tab heading="DSEX"> <highchart config="dsexChart" class="full-width-chart"></highchart> </uib-tab> <uib-tab heading="DSES"> <highchart config="dsesChart" class="full-width-chart"></highchart> </uib-tab> <uib-tab heading="DS30"> <highchart config="ds30Chart" class="full-width-chart"></highchart> </uib-tab> </uib-tabset> </div> <!-- {{chartConfig}} -->'
                ),
                a.put(
                    "views/marketWatch/newsWidget.directive.html",
                    '<div class="single-chart news-widget"> <ul class="list-unstyled list-space-up list-vertical"> <li ng-repeat="news in news"> <h1 class="news-heading">{{news[\'trade_code\']}}</h1> <p class="news-description">{{news.news}}</p> </li> </ul> </div>'
                ),
                a.put(
                    "views/marketWatch/strengthMeter.directive.html",
                    '<div class="single-chart"> <highchart id="chart1" config="pieConfig" class="full-width-chart"></highchart> </div>'
                ),
                a.put("views/marketWatch/test.directive.html", ""),
                a.put(
                    "views/marketWatch/topChart.directive.html",
                    '<uib-tabset type="pills" class="pil-right"> <uib-tab heading="Top Value"> <div class="top-chart-container"> <div class="table-responsive"> <table class="table table-striped table-bordered table-responsive"> <thead> <tr> <th>Stocks</th> <th>LTP</th> <th>%</th> <th>Value</th> <th>Volume</th> <th>Trade</th> <th>Price</th> <th>Volume</th> </tr> </thead> <tbody> <tr ng-repeat="value in topVal"> <td>{{value.TC}}</td> <td>{{value.LTP}}</td> <td> <i ng-show="value.YCP == value.LTP" class="fa fa-arrows-v" aria-hidden="true"></i> <i ng-show="value.YCP > value.LTP" class="fa fa-long-arrow-down" aria-hidden="true"></i> <i ng-show="value.YCP < value.LTP" class="fa fa-long-arrow-up" aria-hidden="true"></i> {{((value.LTP - value.YCP) * 100) / value.YCP | number:2}} % </td> <td>{{value.TTVal}}</td> <td>{{value.TTVol}}</td> <td>{{value.TT}}</td> <td style="width: 200px"> <highchart config="value.chart"></highchart> </td> <td style="width: 200px"> <highchart config="value.column"></highchart> </td> </tr> </tbody> </table> </div> </div> </uib-tab> <uib-tab heading="Top Gainer"> <div class="top-chart-container"> <div class="table-responsive"> <table class="table table-striped table-bordered table-responsive"> <thead> <tr> <th>Stocks</th> <th>LTP</th> <th>%</th> <th>Value</th> <th>Volume</th> <th>Trade</th> <th>Price</th> <th>Volume</th> </tr> </thead> <tbody> <tr ng-repeat="value in topGainer"> <td>{{value.TC}}</td> <td>{{value.LTP}}</td> <td> <i ng-show="value.YCP == value.LTP" class="fa fa-arrows-v" aria-hidden="true"></i> <i ng-show="value.YCP > value.LTP" class="fa fa-long-arrow-down" aria-hidden="true"></i> <i ng-show="value.YCP < value.LTP" class="fa fa-long-arrow-up" aria-hidden="true"></i> {{((value.LTP - value.YCP) * 100) / value.YCP | number:2}} % </td> <td>{{value.TTVal}}</td> <td>{{value.TTVol}}</td> <td>{{value.TT}}</td> <td style="width: 200px"> <highchart config="value.chart"></highchart> </td> <td style="width: 200px"> <highchart config="value.column"></highchart> </td> </tr> </tbody> </table> </div> </div> </uib-tab> <uib-tab heading="Top Loser"> <div class="top-chart-container"> <div class="table-responsive"> <table class="table table-striped table-bordered table-responsive"> <thead> <tr> <th>Stocks</th> <th>LTP</th> <th>%</th> <th>Value</th> <th>Volume</th> <th>Trade</th> <th>Price</th> <th>Volume</th> </tr> </thead> <tbody> <tr ng-repeat="value in topLooser"> <td>{{value.TC}}</td> <td>{{value.LTP}}</td> <td> <i ng-show="value.YCP == value.LTP" class="fa fa-arrows-v" aria-hidden="true"></i> <i ng-show="value.YCP > value.LTP" class="fa fa-long-arrow-down" aria-hidden="true"></i> <i ng-show="value.YCP < value.LTP" class="fa fa-long-arrow-up" aria-hidden="true"></i> {{((value.LTP - value.YCP) * 100) / value.YCP | number:2}} % </td> <td>{{value.TTVal}}</td> <td>{{value.TTVol}}</td> <td>{{value.TT}}</td> <td style="width: 200px"> <highchart config="value.chart"></highchart> </td> <td style="width: 200px"> <highchart config="value.column"></highchart> </td> </tr> </tbody> </table> </div> </div> </uib-tab> <uib-tab heading="Top Volume"> <div class="top-chart-container"> <div class="table-responsive"> <table class="table table-striped table-bordered table-responsive"> <thead> <tr> <th>Stocks</th> <th>LTP</th> <th>%</th> <th>Value</th> <th>Volume</th> <th>Trade</th> <th>Price</th> <th>Volume</th> </tr> </thead> <tbody> <tr ng-repeat="value in topVol"> <td>{{value.TC}}</td> <td>{{value.LTP}}</td> <td> <i ng-show="value.YCP == value.LTP" class="fa fa-arrows-v" aria-hidden="true"></i> <i ng-show="value.YCP > value.LTP" class="fa fa-long-arrow-down" aria-hidden="true"></i> <i ng-show="value.YCP < value.LTP" class="fa fa-long-arrow-up" aria-hidden="true"></i> {{((value.LTP - value.YCP) * 100) / value.YCP | number:2}} % </td> <td>{{value.TTVal}}</td> <td>{{value.TTVol}}</td> <td>{{value.TT}}</td> <td style="width: 200px"> <highchart config="value.chart"></highchart> </td> <td style="width: 200px"> <highchart config="value.column"></highchart> </td> </tr> </tbody> </table> </div> </div> </uib-tab> <uib-tab heading="Top Trade"> <div class="top-chart-container"> <div class="table-responsive"> <table class="table table-striped table-bordered"> <thead> <tr> <th>Stocks</th> <th>LTP</th> <th>%</th> <th>Value</th> <th>Volume</th> <th>Trade</th> <th>Price</th> <th>Volume</th> </tr> </thead> <tbody> <tr ng-repeat="value in topTrade"> <td>{{value.TC}}</td> <td>{{value.LTP}}</td> <td> <i ng-show="value.YCP == value.LTP" class="fa fa-arrows-v" aria-hidden="true"></i> <i ng-show="value.YCP > value.LTP" class="fa fa-long-arrow-down" aria-hidden="true"></i> <i ng-show="value.YCP < value.LTP" class="fa fa-long-arrow-up" aria-hidden="true"></i> {{((value.LTP - value.YCP) * 100) / value.YCP | number:2}} % </td> <td>{{value.TTVal}}</td> <td>{{value.TTVol}}</td> <td>{{value.TT}}</td> <td style="width: 200px"> <highchart config="value.chart"></highchart> </td> <td style="width: 200px"> <highchart config="value.column"></highchart> </td> </tr> </tbody> </table> </div> </div> </uib-tab> </uib-tabset>'
                ),
                a.put(
                    "views/nav.html",
                    '<nav class="navbar headerWrapper"> <div class="container"> <!-- Brand and toggle get grouped for better mobile display --> <div class="navbar-header"> <button type="button" class="navbar-toggle collapsed" ng-click="navOpen()"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand header-brand" ui-sref="home"> <img ng-src="{{setting.setting.logo||\'images/logo.eba779e9.svg\'}}" alt=""> </a> </div> <!-- Collect the nav links, forms, and other content for toggling --> <div class="collapse navbar-collapse"> <ul class="nav navbar-nav navbar-right header-right"> <li ui-sref-active="active"><a ui-sref="whoWeAre">Who We Are</a></li> <li ui-sref-active="active"><a ui-sref="whatWeOffer.list">What We Offer</a></li> <li ui-sref-active="active"><a ui-sref="research">Research</a></li> <li ui-sref-active="active"><a ui-sref="download">Download</a></li> </ul> </div><!-- /.navbar-collapse --> </div><!-- /.container-fluid --> </nav> <nav class="navbar headerWrapper-bottom"> <div class="container no-padding border-middle"> <div class="collapse navbar-collapse no-padding"> <ul class="nav navbar-nav navbar-left header-right"> <li><a href="//i-trade.idlc.com/Mobile/" target="_blank">i-Trade</a></li> <li ui-sref-active="active"><a ui-sref="marketWatch">Market Watch</a></li> <li ui-sref-active="active"><a ui-sref="whyInvestInBangladesh">Why Bangladesh ?</a></li> <li ui-sref-active="active"><a ui-sref="knowledgeBase.list">Digital Booth</a></li> <li><a href="//idlc.com/careers.php" target="_blank">Careers</a></li> <li ui-sref-active="active"><a ui-sref="contactUs">Contact us</a></li> <li><a href="https://cmdfs.idlc.com/capmktonlineonboarding/#/" target="_blank">OPEN A/C</a></li></ul> <ul class="nav navbar-nav navbar-right n-right"> <li> <form ng-submit="search()"> <div class="input-group"> <input type="text" class="form-control f-ct" ng-model="searchData.query" placeholder="Search"> <span class="input-group-btn"> <button class="btn btn-customs" type="submit"><i class="fa fa-search" aria-hidden="true"></i></button> </span> </div> </form> </li> </ul> </div><!-- /.navbar-collapse --> </div><!-- /.container-fluid --> </nav> <!--<div class="right-menu" style="font-size:20px;cursor:pointer" onclick="openNav()">&#9776;</span>--> <!--</div>--> <div class="sidenav list-unstyled" ng-class="navToggle?\'active\':\'\'"> <a href="javascript:void(0)" class="closebtn" ng-click="navOpen()">&times;</a> <!-- <li><a href="#">About</a></li>\r\n  <li><a href="#">About</a></li>\r\n  <li><a href="#">About</a></li>\r\n  <li><a href="#">About</a></li>\r\n  <li><a href="#">About</a></li> --> <li ui-sref-active="active"><a ui-sref="whoWeAre">Who We Are</a></li> <li ui-sref-active="active"><a ui-sref="whatWeOffer.list">What We Offer</a></li> <li ui-sref-active="active"><a ui-sref="research">Research</a></li> <li ui-sref-active="active"><a ui-sref="download">Download</a></li>  <li ui-sref-active="active"><a href="//idlc.com/trade/" target="_blank">i-Trade</a></li> <li ui-sref-active="active"> <a ui-sref="marketWatch">Market Watch</a> </li> <li ui-sref-active="active"><a ui-sref="whyInvestInBangladesh">Why Bangladesh ?</a></li> <li ui-sref-active="active"><a ui-sref="knowledgeBase.list">Digital Booth</a></li> <li><a href="//idlc.com/careers.php" target="_blank">Careers</a></li> <li ui-sref-active="active"><a ui-sref="contactUs">Contact us</a></li> <li> <div class="input-group"> <input type="text" class="form-control f-ct" placeholder="Search"> <span class="input-group-btn"> <button class="btn btn-customs bt-phone-btn" type="button"><i class="fa fa-search" aria-hidden="true"></i></button> </span> </div> </li> </div>'
                ),
                a.put(
                    "views/research.html",
                    '<div class="banner-who" style="background-image:url({{data[\'titlePhoto\'].image}})"> <div class="d-table"> <div class="d-cell"> <h3>{{data[\'titlePhoto\'].title}}</h3> </div> </div> </div> <div class="bg-col-leader padding-bottom-no"> <div class="container"> <div class="row"> <div class="togle-btn"> <!--<ul class="list-inline text-center">--> <!--<li class="active">--> <!--<a href="" class="btn btn-report">Reports</a>--> <!--</li>--> <!--<li>--> <!--<a href="" class="btn btn-team">Team</a>--> <!--</li>--> <!--</ul>--> <uib-tabset> <uib-tab heading="Reports"> <div class="pro-leadership"> <h3 class="pro-leadership-top text-center">{{data.research.reports.slogan.title}}</h3> <p class="pro-leadership-paragraph text-center" ng-if="(data.research.reports.slogan.text | removeHTMLTags) != \'N/A\'" ng-bind-html="data.research.reports.slogan.text"></p> </div> <div class="bt-center-leader" ng-show="data.research.reports.data.length > 0"> <ul class="list-inline text-center"> <li ng-class="type == \'\'?\'active\': \'\'"> <a href="" class="btn btn-leader btn-lead" ng-click="tabToggle(\'\')">All</a> </li> <li ng-class="tab == type?\'active\': \'\'" ng-repeat="(tab,value) in data.research.reports.type"> <a href="" class="btn btn-leader btn-lead" ng-click="tabToggle(tab)">{{value}}</a> </li> </ul> </div> <div class="row"> <div class="explore-section-hds explore-section-main clearfix"> <div class="col-md-6" ng-repeat="report in data.research.reports.data | filter:type"> <div class="media explore-section-media"> <div class="media-left exploren-media-head"> <a target="_blank" href="{{report[\'file\']}}"> <img class="media-object" src="images/analytics.70805051.svg" alt="..."> </a> </div> <div class="media-body exploren-media-body"> <h4 class="media-heading exploren-media-he">{{report.title}}</h4> <div class="report-down-load"> <ul class="list-inline report-section-left"> <li class="active" ng-show="report[\'trendReport\']"> <span>Trend Report </span> </li> <li> <a href="">{{report.date}}</a> </li> </ul> <a href="{{(report.type !== \'premium\') ? report[\'file\'] : \'javascript:void(0);\' }}" ng-click="report.type == \'premium\' ? open(\'myModalContent.html\',\'sm\',report[\'file\']) : \'\'" class="report-section-right"> <i class="fa fa-download" aria-hidden="true"></i>Download Report </a> </div> </div> </div> </div> </div> </div> </uib-tab> <uib-tab heading="Team"> <div class="pro-leadership"> <h3 class="pro-leadership-top text-center">{{data.research.reports.slogan.title}}</h3> <p class="pro-leadership-paragraph text-center" ng-if="(data.research.reports.slogan.text | removeHTMLTags) != \'N/A\'" ng-bind-html="data.research.reports.slogan.text"></p> </div> <uib-accordion close-others="oneAtATime"> <div class="col-md-6" ng-repeat="group in data.research.teams.data"> <div uib-accordion-group class="panel-director"> <uib-accordion-heading> <div class="media"> <div class="media-left media-middle"><img alt="aaa" class="media-object" ng-src="{{group.image}}"></div> <div class="media-body media-middle media-board-body"> <h4>{{group.name}}</h4> <p>{{group.designation}}</p> <!-- <h5>{{group[\'member_of\']}}</h5> --> </div> <div class="media-right m-right media-middle"> </div> </div> </uib-accordion-heading> <div class="board-section-middle"> <div class="row"> <!-- <div class="col-md-4">\r\n                        <div class="left-board-head">\r\n                          Nominated by:\r\n                        </div>\r\n                      </div> --> <!-- <div class="col-md-8">\r\n                        <div class="right-board-head">\r\n                          {{group[\'nominated_by\']}}\r\n                        </div>\r\n                      </div> --> </div> <div class="row"> <div class="col-md-4"> <!-- <div class="left-board-head">\r\n                          Business Address:\r\n                        </div> --> </div> <div class="col-md-8"> <div class="right-board-head"> {{group[\'business_address\']}} </div> </div> </div> <div class="row"> <div class="col-md-4"> <div class="left-board-head"> Short Bio: </div> </div> <div class="col-md-8"> <div class="right-board-head"> {{group[\'short_bio\']}} </div> </div> </div> </div> </div> </div> </uib-accordion> </uib-tab> </uib-tabset> </div> </div> </div> <div class="bghome-cover"> <div class="bghome-table"> <div class="bghome-cell"> <div class="container"> <div class="row"> <div class="col-md-6"> <div class="bghome-left"> <h5 class="bghome-first"> It’s EASIER THAN EVER BEFORE</h5> <h3 class="bghome-second">Open a BO Account</h3> <h4 class="bghome-third"><a href="" ng-click="open(\'required-doc.html\',\'md\')">Check Required Documents List</a></h4> </div> </div> <div class="col-md-6"> <div class="form-slider-section bghome-right"> <form-widget-bo></form-widget-bo> </div> </div> </div> </div> </div> </div> </div> <div class="modal-demo"> <script type="text/ng-template" id="myModalContent.html"><div class="modal-header">\r\n        <h3 class="modal-title" id="modal-title">Please Fill up the form to download the report</h3>\r\n      </div>\r\n      <div class="modal-body" id="modal-body">\r\n        <form name="researchForm" ng-submit="submit()">\r\n          <div class="form-group">\r\n            <input type="text" class="form-control" placeholder="Name" ng-model="researchData.username"/>\r\n          </div>\r\n          <div class="form-group">\r\n            <input type="password" class="form-control" placeholder="password" ng-model="researchData.password"/>\r\n          </div>\r\n          <div class="bt-service-sub text-center list-inline">\r\n            <button type="submit" class="btn btn-ser">Submit</button>\r\n            <button class="btn btn-normal" type="button" ng-click="$ctrl.cancel()">Cancel</button>\r\n          </div>\r\n        </form>\r\n      </div></script> </div> </div>'
                ),
                a.put(
                    "views/search.html",
                    '<div class="bg-col-leader big-padding"> <div class="container"> <div class="row"> <div class="col-md-12"> <div class="serach-heading"> <h3>You have searched for: <span class="color-red">{{query.query}}</span></h3> </div> </div> </div> <div class="row"> <div class="search-media" ng-repeat="(key, value) in results.result"> <h3>{{key | camelCase}}</h3> <div class="media search-media-section" ng-repeat="result in value"> <div class="media-left media-middle"> <a ng-href="{{\'#!/\'+result.url}}"> <img class="media-object" src="images/magnifying-glass.2194b72f.svg" alt="..."> </a> </div> <div class="media-body search-media-body media-middle"> <ul class="list-inline search-media-list"> <li> <a ng-href="{{\'#!/\'+result.url}}">{{result.title}}</a> </li> </ul> <p class="search-media-paragraph">{{result.description}}</p> </div> </div> </div> <div class="result-not-found text-center" ng-show="results.result.length == 0"> <h3>UH OH !</h3> <p>we looked everywhere , couldn’t find what you’re looking for. Please make sure you spelled everything correctly</p> </div> </div> </div> </div>'
                ),
                a.put("views/sellSideResearch.html", "<h3>sellSideResearch</h3>"),
                a.put("views/shiam/Sdownload.html", "<h3>Sdownload</h3>"),
                a.put(
                    "views/shiam/Shome.html",
                    "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda atque culpa doloremque, laboriosam, maiores nobis provident quaerat quidem ratione recusandae rem unde velit, voluptas! Animi cupiditate eveniet fugit minus sed!</p>"
                ),
                a.put("views/shiam/SmarketWatch.html", "<h3>SmarketWatch</h3>"),
                a.put("views/shiam/Sresearch.html", "<h3>Sresearch</h3>"),
                a.put(
                    "views/shiam/SsellSideResearch.html",
                    "<h3>SsellSideResearch</h3>"
                ),
                a.put("views/shiam/SsingleOffer.html", "<h3>SsingleOffer</h3>"),
                a.put("views/shiam/Steam.html", "<h3>Steam</h3>"),
                a.put(
                    "views/shiam/SwhatWeOffer.html",
                    '<nav class="navbar headerWrapper"> <div class="container"> <!-- Brand and toggle get grouped for better mobile display --> <div class="navbar-header"> <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand header-brand" href="#"> <img src="images/logo.eba779e9.svg" alt=""> </a> </div> <!-- Collect the nav links, forms, and other content for toggling --> <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"> <ul class="nav navbar-nav navbar-right header-right"> <li><a href="#">Who We Are</a></li> <li><a href="#">What We Offer</a></li> <li><a href="#">Research</a></li> <li><a href="#">Download</a></li> <li class="dropdown">  <!--<ul class="dropdown-menu">\r\n            <li><a href="#">Action</a></li>\r\n            <li><a href="#">Action</a></li>\r\n            <li><a href="#">Action</a></li>\r\n          </ul>--> </li> </ul> </div><!-- /.navbar-collapse --> </div><!-- /.container-fluid --> </nav> <nav class="navbar headerWrapper-bottom"> <div class="container no-padding border-middle"> <!-- Brand and toggle get grouped for better mobile display --> <div class="navbar-header"> <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> </div> <!-- Collect the nav links, forms, and other content for toggling --> <div class="collapse navbar-collapse no-padding" id="bs-example-navbar-collapse-1"> <ul class="nav navbar-nav navbar-left header-right"> <li><a href="#">Who We Are</a></li> <li><a href="#">What We Offer</a></li> <li><a href="#">Research</a></li> <li><a href="#">Download</a></li> <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a> <ul class="dropdown-menu"> <li><a href="#">Action</a></li> <li><a href="#">Action</a></li> <li><a href="#">Action</a></li> </ul> </li> </ul> <ul class="nav navbar-nav navbar-right n-right"> <li> <div class="input-group"> <input type="text" class="form-control f-ct" placeholder="Search"> <span class="input-group-btn"> <button class="btn btn-customs" type="button"><i class="fa fa-search" aria-hidden="true"></i></button> </span> </div> </li> </ul> </div><!-- /.navbar-collapse --> </div><!-- /.container-fluid --> </nav>'
                ),
                a.put("views/shiam/SwhoWeAre.html", "<h3>SwhoWeAre</h3>"),
                a.put(
                    "views/shiam/SwhyInvestInBangladesh.html",
                    "<h3>SwhyInvestInBangladesh</h3>"
                ),
                a.put(
                    "views/shiam/innerPage.html",
                    '<div id="container"> <ul class="list-unstyled"> <li><a href="">Menu 1</a></li> <li><a href="">Menu 2</a></li> </ul> <ui-view></ui-view> </div>'
                ),
                a.put(
                    "views/shiam/main.html",
                    '<div class="jumbotron"> <h1>\'Allo, \'Allo!</h1> <p class="lead"> <img src="../../images/yeoman.c582c4d1.png" alt="I\'m Yeoman"><br> Always a pleasure scaffolding your apps. </p> <p><a class="btn btn-lg btn-success" ng-href="#/">Splendid!<span class="glyphicon glyphicon-ok"></span></a></p> </div> <div class="row marketing"> <h4>HTML5 Boilerplate</h4> <p> HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites. </p> <h4>Angular</h4> <p> AngularJS is a toolset for building the framework most suited to your application development. </p> <h4>Karma</h4> <p>Spectacular Test Runner for JavaScript.</p> </div>'
                ),
                a.put("views/shiam/single.html", "<h3>Single</h3> <ui-view></ui-view>"),
                a.put(
                    "views/whatWeOffer.html",
                    '<div class="banner-who" style="background-image:url(../images/bg.d9faabd3.jpg)"> <div class="d-table"> <div class="d-cell"> <h3>What we offer</h3> </div> </div> </div> <div class="tab"> </div> <div class="pro-bg-color clearfix"> <div class="product-trade togle-btn clearfix"> <uib-tabset> <uib-tab heading="Default Size"> <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad cumque distinctio dolorem doloremque eligendi fugit id, iusto laboriosam magnam modi molestias quibusdam repellat repudiandae saepe soluta? Commodi eos quasi quo.</p> </uib-tab> <uib-tab heading="Small Button" classes="btn-sm"> Tab 2 content </uib-tab> </uib-tabset> <!-- <ul class="list-inline">\r\n      <li class="active">\r\n        <a href="">Products</a>\r\n      </li>\r\n      <li>\r\n        <a href="">Trading</a>\r\n      </li>\r\n    </ul> --> </div> <div class="container"> <div class="row"> <div class="product-sec"> <h1 class="prodouct-heading">Our Products</h1> <p class="product-description">We believe that continuous improvement of our products, processes, services, and skills provides long-term success for our employees, dealers, and customers.</p> </div> </div> <div class="row"> <div class="card-section"> <div class="panel panel-sets col-md-4"> <div class="panel-body panel-sets-body"> <a href=""> <img src="images/card-image.5ea2878e.png" alt="aaa"> <div class="card-text"> Execution Brokerage </div> </a> </div> </div> <div class="panel panel-sets col-md-4"> <div class="panel-body panel-sets-body"> <a href=""> <img src="images/card-image.5ea2878e.png" alt="aaa"> <div class="card-text"> Execution Brokerage </div> </a> </div> </div> <div class="panel panel-sets col-md-4"> <div class="panel-body panel-sets-body"> <a href=""> <img src="images/card-image.5ea2878e.png" alt="aaa"> <div class="card-text"> Execution Brokerage </div> </a> </div> </div> </div> </div> </div> </div> <div class="chose-section"> <h3 class="ch-heading">Why Choose us?</h3> <div class="chose-focus-section clearfix"> <div class="col-md-6"> <div class="media chose-media"> <div class="media-left md-left"> <a href="#"> <img class="media-object" src="images/shape2.c9fabdeb.svg" alt="..."> </a> </div> <div class="media-body m-body"> <h4 class="media-heading m-head">Focusing on Clients</h4> <p class="m-para">The past few years have seen a dramatic change in the public perception of cosmetic surgery.</p> </div> </div> </div> <div class="col-md-6"> <div class="media chose-media"> <div class="media-left md-left"> <a href="#"> <img class="media-object" src="images/shape2.c9fabdeb.svg" alt="..."> </a> </div> <div class="media-body m-body"> <h4 class="media-heading m-head">Focusing on Clients</h4> <p class="m-para">The past few years have seen a dramatic change in the public perception of cosmetic surgery.</p> </div> </div> </div> <div class="col-md-6"> <div class="media chose-media"> <div class="media-left md-left"> <a href="#"> <img class="media-object" src="images/shape2.c9fabdeb.svg" alt="..."> </a> </div> <div class="media-body m-body"> <h4 class="media-heading m-head">Focusing on Clients</h4> <p class="m-para">The past few years have seen a dramatic change in the public perception of cosmetic surgery.</p> </div> </div> </div> <div class="col-md-6"> <div class="media chose-media"> <div class="media-left md-left"> <a href="#"> <img class="media-object" src="images/shape2.c9fabdeb.svg" alt="..."> </a> </div> <div class="media-body m-body"> <h4 class="media-heading m-head">Focusing on Clients</h4> <p class="m-para">The past few years have seen a dramatic change in the public perception of cosmetic surgery.</p> </div> </div> </div> </div> </div> <div class="border-color-section clearfix"> <div class="container"> <div class="row"> <div class="bottom-menu clearfix"> <ul class="list-inline text-center l-center"> <li> <a href="">Who We Are</a> </li> <li> <a href="">Who We Are</a> </li> <li> <a href="">Market Watch</a> </li> <li> <a href="">Who We Are</a> </li> <li> <a href="">Market Watch</a> </li> <li> <a href="">Who We Are</a> </li> <li> <a href="">Why Invest in Bangladesh</a> </li> <li> <a href="">Who We Are</a> </li> </ul> </div> </div> </div> </div> <ui-view></ui-view>'
                ),
                a.put("views/whatWeOffer/index.html", "<ui-view></ui-view>"),
                a.put(
                    "views/whatWeOffer/list.html",
                    '<div class="banner-who" style="background-image:url({{data[\'titlePhoto\'].image}})"> <div class="d-table"> <div class="d-cell"> <h3>{{data[\'titlePhoto\'].title}}</h3> </div> </div> </div> <div class="pro-bg-color clearfix"> <div class="product-trade togle-btn clearfix"> <div class="container"> <div class="row"> <div class="card-section"> <div class="panel panel-sets col-md-4" ng-repeat="item in data.products"> <div class="panel-body panel-sets-body"> <a ui-sref="whatWeOffer.single({id: item.slug})"> <img ng-src="{{item.thumbnailImage}}" alt="aaa"> <div class="card-text"> <p>{{item.title}}</p> </div> </a> </div> </div> </div> </div> </div> <!--<uib-tabset>--> <!--<uib-tab heading="Products">--> <!--<div class="container">--> <!--<div class="row">--> <!--<div class="product-sec">--> <!--<h1 class="prodouct-heading">{{data.products.products.slogan.title}}</h1>--> <!--<p class="product-description">{{data.products.products.slogan.text}}</p>--> <!--</div>--> <!--</div>--> <!--<div class="row">--> <!--<div class="card-section">--> <!--<div class="panel panel-sets col-md-4" ng-repeat="item in data.products.products.items">--> <!--<div class="panel-body panel-sets-body">--> <!--<a ui-sref="whatWeOffer.single({id: item.slug})">--> <!--<img ng-src="{{item.image}}" alt="aaa">--> <!--<div class="card-text">--> <!--<p>{{item.title}}</p>--> <!--</div>--> <!--</a>--> <!--</div>--> <!--</div>--> <!--</div>--> <!--</div>--> <!--</div>--> <!--</uib-tab>--> <!--<uib-tab heading="Trading">--> <!--<div class="container">--> <!--<div class="row">--> <!--<div class="product-sec">--> <!--<h1 class="prodouct-heading">{{data.products.tradings.slogan.title}}</h1>--> <!--<p class="product-description">{{data.products.tradings.slogan.text}}</p>--> <!--</div>--> <!--</div>--> <!--<div class="row">--> <!--<div class="card-section">--> <!--<div class="panel panel-sets col-md-4" ng-repeat="item in data.products.tradings.items">--> <!--<div class="panel-body panel-sets-body">--> <!--<a ui-sref="whatWeOffer.single({id: item.slug})">--> <!--<img ng-src="{{item.image}}" alt="aaa">--> <!--<div class="card-text">--> <!--<p>{{item.title}}</p>--> <!--</div>--> <!--</a>--> <!--</div>--> <!--</div>--> <!--</div>--> <!--</div>--> <!--</div>--> <!--</uib-tab>--> <!--</uib-tabset>--> </div> </div> <div class="chose-section"> <h3 class="ch-heading">{{data.whyChooseUs.slogan}}</h3> <div class="chose-focus-section clearfix"> <div class="col-md-6" ng-repeat="whyChooseUs in data.whyChooseUs.data"> <div class="media chose-media"> <div class="media-left md-left"> <img class="media-object" ng-src="{{whyChooseUs.image}}" alt="..."> </div> <div class="media-body m-body"> <h4 class="media-heading m-head">{{whyChooseUs.title}}</h4> <p class="m-para">{{whyChooseUs.description}}</p> </div> </div> </div> </div> </div>'
                ),
                a.put(
                    "views/whatWeOffer/single.html",
                    '<div class="banner-who" style="background-image:url({{singleData.productType.image}})"> <div class="d-table"> <div class="d-cell"> <h3>{{singleData.productType.title}}</h3> </div> </div> </div> <div class="tab-heads"> <uib-tabset> <uib-tab heading="{{product.title}}" ng-repeat="product in singleData.products"> <div class="offer-detail-color"> <div class="container"> <div class="row"> <div class="offer-detail-heading"> {{product.options.feature.title}} </div> </div> <div class="row"> <div class="offer-tick-section clearfix" ng-if="product.options.feature.options"> <div class="col-md-6" ng-repeat="feature in product.options.feature.options track by $index"> <div class="media tick-section"> <div class="media-left media-middle tick-section-left"> <img class="media-object" src="images/checked.5d0d65e4.svg" alt="..."> </div> <div class="media-body tick-body"> <h4 class="media-heading tick-heading">{{feature}}</h4> </div> </div> </div> </div> </div> <div class="row"> <div class="offer-benifite"> <div class="benifited-class"> <div class="benifited-heading"> {{product.options.benefit.title}} </div> <div class="benefited-description text-left" ng-bind-html="product.options.benefit.options[0]"> <!--<ul class="list-unstyled">--> <!--<li ng-repeat="benefit in product.options.benefit.options track by $index">{{$index+1}}. {{benefit}}</li>--> <!--</ul>--> </div> </div> <div class="benifited-class"> <div class="benifited-heading"> {{product.options.process.title}} </div> <div class="benefited-description text-left" ng-bind-html="product.options.process.options[0]"> <!--<ul class="list-unstyled">--> <!--<li ng-repeat="benefit in product.options.benefit.options track by $index">{{$index+1}}. {{benefit}}</li>--> <!--</ul>--> </div> </div> <!--<uib-accordion close-others="oneAtATime">--> <!--<div uib-accordion-group  class="panel-customs" is-open="true">--> <!--<uib-accordion-heading>--> <!--{{product.options.process.title}}--> <!--</uib-accordion-heading>--> <!--<ul class="list-unstyled">--> <!--<li ng-repeat="process in product.options.process.options">{{$index+1}}. {{process}}</li>--> <!--</ul>--> <!--</div>--> <!--</uib-accordion>--> <div class="bt-apply text-center"> <a ui-sref="boAccount" class="btn btn-customs">Apply Now</a> </div> </div> </div> </div> </div> </uib-tab> <!--<uib-tab heading="Trading">--> <!--<div class="container">--> <!--<div class="row">--> <!--<div class="product-sec">--> <!--<h1 class="prodouct-heading">{{data.products.tradings.slogan.title}}</h1>--> <!--<p class="product-description">{{data.products.tradings.slogan.text}}</p>--> <!--</div>--> <!--</div>--> <!--<div class="row">--> <!--<div class="card-section">--> <!--<div class="panel panel-sets col-md-4" ng-repeat="item in data.products.tradings.items">--> <!--<div class="panel-body panel-sets-body">--> <!--<a ui-sref="whatWeOffer.single({id: item.slug})">--> <!--<img ng-src="{{item.image}}" alt="aaa">--> <!--<div class="card-text">--> <!--<p>{{item.title}}</p>--> <!--</div>--> <!--</a>--> <!--</div>--> <!--</div>--> <!--</div>--> <!--</div>--> <!--</div>--> <!--</uib-tab>--> </uib-tabset> <div class="container"> <div class="row"> <div class="also-like-section clearfix"> <h3 class="also-like-head">You may also check those Services</h3> <div class="card-section"> <multi-carousel-slider class="owl-carousel owl-theme"> <div class="item panel panel-sets" multi-carousel-slider-item="" ng-repeat="product in singleData.relatedProducts"> <div class="panel-body panel-sets-body"> <a ui-sref="whatWeOffer.single({id: product.slug})"> <img ng-src="{{product.thumbnailImage}}" alt="aaa"> <div class="card-text"> <p>{{product.title}}</p> </div> </a> </div> </div> </multi-carousel-slider> <!--<div class="panel panel-sets col-md-4" ng-repeat="product in singleData.relatedProducts">--> <!--<div class="panel-body panel-sets-body">--> <!--<a ui-sref="whatWeOffer.single({id: product.slug})">--> <!--<img ng-src="{{product.image}}" alt="aaa">--> <!--<div class="card-text">--> <!--<p>{{product.title}}</p>--> <!--</div>--> <!--</a>--> <!--</div>--> <!--</div>--> </div> </div> </div> </div></div>'
                ),
                a.put("views/whatWeOfferSingle.html", "<h3>whatWeOffer Single</h3>"),
                a.put(
                    "views/whoWeAre.html",
                    '<div class="banner-who" style="background-image:url({{data.titlePhoto.image}})"> <div class="d-table"> <div class="d-cell"> <h3>{{data.titlePhoto.title}}</h3> </div> </div> </div> <div class="improve-section"> <div class="container"> <div class="row"> <div class="improve-heads"> {{data.slogan.title}} <div class="slogan-description" ng-if="(data.slogan.text | removeHTMLTags) != \'N/A\'" ng-bind-html="data.slogan.text"></div> </div> </div> <div class="row"> <div class="col-md-6" ng-repeat="article in data.articles"> <div class="improve-all-section"> <h3 class="improve-all-head">{{article.title}}</h3> <p class="improve-all-describtion" ng-bind-html="article.text"></p> </div> </div> </div> </div> </div> <div class="chose-section"> <h3 class="ch-heading">{{data.sisterConcernsTitle.title}}</h3> <div class="chose-focus-section clearfix"> <div class="col-md-12"> <a href="{{sisterCon.text}}" ng-repeat="sisterCon in data.sisterConcerns" target="_blank"> <div class="panel-sets col-md-3"> <div class="panel-body panel-sets-body panel-sister"> <div class="card-next"> <p>{{sisterCon.title}}</p> </div> </div> </div> </a> <!-- <div ng-bind-html="data.sisterConcerns.text"></div> --> </div> </div> </div> <div class="chose-section"> <h3 class="ch-heading">{{data.workDomains.slogan}}</h3> <div class="chose-focus-section clearfix"> <div class="col-md-6" ng-repeat="workDomain in data.workDomains.data"> <div class="media chose-media"> <div class="media-left md-left"> <img class="media-object" ng-src="{{workDomain.image}}" alt="..."> </div> <div class="media-body m-body"> <h4 class="media-heading m-head">{{workDomain.title}}</h4> <p class="m-para" ng-bind-html="workDomain.description"></p> </div> </div> </div> </div> </div> <div class="management-team"> <div class="container"> <!-- <div class="row">\r\n      <h3 class="achive-head">Our Leadership Team</h3>\r\n    </div> --> <div class="row"> <!-- <h4 class="board-heading">Board of Directors</h4> --> <h4 class="board-heading">{{data.members.boardOfDirectors.title}}</h4> <multi-carousel-slider class="owl-carousel owl-theme board-director"> <a href="javascript:void(0)" ng-click="leadership(1,boardOfDirector.id)" class="item" multi-carousel-slider-item="" ng-repeat="boardOfDirector in data.members.boardOfDirectors.list"> <div class="board-director-full"> <img ng-src="{{boardOfDirector.image}}" alt=""> <h5 class="board-director-heads">{{boardOfDirector.name}}</h5> <p class="board-director-para">{{boardOfDirector.designation}}</p> <h6 class="board-director-degination">{{boardOfDirector.member_of}}</h6> </div> </a> </multi-carousel-slider> </div> <div class="row"> <!-- <h4 class="board-heading">Management Committee</h4> --> <h4 class="board-heading">{{data.members.topManagement.title}}</h4> <multi-carousel-slider class="owl-carousel owl-theme board-director"> <a href="javascript:void(0)" ng-click="leadership(2,topManagement.id)" class="item" multi-carousel-slider-item="" ng-repeat="topManagement in data.members.topManagement.list"> <div class="board-director-full"> <img ng-src="{{topManagement.image}}" alt=""> <h5 class="board-director-heads">{{topManagement.name}}</h5> <p class="board-director-para">{{topManagement.designation}}</p> <h6 class="board-director-degination">{{topManagement.member_of}}</h6> </div> </a> </multi-carousel-slider> </div> <div class="row"> <!-- <h4 class="board-heading">Branch Managers</h4> --> <h4 class="board-heading">{{data.members.branchManagement.title}}</h4> <multi-carousel-slider class="owl-carousel owl-theme board-director"> <a href="javascript:void(0)" ng-click="leadership(3,branchManagement.id)" class="item" multi-carousel-slider-item="" ng-repeat="branchManagement in data.members.branchManagement.list"> <div class="board-director-full"> <img ng-src="{{branchManagement.image}}" alt=""> <h5 class="board-director-heads">{{branchManagement.name}}</h5> <p class="board-director-para">{{branchManagement.designation}}</p> <h6 class="board-director-degination">{{branchManagement.member_of}}</h6> </div> </a> </multi-carousel-slider> </div> <div class="row"> <div class="bt-service text-center"> <a ui-sref="whoWeAreAll" class="btn btn-service bt-ser btn-view">View All</a> </div> </div> </div> </div> <div class="full-red-section"> <div class="container"> <div class="row"> <div class="col-md-12"> <multi-carousel-slider class="owl-carousel owl-theme"> <div class="item" multi-carousel-slider-item="" ng-repeat="statistics in data.statistics"> <div class="p-bottom"> <h3>{{statistics.value}}</h3> <p ng-bind-html="statistics.text"></p> </div> </div> </multi-carousel-slider> </div> </div> <!--<div class="row">--> <!--<div class="col-md-3 p-bottom">--> <!--<h3>1780</h3>--> <!--<p>Million (BDT)</p>--> <!--<p>net profit in 2016</p>--> <!--</div>--> <!--<div class="col-md-3 p-bottom">--> <!--<h3>13%</h3>--> <!--<p>Million (BDT)</p>--> <!--<p>net profit in 2016</p>--> <!--</div>--> <!--<div class="col-md-3 p-bottom">--> <!--<h3>1780</h3>--> <!--<p>Million (BDT)</p>--> <!--<p>net profit in 2016</p>--> <!--</div>--> <!--<div class="col-md-3 p-bottom">--> <!--<h3>13%</h3>--> <!--<p>Million (BDT)</p>--> <!--<p>net profit in 2016</p>--> <!--</div>--> <!--<div class="col-md-3 p-bottom">--> <!--<h3>13%</h3>--> <!--<p>Million (BDT)</p>--> <!--<p>net profit in 2016</p>--> <!--</div>--> <!--</div>--> </div> </div> <div class="client-section-bg" ng-show="data.feedback"> <home-slider class="owl-carousel owl-theme client-section"> <home-slider-item class="item" ng-repeat="feedback in data.feedback"> <div class="client-section-full"> <h3 class="client-section-heads">What Clients are saying</h3> <p class="client-section-para">{{feedback.message}}</p> <div class="media client-section-media"> <div class="media-left"> <a href="#"> <img class="media-object client-object" ng-src="{{feedback.image}}" alt="..."> </a> </div> <div class="media-body client-section-media-body"> <h4 class="client-section-media-head">{{feedback.name}}</h4> <p class="client-section-media-des">{{feedback.info}}</p> </div> </div> </div> </home-slider-item> </home-slider> </div>'
                ),
                a.put(
                    "views/whoWeAreAll.html",
                    '<script type="text/ng-template" id="group-template.html"><div class="panel-heading">\r\n    <h4 class="panel-title" style="color:#fa39c3">\r\n      <a href tabindex="0" class="accordion-toggle" ng-click="toggleOpen()" uib-accordion-transclude="heading">\r\n          <span uib-accordion-header ng-class="{\'text-muted\': isDisabled}">\r\n            {{heading}}\r\n          </span>\r\n      </a>\r\n    </h4>\r\n  </div>\r\n  <div class="panel-collapse collapse" uib-collapse="!isOpen">\r\n    <div class="panel-body" style="text-align: right" ng-transclude></div>\r\n  </div></script> <div class="banner-who" style="background-image:url({{data.titlePhoto.image}})"> <div class="d-table"> <div class="d-cell"> <h3>{{data.titlePhoto.title}}</h3> </div> </div> </div> <div class="bg-col-leader"> <div class="container"> <div class="row"> <div class="pro-leadership"> <h3 class="pro-leadership-top text-center">{{data.slogan.title}}</h3> <p class="pro-leadership-paragraph text-center" ng-if="(data.slogan.text | removeHTMLTags) != \'N/A\'" ng-bind-html="data.slogan.text"></p> </div> <div class="bt-center-leader"> <div class="bt-center-leader"> <ul class="list-inline text-center nav-tabs leader-bottom" ng-init="selected = stateParams.cat || 1"> <li ng-class="selected == 1?\'active\':\'\'"> <a class="btn btn-leader" ng-click="selected=1">Board of Directors</a> </li> <li ng-class="selected == 2?\'active\':\'\'"> <a class="btn btn-leader" ng-click="selected=2">Top Management</a> </li> <li ng-class="selected == 3?\'active\':\'\'"> <a class="btn btn-leader" ng-click="selected=3">Branch Management</a> </li> </ul> </div> <div class="tab-content"> <div role="tabpanel" ng-class="selected == 1?\'active\':\'\'" class="tab-pane"> <uib-accordion close-others="oneAtATime"> <div class="row p-no-space"> <div class="col-md-6"> <div uib-accordion-group ng-init="isOpen = stateParams.id == group.id ? true : false" is-open="isOpen" class="panel-director" ng-repeat="group in data.members.boardOfDirectors" ng-if="$even"> <uib-accordion-heading> <div class="media"> <div class="media-left media-middle"> <img alt="aaa" class="media-object" ng-src="{{group.image}}"> </div> <div class="media-body media-middle media-board-body"> <h4>{{group.name}}</h4> <p>{{group.designation}}</p> <!-- <h5>{{group[\'member_of\']}}</h5> --> </div> <div class="media-right m-right media-middle"> <span class="fa fa-angle-down angle-customize" aria-hidden="true"></span> </div> </div> </uib-accordion-heading> <div class="board-section-middle"> <!-- <div class="row">\r\n                        <div class="col-md-4">\r\n                          <div class="left-board-head">\r\n                            Nominated by:\r\n                          </div>\r\n                        </div>\r\n                        <div class="col-md-8">\r\n                          <div class="right-board-head">\r\n                            {{group[\'nominated_by\']}}\r\n                          </div>\r\n                        </div>\r\n                      </div> --> <!-- <div class="row">\r\n                        <div class="col-md-4">\r\n                          <div class="left-board-head">\r\n                            Business Address:\r\n                          </div>\r\n                        </div>\r\n                        <div class="col-md-8">\r\n                          <div class="right-board-head">\r\n                            {{group[\'business_address\']}}\r\n                          </div>\r\n                        </div>\r\n                      </div> --> <div class="row"> <div class="col-md-4"> <div class="left-board-head"> Short Bio: </div> </div> <div class="col-md-8"> <div class="right-board-head"> {{group[\'short_bio\']}} </div> </div> </div> </div> </div> </div> <div class="col-md-6"> <div uib-accordion-group ng-init="isOpen = stateParams.id == group.id ? true : false" is-open="isOpen" class="panel-director" ng-repeat="group in data.members.boardOfDirectors" ng-if="$odd"> <uib-accordion-heading> <div class="media"> <div class="media-left media-middle"> <img alt="aaa" class="media-object" ng-src="{{group.image}}"> </div> <div class="media-body media-middle media-board-body"> <h4>{{group.name}}</h4> <p>{{group.designation}}</p> <!-- <h5>{{group[\'member_of\']}}</h5> --> </div> <div class="media-right m-right media-middle"> <span class="fa fa-angle-down angle-customize" aria-hidden="true"></span> </div> </div> </uib-accordion-heading> <div class="board-section-middle"> <!-- <div class="row">\r\n                        <div class="col-md-4">\r\n                          <div class="left-board-head">\r\n                            Nominated by:\r\n                          </div>\r\n                        </div>\r\n                        <div class="col-md-8">\r\n                          <div class="right-board-head">\r\n                            {{group[\'nominated_by\']}}\r\n                          </div>\r\n                        </div>\r\n                      </div>\r\n                      <div class="row">\r\n                        <div class="col-md-4">\r\n                          <div class="left-board-head">\r\n                            Business Address:\r\n                          </div>\r\n                        </div>\r\n                        <div class="col-md-8">\r\n                          <div class="right-board-head">\r\n                            {{group[\'business_address\']}}\r\n                          </div>\r\n                        </div>\r\n                      </div> --> <div class="row"> <div class="col-md-4"> <div class="left-board-head"> Short Bio: </div> </div> <div class="col-md-8"> <div class="right-board-head"> {{group[\'short_bio\']}} </div> </div> </div> </div> </div> </div> </div> </uib-accordion> </div> <div role="tabpanel" ng-class="selected == 2?\'active\':\'\'" class="tab-pane"> <uib-accordion close-others="oneAtATime"> <div class="row p-no-space"> <div class="col-md-6"> <div uib-accordion-group ng-init="isOpen = stateParams.id == group.id ? true : false" is-open="isOpen" class="panel-director" ng-repeat="group in data.members.topManagement" ng-if="$even"> <uib-accordion-heading> <div class="media"> <div class="media-left media-middle"> <img alt="aaa" class="media-object" ng-src="{{group.image}}"> </div> <div class="media-body media-middle media-board-body"> <h4>{{group.name}}</h4> <p>{{group.designation}}</p> <!-- <h5>{{group[\'member_of\']}}</h5> --> </div> <div class="media-right m-right media-middle"> </div> </div> </uib-accordion-heading> <div class="board-section-middle"> <!-- <div class="row">\r\n                        <div class="col-md-4">\r\n                          <div class="left-board-head">\r\n                            Nominated by:\r\n                          </div>\r\n                        </div>\r\n                        <div class="col-md-8">\r\n                          <div class="right-board-head">\r\n                            {{group[\'nominated_by\']}}\r\n                          </div>\r\n                        </div>\r\n                      </div>\r\n                      <div class="row">\r\n                        <div class="col-md-4">\r\n                          <div class="left-board-head">\r\n                            Business Address:\r\n                          </div>\r\n                        </div>\r\n                        <div class="col-md-8">\r\n                          <div class="right-board-head">\r\n                            {{group[\'business_address\']}}\r\n                          </div>\r\n                        </div>\r\n                      </div> --> <div class="row"> <div class="col-md-4"> <div class="left-board-head"> Short Bio: </div> </div> <div class="col-md-8"> <div class="right-board-head"> {{group[\'short_bio\']}} </div> </div> </div> </div> </div> </div> <div class="col-md-6"> <div uib-accordion-group ng-init="isOpen = stateParams.id == group.id ? true : false" is-open="isOpen" class="panel-director" ng-repeat="group in data.members.topManagement" ng-if="$odd"> <uib-accordion-heading> <div class="media"> <div class="media-left media-middle"> <img alt="aaa" class="media-object" ng-src="{{group.image}}"> </div> <div class="media-body media-middle media-board-body"> <h4>{{group.name}}</h4> <p>{{group.designation}}</p> <!-- <h5>{{group[\'member_of\']}}</h5> --> </div> <div class="media-right m-right media-middle"> </div> </div> </uib-accordion-heading> <div class="board-section-middle"> <div class="row"> <div class="col-md-4"> <div class="left-board-head"> Short Bio: </div> </div> <div class="col-md-8"> <div class="right-board-head"> {{group[\'short_bio\']}} </div> </div> </div> </div> </div> </div> </div> </uib-accordion> </div> <div role="tabpanel" ng-class="selected == 3?\'active\':\'\'" class="tab-pane"> <uib-accordion close-others="oneAtATime"> <div class="row p-no-space"> <div class="col-md-6"> <div uib-accordion-group ng-init="isOpen = stateParams.id == group.id ? true : false" is-open="isOpen" class="panel-director" ng-repeat="group in data.members.branchManagement" ng-if="$even"> <uib-accordion-heading> <div class="media"> <div class="media-left media-middle"> <img alt="aaa" class="media-object" ng-src="{{group.image}}"> </div> <div class="media-body media-middle media-board-body"> <h4>{{group.name}}</h4> <p>{{group.designation}}</p> <!-- <h5>{{group[\'member_of\']}}</h5> --> </div> <div class="media-right m-right media-middle"> </div> </div> </uib-accordion-heading> <div class="board-section-middle"> <!-- <div class="row">\r\n                                  <div class="col-md-4">\r\n                                    <div class="left-board-head">\r\n                                      Nominated by:\r\n                                    </div>\r\n                                  </div>\r\n                                  <div class="col-md-8">\r\n                                    <div class="right-board-head">\r\n                                      {{group[\'nominated_by\']}}\r\n                                    </div>\r\n                                  </div>\r\n                                </div>\r\n                                <div class="row">\r\n                                  <div class="col-md-4">\r\n                                    <div class="left-board-head">\r\n                                      Business Address:\r\n                                    </div>\r\n                                  </div>\r\n                                  <div class="col-md-8">\r\n                                    <div class="right-board-head">\r\n                                      {{group[\'business_address\']}}\r\n                                    </div>\r\n                                  </div>\r\n                                </div> --> <div class="row"> <div class="col-md-4"> <div class="left-board-head"> Short Bio: </div> </div> <div class="col-md-8"> <div class="right-board-head"> {{group[\'short_bio\']}} </div> </div> </div> </div> </div> </div> <div class="col-md-6"> <div uib-accordion-group ng-init="isOpen = stateParams.id == group.id ? true : false" is-open="isOpen" class="panel-director" ng-repeat="group in data.members.branchManagement" ng-if="$odd"> <uib-accordion-heading> <div class="media"> <div class="media-left media-middle"> <img alt="aaa" class="media-object" ng-src="{{group.image}}"> </div> <div class="media-body media-middle media-board-body"> <h4>{{group.name}}</h4> <p>{{group.designation}}</p> <!-- <h5>{{group[\'member_of\']}}</h5> --> </div> <div class="media-right m-right media-middle"> </div> </div> </uib-accordion-heading> <div class="board-section-middle"> <div class="row"> <div class="col-md-4"> <div class="left-board-head"> Short Bio: </div> </div> <div class="col-md-8"> <div class="right-board-head"> {{group[\'short_bio\']}} </div> </div> </div> </div> </div> </div> </div> </uib-accordion> </div> </div> </div> </div> </div> </div> <!--<div class="download-director">--> <!--<button class="btn btn-download">Download Directors Related Information</button>--> <!--</div>-->'
                ),
                a.put(
                    "views/whyInvestInBangladesh.html",
                    '<!-- <div class="banner-who" style="background-image:url({{data[\'titlePhoto\'].image}})">\r\n  <div class="d-table">\r\n    <div class="d-cell">\r\n      <h3>{{data[\'titlePhoto\'].title}}</h3>\r\n    </div>\r\n  </div>\r\n</div> --> <div class="bg-col-leader big-padding"> <div class="container"> <div class="row"> <div class="wrap-second-invest"> <!-- <h3 class="invest-second-heading">{{data.report.title}}</h3> --> <img ng-src="{{data.report.image}}" alt="" class="big-image"> </div> </div> <div class="row p-no-space"> <div class="wrap-sec-invest"> <h3 class="invest-section-heading">{{data.slogan.title}}</h3> <p class="invest-section-description" ng-if="(data.slogan.text | removeHTMLTags) != \'N/A\'" ng-bind-html="data.slogan.text"></p> <div class="embed-responsive embed-responsive-16by9" ng-show="(data.youtubeLink.text | removeHTMLTags) != \'N/A\'"> <iframe class="embed-responsive-item" ng-src="{{data.youtubeLink.text | trusted}}"></iframe> </div> </div> </div> </div> </div>'
                );
        },
    ]);
