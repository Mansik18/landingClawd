(function initAnalytics() {
    const cfg = window.__analyticsConfig || {};
    const gaId = String(cfg.ga4MeasurementId || '').trim();
    const ymId = Number(cfg.yandexMetrikaId || 0);

    function loadScript(src) {
        const script = document.createElement('script');
        script.async = true;
        script.src = src;
        document.head.appendChild(script);
    }

    if (/^G-[A-Z0-9]+$/i.test(gaId)) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function gtag() {
            window.dataLayer.push(arguments);
        };
        loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId));
        window.gtag('js', new Date());
        window.gtag('config', gaId, {
            anonymize_ip: true
        });
    }

    if (Number.isInteger(ymId) && ymId > 0) {
        const ymScriptUrl = 'https://mc.yandex.ru/metrika/tag.js?id=' + encodeURIComponent(String(ymId));
        (function (m, e, t, r, i, k, a) {
            m[i] = m[i] || function () {
                (m[i].a = m[i].a || []).push(arguments);
            };
            m[i].l = 1 * new Date();
            for (let j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) {
                    return;
                }
            }
            k = e.createElement(t);
            a = e.getElementsByTagName(t)[0];
            k.async = 1;
            k.src = r;
            a.parentNode.insertBefore(k, a);
        })(window, document, 'script', ymScriptUrl, 'ym');

        window.ym(ymId, 'init', {
            ssr: true,
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: false,
            ecommerce: 'dataLayer',
            referrer: document.referrer,
            url: location.href
        });
    }

    window.trackEvent = function trackEvent(eventName, params) {
        const safeEventName = String(eventName || '').trim();
        if (!safeEventName) return;

        const payload = params && typeof params === 'object' ? params : {};
        if (typeof window.gtag === 'function') {
            window.gtag('event', safeEventName, payload);
        }
        if (typeof window.ym === 'function' && ymId > 0) {
            window.ym(ymId, 'reachGoal', safeEventName, payload);
        }
    };
})();
