!(function() {

    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/Users/yonatandawit/Documents/Dev/Selsa/accounts/static/js/ecommerce.js';
    document.head.appendChild(script);

    // Start of 'ecommerce-inline.js' -->
    const m = "ecommerce.ready";
    function f() {
        const t = document.currentScript;
        if (t === null)
            throw new Error("Cannot find current script");
        const c = t.getAttribute("src");
        if (c === null)
            throw new Error('Cannot find "src" attribute of current script');
        return new URL(c, window.location.href)
    }
    function P(t) {
        return t.pathname.includes("/script.js") ? parseInt(t.searchParams.entries().next().value[0], 10) : parseInt(t.searchParams.get("storeId") ?? "", 10)
    }
    function S(t) {
        return t.searchParams.get("lang") ?? void 0
    }
    function w() {
        const t = f();
        return {
            storeId: P(t),
            lang: S(t)
        }
    }
    function C() {
        const t = window.Ecommerce !== void 0,
            c = document.readyState === "complete" || document.readyState === "interactive";
        return t && c
    }
    function o(t) {
        const c = () => {
                C() && (u(), t())
            },
            i = () => {
                document.addEventListener(m, c),
                document.addEventListener("DOMContentLoaded", c)
            },
            u = () => {
                document.removeEventListener(m, c),
                document.removeEventListener("DOMContentLoaded", c)
            };
        C() ? setTimeout(() => c(), 0) : i()
    }
    (() => {
        const t = window;
        function c() {
            const e = t.getEcwidV3Object();
            return e.ecommerceInstance === void 0 && (e.ecommerceInstance = new t.Ecommerce), e.ecommerceInstance
        }
        function i() {
            return c().legacyApiImpl.getWindowImpl()
        }
        function u() {
            return c().legacyApiImpl.getEcImpl()
        }
        function n() {
            return c().legacyApiImpl.getEcwidImpl()
        }
        function d() {
            return c().legacyApiImpl.getEcwidCartImpl()
        }
        function s(e) {
            return (...a) => {
                const g = document.currentScript;
                return o(() => e(g, ...a))
            }
        }
        if (t.isEcwidV2StorefrontLoaded = t.isEcwidV2StorefrontLoaded ?? !1, t.isEcwidV3StorefrontLoaded = t.isEcwidV3StorefrontLoaded ?? !1, t.isEcwidV2StorefrontLoaded || t.isEcwidV3StorefrontLoaded)
            return;
        t.isEcwidV3StorefrontLoaded = !0,
        t.getEcwidV3Object === void 0 && (t.getEcwidV2Object = () => t.EcwidV2, t.getEcwidV2ObjectName = () => "EcwidV2", t.getEcwidV3Object = () => t.Ecwid);
        const l = w();
        o(() => {
            t.EcommerceGlobals.setEntryPointQueryParams(l),
            t.EcommerceGlobals.setEcommerceJsParams({
                "apiBaseUrl": "https://app.ecwid.com/storefront/api/v1",
                "tracingSampleRatio": 1.0,
                "datadogRum": {
                    "applicationId": "6c020ce8-c897-45ee-9820-0e15182de2af",
                    "clientToken": "pubbe5c7ca7cd54f189f3b7446553dc4c1f",
                    "site": "us5.datadoghq.com",
                    "service": "storefront-prod",
                    "env": "prod",
                    "version": "2025-9048-g49bb6f88364872",
                    "sampleRatio": 0.01
                }
            })
        }),
        t.ecwid_onBodyDone = t.ecwid_onBodyDone ?? (() => {
            o(() => i().ecwid_onBodyDone())
        }),
        t.xAffiliate = t.xAffiliate ?? (e => {
            t.Ecwid.affiliateId = e
        }),
        t.xAddToBag = t.xAddToBag ?? s((...e) => i().xAddToBag(...e)),
        t.xCategories = t.xCategories ?? s((...e) => i().xCategories(...e)),
        t.xCategoriesV2 = t.xCategoriesV2 ?? s((...e) => i().xCategoriesV2(...e)),
        t.xMinicart = t.xMinicart ?? s((...e) => i().xMinicart(...e)),
        t.xProduct = t.xProduct ?? s((...e) => i().xProduct(...e)),
        t.xProductBrowser = t.xProductBrowser ?? s((...e) => i().xProductBrowser(...e)),
        t.xProductThumbnail = t.xProductThumbnail ?? s((...e) => i().xProductThumbnail(...e)),
        t.xSearch = t.xSearch ?? s((...e) => i().xSearch(...e)),
        t.xSearchPanel = t.xSearchPanel ?? s((...e) => i().xSearchPanel(...e)),
        t.xSingleProduct = t.xSingleProduct ?? s((...e) => i().xSingleProduct(...e)),
        t.xVCategories = t.xVCategories ?? s((...e) => i().xVCategories(...e)),
        t.ec = t.ec ?? {},
        t.ec.setInternalState = t.ec.setInternalState ?? (e => u().setInternalState(e)),
        t.EcwidCart = t.EcwidCart ?? {
            refreshCartInfo: e => o(() => d().refreshCartInfo(e))
        },
        t.Ecwid = t.Ecwid ?? {};
        const r = t.getEcwidV3Object();
        r._showPBLoader = () => n()._showPBLoader(),
        r._onComplete = () => o(() => n()._onComplete()),
        r.destroy = () => o(() => n().destroy()),
        r.formatCurrency = e => n().formatCurrency(e),
        r.init = () => o(() => n().init()),
        r.isCheckoutMutating = () => n().isCheckoutMutating(),
        r.isStorefrontV3 = () => !0,
        r.getAndClearLegacyStorefrontNotice = () => n().getAndClearLegacyStorefrontNotice(),
        r.getAppPublicConfig = e => n().getAppPublicConfig(e),
        r.getAppPublicToken = e => n().getAppPublicToken(e),
        r.getCheckoutInfo = () => n().getCheckoutInfo(),
        r.getLegacyAuthToken = () => n().getLegacyAuthToken(),
        r.getFeatureToggles = () => n().getFeatureToggles(),
        r.getInitializedWidgets = () => n().getInitializedWidgets(),
        r.getOwnerId = () => l.storeId,
        r.getPageSwitchCallbacks = () => n().getPageSwitchCallbacks(),
        r.getStaticBaseUrl = () => n().getStaticBaseUrl(),
        r.getStoreConfiguration = () => n().getStoreConfiguration(),
        r.getStorefrontLang = () => n().getStorefrontLang(),
        r.getTrackingConsent = () => n().getTrackingConsent(),
        r.getVisitorLocation = () => n().getVisitorLocation(),
        r.onAllCheckoutMutationsCompleted = e => n().onAllCheckoutMutationsCompleted(e),
        r.openCookiesSettingSidePanel = () => o(() => n().openCookiesSettingSidePanel()),
        r.openPage = (e, a) => o(() => n().openPage(e, a)),
        r.refreshConfig = () => o(() => n().refreshConfig()),
        r.resizeProductBrowser = () => o(() => n().resizeProductBrowser()),
        r.setCheckoutInfo = e => n().setCheckoutInfo(e),
        r.setLegacyAuthToken = e => {
            o(() => n().setLegacyAuthToken(e))
        },
        r.scrollToContent = () => o(() => n().scrollToContent()),
        r.setSession = e => o(() => n().setSession(e)),
        r.setSignInProvider = e => o(() => n().setSignInProvider(e)),
        r.setSignInUrls = e => o(() => n().setSignInUrls(e)),
        r.setSsoProfile = e => o(() => n().setSsoProfile(e)),
        r.setStorefrontBaseUrl = e => o(() => n().setStorefrontBaseUrl(e)),
        r.setTrackingConsent = e => o(() => n().setTrackingConsent(e)),
        r.showProductFilters = () => o(() => n().showProductFilters()),
        r.OnAPILoaded = {
            add: e => {
                o(() => n().OnAPILoaded.add(e))
            }
        },
        r.OnCartChanged = {
            add: e => {
                o(() => n().OnCartChanged.add(e))
            }
        },
        r.OnCartSynchronized = {
            add: e => {
                o(() => n().OnCartSynchronized.add(e))
            },
            clear: () => {
                o(() => {
                    var e,
                        a;
                    return (a = (e = n().OnCartSynchronized).clear) == null ? void 0 : a.call(e)
                })
            }
        },
        r.OnConsentChanged = {
            add: e => {
                o(() => n().OnConsentChanged.add(e))
            }
        },
        r.OnOrderPlaced = {
            add: e => {
                o(() => n().OnOrderPlaced.add(e))
            }
        },
        r.OnPageLoad = {
            add: e => {
                o(() => n().OnPageLoad.add(e))
            }
        },
        r.OnPageLoaded = {
            add: e => {
                o(() => n().OnPageLoaded.add(e))
            }
        },
        r.OnPageSwitch = {
            add: e => {
                o(() => n().OnPageSwitch.add(e))
            }
        },
        r.OnProductOptionsChanged = {
            add: e => {
                o(() => n().OnProductOptionsChanged.add(e))
            }
        },
        r.OnRouterExternalStateChanged = {
            add: e => {
                o(() => n().OnRouterExternalStateChanged.add(e))
            },
            clear: () => {
                o(() => {
                    var e,
                        a;
                    return (a = (e = n().OnRouterExternalStateChanged).clear) == null ? void 0 : a.call(e)
                })
            }
        },
        r.OnSessionChanged = {
            add: e => {
                o(() => n().OnSessionChanged.add(e))
            }
        },
        r.OnSetProfile = {
            add: e => {
                o(() => n().OnSetProfile.add(e))
            }
        },
        r.Customer = {
            get: e => {
                o(() => n().OnSetProfile.add(e))
            },
            signOut: e => {
                o(() => {
                    n().customerSignOut(e)
                })
            }
        },
        r.Cart = {
            addProduct: (e, a) => {
                o(() => d().addProduct(e, a))
            },
            calculateTotal: e => {
                o(() => d().calculateTotal(e))
            },
            canGotoCheckout: e => (o(() => d().canGotoCheckout(e)), !0),
            clear: e => {
                o(() => d().clear(e))
            },
            get: e => {
                o(() => d().get(e))
            },
            gotoCheckout: e => {
                o(() => d().gotoCheckout(e))
            },
            removeProduct: (e, a) => {
                o(() => d().removeProduct(e, a))
            },
            removeProducts: (e, a) => {
                o(() => d().removeProducts(e, a))
            },
            setAddress: (e, a, g) => {
                o(() => d().setAddress(e, a, g))
            },
            setBillingAddress: (e, a, g) => {
                o(() => d().setBillingAddress(e, a, g))
            },
            setCustomerEmail: (e, a, g) => {
                o(() => d().setCustomerEmail(e, a, g))
            },
            setOrderComments: (e, a, g) => {
                o(() => d().setOrderComments(e, a, g))
            }
        },
        o(() => {
            var e;

            (((e = window._xnext_initialization_scripts) == null ? void 0 : e.length) ?? 0) > 0 && setTimeout(() => {
                r.init()
            }, 0)
        }),
        t.onEcommerceReady = o
    })();



})();
// End of 'ecommerce-inline.js' -->