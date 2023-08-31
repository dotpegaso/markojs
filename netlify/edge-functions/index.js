// dist/index.mjs
var pageResponseInit = {
  status: 200,
  headers: { "content-type": "text/html;charset=UTF-8" }
};
function pageResponse(template, input) {
  return new Response(template.stream(input), pageResponseInit);
}
var NotHandled = Symbol();
var NotMatched = Symbol();
globalThis.MarkoRun ?? (globalThis.MarkoRun = {
  NotHandled,
  NotMatched,
  route(handler) {
    return handler;
  }
});
var serializedGlobals = { params: true, url: true };
function createContext(route, request, platform, url = new URL(request.url)) {
  const context = route ? {
    request,
    url,
    platform,
    meta: route.meta,
    params: route.params,
    route: route.path,
    serializedGlobals
  } : {
    request,
    url,
    platform,
    meta: {},
    params: {},
    route: "",
    serializedGlobals
  };
  let input;
  return [
    context,
    (data) => {
      input ?? (input = {
        $global: context
      });
      return data ? Object.assign(input, data) : input;
    }
  ];
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var encoder = new TextEncoder();
var noop$2 = function() {
};
var indexBrowser = function(data) {
  var transformStream = new TransformStream();
  var writer = transformStream.writable.getWriter();
  var facade = {
    write: function(string) {
      writer.write(encoder.encode(string));
    },
    end: function() {
      writer.close();
    }
  };
  var out = this.createOut(
    data && data.$global,
    facade,
    void 0,
    this.___shouldBuffer
  );
  out.once("error", (err) => {
    facade.write = facade.end = noop$2;
    writer.abort(err);
  });
  this.render(data, out);
  out.end();
  return transformStream.readable;
};
var slice = Array.prototype.slice;
function isFunction(arg) {
  return typeof arg === "function";
}
function checkListener(listener) {
  if (!isFunction(listener)) {
    throw TypeError("Invalid listener");
  }
}
function invokeListener(ee, listener, args) {
  switch (args.length) {
    case 1:
      listener.call(ee);
      break;
    case 2:
      listener.call(ee, args[1]);
      break;
    case 3:
      listener.call(ee, args[1], args[2]);
      break;
    default:
      listener.apply(ee, slice.call(args, 1));
  }
}
function addListener(eventEmitter, type, listener, prepend) {
  checkListener(listener);
  var events = eventEmitter.$e || (eventEmitter.$e = {});
  var listeners = events[type];
  if (listeners) {
    if (isFunction(listeners)) {
      events[type] = prepend ? [listener, listeners] : [listeners, listener];
    } else {
      if (prepend) {
        listeners.unshift(listener);
      } else {
        listeners.push(listener);
      }
    }
  } else {
    events[type] = listener;
  }
  return eventEmitter;
}
function EventEmitter$1() {
  this.$e = this.$e || {};
}
EventEmitter$1.EventEmitter = EventEmitter$1;
EventEmitter$1.prototype = {
  $e: null,
  emit: function(type) {
    var args = arguments;
    var events = this.$e;
    if (!events) {
      return;
    }
    var listeners = events && events[type];
    if (!listeners) {
      if (type === "error") {
        var error = args[1];
        if (!(error instanceof Error)) {
          var context = error;
          error = new Error("Error: " + context);
          error.context = context;
        }
        throw error;
      }
      return false;
    }
    if (isFunction(listeners)) {
      invokeListener(this, listeners, args);
    } else {
      listeners = slice.call(listeners);
      for (var i = 0, len = listeners.length; i < len; i++) {
        var listener = listeners[i];
        invokeListener(this, listener, args);
      }
    }
    return true;
  },
  on: function(type, listener) {
    return addListener(this, type, listener, false);
  },
  prependListener: function(type, listener) {
    return addListener(this, type, listener, true);
  },
  once: function(type, listener) {
    checkListener(listener);
    function g() {
      this.removeListener(type, g);
      if (listener) {
        listener.apply(this, arguments);
        listener = null;
      }
    }
    this.on(type, g);
    return this;
  },
  removeListener: function(type, listener) {
    checkListener(listener);
    var events = this.$e;
    var listeners;
    if (events && (listeners = events[type])) {
      if (isFunction(listeners)) {
        if (listeners === listener) {
          delete events[type];
        }
      } else {
        for (var i = listeners.length - 1; i >= 0; i--) {
          if (listeners[i] === listener) {
            listeners.splice(i, 1);
          }
        }
      }
    }
    return this;
  },
  removeAllListeners: function(type) {
    var events = this.$e;
    if (events) {
      delete events[type];
    }
  },
  listenerCount: function(type) {
    var events = this.$e;
    var listeners = events && events[type];
    return listeners ? isFunction(listeners) ? 1 : listeners.length : 0;
  }
};
var src$1 = EventEmitter$1;
var escapeQuotes = {};
escapeQuotes.d = function(value) {
  return escapeDoubleQuotes$4(value + "", 0);
};
escapeQuotes.___escapeDoubleQuotes = escapeDoubleQuotes$4;
escapeQuotes.___escapeSingleQuotes = escapeSingleQuotes$2;
function escapeSingleQuotes$2(value, startPos) {
  return escapeQuote(value, startPos, "'", "&#39;");
}
function escapeDoubleQuotes$4(value, startPos) {
  return escapeQuote(value, startPos, '"', "&#34;");
}
function escapeQuote(str, startPos, quote, escaped) {
  var result = "";
  var lastPos = 0;
  for (var i = startPos, len = str.length; i < len; i++) {
    if (str[i] === quote) {
      result += str.slice(lastPos, i) + escaped;
      lastPos = i + 1;
    }
  }
  if (lastPos) {
    return result + str.slice(lastPos);
  }
  return str;
}
var escapeDoubleQuotes$3 = escapeQuotes.___escapeDoubleQuotes;
function StringWriter$2() {
  this._content = "";
  this._scripts = "";
  this._data = null;
}
StringWriter$2.prototype = {
  write: function(str) {
    this._content += str;
  },
  script: function(str) {
    if (str) {
      this._scripts += (this._scripts ? ";" : "") + str;
    }
  },
  get: function(key) {
    const extra = this._data = this._data || {};
    return extra[key] = extra[key] || [];
  },
  merge: function(otherWriter) {
    this._content += otherWriter._content;
    if (otherWriter._scripts) {
      this._scripts = this._scripts ? this._scripts + ";" + otherWriter._scripts : otherWriter._scripts;
    }
    if (otherWriter._data) {
      if (this._data) {
        for (const key in otherWriter._data) {
          if (this._data[key]) {
            this._data[key].push.apply(this._data[key], otherWriter._data[key]);
          } else {
            this._data[key] = this._writer[key];
          }
        }
      } else {
        this._data = otherWriter._data;
      }
    }
  },
  clear: function() {
    this._content = "";
    this._scripts = "";
    this._data = null;
  },
  toString: function() {
    this.state.events.emit("___toString", this);
    let str = this._content;
    if (this._scripts) {
      const outGlobal = this.state.root.global;
      const cspNonce = outGlobal.cspNonce;
      const nonceAttr = cspNonce ? ' nonce="' + escapeDoubleQuotes$3(cspNonce) + '"' : "";
      str += `<script${nonceAttr}>${this._scripts}<\/script>`;
    }
    return str;
  }
};
var StringWriter_1 = StringWriter$2;
var indexWorker = {};
indexWorker.___setImmediate = setTimeout;
indexWorker.___clearImmediate = clearTimeout;
var immediate = indexWorker;
var setImmediate$1 = immediate.___setImmediate;
var clearImmediate = immediate.___clearImmediate;
var StringWriter$1 = StringWriter_1;
function BufferedWriter$2(wrappedStream) {
  StringWriter$1.call(this);
  this._wrapped = wrappedStream;
  this._scheduled = null;
}
BufferedWriter$2.prototype = Object.assign(
  {
    scheduleFlush() {
      if (!this._scheduled) {
        this._scheduled = setImmediate$1(flush.bind(0, this));
      }
    },
    end: function() {
      flush(this);
      if (!this._wrapped.isTTY) {
        this._wrapped.end();
      }
    }
  },
  StringWriter$1.prototype
);
function flush(writer) {
  const contents = writer.toString();
  if (contents.length !== 0) {
    writer._wrapped.write(contents);
    writer.clear();
    if (writer._wrapped.flush) {
      writer._wrapped.flush();
    }
  }
  clearImmediate(writer._scheduled);
  writer._scheduled = null;
}
var BufferedWriter_1 = BufferedWriter$2;
var extend$3 = function extend(target, source) {
  if (!target) {
    target = {};
  }
  if (source) {
    for (var propName in source) {
      if (source.hasOwnProperty(propName)) {
        target[propName] = source[propName];
      }
    }
  }
  return target;
};
var componentsUtil$3 = {};
var complain$6 = { exports: {} };
var errorStackParser = { exports: {} };
var stackframe = { exports: {} };
var hasRequiredStackframe;
function requireStackframe() {
  if (hasRequiredStackframe)
    return stackframe.exports;
  hasRequiredStackframe = 1;
  (function(module, exports) {
    (function(root, factory) {
      {
        module.exports = factory();
      }
    })(commonjsGlobal, function() {
      function _isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }
      function _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
      }
      function _getter(p) {
        return function() {
          return this[p];
        };
      }
      var booleanProps = ["isConstructor", "isEval", "isNative", "isToplevel"];
      var numericProps = ["columnNumber", "lineNumber"];
      var stringProps = ["fileName", "functionName", "source"];
      var arrayProps = ["args"];
      var objectProps = ["evalOrigin"];
      var props = booleanProps.concat(numericProps, stringProps, arrayProps, objectProps);
      function StackFrame(obj) {
        if (!obj)
          return;
        for (var i2 = 0; i2 < props.length; i2++) {
          if (obj[props[i2]] !== void 0) {
            this["set" + _capitalize(props[i2])](obj[props[i2]]);
          }
        }
      }
      StackFrame.prototype = {
        getArgs: function() {
          return this.args;
        },
        setArgs: function(v) {
          if (Object.prototype.toString.call(v) !== "[object Array]") {
            throw new TypeError("Args must be an Array");
          }
          this.args = v;
        },
        getEvalOrigin: function() {
          return this.evalOrigin;
        },
        setEvalOrigin: function(v) {
          if (v instanceof StackFrame) {
            this.evalOrigin = v;
          } else if (v instanceof Object) {
            this.evalOrigin = new StackFrame(v);
          } else {
            throw new TypeError("Eval Origin must be an Object or StackFrame");
          }
        },
        toString: function() {
          var fileName = this.getFileName() || "";
          var lineNumber = this.getLineNumber() || "";
          var columnNumber = this.getColumnNumber() || "";
          var functionName = this.getFunctionName() || "";
          if (this.getIsEval()) {
            if (fileName) {
              return "[eval] (" + fileName + ":" + lineNumber + ":" + columnNumber + ")";
            }
            return "[eval]:" + lineNumber + ":" + columnNumber;
          }
          if (functionName) {
            return functionName + " (" + fileName + ":" + lineNumber + ":" + columnNumber + ")";
          }
          return fileName + ":" + lineNumber + ":" + columnNumber;
        }
      };
      StackFrame.fromString = function StackFrame$$fromString(str) {
        var argsStartIndex = str.indexOf("(");
        var argsEndIndex = str.lastIndexOf(")");
        var functionName = str.substring(0, argsStartIndex);
        var args = str.substring(argsStartIndex + 1, argsEndIndex).split(",");
        var locationString = str.substring(argsEndIndex + 1);
        if (locationString.indexOf("@") === 0) {
          var parts = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(locationString, "");
          var fileName = parts[1];
          var lineNumber = parts[2];
          var columnNumber = parts[3];
        }
        return new StackFrame({
          functionName,
          args: args || void 0,
          fileName,
          lineNumber: lineNumber || void 0,
          columnNumber: columnNumber || void 0
        });
      };
      for (var i = 0; i < booleanProps.length; i++) {
        StackFrame.prototype["get" + _capitalize(booleanProps[i])] = _getter(booleanProps[i]);
        StackFrame.prototype["set" + _capitalize(booleanProps[i])] = function(p) {
          return function(v) {
            this[p] = Boolean(v);
          };
        }(booleanProps[i]);
      }
      for (var j = 0; j < numericProps.length; j++) {
        StackFrame.prototype["get" + _capitalize(numericProps[j])] = _getter(numericProps[j]);
        StackFrame.prototype["set" + _capitalize(numericProps[j])] = function(p) {
          return function(v) {
            if (!_isNumber(v)) {
              throw new TypeError(p + " must be a Number");
            }
            this[p] = Number(v);
          };
        }(numericProps[j]);
      }
      for (var k = 0; k < stringProps.length; k++) {
        StackFrame.prototype["get" + _capitalize(stringProps[k])] = _getter(stringProps[k]);
        StackFrame.prototype["set" + _capitalize(stringProps[k])] = function(p) {
          return function(v) {
            this[p] = String(v);
          };
        }(stringProps[k]);
      }
      return StackFrame;
    });
  })(stackframe);
  return stackframe.exports;
}
(function(module, exports) {
  (function(root, factory) {
    {
      module.exports = factory(requireStackframe());
    }
  })(commonjsGlobal, function ErrorStackParser(StackFrame) {
    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;
    return {
      parse: function ErrorStackParser$$parse(error) {
        if (typeof error.stacktrace !== "undefined" || typeof error["opera#sourceloc"] !== "undefined") {
          return this.parseOpera(error);
        } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
          return this.parseV8OrIE(error);
        } else if (error.stack) {
          return this.parseFFOrSafari(error);
        } else {
          throw new Error("Cannot parse given Error object");
        }
      },
      extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
        if (urlLike.indexOf(":") === -1) {
          return [urlLike];
        }
        var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
        var parts = regExp.exec(urlLike.replace(/[()]/g, ""));
        return [parts[1], parts[2] || void 0, parts[3] || void 0];
      },
      parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
        var filtered = error.stack.split("\n").filter(function(line) {
          return !!line.match(CHROME_IE_STACK_REGEXP);
        }, this);
        return filtered.map(function(line) {
          if (line.indexOf("(eval ") > -1) {
            line = line.replace(/eval code/g, "eval").replace(/(\(eval at [^()]*)|(,.*$)/g, "");
          }
          var sanitizedLine = line.replace(/^\s+/, "").replace(/\(eval code/g, "(").replace(/^.*?\s+/, "");
          var location = sanitizedLine.match(/ (\(.+\)$)/);
          sanitizedLine = location ? sanitizedLine.replace(location[0], "") : sanitizedLine;
          var locationParts = this.extractLocation(location ? location[1] : sanitizedLine);
          var functionName = location && sanitizedLine || void 0;
          var fileName = ["eval", "<anonymous>"].indexOf(locationParts[0]) > -1 ? void 0 : locationParts[0];
          return new StackFrame({
            functionName,
            fileName,
            lineNumber: locationParts[1],
            columnNumber: locationParts[2],
            source: line
          });
        }, this);
      },
      parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
        var filtered = error.stack.split("\n").filter(function(line) {
          return !line.match(SAFARI_NATIVE_CODE_REGEXP);
        }, this);
        return filtered.map(function(line) {
          if (line.indexOf(" > eval") > -1) {
            line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ":$1");
          }
          if (line.indexOf("@") === -1 && line.indexOf(":") === -1) {
            return new StackFrame({
              functionName: line
            });
          } else {
            var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
            var matches = line.match(functionNameRegex);
            var functionName = matches && matches[1] ? matches[1] : void 0;
            var locationParts = this.extractLocation(line.replace(functionNameRegex, ""));
            return new StackFrame({
              functionName,
              fileName: locationParts[0],
              lineNumber: locationParts[1],
              columnNumber: locationParts[2],
              source: line
            });
          }
        }, this);
      },
      parseOpera: function ErrorStackParser$$parseOpera(e) {
        if (!e.stacktrace || e.message.indexOf("\n") > -1 && e.message.split("\n").length > e.stacktrace.split("\n").length) {
          return this.parseOpera9(e);
        } else if (!e.stack) {
          return this.parseOpera10(e);
        } else {
          return this.parseOpera11(e);
        }
      },
      parseOpera9: function ErrorStackParser$$parseOpera9(e) {
        var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
        var lines = e.message.split("\n");
        var result = [];
        for (var i = 2, len = lines.length; i < len; i += 2) {
          var match2 = lineRE.exec(lines[i]);
          if (match2) {
            result.push(new StackFrame({
              fileName: match2[2],
              lineNumber: match2[1],
              source: lines[i]
            }));
          }
        }
        return result;
      },
      parseOpera10: function ErrorStackParser$$parseOpera10(e) {
        var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
        var lines = e.stacktrace.split("\n");
        var result = [];
        for (var i = 0, len = lines.length; i < len; i += 2) {
          var match2 = lineRE.exec(lines[i]);
          if (match2) {
            result.push(
              new StackFrame({
                functionName: match2[3] || void 0,
                fileName: match2[2],
                lineNumber: match2[1],
                source: lines[i]
              })
            );
          }
        }
        return result;
      },
      parseOpera11: function ErrorStackParser$$parseOpera11(error) {
        var filtered = error.stack.split("\n").filter(function(line) {
          return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
        }, this);
        return filtered.map(function(line) {
          var tokens = line.split("@");
          var locationParts = this.extractLocation(tokens.pop());
          var functionCall = tokens.shift() || "";
          var functionName = functionCall.replace(/<anonymous function(: (\w+))?>/, "$2").replace(/\([^)]*\)/g, "") || void 0;
          var argsRaw;
          if (functionCall.match(/\(([^)]*)\)/)) {
            argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, "$1");
          }
          var args = argsRaw === void 0 || argsRaw === "[arguments not available]" ? void 0 : argsRaw.split(",");
          return new StackFrame({
            functionName,
            args,
            fileName: locationParts[0],
            lineNumber: locationParts[1],
            columnNumber: locationParts[2],
            source: line
          });
        }, this);
      }
    };
  });
})(errorStackParser);
var errorStackParserExports = errorStackParser.exports;
(function(module) {
  var StackParser = errorStackParserExports;
  var env = typeof process !== "undefined" && "production";
  var isDevelopment = !env || env === "dev" || env === "development";
  var showModuleComplains = typeof process !== "undefined" && Boolean({}.SHOW_MODULE_COMPLAINS);
  var showNestedComplains = typeof process !== "undefined" && Boolean({}.SHOW_NESTED_COMPLAINS);
  var logger = typeof console !== "undefined" && console.warn && console;
  var cwd = typeof process !== "undefined" && process.cwd() + "/" || "";
  var linebreak = typeof process !== "undefined" && "win32" === process.platform ? "\r\n" : "\n";
  var slice2 = [].slice;
  var ignoredLocation = "[ignore]";
  var hits = {};
  complain2 = isDevelopment ? complain2 : noop4;
  complain2.method = isDevelopment ? method : noop4;
  complain2.fn = isDevelopment ? fn : noopReturn;
  complain2.log = log;
  complain2.stream = typeof process !== "undefined" && process.stderr;
  complain2.silence = false;
  complain2.color = complain2.stream && complain2.stream.isTTY;
  complain2.colors = { warning: "\x1B[31;1m", notice: "\x1B[33;1m", message: false, location: "\x1B[90m" };
  complain2.getModuleName = getModuleName;
  if (module.exports) {
    module.exports = complain2;
  } else if (typeof window !== "undefined") {
    window.complain = complain2;
  }
  function complain2() {
    var options;
    var location;
    var locationIndex;
    var headingColor;
    var heading;
    var level;
    var args = arguments;
    if (complain2.silence)
      return;
    if (typeof args[args.length - 1] === "object") {
      options = args[args.length - 1];
      args = slice2.call(args, 0, -1);
    } else {
      options = {};
    }
    level = options.level || 2;
    heading = options.heading || (level == 2 ? "WARNING!!" : "NOTICE");
    headingColor = options.headingColor || (level == 2 ? complain2.colors.warning : complain2.colors.notice);
    locationIndex = options.locationIndex == null ? 1 : options.locationIndex;
    if (options.location === false) {
      locationIndex = 0;
    }
    location = options.location || getLocation(locationIndex);
    var moduleName = complain2.getModuleName(location);
    if (moduleName && !showModuleComplains) {
      if (!hits[moduleName]) {
        var output = format("NOTICE", complain2.colors.notice);
        output += linebreak + format("The module [" + moduleName + "] is using deprecated features.", complain2.colors.message);
        output += linebreak + format("Run with ({}).SHOW_MODULE_COMPLAINS=1 to see all warnings.", complain2.colors.message);
        complain2.log(linebreak + output + linebreak);
        hits[moduleName] = true;
      }
      return;
    }
    if (location) {
      if (hits[location] || location === ignoredLocation)
        return;
      else
        hits[location] = true;
    }
    var output = format(heading, headingColor);
    for (var i = 0; i < args.length; i++) {
      output += linebreak + format(args[i], complain2.colors.message);
    }
    if (options.location !== false && location) {
      output += linebreak + format("  at " + location.replace(cwd, ""), complain2.colors.location);
    }
    complain2.log(linebreak + output + linebreak);
  }
  function method(object, methodName) {
    var originalMethod = object[methodName];
    var args = slice2.call(arguments, 2);
    object[methodName] = function() {
      complain2.apply(null, args);
      return originalMethod.apply(this, arguments);
    };
  }
  function fn(original) {
    var args = slice2.call(arguments, 1);
    return function() {
      complain2.apply(null, args);
      return original.apply(this, arguments);
    };
  }
  function log(message, color) {
    var formatted = format(message, color);
    if (complain2.stream) {
      complain2.stream.write(formatted + linebreak);
    } else if (logger) {
      logger.warn(formatted);
    }
  }
  function format(message, color) {
    return color && complain2.color ? color + message + "\x1B[0m" : message;
  }
  function getLocation(locationIndex) {
    var location = "";
    var targetIndex = locationIndex + 2;
    try {
      var locations = StackParser.parse(new Error()).map(function(frame) {
        return frame.fileName + ":" + frame.lineNumber + ":" + frame.columnNumber;
      });
      if (!showNestedComplains) {
        for (var i = locations.length - 1; i > targetIndex; i--) {
          if (hits[locations[i]]) {
            return ignoredLocation;
          }
        }
      }
      location = locations[targetIndex];
    } catch (e) {
    }
    return location;
  }
  function getModuleName(location) {
    var locationParts = location.replace(cwd, "").split(/\/|\\/g);
    for (var i = locationParts.length - 1; i >= 0; i--) {
      if (locationParts[i] === "node_modules") {
        var moduleName = locationParts[i + 1];
        return moduleName[0] === "@" ? moduleName + "/" + locationParts[i + 2] : moduleName;
      }
    }
  }
  function noop4() {
  }
  function noopReturn(r) {
    return r;
  }
})(complain$6);
var complainExports = complain$6.exports;
var FLAG_WILL_RERENDER_IN_BROWSER$4 = 1;
function nextComponentIdProvider$1(out) {
  var prefix = out.global.componentIdPrefix || out.global.widgetIdPrefix || "s";
  var nextId = 0;
  {
    if (out.global.widgetIdPrefix) {
      complainExports(
        "$global.widgetIdPrefix is deprecated. use $global.componentIdPrefix instead.",
        { location: false }
      );
    }
  }
  return function nextComponentId() {
    return prefix + nextId++;
  };
}
function attachBubblingEvent$1(componentDef, handlerMethodName, isOnce, extraArgs) {
  if (handlerMethodName) {
    if (extraArgs) {
      var component = componentDef.___component;
      var eventIndex = component.___bubblingDomEventsExtraArgsCount++;
      if (!(componentDef.___flags & FLAG_WILL_RERENDER_IN_BROWSER$4)) {
        if (eventIndex === 0) {
          component.___bubblingDomEvents = [extraArgs];
        } else {
          component.___bubblingDomEvents.push(extraArgs);
        }
      }
      return handlerMethodName + " " + componentDef.id + " " + isOnce + " " + eventIndex;
    } else {
      return handlerMethodName + " " + componentDef.id + " " + isOnce;
    }
  }
}
componentsUtil$3.___nextComponentIdProvider = nextComponentIdProvider$1;
componentsUtil$3.___isServer = true;
componentsUtil$3.___attachBubblingEvent = attachBubblingEvent$1;
componentsUtil$3.___destroyComponentForNode = function noop() {
};
componentsUtil$3.___destroyNodeRecursive = function noop2() {
};
{
  componentsUtil$3.___startDOMManipulationWarning = function noop4() {
  };
  componentsUtil$3.___stopDOMManipulationWarning = function noop4() {
  };
}
var helpers$1 = {};
function insertBefore$1(node, referenceNode, parentNode) {
  if (node.insertInto) {
    return node.insertInto(parentNode, referenceNode);
  }
  return parentNode.insertBefore(
    node,
    referenceNode && referenceNode.startNode || referenceNode
  );
}
function insertAfter$1(node, referenceNode, parentNode) {
  return insertBefore$1(
    node,
    referenceNode && referenceNode.nextSibling,
    parentNode
  );
}
function nextSibling(node) {
  var next = node.nextSibling;
  var fragment = next && next.fragment;
  if (fragment) {
    return next === fragment.startNode ? fragment : null;
  }
  return next;
}
function firstChild(node) {
  var next = node.firstChild;
  return next && next.fragment || next;
}
function removeChild$1(node) {
  if (node.remove)
    node.remove();
  else
    node.parentNode.removeChild(node);
}
helpers$1.___insertBefore = insertBefore$1;
helpers$1.___insertAfter = insertAfter$1;
helpers$1.___nextSibling = nextSibling;
helpers$1.___firstChild = firstChild;
helpers$1.___removeChild = removeChild$1;
var extend$2 = extend$3;
var componentsUtil$2 = componentsUtil$3;
var destroyComponentForNode = componentsUtil$2.___destroyComponentForNode;
var destroyNodeRecursive = componentsUtil$2.___destroyNodeRecursive;
var helpers = helpers$1;
var insertBefore = helpers.___insertBefore;
var insertAfter = helpers.___insertAfter;
var removeChild = helpers.___removeChild;
function resolveEl(el) {
  if (typeof el == "string") {
    var elId = el;
    el = document.getElementById(elId);
    if (!el) {
      throw Error("Not found: " + elId);
    }
  }
  return el;
}
function beforeRemove(referenceEl) {
  destroyNodeRecursive(referenceEl);
  destroyComponentForNode(referenceEl);
}
var domInsert$1 = function(target, getEl2, afterInsert2) {
  extend$2(target, {
    appendTo: function(referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl2(this, referenceEl);
      insertBefore(el, null, referenceEl);
      return afterInsert2(this, referenceEl);
    },
    prependTo: function(referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl2(this, referenceEl);
      insertBefore(el, referenceEl.firstChild || null, referenceEl);
      return afterInsert2(this, referenceEl);
    },
    replace: function(referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl2(this, referenceEl);
      beforeRemove(referenceEl);
      insertBefore(el, referenceEl, referenceEl.parentNode);
      removeChild(referenceEl);
      return afterInsert2(this, referenceEl);
    },
    replaceChildrenOf: function(referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl2(this, referenceEl);
      var curChild = referenceEl.firstChild;
      while (curChild) {
        var nextSibling2 = curChild.nextSibling;
        beforeRemove(curChild);
        curChild = nextSibling2;
      }
      referenceEl.innerHTML = "";
      insertBefore(el, null, referenceEl);
      return afterInsert2(this, referenceEl);
    },
    insertBefore: function(referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl2(this, referenceEl);
      insertBefore(el, referenceEl, referenceEl.parentNode);
      return afterInsert2(this, referenceEl);
    },
    insertAfter: function(referenceEl) {
      referenceEl = resolveEl(referenceEl);
      var el = getEl2(this, referenceEl);
      insertAfter(el, referenceEl, referenceEl.parentNode);
      return afterInsert2(this, referenceEl);
    }
  });
};
var domInsert = domInsert$1;
var complain$5 = complainExports;
function getRootNode(el) {
  var cur = el;
  while (cur.parentNode)
    cur = cur.parentNode;
  return cur;
}
function getComponentDefs(result) {
  var componentDefs = result.___components;
  if (!componentDefs) {
    throw Error("No component");
  }
  return componentDefs;
}
function RenderResult$1(out) {
  this.out = this.___out = out;
  this.___components = void 0;
}
var RenderResult_1 = RenderResult$1;
var proto$1 = RenderResult$1.prototype = {
  getComponent: function() {
    return this.getComponents()[0];
  },
  getComponents: function(selector) {
    if (this.___components === void 0) {
      throw Error("Not added to DOM");
    }
    var componentDefs = getComponentDefs(this);
    var components2 = [];
    componentDefs.forEach(function(componentDef) {
      var component = componentDef.___component;
      if (!selector || selector(component)) {
        components2.push(component);
      }
    });
    return components2;
  },
  afterInsert: function(host) {
    var out = this.___out;
    var componentsContext = out.___components;
    if (componentsContext) {
      this.___components = componentsContext.___initComponents(host);
    } else {
      this.___components = null;
    }
    return this;
  },
  getNode: function(host) {
    return this.___out.___getNode(host);
  },
  getOutput: function() {
    return this.___out.___getOutput();
  },
  toString: function() {
    return this.___out.toString();
  },
  document: typeof document === "object" && document
};
Object.defineProperty(proto$1, "html", {
  get: function() {
    {
      complain$5(
        'The "html" property is deprecated. Please use "toString" instead.'
      );
    }
    return this.toString();
  }
});
Object.defineProperty(proto$1, "context", {
  get: function() {
    {
      complain$5(
        'The "context" property is deprecated. Please use "out" instead.'
      );
    }
    return this.___out;
  }
});
domInsert(
  proto$1,
  function getEl(renderResult, referenceEl) {
    return renderResult.getNode(getRootNode(referenceEl));
  },
  function afterInsert(renderResult, referenceEl) {
    return renderResult.afterInsert(getRootNode(referenceEl));
  }
);
var escapeQuoteHelpers$1 = escapeQuotes;
var escapeDoubleQuotes$2 = escapeQuoteHelpers$1.___escapeDoubleQuotes;
var escapeSingleQuotes$1 = escapeQuoteHelpers$1.___escapeSingleQuotes;
var complain$4 = complainExports;
var attr$2 = maybeEmptyAttr;
maybeEmptyAttr.___notEmptyAttr = notEmptyAttr$1;
maybeEmptyAttr.___isEmptyAttrValue = isEmpty;
function maybeEmptyAttr(name, value) {
  if (isEmpty(value)) {
    return "";
  }
  return notEmptyAttr$1(name, value);
}
function notEmptyAttr$1(name, value) {
  switch (typeof value) {
    case "string":
      return " " + name + guessQuotes(value);
    case "boolean":
      return " " + name;
    case "number":
      return " " + name + "=" + value;
    case "object":
      switch (value.toString) {
        case Object.prototype.toString:
        case Array.prototype.toString:
          {
            complain$4(
              "Relying on JSON.stringify for attribute values is deprecated, in future versions of Marko these will be cast to strings instead.",
              { locationIndex: 2 }
            );
          }
          return " " + name + singleQuote(JSON.stringify(value), 2);
        case RegExp.prototype.toString:
          return " " + name + guessQuotes(value.source);
      }
  }
  return " " + name + guessQuotes(value + "");
}
function isEmpty(value) {
  return value == null || value === false;
}
function doubleQuote(value, startPos) {
  return '="' + escapeDoubleQuotes$2(value, startPos) + '"';
}
function singleQuote(value, startPos) {
  return "='" + escapeSingleQuotes$1(value, startPos) + "'";
}
function guessQuotes(value) {
  for (var i = 0, len = value.length; i < len; i++) {
    switch (value[i]) {
      case '"':
        return singleQuote(value, i + 1);
      case "'":
      case ">":
      case " ":
      case "	":
      case "\n":
      case "\r":
      case "\f":
        return doubleQuote(value, i + 1);
    }
  }
  return value && "=" + (value[len - 1] === "/" ? value + " " : value);
}
var _marko_attr = /* @__PURE__ */ getDefaultExportFromCjs(attr$2);
var classValue = function classHelper(arg) {
  switch (typeof arg) {
    case "string":
      return arg || null;
    case "object":
      var result = "";
      var sep = "";
      if (Array.isArray(arg)) {
        for (var i = 0, len = arg.length; i < len; i++) {
          var value = classHelper(arg[i]);
          if (value) {
            result += sep + value;
            sep = " ";
          }
        }
      } else {
        for (var key in arg) {
          if (arg[key]) {
            result += sep + key;
            sep = " ";
          }
        }
      }
      return result || null;
    default:
      return null;
  }
};
var attr$1 = attr$2;
var classHelper$1 = classValue;
var classAttr = function classAttr2(value) {
  return attr$1("class", classHelper$1(value));
};
var _changeCase = {};
var camelToDashLookup = /* @__PURE__ */ Object.create(null);
var dashToCamelLookup = /* @__PURE__ */ Object.create(null);
_changeCase.___camelToDashCase = function camelToDashCase(name) {
  var nameDashed = camelToDashLookup[name];
  if (!nameDashed) {
    nameDashed = camelToDashLookup[name] = name.replace(/([A-Z])/g, "-$1").toLowerCase();
    if (nameDashed !== name) {
      dashToCamelLookup[nameDashed] = name;
    }
  }
  return nameDashed;
};
_changeCase.___dashToCamelCase = function dashToCamelCase(name) {
  var nameCamel = dashToCamelLookup[name];
  if (!nameCamel) {
    nameCamel = dashToCamelLookup[name] = name.replace(
      /-([a-z])/g,
      matchToUpperCase
    );
    if (nameCamel !== name) {
      camelToDashLookup[nameCamel] = name;
    }
  }
  return nameCamel;
};
function matchToUpperCase(_, char) {
  return char.toUpperCase();
}
var changeCase$1 = _changeCase;
var styleValue = function styleHelper(style) {
  if (!style) {
    return null;
  }
  var type = typeof style;
  if (type !== "string") {
    var styles = "";
    var sep = "";
    if (Array.isArray(style)) {
      for (var i = 0, len = style.length; i < len; i++) {
        var next = styleHelper(style[i]);
        if (next) {
          styles += sep + next;
          sep = ";";
        }
      }
    } else if (type === "object") {
      for (var name in style) {
        var value = style[name];
        if (value != null && value !== false) {
          if (typeof value === "number" && value) {
            value += "px";
          }
          styles += sep + changeCase$1.___camelToDashCase(name) + ":" + value;
          sep = ";";
        }
      }
    }
    return styles || null;
  }
  return style;
};
var attr = attr$2;
var styleHelper$1 = styleValue;
var styleAttr = function styleAttr2(value) {
  return attr("style", styleHelper$1(value));
};
var attrHelper = attr$2;
var notEmptyAttr = attrHelper.___notEmptyAttr;
var isEmptyAttrValue = attrHelper.___isEmptyAttrValue;
var classHelper2 = classAttr;
var styleHelper2 = styleAttr;
var _dynamicAttr = function dynamicAttr(name, value) {
  switch (name) {
    case "class":
      return classHelper2(value);
    case "style":
      return styleHelper2(value);
    case "renderBody":
      return "";
    default:
      return isEmptyAttrValue(value) || isInvalidAttrName(name) ? "" : notEmptyAttr(name, value);
  }
};
function isInvalidAttrName(name) {
  for (let i = name.length; i--; ) {
    if (name[i] === ">") {
      return true;
    }
  }
  return false;
}
var complain$3 = complainExports;
var dynamicAttrHelper = _dynamicAttr;
var attrs = function attrs2(arg) {
  switch (typeof arg) {
    case "object":
      var result = "";
      for (var attrName in arg) {
        result += dynamicAttrHelper(attrName, arg[attrName]);
      }
      return result;
    case "string":
      {
        complain$3(
          "Passing a string as a dynamic attribute value is deprecated - More details: https://github.com/marko-js/marko/wiki/Deprecation:-String-as-dynamic-attribute-value"
        );
      }
      return arg;
    default:
      return "";
  }
};
var escapeQuoteHelpers = escapeQuotes;
var escapeSingleQuotes = escapeQuoteHelpers.___escapeSingleQuotes;
var escapeDoubleQuotes$1 = escapeQuoteHelpers.___escapeDoubleQuotes;
var FLAG_WILL_RERENDER_IN_BROWSER$3 = 1;
var dataMarko = function dataMarko2(out, componentDef, props, key) {
  var result = "";
  var willNotRerender = out.___components.___isPreserved || componentDef.___renderBoundary && (componentDef.___flags & FLAG_WILL_RERENDER_IN_BROWSER$3) === 0;
  if (willNotRerender) {
    if (props) {
      for (var _ in props) {
        result += " data-marko='" + escapeSingleQuotes(JSON.stringify(props)) + "'";
        break;
      }
    }
    if (key && key[0] === "@") {
      result += ' data-marko-key="' + escapeDoubleQuotes$1(
        componentDef.___nextKey(key) + " " + componentDef.id
      ) + '"';
    }
  }
  return result;
};
var escapeXml = {};
var x = escapeXml.x = function(value) {
  if (value == null) {
    return "";
  }
  if (value.toHTML) {
    return value.toHTML();
  }
  return escapeXML(value + "");
};
escapeXml.___escapeXML = escapeXML;
function escapeXML(str) {
  var len = str.length;
  var result = "";
  var lastPos = 0;
  var i = 0;
  var replacement;
  for (; i < len; i++) {
    switch (str[i]) {
      case "<":
        replacement = "&lt;";
        break;
      case "&":
        replacement = "&amp;";
        break;
      default:
        continue;
    }
    result += str.slice(lastPos, i) + replacement;
    lastPos = i + 1;
  }
  if (lastPos) {
    return result + str.slice(lastPos);
  }
  return str;
}
var parseHTML$1 = function(html) {
  var container = document.createElement("template");
  parseHTML$1 = container.content ? function(html2) {
    container.innerHTML = html2;
    return container.content;
  } : function(html2) {
    container.innerHTML = html2;
    return container;
  };
  return parseHTML$1(html);
};
var parseHtml = function(html) {
  return parseHTML$1(html).firstChild;
};
var selfClosingTags$1 = { exports: {} };
var svgElements = [
  "circle",
  "ellipse",
  "line",
  "path",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "use"
];
var voidElements = [
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];
selfClosingTags$1.exports = voidElements.concat(svgElements);
selfClosingTags$1.exports.voidElements = voidElements;
selfClosingTags$1.exports.svgElements = svgElements;
var selfClosingTagsExports = selfClosingTags$1.exports;
var EventEmitter = src$1;
var StringWriter = StringWriter_1;
var BufferedWriter$1 = BufferedWriter_1;
var RenderResult = RenderResult_1;
var attrsHelper = attrs;
var markoAttr = dataMarko;
var escapeXmlHelper = escapeXml;
var parseHTML = parseHtml;
var escapeXmlOrNullish = escapeXmlHelper.x;
var escapeXmlString = escapeXmlHelper.___escapeXML;
var selfClosingTags = selfClosingTagsExports;
function noop$1() {
}
var voidWriter = {
  write: noop$1,
  script: noop$1,
  merge: noop$1,
  clear: noop$1,
  get: function() {
    return [];
  },
  toString: function() {
    return "";
  }
};
function State(root, stream, writer, events) {
  this.root = root;
  this.stream = stream;
  this.writer = writer;
  this.events = events;
  this.finished = false;
}
function escapeEndingComment(text) {
  return text.replace(/(--!?)>/g, "$1&gt;");
}
function AsyncStream$1(global2, writer, parentOut) {
  if (parentOut === null) {
    throw new Error("illegal state");
  }
  var finalGlobal = this.attributes = global2 || {};
  var originalStream;
  var state;
  if (parentOut) {
    state = parentOut._state;
    originalStream = state.stream;
  } else {
    var events = finalGlobal.events = writer && writer.on ? writer : new EventEmitter();
    if (writer) {
      originalStream = writer;
      writer = new BufferedWriter$1(writer);
    } else {
      writer = originalStream = new StringWriter();
    }
    state = new State(this, originalStream, writer, events);
    writer.state = state;
  }
  finalGlobal.runtimeId = finalGlobal.runtimeId || "M";
  this.global = finalGlobal;
  this.stream = originalStream;
  this._state = state;
  this._ended = false;
  this._remaining = 1;
  this._lastCount = 0;
  this._last = void 0;
  this._parentOut = parentOut;
  this.data = {};
  this.writer = writer;
  writer.stream = this;
  this._sync = false;
  this._stack = void 0;
  this.name = void 0;
  this._timeoutId = void 0;
  this._node = void 0;
  this._elStack = void 0;
  this.___components = null;
  this.___assignedComponentDef = null;
  this.___assignedKey = null;
  this.___assignedCustomEvents = null;
  this.___isLast = false;
}
AsyncStream$1.DEFAULT_TIMEOUT = 1e4;
AsyncStream$1.INCLUDE_STACK = typeof process !== "undefined" && false;
AsyncStream$1.enableAsyncStackTrace = function() {
  AsyncStream$1.INCLUDE_STACK = true;
};
var proto = AsyncStream$1.prototype = {
  constructor: AsyncStream$1,
  ___host: typeof document === "object" && document,
  ___isOut: true,
  sync: function() {
    this._sync = true;
  },
  isSync: function() {
    return this._sync === true;
  },
  write: function(str) {
    if (str != null) {
      this.writer.write(str.toString());
    }
    return this;
  },
  script: function(str) {
    if (str != null) {
      this.writer.script(str.toString());
    }
    return this;
  },
  ___getOutput: function() {
    return this._state.writer.toString();
  },
  getOutput: function() {
    return this.___getOutput();
  },
  toString: function() {
    return this._state.writer.toString();
  },
  ___getResult: function() {
    this._result = this._result || new RenderResult(this);
    return this._result;
  },
  beginAsync: function(options) {
    if (this._sync) {
      throw new Error("beginAsync() not allowed when using renderSync()");
    }
    var state = this._state;
    var currentWriter = this.writer;
    var newWriter = new StringWriter();
    var newStream = new AsyncStream$1(this.global, currentWriter, this);
    newWriter.state = state;
    this.writer = newWriter;
    newWriter.stream = this;
    newWriter.next = currentWriter.next;
    currentWriter.next = newWriter;
    var timeout;
    var name;
    this._remaining++;
    if (options != null) {
      if (typeof options === "number") {
        timeout = options;
      } else {
        timeout = options.timeout;
        if (options.last === true) {
          if (timeout == null) {
            timeout = 0;
          }
          this._lastCount++;
          newStream.___isLast = true;
        }
        name = options.name;
      }
    }
    if (timeout == null) {
      timeout = AsyncStream$1.DEFAULT_TIMEOUT;
    }
    newStream._stack = AsyncStream$1.INCLUDE_STACK ? new Error() : null;
    newStream.name = name;
    if (timeout > 0) {
      newStream._timeoutId = setTimeout(function() {
        newStream.error(
          new Error(
            "Async fragment " + (name ? "(" + name + ") " : "") + "timed out after " + timeout + "ms"
          )
        );
      }, timeout);
    }
    state.events.emit("beginAsync", {
      out: newStream,
      parentOut: this
    });
    return newStream;
  },
  _doFinish: function() {
    var state = this._state;
    state.finished = true;
    if (state.writer.end) {
      state.writer.end();
    }
    if (state.events !== state.stream) {
      state.events.emit("finish", this.___getResult());
    }
  },
  end: function(data) {
    if (this._ended === true) {
      return;
    }
    this._ended = true;
    var remaining = --this._remaining;
    if (data != null) {
      this.write(data);
    }
    var currentWriter = this.writer;
    this.writer = voidWriter;
    currentWriter.stream = null;
    this._flushNext(currentWriter);
    var parentOut = this._parentOut;
    if (parentOut === void 0) {
      if (remaining === 0) {
        this._doFinish();
      } else if (remaining - this._lastCount === 0) {
        this._emitLast();
      }
    } else {
      var timeoutId = this._timeoutId;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (remaining === 0) {
        parentOut._handleChildDone(this);
      } else if (remaining - this._lastCount === 0) {
        this._emitLast();
      }
    }
    return this;
  },
  _handleChildDone: function(childOut) {
    var remaining = --this._remaining;
    if (remaining === 0) {
      var parentOut = this._parentOut;
      if (parentOut === void 0) {
        this._doFinish();
      } else {
        parentOut._handleChildDone(this);
      }
    } else {
      if (childOut.___isLast) {
        this._lastCount--;
      }
      if (remaining - this._lastCount === 0) {
        this._emitLast();
      }
    }
  },
  _flushNext: function(currentWriter) {
    var nextWriter = currentWriter.next;
    if (nextWriter) {
      currentWriter.merge(nextWriter);
      currentWriter.next = nextWriter.next;
      var nextStream = nextWriter.stream;
      if (nextStream) {
        nextStream.writer = currentWriter;
        currentWriter.stream = nextStream;
      }
    }
  },
  on: function(event, callback) {
    var state = this._state;
    if (event === "finish" && state.finished === true) {
      callback(this.___getResult());
    } else if (event === "last") {
      this.onLast(callback);
    } else {
      state.events.on(event, callback);
    }
    return this;
  },
  once: function(event, callback) {
    var state = this._state;
    if (event === "finish" && state.finished === true) {
      callback(this.___getResult());
    } else if (event === "last") {
      this.onLast(callback);
    } else {
      state.events.once(event, callback);
    }
    return this;
  },
  onLast: function(callback) {
    var lastArray = this._last;
    if (lastArray === void 0) {
      this._last = [callback];
    } else {
      lastArray.push(callback);
    }
    return this;
  },
  _emitLast: function() {
    if (this._last) {
      var i = 0;
      var lastArray = this._last;
      this._last = void 0;
      (function next() {
        if (i === lastArray.length) {
          return;
        }
        var lastCallback = lastArray[i++];
        lastCallback(next);
        if (lastCallback.length === 0) {
          next();
        }
      })();
    }
  },
  emit: function(type, arg) {
    var events = this._state.events;
    switch (arguments.length) {
      case 1:
        events.emit(type);
        break;
      case 2:
        events.emit(type, arg);
        break;
      default:
        events.emit.apply(events, arguments);
        break;
    }
    return this;
  },
  removeListener: function() {
    var events = this._state.events;
    events.removeListener.apply(events, arguments);
    return this;
  },
  prependListener: function() {
    var events = this._state.events;
    events.prependListener.apply(events, arguments);
    return this;
  },
  pipe: function(stream) {
    this._state.stream.pipe(stream);
    return this;
  },
  error: function(e) {
    var name = this.name;
    var stack = this._stack;
    if (stack)
      stack = getNonMarkoStack(stack);
    if (!(e instanceof Error)) {
      e = new Error(JSON.stringify(e));
    }
    if (name || stack) {
      e.message += "\nRendered by" + (name ? " " + name : "") + (stack ? ":\n" + stack : "");
    }
    try {
      this.emit("error", e);
    } finally {
      this.end();
    }
    return this;
  },
  flush: function() {
    var state = this._state;
    if (!state.finished) {
      var writer = state.writer;
      if (writer && writer.scheduleFlush) {
        writer.scheduleFlush();
      }
    }
    return this;
  },
  createOut: function() {
    var newOut = new AsyncStream$1(this.global);
    newOut.on("error", this.emit.bind(this, "error"));
    this._state.events.emit("beginDetachedAsync", {
      out: newOut,
      parentOut: this
    });
    return newOut;
  },
  ___elementDynamic: function(tagName, elementAttrs, key, componentDef, props) {
    var str = "<" + tagName + markoAttr(this, componentDef, props, key) + attrsHelper(elementAttrs);
    if (selfClosingTags.voidElements.indexOf(tagName) !== -1) {
      str += ">";
    } else if (selfClosingTags.svgElements.indexOf(tagName) !== -1) {
      str += "/>";
    } else {
      str += "></" + tagName + ">";
    }
    this.write(str);
  },
  element: function(tagName, elementAttrs, openTagOnly) {
    var str = "<" + tagName + attrsHelper(elementAttrs) + ">";
    if (openTagOnly !== true) {
      str += "</" + tagName + ">";
    }
    this.write(str);
  },
  ___beginElementDynamic: function(name, elementAttrs, key, componentDef, props) {
    var str = "<" + name + markoAttr(this, componentDef, props, key) + attrsHelper(elementAttrs) + ">";
    this.write(str);
    if (this._elStack) {
      this._elStack.push(name);
    } else {
      this._elStack = [name];
    }
  },
  beginElement: function(name, elementAttrs) {
    var str = "<" + name + attrsHelper(elementAttrs) + ">";
    this.write(str);
    if (this._elStack) {
      this._elStack.push(name);
    } else {
      this._elStack = [name];
    }
  },
  endElement: function() {
    var tagName = this._elStack.pop();
    this.write("</" + tagName + ">");
  },
  comment: function(str) {
    this.write("<!--" + escapeEndingComment(str) + "-->");
  },
  text: function(str) {
    this.write(escapeXmlOrNullish(str));
  },
  bf: function(key, component, preserve) {
    if (preserve) {
      this.write("<!--F#" + escapeXmlString(key) + "-->");
    }
    if (this._elStack) {
      this._elStack.push(preserve);
    } else {
      this._elStack = [preserve];
    }
  },
  ef: function() {
    var preserve = this._elStack.pop();
    if (preserve) {
      this.write("<!--F/-->");
    }
  },
  ___getNode: function(host) {
    var node = this._node;
    if (!node) {
      var nextEl;
      var fragment;
      var html = this.___getOutput();
      if (!host)
        host = this.___host;
      var doc = host.ownerDocument || host;
      if (html) {
        node = parseHTML(html);
        if (node && node.nextSibling) {
          fragment = doc.createDocumentFragment();
          do {
            nextEl = node.nextSibling;
            fragment.appendChild(node);
          } while (node = nextEl);
          node = fragment;
        }
      }
      this._node = node || doc.createDocumentFragment();
    }
    return node;
  },
  then: function(fn, fnErr) {
    var out = this;
    var promise = new Promise(function(resolve2, reject) {
      out.on("error", reject);
      out.on("finish", function(result) {
        resolve2(result);
      });
    });
    return Promise.resolve(promise).then(fn, fnErr);
  },
  catch: function(fnErr) {
    return this.then(void 0, fnErr);
  },
  c: function(componentDef, key, customEvents) {
    this.___assignedComponentDef = componentDef;
    this.___assignedKey = key;
    this.___assignedCustomEvents = customEvents;
  }
};
proto.w = proto.write;
proto.___endElement = proto.endElement;
var AsyncStream_1 = AsyncStream$1;
function getNonMarkoStack(error) {
  return error.stack.toString().split("\n").slice(1).filter((line) => !/\/node_modules\/marko\//.test(line)).join("\n");
}
var actualCreateOut;
function setCreateOut(createOutFunc) {
  actualCreateOut = createOutFunc;
}
function createOut(globalData) {
  return actualCreateOut(globalData);
}
createOut.___setCreateOut = setCreateOut;
var createOut_1 = createOut;
var defaultCreateOut = createOut_1;
var setImmediate = indexWorker.___setImmediate;
var extend$1 = extend$3;
function safeRender(renderFunc, finalData, finalOut, shouldEnd) {
  try {
    renderFunc(finalData, finalOut);
    if (shouldEnd) {
      finalOut.end();
    }
  } catch (err) {
    var actualEnd = finalOut.end;
    finalOut.end = function() {
    };
    setImmediate(function() {
      finalOut.end = actualEnd;
      finalOut.error(err);
    });
  }
  return finalOut;
}
var renderable = function(target, renderer2) {
  var renderFunc = renderer2 && (renderer2.renderer || renderer2.render || renderer2);
  var createOut3 = target.createOut || renderer2.createOut || defaultCreateOut;
  return extend$1(target, {
    _: renderFunc,
    createOut: createOut3,
    renderToString: function(data, callback) {
      var localData = data || {};
      var render3 = renderFunc || this._;
      var globalData = localData.$global;
      var out = createOut3(globalData);
      out.global.template = this;
      if (globalData) {
        localData.$global = void 0;
      }
      if (callback) {
        out.on("finish", function() {
          callback(null, out.toString(), out);
        }).once("error", callback);
        return safeRender(render3, localData, out, true);
      } else {
        out.sync();
        render3(localData, out);
        return out.toString();
      }
    },
    renderSync: function(data) {
      var localData = data || {};
      var render3 = renderFunc || this._;
      var globalData = localData.$global;
      var out = createOut3(globalData);
      out.sync();
      out.global.template = this;
      if (globalData) {
        localData.$global = void 0;
      }
      render3(localData, out);
      return out.___getResult();
    },
    render: function(data, out) {
      var callback;
      var finalOut;
      var finalData;
      var globalData;
      var render3 = renderFunc || this._;
      var shouldBuffer = this.___shouldBuffer;
      var shouldEnd = true;
      if (data) {
        finalData = data;
        if (globalData = data.$global) {
          finalData.$global = void 0;
        }
      } else {
        finalData = {};
      }
      if (out && out.___isOut) {
        finalOut = out;
        shouldEnd = false;
        extend$1(out.global, globalData);
      } else if (typeof out == "function") {
        finalOut = createOut3(globalData);
        callback = out;
      } else {
        finalOut = createOut3(
          globalData,
          out,
          void 0,
          shouldBuffer
        );
      }
      if (callback) {
        finalOut.on("finish", function() {
          callback(null, finalOut.___getResult(), finalOut);
        }).once("error", callback);
      }
      globalData = finalOut.global;
      globalData.template = globalData.template || this;
      return safeRender(render3, finalData, finalOut, shouldEnd);
    }
  });
};
globalThis.Marko = {
  Component: function() {
  }
};
var t = function createTemplate(typeName) {
  return new Template(typeName);
};
function Template(typeName) {
  this.path = this.___typeName = typeName;
}
Template.prototype.stream = indexBrowser;
var AsyncStream = AsyncStream_1;
createOut_1.___setCreateOut(
  Template.prototype.createOut = function createOut2(globalData, writer, parentOut, buffer) {
    return new AsyncStream(globalData, writer, parentOut);
  }
);
renderable(Template.prototype);
var _asset = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAASAAAAEgARslrPgAABiZJREFUWMPtlmuMXVUVx3/7cc69d+bO9N559DGlj6lTqZSmtYJatEnHKKAxMRIoCVGrxbYUyFCCiCbGGD+oIaGZ0sEURII8wkBEDBbpk0psoJa0tqU0CFRKsKXtvOc+zj33nH2WH3rvMGiaxsT4xf6Tk+ysc85a//9ae6294SIu4v8d6r/tsLDsYRCHMs0gjuwr3/jPCGzYvZ8DJ08u755/6Zeb0mlEAEhQ8oxS6sjdS+YB8PPHPkMUqzkrl418q7MtzCSiBNDGJNv/segH+83MsZuBDiABFMLzSql9s1+75/wEOh7oxyWSt7j+z3fOvrqrNY8IKJOQ6Pg3hbi43iob2MN3oX2n4sC/99PzSt/rvrSAUpDSCY02fs2VvJtOr1z1XUx8T10BJC9C9E1QQ3MO3DsR09QXXb/ehpOYhlTjbcr4awqR076NCKVMSRUIkvLHw6T6piBvNBdfwhp9tbbyk5HAZJttTINyZFWEdclMbaJC4fm5DxIFV0F5JgRAZR6EJ33j71/X3sXmM4cBsHUCueY2tGpbXI2ra0XEguJkEEizHURFTgENgtwZJG5fV+PwSDnJbbDCNBE4NpKWuamypFWka3rXdjzSv+Pk9V/ZhBc9DJI5J1Z6wnhob0qrQx/JwPW732dqNudrbX/akGr4UjbdSDadRZv0b0c5dqboip1lF1B2wSVlF4wtsG8tMJZbjIexPgToA0vTY680JvFCIgEnjRKSk/axvupf03MgWAQVoNKqCLXI8M4N0+e53jMnsKv/9D7ONmCN/ppnvRtE6jtD3kuS/C/eHR9oT0QWi9AKkNHRreOZKdU2Pe7V1IaJqE0zkvLeKNDzgSU1cV/NXvHBC4UtrRtVqvpZRDoBBG4Ct00p/dybl1+Ozmen0J72pmWt6cn5fnM+5ZNP+ZLzU1tymcGDw+WBXaW4/FTZlSm7Mm16oL2oMjPxPIxnMZ591vrq9+9Wsyckkj6JJJRIkEg8VeXOGVuOliWuPCRURKggVLJCtCGRsCOlDfov5UYajFrTZPhck4UmC1nDnpTm0UY9A89vdMD9gjoyyyuyKD2EUZogyQDmFJg+hVfsSEoIPI3iBVQti4qFSrPOzqo+Brz8oZnlGll1KD0XfVVDcZkTWT2pJStW8UDaqNMtwSCSOBakx95u1NGmT2YGj87wykdbTHhUK30swd5nifYlokl/YRgCXZRIbUrGzNlkxJCMGJIBs6pt9cBllchuHsMPRvEZxVdDpG+ZGg4stycCKVZFShPtCsZB1ipFsdLA2es2snLPdXR5o48vSI38QStRAIkoBDteoUnuXr4TgNLWJoBmNN6kCVPxPFfaZmdfYpUzdbOCkkFKNsC87hK3BeittaUH9FRF9vp+5u8Afd2/A4iAgfON1NEfzwIVt0qoNpCQn5h0orZs3b7gdE6FfSL4NXPsUJtbVHxQO+cAngB2TPL3KWBNtTyqr9l5lgth5P7p2EShm5LvmBa3wrQ5TJvDtLhXJSOPNki8Lke4NE9InpAc4YtZov5IBPvHFTmu3TE4prTuTZy7ApGpNb83a0nvlEheuhCB9BQhyYVLTKTWipybLQrKSrHx8H2d8/K2+u0PK8ygQ/VqGOk+8mc0QFQoE5VKu+NC8GQ0HlB72qNi0FMdLuRXPHn8vMFL21pxMyNfT3E9uiWeb1pjTGuManH9Q7um7M3Zyl05wml5QloIyVF9JBJ5OS3V+l44hxVPHEeS5GNJ7J5BZGm9VpLI7TaTerAyNMa+O5Z+JPhbTzfT2e7hkBuV8CuEpprX98STr59aP2cZht7avgI46FA3KuSdriOHgElnQfnUMNo3x5XWv5Qk6UMkXXt/R3W0tFfBG/+qfvZUSyzSoaEHRVNNjmDoO3XrnIoyctuk4KGCXq14x4ib8KHri/3fvxJXqeKC8KmoEGytniuDROPBJ+JSZX0wOOot+dGeiR8LO/Oku4fRsBZYNonXruoHtl8puR24DKiX/1mB50SEWUden/j43y4ki3+4G6X0QpArQdVPhnFgO1A69LPucxnbnQeUZxRfBKZTv3hoDpy4ofNtf0Z8LZCrEVAKXkWpv809fOiCXXURF3ER/1P8E+oo2XFV0bPuAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE1LTA4LTI2VDE2OjM2OjAyKzAwOjAwgXV1bQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNS0wOC0yNlQxNjozNjowMiswMDowMPAozdEAAABGdEVYdHNvZnR3YXJlAEltYWdlTWFnaWNrIDYuNy44LTkgMjAxNC0wNS0xMiBRMTYgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmfchu0AAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OmhlaWdodAAxOTIPAHKFAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADE5MtOsIQgAAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTQ0MDYwNjk2MuwEGPsAAAAPdEVYdFRodW1iOjpTaXplADBCQpSiPuwAAABWdEVYdFRodW1iOjpVUkkAZmlsZTovLy9tbnRsb2cvZmF2aWNvbnMvMjAxNS0wOC0yNi9kYWI1YTMzYmM4MDI5OWQ2YmFhNmQ1NGIyZmI5MTEwMy5pY28ucG5nBTJ6eQAAAABJRU5ErkJggg==";
var toString = function(value) {
  return value == null ? "" : value + "";
};
var _marko_to_string = /* @__PURE__ */ getDefaultExportFromCjs(toString);
var ComponentsContext$3 = { exports: {} };
var nextComponentIdProvider = componentsUtil$3.___nextComponentIdProvider;
function GlobalComponentsContext(out) {
  this.___renderedComponentsById = {};
  this.___rerenderComponent = void 0;
  this.___nextComponentId = nextComponentIdProvider(out);
}
var GlobalComponentsContext_1 = GlobalComponentsContext;
(function(module, exports) {
  var GlobalComponentsContext2 = GlobalComponentsContext_1;
  function ComponentsContext2(out, parentComponentsContext) {
    var globalComponentsContext;
    var componentDef;
    if (parentComponentsContext) {
      globalComponentsContext = parentComponentsContext.___globalContext;
      componentDef = parentComponentsContext.___componentDef;
      var nestedContextsForParent;
      if (!(nestedContextsForParent = parentComponentsContext.___nestedContexts)) {
        nestedContextsForParent = parentComponentsContext.___nestedContexts = [];
      }
      nestedContextsForParent.push(this);
    } else {
      globalComponentsContext = out.global.___components;
      if (globalComponentsContext === void 0) {
        out.global.___components = globalComponentsContext = new GlobalComponentsContext2(out);
      }
    }
    this.___globalContext = globalComponentsContext;
    this.___components = [];
    this.___out = out;
    this.___componentDef = componentDef;
    this.___nestedContexts = void 0;
    this.___isPreserved = parentComponentsContext && parentComponentsContext.___isPreserved;
  }
  ComponentsContext2.prototype = {
    ___initComponents: function(host) {
      var componentDefs = this.___components;
      ComponentsContext2.___initClientRendered(componentDefs, host);
      this.___out.emit("___componentsInitialized");
      this.___out.global.___components = void 0;
      return componentDefs;
    }
  };
  function getComponentsContext2(out) {
    return out.___components || (out.___components = new ComponentsContext2(out));
  }
  module.exports = exports = ComponentsContext2;
  exports.___getComponentsContext = getComponentsContext2;
})(ComponentsContext$3, ComponentsContext$3.exports);
var ComponentsContextExports = ComponentsContext$3.exports;
var constants$4 = {};
var win = typeof window !== "undefined" ? window : commonjsGlobal;
constants$4.NOOP = win.$W10NOOP = win.$W10NOOP || function() {
};
var constants$3 = constants$4;
var eventDelegation = {};
var componentsUtil$1 = componentsUtil$3;
var runtimeId = componentsUtil$1.___runtimeId;
var componentLookup$1 = componentsUtil$1.___componentLookup;
var getMarkoPropsFromEl = componentsUtil$1.___getMarkoPropsFromEl;
var TEXT_NODE = 3;
var listenersAttachedKey = "$MDE" + runtimeId;
var delegatedEvents = {};
function getEventFromEl(el, eventName) {
  var virtualProps = getMarkoPropsFromEl(el);
  var eventInfo = virtualProps[eventName];
  if (typeof eventInfo === "string") {
    eventInfo = eventInfo.split(" ");
    if (eventInfo[2]) {
      eventInfo[2] = eventInfo[2] === "true";
    }
    if (eventInfo.length == 4) {
      eventInfo[3] = parseInt(eventInfo[3], 10);
    }
  }
  return eventInfo;
}
function delegateEvent(node, eventName, target, event) {
  var targetMethod = target[0];
  var targetComponentId = target[1];
  var isOnce = target[2];
  var extraArgs = target[3];
  if (isOnce) {
    var virtualProps = getMarkoPropsFromEl(node);
    delete virtualProps[eventName];
  }
  var targetComponent = componentLookup$1[targetComponentId];
  if (!targetComponent) {
    return;
  }
  var targetFunc = typeof targetMethod === "function" ? targetMethod : targetComponent[targetMethod];
  if (!targetFunc) {
    throw Error("Method not found: " + targetMethod);
  }
  if (extraArgs != null) {
    if (typeof extraArgs === "number") {
      extraArgs = targetComponent.___bubblingDomEvents[extraArgs];
    }
  }
  if (extraArgs) {
    targetFunc.apply(targetComponent, extraArgs.concat(event, node));
  } else {
    targetFunc.call(targetComponent, event, node);
  }
}
function addDelegatedEventHandler$1(eventType) {
  if (!delegatedEvents[eventType]) {
    delegatedEvents[eventType] = true;
  }
}
function addDelegatedEventHandlerToHost(eventType, host) {
  var listeners = host[listenersAttachedKey] = host[listenersAttachedKey] || {};
  if (!listeners[eventType]) {
    (host.body || host).addEventListener(
      eventType,
      listeners[eventType] = function(event) {
        var curNode = event.target;
        if (!curNode) {
          return;
        }
        curNode = curNode.correspondingUseElement || (curNode.nodeType === TEXT_NODE ? curNode.parentNode : curNode);
        var propName = "on" + eventType;
        var target;
        if (event.bubbles) {
          var propagationStopped = false;
          var oldStopPropagation = event.stopPropagation;
          event.stopPropagation = function() {
            oldStopPropagation.call(event);
            propagationStopped = true;
          };
          do {
            if (target = getEventFromEl(curNode, propName)) {
              delegateEvent(curNode, propName, target, event);
              if (propagationStopped) {
                break;
              }
            }
          } while ((curNode = curNode.parentNode) && curNode.getAttribute);
        } else if (target = getEventFromEl(curNode, propName)) {
          delegateEvent(curNode, propName, target, event);
        }
      },
      true
    );
  }
}
function noop3() {
}
eventDelegation.___handleNodeAttach = noop3;
eventDelegation.___handleNodeDetach = noop3;
eventDelegation.___delegateEvent = delegateEvent;
eventDelegation.___getEventFromEl = getEventFromEl;
eventDelegation.___addDelegatedEventHandler = addDelegatedEventHandler$1;
eventDelegation.___init = function(host) {
  Object.keys(delegatedEvents).forEach(function(eventType) {
    addDelegatedEventHandlerToHost(eventType, host);
  });
};
function KeySequence$1() {
  this.___lookup = /* @__PURE__ */ Object.create(null);
}
KeySequence$1.prototype.___nextKey = function(key) {
  var lookup = this.___lookup;
  if (lookup[key]) {
    return key + "_" + lookup[key]++;
  }
  lookup[key] = 1;
  return key;
};
var KeySequence_1 = KeySequence$1;
var complain$2 = complainExports;
var w10Noop = constants$3.NOOP;
var componentUtil = componentsUtil$3;
var attachBubblingEvent = componentUtil.___attachBubblingEvent;
var addDelegatedEventHandler = eventDelegation.___addDelegatedEventHandler;
var extend2 = extend$3;
var KeySequence = KeySequence_1;
var EMPTY_OBJECT = {};
var FLAG_WILL_RERENDER_IN_BROWSER$2 = 1;
var FLAG_HAS_RENDER_BODY = 2;
var FLAG_IS_LEGACY = 4;
var FLAG_OLD_HYDRATE_NO_CREATE$1 = 8;
function ComponentDef$2(component, componentId, componentsContext) {
  this.___componentsContext = componentsContext;
  this.___component = component;
  this.id = componentId;
  this.___domEvents = void 0;
  this.___isExisting = false;
  this.___renderBoundary = false;
  this.___flags = 0;
  this.___nextIdIndex = 0;
  this.___keySequence = null;
}
ComponentDef$2.prototype = {
  ___nextKey: function(key) {
    return (this.___keySequence || (this.___keySequence = new KeySequence())).___nextKey(key);
  },
  elId: function(nestedId) {
    var id = this.id;
    if (nestedId == null) {
      return id;
    } else {
      if (typeof nestedId !== "string") {
        {
          complain$2("Using non strings as keys is deprecated.");
        }
        nestedId = String(nestedId);
      }
      if (nestedId.indexOf("#") === 0) {
        id = "#" + id;
        nestedId = nestedId.substring(1);
      }
      return id + "-" + nestedId;
    }
  },
  ___nextComponentId: function() {
    return this.id + "-c" + this.___nextIdIndex++;
  },
  d: function(eventName, handlerMethodName, isOnce, extraArgs) {
    addDelegatedEventHandler(eventName);
    return attachBubblingEvent(this, handlerMethodName, isOnce, extraArgs);
  },
  get ___type() {
    return this.___component.___type;
  }
};
ComponentDef$2.prototype.nk = ComponentDef$2.prototype.___nextKey;
ComponentDef$2.___deserialize = function(o, types, global2, registry2) {
  var id = o[0];
  var typeName = types[o[1]];
  var input = o[2] || null;
  var extra = o[3] || EMPTY_OBJECT;
  var state = extra.s;
  var componentProps = extra.w || EMPTY_OBJECT;
  var flags = extra.f;
  var isLegacy = flags & FLAG_IS_LEGACY;
  var renderBody = flags & FLAG_HAS_RENDER_BODY ? w10Noop : extra.r;
  var component = typeName && registry2.___createComponent(typeName, id, isLegacy);
  component.___updateQueued = true;
  if (isLegacy) {
    component.widgetConfig = componentProps;
    component.___widgetBody = renderBody;
  } else if (renderBody) {
    (input || (input = {})).renderBody = renderBody;
  }
  if (!isLegacy && flags & FLAG_WILL_RERENDER_IN_BROWSER$2 && !(flags & FLAG_OLD_HYDRATE_NO_CREATE$1)) {
    if (component.onCreate) {
      component.onCreate(input, { global: global2 });
    }
    if (component.onInput) {
      input = component.onInput(input, { global: global2 }) || input;
    }
  } else {
    if (state) {
      var undefinedPropNames = extra.u;
      if (undefinedPropNames) {
        undefinedPropNames.forEach(function(undefinedPropName) {
          state[undefinedPropName] = void 0;
        });
      }
      component.state = state;
    }
    if (!isLegacy && componentProps) {
      extend2(component, componentProps);
    }
  }
  component.___input = input;
  if (extra.b) {
    component.___bubblingDomEvents = extra.b;
  }
  var scope = extra.p;
  var customEvents = extra.e;
  if (customEvents) {
    component.___setCustomEvents(customEvents, scope);
  }
  component.___global = global2;
  return {
    id,
    ___component: component,
    ___domEvents: extra.d,
    ___flags: extra.f || 0
  };
};
var ComponentDef_1 = ComponentDef$2;
var complain$1 = complainExports;
var changeCase = _changeCase;
var ComponentsContext$2 = ComponentsContextExports;
var getComponentsContext$2 = ComponentsContext$2.___getComponentsContext;
var ComponentDef$1 = ComponentDef_1;
var w10NOOP = constants$3.NOOP;
var RENDER_BODY_TO_JSON = function() {
  return w10NOOP;
};
var FLAG_WILL_RERENDER_IN_BROWSER$1 = 1;
var IS_SERVER = typeof document === "undefined";
var dynamicTag = function dynamicTag2(out, tag, getAttrs, renderBody, args, props, componentDef, key, customEvents) {
  if (tag) {
    if (tag.default) {
      tag = tag.default;
    }
    var attrs3 = getAttrs && getAttrs();
    var component = componentDef && componentDef.___component;
    if (typeof tag === "string") {
      if (renderBody) {
        out.___beginElementDynamic(
          tag,
          attrs3,
          key,
          componentDef,
          addEvents(componentDef, customEvents, props)
        );
        renderBody(out);
        out.___endElement();
      } else {
        out.___elementDynamic(
          tag,
          attrs3,
          key,
          componentDef,
          addEvents(componentDef, customEvents, props)
        );
      }
    } else {
      if (attrs3 == null) {
        attrs3 = { renderBody };
      } else if (typeof attrs3 === "object") {
        attrs3 = attrsToCamelCase(attrs3);
        if (renderBody) {
          attrs3.renderBody = renderBody;
        }
      }
      var renderer2 = tag._ || (tag.renderer ? tag.renderer.renderer || tag.renderer : tag.render);
      {
        if (tag.renderer && tag.renderer.renderer) {
          complain$1(
            "An object with a 'renderer' was passed to the dynamic tag, but renderer was another template."
          );
        }
      }
      if (renderer2) {
        out.c(componentDef, key, customEvents);
        renderer2(attrs3, out);
        out.___assignedComponentDef = null;
      } else {
        var render3 = tag && tag.renderBody || tag;
        var isFn = typeof render3 === "function";
        {
          if (render3.safeHTML || render3.toHTML) {
            throw new Error(
              "Using `<include(x)/>` or the `<${dynamic}/>` tags with a `{ safeHTML: ... }` object is no longer supported. Use the unescaped text placeholder syntax instead."
            );
          }
        }
        if (isFn) {
          var flags = componentDef ? componentDef.___flags : 0;
          var willRerender = flags & FLAG_WILL_RERENDER_IN_BROWSER$1;
          var isW10NOOP = render3 === w10NOOP;
          var preserve = IS_SERVER ? willRerender : isW10NOOP;
          out.bf(key, component, preserve);
          if (!isW10NOOP && isFn) {
            var componentsContext = getComponentsContext$2(out);
            var parentComponentDef = componentsContext.___componentDef;
            var globalContext = componentsContext.___globalContext;
            componentsContext.___componentDef = new ComponentDef$1(
              component,
              parentComponentDef.id + "-" + parentComponentDef.___nextKey(key),
              globalContext
            );
            render3.toJSON = RENDER_BODY_TO_JSON;
            if (args) {
              render3.apply(null, [out].concat(args, attrs3));
            } else {
              render3(out, attrs3);
            }
            componentsContext.___componentDef = parentComponentDef;
          }
          out.ef();
        } else {
          out.error("Invalid dynamic tag value");
        }
      }
    }
  } else if (renderBody) {
    out.bf(
      key,
      component,
      IS_SERVER && componentDef && componentDef.___flags & FLAG_WILL_RERENDER_IN_BROWSER$1
    );
    renderBody(out);
    out.ef();
  }
};
function attrsToCamelCase(attrs3) {
  var result = {};
  for (var key in attrs3) {
    result[changeCase.___dashToCamelCase(key)] = attrs3[key];
  }
  return result;
}
function addEvents(componentDef, customEvents, props) {
  var len = customEvents ? customEvents.length : 0;
  if (len === 0) {
    return props;
  }
  var result = props || {};
  var event;
  for (var i = len; i--; ) {
    event = customEvents[i];
    result["on" + event[0]] = componentDef.d(
      event[0],
      event[1],
      event[2],
      event[3]
    );
  }
  return result;
}
var _marko_dynamic_tag = /* @__PURE__ */ getDefaultExportFromCjs(dynamicTag);
var componentsEntry = {};
var src = {};
var constants$2 = constants$4;
var markerKey$1 = Symbol("warp10");
var safePropName = /^[$A-Z_][0-9A-Z_$]*$/i;
var isArray$2 = Array.isArray;
var safeJSONRegExp = /<\/|\u2028|\u2029/g;
function safeJSONReplacer(match2) {
  if (match2 === "</") {
    return "\\u003C/";
  } else {
    return "\\u" + match2.charCodeAt(0).toString(16);
  }
}
function safeJSON(json) {
  return json.replace(safeJSONRegExp, safeJSONReplacer);
}
var Marker$1 = class Marker {
  constructor(path, symbol) {
    this.path = path;
    this.symbol = symbol;
  }
};
function handleProperty$1(clone, key, value, valuePath, serializationSymbol, assignments) {
  if (value === constants$2.NOOP) {
    if (assignments.$W10NOOP) {
      assignments.push(valuePath + "=$w.$W10NOOP");
    } else {
      assignments.$W10NOOP = true;
      assignments.push('var $w=typeof window=="undefined"?global:window');
      assignments.push(valuePath + "=$w.$W10NOOP=$w.$W10NOOP||function(){}");
    }
  } else if (value.constructor === Date) {
    assignments.push(valuePath + "=new Date(" + value.getTime() + ")");
  } else if (value.constructor === URL) {
    assignments.push(valuePath + '=new URL("' + value.href + '")');
  } else if (value.constructor === URLSearchParams) {
    assignments.push(valuePath + '=new URLSearchParams("' + value + '")');
  } else if (isArray$2(value)) {
    const marker = value[markerKey$1];
    if (marker && marker.symbol === serializationSymbol) {
      assignments.push(valuePath + "=" + marker.path);
    } else {
      value[markerKey$1] = new Marker$1(valuePath, serializationSymbol);
      clone[key] = pruneArray$1(value, valuePath, serializationSymbol, assignments);
    }
  } else {
    const marker = value[markerKey$1];
    if (marker && marker.symbol === serializationSymbol) {
      assignments.push(valuePath + "=" + marker.path);
    } else {
      value[markerKey$1] = new Marker$1(valuePath, serializationSymbol);
      clone[key] = pruneObject$1(value, valuePath, serializationSymbol, assignments);
    }
  }
}
function pruneArray$1(array, path, serializationSymbol, assignments) {
  let len = array.length;
  var clone = new Array(len);
  for (let i = 0; i < len; i++) {
    var value = array[i];
    if (value == null) {
      continue;
    }
    var type = typeof value;
    if (type === "function" && value.toJSON) {
      value = value.toJSON();
      type = typeof value;
    }
    if (value && (value === constants$2.NOOP || type === "object")) {
      let valuePath = path + "[" + i + "]";
      handleProperty$1(clone, i, value, valuePath, serializationSymbol, assignments);
    } else {
      clone[i] = value;
    }
  }
  return clone;
}
function pruneObject$1(obj, path, serializationSymbol, assignments) {
  var clone = {};
  for (var key in obj) {
    var value = obj[key];
    if (value === void 0) {
      continue;
    }
    var type = typeof value;
    if (type === "function" && value.toJSON) {
      value = value.toJSON();
      type = typeof value;
    }
    if (value && (value === constants$2.NOOP || type === "object")) {
      let valuePath = path + (safePropName.test(key) ? "." + key : "[" + JSON.stringify(key) + "]");
      handleProperty$1(clone, key, value, valuePath, serializationSymbol, assignments);
    } else {
      clone[key] = value;
    }
  }
  return clone;
}
function serializeHelper(obj, safe, varName, additive) {
  var pruned;
  const assignments = [];
  if (typeof obj === "object") {
    const serializationSymbol = Symbol();
    const path = "$";
    obj[markerKey$1] = new Marker$1(path, serializationSymbol);
    if (obj.constructor === Date) {
      return "(new Date(" + obj.getTime() + "))";
    } else if (obj.constructor === URL) {
      return '(new URL("' + obj.href + '"))';
    } else if (obj.constructor === URLSearchParams) {
      return '(new URLSearchParams("' + obj + '"))';
    } else if (isArray$2(obj)) {
      pruned = pruneArray$1(obj, path, serializationSymbol, assignments);
    } else {
      pruned = pruneObject$1(obj, path, serializationSymbol, assignments);
    }
  } else {
    pruned = obj;
  }
  let json = JSON.stringify(pruned);
  if (safe) {
    json = safeJSON(json);
  }
  if (varName) {
    if (additive) {
      let innerCode = "var $=" + json + "\n";
      if (assignments.length) {
        innerCode += assignments.join("\n") + "\n";
      }
      let code = "(function() {var t=window." + varName + "||(window." + varName + "={})\n" + innerCode;
      for (let key in obj) {
        var prop;
        if (safePropName.test(key)) {
          prop = "." + key;
        } else {
          prop = "[" + JSON.stringify(key) + "]";
        }
        code += "t" + prop + "=$" + prop + "\n";
      }
      return code + "}())";
    } else {
      if (assignments.length) {
        return "(function() {var $=" + json + "\n" + assignments.join("\n") + "\nwindow." + varName + "=$}())";
      } else {
        return "window." + varName + "=" + json;
      }
    }
  } else {
    if (assignments.length) {
      return "(function() {var $=" + json + "\n" + assignments.join("\n") + "\nreturn $}())";
    } else {
      return "(" + json + ")";
    }
  }
}
var serialize = function serialize2(obj, options) {
  if (obj == null) {
    return "null";
  }
  var safe;
  var varName;
  var additive;
  if (options) {
    safe = options.safe !== false;
    varName = options.var;
    additive = options.additive === true;
  } else {
    safe = true;
    additive = false;
  }
  return serializeHelper(obj, safe, varName, additive);
};
var constants$1 = constants$4;
var markerKey = Symbol("warp10");
var isArray$1 = Array.isArray;
var Marker2 = class {
  constructor(path, symbol) {
    this.path = path;
    this.symbol = symbol;
  }
};
function append(array, el) {
  var len = array.length;
  var clone = new Array(len + 1);
  for (var i = 0; i < len; i++) {
    clone[i] = array[i];
  }
  clone[len] = el;
  return clone;
}
var Assignment = class {
  constructor(lhs, rhs) {
    this.l = lhs;
    this.r = rhs;
  }
};
function handleProperty(clone, key, value, valuePath, serializationSymbol, assignments) {
  if (value === constants$1.NOOP) {
    assignments.push(new Assignment(valuePath, { type: "NOOP" }));
  } else if (value.constructor === Date) {
    assignments.push(new Assignment(valuePath, { type: "Date", value: value.getTime() }));
  } else if (value.constructor === URL) {
    assignments.push(new Assignment(valuePath, { type: "URL", value: value.href }));
  } else if (value.constructor === URLSearchParams) {
    assignments.push(new Assignment(valuePath, { type: "URLSearchParams", value: value.toString() }));
  } else if (isArray$1(value)) {
    const marker = value[markerKey];
    if (marker && marker.symbol === serializationSymbol) {
      assignments.push(new Assignment(valuePath, marker.path));
    } else {
      value[markerKey] = new Marker2(valuePath, serializationSymbol);
      clone[key] = pruneArray(value, valuePath, serializationSymbol, assignments);
    }
  } else {
    const marker = value[markerKey];
    if (marker && marker.symbol === serializationSymbol) {
      assignments.push(new Assignment(valuePath, marker.path));
    } else {
      value[markerKey] = new Marker2(valuePath, serializationSymbol);
      clone[key] = pruneObject(value, valuePath, serializationSymbol, assignments);
    }
  }
}
function pruneArray(array, path, serializationSymbol, assignments) {
  let len = array.length;
  var clone = new Array(len);
  for (let i = 0; i < len; i++) {
    var value = array[i];
    if (value == null) {
      continue;
    }
    var type = typeof value;
    if (type === "function" && value.toJSON) {
      value = value.toJSON();
      type = typeof value;
    }
    if (value && (value === constants$1.NOOP || type === "object")) {
      handleProperty(clone, i, value, append(path, i), serializationSymbol, assignments);
    } else {
      clone[i] = value;
    }
  }
  return clone;
}
function pruneObject(obj, path, serializationSymbol, assignments) {
  var clone = {};
  if (obj.toJSON && obj.constructor != Date && obj.constructor != URL) {
    obj = obj.toJSON();
  }
  if (typeof obj !== "object") {
    return obj;
  }
  var keys = Object.keys(obj);
  var len = keys.length;
  for (var i = 0; i < len; i++) {
    var key = keys[i];
    var value = obj[key];
    if (value === void 0) {
      continue;
    }
    var type = typeof value;
    if (type === "function" && value.toJSON) {
      value = value.toJSON();
      type = typeof value;
    }
    if (value && (value === constants$1.NOOP || type === "object")) {
      handleProperty(clone, key, value, append(path, key), serializationSymbol, assignments);
    } else {
      clone[key] = value;
    }
  }
  return clone;
}
var stringifyPrepare$1 = function stringifyPrepare(obj) {
  if (!obj) {
    return obj;
  }
  var pruned;
  const assignments = [];
  if (typeof obj === "object") {
    if (obj.toJSON && obj.constructor != Date && obj.constructor != URL) {
      obj = obj.toJSON();
      if (!obj.hasOwnProperty || typeof obj !== "object") {
        return obj;
      }
    }
    const serializationSymbol = Symbol();
    const path = [];
    obj[markerKey] = new Marker2(path, serializationSymbol);
    if (obj.constructor === Date) {
      pruned = null;
      assignments.push(new Assignment([], { type: "Date", value: obj.getTime() }));
    } else if (obj.constructor === URL) {
      pruned = null;
      assignments.push(new Assignment([], { type: "URL", value: obj.href }));
    } else if (obj.constructor === URLSearchParams) {
      pruned = null;
      assignments.push(new Assignment([], { type: "URLSearchParams", value: obj.toString() }));
    } else if (isArray$1(obj)) {
      pruned = pruneArray(obj, path, serializationSymbol, assignments);
    } else {
      pruned = pruneObject(obj, path, serializationSymbol, assignments);
    }
  } else {
    pruned = obj;
  }
  if (assignments.length) {
    return {
      o: pruned,
      $$: assignments
    };
  } else {
    return pruned;
  }
};
var stringifyPrepare2 = stringifyPrepare$1;
var escapeEndingScriptTagRegExp = /<\//g;
var stringify = function stringify2(obj, options) {
  var safe;
  if (options) {
    safe = options.safe === true;
  } else {
    safe = false;
  }
  var final = stringifyPrepare2(obj);
  let json = JSON.stringify(final);
  if (safe) {
    json = json.replace(escapeEndingScriptTagRegExp, "\\u003C/");
  }
  return json;
};
var constants = constants$4;
var isArray = Array.isArray;
function resolve(object, path, len) {
  var current = object;
  for (var i = 0; i < len; i++) {
    current = current[path[i]];
  }
  return current;
}
function resolveType(info) {
  if (info.type === "Date") {
    return new Date(info.value);
  } else if (info.type === "URL") {
    return new URL(info.value);
  } else if (info.type === "URLSearchParams") {
    return new URLSearchParams(info.value);
  } else if (info.type === "NOOP") {
    return constants.NOOP;
  } else {
    throw new Error("Bad type");
  }
}
var finalize$1 = function finalize(outer) {
  if (!outer) {
    return outer;
  }
  var assignments = outer.$$;
  if (assignments) {
    var object = outer.o;
    var len;
    if (assignments && (len = assignments.length)) {
      for (var i = 0; i < len; i++) {
        var assignment = assignments[i];
        var rhs = assignment.r;
        var rhsValue;
        if (isArray(rhs)) {
          rhsValue = resolve(object, rhs, rhs.length);
        } else {
          rhsValue = resolveType(rhs);
        }
        var lhs = assignment.l;
        var lhsLast = lhs.length - 1;
        if (lhsLast === -1) {
          object = outer.o = rhsValue;
          break;
        } else {
          var lhsParent = resolve(object, lhs, lhsLast);
          lhsParent[lhs[lhsLast]] = rhsValue;
        }
      }
    }
    assignments.length = 0;
    return object == null ? null : object;
  } else {
    return outer;
  }
};
var finalize2 = finalize$1;
var parse = function parse2(json) {
  if (json === void 0) {
    return void 0;
  }
  var outer = JSON.parse(json);
  return finalize2(outer);
};
src.serialize = serialize;
src.stringify = stringify;
src.parse = parse;
src.finalize = finalize$1;
src.stringifyPrepare = stringifyPrepare$1;
(function(exports) {
  var warp10 = src;
  var safeJSONRegExp2 = /<\/|\u2028|\u2029/g;
  var IGNORE_GLOBAL_TYPES = /* @__PURE__ */ new Set(["undefined", "function", "symbol"]);
  var DEFAULT_RUNTIME_ID = "M";
  var FLAG_WILL_RERENDER_IN_BROWSER2 = 1;
  var FLAG_HAS_RENDER_BODY2 = 2;
  var FLAG_IS_LEGACY2 = 4;
  var FLAG_OLD_HYDRATE_NO_CREATE2 = 8;
  function safeJSONReplacer2(match2) {
    if (match2 === "</") {
      return "\\u003C/";
    } else {
      return "\\u" + match2.charCodeAt(0).toString(16);
    }
  }
  function isNotEmpty(obj) {
    var keys = Object.keys(obj);
    for (var i = keys.length; i--; ) {
      if (obj[keys[i]] !== void 0) {
        return true;
      }
    }
    return false;
  }
  function safeStringify(data) {
    return JSON.stringify(warp10.stringifyPrepare(data)).replace(
      safeJSONRegExp2,
      safeJSONReplacer2
    );
  }
  function getSerializedGlobals($global) {
    let serializedGlobalsLookup = $global.serializedGlobals;
    if (serializedGlobalsLookup) {
      let serializedGlobals2;
      let keys = Object.keys(serializedGlobalsLookup);
      for (let i = keys.length; i--; ) {
        let key = keys[i];
        if (serializedGlobalsLookup[key]) {
          let value = $global[key];
          if (!IGNORE_GLOBAL_TYPES.has(typeof value)) {
            if (serializedGlobals2 === void 0) {
              serializedGlobals2 = {};
            }
            serializedGlobals2[key] = value;
          }
        }
      }
      return serializedGlobals2;
    }
  }
  function addComponentsFromContext2(componentsContext, componentsToHydrate) {
    var components2 = componentsContext.___components;
    var len = components2.length;
    for (var i = 0; i < len; i++) {
      var componentDef = components2[i];
      var id = componentDef.id;
      var component = componentDef.___component;
      var flags = componentDef.___flags;
      var isLegacy = componentDef.___isLegacy;
      var state = component.state;
      var input = component.input || 0;
      var typeName = component.typeName;
      var customEvents = component.___customEvents;
      var scope = component.___scope;
      var bubblingDomEvents = component.___bubblingDomEvents;
      var needsState;
      var serializedProps;
      var renderBody;
      if (isLegacy) {
        flags |= FLAG_IS_LEGACY2;
        renderBody = component.___widgetBody;
        if (component.widgetConfig && isNotEmpty(component.widgetConfig)) {
          serializedProps = component.widgetConfig;
        }
        needsState = true;
      } else {
        if (input && input.renderBody) {
          renderBody = input.renderBody;
          input.renderBody = void 0;
        }
        if (!(flags & FLAG_WILL_RERENDER_IN_BROWSER2) || flags & FLAG_OLD_HYDRATE_NO_CREATE2) {
          component.___state = void 0;
          component.___input = void 0;
          component.typeName = void 0;
          component.id = void 0;
          component.___customEvents = void 0;
          component.___scope = void 0;
          component.___bubblingDomEvents = void 0;
          component.___bubblingDomEventsExtraArgsCount = void 0;
          component.___updatedInput = void 0;
          component.___updateQueued = void 0;
          needsState = true;
          if (isNotEmpty(component)) {
            serializedProps = component;
          }
        }
      }
      var undefinedPropNames = void 0;
      if (needsState && state) {
        const stateKeys = Object.keys(state);
        for (let i2 = stateKeys.length; i2--; ) {
          const stateKey = stateKeys[i2];
          if (state[stateKey] === void 0) {
            if (undefinedPropNames) {
              undefinedPropNames.push(stateKey);
            } else {
              undefinedPropNames = [stateKey];
            }
          }
        }
      }
      if (typeof renderBody === "function") {
        flags |= FLAG_HAS_RENDER_BODY2;
        renderBody = void 0;
      }
      var extra = {
        b: bubblingDomEvents,
        d: componentDef.___domEvents,
        e: customEvents,
        f: flags || void 0,
        p: customEvents && scope,
        s: needsState && state,
        u: undefinedPropNames,
        w: serializedProps,
        r: renderBody
      };
      var parts = [id, typeName];
      var hasExtra = isNotEmpty(extra);
      if (input) {
        parts.push(input);
        if (hasExtra) {
          parts.push(extra);
        }
      } else if (hasExtra) {
        parts.push(0, extra);
      }
      componentsToHydrate.push(parts);
    }
    components2.length = 0;
    var nestedContexts = componentsContext.___nestedContexts;
    if (nestedContexts !== void 0) {
      nestedContexts.forEach(function(nestedContext) {
        addComponentsFromContext2(nestedContext, componentsToHydrate);
      });
    }
  }
  function getInitComponentsData(out, componentDefs) {
    const len = componentDefs.length;
    const $global = out.global;
    const isLast = $global.___isLastFlush;
    const didSerializeComponents = $global.___didSerializeComponents;
    const prefix = $global.componentIdPrefix || $global.widgetIdPrefix;
    if (len === 0) {
      if (isLast && didSerializeComponents) {
        return { p: prefix, l: 1 };
      }
      return;
    }
    const TYPE_INDEX = 1;
    const typesLookup = $global.___typesLookup || ($global.___typesLookup = /* @__PURE__ */ new Map());
    let newTypes;
    for (let i = 0; i < len; i++) {
      const componentDef = componentDefs[i];
      const typeName = componentDef[TYPE_INDEX];
      let typeIndex = typesLookup.get(typeName);
      if (typeIndex === void 0) {
        typeIndex = typesLookup.size;
        typesLookup.set(typeName, typeIndex);
        if (newTypes) {
          newTypes.push(typeName);
        } else {
          newTypes = [typeName];
        }
      }
      componentDef[TYPE_INDEX] = typeIndex;
    }
    let serializedGlobals2;
    if (!didSerializeComponents) {
      $global.___didSerializeComponents = true;
      serializedGlobals2 = getSerializedGlobals($global);
    }
    return {
      p: prefix,
      l: isLast && 1,
      g: serializedGlobals2,
      w: componentDefs,
      t: newTypes
    };
  }
  function getInitComponentsDataFromOut(out) {
    const componentsContext = out.___components;
    if (componentsContext === null) {
      return;
    }
    const $global = out.global;
    const runtimeId2 = $global.runtimeId;
    const componentsToHydrate = [];
    addComponentsFromContext2(componentsContext, componentsToHydrate);
    $global.___isLastFlush = true;
    const data = getInitComponentsData(out, componentsToHydrate);
    $global.___isLastFlush = void 0;
    if (runtimeId2 !== DEFAULT_RUNTIME_ID && data) {
      data.r = runtimeId2;
    }
    return data;
  }
  function writeInitComponentsCode(out) {
    out.script(exports.___getInitComponentsCode(out));
  }
  exports.___getInitComponentsCode = function getInitComponentsCode2(out, componentDefs) {
    const initComponentsData = arguments.length === 2 ? getInitComponentsData(out, componentDefs) : getInitComponentsDataFromOut(out);
    if (initComponentsData === void 0) {
      return "";
    }
    const runtimeId2 = out.global.runtimeId;
    const componentGlobalKey = runtimeId2 === DEFAULT_RUNTIME_ID ? "MC" : runtimeId2 + "_C";
    return `$${componentGlobalKey}=(window.$${componentGlobalKey}||[]).concat(${safeStringify(
      initComponentsData
    )})`;
  };
  exports.___addComponentsFromContext = addComponentsFromContext2;
  exports.writeInitComponentsCode = writeInitComponentsCode;
  exports.getRenderedComponents = function(out) {
    return warp10.stringifyPrepare(getInitComponentsDataFromOut(out));
  };
})(componentsEntry);
var components = componentsEntry;
var INIT_COMPONENTS_KEY = Symbol();
var addComponentsFromContext = components.___addComponentsFromContext;
var getInitComponentsCode = components.___getInitComponentsCode;
function addComponentsFromOut(source, target) {
  const sourceOut = source.out || source;
  const targetOut = target || sourceOut;
  const componentsContext = sourceOut.___components;
  const componentDefs = targetOut.writer.get("componentDefs");
  addComponentsFromContext(componentsContext, componentDefs);
}
function addInitScript(writer) {
  const out = writer.state.root;
  const componentDefs = writer.get("componentDefs");
  writer.script(getInitComponentsCode(out, componentDefs));
}
var initComponentsTag = function render(input, out) {
  const $global = out.global;
  if ($global[INIT_COMPONENTS_KEY] === void 0) {
    $global[INIT_COMPONENTS_KEY] = true;
    out.on("await:finish", addComponentsFromOut);
    out.on("___toString", addInitScript);
    if (out.isSync() === true) {
      addComponentsFromOut(out);
    } else {
      const asyncOut = out.beginAsync({ last: true, timeout: -1 });
      out.onLast(function(next) {
        let rootOut = out;
        while (rootOut._parentOut) {
          rootOut = rootOut._parentOut;
        }
        addComponentsFromOut(rootOut, asyncOut);
        asyncOut.end();
        next();
      });
    }
  }
};
var _initComponents = /* @__PURE__ */ getDefaultExportFromCjs(initComponentsTag);
var renderTag = function renderTagHelper(handler, input, out, componentDef, key, customEvents) {
  out.c(componentDef, key, customEvents);
  (handler._ || (handler._ = handler.render || handler.renderer || handler))(
    input,
    out
  );
  out.___assignedComponentDef = null;
};
var _marko_tag = /* @__PURE__ */ getDefaultExportFromCjs(renderTag);
var escapeDoubleQuotes = escapeQuotes.___escapeDoubleQuotes;
var reordererRenderer = function(input, out) {
  if (out.isSync()) {
    return;
  }
  var global2 = out.global;
  if (global2.__awaitReordererInvoked) {
    return;
  }
  global2.__awaitReordererInvoked = true;
  if (out.global.___clientReorderContext) {
    out.flush();
  }
  var asyncOut = out.beginAsync({
    last: true,
    timeout: -1,
    name: "await-reorderer"
  });
  out.onLast(function(next) {
    var awaitContext = global2.___clientReorderContext;
    var remaining;
    if (!awaitContext || !awaitContext.instances || !(remaining = awaitContext.instances.length)) {
      asyncOut.end();
      next();
      return;
    }
    function handleAwait(awaitInfo) {
      awaitInfo.out.on("___toString", out.emit.bind(out, "___toString")).on("finish", function(result) {
        if (!global2._afRuntime) {
          asyncOut.script(
            `function $af(d,a,e,l,g,h,k,b,f,c){c=$af;if(a&&!c[a])(c[a+="$"]||(c[a]=[])).push(d);else{e=document;l=e.getElementById("af"+d);g=e.getElementById("afph"+d);h=e.createDocumentFragment();k=l.childNodes;b=0;for(f=k.length;b<f;b++)h.appendChild(k.item(0));g&&g.parentNode.replaceChild(h,g);c[d]=1;if(a=c[d+"$"])for(b=0,f=a.length;b<f;b++)c(a[b])}}`
          );
          global2._afRuntime = true;
        }
        if (global2.cspNonce) {
          asyncOut.write(
            '<style nonce="' + escapeDoubleQuotes(global2.cspNonce) + '">#af' + awaitInfo.id + '{display:none;}</style><div id="af' + awaitInfo.id + '">' + result.toString() + "</div>"
          );
        } else {
          asyncOut.write(
            '<div id="af' + awaitInfo.id + '" style="display:none">' + result.toString() + "</div>"
          );
        }
        asyncOut.script(
          "$af(" + (typeof awaitInfo.id === "number" ? awaitInfo.id : '"' + awaitInfo.id + '"') + (awaitInfo.after ? ',"' + awaitInfo.after + '"' : "") + ")"
        );
        awaitInfo.out.writer = asyncOut.writer;
        out.emit("await:finish", awaitInfo);
        out.flush();
        if (--remaining === 0) {
          asyncOut.end();
          next();
        }
      }).on("error", function(err) {
        asyncOut.error(err);
      });
    }
    awaitContext.instances.forEach(handleAwait);
    out.on("await:clientReorder", function(awaitInfo) {
      remaining++;
      handleAwait(awaitInfo);
    });
    delete awaitContext.instances;
  });
};
var _awaitReorderer = /* @__PURE__ */ getDefaultExportFromCjs(reordererRenderer);
function forceScriptTagAtThisPoint(out) {
  const writer = out.writer;
  out.global.___isLastFlush = true;
  const htmlSoFar = writer.toString();
  out.global.___isLastFlush = void 0;
  writer.clear();
  writer.write(htmlSoFar);
}
var preferredScriptLocationTag = function render2(input, out) {
  if (out.isSync() === true) {
    forceScriptTagAtThisPoint(out);
  } else {
    const asyncOut = out.beginAsync({ last: true, timeout: -1 });
    out.onLast(function(next) {
      forceScriptTagAtThisPoint(asyncOut);
      asyncOut.end();
      next();
    });
  }
};
var _preferredScriptLocation = /* @__PURE__ */ getDefaultExportFromCjs(preferredScriptLocationTag);
var componentsRegistry = {};
var copyProps$2 = function copyProps(from, to) {
  Object.getOwnPropertyNames(from).forEach(function(name) {
    var descriptor = Object.getOwnPropertyDescriptor(from, name);
    Object.defineProperty(to, name, descriptor);
  });
};
var complain = complainExports;
var ServerComponent = class {
  constructor(id, input, out, typeName, customEvents, scope) {
    this.id = id;
    this.___customEvents = customEvents;
    this.___scope = scope;
    this.typeName = typeName;
    this.___bubblingDomEvents = void 0;
    this.___bubblingDomEventsExtraArgsCount = 0;
    this.onCreate(input, out);
    this.___updatedInput = this.onInput(input, out) || input;
    if (this.___input === void 0) {
      this.___input = this.___updatedInput;
    }
    this.onRender(out);
  }
  set input(newInput) {
    this.___input = newInput;
  }
  get input() {
    return this.___input;
  }
  set state(newState) {
    this.___state = newState;
  }
  get state() {
    return this.___state;
  }
  get ___rawState() {
    return this.___state;
  }
  elId(nestedId) {
    var id = this.id;
    if (nestedId == null) {
      return id;
    } else {
      if (typeof nestedId !== "string") {
        {
          complain("Using non strings as keys is deprecated.");
        }
        nestedId = String(nestedId);
      }
      if (nestedId.indexOf("#") === 0) {
        id = "#" + id;
        nestedId = nestedId.substring(1);
      }
      return id + "-" + nestedId;
    }
  }
  onCreate() {
  }
  onInput() {
  }
  onRender() {
  }
};
ServerComponent.prototype.getElId = ServerComponent.prototype.elId;
var ServerComponent_1 = ServerComponent;
var copyProps$1 = copyProps$2;
var constructorCache = /* @__PURE__ */ new Map();
var BaseServerComponent = ServerComponent_1;
function createServerComponentClass(renderingLogic) {
  var renderingLogicProps = typeof renderingLogic === "function" ? renderingLogic.prototype : renderingLogic;
  class ServerComponent2 extends BaseServerComponent {
  }
  copyProps$1(renderingLogicProps, ServerComponent2.prototype);
  return ServerComponent2;
}
function createComponent(renderingLogic, id, input, out, typeName, customEvents, scope) {
  let ServerComponent2;
  if (renderingLogic) {
    ServerComponent2 = constructorCache.get(renderingLogic);
    if (!ServerComponent2) {
      ServerComponent2 = createServerComponentClass(renderingLogic);
      constructorCache.set(renderingLogic, ServerComponent2);
    }
  } else {
    ServerComponent2 = BaseServerComponent;
  }
  return new ServerComponent2(id, input, out, typeName, customEvents, scope);
}
componentsRegistry.___isServer = true;
componentsRegistry.___createComponent = createComponent;
var ComponentDef = ComponentDef_1;
var FLAG_WILL_RERENDER_IN_BROWSER = 1;
var FLAG_OLD_HYDRATE_NO_CREATE = 8;
var componentsBeginComponent = function beginComponent(componentsContext, component, key, ownerComponentDef, isSplitComponent, isImplicitComponent, existingComponentDef) {
  var componentId = component.id;
  var componentDef = existingComponentDef || (componentsContext.___componentDef = new ComponentDef(
    component,
    componentId,
    componentsContext
  ));
  var ownerIsRenderBoundary = ownerComponentDef && ownerComponentDef.___renderBoundary;
  var ownerWillRerender = ownerComponentDef && ownerComponentDef.___flags & FLAG_WILL_RERENDER_IN_BROWSER;
  if (!componentsContext.___isPreserved && ownerWillRerender) {
    componentDef.___flags |= FLAG_WILL_RERENDER_IN_BROWSER;
    componentDef._wrr = true;
    return componentDef;
  }
  if (isImplicitComponent === true) {
    return componentDef;
  }
  componentsContext.___components.push(componentDef);
  let out = componentsContext.___out;
  let runtimeId2 = out.global.runtimeId;
  componentDef.___renderBoundary = true;
  componentDef.___parentPreserved = componentsContext.___isPreserved;
  if (isSplitComponent === false && out.global.noBrowserRerender !== true) {
    componentDef.___flags |= FLAG_WILL_RERENDER_IN_BROWSER;
    componentDef._wrr = true;
    componentsContext.___isPreserved = false;
  }
  if (out.global.oldHydrateNoCreate === true) {
    componentDef.___flags |= FLAG_OLD_HYDRATE_NO_CREATE;
  }
  if ((ownerIsRenderBoundary || ownerWillRerender) && key != null) {
    out.w(
      "<!--" + runtimeId2 + "^" + componentId + " " + ownerComponentDef.id + " " + key + "-->"
    );
  } else {
    out.w("<!--" + runtimeId2 + "#" + componentId + "-->");
  }
  return componentDef;
};
var ComponentsContext$1 = ComponentsContextExports;
var getComponentsContext$1 = ComponentsContext$1.___getComponentsContext;
var componentsEndComponent = function endComponent(out, componentDef) {
  if (componentDef.___renderBoundary) {
    out.w("<!--" + out.global.runtimeId + "/-->");
    getComponentsContext$1(out).___isPreserved = componentDef.___parentPreserved;
  }
};
var componentsUtil = componentsUtil$3;
var componentLookup = componentsUtil.___componentLookup;
var ComponentsContext = ComponentsContextExports;
var getComponentsContext = ComponentsContext.___getComponentsContext;
var registry = componentsRegistry;
var copyProps2 = copyProps$2;
var isServer = componentsUtil.___isServer === true;
var beginComponent2 = componentsBeginComponent;
var endComponent2 = componentsEndComponent;
var COMPONENT_BEGIN_ASYNC_ADDED_KEY = "$wa";
function resolveComponentKey(key, parentComponentDef) {
  if (key[0] === "#") {
    return key.substring(1);
  } else {
    return parentComponentDef.id + "-" + parentComponentDef.___nextKey(key);
  }
}
function trackAsyncComponents(out) {
  if (out.isSync() || out.global[COMPONENT_BEGIN_ASYNC_ADDED_KEY]) {
    return;
  }
  out.on("beginAsync", handleBeginAsync);
  out.on("beginDetachedAsync", handleBeginDetachedAsync);
  out.global[COMPONENT_BEGIN_ASYNC_ADDED_KEY] = true;
}
function handleBeginAsync(event) {
  var parentOut = event.parentOut;
  var asyncOut = event.out;
  var componentsContext = parentOut.___components;
  if (componentsContext !== void 0) {
    asyncOut.___components = new ComponentsContext(asyncOut, componentsContext);
  }
  asyncOut.c(
    parentOut.___assignedComponentDef,
    parentOut.___assignedKey,
    parentOut.___assignedCustomEvents
  );
}
function handleBeginDetachedAsync(event) {
  var asyncOut = event.out;
  handleBeginAsync(event);
  asyncOut.on("beginAsync", handleBeginAsync);
  asyncOut.on("beginDetachedAsync", handleBeginDetachedAsync);
}
function createRendererFunc(templateRenderFunc, componentProps, renderingLogic) {
  var onInput = renderingLogic && renderingLogic.onInput;
  var typeName = componentProps.t;
  var isSplit = componentProps.s === true;
  var isImplicitComponent = componentProps.i === true;
  var shouldApplySplitMixins = renderingLogic && isSplit;
  {
    if (!componentProps.d) {
      throw new Error(
        "Component was compiled in a different NODE_ENV than the Marko runtime is using."
      );
    }
  }
  return function renderer2(input, out) {
    trackAsyncComponents(out);
    var componentsContext = getComponentsContext(out);
    var globalComponentsContext = componentsContext.___globalContext;
    var component = globalComponentsContext.___rerenderComponent;
    var isRerender = component !== void 0;
    var id;
    var isExisting;
    var customEvents;
    var parentComponentDef = componentsContext.___componentDef;
    var ownerComponentDef = out.___assignedComponentDef;
    var ownerComponentId = ownerComponentDef && ownerComponentDef.id;
    var key = out.___assignedKey;
    if (component) {
      id = component.id;
      isExisting = true;
      globalComponentsContext.___rerenderComponent = null;
    } else {
      if (parentComponentDef) {
        customEvents = out.___assignedCustomEvents;
        if (key != null) {
          id = resolveComponentKey(key.toString(), parentComponentDef);
        } else {
          id = parentComponentDef.___nextComponentId();
        }
      } else {
        id = globalComponentsContext.___nextComponentId();
      }
    }
    if (isServer) {
      component = registry.___createComponent(
        renderingLogic,
        id,
        input,
        out,
        typeName,
        customEvents,
        ownerComponentId
      );
      input = component.___updatedInput;
    } else {
      if (!component) {
        if (isRerender && (component = componentLookup[id]) && component.___type !== typeName) {
          component.destroy();
          component = void 0;
        }
        if (component) {
          isExisting = true;
        } else {
          isExisting = false;
          component = registry.___createComponent(typeName, id);
          if (shouldApplySplitMixins === true) {
            shouldApplySplitMixins = false;
            var renderingLogicProps = typeof renderingLogic == "function" ? renderingLogic.prototype : renderingLogic;
            copyProps2(renderingLogicProps, component.constructor.prototype);
          }
        }
        component.___updateQueued = true;
        if (customEvents !== void 0) {
          component.___setCustomEvents(customEvents, ownerComponentId);
        }
        if (isExisting === false) {
          component.___emitCreate(input, out);
        }
        input = component.___setInput(input, onInput, out);
        if (isExisting === true) {
          if (component.___isDirty === false || component.shouldUpdate(input, component.___state) === false) {
            out.___preserveComponent(component);
            globalComponentsContext.___renderedComponentsById[id] = true;
            component.___reset();
            return;
          }
        }
      }
      component.___global = out.global;
      component.___emitRender(out);
    }
    var componentDef = beginComponent2(
      componentsContext,
      component,
      key,
      ownerComponentDef,
      isSplit,
      isImplicitComponent
    );
    componentDef.___isExisting = isExisting;
    templateRenderFunc(
      input,
      out,
      componentDef,
      component,
      component.___rawState,
      out.global
    );
    endComponent2(out, componentDef);
    componentsContext.___componentDef = parentComponentDef;
  };
}
var renderer = createRendererFunc;
createRendererFunc.___resolveComponentKey = resolveComponentKey;
createRendererFunc.___trackAsyncComponents = trackAsyncComponents;
var _marko_renderer = /* @__PURE__ */ getDefaultExportFromCjs(renderer);
var _marko_componentType$b = "src/routes/+layout.marko";
var _marko_template$b = t(_marko_componentType$b);
var _marko_component$b = {};
_marko_template$b._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.w("<!doctype html>");
  out.w("<html lang=en>");
  out.w("<head>");
  out.w(_marko_to_string(out.global.___viteRenderAssets("head-prepend")));
  out.w("<meta charset=UTF-8>");
  out.w(`<link rel=icon type=image/png sizes=32x32${_marko_attr("href", _asset)}>`);
  out.w('<meta name=viewport content="width=device-width, initial-scale=1.0">');
  out.w('<meta name=description content="A basic Marko app.">');
  out.w("<title>");
  out.w(x($global.meta.pageTitle || "Marko"));
  out.w("</title>");
  out.w("<link href=https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css rel=stylesheet integrity=sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9 crossorigin=anonymous>");
  out.w(_marko_to_string(out.global.___viteRenderAssets("head")));
  out.w("</head>");
  out.w("<body>");
  out.w(_marko_to_string(out.global.___viteRenderAssets("body-prepend")));
  _marko_dynamic_tag(out, input.renderBody, null, null, null, null, _componentDef, "9");
  out.w("<script src=https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js integrity=sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm crossorigin=anonymous><\/script>");
  out.w(_marko_to_string(out.global.___viteRenderAssets("body")));
  _marko_tag(_initComponents, {}, out, _componentDef, "11");
  _marko_tag(_awaitReorderer, {}, out, _componentDef, "12");
  _marko_tag(_preferredScriptLocation, {}, out, _componentDef, "13");
  out.w("</body>");
  out.w("</html>");
}, {
  t: _marko_componentType$b,
  i: true,
  d: true
}, _marko_component$b);
var _marko_componentType$a = "src/components/profile.marko";
var _marko_template$a = t(_marko_componentType$a);
var _marko_component$a = {};
_marko_template$a._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.w("<div class=row>");
  out.w('<img src=https://palavramoderna.com.br/wp-content/uploads/2021/08/WhatsApp-Image-2021-08-01-at-02.36.29.jpeg class="img-fluid mb-3" alt=...>');
  out.w("</div>");
  out.w('<button type=button class="btn btn-primary">');
  out.w("Primary");
  out.w("</button>");
}, {
  t: _marko_componentType$a,
  i: true,
  d: true
}, _marko_component$a);
var _marko_componentType$9 = "src/components/form.marko";
var _marko_template$9 = t(_marko_componentType$9);
var _marko_component$9 = {};
_marko_template$9._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.w("<div class=mb-3>");
  out.w("<label for=formFile class=form-label>");
  out.w("Default file input example");
  out.w("</label>");
  out.w("<input class=form-control type=file id=formFile>");
  out.w("</div>");
  out.w("<div class=mb-3>");
  out.w("<label for=formFileMultiple class=form-label>");
  out.w("Multiple files input example");
  out.w("</label>");
  out.w("<input class=form-control type=file id=formFileMultiple multiple>");
  out.w("</div>");
  out.w("<div class=mb-3>");
  out.w("<label for=formFileDisabled class=form-label>");
  out.w("Disabled file input example");
  out.w("</label>");
  out.w("<input class=form-control type=file id=formFileDisabled disabled>");
  out.w("</div>");
  out.w("<div class=mb-3>");
  out.w("<label for=formFileSm class=form-label>");
  out.w("Small file input example");
  out.w("</label>");
  out.w('<input class="form-control form-control-sm" id=formFileSm type=file>');
  out.w("</div>");
  out.w("<div>");
  out.w("<label for=formFileLg class=form-label>");
  out.w("Large file input example");
  out.w("</label>");
  out.w('<input class="form-control form-control-lg" id=formFileLg type=file>');
  out.w("</div>");
}, {
  t: _marko_componentType$9,
  i: true,
  d: true
}, _marko_component$9);
var _marko_componentType$8 = "src/components/navbar.marko";
var _marko_template$8 = t(_marko_componentType$8);
var _marko_component$8 = {
  async onCreate() {
    this.state = {
      name: "Gregory"
    };
    async function getPokemon() {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/ditto`);
      const result = await response.json();
      return result.name;
    }
    this.state.name = await getPokemon();
  }
};
_marko_template$8._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.w('<nav class="navbar navbar-expand-lg bg-body-tertiary custom">');
  out.w("<div class=container-fluid>");
  out.w("<a class=navbar-brand href=#>");
  out.w("Site do ");
  out.w(x(state.name));
  out.w("</a>");
  out.w('<button class=navbar-toggler type=button data-bs-toggle=collapse data-bs-target=#navbarNav aria-controls=navbarNav aria-expanded=false aria-label="Toggle navigation">');
  out.w("<span class=navbar-toggler-icon></span>");
  out.w("</button>");
  out.w('<div class="collapse navbar-collapse" id=navbarNav>');
  out.w("<ul class=navbar-nav>");
  out.w("<li class=nav-item>");
  out.w('<a class="nav-link active" aria-current=page href=/ >');
  out.w("Home");
  out.w("</a>");
  out.w("</li>");
  out.w("<li class=nav-item>");
  out.w("<a class=nav-link href=/features>");
  out.w("Features");
  out.w("</a>");
  out.w("</li>");
  out.w("<li class=nav-item>");
  out.w("<a class=nav-link href=/pricing>");
  out.w("Pricing");
  out.w("</a>");
  out.w("</li>");
  out.w("</ul>");
  out.w("</div>");
  out.w("</div>");
  out.w("</nav>");
}, {
  t: _marko_componentType$8,
  d: true
}, _marko_component$8);
var _marko_componentType$7 = "src/components/layout.marko";
var _marko_template$7 = t(_marko_componentType$7);
var _marko_component$7 = {};
_marko_template$7._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.w("<main>");
  _marko_tag(_marko_template$8, {}, out, _componentDef, "1");
  _marko_dynamic_tag(out, input.renderBody, null, null, null, null, _componentDef, "2");
  out.w("</main>");
}, {
  t: _marko_componentType$7,
  i: true,
  d: true
}, _marko_component$7);
var _marko_componentType$6 = "src/routes/_index/+page.marko";
var _marko_template$6 = t(_marko_componentType$6);
var _marko_component$6 = {};
_marko_template$6._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_tag(_marko_template$7, {
    "renderBody": (out2) => {
      out2.w('<div class="d-flex justify-content-center mt-5">');
      out2.w("<div class=row>");
      out2.w("<div class=col-2>");
      _marko_tag(_marko_template$a, {}, out2, _componentDef, "4");
      out2.w("</div>");
      out2.w("<div class=col>");
      _marko_tag(_marko_template$9, {}, out2, _componentDef, "6");
      out2.w("</div>");
      out2.w("</div>");
      out2.w("</div>");
    }
  }, out, _componentDef, "0");
}, {
  t: _marko_componentType$6,
  i: true,
  d: true
}, _marko_component$6);
var _marko_componentType$5 = "__marko-run__route__index.marko";
var _marko_template$5 = t(_marko_componentType$5);
var _marko_component$5 = {};
_marko_template$5._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_dynamic_tag(out, _marko_template$b, () => ({
    ...input
  }), (out2) => {
    _marko_dynamic_tag(out2, _marko_template$6, () => input, null, null, null, _componentDef, "1");
  }, null, null, _componentDef, "0");
}, {
  t: _marko_componentType$5,
  i: true,
  d: true
}, _marko_component$5);
var BufferedWriter = BufferedWriter_1;
var __flush_here_and_after__ = function __flushHereAndAfter__(input, out) {
  if (out.isSync()) {
    out._sync = false;
    const asyncOut = out.beginAsync({ last: true });
    out._sync = true;
    asyncOut.sync();
    out.onLast(() => {
      input.renderBody(asyncOut);
      asyncOut.end();
    });
  } else {
    let flushed = false;
    const asyncOut = out.beginAsync({ last: true });
    const nextWriter = out.writer;
    out.on("___toString", (writer) => {
      if (writer instanceof BufferedWriter) {
        if (flushed) {
          const detachedOut = out.createOut();
          detachedOut.sync();
          input.renderBody(detachedOut);
          writer._content = detachedOut.toString() + writer._content;
        } else if (writer.next === nextWriter) {
          asyncOut.sync();
          input.renderBody(asyncOut);
          asyncOut.end();
          flushed = true;
        }
      }
    });
    out.onLast(() => {
      if (!flushed) {
        asyncOut.sync();
        input.renderBody(asyncOut);
        asyncOut.end();
        flushed = true;
      }
    });
  }
};
var _flush_here_and_after__ = /* @__PURE__ */ getDefaultExportFromCjs(__flush_here_and_after__);
var _marko_componentType$4 = "node_modules/@marko/vite/dist/components/vite.marko";
var _marko_template$4 = t(_marko_componentType$4);
function renderAssets(slot) {
  const entries = this.___viteEntries;
  let html = "";
  if (entries) {
    const slotWrittenEntriesKey = `___viteWrittenEntries-${slot}`;
    const lastWrittenEntry = this[slotWrittenEntriesKey] || 0;
    const writtenEntries = this[slotWrittenEntriesKey] = entries.length;
    for (let i = lastWrittenEntry; i < writtenEntries; i++) {
      let entry = entries[i];
      if (typeof __MARKO_MANIFEST__ === "object") {
        entry = __MARKO_MANIFEST__[entry] || {};
      } else if (slot === "head") {
        const {
          entries: entries2
        } = entry;
        if (entries2) {
          let sep = "";
          html += `<script${this.___viteInjectAttrs}>((root=document.documentElement)=>{`;
          html += "root.style.visibility='hidden';";
          html += "document.currentScript.remove();";
          html += "Promise.allSettled([";
          for (const id of entries2) {
            html += `${sep}import(${JSON.stringify(this.___viteBasePath + id)})`;
            sep = ",";
          }
          html += "]).then(()=>{";
          html += "root.style.visibility='';";
          html += "if(root.getAttribute('style')==='')root.removeAttribute('style')";
          html += "})})()<\/script>";
        }
      }
      const parts = entry[slot];
      if (parts) {
        for (const part of parts) {
          html += part === 0 ? this.___viteInjectAttrs : part === 1 ? this.___viteBasePath : part;
        }
      }
    }
  }
  return html;
}
var _marko_component$4 = {};
_marko_template$4._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  if (!out.global.___viteRenderAssets) {
    out.global.___viteInjectAttrs = out.global.cspNonce ? ` nonce="${out.global.cspNonce.replace(/"/g, "&#39;")}"` : "";
    out.global.___viteRenderAssets = renderAssets;
    out.global.___viteBasePath = input.base || "/";
  }
  _marko_tag(_flush_here_and_after__, {
    "renderBody": (out2) => {
      if (input.base && !out2.global.___flushedMBP) {
        out2.global.___flushedMBP = true;
        out2.w(_marko_to_string(`<script${out2.global.___viteInjectAttrs}>${out2.global.___viteBaseVar}=${JSON.stringify(input.base)}<\/script>`));
      }
      out2.w(_marko_to_string(out2.global.___viteRenderAssets(input.slot)));
    }
  }, out, _componentDef, "0");
}, {
  t: _marko_componentType$4,
  i: true,
  d: true
}, _marko_component$4);
var _marko_componentType$3 = "__marko-run__route__index.entry.marko";
var _marko_template$3 = t(_marko_componentType$3);
var _marko_component$3 = {};
_marko_template$3._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.global.___viteBaseVar = "$mbp";
  (out.global.___viteEntries || (out.global.___viteEntries = [])).push("__marko-run__route__index_fMAW");
  _marko_tag(_marko_template$4, {
    "slot": "head-prepend"
  }, out, _componentDef, "0");
  _marko_tag(_marko_template$4, {
    "slot": "head"
  }, out, _componentDef, "1");
  _marko_tag(_marko_template$4, {
    "slot": "body-prepend"
  }, out, _componentDef, "2");
  _marko_tag(_marko_template$5, input, out, _componentDef, "3");
  _marko_tag(_initComponents, {}, out, _componentDef, "4");
  _marko_tag(_awaitReorderer, {}, out, _componentDef, "5");
  _marko_tag(_marko_template$4, {
    "slot": "body"
  }, out, _componentDef, "6");
}, {
  t: _marko_componentType$3,
  i: true,
  d: true
}, _marko_component$3);
async function get1(context, buildInput) {
  return pageResponse(_marko_template$3, buildInput());
}
var _marko_componentType$2 = "src/routes/features/+page.marko";
var _marko_template$2 = t(_marko_componentType$2);
var _marko_component$2 = {};
_marko_template$2._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_tag(_marko_template$7, {
    "renderBody": (out2) => {
      out2.w("<p>");
      out2.w("hello features");
      out2.w("</p>");
    }
  }, out, _componentDef, "0");
}, {
  t: _marko_componentType$2,
  i: true,
  d: true
}, _marko_component$2);
var _marko_componentType$1 = "__marko-run__route__features.marko";
var _marko_template$1 = t(_marko_componentType$1);
var _marko_component$1 = {};
_marko_template$1._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  _marko_dynamic_tag(out, _marko_template$b, () => ({
    ...input
  }), (out2) => {
    _marko_dynamic_tag(out2, _marko_template$2, () => input, null, null, null, _componentDef, "1");
  }, null, null, _componentDef, "0");
}, {
  t: _marko_componentType$1,
  i: true,
  d: true
}, _marko_component$1);
var _marko_componentType = "__marko-run__route__features.entry.marko";
var _marko_template = t(_marko_componentType);
var _marko_component = {};
_marko_template._ = _marko_renderer(function(input, out, _componentDef, _component, state, $global) {
  out.global.___viteBaseVar = "$mbp";
  (out.global.___viteEntries || (out.global.___viteEntries = [])).push("__marko-run__route__features_5JOn");
  _marko_tag(_marko_template$4, {
    "slot": "head-prepend"
  }, out, _componentDef, "0");
  _marko_tag(_marko_template$4, {
    "slot": "head"
  }, out, _componentDef, "1");
  _marko_tag(_marko_template$4, {
    "slot": "body-prepend"
  }, out, _componentDef, "2");
  _marko_tag(_marko_template$1, input, out, _componentDef, "3");
  _marko_tag(_initComponents, {}, out, _componentDef, "4");
  _marko_tag(_awaitReorderer, {}, out, _componentDef, "5");
  _marko_tag(_marko_template$4, {
    "slot": "body"
  }, out, _componentDef, "6");
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);
async function get2(context, buildInput) {
  return pageResponse(_marko_template, buildInput());
}
globalThis.__marko_run__ = { match, fetch: fetch$1, invoke };
function match(method, pathname) {
  if (!pathname) {
    pathname = "/";
  } else if (pathname.charAt(0) !== "/") {
    pathname = "/" + pathname;
  }
  switch (method.toLowerCase()) {
    case "get": {
      const len = pathname.length;
      if (len === 1)
        return { handler: get1, params: {}, meta: {}, path: "/" };
      const i1 = pathname.indexOf("/", 1) + 1;
      if (!i1 || i1 === len) {
        if (decodeURIComponent(pathname.slice(1, i1 ? -1 : len)).toLowerCase() === "features")
          return { handler: get2, params: {}, meta: {}, path: "/features" };
      }
      return null;
    }
  }
  return null;
}
async function invoke(route, request, platform, url) {
  const [context, buildInput] = createContext(route, request, platform, url);
  try {
    if (route) {
      try {
        const response = await route.handler(context, buildInput);
        if (response)
          return response;
      } catch (error) {
        if (error === NotHandled) {
          return;
        } else if (error !== NotMatched) {
          throw error;
        }
      }
    }
  } catch (error) {
    throw error;
  }
}
async function fetch$1(request, platform) {
  try {
    const url = new URL(request.url);
    let { pathname } = url;
    if (pathname !== "/" && pathname.endsWith("/")) {
      url.pathname = pathname.slice(0, -1);
      return Response.redirect(url);
    }
    const route = match(request.method, pathname);
    return await invoke(route, request, platform, url);
  } catch (error) {
    const body = error.stack || error.message || "Internal Server Error";
    return new Response(body, {
      status: 500
    });
  }
}
async function default_edge_entry_default(request, context) {
  const response = await fetch$1(request, {
    context
  });
  return response || context.next();
}
var __MARKO_MANIFEST__ = { "__marko-run__route__index_fMAW": { "head-prepend": null, "head": ["<script", 0, ' async type="module" crossorigin src="', 1, 'assets/index-5fb5e8f7.js"', "><\/script><link", 0, ' rel="modulepreload" crossorigin href="', 1, 'assets/_bd4387f3.js"', ">"], "body-prepend": null, "body": null }, "__marko-run__route__features_5JOn": { "head-prepend": null, "head": ["<script", 0, ' async type="module" crossorigin src="', 1, 'assets/features-5fb5e8f7.js"', "><\/script><link", 0, ' rel="modulepreload" crossorigin href="', 1, 'assets/_bd4387f3.js"', ">"], "body-prepend": null, "body": null } };
export {
  default_edge_entry_default as default
};
