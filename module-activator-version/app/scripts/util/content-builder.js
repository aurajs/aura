define(['./underscore', './cookie', './module-activator'], function (_, cookie, activator) {
    var exports = {},
        replaceContent = function (element, content) {
            element[0].innerHTML = content;
            element.css('visibility', 'visible');
        },
        authorizedCookieKey = 'authorized';

    exports.execute = function (element) {
        $('div[data-dynamic-uri], div[data-auth-uri]', element).css('visibility', 'hidden').each(function () {
            var element = $(this),
                load = element.data('dynamic-load'),
                authUri = element.data('auth-uri'),
                dynamicUri = element.data('dynamic-uri'),
                authCookie = cookie(authorizedCookieKey),
                uri = (authUri && authCookie) ? authUri : dynamicUri,
                match = /\{\w+\}/.exec(uri),
                val;

            if (load) {
                replaceContent(element, 'Loading');
            }

            /* temporary alerts to help us get usage right */
            if (element.data("dynamic-auth")) {
                alert("Switch data-dynamic-auth to use data-auth-uri");
                return;
            }

            /* checks to return early and make content visible */
            if (authUri && !authCookie && !dynamicUri) {
                element.css('visibility', 'visible');
                return;
            }

            if (match) {
                val = cookie(match[0].slice(1, match.length - 2));
                val = val || "";
                uri = uri.replace(match, val);
            }

            $.ajax({
                url: uri,
                success: function (resp) {
                    replaceContent(element, resp);
                    activator.execute(element);
                    exports.execute(element);
                },
                error: function (xhr) {
                    var authCookieChk = cookie(authorizedCookieKey);
                    if (xhr.status === 403 && authCookieChk) {
                        cookie(authorizedCookieKey, null, {
                            path: "/"
                        });
                        location.reload();
                    }
                    element.css('visibility', 'visible');
                }
            });
        });
    };

    return exports;
});