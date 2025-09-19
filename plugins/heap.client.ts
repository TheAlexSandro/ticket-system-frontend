import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    (function() {
      (window as any).heapReadyCb = (window as any).heapReadyCb || [];
      (window as any).heap = (window as any).heap || [];

      (window as any).heap.load = function(e: string, t?: any) {
        (window as any).heap.envId = e;
        (window as any).heap.clientConfig = t || {};
        (window as any).heap.clientConfig.shouldFetchServerConfig = false;

        const a = document.createElement("script");
        a.type = "text/javascript";
        a.async = true;
        a.src = "https://cdn.us.heap-api.com/config/" + e + "/heap_config.js";

        const r = document.getElementsByTagName("script")[0];
        r.parentNode?.insertBefore(a, r);
        const n = [
          "init","startTracking","stopTracking","track","resetIdentity","identify",
          "getSessionId","getUserId","getIdentity","addUserProperties","addEventProperties",
          "removeEventProperty","clearEventProperties","addAccountProperties","addAdapter",
          "addTransformer","addTransformerFn","onReady","addPageviewProperties",
          "removePageviewProperty","clearPageviewProperties","trackPageview"
        ];

        const i = function(name: string) {
          return function() {
            const args = Array.prototype.slice.call(arguments, 0);
            (window as any).heapReadyCb.push({
              name,
              fn: function() {
                if ((window as any).heap[name]) {
                  (window as any).heap[name].apply((window as any).heap, args);
                }
              }
            });
          };
        };

        for (let p = 0; p < n.length; p++) {
          (window as any).heap[n[p]] = i(n[p]);
        }
      };

      (window as any).heap.load("3968284414");
    })();
  }
});
