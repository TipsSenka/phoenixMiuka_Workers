var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var appName = "phoenixMiuka Workers";
var courseCatalog = [
  {
    id: 101,
    title: "Cloudflare Workers \u5165\u9580",
    instructor: "Miuka",
    duration: "3h",
    level: "Beginner"
  },
  {
    id: 102,
    title: "Pages \u3067\u306E\u9759\u7684\u30B5\u30A4\u30C8\u5236\u4F5C",
    instructor: "Miuka",
    duration: "2h 30m",
    level: "Intermediate"
  },
  {
    id: 103,
    title: "\u672C\u756A\u904B\u7528\u3092\u610F\u8B58\u3057\u305FAPI\u8A2D\u8A08",
    instructor: "Miuka",
    duration: "4h",
    level: "Advanced"
  }
];
var events = [
  {
    title: "Cloudflare Workshop",
    date: "2026-09-15",
    venue: "Online"
  },
  {
    title: "Frontend Practice",
    date: "2026-09-22",
    venue: "Tokyo"
  },
  {
    title: "Production Review",
    date: "2026-09-29",
    venue: "Hybrid"
  }
];
var fortuneMessages = [
  "\u4ECA\u65E5\u306F\u7D20\u6575\u306A\u767A\u898B\u304C\u3042\u308B\u65E5\u3067\u3059\u3002",
  "\u5C0F\u3055\u306A\u6539\u5584\u304C\u5927\u304D\u306A\u6210\u679C\u306B\u3064\u306A\u304C\u308A\u307E\u3059\u3002",
  "\u81EA\u5206\u306E\u30DA\u30FC\u30B9\u3092\u5B88\u308B\u3068\u3001\u6210\u9577\u304C\u52A0\u901F\u3057\u307E\u3059\u3002"
];
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
      "access-control-allow-headers": "Content-Type"
    }
  });
}
__name(jsonResponse, "jsonResponse");
function parseName(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}
__name(parseName, "parseName");
var src_default = {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, OPTIONS",
          "access-control-allow-headers": "Content-Type"
        }
      });
    }
    if (url.pathname === "/") {
      return jsonResponse({
        app: appName,
        message: "Cloudflare Workers is running.",
        endpoints: ["/api", "/api/course", "/api/hello", "/api/fortune", "/api/events"]
      });
    }
    if (url.pathname === "/api") {
      return jsonResponse({
        app: appName,
        status: "ok",
        routes: ["/api/course", "/api/hello?name=Miuka", "/api/fortune", "/api/events"]
      });
    }
    if (url.pathname === "/api/course") {
      return jsonResponse({
        app: appName,
        total: courseCatalog.length,
        courses: courseCatalog
      });
    }
    if (url.pathname === "/api/hello") {
      const name = parseName(url.searchParams.get("name"));
      if (!name) {
        return jsonResponse({
          error: "name parameter is required."
        }, 400);
      }
      return jsonResponse({
        message: `Hello, ${name}!`,
        app: appName
      });
    }
    if (url.pathname === "/api/fortune") {
      const index = Math.floor(Math.random() * fortuneMessages.length);
      return jsonResponse({
        fortune: fortuneMessages[index],
        app: appName
      });
    }
    if (url.pathname === "/api/events") {
      return jsonResponse({
        app: appName,
        events
      });
    }
    return jsonResponse({
      error: "Not found."
    }, 404);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-wxyROu/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-wxyROu/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
