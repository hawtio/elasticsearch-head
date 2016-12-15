(function() {

	var joey = this.joey = function joey(elementDef, parentNode) {
		return createNode( elementDef, parentNode, parentNode ? parentNode.ownerDocument : this.document );
	};

	var shortcuts = joey.shortcuts = {
		"text" : "textContent",
		"cls" : "className"
	};

	var plugins = joey.plugins = [
		function( obj, context ) {
			if( typeof obj === 'string' ) {
				return context.createTextNode( obj );
			}
		},
		function( obj, context ) {
			if( "tag" in obj ) {
				var el = context.createElement( obj.tag );
				for( var attr in obj ) {
					addAttr( el, attr, obj[ attr ], context );
				}
				return el;
			}
		}
	];

	function addAttr( el, attr, value, context ) {
		attr = shortcuts[attr] || attr;
		if( attr === 'children' ) {
			for( var i = 0; i < value.length; i++) {
				createNode( value[i], el, context );
			}
		} else if( attr === 'style' || attr === 'dataset' ) {
			for( var prop in value ) {
				el[ attr ][ prop ] = value[ prop ];
			}
		} else if( attr.indexOf("on") === 0 ) {
			el.addEventListener( attr.substr(2), value, false );
		} else if( value !== undefined ) {
			el[ attr ] = value;
		}
	}

	function createNode( obj, parent, context ) {
		var el;
		if( obj != null ) {
			plugins.some( function( plug ) {
				return ( el = plug( obj, context ) );
			});
			parent && parent.appendChild( el );
			return el;
		}
	}

}());

(function($, document) {

	var create = $.create = (function() {

		function addAttrs( el, obj, context ) {
			for( var attr in obj ){
				switch( attr ) {
				case 'tag' :
					break;
				case 'html' :
					el.innerHTML = obj[ attr ];
					break;
				case 'css' :
					for( var style in obj.css ) {
						$.attr( el.style, style, obj.css[ style ] );
					}
					break;
				case 'text' : case 'child' : case 'children' :
					createNode( obj[attr], el, context );
					break;
				case 'cls' :
					el.className = obj[attr];
					break;
				case 'data' :
					for( var data in obj.data ) {
						$.data( el, data, obj.data[data] );
					}
					break;
				default :
					if( attr.indexOf("on") === 0 && $.isFunction(obj[attr]) ) {
						$.event.add( el, attr.substr(2).replace(/^[A-Z]/, function(a) { return a.toLowerCase(); }), obj[attr] );
					} else {
						$.attr( el, attr, obj[attr] );
					}
				}
			}
		}

		function createNode(obj, parent, context) {
			if(obj && ($.isArray(obj) || obj instanceof $)) {
				for(var ret = [], i = 0; i < obj.length; i++) {
					var newNode = createNode(obj[i], parent, context);
					if(newNode) {
						ret.push(newNode);
					}
				}
				return ret;
			}
			var el;
			if(typeof(obj) === 'string') {
				el = context.createTextNode( obj );
			} else if(!obj) {
				return undefined;
			} else if(obj.nodeType === 1) {
				el = obj;
			} else if( obj instanceof app.ui.AbstractWidget ) {
				el = obj.el[0];
			} else {
				el = context.createElement( obj.tag || 'DIV' );
				addAttrs(el, obj, context);
			}
			if(parent){ parent.appendChild(el); }
			return el;
		}

		return function(elementDef, parentNode) {
			return createNode(elementDef, parentNode, (parentNode && parentNode.ownerDocument) || document);
		};
		
	})();
	

	// inject create into jquery internals so object definitions are treated as first class constructors (overrides non-public methods)
	var clean = $.clean,
		init = $.fn.init;

	$.clean = function( elems, context, fragment, scripts ) {
		for(var i = 0; i < elems.length; i++) {
			if( elems[i] && (elems[i].tag || elems[i] instanceof app.ui.AbstractWidget )) {
				elems[i] = create( elems[i], null, context );
			}
		}
		return clean( elems, context, fragment, scripts );
	};

	$.fn.init = function( selector, context, rootjQuery ) {
		if ( selector && ( selector.tag || selector instanceof app.ui.AbstractWidget )) {
			selector = create( selector, null, context );
		}
		return init.call( this, selector, context, rootjQuery );
	};

	$.fn.init.prototype = $.fn;

})(jQuery, window.document);


/*!
 * Raphael 1.5.2 - JavaScript Vector Library
 *
 * Copyright (c) 2010 Dmitry Baranovskiy (http://raphaeljs.com)
 * Licensed under the MIT (http://raphaeljs.com/license.html) license.
 * from fork at git@github.com:mobz/g.raphael.git
 */
(function () {
    function R() {
        if (R.is(arguments[0], array)) {
            var a = arguments[0],
                cnv = create[apply](R, a.splice(0, 3 + R.is(a[0], nu))),
                res = cnv.set();
            for (var i = 0, ii = a[length]; i < ii; i++) {
                var j = a[i] || {};
                elements[has](j.type) && res[push](cnv[j.type]().attr(j));
            }
            return res;
        }
        return create[apply](R, arguments);
    }
    R.version = "1.5.2";
    var separator = /[, ]+/,
        elements = {circle: 1, rect: 1, path: 1, ellipse: 1, text: 1, image: 1},
        formatrg = /\{(\d+)\}/g,
        proto = "prototype",
        has = "hasOwnProperty",
        doc = document,
        win = window,
        oldRaphael = {
            was: Object[proto][has].call(win, "Raphael"),
            is: win.Raphael
        },
        Paper = function () {
            this.customAttributes = {};
        },
        paperproto,
        appendChild = "appendChild",
        apply = "apply",
        concat = "concat",
        supportsTouch = "createTouch" in doc,
        E = "",
        S = " ",
        Str = String,
        split = "split",
        events = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend orientationchange touchcancel gesturestart gesturechange gestureend"[split](S),
        touchMap = {
            mousedown: "touchstart",
            mousemove: "touchmove",
            mouseup: "touchend"
        },
        join = "join",
        length = "length",
        lowerCase = Str[proto].toLowerCase,
        math = Math,
        mmax = math.max,
        mmin = math.min,
        abs = math.abs,
        pow = math.pow,
        PI = math.PI,
        nu = "number",
        string = "string",
        array = "array",
        toString = "toString",
        fillString = "fill",
        objectToString = Object[proto][toString],
        paper = {},
        push = "push",
        ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i,
        colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,
        isnan = {"NaN": 1, "Infinity": 1, "-Infinity": 1},
        bezierrg = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
        round = math.round,
        setAttribute = "setAttribute",
        toFloat = parseFloat,
        toInt = parseInt,
        ms = " progid:DXImageTransform.Microsoft",
        upperCase = Str[proto].toUpperCase,
        availableAttrs = {blur: 0, "clip-rect": "0 0 1e9 1e9", cursor: "default", cx: 0, cy: 0, fill: "#fff", "fill-opacity": 1, font: '10px "Arial"', "font-family": '"Arial"', "font-size": "10", "font-style": "normal", "font-weight": 400, gradient: 0, height: 0, href: "http://raphaeljs.com/", opacity: 1, path: "M0,0", r: 0, rotation: 0, rx: 0, ry: 0, scale: "1 1", src: "", stroke: "#000", "stroke-dasharray": "", "stroke-linecap": "butt", "stroke-linejoin": "butt", "stroke-miterlimit": 0, "stroke-opacity": 1, "stroke-width": 1, target: "_blank", "text-anchor": "middle", title: "Raphael", translation: "0 0", width: 0, x: 0, y: 0},
        availableAnimAttrs = {along: "along", blur: nu, "clip-rect": "csv", cx: nu, cy: nu, fill: "colour", "fill-opacity": nu, "font-size": nu, height: nu, opacity: nu, path: "path", r: nu, rotation: "csv", rx: nu, ry: nu, scale: "csv", stroke: "colour", "stroke-opacity": nu, "stroke-width": nu, translation: "csv", width: nu, x: nu, y: nu},
        rp = "replace",
        animKeyFrames= /^(from|to|\d+%?)$/,
        commaSpaces = /\s*,\s*/,
        hsrg = {hs: 1, rg: 1},
        p2s = /,?([achlmqrstvxz]),?/gi,
        pathCommand = /([achlmqstvz])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?\s*,?\s*)+)/ig,
        pathValues = /(-?\d*\.?\d*(?:e[-+]?\d+)?)\s*,?\s*/ig,
        radial_gradient = /^r(?:\(([^,]+?)\s*,\s*([^\)]+?)\))?/,
        sortByKey = function (a, b) {
            return a.key - b.key;
        };

    R.type = (win.SVGAngle || doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML");
    if (R.type == "VML") {
        var d = doc.createElement("div"),
            b;
        d.innerHTML = '<v:shape adj="1"/>';
        b = d.firstChild;
        b.style.behavior = "url(#default#VML)";
        if (!(b && typeof b.adj == "object")) {
            return R.type = null;
        }
        d = null;
    }
    R.svg = !(R.vml = R.type == "VML");
    Paper[proto] = R[proto];
    paperproto = Paper[proto];
    R._id = 0;
    R._oid = 0;
    R.fn = {};
    R.is = function (o, type) {
        type = lowerCase.call(type);
        if (type == "finite") {
            return !isnan[has](+o);
        }
        return  (type == "null" && o === null) ||
                (type == typeof o) ||
                (type == "object" && o === Object(o)) ||
                (type == "array" && Array.isArray && Array.isArray(o)) ||
                objectToString.call(o).slice(8, -1).toLowerCase() == type;
    };
    R.angle = function (x1, y1, x2, y2, x3, y3) {
        if (x3 == null) {
            var x = x1 - x2,
                y = y1 - y2;
            if (!x && !y) {
                return 0;
            }
            return ((x < 0) * 180 + math.atan(-y / -x) * 180 / PI + 360) % 360;
        } else {
            return R.angle(x1, y1, x3, y3) - R.angle(x2, y2, x3, y3);
        }
    };
    R.rad = function (deg) {
        return deg % 360 * PI / 180;
    };
    R.deg = function (rad) {
        return rad * 180 / PI % 360;
    };
    R.snapTo = function (values, value, tolerance) {
        tolerance = R.is(tolerance, "finite") ? tolerance : 10;
        if (R.is(values, array)) {
            var i = values.length;
            while (i--) if (abs(values[i] - value) <= tolerance) {
                return values[i];
            }
        } else {
            values = +values;
            var rem = value % values;
            if (rem < tolerance) {
                return value - rem;
            }
            if (rem > values - tolerance) {
                return value - rem + values;
            }
        }
        return value;
    };
    function createUUID() {
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [],
            i = 0;
        for (; i < 32; i++) {
            s[i] = (~~(math.random() * 16))[toString](16);
        }
        s[12] = 4;  // bits 12-15 of the time_hi_and_version field to 0010
        s[16] = ((s[16] & 3) | 8)[toString](16);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        return "r-" + s[join]("");
    }

    R.setWindow = function (newwin) {
        win = newwin;
        doc = win.document;
    };
    // colour utilities
    var toHex = function (color) {
        if (R.vml) {
            // http://dean.edwards.name/weblog/2009/10/convert-any-colour-value-to-hex-in-msie/
            var trim = /^\s+|\s+$/g;
            var bod;
            try {
                var docum = new ActiveXObject("htmlfile");
                docum.write("<body>");
                docum.close();
                bod = docum.body;
            } catch(e) {
                bod = createPopup().document.body;
            }
            var range = bod.createTextRange();
            toHex = cacher(function (color) {
                try {
                    bod.style.color = Str(color)[rp](trim, E);
                    var value = range.queryCommandValue("ForeColor");
                    value = ((value & 255) << 16) | (value & 65280) | ((value & 16711680) >>> 16);
                    return "#" + ("000000" + value[toString](16)).slice(-6);
                } catch(e) {
                    return "none";
                }
            });
        } else {
            var i = doc.createElement("i");
            i.title = "Rapha\xebl Colour Picker";
            i.style.display = "none";
            doc.body[appendChild](i);
            toHex = cacher(function (color) {
                i.style.color = color;
                return doc.defaultView.getComputedStyle(i, E).getPropertyValue("color");
            });
        }
        return toHex(color);
    },
    hsbtoString = function () {
        return "hsb(" + [this.h, this.s, this.b] + ")";
    },
    hsltoString = function () {
        return "hsl(" + [this.h, this.s, this.l] + ")";
    },
    rgbtoString = function () {
        return this.hex;
    };
    R.hsb2rgb = function (h, s, b, o) {
        if (R.is(h, "object") && "h" in h && "s" in h && "b" in h) {
            b = h.b;
            s = h.s;
            h = h.h;
            o = h.o;
        }
        return R.hsl2rgb(h, s, b / 2, o);
    };
    R.hsl2rgb = function (h, s, l, o) {
        if (R.is(h, "object") && "h" in h && "s" in h && "l" in h) {
            l = h.l;
            s = h.s;
            h = h.h;
        }
        if (h > 1 || s > 1 || l > 1) {
            h /= 360;
            s /= 100;
            l /= 100;
        }
        var rgb = {},
            channels = ["r", "g", "b"],
            t2, t1, t3, r, g, b;
        if (!s) {
            rgb = {
                r: l,
                g: l,
                b: l
            };
        } else {
            if (l < .5) {
                t2 = l * (1 + s);
            } else {
                t2 = l + s - l * s;
            }
            t1 = 2 * l - t2;
            for (var i = 0; i < 3; i++) {
                t3 = h + 1 / 3 * -(i - 1);
                t3 < 0 && t3++;
                t3 > 1 && t3--;
                if (t3 * 6 < 1) {
                    rgb[channels[i]] = t1 + (t2 - t1) * 6 * t3;
                } else if (t3 * 2 < 1) {
                    rgb[channels[i]] = t2;
                } else if (t3 * 3 < 2) {
                    rgb[channels[i]] = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                } else {
                    rgb[channels[i]] = t1;
                }
            }
        }
        rgb.r *= 255;
        rgb.g *= 255;
        rgb.b *= 255;
        rgb.hex = "#" + (16777216 | rgb.b | (rgb.g << 8) | (rgb.r << 16)).toString(16).slice(1);
        R.is(o, "finite") && (rgb.opacity = o);
        rgb.toString = rgbtoString;
        return rgb;
    };
    R.rgb2hsb = function (red, green, blue) {
        if (green == null && R.is(red, "object") && "r" in red && "g" in red && "b" in red) {
            blue = red.b;
            green = red.g;
            red = red.r;
        }
        if (green == null && R.is(red, string)) {
            var clr = R.getRGB(red);
            red = clr.r;
            green = clr.g;
            blue = clr.b;
        }
        if (red > 1 || green > 1 || blue > 1) {
            red /= 255;
            green /= 255;
            blue /= 255;
        }
        var max = mmax(red, green, blue),
            min = mmin(red, green, blue),
            hue,
            saturation,
            brightness = max;
        if (min == max) {
            return {h: 0, s: 0, b: max, toString: hsbtoString};
        } else {
            var delta = (max - min);
            saturation = delta / max;
            if (red == max) {
                hue = (green - blue) / delta;
            } else if (green == max) {
                hue = 2 + ((blue - red) / delta);
            } else {
                hue = 4 + ((red - green) / delta);
            }
            hue /= 6;
            hue < 0 && hue++;
            hue > 1 && hue--;
        }
        return {h: hue, s: saturation, b: brightness, toString: hsbtoString};
    };
    R.rgb2hsl = function (red, green, blue) {
        if (green == null && R.is(red, "object") && "r" in red && "g" in red && "b" in red) {
            blue = red.b;
            green = red.g;
            red = red.r;
        }
        if (green == null && R.is(red, string)) {
            var clr = R.getRGB(red);
            red = clr.r;
            green = clr.g;
            blue = clr.b;
        }
        if (red > 1 || green > 1 || blue > 1) {
            red /= 255;
            green /= 255;
            blue /= 255;
        }
        var max = mmax(red, green, blue),
            min = mmin(red, green, blue),
            h,
            s,
            l = (max + min) / 2,
            hsl;
        if (min == max) {
            hsl =  {h: 0, s: 0, l: l};
        } else {
            var delta = max - min;
            s = l < .5 ? delta / (max + min) : delta / (2 - max - min);
            if (red == max) {
                h = (green - blue) / delta;
            } else if (green == max) {
                h = 2 + (blue - red) / delta;
            } else {
                h = 4 + (red - green) / delta;
            }
            h /= 6;
            h < 0 && h++;
            h > 1 && h--;
            hsl = {h: h, s: s, l: l};
        }
        hsl.toString = hsltoString;
        return hsl;
    };
    R._path2string = function () {
        return this.join(",")[rp](p2s, "$1");
    };
    function cacher(f, scope, postprocessor) {
        function newf() {
            var arg = Array[proto].slice.call(arguments, 0),
                args = arg[join]("\u25ba"),
                cache = newf.cache = newf.cache || {},
                count = newf.count = newf.count || [];
            if (cache[has](args)) {
                return postprocessor ? postprocessor(cache[args]) : cache[args];
            }
            count[length] >= 1e3 && delete cache[count.shift()];
            count[push](args);
            cache[args] = f[apply](scope, arg);
            return postprocessor ? postprocessor(cache[args]) : cache[args];
        }
        return newf;
    }
 
    R.getRGB = cacher(function (colour) {
        if (!colour || !!((colour = Str(colour)).indexOf("-") + 1)) {
            return {r: -1, g: -1, b: -1, hex: "none", error: 1};
        }
        if (colour == "none") {
            return {r: -1, g: -1, b: -1, hex: "none"};
        }
        !(hsrg[has](colour.toLowerCase().substring(0, 2)) || colour.charAt() == "#") && (colour = toHex(colour));
        var res,
            red,
            green,
            blue,
            opacity,
            t,
            values,
            rgb = colour.match(colourRegExp);
        if (rgb) {
            if (rgb[2]) {
                blue = toInt(rgb[2].substring(5), 16);
                green = toInt(rgb[2].substring(3, 5), 16);
                red = toInt(rgb[2].substring(1, 3), 16);
            }
            if (rgb[3]) {
                blue = toInt((t = rgb[3].charAt(3)) + t, 16);
                green = toInt((t = rgb[3].charAt(2)) + t, 16);
                red = toInt((t = rgb[3].charAt(1)) + t, 16);
            }
            if (rgb[4]) {
                values = rgb[4][split](commaSpaces);
                red = toFloat(values[0]);
                values[0].slice(-1) == "%" && (red *= 2.55);
                green = toFloat(values[1]);
                values[1].slice(-1) == "%" && (green *= 2.55);
                blue = toFloat(values[2]);
                values[2].slice(-1) == "%" && (blue *= 2.55);
                rgb[1].toLowerCase().slice(0, 4) == "rgba" && (opacity = toFloat(values[3]));
                values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
            }
            if (rgb[5]) {
                values = rgb[5][split](commaSpaces);
                red = toFloat(values[0]);
                values[0].slice(-1) == "%" && (red *= 2.55);
                green = toFloat(values[1]);
                values[1].slice(-1) == "%" && (green *= 2.55);
                blue = toFloat(values[2]);
                values[2].slice(-1) == "%" && (blue *= 2.55);
                (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
                rgb[1].toLowerCase().slice(0, 4) == "hsba" && (opacity = toFloat(values[3]));
                values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
                return R.hsb2rgb(red, green, blue, opacity);
            }
            if (rgb[6]) {
                values = rgb[6][split](commaSpaces);
                red = toFloat(values[0]);
                values[0].slice(-1) == "%" && (red *= 2.55);
                green = toFloat(values[1]);
                values[1].slice(-1) == "%" && (green *= 2.55);
                blue = toFloat(values[2]);
                values[2].slice(-1) == "%" && (blue *= 2.55);
                (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
                rgb[1].toLowerCase().slice(0, 4) == "hsla" && (opacity = toFloat(values[3]));
                values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
                return R.hsl2rgb(red, green, blue, opacity);
            }
            rgb = {r: red, g: green, b: blue};
            rgb.hex = "#" + (16777216 | blue | (green << 8) | (red << 16)).toString(16).slice(1);
            R.is(opacity, "finite") && (rgb.opacity = opacity);
            return rgb;
        }
        return {r: -1, g: -1, b: -1, hex: "none", error: 1};
    }, R);
    R.getColor = function (value) {
        var start = this.getColor.start = this.getColor.start || {h: 0, s: 1, b: value || .75},
            rgb = this.hsb2rgb(start.h, start.s, start.b);
        start.h += .075;
        if (start.h > 1) {
            start.h = 0;
            start.s -= .2;
            start.s <= 0 && (this.getColor.start = {h: 0, s: 1, b: start.b});
        }
        return rgb.hex;
    };
    R.getColor.reset = function () {
        delete this.start;
    };
    // path utilities
    R.parsePathString = cacher(function (pathString) {
        if (!pathString) {
            return null;
        }
        var paramCounts = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0},
            data = [];
        if (R.is(pathString, array) && R.is(pathString[0], array)) { // rough assumption
            data = pathClone(pathString);
        }
        if (!data[length]) {
            Str(pathString)[rp](pathCommand, function (a, b, c) {
                var params = [],
                    name = lowerCase.call(b);
                c[rp](pathValues, function (a, b) {
                    b && params[push](+b);
                });
                if (name == "m" && params[length] > 2) {
                    data[push]([b][concat](params.splice(0, 2)));
                    name = "l";
                    b = b == "m" ? "l" : "L";
                }
                while (params[length] >= paramCounts[name]) {
                    data[push]([b][concat](params.splice(0, paramCounts[name])));
                    if (!paramCounts[name]) {
                        break;
                    }
                }
            });
        }
        data[toString] = R._path2string;
        return data;
    });
    R.findDotsAtSegment = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
        var t1 = 1 - t,
            x = pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
            y = pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y,
            mx = p1x + 2 * t * (c1x - p1x) + t * t * (c2x - 2 * c1x + p1x),
            my = p1y + 2 * t * (c1y - p1y) + t * t * (c2y - 2 * c1y + p1y),
            nx = c1x + 2 * t * (c2x - c1x) + t * t * (p2x - 2 * c2x + c1x),
            ny = c1y + 2 * t * (c2y - c1y) + t * t * (p2y - 2 * c2y + c1y),
            ax = (1 - t) * p1x + t * c1x,
            ay = (1 - t) * p1y + t * c1y,
            cx = (1 - t) * c2x + t * p2x,
            cy = (1 - t) * c2y + t * p2y,
            alpha = (90 - math.atan((mx - nx) / (my - ny)) * 180 / PI);
        (mx > nx || my < ny) && (alpha += 180);
        return {x: x, y: y, m: {x: mx, y: my}, n: {x: nx, y: ny}, start: {x: ax, y: ay}, end: {x: cx, y: cy}, alpha: alpha};
    };
    var pathDimensions = cacher(function (path) {
        if (!path) {
            return {x: 0, y: 0, width: 0, height: 0};
        }
        path = path2curve(path);
        var x = 0, 
            y = 0,
            X = [],
            Y = [],
            p;
        for (var i = 0, ii = path[length]; i < ii; i++) {
            p = path[i];
            if (p[0] == "M") {
                x = p[1];
                y = p[2];
                X[push](x);
                Y[push](y);
            } else {
                var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                X = X[concat](dim.min.x, dim.max.x);
                Y = Y[concat](dim.min.y, dim.max.y);
                x = p[5];
                y = p[6];
            }
        }
        var xmin = mmin[apply](0, X),
            ymin = mmin[apply](0, Y);
        return {
            x: xmin,
            y: ymin,
            width: mmax[apply](0, X) - xmin,
            height: mmax[apply](0, Y) - ymin
        };
    }),
        pathClone = function (pathArray) {
            var res = [];
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            for (var i = 0, ii = pathArray[length]; i < ii; i++) {
                res[i] = [];
                for (var j = 0, jj = pathArray[i][length]; j < jj; j++) {
                    res[i][j] = pathArray[i][j];
                }
            }
            res[toString] = R._path2string;
            return res;
        },
        pathToRelative = cacher(function (pathArray) {
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] == "M") {
                x = pathArray[0][1];
                y = pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res[push](["M", x, y]);
            }
            for (var i = start, ii = pathArray[length]; i < ii; i++) {
                var r = res[i] = [],
                    pa = pathArray[i];
                if (pa[0] != lowerCase.call(pa[0])) {
                    r[0] = lowerCase.call(pa[0]);
                    switch (r[0]) {
                        case "a":
                            r[1] = pa[1];
                            r[2] = pa[2];
                            r[3] = pa[3];
                            r[4] = pa[4];
                            r[5] = pa[5];
                            r[6] = +(pa[6] - x).toFixed(3);
                            r[7] = +(pa[7] - y).toFixed(3);
                            break;
                        case "v":
                            r[1] = +(pa[1] - y).toFixed(3);
                            break;
                        case "m":
                            mx = pa[1];
                            my = pa[2];
                        default:
                            for (var j = 1, jj = pa[length]; j < jj; j++) {
                                r[j] = +(pa[j] - ((j % 2) ? x : y)).toFixed(3);
                            }
                    }
                } else {
                    r = res[i] = [];
                    if (pa[0] == "m") {
                        mx = pa[1] + x;
                        my = pa[2] + y;
                    }
                    for (var k = 0, kk = pa[length]; k < kk; k++) {
                        res[i][k] = pa[k];
                    }
                }
                var len = res[i][length];
                switch (res[i][0]) {
                    case "z":
                        x = mx;
                        y = my;
                        break;
                    case "h":
                        x += +res[i][len - 1];
                        break;
                    case "v":
                        y += +res[i][len - 1];
                        break;
                    default:
                        x += +res[i][len - 2];
                        y += +res[i][len - 1];
                }
            }
            res[toString] = R._path2string;
            return res;
        }, 0, pathClone),
        pathToAbsolute = cacher(function (pathArray) {
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] == "M") {
                x = +pathArray[0][1];
                y = +pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res[0] = ["M", x, y];
            }
            for (var i = start, ii = pathArray[length]; i < ii; i++) {
                var r = res[i] = [],
                    pa = pathArray[i];
                if (pa[0] != upperCase.call(pa[0])) {
                    r[0] = upperCase.call(pa[0]);
                    switch (r[0]) {
                        case "A":
                            r[1] = pa[1];
                            r[2] = pa[2];
                            r[3] = pa[3];
                            r[4] = pa[4];
                            r[5] = pa[5];
                            r[6] = +(pa[6] + x);
                            r[7] = +(pa[7] + y);
                            break;
                        case "V":
                            r[1] = +pa[1] + y;
                            break;
                        case "H":
                            r[1] = +pa[1] + x;
                            break;
                        case "M":
                            mx = +pa[1] + x;
                            my = +pa[2] + y;
                        default:
                            for (var j = 1, jj = pa[length]; j < jj; j++) {
                                r[j] = +pa[j] + ((j % 2) ? x : y);
                            }
                    }
                } else {
                    for (var k = 0, kk = pa[length]; k < kk; k++) {
                        res[i][k] = pa[k];
                    }
                }
                switch (r[0]) {
                    case "Z":
                        x = mx;
                        y = my;
                        break;
                    case "H":
                        x = r[1];
                        break;
                    case "V":
                        y = r[1];
                        break;
                    case "M":
                        mx = res[i][res[i][length] - 2];
                        my = res[i][res[i][length] - 1];
                    default:
                        x = res[i][res[i][length] - 2];
                        y = res[i][res[i][length] - 1];
                }
            }
            res[toString] = R._path2string;
            return res;
        }, null, pathClone),
        l2c = function (x1, y1, x2, y2) {
            return [x1, y1, x2, y2, x2, y2];
        },
        q2c = function (x1, y1, ax, ay, x2, y2) {
            var _13 = 1 / 3,
                _23 = 2 / 3;
            return [
                    _13 * x1 + _23 * ax,
                    _13 * y1 + _23 * ay,
                    _13 * x2 + _23 * ax,
                    _13 * y2 + _23 * ay,
                    x2,
                    y2
                ];
        },
        a2c = function (x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
            // for more information of where this math came from visit:
            // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
            var _120 = PI * 120 / 180,
                rad = PI / 180 * (+angle || 0),
                res = [],
                xy,
                rotate = cacher(function (x, y, rad) {
                    var X = x * math.cos(rad) - y * math.sin(rad),
                        Y = x * math.sin(rad) + y * math.cos(rad);
                    return {x: X, y: Y};
                });
            if (!recursive) {
                xy = rotate(x1, y1, -rad);
                x1 = xy.x;
                y1 = xy.y;
                xy = rotate(x2, y2, -rad);
                x2 = xy.x;
                y2 = xy.y;
                var cos = math.cos(PI / 180 * angle),
                    sin = math.sin(PI / 180 * angle),
                    x = (x1 - x2) / 2,
                    y = (y1 - y2) / 2;
                var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
                if (h > 1) {
                    h = math.sqrt(h);
                    rx = h * rx;
                    ry = h * ry;
                }
                var rx2 = rx * rx,
                    ry2 = ry * ry,
                    k = (large_arc_flag == sweep_flag ? -1 : 1) *
                        math.sqrt(abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
                    cx = k * rx * y / ry + (x1 + x2) / 2,
                    cy = k * -ry * x / rx + (y1 + y2) / 2,
                    f1 = math.asin(((y1 - cy) / ry).toFixed(9)),
                    f2 = math.asin(((y2 - cy) / ry).toFixed(9));

                f1 = x1 < cx ? PI - f1 : f1;
                f2 = x2 < cx ? PI - f2 : f2;
                f1 < 0 && (f1 = PI * 2 + f1);
                f2 < 0 && (f2 = PI * 2 + f2);
                if (sweep_flag && f1 > f2) {
                    f1 = f1 - PI * 2;
                }
                if (!sweep_flag && f2 > f1) {
                    f2 = f2 - PI * 2;
                }
            } else {
                f1 = recursive[0];
                f2 = recursive[1];
                cx = recursive[2];
                cy = recursive[3];
            }
            var df = f2 - f1;
            if (abs(df) > _120) {
                var f2old = f2,
                    x2old = x2,
                    y2old = y2;
                f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
                x2 = cx + rx * math.cos(f2);
                y2 = cy + ry * math.sin(f2);
                res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
            }
            df = f2 - f1;
            var c1 = math.cos(f1),
                s1 = math.sin(f1),
                c2 = math.cos(f2),
                s2 = math.sin(f2),
                t = math.tan(df / 4),
                hx = 4 / 3 * rx * t,
                hy = 4 / 3 * ry * t,
                m1 = [x1, y1],
                m2 = [x1 + hx * s1, y1 - hy * c1],
                m3 = [x2 + hx * s2, y2 - hy * c2],
                m4 = [x2, y2];
            m2[0] = 2 * m1[0] - m2[0];
            m2[1] = 2 * m1[1] - m2[1];
            if (recursive) {
                return [m2, m3, m4][concat](res);
            } else {
                res = [m2, m3, m4][concat](res)[join]()[split](",");
                var newres = [];
                for (var i = 0, ii = res[length]; i < ii; i++) {
                    newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
                }
                return newres;
            }
        },
        findDotAtSegment = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
            var t1 = 1 - t;
            return {
                x: pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
                y: pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y
            };
        },
        curveDim = cacher(function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
            var a = (c2x - 2 * c1x + p1x) - (p2x - 2 * c2x + c1x),
                b = 2 * (c1x - p1x) - 2 * (c2x - c1x),
                c = p1x - c1x,
                t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a,
                t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a,
                y = [p1y, p2y],
                x = [p1x, p2x],
                dot;
            abs(t1) > "1e12" && (t1 = .5);
            abs(t2) > "1e12" && (t2 = .5);
            if (t1 > 0 && t1 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
                x[push](dot.x);
                y[push](dot.y);
            }
            if (t2 > 0 && t2 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
                x[push](dot.x);
                y[push](dot.y);
            }
            a = (c2y - 2 * c1y + p1y) - (p2y - 2 * c2y + c1y);
            b = 2 * (c1y - p1y) - 2 * (c2y - c1y);
            c = p1y - c1y;
            t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a;
            t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a;
            abs(t1) > "1e12" && (t1 = .5);
            abs(t2) > "1e12" && (t2 = .5);
            if (t1 > 0 && t1 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
                x[push](dot.x);
                y[push](dot.y);
            }
            if (t2 > 0 && t2 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
                x[push](dot.x);
                y[push](dot.y);
            }
            return {
                min: {x: mmin[apply](0, x), y: mmin[apply](0, y)},
                max: {x: mmax[apply](0, x), y: mmax[apply](0, y)}
            };
        }),
        path2curve = cacher(function (path, path2) {
            var p = pathToAbsolute(path),
                p2 = path2 && pathToAbsolute(path2),
                attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
                attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
                processPath = function (path, d) {
                    var nx, ny;
                    if (!path) {
                        return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
                    }
                    !(path[0] in {T:1, Q:1}) && (d.qx = d.qy = null);
                    switch (path[0]) {
                        case "M":
                            d.X = path[1];
                            d.Y = path[2];
                            break;
                        case "A":
                            path = ["C"][concat](a2c[apply](0, [d.x, d.y][concat](path.slice(1))));
                            break;
                        case "S":
                            nx = d.x + (d.x - (d.bx || d.x));
                            ny = d.y + (d.y - (d.by || d.y));
                            path = ["C", nx, ny][concat](path.slice(1));
                            break;
                        case "T":
                            d.qx = d.x + (d.x - (d.qx || d.x));
                            d.qy = d.y + (d.y - (d.qy || d.y));
                            path = ["C"][concat](q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                            break;
                        case "Q":
                            d.qx = path[1];
                            d.qy = path[2];
                            path = ["C"][concat](q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                            break;
                        case "L":
                            path = ["C"][concat](l2c(d.x, d.y, path[1], path[2]));
                            break;
                        case "H":
                            path = ["C"][concat](l2c(d.x, d.y, path[1], d.y));
                            break;
                        case "V":
                            path = ["C"][concat](l2c(d.x, d.y, d.x, path[1]));
                            break;
                        case "Z":
                            path = ["C"][concat](l2c(d.x, d.y, d.X, d.Y));
                            break;
                    }
                    return path;
                },
                fixArc = function (pp, i) {
                    if (pp[i][length] > 7) {
                        pp[i].shift();
                        var pi = pp[i];
                        while (pi[length]) {
                            pp.splice(i++, 0, ["C"][concat](pi.splice(0, 6)));
                        }
                        pp.splice(i, 1);
                        ii = mmax(p[length], p2 && p2[length] || 0);
                    }
                },
                fixM = function (path1, path2, a1, a2, i) {
                    if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
                        path2.splice(i, 0, ["M", a2.x, a2.y]);
                        a1.bx = 0;
                        a1.by = 0;
                        a1.x = path1[i][1];
                        a1.y = path1[i][2];
                        ii = mmax(p[length], p2 && p2[length] || 0);
                    }
                };
            for (var i = 0, ii = mmax(p[length], p2 && p2[length] || 0); i < ii; i++) {
                p[i] = processPath(p[i], attrs);
                fixArc(p, i);
                p2 && (p2[i] = processPath(p2[i], attrs2));
                p2 && fixArc(p2, i);
                fixM(p, p2, attrs, attrs2, i);
                fixM(p2, p, attrs2, attrs, i);
                var seg = p[i],
                    seg2 = p2 && p2[i],
                    seglen = seg[length],
                    seg2len = p2 && seg2[length];
                attrs.x = seg[seglen - 2];
                attrs.y = seg[seglen - 1];
                attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
                attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
                attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
                attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
                attrs2.x = p2 && seg2[seg2len - 2];
                attrs2.y = p2 && seg2[seg2len - 1];
            }
            return p2 ? [p, p2] : p;
        }, null, pathClone),
        parseDots = cacher(function (gradient) {
            var dots = [];
            for (var i = 0, ii = gradient[length]; i < ii; i++) {
                var dot = {},
                    par = gradient[i].match(/^([^:]*):?([\d\.]*)/);
                dot.color = R.getRGB(par[1]);
                if (dot.color.error) {
                    return null;
                }
                dot.color = dot.color.hex;
                par[2] && (dot.offset = par[2] + "%");
                dots[push](dot);
            }
            for (i = 1, ii = dots[length] - 1; i < ii; i++) {
                if (!dots[i].offset) {
                    var start = toFloat(dots[i - 1].offset || 0),
                        end = 0;
                    for (var j = i + 1; j < ii; j++) {
                        if (dots[j].offset) {
                            end = dots[j].offset;
                            break;
                        }
                    }
                    if (!end) {
                        end = 100;
                        j = ii;
                    }
                    end = toFloat(end);
                    var d = (end - start) / (j - i + 1);
                    for (; i < j; i++) {
                        start += d;
                        dots[i].offset = start + "%";
                    }
                }
            }
            return dots;
        }),
        getContainer = function (x, y, w, h) {
            var container;
            if (R.is(x, string) || R.is(x, "object")) {
                container = R.is(x, string) ? doc.getElementById(x) : x;
                if (container.tagName) {
                    if (y == null) {
                        return {
                            container: container,
                            width: container.style.pixelWidth || container.offsetWidth,
                            height: container.style.pixelHeight || container.offsetHeight
                        };
                    } else {
                        return {container: container, width: y, height: w};
                    }
                }
            } else {
                return {container: 1, x: x, y: y, width: w, height: h};
            }
        },
        plugins = function (con, add) {
            var that = this;
            for (var prop in add) {
                if (add[has](prop) && !(prop in con)) {
                    switch (typeof add[prop]) {
                        case "function":
                            (function (f) {
                                con[prop] = con === that ? f : function () { return f[apply](that, arguments); };
                            })(add[prop]);
                        break;
                        case "object":
                            con[prop] = con[prop] || {};
                            plugins.call(this, con[prop], add[prop]);
                        break;
                        default:
                            con[prop] = add[prop];
                        break;
                    }
                }
            }
        },
        tear = function (el, paper) {
            el == paper.top && (paper.top = el.prev);
            el == paper.bottom && (paper.bottom = el.next);
            el.next && (el.next.prev = el.prev);
            el.prev && (el.prev.next = el.next);
        },
        tofront = function (el, paper) {
            if (paper.top === el) {
                return;
            }
            tear(el, paper);
            el.next = null;
            el.prev = paper.top;
            paper.top.next = el;
            paper.top = el;
        },
        toback = function (el, paper) {
            if (paper.bottom === el) {
                return;
            }
            tear(el, paper);
            el.next = paper.bottom;
            el.prev = null;
            paper.bottom.prev = el;
            paper.bottom = el;
        },
        insertafter = function (el, el2, paper) {
            tear(el, paper);
            el2 == paper.top && (paper.top = el);
            el2.next && (el2.next.prev = el);
            el.next = el2.next;
            el.prev = el2;
            el2.next = el;
        },
        insertbefore = function (el, el2, paper) {
            tear(el, paper);
            el2 == paper.bottom && (paper.bottom = el);
            el2.prev && (el2.prev.next = el);
            el.prev = el2.prev;
            el2.prev = el;
            el.next = el2;
        },
        removed = function (methodname) {
            return function () {
                throw new Error("Rapha\xebl: you are calling to method \u201c" + methodname + "\u201d of removed object");
            };
        };
    R.pathToRelative = pathToRelative;
    // SVG
    if (R.svg) {
        paperproto.svgns = "http://www.w3.org/2000/svg";
        paperproto.xlink = "http://www.w3.org/1999/xlink";
        round = function (num) {
            return +num + (~~num === num) * .5;
        };
        var $ = function (el, attr) {
            if (attr) {
                for (var key in attr) {
                    if (attr[has](key)) {
                        el[setAttribute](key, Str(attr[key]));
                    }
                }
            } else {
                el = doc.createElementNS(paperproto.svgns, el);
                el.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
                return el;
            }
        };
        R[toString] = function () {
            return  "Your browser supports SVG.\nYou are running Rapha\xebl " + this.version;
        };
        var thePath = function (pathString, SVG) {
            var el = $("path");
            SVG.canvas && SVG.canvas[appendChild](el);
            var p = new Element(el, SVG);
            p.type = "path";
            setFillAndStroke(p, {fill: "none", stroke: "#000", path: pathString});
            return p;
        };
        var addGradientFill = function (o, gradient, SVG) {
            var type = "linear",
                fx = .5, fy = .5,
                s = o.style;
            gradient = Str(gradient)[rp](radial_gradient, function (all, _fx, _fy) {
                type = "radial";
                if (_fx && _fy) {
                    fx = toFloat(_fx);
                    fy = toFloat(_fy);
                    var dir = ((fy > .5) * 2 - 1);
                    pow(fx - .5, 2) + pow(fy - .5, 2) > .25 &&
                        (fy = math.sqrt(.25 - pow(fx - .5, 2)) * dir + .5) &&
                        fy != .5 &&
                        (fy = fy.toFixed(5) - 1e-5 * dir);
                }
                return E;
            });
            gradient = gradient[split](/\s*\-\s*/);
            if (type == "linear") {
                var angle = gradient.shift();
                angle = -toFloat(angle);
                if (isNaN(angle)) {
                    return null;
                }
                var vector = [0, 0, math.cos(angle * PI / 180), math.sin(angle * PI / 180)],
                    max = 1 / (mmax(abs(vector[2]), abs(vector[3])) || 1);
                vector[2] *= max;
                vector[3] *= max;
                if (vector[2] < 0) {
                    vector[0] = -vector[2];
                    vector[2] = 0;
                }
                if (vector[3] < 0) {
                    vector[1] = -vector[3];
                    vector[3] = 0;
                }
            }
            var dots = parseDots(gradient);
            if (!dots) {
                return null;
            }
            var id = o.getAttribute(fillString);
            id = id.match(/^url\(#(.*)\)$/);
            id && SVG.defs.removeChild(doc.getElementById(id[1]));

            var el = $(type + "Gradient");
            el.id = createUUID();
            $(el, type == "radial" ? {fx: fx, fy: fy} : {x1: vector[0], y1: vector[1], x2: vector[2], y2: vector[3]});
            SVG.defs[appendChild](el);
            for (var i = 0, ii = dots[length]; i < ii; i++) {
                var stop = $("stop");
                $(stop, {
                    offset: dots[i].offset ? dots[i].offset : !i ? "0%" : "100%",
                    "stop-color": dots[i].color || "#fff"
                });
                el[appendChild](stop);
            }
            $(o, {
                fill: "url(#" + el.id + ")",
                opacity: 1,
                "fill-opacity": 1
            });
            s.fill = E;
            s.opacity = 1;
            s.fillOpacity = 1;
            return 1;
        };
        var updatePosition = function (o) {
            var bbox = o.getBBox();
            $(o.pattern, {patternTransform: R.format("translate({0},{1})", bbox.x, bbox.y)});
        };
        var setFillAndStroke = function (o, params) {
            var dasharray = {
                    "": [0],
                    "none": [0],
                    "-": [3, 1],
                    ".": [1, 1],
                    "-.": [3, 1, 1, 1],
                    "-..": [3, 1, 1, 1, 1, 1],
                    ". ": [1, 3],
                    "- ": [4, 3],
                    "--": [8, 3],
                    "- .": [4, 3, 1, 3],
                    "--.": [8, 3, 1, 3],
                    "--..": [8, 3, 1, 3, 1, 3]
                },
                node = o.node,
                attrs = o.attrs,
                rot = o.rotate(),
                addDashes = function (o, value) {
                    value = dasharray[lowerCase.call(value)];
                    if (value) {
                        var width = o.attrs["stroke-width"] || "1",
                            butt = {round: width, square: width, butt: 0}[o.attrs["stroke-linecap"] || params["stroke-linecap"]] || 0,
                            dashes = [];
                        var i = value[length];
                        while (i--) {
                            dashes[i] = value[i] * width + ((i % 2) ? 1 : -1) * butt;
                        }
                        $(node, {"stroke-dasharray": dashes[join](",")});
                    }
                };
            params[has]("rotation") && (rot = params.rotation);
            var rotxy = Str(rot)[split](separator);
            if (!(rotxy.length - 1)) {
                rotxy = null;
            } else {
                rotxy[1] = +rotxy[1];
                rotxy[2] = +rotxy[2];
            }
            toFloat(rot) && o.rotate(0, true);
            for (var att in params) {
                if (params[has](att)) {
                    if (!availableAttrs[has](att)) {
                        continue;
                    }
                    var value = params[att];
                    attrs[att] = value;
                    switch (att) {
                        case "blur":
                            o.blur(value);
                            break;
                        case "rotation":
                            o.rotate(value, true);
                            break;
                        case "href":
                        case "title":
                        case "target":
                            var pn = node.parentNode;
                            if (lowerCase.call(pn.tagName) != "a") {
                                var hl = $("a");
                                pn.insertBefore(hl, node);
                                hl[appendChild](node);
                                pn = hl;
                            }
                            if (att == "target" && value == "blank") {
                                pn.setAttributeNS(o.paper.xlink, "show", "new");
                            } else {
                                pn.setAttributeNS(o.paper.xlink, att, value);
                            }
                            break;
                        case "cursor":
                            node.style.cursor = value;
                            break;
                        case "clip-rect":
                            var rect = Str(value)[split](separator);
                            if (rect[length] == 4) {
                                o.clip && o.clip.parentNode.parentNode.removeChild(o.clip.parentNode);
                                var el = $("clipPath"),
                                    rc = $("rect");
                                el.id = createUUID();
                                $(rc, {
                                    x: rect[0],
                                    y: rect[1],
                                    width: rect[2],
                                    height: rect[3]
                                });
                                el[appendChild](rc);
                                o.paper.defs[appendChild](el);
                                $(node, {"clip-path": "url(#" + el.id + ")"});
                                o.clip = rc;
                            }
                            if (!value) {
                                var clip = doc.getElementById(node.getAttribute("clip-path")[rp](/(^url\(#|\)$)/g, E));
                                clip && clip.parentNode.removeChild(clip);
                                $(node, {"clip-path": E});
                                delete o.clip;
                            }
                        break;
                        case "path":
                            if (o.type == "path") {
                                $(node, {d: value ? attrs.path = pathToAbsolute(value) : "M0,0"});
                            }
                            break;
                        case "width":
                            node[setAttribute](att, value);
                            if (attrs.fx) {
                                att = "x";
                                value = attrs.x;
                            } else {
                                break;
                            }
                        case "x":
                            if (attrs.fx) {
                                value = -attrs.x - (attrs.width || 0);
                            }
                        case "rx":
                            if (att == "rx" && o.type == "rect") {
                                break;
                            }
                        case "cx":
                            rotxy && (att == "x" || att == "cx") && (rotxy[1] += value - attrs[att]);
                            node[setAttribute](att, value);
                            o.pattern && updatePosition(o);
                            break;
                        case "height":
                            node[setAttribute](att, value);
                            if (attrs.fy) {
                                att = "y";
                                value = attrs.y;
                            } else {
                                break;
                            }
                        case "y":
                            if (attrs.fy) {
                                value = -attrs.y - (attrs.height || 0);
                            }
                        case "ry":
                            if (att == "ry" && o.type == "rect") {
                                break;
                            }
                        case "cy":
                            rotxy && (att == "y" || att == "cy") && (rotxy[2] += value - attrs[att]);
                            node[setAttribute](att, value);
                            o.pattern && updatePosition(o);
                            break;
                        case "r":
                            if (o.type == "rect") {
                                $(node, {rx: value, ry: value});
                            } else {
                                node[setAttribute](att, value);
                            }
                            break;
                        case "src":
                            if (o.type == "image") {
                                node.setAttributeNS(o.paper.xlink, "href", value);
                            }
                            break;
                        case "stroke-width":
                            node.style.strokeWidth = value;
                            // Need following line for Firefox
                            node[setAttribute](att, value);
                            if (attrs["stroke-dasharray"]) {
                                addDashes(o, attrs["stroke-dasharray"]);
                            }
                            break;
                        case "stroke-dasharray":
                            addDashes(o, value);
                            break;
                        case "translation":
                            var xy = Str(value)[split](separator);
                            xy[0] = +xy[0] || 0;
                            xy[1] = +xy[1] || 0;
                            if (rotxy) {
                                rotxy[1] += xy[0];
                                rotxy[2] += xy[1];
                            }
                            translate.call(o, xy[0], xy[1]);
                            break;
                        case "scale":
                            xy = Str(value)[split](separator);
                            o.scale(+xy[0] || 1, +xy[1] || +xy[0] || 1, isNaN(toFloat(xy[2])) ? null : +xy[2], isNaN(toFloat(xy[3])) ? null : +xy[3]);
                            break;
                        case fillString:
                            var isURL = Str(value).match(ISURL);
                            if (isURL) {
                                el = $("pattern");
                                var ig = $("image");
                                el.id = createUUID();
                                $(el, {x: 0, y: 0, patternUnits: "userSpaceOnUse", height: 1, width: 1});
                                $(ig, {x: 0, y: 0});
                                ig.setAttributeNS(o.paper.xlink, "href", isURL[1]);
                                el[appendChild](ig);
 
                                var img = doc.createElement("img");
                                img.style.cssText = "position:absolute;left:-9999em;top-9999em";
                                img.onload = function () {
                                    $(el, {width: this.offsetWidth, height: this.offsetHeight});
                                    $(ig, {width: this.offsetWidth, height: this.offsetHeight});
                                    doc.body.removeChild(this);
                                    o.paper.safari();
                                };
                                doc.body[appendChild](img);
                                img.src = isURL[1];
                                o.paper.defs[appendChild](el);
                                node.style.fill = "url(#" + el.id + ")";
                                $(node, {fill: "url(#" + el.id + ")"});
                                o.pattern = el;
                                o.pattern && updatePosition(o);
                                break;
                            }
                            var clr = R.getRGB(value);
                            if (!clr.error) {
                                delete params.gradient;
                                delete attrs.gradient;
                                !R.is(attrs.opacity, "undefined") &&
                                    R.is(params.opacity, "undefined") &&
                                    $(node, {opacity: attrs.opacity});
                                !R.is(attrs["fill-opacity"], "undefined") &&
                                    R.is(params["fill-opacity"], "undefined") &&
                                    $(node, {"fill-opacity": attrs["fill-opacity"]});
                            } else if ((({circle: 1, ellipse: 1})[has](o.type) || Str(value).charAt() != "r") && addGradientFill(node, value, o.paper)) {
                                attrs.gradient = value;
                                attrs.fill = "none";
                                break;
                            }
                            clr[has]("opacity") && $(node, {"fill-opacity": clr.opacity > 1 ? clr.opacity / 100 : clr.opacity});
                        case "stroke":
                            clr = R.getRGB(value);
                            node[setAttribute](att, clr.hex);
                            att == "stroke" && clr[has]("opacity") && $(node, {"stroke-opacity": clr.opacity > 1 ? clr.opacity / 100 : clr.opacity});
                            break;
                        case "gradient":
                            (({circle: 1, ellipse: 1})[has](o.type) || Str(value).charAt() != "r") && addGradientFill(node, value, o.paper);
                            break;
                        case "opacity":
                            if (attrs.gradient && !attrs[has]("stroke-opacity")) {
                                $(node, {"stroke-opacity": value > 1 ? value / 100 : value});
                            }
                            // fall
                        case "fill-opacity":
                            if (attrs.gradient) {
                                var gradient = doc.getElementById(node.getAttribute(fillString)[rp](/^url\(#|\)$/g, E));
                                if (gradient) {
                                    var stops = gradient.getElementsByTagName("stop");
                                    stops[stops[length] - 1][setAttribute]("stop-opacity", value);
                                }
                                break;
                            }
                        default:
                            att == "font-size" && (value = toInt(value, 10) + "px");
                            var cssrule = att[rp](/(\-.)/g, function (w) {
                                return upperCase.call(w.substring(1));
                            });
                            node.style[cssrule] = value;
                            // Need following line for Firefox
                            node[setAttribute](att, value);
                            break;
                    }
                }
            }
            
            tuneText(o, params);
            if (rotxy) {
                o.rotate(rotxy.join(S));
            } else {
                toFloat(rot) && o.rotate(rot, true);
            }
        };
        var leading = 1.2,
        tuneText = function (el, params) {
            if (el.type != "text" || !(params[has]("text") || params[has]("font") || params[has]("font-size") || params[has]("x") || params[has]("y"))) {
                return;
            }
            var a = el.attrs,
                node = el.node,
                fontSize = node.firstChild ? toInt(doc.defaultView.getComputedStyle(node.firstChild, E).getPropertyValue("font-size"), 10) : 10;
 
            if (params[has]("text")) {
                a.text = params.text;
                while (node.firstChild) {
                    node.removeChild(node.firstChild);
                }
                var texts = Str(params.text)[split]("\n");
                for (var i = 0, ii = texts[length]; i < ii; i++) if (texts[i]) {
                    var tspan = $("tspan");
                    i && $(tspan, {dy: fontSize * leading, x: a.x});
                    tspan[appendChild](doc.createTextNode(texts[i]));
                    node[appendChild](tspan);
                }
            } else {
                texts = node.getElementsByTagName("tspan");
                for (i = 0, ii = texts[length]; i < ii; i++) {
                    i && $(texts[i], {dy: fontSize * leading, x: a.x});
                }
            }
            $(node, {y: a.y});
            var bb = el.getBBox(),
                dif = a.y - (bb.y + bb.height / 2);
            dif && R.is(dif, "finite") && $(node, {y: a.y + dif});
        },
        Element = function (node, svg) {
            var X = 0,
                Y = 0;
            this[0] = node;
            this.id = R._oid++;
            this.node = node;
            node.raphael = this;
            this.paper = svg;
            this.attrs = this.attrs || {};
            this.transformations = []; // rotate, translate, scale
            this._ = {
                tx: 0,
                ty: 0,
                rt: {deg: 0, cx: 0, cy: 0},
                sx: 1,
                sy: 1
            };
            !svg.bottom && (svg.bottom = this);
            this.prev = svg.top;
            svg.top && (svg.top.next = this);
            svg.top = this;
            this.next = null;
        };
        var elproto = Element[proto];
        Element[proto].rotate = function (deg, cx, cy) {
            if (this.removed) {
                return this;
            }
            if (deg == null) {
                if (this._.rt.cx) {
                    return [this._.rt.deg, this._.rt.cx, this._.rt.cy][join](S);
                }
                return this._.rt.deg;
            }
            var bbox = this.getBBox();
            deg = Str(deg)[split](separator);
            if (deg[length] - 1) {
                cx = toFloat(deg[1]);
                cy = toFloat(deg[2]);
            }
            deg = toFloat(deg[0]);
            if (cx != null && cx !== false) {
                this._.rt.deg = deg;
            } else {
                this._.rt.deg += deg;
            }
            (cy == null) && (cx = null);
            this._.rt.cx = cx;
            this._.rt.cy = cy;
            cx = cx == null ? bbox.x + bbox.width / 2 : cx;
            cy = cy == null ? bbox.y + bbox.height / 2 : cy;
            if (this._.rt.deg) {
                this.transformations[0] = R.format("rotate({0} {1} {2})", this._.rt.deg, cx, cy);
                this.clip && $(this.clip, {transform: R.format("rotate({0} {1} {2})", -this._.rt.deg, cx, cy)});
            } else {
                this.transformations[0] = E;
                this.clip && $(this.clip, {transform: E});
            }
            $(this.node, {transform: this.transformations[join](S)});
            return this;
        };
        Element[proto].hide = function () {
            !this.removed && (this.node.style.display = "none");
            return this;
        };
        Element[proto].show = function () {
            !this.removed && (this.node.style.display = "");
            return this;
        };
        Element[proto].remove = function () {
            if (this.removed) {
                return;
            }
            tear(this, this.paper);
            this.node.parentNode.removeChild(this.node);
            for (var i in this) {
                delete this[i];
            }
            this.removed = true;
        };
        Element[proto].getBBox = function () {
            if (this.removed) {
                return this;
            }
            if (this.type == "path") {
                return pathDimensions(this.attrs.path);
            }
            if (this.node.style.display == "none") {
                this.show();
                var hide = true;
            }
            var bbox = {};
            try {
                bbox = this.node.getBBox();
            } catch(e) {
                // Firefox 3.0.x plays badly here
            } finally {
                bbox = bbox || {};
            }
            if (this.type == "text") {
                bbox = {x: bbox.x, y: Infinity, width: 0, height: 0};
                for (var i = 0, ii = this.node.getNumberOfChars(); i < ii; i++) {
                    var bb = this.node.getExtentOfChar(i);
                    (bb.y < bbox.y) && (bbox.y = bb.y);
                    (bb.y + bb.height - bbox.y > bbox.height) && (bbox.height = bb.y + bb.height - bbox.y);
                    (bb.x + bb.width - bbox.x > bbox.width) && (bbox.width = bb.x + bb.width - bbox.x);
                }
            }
            hide && this.hide();
            return bbox;
        };
        Element[proto].attr = function (name, value) {
            if (this.removed) {
                return this;
            }
            if (name == null) {
                var res = {};
                for (var i in this.attrs) if (this.attrs[has](i)) {
                    res[i] = this.attrs[i];
                }
                this._.rt.deg && (res.rotation = this.rotate());
                (this._.sx != 1 || this._.sy != 1) && (res.scale = this.scale());
                res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
                return res;
            }
            if (value == null && R.is(name, string)) {
                if (name == "translation") {
                    return translate.call(this);
                }
                if (name == "rotation") {
                    return this.rotate();
                }
                if (name == "scale") {
                    return this.scale();
                }
                if (name == fillString && this.attrs.fill == "none" && this.attrs.gradient) {
                    return this.attrs.gradient;
                }
                return this.attrs[name];
            }
            if (value == null && R.is(name, array)) {
                var values = {};
                for (var j = 0, jj = name.length; j < jj; j++) {
                    values[name[j]] = this.attr(name[j]);
                }
                return values;
            }
            if (value != null) {
                var params = {};
                params[name] = value;
            } else if (name != null && R.is(name, "object")) {
                params = name;
            }
            for (var key in this.paper.customAttributes) if (this.paper.customAttributes[has](key) && params[has](key) && R.is(this.paper.customAttributes[key], "function")) {
                var par = this.paper.customAttributes[key].apply(this, [][concat](params[key]));
                this.attrs[key] = params[key];
                for (var subkey in par) if (par[has](subkey)) {
                    params[subkey] = par[subkey];
                }
            }
            setFillAndStroke(this, params);
            return this;
        };
        Element[proto].toFront = function () {
            if (this.removed) {
                return this;
            }
            this.node.parentNode[appendChild](this.node);
            var svg = this.paper;
            svg.top != this && tofront(this, svg);
            return this;
        };
        Element[proto].toBack = function () {
            if (this.removed) {
                return this;
            }
            if (this.node.parentNode.firstChild != this.node) {
                this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild);
                toback(this, this.paper);
                var svg = this.paper;
            }
            return this;
        };
        Element[proto].insertAfter = function (element) {
            if (this.removed) {
                return this;
            }
            var node = element.node || element[element.length - 1].node;
            if (node.nextSibling) {
                node.parentNode.insertBefore(this.node, node.nextSibling);
            } else {
                node.parentNode[appendChild](this.node);
            }
            insertafter(this, element, this.paper);
            return this;
        };
        Element[proto].insertBefore = function (element) {
            if (this.removed) {
                return this;
            }
            var node = element.node || element[0].node;
            node.parentNode.insertBefore(this.node, node);
            insertbefore(this, element, this.paper);
            return this;
        };
        Element[proto].blur = function (size) {
            // Experimental. No Safari support. Use it on your own risk.
            var t = this;
            if (+size !== 0) {
                var fltr = $("filter"),
                    blur = $("feGaussianBlur");
                t.attrs.blur = size;
                fltr.id = createUUID();
                $(blur, {stdDeviation: +size || 1.5});
                fltr.appendChild(blur);
                t.paper.defs.appendChild(fltr);
                t._blur = fltr;
                $(t.node, {filter: "url(#" + fltr.id + ")"});
            } else {
                if (t._blur) {
                    t._blur.parentNode.removeChild(t._blur);
                    delete t._blur;
                    delete t.attrs.blur;
                }
                t.node.removeAttribute("filter");
            }
        };
        var theCircle = function (svg, x, y, r) {
            var el = $("circle");
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {cx: x, cy: y, r: r, fill: "none", stroke: "#000"};
            res.type = "circle";
            $(el, res.attrs);
            return res;
        },
        theRect = function (svg, x, y, w, h, r) {
            var el = $("rect");
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, width: w, height: h, r: r || 0, rx: r || 0, ry: r || 0, fill: "none", stroke: "#000"};
            res.type = "rect";
            $(el, res.attrs);
            return res;
        },
        theEllipse = function (svg, x, y, rx, ry) {
            var el = $("ellipse");
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {cx: x, cy: y, rx: rx, ry: ry, fill: "none", stroke: "#000"};
            res.type = "ellipse";
            $(el, res.attrs);
            return res;
        },
        theImage = function (svg, src, x, y, w, h) {
            var el = $("image");
            $(el, {x: x, y: y, width: w, height: h, preserveAspectRatio: "none"});
            el.setAttributeNS(svg.xlink, "href", src);
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, width: w, height: h, src: src};
            res.type = "image";
            return res;
        },
        theText = function (svg, x, y, text) {
            var el = $("text");
            $(el, {x: x, y: y, "text-anchor": "middle"});
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, "text-anchor": "middle", text: text, font: availableAttrs.font, stroke: "none", fill: "#000"};
            res.type = "text";
            setFillAndStroke(res, res.attrs);
            return res;
        },
        setSize = function (width, height) {
            this.width = width || this.width;
            this.height = height || this.height;
            this.canvas[setAttribute]("width", this.width);
            this.canvas[setAttribute]("height", this.height);
            return this;
        },
        create = function () {
            var con = getContainer[apply](0, arguments),
                container = con && con.container,
                x = con.x,
                y = con.y,
                width = con.width,
                height = con.height;
            if (!container) {
                throw new Error("SVG container not found.");
            }
            var cnvs = $("svg");
            x = x || 0;
            y = y || 0;
            width = width || 512;
            height = height || 342;
            $(cnvs, {
                xmlns: "http://www.w3.org/2000/svg",
                version: 1.1,
                width: width,
                height: height
            });
            if (container == 1) {
                cnvs.style.cssText = "position:absolute;left:" + x + "px;top:" + y + "px";
                doc.body[appendChild](cnvs);
            } else {
                if (container.firstChild) {
                    container.insertBefore(cnvs, container.firstChild);
                } else {
                    container[appendChild](cnvs);
                }
            }
            container = new Paper;
            container.width = width;
            container.height = height;
            container.canvas = cnvs;
            plugins.call(container, container, R.fn);
            container.clear();
            return container;
        };
        paperproto.clear = function () {
            var c = this.canvas;
            while (c.firstChild) {
                c.removeChild(c.firstChild);
            }
            this.bottom = this.top = null;
            (this.desc = $("desc"))[appendChild](doc.createTextNode("Created with Rapha\xebl"));
            c[appendChild](this.desc);
            c[appendChild](this.defs = $("defs"));
        };
        paperproto.remove = function () {
            this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
            for (var i in this) {
                this[i] = removed(i);
            }
        };
    }

    // VML
    if (R.vml) {
        var map = {M: "m", L: "l", C: "c", Z: "x", m: "t", l: "r", c: "v", z: "x"},
            bites = /([clmz]),?([^clmz]*)/gi,
            blurregexp = / progid:\S+Blur\([^\)]+\)/g,
            val = /-?[^,\s-]+/g,
            coordsize = 1e3 + S + 1e3,
            zoom = 10,
            pathlike = {path: 1, rect: 1},
            path2vml = function (path) {
                var total =  /[ahqstv]/ig,
                    command = pathToAbsolute;
                Str(path).match(total) && (command = path2curve);
                total = /[clmz]/g;
                if (command == pathToAbsolute && !Str(path).match(total)) {
                    var res = Str(path)[rp](bites, function (all, command, args) {
                        var vals = [],
                            isMove = lowerCase.call(command) == "m",
                            res = map[command];
                        args[rp](val, function (value) {
                            if (isMove && vals[length] == 2) {
                                res += vals + map[command == "m" ? "l" : "L"];
                                vals = [];
                            }
                            vals[push](round(value * zoom));
                        });
                        return res + vals;
                    });
                    return res;
                }
                var pa = command(path), p, r;
                res = [];
                for (var i = 0, ii = pa[length]; i < ii; i++) {
                    p = pa[i];
                    r = lowerCase.call(pa[i][0]);
                    r == "z" && (r = "x");
                    for (var j = 1, jj = p[length]; j < jj; j++) {
                        r += round(p[j] * zoom) + (j != jj - 1 ? "," : E);
                    }
                    res[push](r);
                }
                return res[join](S);
            };
        
        R[toString] = function () {
            return  "Your browser doesn\u2019t support SVG. Falling down to VML.\nYou are running Rapha\xebl " + this.version;
        };
        thePath = function (pathString, vml) {
            var g = createNode("group");
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = vml.coordsize;
            g.coordorigin = vml.coordorigin;
            var el = createNode("shape"), ol = el.style;
            ol.width = vml.width + "px";
            ol.height = vml.height + "px";
            el.coordsize = coordsize;
            el.coordorigin = vml.coordorigin;
            g[appendChild](el);
            var p = new Element(el, g, vml),
                attr = {fill: "none", stroke: "#000"};
            pathString && (attr.path = pathString);
            p.type = "path";
            p.path = [];
            p.Path = E;
            setFillAndStroke(p, attr);
            vml.canvas[appendChild](g);
            return p;
        };
        setFillAndStroke = function (o, params) {
            o.attrs = o.attrs || {};
            var node = o.node,
                a = o.attrs,
                s = node.style,
                xy,
                newpath = (params.x != a.x || params.y != a.y || params.width != a.width || params.height != a.height || params.r != a.r) && o.type == "rect",
                res = o;

            for (var par in params) if (params[has](par)) {
                a[par] = params[par];
            }
            if (newpath) {
                a.path = rectPath(a.x, a.y, a.width, a.height, a.r);
                o.X = a.x;
                o.Y = a.y;
                o.W = a.width;
                o.H = a.height;
            }
            params.href && (node.href = params.href);
            params.title && (node.title = params.title);
            params.target && (node.target = params.target);
            params.cursor && (s.cursor = params.cursor);
            "blur" in params && o.blur(params.blur);
            if (params.path && o.type == "path" || newpath) {
                node.path = path2vml(a.path);
            }
            if (params.rotation != null) {
                o.rotate(params.rotation, true);
            }
            if (params.translation) {
                xy = Str(params.translation)[split](separator);
                translate.call(o, xy[0], xy[1]);
                if (o._.rt.cx != null) {
                    o._.rt.cx +=+ xy[0];
                    o._.rt.cy +=+ xy[1];
                    o.setBox(o.attrs, xy[0], xy[1]);
                }
            }
            if (params.scale) {
                xy = Str(params.scale)[split](separator);
                o.scale(+xy[0] || 1, +xy[1] || +xy[0] || 1, +xy[2] || null, +xy[3] || null);
            }
            if ("clip-rect" in params) {
                var rect = Str(params["clip-rect"])[split](separator);
                if (rect[length] == 4) {
                    rect[2] = +rect[2] + (+rect[0]);
                    rect[3] = +rect[3] + (+rect[1]);
                    var div = node.clipRect || doc.createElement("div"),
                        dstyle = div.style,
                        group = node.parentNode;
                    dstyle.clip = R.format("rect({1}px {2}px {3}px {0}px)", rect);
                    if (!node.clipRect) {
                        dstyle.position = "absolute";
                        dstyle.top = 0;
                        dstyle.left = 0;
                        dstyle.width = o.paper.width + "px";
                        dstyle.height = o.paper.height + "px";
                        group.parentNode.insertBefore(div, group);
                        div[appendChild](group);
                        node.clipRect = div;
                    }
                }
                if (!params["clip-rect"]) {
                    node.clipRect && (node.clipRect.style.clip = E);
                }
            }
            if (o.type == "image" && params.src) {
                node.src = params.src;
            }
            if (o.type == "image" && params.opacity) {
                node.filterOpacity = ms + ".Alpha(opacity=" + (params.opacity * 100) + ")";
                s.filter = (node.filterMatrix || E) + (node.filterOpacity || E);
            }
            params.font && (s.font = params.font);
            params["font-family"] && (s.fontFamily = '"' + params["font-family"][split](",")[0][rp](/^['"]+|['"]+$/g, E) + '"');
            params["font-size"] && (s.fontSize = params["font-size"]);
            params["font-weight"] && (s.fontWeight = params["font-weight"]);
            params["font-style"] && (s.fontStyle = params["font-style"]);
            if (params.opacity != null || 
                params["stroke-width"] != null ||
                params.fill != null ||
                params.stroke != null ||
                params["stroke-width"] != null ||
                params["stroke-opacity"] != null ||
                params["fill-opacity"] != null ||
                params["stroke-dasharray"] != null ||
                params["stroke-miterlimit"] != null ||
                params["stroke-linejoin"] != null ||
                params["stroke-linecap"] != null) {
                node = o.shape || node;
                var fill = (node.getElementsByTagName(fillString) && node.getElementsByTagName(fillString)[0]),
                    newfill = false;
                !fill && (newfill = fill = createNode(fillString));
                if ("fill-opacity" in params || "opacity" in params) {
                    var opacity = ((+a["fill-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+R.getRGB(params.fill).o + 1 || 2) - 1);
                    opacity = mmin(mmax(opacity, 0), 1);
                    fill.opacity = opacity;
                }
                params.fill && (fill.on = true);
                if (fill.on == null || params.fill == "none") {
                    fill.on = false;
                }
                if (fill.on && params.fill) {
                    var isURL = params.fill.match(ISURL);
                    if (isURL) {
                        fill.src = isURL[1];
                        fill.type = "tile";
                    } else {
                        fill.color = R.getRGB(params.fill).hex;
                        fill.src = E;
                        fill.type = "solid";
                        if (R.getRGB(params.fill).error && (res.type in {circle: 1, ellipse: 1} || Str(params.fill).charAt() != "r") && addGradientFill(res, params.fill)) {
                            a.fill = "none";
                            a.gradient = params.fill;
                        }
                    }
                }
                newfill && node[appendChild](fill);
                var stroke = (node.getElementsByTagName("stroke") && node.getElementsByTagName("stroke")[0]),
                newstroke = false;
                !stroke && (newstroke = stroke = createNode("stroke"));
                if ((params.stroke && params.stroke != "none") ||
                    params["stroke-width"] ||
                    params["stroke-opacity"] != null ||
                    params["stroke-dasharray"] ||
                    params["stroke-miterlimit"] ||
                    params["stroke-linejoin"] ||
                    params["stroke-linecap"]) {
                    stroke.on = true;
                }
                (params.stroke == "none" || stroke.on == null || params.stroke == 0 || params["stroke-width"] == 0) && (stroke.on = false);
                var strokeColor = R.getRGB(params.stroke);
                stroke.on && params.stroke && (stroke.color = strokeColor.hex);
                opacity = ((+a["stroke-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+strokeColor.o + 1 || 2) - 1);
                var width = (toFloat(params["stroke-width"]) || 1) * .75;
                opacity = mmin(mmax(opacity, 0), 1);
                params["stroke-width"] == null && (width = a["stroke-width"]);
                params["stroke-width"] && (stroke.weight = width);
                width && width < 1 && (opacity *= width) && (stroke.weight = 1);
                stroke.opacity = opacity;
                
                params["stroke-linejoin"] && (stroke.joinstyle = params["stroke-linejoin"] || "miter");
                stroke.miterlimit = params["stroke-miterlimit"] || 8;
                params["stroke-linecap"] && (stroke.endcap = params["stroke-linecap"] == "butt" ? "flat" : params["stroke-linecap"] == "square" ? "square" : "round");
                if (params["stroke-dasharray"]) {
                    var dasharray = {
                        "-": "shortdash",
                        ".": "shortdot",
                        "-.": "shortdashdot",
                        "-..": "shortdashdotdot",
                        ". ": "dot",
                        "- ": "dash",
                        "--": "longdash",
                        "- .": "dashdot",
                        "--.": "longdashdot",
                        "--..": "longdashdotdot"
                    };
                    stroke.dashstyle = dasharray[has](params["stroke-dasharray"]) ? dasharray[params["stroke-dasharray"]] : E;
                }
                newstroke && node[appendChild](stroke);
            }
            if (res.type == "text") {
                s = res.paper.span.style;
                a.font && (s.font = a.font);
                a["font-family"] && (s.fontFamily = a["font-family"]);
                a["font-size"] && (s.fontSize = a["font-size"]);
                a["font-weight"] && (s.fontWeight = a["font-weight"]);
                a["font-style"] && (s.fontStyle = a["font-style"]);
                res.node.string && (res.paper.span.innerHTML = Str(res.node.string)[rp](/</g, "&#60;")[rp](/&/g, "&#38;")[rp](/\n/g, "<br>"));
                res.W = a.w = res.paper.span.offsetWidth;
                res.H = a.h = res.paper.span.offsetHeight;
                res.X = a.x;
                res.Y = a.y + round(res.H / 2);
 
                // text-anchor emulationm
                switch (a["text-anchor"]) {
                    case "start":
                        res.node.style["v-text-align"] = "left";
                        res.bbx = round(res.W / 2);
                    break;
                    case "end":
                        res.node.style["v-text-align"] = "right";
                        res.bbx = -round(res.W / 2);
                    break;
                    default:
                        res.node.style["v-text-align"] = "center";
                    break;
                }
            }
        };
        addGradientFill = function (o, gradient) {
            o.attrs = o.attrs || {};
            var attrs = o.attrs,
                fill,
                type = "linear",
                fxfy = ".5 .5";
            o.attrs.gradient = gradient;
            gradient = Str(gradient)[rp](radial_gradient, function (all, fx, fy) {
                type = "radial";
                if (fx && fy) {
                    fx = toFloat(fx);
                    fy = toFloat(fy);
                    pow(fx - .5, 2) + pow(fy - .5, 2) > .25 && (fy = math.sqrt(.25 - pow(fx - .5, 2)) * ((fy > .5) * 2 - 1) + .5);
                    fxfy = fx + S + fy;
                }
                return E;
            });
            gradient = gradient[split](/\s*\-\s*/);
            if (type == "linear") {
                var angle = gradient.shift();
                angle = -toFloat(angle);
                if (isNaN(angle)) {
                    return null;
                }
            }
            var dots = parseDots(gradient);
            if (!dots) {
                return null;
            }
            o = o.shape || o.node;
            fill = o.getElementsByTagName(fillString)[0] || createNode(fillString);
            !fill.parentNode && o.appendChild(fill);
            if (dots[length]) {
                fill.on = true;
                fill.method = "none";
                fill.color = dots[0].color;
                fill.color2 = dots[dots[length] - 1].color;
                var clrs = [];
                for (var i = 0, ii = dots[length]; i < ii; i++) {
                    dots[i].offset && clrs[push](dots[i].offset + S + dots[i].color);
                }
                fill.colors && (fill.colors.value = clrs[length] ? clrs[join]() : "0% " + fill.color);
                if (type == "radial") {
                    fill.type = "gradientradial";
                    fill.focus = "100%";
                    fill.focussize = fxfy;
                    fill.focusposition = fxfy;
                } else {
                    fill.type = "gradient";
                    fill.angle = (270 - angle) % 360;
                }
            }
            return 1;
        };
        Element = function (node, group, vml) {
            var Rotation = 0,
                RotX = 0,
                RotY = 0,
                Scale = 1;
            this[0] = node;
            this.id = R._oid++;
            this.node = node;
            node.raphael = this;
            this.X = 0;
            this.Y = 0;
            this.attrs = {};
            this.Group = group;
            this.paper = vml;
            this._ = {
                tx: 0,
                ty: 0,
                rt: {deg:0},
                sx: 1,
                sy: 1
            };
            !vml.bottom && (vml.bottom = this);
            this.prev = vml.top;
            vml.top && (vml.top.next = this);
            vml.top = this;
            this.next = null;
        };
        elproto = Element[proto];
        elproto.rotate = function (deg, cx, cy) {
            if (this.removed) {
                return this;
            }
            if (deg == null) {
                if (this._.rt.cx) {
                    return [this._.rt.deg, this._.rt.cx, this._.rt.cy][join](S);
                }
                return this._.rt.deg;
            }
            deg = Str(deg)[split](separator);
            if (deg[length] - 1) {
                cx = toFloat(deg[1]);
                cy = toFloat(deg[2]);
            }
            deg = toFloat(deg[0]);
            if (cx != null) {
                this._.rt.deg = deg;
            } else {
                this._.rt.deg += deg;
            }
            cy == null && (cx = null);
            this._.rt.cx = cx;
            this._.rt.cy = cy;
            this.setBox(this.attrs, cx, cy);
            this.Group.style.rotation = this._.rt.deg;
            // gradient fix for rotation. TODO
            // var fill = (this.shape || this.node).getElementsByTagName(fillString);
            // fill = fill[0] || {};
            // var b = ((360 - this._.rt.deg) - 270) % 360;
            // !R.is(fill.angle, "undefined") && (fill.angle = b);
            return this;
        };
        elproto.setBox = function (params, cx, cy) {
            if (this.removed) {
                return this;
            }
            var gs = this.Group.style,
                os = (this.shape && this.shape.style) || this.node.style;
            params = params || {};
            for (var i in params) if (params[has](i)) {
                this.attrs[i] = params[i];
            }
            cx = cx || this._.rt.cx;
            cy = cy || this._.rt.cy;
            var attr = this.attrs,
                x,
                y,
                w,
                h;
            switch (this.type) {
                case "circle":
                    x = attr.cx - attr.r;
                    y = attr.cy - attr.r;
                    w = h = attr.r * 2;
                    break;
                case "ellipse":
                    x = attr.cx - attr.rx;
                    y = attr.cy - attr.ry;
                    w = attr.rx * 2;
                    h = attr.ry * 2;
                    break;
                case "image":
                    x = +attr.x;
                    y = +attr.y;
                    w = attr.width || 0;
                    h = attr.height || 0;
                    break;
                case "text":
                    this.textpath.v = ["m", round(attr.x), ", ", round(attr.y - 2), "l", round(attr.x) + 1, ", ", round(attr.y - 2)][join](E);
                    x = attr.x - round(this.W / 2);
                    y = attr.y - this.H / 2;
                    w = this.W;
                    h = this.H;
                    break;
                case "rect":
                case "path":
                    if (!this.attrs.path) {
                        x = 0;
                        y = 0;
                        w = this.paper.width;
                        h = this.paper.height;
                    } else {
                        var dim = pathDimensions(this.attrs.path);
                        x = dim.x;
                        y = dim.y;
                        w = dim.width;
                        h = dim.height;
                    }
                    break;
                default:
                    x = 0;
                    y = 0;
                    w = this.paper.width;
                    h = this.paper.height;
                    break;
            }
            cx = (cx == null) ? x + w / 2 : cx;
            cy = (cy == null) ? y + h / 2 : cy;
            var left = cx - this.paper.width / 2,
                top = cy - this.paper.height / 2, t;
            gs.left != (t = left + "px") && (gs.left = t);
            gs.top != (t = top + "px") && (gs.top = t);
            this.X = pathlike[has](this.type) ? -left : x;
            this.Y = pathlike[has](this.type) ? -top : y;
            this.W = w;
            this.H = h;
            if (pathlike[has](this.type)) {
                os.left != (t = -left * zoom + "px") && (os.left = t);
                os.top != (t = -top * zoom + "px") && (os.top = t);
            } else if (this.type == "text") {
                os.left != (t = -left + "px") && (os.left = t);
                os.top != (t = -top + "px") && (os.top = t);
            } else {
                gs.width != (t = this.paper.width + "px") && (gs.width = t);
                gs.height != (t = this.paper.height + "px") && (gs.height = t);
                os.left != (t = x - left + "px") && (os.left = t);
                os.top != (t = y - top + "px") && (os.top = t);
                os.width != (t = w + "px") && (os.width = t);
                os.height != (t = h + "px") && (os.height = t);
            }
        };
        elproto.hide = function () {
            !this.removed && (this.Group.style.display = "none");
            return this;
        };
        elproto.show = function () {
            !this.removed && (this.Group.style.display = "block");
            return this;
        };
        elproto.getBBox = function () {
            if (this.removed) {
                return this;
            }
            if (pathlike[has](this.type)) {
                return pathDimensions(this.attrs.path);
            }
            return {
                x: this.X + (this.bbx || 0),
                y: this.Y,
                width: this.W,
                height: this.H
            };
        };
        elproto.remove = function () {
            if (this.removed) {
                return;
            }
            tear(this, this.paper);
            this.node.parentNode.removeChild(this.node);
            this.Group.parentNode.removeChild(this.Group);
            this.shape && this.shape.parentNode.removeChild(this.shape);
            for (var i in this) {
                delete this[i];
            }
            this.removed = true;
        };
        elproto.attr = function (name, value) {
            if (this.removed) {
                return this;
            }
            if (name == null) {
                var res = {};
                for (var i in this.attrs) if (this.attrs[has](i)) {
                    res[i] = this.attrs[i];
                }
                this._.rt.deg && (res.rotation = this.rotate());
                (this._.sx != 1 || this._.sy != 1) && (res.scale = this.scale());
                res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
                return res;
            }
            if (value == null && R.is(name, "string")) {
                if (name == "translation") {
                    return translate.call(this);
                }
                if (name == "rotation") {
                    return this.rotate();
                }
                if (name == "scale") {
                    return this.scale();
                }
                if (name == fillString && this.attrs.fill == "none" && this.attrs.gradient) {
                    return this.attrs.gradient;
                }
                return this.attrs[name];
            }
            if (this.attrs && value == null && R.is(name, array)) {
                var ii, values = {};
                for (i = 0, ii = name[length]; i < ii; i++) {
                    values[name[i]] = this.attr(name[i]);
                }
                return values;
            }
            var params;
            if (value != null) {
                params = {};
                params[name] = value;
            }
            value == null && R.is(name, "object") && (params = name);
            if (params) {
                for (var key in this.paper.customAttributes) if (this.paper.customAttributes[has](key) && params[has](key) && R.is(this.paper.customAttributes[key], "function")) {
                    var par = this.paper.customAttributes[key].apply(this, [][concat](params[key]));
                    this.attrs[key] = params[key];
                    for (var subkey in par) if (par[has](subkey)) {
                        params[subkey] = par[subkey];
                    }
                }
                if (params.text && this.type == "text") {
                    this.node.string = params.text;
                }
                setFillAndStroke(this, params);
                if (params.gradient && (({circle: 1, ellipse: 1})[has](this.type) || Str(params.gradient).charAt() != "r")) {
                    addGradientFill(this, params.gradient);
                }
                (!pathlike[has](this.type) || this._.rt.deg) && this.setBox(this.attrs);
            }
            return this;
        };
        elproto.toFront = function () {
            !this.removed && this.Group.parentNode[appendChild](this.Group);
            this.paper.top != this && tofront(this, this.paper);
            return this;
        };
        elproto.toBack = function () {
            if (this.removed) {
                return this;
            }
            if (this.Group.parentNode.firstChild != this.Group) {
                this.Group.parentNode.insertBefore(this.Group, this.Group.parentNode.firstChild);
                toback(this, this.paper);
            }
            return this;
        };
        elproto.insertAfter = function (element) {
            if (this.removed) {
                return this;
            }
            if (element.constructor == Set) {
                element = element[element.length - 1];
            }
            if (element.Group.nextSibling) {
                element.Group.parentNode.insertBefore(this.Group, element.Group.nextSibling);
            } else {
                element.Group.parentNode[appendChild](this.Group);
            }
            insertafter(this, element, this.paper);
            return this;
        };
        elproto.insertBefore = function (element) {
            if (this.removed) {
                return this;
            }
            if (element.constructor == Set) {
                element = element[0];
            }
            element.Group.parentNode.insertBefore(this.Group, element.Group);
            insertbefore(this, element, this.paper);
            return this;
        };
        elproto.blur = function (size) {
            var s = this.node.runtimeStyle,
                f = s.filter;
            f = f.replace(blurregexp, E);
            if (+size !== 0) {
                this.attrs.blur = size;
                s.filter = f + S + ms + ".Blur(pixelradius=" + (+size || 1.5) + ")";
                s.margin = R.format("-{0}px 0 0 -{0}px", round(+size || 1.5));
            } else {
                s.filter = f;
                s.margin = 0;
                delete this.attrs.blur;
            }
        };
 
        theCircle = function (vml, x, y, r) {
            var g = createNode("group"),
                o = createNode("oval"),
                ol = o.style;
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = coordsize;
            g.coordorigin = vml.coordorigin;
            g[appendChild](o);
            var res = new Element(o, g, vml);
            res.type = "circle";
            setFillAndStroke(res, {stroke: "#000", fill: "none"});
            res.attrs.cx = x;
            res.attrs.cy = y;
            res.attrs.r = r;
            res.setBox({x: x - r, y: y - r, width: r * 2, height: r * 2});
            vml.canvas[appendChild](g);
            return res;
        };
        function rectPath(x, y, w, h, r) {
            if (r) {
                return R.format("M{0},{1}l{2},0a{3},{3},0,0,1,{3},{3}l0,{5}a{3},{3},0,0,1,{4},{3}l{6},0a{3},{3},0,0,1,{4},{4}l0,{7}a{3},{3},0,0,1,{3},{4}z", x + r, y, w - r * 2, r, -r, h - r * 2, r * 2 - w, r * 2 - h);
            } else {
                return R.format("M{0},{1}l{2},0,0,{3},{4},0z", x, y, w, h, -w);
            }
        }
        theRect = function (vml, x, y, w, h, r) {
            var path = rectPath(x, y, w, h, r),
                res = vml.path(path),
                a = res.attrs;
            res.X = a.x = x;
            res.Y = a.y = y;
            res.W = a.width = w;
            res.H = a.height = h;
            a.r = r;
            a.path = path;
            res.type = "rect";
            return res;
        };
        theEllipse = function (vml, x, y, rx, ry) {
            var g = createNode("group"),
                o = createNode("oval"),
                ol = o.style;
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = coordsize;
            g.coordorigin = vml.coordorigin;
            g[appendChild](o);
            var res = new Element(o, g, vml);
            res.type = "ellipse";
            setFillAndStroke(res, {stroke: "#000"});
            res.attrs.cx = x;
            res.attrs.cy = y;
            res.attrs.rx = rx;
            res.attrs.ry = ry;
            res.setBox({x: x - rx, y: y - ry, width: rx * 2, height: ry * 2});
            vml.canvas[appendChild](g);
            return res;
        };
        theImage = function (vml, src, x, y, w, h) {
            var g = createNode("group"),
                o = createNode("image");
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = coordsize;
            g.coordorigin = vml.coordorigin;
            o.src = src;
            g[appendChild](o);
            var res = new Element(o, g, vml);
            res.type = "image";
            res.attrs.src = src;
            res.attrs.x = x;
            res.attrs.y = y;
            res.attrs.w = w;
            res.attrs.h = h;
            res.setBox({x: x, y: y, width: w, height: h});
            vml.canvas[appendChild](g);
            return res;
        };
        theText = function (vml, x, y, text) {
            var g = createNode("group"),
                el = createNode("shape"),
                ol = el.style,
                path = createNode("path"),
                ps = path.style,
                o = createNode("textpath");
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = coordsize;
            g.coordorigin = vml.coordorigin;
            path.v = R.format("m{0},{1}l{2},{1}", round(x * 10), round(y * 10), round(x * 10) + 1);
            path.textpathok = true;
            ol.width = vml.width;
            ol.height = vml.height;
            o.string = Str(text);
            o.on = true;
            el[appendChild](o);
            el[appendChild](path);
            g[appendChild](el);
            var res = new Element(o, g, vml);
            res.shape = el;
            res.textpath = path;
            res.type = "text";
            res.attrs.text = text;
            res.attrs.x = x;
            res.attrs.y = y;
            res.attrs.w = 1;
            res.attrs.h = 1;
            setFillAndStroke(res, {font: availableAttrs.font, stroke: "none", fill: "#000"});
            res.setBox();
            vml.canvas[appendChild](g);
            return res;
        };
        setSize = function (width, height) {
            var cs = this.canvas.style;
            width == +width && (width += "px");
            height == +height && (height += "px");
            cs.width = width;
            cs.height = height;
            cs.clip = "rect(0 " + width + " " + height + " 0)";
            return this;
        };
        var createNode;
        doc.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
        try {
            !doc.namespaces.rvml && doc.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
            createNode = function (tagName) {
                return doc.createElement('<rvml:' + tagName + ' class="rvml">');
            };
        } catch (e) {
            createNode = function (tagName) {
                return doc.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
            };
        }
        create = function () {
            var con = getContainer[apply](0, arguments),
                container = con.container,
                height = con.height,
                s,
                width = con.width,
                x = con.x,
                y = con.y;
            if (!container) {
                throw new Error("VML container not found.");
            }
            var res = new Paper,
                c = res.canvas = doc.createElement("div"),
                cs = c.style;
            x = x || 0;
            y = y || 0;
            width = width || 512;
            height = height || 342;
            width == +width && (width += "px");
            height == +height && (height += "px");
            res.width = 1e3;
            res.height = 1e3;
            res.coordsize = zoom * 1e3 + S + zoom * 1e3;
            res.coordorigin = "0 0";
            res.span = doc.createElement("span");
            res.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
            c[appendChild](res.span);
            cs.cssText = R.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", width, height);
            if (container == 1) {
                doc.body[appendChild](c);
                cs.left = x + "px";
                cs.top = y + "px";
                cs.position = "absolute";
            } else {
                if (container.firstChild) {
                    container.insertBefore(c, container.firstChild);
                } else {
                    container[appendChild](c);
                }
            }
            plugins.call(res, res, R.fn);
            return res;
        };
        paperproto.clear = function () {
            this.canvas.innerHTML = E;
            this.span = doc.createElement("span");
            this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
            this.canvas[appendChild](this.span);
            this.bottom = this.top = null;
        };
        paperproto.remove = function () {
            this.canvas.parentNode.removeChild(this.canvas);
            for (var i in this) {
                this[i] = removed(i);
            }
            return true;
        };
    }
 
    // rest
    // WebKit rendering bug workaround method
    var version = navigator.userAgent.match(/Version\/(.*?)\s/);
    if ((navigator.vendor == "Apple Computer, Inc.") && (version && version[1] < 4 || navigator.platform.slice(0, 2) == "iP")) {
        paperproto.safari = function () {
            var rect = this.rect(-99, -99, this.width + 99, this.height + 99).attr({stroke: "none"});
            win.setTimeout(function () {rect.remove();});
        };
    } else {
        paperproto.safari = function () {};
    }
 
    // Events
    var preventDefault = function () {
        this.returnValue = false;
    },
    preventTouch = function () {
        return this.originalEvent.preventDefault();
    },
    stopPropagation = function () {
        this.cancelBubble = true;
    },
    stopTouch = function () {
        return this.originalEvent.stopPropagation();
    },
    addEvent = (function () {
        if (doc.addEventListener) {
            return function (obj, type, fn, element) {
                var realName = supportsTouch && touchMap[type] ? touchMap[type] : type;
                var f = function (e) {
                    if (supportsTouch && touchMap[has](type)) {
                        for (var i = 0, ii = e.targetTouches && e.targetTouches.length; i < ii; i++) {
                            if (e.targetTouches[i].target == obj) {
                                var olde = e;
                                e = e.targetTouches[i];
                                e.originalEvent = olde;
                                e.preventDefault = preventTouch;
                                e.stopPropagation = stopTouch;
                                break;
                            }
                        }
                    }
                    return fn.call(element, e);
                };
                obj.addEventListener(realName, f, false);
                return function () {
                    obj.removeEventListener(realName, f, false);
                    return true;
                };
            };
        } else if (doc.attachEvent) {
            return function (obj, type, fn, element) {
                var f = function (e) {
                    e = e || win.event;
                    e.preventDefault = e.preventDefault || preventDefault;
                    e.stopPropagation = e.stopPropagation || stopPropagation;
                    return fn.call(element, e);
                };
                obj.attachEvent("on" + type, f);
                var detacher = function () {
                    obj.detachEvent("on" + type, f);
                    return true;
                };
                return detacher;
            };
        }
    })(),
    drag = [],
    dragMove = function (e) {
        var x = e.clientX,
            y = e.clientY,
            scrollY = doc.documentElement.scrollTop || doc.body.scrollTop,
            scrollX = doc.documentElement.scrollLeft || doc.body.scrollLeft,
            dragi,
            j = drag.length;
        while (j--) {
            dragi = drag[j];
            if (supportsTouch) {
                var i = e.touches.length,
                    touch;
                while (i--) {
                    touch = e.touches[i];
                    if (touch.identifier == dragi.el._drag.id) {
                        x = touch.clientX;
                        y = touch.clientY;
                        (e.originalEvent ? e.originalEvent : e).preventDefault();
                        break;
                    }
                }
            } else {
                e.preventDefault();
            }
            x += scrollX;
            y += scrollY;
            dragi.move && dragi.move.call(dragi.move_scope || dragi.el, x - dragi.el._drag.x, y - dragi.el._drag.y, x, y, e);
        }
    },
    dragUp = function (e) {
        R.unmousemove(dragMove).unmouseup(dragUp);
        var i = drag.length,
            dragi;
        while (i--) {
            dragi = drag[i];
            dragi.el._drag = {};
            dragi.end && dragi.end.call(dragi.end_scope || dragi.start_scope || dragi.move_scope || dragi.el, e);
        }
        drag = [];
    };
    for (var i = events[length]; i--;) {
        (function (eventName) {
            R[eventName] = Element[proto][eventName] = function (fn, scope) {
                if (R.is(fn, "function")) {
                    this.events = this.events || [];
                    this.events.push({name: eventName, f: fn, unbind: addEvent(this.shape || this.node || doc, eventName, fn, scope || this)});
                }
                return this;
            };
            R["un" + eventName] = Element[proto]["un" + eventName] = function (fn) {
                var events = this.events,
                    l = events[length];
                while (l--) if (events[l].name == eventName && events[l].f == fn) {
                    events[l].unbind();
                    events.splice(l, 1);
                    !events.length && delete this.events;
                    return this;
                }
                return this;
            };
        })(events[i]);
    }
    elproto.hover = function (f_in, f_out, scope_in, scope_out) {
        return this.mouseover(f_in, scope_in).mouseout(f_out, scope_out || scope_in);
    };
    elproto.unhover = function (f_in, f_out) {
        return this.unmouseover(f_in).unmouseout(f_out);
    };
    elproto.drag = function (onmove, onstart, onend, move_scope, start_scope, end_scope) {
        this._drag = {};
        this.mousedown(function (e) {
            (e.originalEvent || e).preventDefault();
            var scrollY = doc.documentElement.scrollTop || doc.body.scrollTop,
                scrollX = doc.documentElement.scrollLeft || doc.body.scrollLeft;
            this._drag.x = e.clientX + scrollX;
            this._drag.y = e.clientY + scrollY;
            this._drag.id = e.identifier;
            onstart && onstart.call(start_scope || move_scope || this, e.clientX + scrollX, e.clientY + scrollY, e);
            !drag.length && R.mousemove(dragMove).mouseup(dragUp);
            drag.push({el: this, move: onmove, end: onend, move_scope: move_scope, start_scope: start_scope, end_scope: end_scope});
        });
        return this;
    };
    elproto.undrag = function (onmove, onstart, onend) {
        var i = drag.length;
        while (i--) {
            drag[i].el == this && (drag[i].move == onmove && drag[i].end == onend) && drag.splice(i++, 1);
        }
        !drag.length && R.unmousemove(dragMove).unmouseup(dragUp);
    };
    paperproto.circle = function (x, y, r) {
        return theCircle(this, x || 0, y || 0, r || 0);
    };
    paperproto.rect = function (x, y, w, h, r) {
        return theRect(this, x || 0, y || 0, w || 0, h || 0, r || 0);
    };
    paperproto.ellipse = function (x, y, rx, ry) {
        return theEllipse(this, x || 0, y || 0, rx || 0, ry || 0);
    };
    paperproto.path = function (pathString) {
        pathString && !R.is(pathString, string) && !R.is(pathString[0], array) && (pathString += E);
        return thePath(R.format[apply](R, arguments), this);
    };
    paperproto.image = function (src, x, y, w, h) {
        return theImage(this, src || "about:blank", x || 0, y || 0, w || 0, h || 0);
    };
    paperproto.text = function (x, y, text) {
        return theText(this, x || 0, y || 0, Str(text));
    };
    paperproto.set = function (itemsArray) {
        arguments[length] > 1 && (itemsArray = Array[proto].splice.call(arguments, 0, arguments[length]));
        return new Set(itemsArray);
    };
    paperproto.setSize = setSize;
    paperproto.top = paperproto.bottom = null;
    paperproto.raphael = R;
    function x_y() {
        return this.x + S + this.y;
    }
    elproto.resetScale = function () {
        if (this.removed) {
            return this;
        }
        this._.sx = 1;
        this._.sy = 1;
        this.attrs.scale = "1 1";
    };
    elproto.scale = function (x, y, cx, cy) {
        if (this.removed) {
            return this;
        }
        if (x == null && y == null) {
            return {
                x: this._.sx,
                y: this._.sy,
                toString: x_y
            };
        }
        y = y || x;
        !+y && (y = x);
        var dx,
            dy,
            dcx,
            dcy,
            a = this.attrs;
        if (x != 0) {
            var bb = this.getBBox(),
                rcx = bb.x + bb.width / 2,
                rcy = bb.y + bb.height / 2,
                kx = abs(x / this._.sx),
                ky = abs(y / this._.sy);
            cx = (+cx || cx == 0) ? cx : rcx;
            cy = (+cy || cy == 0) ? cy : rcy;
            var posx = this._.sx > 0,
                posy = this._.sy > 0,
                dirx = ~~(x / abs(x)),
                diry = ~~(y / abs(y)),
                dkx = kx * dirx,
                dky = ky * diry,
                s = this.node.style,
                ncx = cx + abs(rcx - cx) * dkx * (rcx > cx == posx ? 1 : -1),
                ncy = cy + abs(rcy - cy) * dky * (rcy > cy == posy ? 1 : -1),
                fr = (x * dirx > y * diry ? ky : kx);
            switch (this.type) {
                case "rect":
                case "image":
                    var neww = a.width * kx,
                        newh = a.height * ky;
                    this.attr({
                        height: newh,
                        r: a.r * fr,
                        width: neww,
                        x: ncx - neww / 2,
                        y: ncy - newh / 2
                    });
                    break;
                case "circle":
                case "ellipse":
                    this.attr({
                        rx: a.rx * kx,
                        ry: a.ry * ky,
                        r: a.r * fr,
                        cx: ncx,
                        cy: ncy
                    });
                    break;
                case "text":
                    this.attr({
                        x: ncx,
                        y: ncy
                    });
                    break;
                case "path":
                    var path = pathToRelative(a.path),
                        skip = true,
                        fx = posx ? dkx : kx,
                        fy = posy ? dky : ky;
                    for (var i = 0, ii = path[length]; i < ii; i++) {
                        var p = path[i],
                            P0 = upperCase.call(p[0]);
                        if (P0 == "M" && skip) {
                            continue;
                        } else {
                            skip = false;
                        }
                        if (P0 == "A") {
                            p[path[i][length] - 2] *= fx;
                            p[path[i][length] - 1] *= fy;
                            p[1] *= kx;
                            p[2] *= ky;
                            p[5] = +(dirx + diry ? !!+p[5] : !+p[5]);
                        } else if (P0 == "H") {
                            for (var j = 1, jj = p[length]; j < jj; j++) {
                                p[j] *= fx;
                            }
                        } else if (P0 == "V") {
                            for (j = 1, jj = p[length]; j < jj; j++) {
                                p[j] *= fy;
                            }
                         } else {
                            for (j = 1, jj = p[length]; j < jj; j++) {
                                p[j] *= (j % 2) ? fx : fy;
                            }
                        }
                    }
                    var dim2 = pathDimensions(path);
                    dx = ncx - dim2.x - dim2.width / 2;
                    dy = ncy - dim2.y - dim2.height / 2;
                    path[0][1] += dx;
                    path[0][2] += dy;
                    this.attr({path: path});
                break;
            }
            if (this.type in {text: 1, image:1} && (dirx != 1 || diry != 1)) {
                if (this.transformations) {
                    this.transformations[2] = "scale("[concat](dirx, ",", diry, ")");
                    this.node[setAttribute]("transform", this.transformations[join](S));
                    dx = (dirx == -1) ? -a.x - (neww || 0) : a.x;
                    dy = (diry == -1) ? -a.y - (newh || 0) : a.y;
                    this.attr({x: dx, y: dy});
                    a.fx = dirx - 1;
                    a.fy = diry - 1;
                } else {
                    this.node.filterMatrix = ms + ".Matrix(M11="[concat](dirx,
                        ", M12=0, M21=0, M22=", diry,
                        ", Dx=0, Dy=0, sizingmethod='auto expand', filtertype='bilinear')");
                    s.filter = (this.node.filterMatrix || E) + (this.node.filterOpacity || E);
                }
            } else {
                if (this.transformations) {
                    this.transformations[2] = E;
                    this.node[setAttribute]("transform", this.transformations[join](S));
                    a.fx = 0;
                    a.fy = 0;
                } else {
                    this.node.filterMatrix = E;
                    s.filter = (this.node.filterMatrix || E) + (this.node.filterOpacity || E);
                }
            }
            a.scale = [x, y, cx, cy][join](S);
            this._.sx = x;
            this._.sy = y;
        }
        return this;
    };
    elproto.clone = function () {
        if (this.removed) {
            return null;
        }
        var attr = this.attr();
        delete attr.scale;
        delete attr.translation;
        return this.paper[this.type]().attr(attr);
    };
    var curveslengths = {},
    getPointAtSegmentLength = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
        var len = 0,
            precision = 100,
            name = [p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y].join(),
            cache = curveslengths[name],
            old, dot;
        !cache && (curveslengths[name] = cache = {data: []});
        cache.timer && clearTimeout(cache.timer);
        cache.timer = setTimeout(function () {delete curveslengths[name];}, 2000);
        if (length != null) {
            var total = getPointAtSegmentLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y);
            precision = ~~total * 10;
        }
        for (var i = 0; i < precision + 1; i++) {
            if (cache.data[length] > i) {
                dot = cache.data[i * precision];
            } else {
                dot = R.findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, i / precision);
                cache.data[i] = dot;
            }
            i && (len += pow(pow(old.x - dot.x, 2) + pow(old.y - dot.y, 2), .5));
            if (length != null && len >= length) {
                return dot;
            }
            old = dot;
        }
        if (length == null) {
            return len;
        }
    },
    getLengthFactory = function (istotal, subpath) {
        return function (path, length, onlystart) {
            path = path2curve(path);
            var x, y, p, l, sp = "", subpaths = {}, point,
                len = 0;
            for (var i = 0, ii = path.length; i < ii; i++) {
                p = path[i];
                if (p[0] == "M") {
                    x = +p[1];
                    y = +p[2];
                } else {
                    l = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                    if (len + l > length) {
                        if (subpath && !subpaths.start) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            sp += ["C", point.start.x, point.start.y, point.m.x, point.m.y, point.x, point.y];
                            if (onlystart) {return sp;}
                            subpaths.start = sp;
                            sp = ["M", point.x, point.y + "C", point.n.x, point.n.y, point.end.x, point.end.y, p[5], p[6]][join]();
                            len += l;
                            x = +p[5];
                            y = +p[6];
                            continue;
                        }
                        if (!istotal && !subpath) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            return {x: point.x, y: point.y, alpha: point.alpha};
                        }
                    }
                    len += l;
                    x = +p[5];
                    y = +p[6];
                }
                sp += p;
            }
            subpaths.end = sp;
            point = istotal ? len : subpath ? subpaths : R.findDotsAtSegment(x, y, p[1], p[2], p[3], p[4], p[5], p[6], 1);
            point.alpha && (point = {x: point.x, y: point.y, alpha: point.alpha});
            return point;
        };
    };
    var getTotalLength = getLengthFactory(1),
        getPointAtLength = getLengthFactory(),
        getSubpathsAtLength = getLengthFactory(0, 1);
    elproto.getTotalLength = function () {
        if (this.type != "path") {return;}
        if (this.node.getTotalLength) {
            return this.node.getTotalLength();
        }
        return getTotalLength(this.attrs.path);
    };
    elproto.getPointAtLength = function (length) {
        if (this.type != "path") {return;}
        return getPointAtLength(this.attrs.path, length);
    };
    elproto.getSubpath = function (from, to) {
        if (this.type != "path") {return;}
        if (abs(this.getTotalLength() - to) < "1e-6") {
            return getSubpathsAtLength(this.attrs.path, from).end;
        }
        var a = getSubpathsAtLength(this.attrs.path, to, 1);
        return from ? getSubpathsAtLength(a, from).end : a;
    };

    // animation easing formulas
    R.easing_formulas = {
        linear: function (n) {
            return n;
        },
        "<": function (n) {
            return pow(n, 3);
        },
        ">": function (n) {
            return pow(n - 1, 3) + 1;
        },
        "<>": function (n) {
            n = n * 2;
            if (n < 1) {
                return pow(n, 3) / 2;
            }
            n -= 2;
            return (pow(n, 3) + 2) / 2;
        },
        backIn: function (n) {
            var s = 1.70158;
            return n * n * ((s + 1) * n - s);
        },
        backOut: function (n) {
            n = n - 1;
            var s = 1.70158;
            return n * n * ((s + 1) * n + s) + 1;
        },
        elastic: function (n) {
            if (n == 0 || n == 1) {
                return n;
            }
            var p = .3,
                s = p / 4;
            return pow(2, -10 * n) * math.sin((n - s) * (2 * PI) / p) + 1;
        },
        bounce: function (n) {
            var s = 7.5625,
                p = 2.75,
                l;
            if (n < (1 / p)) {
                l = s * n * n;
            } else {
                if (n < (2 / p)) {
                    n -= (1.5 / p);
                    l = s * n * n + .75;
                } else {
                    if (n < (2.5 / p)) {
                        n -= (2.25 / p);
                        l = s * n * n + .9375;
                    } else {
                        n -= (2.625 / p);
                        l = s * n * n + .984375;
                    }
                }
            }
            return l;
        }
    };

    var animationElements = [],
        animation = function () {
            var Now = +new Date;
            for (var l = 0; l < animationElements[length]; l++) {
                var e = animationElements[l];
                if (e.stop || e.el.removed) {
                    continue;
                }
                var time = Now - e.start,
                    ms = e.ms,
                    easing = e.easing,
                    from = e.from,
                    diff = e.diff,
                    to = e.to,
                    t = e.t,
                    that = e.el,
                    set = {},
                    now;
                if (time < ms) {
                    var pos = easing(time / ms);
                    for (var attr in from) if (from[has](attr)) {
                        switch (availableAnimAttrs[attr]) {
                            case "along":
                                now = pos * ms * diff[attr];
                                to.back && (now = to.len - now);
                                var point = getPointAtLength(to[attr], now);
                                that.translate(diff.sx - diff.x || 0, diff.sy - diff.y || 0);
                                diff.x = point.x;
                                diff.y = point.y;
                                that.translate(point.x - diff.sx, point.y - diff.sy);
                                to.rot && that.rotate(diff.r + point.alpha, point.x, point.y);
                                break;
                            case nu:
                                now = +from[attr] + pos * ms * diff[attr];
                                break;
                            case "colour":
                                now = "rgb(" + [
                                    upto255(round(from[attr].r + pos * ms * diff[attr].r)),
                                    upto255(round(from[attr].g + pos * ms * diff[attr].g)),
                                    upto255(round(from[attr].b + pos * ms * diff[attr].b))
                                ][join](",") + ")";
                                break;
                            case "path":
                                now = [];
                                for (var i = 0, ii = from[attr][length]; i < ii; i++) {
                                    now[i] = [from[attr][i][0]];
                                    for (var j = 1, jj = from[attr][i][length]; j < jj; j++) {
                                        now[i][j] = +from[attr][i][j] + pos * ms * diff[attr][i][j];
                                    }
                                    now[i] = now[i][join](S);
                                }
                                now = now[join](S);
                                break;
                            case "csv":
                                switch (attr) {
                                    case "translation":
                                        var x = pos * ms * diff[attr][0] - t.x,
                                            y = pos * ms * diff[attr][1] - t.y;
                                        t.x += x;
                                        t.y += y;
                                        now = x + S + y;
                                    break;
                                    case "rotation":
                                        now = +from[attr][0] + pos * ms * diff[attr][0];
                                        from[attr][1] && (now += "," + from[attr][1] + "," + from[attr][2]);
                                    break;
                                    case "scale":
                                        now = [+from[attr][0] + pos * ms * diff[attr][0], +from[attr][1] + pos * ms * diff[attr][1], (2 in to[attr] ? to[attr][2] : E), (3 in to[attr] ? to[attr][3] : E)][join](S);
                                    break;
                                    case "clip-rect":
                                        now = [];
                                        i = 4;
                                        while (i--) {
                                            now[i] = +from[attr][i] + pos * ms * diff[attr][i];
                                        }
                                    break;
                                }
                                break;
                            default:
                              var from2 = [].concat(from[attr]);
                                now = [];
                                i = that.paper.customAttributes[attr].length;
                                while (i--) {
                                    now[i] = +from2[i] + pos * ms * diff[attr][i];
                                }
                                break;
                        }
                        set[attr] = now;
                    }
                    that.attr(set);
                    that._run && that._run.call(that);
                } else {
                    if (to.along) {
                        point = getPointAtLength(to.along, to.len * !to.back);
                        that.translate(diff.sx - (diff.x || 0) + point.x - diff.sx, diff.sy - (diff.y || 0) + point.y - diff.sy);
                        to.rot && that.rotate(diff.r + point.alpha, point.x, point.y);
                    }
                    (t.x || t.y) && that.translate(-t.x, -t.y);
                    to.scale && (to.scale += E);
                    that.attr(to);
                    animationElements.splice(l--, 1);
                }
            }
            R.svg && that && that.paper && that.paper.safari();
            animationElements[length] && setTimeout(animation);
        },
        keyframesRun = function (attr, element, time, prev, prevcallback) {
            var dif = time - prev;
            element.timeouts.push(setTimeout(function () {
                R.is(prevcallback, "function") && prevcallback.call(element);
                element.animate(attr, dif, attr.easing);
            }, prev));
        },
        upto255 = function (color) {
            return mmax(mmin(color, 255), 0);
        },
        translate = function (x, y) {
            if (x == null) {
                return {x: this._.tx, y: this._.ty, toString: x_y};
            }
            this._.tx += +x;
            this._.ty += +y;
            switch (this.type) {
                case "circle":
                case "ellipse":
                    this.attr({cx: +x + this.attrs.cx, cy: +y + this.attrs.cy});
                    break;
                case "rect":
                case "image":
                case "text":
                    this.attr({x: +x + this.attrs.x, y: +y + this.attrs.y});
                    break;
                case "path":
                    var path = pathToRelative(this.attrs.path);
                    path[0][1] += +x;
                    path[0][2] += +y;
                    this.attr({path: path});
                break;
            }
            return this;
        };
    elproto.animateWith = function (element, params, ms, easing, callback) {
        for (var i = 0, ii = animationElements.length; i < ii; i++) {
            if (animationElements[i].el.id == element.id) {
                params.start = animationElements[i].start;
            }
        }
        return this.animate(params, ms, easing, callback);
    };
    elproto.animateAlong = along();
    elproto.animateAlongBack = along(1);
    function along(isBack) {
        return function (path, ms, rotate, callback) {
            var params = {back: isBack};
            R.is(rotate, "function") ? (callback = rotate) : (params.rot = rotate);
            path && path.constructor == Element && (path = path.attrs.path);
            path && (params.along = path);
            return this.animate(params, ms, callback);
        };
    }
    function CubicBezierAtTime(t, p1x, p1y, p2x, p2y, duration) {
        var cx = 3 * p1x,
            bx = 3 * (p2x - p1x) - cx,
            ax = 1 - cx - bx,
            cy = 3 * p1y,
            by = 3 * (p2y - p1y) - cy,
            ay = 1 - cy - by;
        function sampleCurveX(t) {
            return ((ax * t + bx) * t + cx) * t;
        }
        function solve(x, epsilon) {
            var t = solveCurveX(x, epsilon);
            return ((ay * t + by) * t + cy) * t;
        }
        function solveCurveX(x, epsilon) {
            var t0, t1, t2, x2, d2, i;
            for(t2 = x, i = 0; i < 8; i++) {
                x2 = sampleCurveX(t2) - x;
                if (abs(x2) < epsilon) {
                    return t2;
                }
                d2 = (3 * ax * t2 + 2 * bx) * t2 + cx;
                if (abs(d2) < 1e-6) {
                    break;
                }
                t2 = t2 - x2 / d2;
            }
            t0 = 0;
            t1 = 1;
            t2 = x;
            if (t2 < t0) {
                return t0;
            }
            if (t2 > t1) {
                return t1;
            }
            while (t0 < t1) {
                x2 = sampleCurveX(t2);
                if (abs(x2 - x) < epsilon) {
                    return t2;
                }
                if (x > x2) {
                    t0 = t2;
                } else {
                    t1 = t2;
                }
                t2 = (t1 - t0) / 2 + t0;
            }
            return t2;
        }
        return solve(t, 1 / (200 * duration));
    }
    elproto.onAnimation = function (f) {
        this._run = f || 0;
        return this;
    };
    elproto.animate = function (params, ms, easing, callback) {
        var element = this;
        element.timeouts = element.timeouts || [];
        if (R.is(easing, "function") || !easing) {
            callback = easing || null;
        }
        if (element.removed) {
            callback && callback.call(element);
            return element;
        }
        var from = {},
            to = {},
            animateable = false,
            diff = {};
        for (var attr in params) if (params[has](attr)) {
            if (availableAnimAttrs[has](attr) || element.paper.customAttributes[has](attr)) {
                animateable = true;
                from[attr] = element.attr(attr);
                (from[attr] == null) && (from[attr] = availableAttrs[attr]);
                to[attr] = params[attr];
                switch (availableAnimAttrs[attr]) {
                    case "along":
                        var len = getTotalLength(params[attr]);
                        var point = getPointAtLength(params[attr], len * !!params.back);
                        var bb = element.getBBox();
                        diff[attr] = len / ms;
                        diff.tx = bb.x;
                        diff.ty = bb.y;
                        diff.sx = point.x;
                        diff.sy = point.y;
                        to.rot = params.rot;
                        to.back = params.back;
                        to.len = len;
                        params.rot && (diff.r = toFloat(element.rotate()) || 0);
                        break;
                    case nu:
                        diff[attr] = (to[attr] - from[attr]) / ms;
                        break;
                    case "colour":
                        from[attr] = R.getRGB(from[attr]);
                        var toColour = R.getRGB(to[attr]);
                        diff[attr] = {
                            r: (toColour.r - from[attr].r) / ms,
                            g: (toColour.g - from[attr].g) / ms,
                            b: (toColour.b - from[attr].b) / ms
                        };
                        break;
                    case "path":
                        var pathes = path2curve(from[attr], to[attr]);
                        from[attr] = pathes[0];
                        var toPath = pathes[1];
                        diff[attr] = [];
                        for (var i = 0, ii = from[attr][length]; i < ii; i++) {
                            diff[attr][i] = [0];
                            for (var j = 1, jj = from[attr][i][length]; j < jj; j++) {
                                diff[attr][i][j] = (toPath[i][j] - from[attr][i][j]) / ms;
                            }
                        }
                        break;
                    case "csv":
                        var values = Str(params[attr])[split](separator),
                            from2 = Str(from[attr])[split](separator);
                        switch (attr) {
                            case "translation":
                                from[attr] = [0, 0];
                                diff[attr] = [values[0] / ms, values[1] / ms];
                            break;
                            case "rotation":
                                from[attr] = (from2[1] == values[1] && from2[2] == values[2]) ? from2 : [0, values[1], values[2]];
                                diff[attr] = [(values[0] - from[attr][0]) / ms, 0, 0];
                            break;
                            case "scale":
                                params[attr] = values;
                                from[attr] = Str(from[attr])[split](separator);
                                diff[attr] = [(values[0] - from[attr][0]) / ms, (values[1] - from[attr][1]) / ms, 0, 0];
                            break;
                            case "clip-rect":
                                from[attr] = Str(from[attr])[split](separator);
                                diff[attr] = [];
                                i = 4;
                                while (i--) {
                                    diff[attr][i] = (values[i] - from[attr][i]) / ms;
                                }
                            break;
                        }
                        to[attr] = values;
                        break;
                    default:
                        values = [].concat(params[attr]);
                        from2 = [].concat(from[attr]);
                        diff[attr] = [];
                        i = element.paper.customAttributes[attr][length];
                        while (i--) {
                            diff[attr][i] = ((values[i] || 0) - (from2[i] || 0)) / ms;
                        }
                        break;
                }
            }
        }
        if (!animateable) {
            var attrs = [],
                lastcall;
            for (var key in params) if (params[has](key) && animKeyFrames.test(key)) {
                attr = {value: params[key]};
                key == "from" && (key = 0);
                key == "to" && (key = 100);
                attr.key = toInt(key, 10);
                attrs.push(attr);
            }
            attrs.sort(sortByKey);
            if (attrs[0].key) {
                attrs.unshift({key: 0, value: element.attrs});
            }
            for (i = 0, ii = attrs[length]; i < ii; i++) {
                keyframesRun(attrs[i].value, element, ms / 100 * attrs[i].key, ms / 100 * (attrs[i - 1] && attrs[i - 1].key || 0), attrs[i - 1] && attrs[i - 1].value.callback);
            }
            lastcall = attrs[attrs[length] - 1].value.callback;
            if (lastcall) {
                element.timeouts.push(setTimeout(function () {lastcall.call(element);}, ms));
            }
        } else {
            var easyeasy = R.easing_formulas[easing];
            if (!easyeasy) {
                easyeasy = Str(easing).match(bezierrg);
                if (easyeasy && easyeasy[length] == 5) {
                    var curve = easyeasy;
                    easyeasy = function (t) {
                        return CubicBezierAtTime(t, +curve[1], +curve[2], +curve[3], +curve[4], ms);
                    };
                } else {
                    easyeasy = function (t) {
                        return t;
                    };
                }
            }
            animationElements.push({
                start: params.start || +new Date,
                ms: ms,
                easing: easyeasy,
                from: from,
                diff: diff,
                to: to,
                el: element,
                t: {x: 0, y: 0}
            });
            R.is(callback, "function") && (element._ac = setTimeout(function () {
                callback.call(element);
            }, ms));
            animationElements[length] == 1 && setTimeout(animation);
        }
        return this;
    };
    elproto.stop = function () {
        for (var i = 0; i < animationElements.length; i++) {
            animationElements[i].el.id == this.id && animationElements.splice(i--, 1);
        }
        for (i = 0, ii = this.timeouts && this.timeouts.length; i < ii; i++) {
            clearTimeout(this.timeouts[i]);
        }
        this.timeouts = [];
        clearTimeout(this._ac);
        delete this._ac;
        return this;
    };
    elproto.translate = function (x, y) {
        return this.attr({translation: x + " " + y});
    };
    elproto[toString] = function () {
        return "Rapha\xebl\u2019s object";
    };
    R.ae = animationElements;
 
    // Set
    var Set = function (items) {
        this.items = [];
        this[length] = 0;
        this.type = "set";
        if (items) {
            for (var i = 0, ii = items[length]; i < ii; i++) {
                if (items[i] && (items[i].constructor == Element || items[i].constructor == Set)) {
                    this[this.items[length]] = this.items[this.items[length]] = items[i];
                    this[length]++;
                }
            }
        }
    };
    Set[proto][push] = function () {
        var item,
            len;
        for (var i = 0, ii = arguments[length]; i < ii; i++) {
            item = arguments[i];
            if (item && (item.constructor == Element || item.constructor == Set)) {
                len = this.items[length];
                this[len] = this.items[len] = item;
                this[length]++;
            }
        }
        return this;
    };
    Set[proto].pop = function () {
        delete this[this[length]--];
        return this.items.pop();
    };
    for (var method in elproto) if (elproto[has](method)) {
        Set[proto][method] = (function (methodname) {
            return function () {
                for (var i = 0, ii = this.items[length]; i < ii; i++) {
                    this.items[i][methodname][apply](this.items[i], arguments);
                }
                return this;
            };
        })(method);
    }
    Set[proto].attr = function (name, value) {
        if (name && R.is(name, array) && R.is(name[0], "object")) {
            for (var j = 0, jj = name[length]; j < jj; j++) {
                this.items[j].attr(name[j]);
            }
        } else {
            for (var i = 0, ii = this.items[length]; i < ii; i++) {
                this.items[i].attr(name, value);
            }
        }
        return this;
    };
    Set[proto].animate = function (params, ms, easing, callback) {
        (R.is(easing, "function") || !easing) && (callback = easing || null);
        var len = this.items[length],
            i = len,
            item,
            set = this,
            collector;
        callback && (collector = function () {
            !--len && callback.call(set);
        });
        easing = R.is(easing, string) ? easing : collector;
        item = this.items[--i].animate(params, ms, easing, collector);
        while (i--) {
            this.items[i] && !this.items[i].removed && this.items[i].animateWith(item, params, ms, easing, collector);
        }
        return this;
    };
    Set[proto].insertAfter = function (el) {
        var i = this.items[length];
        while (i--) {
            this.items[i].insertAfter(el);
        }
        return this;
    };
    Set[proto].getBBox = function () {
        var x = [],
            y = [],
            w = [],
            h = [];
        for (var i = this.items[length]; i--;) {
            var box = this.items[i].getBBox();
            x[push](box.x);
            y[push](box.y);
            w[push](box.x + box.width);
            h[push](box.y + box.height);
        }
        x = mmin[apply](0, x);
        y = mmin[apply](0, y);
        return {
            x: x,
            y: y,
            width: mmax[apply](0, w) - x,
            height: mmax[apply](0, h) - y
        };
    };
    Set[proto].clone = function (s) {
        s = new Set;
        for (var i = 0, ii = this.items[length]; i < ii; i++) {
            s[push](this.items[i].clone());
        }
        return s;
    };

    R.registerFont = function (font) {
        if (!font.face) {
            return font;
        }
        this.fonts = this.fonts || {};
        var fontcopy = {
                w: font.w,
                face: {},
                glyphs: {}
            },
            family = font.face["font-family"];
        for (var prop in font.face) if (font.face[has](prop)) {
            fontcopy.face[prop] = font.face[prop];
        }
        if (this.fonts[family]) {
            this.fonts[family][push](fontcopy);
        } else {
            this.fonts[family] = [fontcopy];
        }
        if (!font.svg) {
            fontcopy.face["units-per-em"] = toInt(font.face["units-per-em"], 10);
            for (var glyph in font.glyphs) if (font.glyphs[has](glyph)) {
                var path = font.glyphs[glyph];
                fontcopy.glyphs[glyph] = {
                    w: path.w,
                    k: {},
                    d: path.d && "M" + path.d[rp](/[mlcxtrv]/g, function (command) {
                            return {l: "L", c: "C", x: "z", t: "m", r: "l", v: "c"}[command] || "M";
                        }) + "z"
                };
                if (path.k) {
                    for (var k in path.k) if (path[has](k)) {
                        fontcopy.glyphs[glyph].k[k] = path.k[k];
                    }
                }
            }
        }
        return font;
    };
    paperproto.getFont = function (family, weight, style, stretch) {
        stretch = stretch || "normal";
        style = style || "normal";
        weight = +weight || {normal: 400, bold: 700, lighter: 300, bolder: 800}[weight] || 400;
        if (!R.fonts) {
            return;
        }
        var font = R.fonts[family];
        if (!font) {
            var name = new RegExp("(^|\\s)" + family[rp](/[^\w\d\s+!~.:_-]/g, E) + "(\\s|$)", "i");
            for (var fontName in R.fonts) if (R.fonts[has](fontName)) {
                if (name.test(fontName)) {
                    font = R.fonts[fontName];
                    break;
                }
            }
        }
        var thefont;
        if (font) {
            for (var i = 0, ii = font[length]; i < ii; i++) {
                thefont = font[i];
                if (thefont.face["font-weight"] == weight && (thefont.face["font-style"] == style || !thefont.face["font-style"]) && thefont.face["font-stretch"] == stretch) {
                    break;
                }
            }
        }
        return thefont;
    };
    paperproto.print = function (x, y, string, font, size, origin, letter_spacing) {
        origin = origin || "middle"; // baseline|middle
        letter_spacing = mmax(mmin(letter_spacing || 0, 1), -1);
        var out = this.set(),
            letters = Str(string)[split](E),
            shift = 0,
            path = E,
            scale;
        R.is(font, string) && (font = this.getFont(font));
        if (font) {
            scale = (size || 16) / font.face["units-per-em"];
            var bb = font.face.bbox.split(separator),
                top = +bb[0],
                height = +bb[1] + (origin == "baseline" ? bb[3] - bb[1] + (+font.face.descent) : (bb[3] - bb[1]) / 2);
            for (var i = 0, ii = letters[length]; i < ii; i++) {
                var prev = i && font.glyphs[letters[i - 1]] || {},
                    curr = font.glyphs[letters[i]];
                shift += i ? (prev.w || font.w) + (prev.k && prev.k[letters[i]] || 0) + (font.w * letter_spacing) : 0;
                curr && curr.d && out[push](this.path(curr.d).attr({fill: "#000", stroke: "none", translation: [shift, 0]}));
            }
            out.scale(scale, scale, top, height).translate(x - top, y - height);
        }
        return out;
    };

    R.format = function (token, params) {
        var args = R.is(params, array) ? [0][concat](params) : arguments;
        token && R.is(token, string) && args[length] - 1 && (token = token[rp](formatrg, function (str, i) {
            return args[++i] == null ? E : args[i];
        }));
        return token || E;
    };
    R.ninja = function () {
        oldRaphael.was ? (win.Raphael = oldRaphael.is) : delete Raphael;
        return R;
    };
    R.el = elproto;
    R.st = Set[proto];

    oldRaphael.was ? (win.Raphael = R) : (Raphael = R);
})();/*!
 * g.Raphael 0.4.1 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
 
(function () {
    var mmax = Math.max,
        mmin = Math.min;
    Raphael.fn.g = Raphael.fn.g || {};
    Raphael.fn.g.markers = {
        disc: "disc",
        o: "disc",
        flower: "flower",
        f: "flower",
        diamond: "diamond",
        d: "diamond",
        square: "square",
        s: "square",
        triangle: "triangle",
        t: "triangle",
        star: "star",
        "*": "star",
        cross: "cross",
        x: "cross",
        plus: "plus",
        "+": "plus",
        arrow: "arrow",
        "->": "arrow"
    };
    Raphael.fn.g.shim = {stroke: "none", fill: "#000", "fill-opacity": 0};
    Raphael.fn.g.txtattr = {font: "12px Arial, sans-serif"};
    Raphael.fn.g.colors = [];
    var hues = [.6, .2, .05, .1333, .75, 0];
    for (var i = 0; i < 10; i++) {
        if (i < hues.length) {
            Raphael.fn.g.colors.push("hsb(" + hues[i] + ", .75, .75)");
        } else {
            Raphael.fn.g.colors.push("hsb(" + hues[i - hues.length] + ", 1, .5)");
        }
    }
    Raphael.fn.g.text = function (x, y, text) {
        return this.text(x, y, text).attr(this.g.txtattr);
    };
    Raphael.fn.g.labelise = function (label, val, total) {
        if (label) {
            return (label + "").replace(/(##+(?:\.#+)?)|(%%+(?:\.%+)?)/g, function (all, value, percent) {
                if (value) {
                    return (+val).toFixed(value.replace(/^#+\.?/g, "").length);
                }
                if (percent) {
                    return (val * 100 / total).toFixed(percent.replace(/^%+\.?/g, "").length) + "%";
                }
            });
        } else {
            return (+val).toFixed(0);
        }
    };

    Raphael.fn.g.finger = function (x, y, width, height, dir, ending, isPath) {
        // dir 0 for horisontal and 1 for vertical
        if ((dir && !height) || (!dir && !width)) {
            return isPath ? "" : this.path();
        }
        ending = {square: "square", sharp: "sharp", soft: "soft"}[ending] || "round";
        var path;
        height = Math.round(height);
        width = Math.round(width);
        x = Math.round(x);
        y = Math.round(y);
        switch (ending) {
            case "round":
            if (!dir) {
                var r = ~~(height / 2);
                if (width < r) {
                    r = width;
                    path = ["M", x + .5, y + .5 - ~~(height / 2), "l", 0, 0, "a", r, ~~(height / 2), 0, 0, 1, 0, height, "l", 0, 0, "z"];
                } else {
                    path = ["M", x + .5, y + .5 - r, "l", width - r, 0, "a", r, r, 0, 1, 1, 0, height, "l", r - width, 0, "z"];
                }
            } else {
                r = ~~(width / 2);
                if (height < r) {
                    r = height;
                    path = ["M", x - ~~(width / 2), y, "l", 0, 0, "a", ~~(width / 2), r, 0, 0, 1, width, 0, "l", 0, 0, "z"];
                } else {
                    path = ["M", x - r, y, "l", 0, r - height, "a", r, r, 0, 1, 1, width, 0, "l", 0, height - r, "z"];
                }
            }
            break;
            case "sharp":
            if (!dir) {
                var half = ~~(height / 2);
                path = ["M", x, y + half, "l", 0, -height, mmax(width - half, 0), 0, mmin(half, width), half, -mmin(half, width), half + (half * 2 < height), "z"];
            } else {
                half = ~~(width / 2);
                path = ["M", x + half, y, "l", -width, 0, 0, -mmax(height - half, 0), half, -mmin(half, height), half, mmin(half, height), half, "z"];
            }
            break;
            case "square":
            if (!dir) {
                path = ["M", x, y + ~~(height / 2), "l", 0, -height, width, 0, 0, height, "z"];
            } else {
                path = ["M", x + ~~(width / 2), y, "l", 1 - width, 0, 0, -height, width - 1, 0, "z"];
            }
            break;
            case "soft":
            if (!dir) {
                r = mmin(width, Math.round(height / 5));
                path = ["M", x + .5, y + .5 - ~~(height / 2), "l", width - r, 0, "a", r, r, 0, 0, 1, r, r, "l", 0, height - r * 2, "a", r, r, 0, 0, 1, -r, r, "l", r - width, 0, "z"];
            } else {
                r = mmin(Math.round(width / 5), height);
                path = ["M", x - ~~(width / 2), y, "l", 0, r - height, "a", r, r, 0, 0, 1, r, -r, "l", width - 2 * r, 0, "a", r, r, 0, 0, 1, r, r, "l", 0, height - r, "z"];
            }
        }
        if (isPath) {
            return path.join(",");
        } else {
            return this.path(path);
        }
    };

    // Symbols
    Raphael.fn.g.disc = function (cx, cy, r) {
        return this.circle(cx, cy, r);
    };
    Raphael.fn.g.line = function (cx, cy, r) {
        return this.rect(cx - r, cy - r / 5, 2 * r, 2 * r / 5);
    };
    Raphael.fn.g.square = function (cx, cy, r) {
        r = r * .7;
        return this.rect(cx - r, cy - r, 2 * r, 2 * r);
    };
    Raphael.fn.g.triangle = function (cx, cy, r) {
        r *= 1.75;
        return this.path("M".concat(cx, ",", cy, "m0-", r * .58, "l", r * .5, ",", r * .87, "-", r, ",0z"));
    };
    Raphael.fn.g.diamond = function (cx, cy, r) {
        return this.path(["M", cx, cy - r, "l", r, r, -r, r, -r, -r, r, -r, "z"]);
    };
    Raphael.fn.g.flower = function (cx, cy, r, n) {
        r = r * 1.25;
        var rout = r,
            rin = rout * .5;
        n = +n < 3 || !n ? 5 : n;
        var points = ["M", cx, cy + rin, "Q"],
            R;
        for (var i = 1; i < n * 2 + 1; i++) {
            R = i % 2 ? rout : rin;
            points = points.concat([+(cx + R * Math.sin(i * Math.PI / n)).toFixed(3), +(cy + R * Math.cos(i * Math.PI / n)).toFixed(3)]);
        }
        points.push("z");
        return this.path(points.join(","));
    };
    Raphael.fn.g.star = function (cx, cy, r, r2, rays) {
        r2 = r2 || r * .382;
        rays = rays || 5;
        var points = ["M", cx, cy + r2, "L"],
            R;
        for (var i = 1; i < rays * 2; i++) {
            R = i % 2 ? r : r2;
            points = points.concat([(cx + R * Math.sin(i * Math.PI / rays)), (cy + R * Math.cos(i * Math.PI / rays))]);
        }
        points.push("z");
        return this.path(points.join(","));
    };
    Raphael.fn.g.cross = function (cx, cy, r) {
        r = r / 2.5;
        return this.path("M".concat(cx - r, ",", cy, "l", [-r, -r, r, -r, r, r, r, -r, r, r, -r, r, r, r, -r, r, -r, -r, -r, r, -r, -r, "z"]));
    };
    Raphael.fn.g.plus = function (cx, cy, r) {
        r = r / 2;
        return this.path("M".concat(cx - r / 2, ",", cy - r / 2, "l", [0, -r, r, 0, 0, r, r, 0, 0, r, -r, 0, 0, r, -r, 0, 0, -r, -r, 0, 0, -r, "z"]));
    };
    Raphael.fn.g.arrow = function (cx, cy, r) {
        return this.path("M".concat(cx - r * .7, ",", cy - r * .4, "l", [r * .6, 0, 0, -r * .4, r, r * .8, -r, r * .8, 0, -r * .4, -r * .6, 0], "z"));
    };

    // Tooltips
    Raphael.fn.g.tag = function (x, y, text, angle, r) {
        angle = angle || 0;
        r = r == null ? 5 : r;
        text = text == null ? "$9.99" : text;
        var R = .5522 * r,
            res = this.set(),
            d = 3;
        res.push(this.path().attr({fill: "#000", stroke: "#000"}));
        res.push(this.text(x, y, text).attr(this.g.txtattr).attr({fill: "#fff", "font-family": "Helvetica, Arial"}));
        res.update = function () {
            this.rotate(0, x, y);
            var bb = this[1].getBBox();
            if (bb.height >= r * 2) {
                this[0].attr({path: ["M", x, y + r, "a", r, r, 0, 1, 1, 0, -r * 2, r, r, 0, 1, 1, 0, r * 2, "m", 0, -r * 2 -d, "a", r + d, r + d, 0, 1, 0, 0, (r + d) * 2, "L", x + r + d, y + bb.height / 2 + d, "l", bb.width + 2 * d, 0, 0, -bb.height - 2 * d, -bb.width - 2 * d, 0, "L", x, y - r - d].join(",")});
            } else {
                var dx = Math.sqrt(Math.pow(r + d, 2) - Math.pow(bb.height / 2 + d, 2));
                this[0].attr({path: ["M", x, y + r, "c", -R, 0, -r, R - r, -r, -r, 0, -R, r - R, -r, r, -r, R, 0, r, r - R, r, r, 0, R, R - r, r, -r, r, "M", x + dx, y - bb.height / 2 - d, "a", r + d, r + d, 0, 1, 0, 0, bb.height + 2 * d, "l", r + d - dx + bb.width + 2 * d, 0, 0, -bb.height - 2 * d, "L", x + dx, y - bb.height / 2 - d].join(",")});
            }
            this[1].attr({x: x + r + d + bb.width / 2, y: y});
            angle = (360 - angle) % 360;
            this.rotate(angle, x, y);
            angle > 90 && angle < 270 && this[1].attr({x: x - r - d - bb.width / 2, y: y, rotation: [180 + angle, x, y]});
            return this;
        };
        res.update();
        return res;
    };
    Raphael.fn.g.popupit = function (x, y, set, dir, size) {
        dir = dir == null ? 2 : dir;
        size = size || 5;
        x = Math.round(x);
        y = Math.round(y);
        var bb = set.getBBox(),
            w = Math.round(bb.width / 2),
            h = Math.round(bb.height / 2),
            dx = [0, w + size * 2, 0, -w - size * 2],
            dy = [-h * 2 - size * 3, -h - size, 0, -h - size],
            p = ["M", x - dx[dir], y - dy[dir], "l", -size, (dir == 2) * -size, -mmax(w - size, 0), 0, "a", size, size, 0, 0, 1, -size, -size,
                "l", 0, -mmax(h - size, 0), (dir == 3) * -size, -size, (dir == 3) * size, -size, 0, -mmax(h - size, 0), "a", size, size, 0, 0, 1, size, -size,
                "l", mmax(w - size, 0), 0, size, !dir * -size, size, !dir * size, mmax(w - size, 0), 0, "a", size, size, 0, 0, 1, size, size,
                "l", 0, mmax(h - size, 0), (dir == 1) * size, size, (dir == 1) * -size, size, 0, mmax(h - size, 0), "a", size, size, 0, 0, 1, -size, size,
                "l", -mmax(w - size, 0), 0, "z"].join(","),
            xy = [{x: x, y: y + size * 2 + h}, {x: x - size * 2 - w, y: y}, {x: x, y: y - size * 2 - h}, {x: x + size * 2 + w, y: y}][dir];
        set.translate(xy.x - w - bb.x, xy.y - h - bb.y);
        return this.path(p).attr({fill: "#000", stroke: "none"}).insertBefore(set.node ? set : set[0]);
    };
    Raphael.fn.g.popup = function (x, y, text, dir, size) {
        dir = dir == null ? 2 : dir > 3 ? 3 : dir;
        size = size || 5;
        text = text || "$9.99";
        var res = this.set(),
            d = 3;
        res.push(this.path().attr({fill: "#000", stroke: "#000"}));
        res.push(this.text(x, y, text).attr(this.g.txtattr).attr({fill: "#fff", "font-family": "Helvetica, Arial"}));
        res.update = function (X, Y, withAnimation) {
            X = X || x;
            Y = Y || y;
            var bb = this[1].getBBox(),
                w = bb.width / 2,
                h = bb.height / 2,
                dx = [0, w + size * 2, 0, -w - size * 2],
                dy = [-h * 2 - size * 3, -h - size, 0, -h - size],
                p = ["M", X - dx[dir], Y - dy[dir], "l", -size, (dir == 2) * -size, -mmax(w - size, 0), 0, "a", size, size, 0, 0, 1, -size, -size,
                    "l", 0, -mmax(h - size, 0), (dir == 3) * -size, -size, (dir == 3) * size, -size, 0, -mmax(h - size, 0), "a", size, size, 0, 0, 1, size, -size,
                    "l", mmax(w - size, 0), 0, size, !dir * -size, size, !dir * size, mmax(w - size, 0), 0, "a", size, size, 0, 0, 1, size, size,
                    "l", 0, mmax(h - size, 0), (dir == 1) * size, size, (dir == 1) * -size, size, 0, mmax(h - size, 0), "a", size, size, 0, 0, 1, -size, size,
                    "l", -mmax(w - size, 0), 0, "z"].join(","),
                xy = [{x: X, y: Y + size * 2 + h}, {x: X - size * 2 - w, y: Y}, {x: X, y: Y - size * 2 - h}, {x: X + size * 2 + w, y: Y}][dir];
            xy.path = p;
            if (withAnimation) {
                this.animate(xy, 500, ">");
            } else {
                this.attr(xy);
            }
            return this;
        };
        return res.update(x, y);
    };
    Raphael.fn.g.flag = function (x, y, text, angle) {
        angle = angle || 0;
        text = text || "$9.99";
        var res = this.set(),
            d = 3;
        res.push(this.path().attr({fill: "#000", stroke: "#000"}));
        res.push(this.text(x, y, text).attr(this.g.txtattr).attr({fill: "#fff", "font-family": "Helvetica, Arial"}));
        res.update = function (x, y) {
            this.rotate(0, x, y);
            var bb = this[1].getBBox(),
                h = bb.height / 2;
            this[0].attr({path: ["M", x, y, "l", h + d, -h - d, bb.width + 2 * d, 0, 0, bb.height + 2 * d, -bb.width - 2 * d, 0, "z"].join(",")});
            this[1].attr({x: x + h + d + bb.width / 2, y: y});
            angle = 360 - angle;
            this.rotate(angle, x, y);
            angle > 90 && angle < 270 && this[1].attr({x: x - r - d - bb.width / 2, y: y, rotation: [180 + angle, x, y]});
            return this;
        };
        return res.update(x, y);
    };
    Raphael.fn.g.label = function (x, y, text) {
        var res = this.set();
        res.push(this.rect(x, y, 10, 10).attr({stroke: "none", fill: "#000"}));
        res.push(this.text(x, y, text).attr(this.g.txtattr).attr({fill: "#fff"}));
        res.update = function () {
            var bb = this[1].getBBox(),
                r = mmin(bb.width + 10, bb.height + 10) / 2;
            this[0].attr({x: bb.x - r / 2, y: bb.y - r / 2, width: bb.width + r, height: bb.height + r, r: r});
        };
        res.update();
        return res;
    };
    Raphael.fn.g.labelit = function (set) {
        var bb = set.getBBox(),
            r = mmin(20, bb.width + 10, bb.height + 10) / 2;
        return this.rect(bb.x - r / 2, bb.y - r / 2, bb.width + r, bb.height + r, r).attr({stroke: "none", fill: "#000"}).insertBefore(set.node ? set : set[0]);
    };
    Raphael.fn.g.drop = function (x, y, text, size, angle) {
        size = size || 30;
        angle = angle || 0;
        var res = this.set();
        res.push(this.path(["M", x, y, "l", size, 0, "A", size * .4, size * .4, 0, 1, 0, x + size * .7, y - size * .7, "z"]).attr({fill: "#000", stroke: "none", rotation: [22.5 - angle, x, y]}));
        angle = (angle + 90) * Math.PI / 180;
        res.push(this.text(x + size * Math.sin(angle), y + size * Math.cos(angle), text).attr(this.g.txtattr).attr({"font-size": size * 12 / 30, fill: "#fff"}));
        res.drop = res[0];
        res.text = res[1];
        return res;
    };
    Raphael.fn.g.blob = function (x, y, text, angle, size) {
        angle = (+angle + 1 ? angle : 45) + 90;
        size = size || 12;
        var rad = Math.PI / 180,
            fontSize = size * 12 / 12;
        var res = this.set();
        res.push(this.path().attr({fill: "#000", stroke: "none"}));
        res.push(this.text(x + size * Math.sin((angle) * rad), y + size * Math.cos((angle) * rad) - fontSize / 2, text).attr(this.g.txtattr).attr({"font-size": fontSize, fill: "#fff"}));
        res.update = function (X, Y, withAnimation) {
            X = X || x;
            Y = Y || y;
            var bb = this[1].getBBox(),
                w = mmax(bb.width + fontSize, size * 25 / 12),
                h = mmax(bb.height + fontSize, size * 25 / 12),
                x2 = X + size * Math.sin((angle - 22.5) * rad),
                y2 = Y + size * Math.cos((angle - 22.5) * rad),
                x1 = X + size * Math.sin((angle + 22.5) * rad),
                y1 = Y + size * Math.cos((angle + 22.5) * rad),
                dx = (x1 - x2) / 2,
                dy = (y1 - y2) / 2,
                rx = w / 2,
                ry = h / 2,
                k = -Math.sqrt(Math.abs(rx * rx * ry * ry - rx * rx * dy * dy - ry * ry * dx * dx) / (rx * rx * dy * dy + ry * ry * dx * dx)),
                cx = k * rx * dy / ry + (x1 + x2) / 2,
                cy = k * -ry * dx / rx + (y1 + y2) / 2;
            if (withAnimation) {
                this.animate({x: cx, y: cy, path: ["M", x, y, "L", x1, y1, "A", rx, ry, 0, 1, 1, x2, y2, "z"].join(",")}, 500, ">");
            } else {
                this.attr({x: cx, y: cy, path: ["M", x, y, "L", x1, y1, "A", rx, ry, 0, 1, 1, x2, y2, "z"].join(",")});
            }
            return this;
        };
        res.update(x, y);
        return res;
    };

    Raphael.fn.g.colorValue = function (value, total, s, b) {
        return "hsb(" + [mmin((1 - value / total) * .4, 1), s || .75, b || .75] + ")";
    };

    Raphael.fn.g.snapEnds = function (from, to, steps) {
        var f = from,
            t = to;
        if (f == t) {
            return {from: f, to: t, power: 0};
        }
        function round(a) {
            return Math.abs(a - .5) < .25 ? ~~(a) + .5 : Math.round(a);
        }
        var d = (t - f) / steps,
            r = ~~(d),
            R = r,
            i = 0;
        if (r) {
            while (R) {
                i--;
                R = ~~(d * Math.pow(10, i)) / Math.pow(10, i);
            }
            i ++;
        } else {
            while (!r) {
                i = i || 1;
                r = ~~(d * Math.pow(10, i)) / Math.pow(10, i);
                i++;
            }
            i && i--;
        }
        t = round(to * Math.pow(10, i)) / Math.pow(10, i);
        if (t < to) {
            t = round((to + .5) * Math.pow(10, i)) / Math.pow(10, i);
        }
        f = round((from - (i > 0 ? 0 : .5)) * Math.pow(10, i)) / Math.pow(10, i);
        return {from: f, to: t, power: i};
    };
    Raphael.fn.g.axis = function (x, y, length, from, to, steps, orientation, labels, type, dashsize) {
        dashsize = dashsize == null ? 2 : dashsize;
        type = type || "t";
        steps = steps || 10;
        var path = type == "|" || type == " " ? ["M", x + .5, y, "l", 0, .001] : orientation == 1 || orientation == 3 ? ["M", x + .5, y, "l", 0, -length] : ["M", x, y + .5, "l", length, 0],
            ends = this.g.snapEnds(from, to, steps),
            f = ends.from,
            t = ends.to,
            i = ends.power,
            j = 0,
            text = this.set();
        d = (t - f) / steps;
        var label = f,
            rnd = i > 0 ? i : 0;
            dx = length / steps;
        if (+orientation == 1 || +orientation == 3) {
            var Y = y,
                addon = (orientation - 1 ? 1 : -1) * (dashsize + 3 + !!(orientation - 1));
            while (Y >= y - length) {
                type != "-" && type != " " && (path = path.concat(["M", x - (type == "+" || type == "|" ? dashsize : !(orientation - 1) * dashsize * 2), Y + .5, "l", dashsize * 2 + 1, 0]));
                text.push(this.text(x + addon, Y, (labels && labels[j++]) || (Math.round(label) == label ? label : +label.toFixed(rnd))).attr(this.g.txtattr).attr({"text-anchor": orientation - 1 ? "start" : "end"}));
                label += d;
                Y -= dx;
            }
            if (Math.round(Y + dx - (y - length))) {
                type != "-" && type != " " && (path = path.concat(["M", x - (type == "+" || type == "|" ? dashsize : !(orientation - 1) * dashsize * 2), y - length + .5, "l", dashsize * 2 + 1, 0]));
                text.push(this.text(x + addon, y - length, (labels && labels[j]) || (Math.round(label) == label ? label : +label.toFixed(rnd))).attr(this.g.txtattr).attr({"text-anchor": orientation - 1 ? "start" : "end"}));
            }
        } else {
            label = f;
            rnd = (i > 0) * i;
            addon = (orientation ? -1 : 1) * (dashsize + 9 + !orientation);
            var X = x,
                dx = length / steps,
                txt = 0,
                prev = 0;
            while (X <= x + length) {
                type != "-" && type != " " && (path = path.concat(["M", X + .5, y - (type == "+" ? dashsize : !!orientation * dashsize * 2), "l", 0, dashsize * 2 + 1]));
                text.push(txt = this.text(X, y + addon, (labels && labels[j++]) || (Math.round(label) == label ? label : +label.toFixed(rnd))).attr(this.g.txtattr));
                var bb = txt.getBBox();
                if (prev >= bb.x - 5) {
                    text.pop(text.length - 1).remove();
                } else {
                    prev = bb.x + bb.width;
                }
                label += d;
                X += dx;
            }
            if (Math.round(X - dx - x - length)) {
                type != "-" && type != " " && (path = path.concat(["M", x + length + .5, y - (type == "+" ? dashsize : !!orientation * dashsize * 2), "l", 0, dashsize * 2 + 1]));
                text.push(this.text(x + length, y + addon, (labels && labels[j]) || (Math.round(label) == label ? label : +label.toFixed(rnd))).attr(this.g.txtattr));
            }
        }
        var res = this.path(path);
        res.text = text;
        res.all = this.set([res, text]);
        res.remove = function () {
            this.text.remove();
            this.constructor.prototype.remove.call(this);
        };
        return res;
    };

    Raphael.el.lighter = function (times) {
        times = times || 2;
        var fs = [this.attrs.fill, this.attrs.stroke];
        this.fs = this.fs || [fs[0], fs[1]];
        fs[0] = Raphael.rgb2hsb(Raphael.getRGB(fs[0]).hex);
        fs[1] = Raphael.rgb2hsb(Raphael.getRGB(fs[1]).hex);
        fs[0].b = mmin(fs[0].b * times, 1);
        fs[0].s = fs[0].s / times;
        fs[1].b = mmin(fs[1].b * times, 1);
        fs[1].s = fs[1].s / times;
        this.attr({fill: "hsb(" + [fs[0].h, fs[0].s, fs[0].b] + ")", stroke: "hsb(" + [fs[1].h, fs[1].s, fs[1].b] + ")"});
    };
    Raphael.el.darker = function (times) {
        times = times || 2;
        var fs = [this.attrs.fill, this.attrs.stroke];
        this.fs = this.fs || [fs[0], fs[1]];
        fs[0] = Raphael.rgb2hsb(Raphael.getRGB(fs[0]).hex);
        fs[1] = Raphael.rgb2hsb(Raphael.getRGB(fs[1]).hex);
        fs[0].s = mmin(fs[0].s * times, 1);
        fs[0].b = fs[0].b / times;
        fs[1].s = mmin(fs[1].s * times, 1);
        fs[1].b = fs[1].b / times;
        this.attr({fill: "hsb(" + [fs[0].h, fs[0].s, fs[0].b] + ")", stroke: "hsb(" + [fs[1].h, fs[1].s, fs[1].b] + ")"});
    };
    Raphael.el.original = function () {
        if (this.fs) {
            this.attr({fill: this.fs[0], stroke: this.fs[1]});
            delete this.fs;
        }
    };
})();/*!
 * g.Raphael 0.4.1 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
Raphael.fn.g.barchart = function (x, y, width, height, values, opts) {
    opts = opts || {};
    var type = {round: "round", sharp: "sharp", soft: "soft"}[opts.type] || "square",
        gutter = parseFloat(opts.gutter || "20%"),
        chart = this.set(),
        bars = this.set(),
        covers = this.set(),
        covers2 = this.set(),
        total = Math.max.apply(Math, values),
        stacktotal = [],
        paper = this,
        multi = 0,
        colors = opts.colors || this.g.colors,
        len = values.length;
    if (this.raphael.is(values[0], "array")) {
        total = [];
        multi = len;
        len = 0;
        for (var i = values.length; i--;) {
            bars.push(this.set());
            total.push(Math.max.apply(Math, values[i]));
            len = Math.max(len, values[i].length);
        }
        if (opts.stacked) {
            for (var i = len; i--;) {
                var tot = 0;
                for (var j = values.length; j--;) {
                    tot +=+ values[j][i] || 0;
                }
                stacktotal.push(tot);
            }
        }
        for (var i = values.length; i--;) {
            if (values[i].length < len) {
                for (var j = len; j--;) {
                    values[i].push(0);
                }
            }
        }
        total = Math.max.apply(Math, opts.stacked ? stacktotal : total);
    }
    
    total = (opts.to) || total;
    var barwidth = width / (len * (100 + gutter) + gutter) * 100,
        barhgutter = barwidth * gutter / 100,
        barvgutter = opts.vgutter == null ? 20 : opts.vgutter,
        stack = [],
        X = x + barhgutter,
        Y = (height - 2 * barvgutter) / total;
    if (!opts.stretch) {
        barhgutter = Math.round(barhgutter);
        barwidth = Math.floor(barwidth);
    }
    !opts.stacked && (barwidth /= multi || 1);
    for (var i = 0; i < len; i++) {
        stack = [];
        for (var j = 0; j < (multi || 1); j++) {
            var h = Math.round((multi ? values[j][i] : values[i]) * Y),
                top = y + height - barvgutter - h,
                bar = this.g.finger(Math.round(X + barwidth / 2), top + h, barwidth, h, true, type).attr({stroke: "none", fill: colors[multi ? j : i]});
            if (multi) {
                bars[j].push(bar);
            } else {
                bars.push(bar);
            }
            bar.y = top;
            bar.x = Math.round(X + barwidth / 2);
            bar.w = barwidth;
            bar.h = h;
						bar.index = i;
            bar.value = multi ? values[j][i] : values[i];
            if (!opts.stacked) {
                X += barwidth;
            } else {
                stack.push(bar);
            }
        }
        if (opts.stacked) {
            var cvr;
            covers2.push(cvr = this.rect(stack[0].x - stack[0].w / 2, y, barwidth, height).attr(this.g.shim));
            cvr.bars = this.set();
            var size = 0;
            for (var s = stack.length; s--;) {
                stack[s].toFront();
            }
            for (var s = 0, ss = stack.length; s < ss; s++) {
                var bar = stack[s],
                    cover,
                    h = (size + bar.value) * Y,
                    path = this.g.finger(bar.x, y + height - barvgutter - !!size * .5, barwidth, h, true, type, 1);
                cvr.bars.push(bar);
                size && bar.attr({path: path});
                bar.h = h;
                bar.y = y + height - barvgutter - !!size * .5 - h;
                covers.push(cover = this.rect(bar.x - bar.w / 2, bar.y, barwidth, bar.value * Y).attr(this.g.shim));
                cover.bar = bar;
                cover.value = bar.value;
                size += bar.value;
            }
            X += barwidth;
        }
        X += barhgutter;
    }
    covers2.toFront();
    X = x + barhgutter;
    if (!opts.stacked) {
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < (multi || 1); j++) {
                var cover;
                covers.push(cover = this.rect(Math.round(X), y + barvgutter, barwidth, height - barvgutter).attr(this.g.shim));
                cover.bar = multi ? bars[j][i] : bars[i];
                cover.value = cover.bar.value;
                X += barwidth;
            }
            X += barhgutter;
        }
    }
    chart.label = function (labels, isBottom, rotate) {
        labels = labels || [];
        isBottom = isBottom == undefined ? true : isBottom;
	rotate = rotate == undefined ? false : rotate;
        this.labels = paper.set();
        var L, l = -Infinity;
        if (opts.stacked) {
            for (var i = 0; i < len; i++) {
                var tot = 0;
                for (var j = 0; j < (multi || 1); j++) {
                    tot += multi ? values[j][i] : values[i];
                    if (j == 0) {
                        var label = paper.g.labelise(labels[j][i], tot, total);
                        L = paper.g.text(bars[j][i].x, isBottom ? y + height - barvgutter / 2 : bars[j][i].y - 10, label);
			if (rotate) {
				L.rotate(90);
			}
                        var bb = L.getBBox();
                        if (bb.x - 7 < l) {
                            L.remove();
                        } else {
                            this.labels.push(L);
                            l = bb.x + (rotate ? bb.height : bb.width);
                        }
                    }
                }
            }
        } else {
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < (multi || 1); j++) {
                    // did not remove the loop because don't yet know whether to accept multi array input for arrays
                    var label = paper.g.labelise(multi ? labels[0] && labels[0][i] : labels[i], multi ? values[0][i] : values[i], total);
                     L = paper.g.text(bars[0][i].x, isBottom ? y + 5 + height - barvgutter / 2 : bars[0][i].y - 10, label);
			if (rotate) {
				L.rotate(90);
				// If we rotated it, we need to move it as well. Still have to use the width
				// to get the "length" of the label, divided it in two and shift down.
				L.translate(0, (L.getBBox().width / 2));
			}
                    var bb = L.getBBox();
//                    if (bb.x - 7 < l) {
                    if (bb.x - (this.getBBox().width) < l) {
                        L.remove();
                    } else {
                        this.labels.push(L);
                        l = bb.x + (rotate ? bb.height : bb.width);
                    }
                }
            }
        }
        return this;
    };
    chart.hover = function (fin, fout) {
        covers2.hide();
        covers.show();
        covers.mouseover(fin).mouseout(fout);
        return this;
    };
    chart.hoverColumn = function (fin, fout) {
        covers.hide();
        covers2.show();
        fout = fout || function () {};
        covers2.mouseover(fin).mouseout(fout);
        return this;
    };
    chart.click = function (f) {
        covers2.hide();
        covers.show();
        covers.click(f);
        return this;
    };
    chart.each = function (f) {
        if (!Raphael.is(f, "function")) {
            return this;
        }
        for (var i = covers.length; i--;) {
            f.call(covers[i]);
        }
        return this;
    };
    chart.eachColumn = function (f) {
        if (!Raphael.is(f, "function")) {
            return this;
        }
        for (var i = covers2.length; i--;) {
            f.call(covers2[i]);
        }
        return this;
    };
    chart.clickColumn = function (f) {
        covers.hide();
        covers2.show();
        covers2.click(f);
        return this;
    };
    chart.push(bars, covers, covers2);
    chart.bars = bars;
    chart.covers = covers;
    return chart;
};
Raphael.fn.g.hbarchart = function (x, y, width, height, values, opts) {
    opts = opts || {};
    var type = {round: "round", sharp: "sharp", soft: "soft"}[opts.type] || "square",
        gutter = parseFloat(opts.gutter || "20%"),
        chart = this.set(),
        bars = this.set(),
        covers = this.set(),
        covers2 = this.set(),
        total = Math.max.apply(Math, values),
        stacktotal = [],
        paper = this,
        multi = 0,
        colors = opts.colors || this.g.colors,
        len = values.length;
    if (this.raphael.is(values[0], "array")) {
        total = [];
        multi = len;
        len = 0;
        for (var i = values.length; i--;) {
            bars.push(this.set());
            total.push(Math.max.apply(Math, values[i]));
            len = Math.max(len, values[i].length);
        }
        if (opts.stacked) {
            for (var i = len; i--;) {
                var tot = 0;
                for (var j = values.length; j--;) {
                    tot +=+ values[j][i] || 0;
                }
                stacktotal.push(tot);
            }
        }
        for (var i = values.length; i--;) {
            if (values[i].length < len) {
                for (var j = len; j--;) {
                    values[i].push(0);
                }
            }
        }
        total = Math.max.apply(Math, opts.stacked ? stacktotal : total);
    }
    
    total = (opts.to) || total;
    var barheight = Math.floor(height / (len * (100 + gutter) + gutter) * 100),
        bargutter = Math.floor(barheight * gutter / 100),
        stack = [],
        Y = y + bargutter,
        X = (width - 1) / total;
    !opts.stacked && (barheight /= multi || 1);
    for (var i = 0; i < len; i++) {
        stack = [];
        for (var j = 0; j < (multi || 1); j++) {
            var val = multi ? values[j][i] : values[i],
                bar = this.g.finger(x, Y + barheight / 2, Math.round(val * X), barheight - 1, false, type).attr({stroke: "none", fill: colors[multi ? j : i]});
            if (multi) {
                bars[j].push(bar);
            } else {
                bars.push(bar);
            }
            bar.x = x + Math.round(val * X);
            bar.y = Y + barheight / 2;
            bar.w = Math.round(val * X);
            bar.h = barheight;
            bar.value = +val;
            if (!opts.stacked) {
                Y += barheight;
            } else {
                stack.push(bar);
            }
        }
        if (opts.stacked) {
            var cvr = this.rect(x, stack[0].y - stack[0].h / 2, width, barheight).attr(this.g.shim);
            covers2.push(cvr);
            cvr.bars = this.set();
            var size = 0;
            for (var s = stack.length; s--;) {
                stack[s].toFront();
            }
            for (var s = 0, ss = stack.length; s < ss; s++) {
                var bar = stack[s],
                    cover,
                    val = Math.round((size + bar.value) * X),
                    path = this.g.finger(x, bar.y, val, barheight - 1, false, type, 1);
                cvr.bars.push(bar);
                size && bar.attr({path: path});
                bar.w = val;
                bar.x = x + val;
                covers.push(cover = this.rect(x + size * X, bar.y - bar.h / 2, bar.value * X, barheight).attr(this.g.shim));
                cover.bar = bar;
                size += bar.value;
            }
            Y += barheight;
        }
        Y += bargutter;
    }
    covers2.toFront();
    Y = y + bargutter;
    if (!opts.stacked) {
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < (multi || 1); j++) {
                var cover = this.rect(x, Y, width, barheight).attr(this.g.shim);
                covers.push(cover);
                cover.bar = multi ? bars[j][i] : bars[i];
                cover.value = cover.bar.value;
                Y += barheight;
            }
            Y += bargutter;
        }
    }
    chart.label = function (labels, isRight) {
        labels = labels || [];
        this.labels = paper.set();
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < multi; j++) {
                var  label = paper.g.labelise(multi ? labels[j] && labels[j][i] : labels[i], multi ? values[j][i] : values[i], total);
                var X = isRight ? bars[i * (multi || 1) + j].x - barheight / 2 + 3 : x + 5,
                    A = isRight ? "end" : "start",
                    L;
                this.labels.push(L = paper.g.text(X, bars[i * (multi || 1) + j].y, label).attr({"text-anchor": A}).insertBefore(covers[0]));
                if (L.getBBox().x < x + 5) {
                    L.attr({x: x + 5, "text-anchor": "start"});
                } else {
                    bars[i * (multi || 1) + j].label = L;
                }
            }
        }
        return this;
    };
    chart.hover = function (fin, fout) {
        covers2.hide();
        covers.show();
        fout = fout || function () {};
        covers.mouseover(fin).mouseout(fout);
        return this;
    };
    chart.hoverColumn = function (fin, fout) {
        covers.hide();
        covers2.show();
        fout = fout || function () {};
        covers2.mouseover(fin).mouseout(fout);
        return this;
    };
    chart.each = function (f) {
        if (!Raphael.is(f, "function")) {
            return this;
        }
        for (var i = covers.length; i--;) {
            f.call(covers[i]);
        }
        return this;
    };
    chart.eachColumn = function (f) {
        if (!Raphael.is(f, "function")) {
            return this;
        }
        for (var i = covers2.length; i--;) {
            f.call(covers2[i]);
        }
        return this;
    };
    chart.click = function (f) {
        covers2.hide();
        covers.show();
        covers.click(f);
        return this;
    };
    chart.clickColumn = function (f) {
        covers.hide();
        covers2.show();
        covers2.click(f);
        return this;
    };
    chart.push(bars, covers, covers2);
    chart.bars = bars;
    chart.covers = covers;
    return chart;
};
/*!
 * g.Raphael 0.4.1 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
Raphael.fn.g.dotchart = function (x, y, width, height, valuesx, valuesy, size, opts) {
    function drawAxis(ax) {
        +ax[0] && (ax[0] = paper.g.axis(x + gutter, y + gutter, width - 2 * gutter, minx, maxx, opts.axisxstep || Math.floor((width - 2 * gutter) / 20), 2, opts.axisxlabels || null, opts.axisxtype || "t"));
        +ax[1] && (ax[1] = paper.g.axis(x + width - gutter, y + height - gutter, height - 2 * gutter, miny, maxy, opts.axisystep || Math.floor((height - 2 * gutter) / 20), 3, opts.axisylabels || null, opts.axisytype || "t"));
        +ax[2] && (ax[2] = paper.g.axis(x + gutter, y + height - gutter + maxR, width - 2 * gutter, minx, maxx, opts.axisxstep || Math.floor((width - 2 * gutter) / 20), 0, opts.axisxlabels || null, opts.axisxtype || "t"));
        +ax[3] && (ax[3] = paper.g.axis(x + gutter - maxR, y + height - gutter, height - 2 * gutter, miny, maxy, opts.axisystep || Math.floor((height - 2 * gutter) / 20), 1, opts.axisylabels || null, opts.axisytype || "t"));
    }
    opts = opts || {};
    var xdim = this.g.snapEnds(Math.min.apply(Math, valuesx), Math.max.apply(Math, valuesx), valuesx.length - 1),
        minx = xdim.from,
        maxx = xdim.to,
        gutter = opts.gutter || 10,
        ydim = this.g.snapEnds(Math.min.apply(Math, valuesy), Math.max.apply(Math, valuesy), valuesy.length - 1),
        miny = ydim.from,
        maxy = ydim.to,
        len = Math.max(valuesx.length, valuesy.length, size.length),
        symbol = this.g.markers[opts.symbol] || "disc",
        res = this.set(),
        series = this.set(),
        max = opts.max || 100,
        top = Math.max.apply(Math, size),
        R = [],
        paper = this,
        k = Math.sqrt(top / Math.PI) * 2 / max;

    for (var i = 0; i < len; i++) {
        R[i] = Math.min(Math.sqrt(size[i] / Math.PI) * 2 / k, max);
    }
    gutter = Math.max.apply(Math, R.concat(gutter));
    var axis = this.set(),
        maxR = Math.max.apply(Math, R);
    if (opts.axis) {
        var ax = (opts.axis + "").split(/[,\s]+/);
        drawAxis(ax);
        var g = [], b = [];
        for (var i = 0, ii = ax.length; i < ii; i++) {
            var bb = ax[i].all ? ax[i].all.getBBox()[["height", "width"][i % 2]] : 0;
            g[i] = bb + gutter;
            b[i] = bb;
        }
        gutter = Math.max.apply(Math, g.concat(gutter));
        for (var i = 0, ii = ax.length; i < ii; i++) if (ax[i].all) {
            ax[i].remove();
            ax[i] = 1;
        }
        drawAxis(ax);
        for (var i = 0, ii = ax.length; i < ii; i++) if (ax[i].all) {
            axis.push(ax[i].all);
        }
        res.axis = axis;
    }
    var kx = (width - gutter * 2) / ((maxx - minx) || 1),
        ky = (height - gutter * 2) / ((maxy - miny) || 1);
    for (var i = 0, ii = valuesy.length; i < ii; i++) {
        var sym = this.raphael.is(symbol, "array") ? symbol[i] : symbol,
            X = x + gutter + (valuesx[i] - minx) * kx,
            Y = y + height - gutter - (valuesy[i] - miny) * ky;
        sym && R[i] && series.push(this.g[sym](X, Y, R[i]).attr({fill: opts.heat ? this.g.colorValue(R[i], maxR) : Raphael.fn.g.colors[0], "fill-opacity": opts.opacity ? R[i] / max : 1, stroke: "none"}));
    }
    var covers = this.set();
    for (var i = 0, ii = valuesy.length; i < ii; i++) {
        var X = x + gutter + (valuesx[i] - minx) * kx,
            Y = y + height - gutter - (valuesy[i] - miny) * ky;
        covers.push(this.circle(X, Y, maxR).attr(this.g.shim));
        opts.href && opts.href[i] && covers[i].attr({href: opts.href[i]});
        covers[i].r = +R[i].toFixed(3);
        covers[i].x = +X.toFixed(3);
        covers[i].y = +Y.toFixed(3);
        covers[i].X = valuesx[i];
        covers[i].Y = valuesy[i];
        covers[i].value = size[i] || 0;
        covers[i].dot = series[i];
    }
    res.covers = covers;
    res.series = series;
    res.push(series, axis, covers);
    res.hover = function (fin, fout) {
        covers.mouseover(fin).mouseout(fout);
        return this;
    };
    res.click = function (f) {
        covers.click(f);
        return this;
    };
    res.each = function (f) {
        if (!Raphael.is(f, "function")) {
            return this;
        }
        for (var i = covers.length; i--;) {
            f.call(covers[i]);
        }
        return this;
    };
    res.href = function (map) {
        var cover;
        for (var i = covers.length; i--;) {
            cover = covers[i];
            if (cover.X == map.x && cover.Y == map.y && cover.value == map.value) {
                cover.attr({href: map.href});
            }
        }
    };
    return res;
};
/*!
 * g.Raphael 0.4.2 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
Raphael.fn.g.linechart = function (x, y, width, height, valuesx, valuesy, opts) {
    function shrink(values, dim) {
        var k = values.length / dim,
            j = 0,
            l = k,
            sum = 0,
            res = [];
        while (j < values.length) {
            l--;
            if (l < 0) {
                sum += values[j] * (1 + l);
                res.push(sum / k);
                sum = values[j++] * -l;
                l += k;
            } else {
                sum += values[j++];
            }
        }
        return res;
    }
    function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
        var l1 = (p2x - p1x) / 2,
            l2 = (p3x - p2x) / 2,
            a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
            b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
        a = p1y < p2y ? Math.PI - a : a;
        b = p3y < p2y ? Math.PI - b : b;
        var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
            dx1 = l1 * Math.sin(alpha + a),
            dy1 = l1 * Math.cos(alpha + a),
            dx2 = l2 * Math.sin(alpha + b),
            dy2 = l2 * Math.cos(alpha + b);
        return {
            x1: p2x - dx1,
            y1: p2y + dy1,
            x2: p2x + dx2,
            y2: p2y + dy2
        };
    }
    opts = opts || {};
    if (!this.raphael.is(valuesx[0], "array")) {
        valuesx = [valuesx];
    }
    if (!this.raphael.is(valuesy[0], "array")) {
        valuesy = [valuesy];
    }
    var gutter = opts.gutter || 10,
        len = Math.max(valuesx[0].length, valuesy[0].length),
        symbol = opts.symbol || "",
        colors = opts.colors || Raphael.fn.g.colors,
        that = this,
        columns = null,
        dots = null,
        chart = this.set(),
        path = [];

    for (var i = 0, ii = valuesy.length; i < ii; i++) {
        len = Math.max(len, valuesy[i].length);
    }
    var shades = this.set();
    for (i = 0, ii = valuesy.length; i < ii; i++) {
        if (opts.shade) {
            shades.push(this.path().attr({stroke: "none", fill: colors[i], opacity: opts.nostroke ? 1 : .3}));
        }
        if (valuesy[i].length > width - 2 * gutter) {
            valuesy[i] = shrink(valuesy[i], width - 2 * gutter);
            len = width - 2 * gutter;
        }
        if (valuesx[i] && valuesx[i].length > width - 2 * gutter) {
            valuesx[i] = shrink(valuesx[i], width - 2 * gutter);
        }
    }
    var allx = Array.prototype.concat.apply([], valuesx),
        ally = Array.prototype.concat.apply([], valuesy),
        xdim = this.g.snapEnds(Math.min.apply(Math, allx), Math.max.apply(Math, allx), valuesx[0].length - 1);
        if(opts.clip) {
            var minx = opts.minx || xdim.from,
                maxx = opts.maxx || xdim.to,
                ydim = this.g.snapEnds(Math.min.apply(Math, ally), Math.max.apply(Math, ally), valuesy[0].length - 1),
                miny = opts.miny || ydim.from,
                maxy = opts.maxy || ydim.to;
        } else {
            var minx = opts.minx && Math.min(opts.minx, xdim.from) || xdim.from,
                maxx = opts.maxx && Math.max(opts.maxx, xdimt.to) || xdim.to,
                ydim = this.g.snapEnds(Math.min.apply(Math, ally), Math.max.apply(Math, ally), valuesy[0].length - 1),
                miny = opts.miny && Math.min(opts.miny, ydim.from) || ydim.from,
                maxy = opts.maxy && Math.max(opts.maxy, ydim.to) || ydim.to;
        }
        kx = (width - gutter * 2) / ((maxx - minx) || 1),
        ky = (height - gutter * 2) / ((maxy - miny) || 1);

    var lines = this.set(),
        symbols = this.set(),
        line;
    for (i = 0, ii = valuesy.length; i < ii; i++) {
        if (!opts.nostroke) {
            lines.push(line = this.path().attr({
                stroke: colors[i],
                "stroke-width": opts.width || 2,
                "stroke-linejoin": "round",
                "stroke-linecap": "round",
                "stroke-dasharray": opts.dash || ""
            }));
        }
        var sym = this.raphael.is(symbol, "array") ? symbol[i] : symbol,
            symset = this.set();
        path = [];
        for (var j = 0, jj = valuesy[i].length; j < jj; j++) {
            var X = x + gutter + ((valuesx[i] || valuesx[0])[j] - minx) * kx,
                Y = y + height - gutter - (valuesy[i][j] - miny) * ky;
            (Raphael.is(sym, "array") ? sym[j] : sym) && symset.push(this.g[Raphael.fn.g.markers[this.raphael.is(sym, "array") ? sym[j] : sym]](X, Y, (opts.width || 2) * 3).attr({fill: colors[i], stroke: "none"}));
            if (opts.smooth) {
                if (j && j != jj - 1) {
                    var X0 = x + gutter + ((valuesx[i] || valuesx[0])[j - 1] - minx) * kx,
                        Y0 = y + height - gutter - (valuesy[i][j - 1] - miny) * ky,
                        X2 = x + gutter + ((valuesx[i] || valuesx[0])[j + 1] - minx) * kx,
                        Y2 = y + height - gutter - (valuesy[i][j + 1] - miny) * ky;
                    var a = getAnchors(X0, Y0, X, Y, X2, Y2);
                    path = path.concat([a.x1, a.y1, X, Y, a.x2, a.y2]);
                }
                if (!j) {
                    path = ["M", X, Y, "C", X, Y];
                }
            } else {
                path = path.concat([j ? "L" : "M", X, Y]);
            }
        }
        if (opts.smooth) {
            path = path.concat([X, Y, X, Y]);
        }
        symbols.push(symset);
        if (opts.shade) {
            shades[i].attr({path: path.concat(["L", X, y + height - gutter, "L",  x + gutter + ((valuesx[i] || valuesx[0])[0] - minx) * kx, y + height - gutter, "z"]).join(",")});
        }
        !opts.nostroke && line.attr({path: path.join(","), 'clip-rect': [x + gutter, y + gutter, width - 2 * gutter, height - 2 * gutter].join(",")});
    }

    function createColumns(f) {
        // unite Xs together
        var Xs = [];
        for (var i = 0, ii = valuesx.length; i < ii; i++) {
            Xs = Xs.concat(valuesx[i]);
        }
        Xs.sort(function(a,b) { return a - b; });
        // remove duplicates
        var Xs2 = [],
            xs = [];
        for (i = 0, ii = Xs.length; i < ii; i++) {
            Xs[i] != Xs[i - 1] && Xs2.push(Xs[i]) && xs.push(x + gutter + (Xs[i] - minx) * kx);
        }
        Xs = Xs2;
        ii = Xs.length;
        var cvrs = f || that.set();
        for (i = 0; i < ii; i++) {
            var X = xs[i] - (xs[i] - (xs[i - 1] || x)) / 2,
                w = ((xs[i + 1] || x + width) - xs[i]) / 2 + (xs[i] - (xs[i - 1] || x)) / 2,
                C;
            f ? (C = {}) : cvrs.push(C = that.rect(X - 1, y, Math.max(w + 1, 1), height).attr({stroke: "none", fill: "#000", opacity: 0}));
            C.values = [];
            C.symbols = that.set();
            C.y = [];
            C.x = xs[i];
            C.axis = Xs[i];
            for (var j = 0, jj = valuesy.length; j < jj; j++) {
                Xs2 = valuesx[j] || valuesx[0];
                for (var k = 0, kk = Xs2.length; k < kk; k++) {
                    if (Xs2[k] == Xs[i]) {
                        C.values.push(valuesy[j][k]);
                        C.y.push(y + height - gutter - (valuesy[j][k] - miny) * ky);
                        C.symbols.push(chart.symbols[j][k]);
                    }
                }
            }
            f && f.call(C);
        }
        !f && (columns = cvrs);
    }
    function createDots(f) {
        var cvrs = f || that.set(),
            C;
        for (var i = 0, ii = valuesy.length; i < ii; i++) {
            for (var j = 0, jj = valuesy[i].length; j < jj; j++) {
                var X = x + gutter + ((valuesx[i] || valuesx[0])[j] - minx) * kx,
                    nearX = x + gutter + ((valuesx[i] || valuesx[0])[j ? j - 1 : 1] - minx) * kx,
                    Y = y + height - gutter - (valuesy[i][j] - miny) * ky;
                f ? (C = {}) : cvrs.push(C = that.circle(X, Y, Math.abs(nearX - X) / 2).attr({stroke: "none", fill: "#000", opacity: 0}));
                C.x = X;
                C.y = Y;
                C.value = valuesy[i][j];
                C.line = chart.lines[i];
                C.shade = chart.shades[i];
                C.symbol = chart.symbols[i][j];
                C.symbols = chart.symbols[i];
                C.axis = (valuesx[i] || valuesx[0])[j];
                f && f.call(C);
            }
        }
        !f && (dots = cvrs);
    }

    var axis = this.set();
    if (opts.axis) {
        var ax = (opts.axis + "").split(/[,\s]+/);
        +ax[0] && axis.push(this.g.axis(x + gutter, y + gutter, width - 2 * gutter, minx, maxx, opts.axisxstep || Math.floor((width - 2 * gutter) / 20), 2, opts.axisxlabels || null, opts.axisxtype || "t"));
        +ax[1] && axis.push(this.g.axis(x + width - gutter, y + height - gutter, height - 2 * gutter, miny, maxy, opts.axisystep || Math.floor((height - 2 * gutter) / 20), 3, opts.axisylabels || null, opts.axisytype || "t"));
        +ax[2] && axis.push(this.g.axis(x + gutter, y + height - gutter, width - 2 * gutter, minx, maxx, opts.axisxstep || Math.floor((width - 2 * gutter) / 20), 0, opts.axisxlabels || null, opts.axisxtype || "t"));
        +ax[3] && axis.push(this.g.axis(x + gutter, y + height - gutter, height - 2 * gutter, miny, maxy, opts.axisystep || Math.floor((height - 2 * gutter) / 20), 1, opts.axisylabels || null, opts.axisytype || "t"));
    }

    chart.push(lines, shades, symbols, axis, columns, dots);
    chart.lines = lines;
    chart.shades = shades;
    chart.symbols = symbols;
    chart.axis = axis;
    chart.hoverColumn = function (fin, fout) {
        !columns && createColumns();
        columns.mouseover(fin).mouseout(fout);
        return this;
    };
    chart.clickColumn = function (f) {
        !columns && createColumns();
        columns.click(f);
        return this;
    };
    chart.hrefColumn = function (cols) {
        var hrefs = that.raphael.is(arguments[0], "array") ? arguments[0] : arguments;
        if (!(arguments.length - 1) && typeof cols == "object") {
            for (var x in cols) {
                for (var i = 0, ii = columns.length; i < ii; i++) if (columns[i].axis == x) {
                    columns[i].attr("href", cols[x]);
                }
            }
        }
        !columns && createColumns();
        for (i = 0, ii = hrefs.length; i < ii; i++) {
            columns[i] && columns[i].attr("href", hrefs[i]);
        }
        return this;
    };
    chart.hover = function (fin, fout) {
        !dots && createDots();
        dots.mouseover(fin).mouseout(fout);
        return this;
    };
    chart.click = function (f) {
        !dots && createDots();
        dots.click(f);
        return this;
    };
    chart.each = function (f) {
        createDots(f);
        return this;
    };
    chart.eachColumn = function (f) {
        createColumns(f);
        return this;
    };
    return chart;
};
/*!
 * g.Raphael 0.4.1 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
Raphael.fn.g.piechart = function (cx, cy, r, values, opts) {
    opts = opts || {};
    var paper = this,
        sectors = [],
        covers = this.set(),
        chart = this.set(),
        series = this.set(),
        order = [],
        len = values.length,
        angle = 0,
        total = 0,
        others = 0,
        cut = 9,
        defcut = true;

    var sum = 0;
    for (var i = 0; i < len; i++)
        sum += values[i];
    var single = false;
    var single_index = -1;
    for (var i = 0; i < len; i++)
        if (sum == values[i]) {
            single = true;
            single_index = i;
            break;
        }
    if (len == 1 || single == true) {
        for(var i = 0; i < len; i++) {
            var radius = 0.1;
            if (i == single_index) {
                radius = r;
            }
            series.push(this.circle(cx, cy, radius).attr({fill: opts.colors && opts.colors[i] || this.g.colors[i], stroke: opts.stroke || "#fff", "stroke-width": opts.strokewidth == null ? 1 : opts.strokewidth}));
            covers.push(this.circle(cx, cy, radius).attr({href: opts.href ? opts.href[i] : null}).attr(this.g.shim));
            values[i] = {value: values[i], order: i, valueOf: function () { return this.value; }};
            series[i].middle = {x: cx, y: cy};
            series[i].mangle = 180;
        }
        total = values[single_index];
    } else {
        function sector(cx, cy, r, startAngle, endAngle, fill) {
            var rad = Math.PI / 180,
                x1 = cx + r * Math.cos(-startAngle * rad),
                x2 = cx + r * Math.cos(-endAngle * rad),
                xm = cx + r / 2 * Math.cos(-(startAngle + (endAngle - startAngle) / 2) * rad),
                y1 = cy + r * Math.sin(-startAngle * rad),
                y2 = cy + r * Math.sin(-endAngle * rad),
                ym = cy + r / 2 * Math.sin(-(startAngle + (endAngle - startAngle) / 2) * rad),
                res = ["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(Math.abs(endAngle - startAngle) > 180), 1, x2, y2, "z"];
            res.middle = {x: xm, y: ym};
            return res;
        }
        for (var i = 0; i < len; i++) {
            total += values[i];
            values[i] = {value: values[i], order: i, valueOf: function () { return this.value; }};
        }
        values.sort(function (a, b) {
            return b.value - a.value;
        });
        for (i = 0; i < len; i++) {
            if (defcut && values[i] * 360 / total <= 1.5) {
                cut = i;
                defcut = false;
            }
            if (i > cut) {
                defcut = false;
                values[cut].value += values[i];
                values[cut].others = true;
                others = values[cut].value;
            }
        }
        len = Math.min(cut + 1, values.length);
        others && values.splice(len) && (values[cut].others = true);
        for (i = 0; i < len; i++) {
            var valueOrder = values[i].order;
            var mangle = angle - 360 * values[i] / total / 2;
            if (!i) {
                angle = 90 - mangle;
                mangle = angle - 360 * values[i] / total / 2;
            }
            if (opts.init) {
                var ipath = sector(cx, cy, 1, angle, angle - 360 * values[i] / total).join(",");
            }
            var path = sector(cx, cy, r, angle, angle -= 360 * values[i] / total);
            var p = this.path(opts.init ? ipath : path).attr({fill: opts.colors && opts.colors[valueOrder] || this.g.colors[valueOrder] || "#666", stroke: opts.stroke || "#fff", "stroke-width": (opts.strokewidth == null ? 1 : opts.strokewidth), "stroke-linejoin": "round"});
            p.value = values[i];
            p.middle = path.middle;
            p.mangle = mangle;
            sectors.push(p);
            series.push(p);
            opts.init && p.animate({path: path.join(",")}, (+opts.init - 1) || 1000, ">");
        }
        for (i = 0; i < len; i++) {
            p = paper.path(sectors[i].attr("path")).attr(this.g.shim);
            var valueOrder = values[i].order;
            opts.href && opts.href[valueOrder] && p.attr({href: opts.href[valueOrder]});
            //p.attr = function () {}; // this breaks translate!
            covers.push(p);
        }
    }

    chart.hover = function (fin, fout) {
        fout = fout || function () {};
        var that = this;
        for (var i = 0; i < len; i++) {
            (function (sector, cover, j) {
                var o = {
                    sector: sector,
                    cover: cover,
                    cx: cx,
                    cy: cy,
                    mx: sector.middle.x,
                    my: sector.middle.y,
                    mangle: sector.mangle,
                    r: r,
                    value: values[j],
                    total: total,
                    label: that.labels && that.labels[j]
                };
                cover.mouseover(function () {
                    fin.call(o);
                }).mouseout(function () {
                    fout.call(o);
                });
            })(series[i], covers[i], i);
        }
        return this;
    };
    // x: where label could be put
    // y: where label could be put
    // value: value to show
    // total: total number to count %
    chart.each = function (f) {
        var that = this;
        for (var i = 0; i < len; i++) {
            (function (sector, cover, j) {
                var o = {
                    sector: sector,
                    cover: cover,
                    cx: cx,
                    cy: cy,
                    x: sector.middle.x,
                    y: sector.middle.y,
                    mangle: sector.mangle,
                    r: r,
                    value: values[j],
                    total: total,
                    label: that.labels && that.labels[j]
                };
                f.call(o);
            })(series[i], covers[i], i);
        }
        return this;
    };
    chart.click = function (f) {
        var that = this;
        for (var i = 0; i < len; i++) {
            (function (sector, cover, j) {
                var o = {
                    sector: sector,
                    cover: cover,
                    cx: cx,
                    cy: cy,
                    mx: sector.middle.x,
                    my: sector.middle.y,
                    mangle: sector.mangle,
                    r: r,
                    value: values[j],
                    total: total,
                    label: that.labels && that.labels[j]
                };
                cover.click(function () { f.call(o); });
            })(series[i], covers[i], i);
        }
        return this;
    };
    chart.inject = function (element) {
        element.insertBefore(covers[0]);
    };
    var legend = function (labels, otherslabel, mark, dir) {
        var x = cx + r + r / 5,
            y = cy,
            h = y + 10;
        labels = labels || [];
        dir = (dir && dir.toLowerCase && dir.toLowerCase()) || "east";
        mark = paper.g.markers[mark && mark.toLowerCase()] || "disc";
        chart.labels = paper.set();
        for (var i = 0; i < len; i++) {
            var clr = series[i].attr("fill"),
                j = values[i].order,
                txt;
            values[i].others && (labels[j] = otherslabel || "Others");
            labels[j] = paper.g.labelise(labels[j], values[i], total);
            chart.labels.push(paper.set());
            chart.labels[i].push(paper.g[mark](x + 5, h, 5).attr({fill: clr, stroke: "none"}));
            chart.labels[i].push(txt = paper.text(x + 20, h, labels[j] || values[j]).attr(paper.g.txtattr).attr({fill: opts.legendcolor || "#000", "text-anchor": "start"}));
            covers[i].label = chart.labels[i];
            h += txt.getBBox().height * 1.2;
        }
        var bb = chart.labels.getBBox(),
            tr = {
                east: [0, -bb.height / 2],
                west: [-bb.width - 2 * r - 20, -bb.height / 2],
                north: [-r - bb.width / 2, -r - bb.height - 10],
                south: [-r - bb.width / 2, r + 10]
            }[dir];
        chart.labels.translate.apply(chart.labels, tr);
        chart.push(chart.labels);
    };
    if (opts.legend) {
        legend(opts.legend, opts.legendothers, opts.legendmark, opts.legendpos);
    }
    chart.push(series, covers);
    chart.series = series;
    chart.covers = covers;
    
    var w = paper.width,
        h = paper.height,
        bb = chart.getBBox(),
        tr = [(w - bb.width)/2 - bb.x, (h - bb.height)/2 - bb.y];
    cx += tr[0];
    cy += tr[1];
    chart.translate.apply(chart, tr);
    return chart;
};

/*!
 * date-range-parser.js
 * Contributed to the Apache Software Foundation by:
 *    Ben Birch - Aconex
 * fork me at https://github.com/mobz/date-range-parser

Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.

*/

(function() {

	var drp = window.dateRangeParser = {};

	drp.defaultRange = 1000 * 60 * 60 * 24;

	drp.now = null; // set a different value for now than the time at function invocation

	drp.parse = function(v) {
		try {
			var r = drp._parse(v);
			r.end && r.end--; // remove 1 millisecond from the final end range
		} catch(e) {
			r = null;
		}
		return r;
	};

	drp.print = function(t, p) {
		var format = ["", "-", "-", " ", ":", ":", "."];
		var da = makeArray(t);
		var str = "";
		for(var i = 0; i <= p; i++) {
			str += format[i] + (da[i] < 10 ? "0" : "") + da[i];
		}
		return str;
	};

	(function() {
		drp._relTokens = {};

		var values = {
			"yr"  : 365*24*60*60*1000,
			"mon" : 31*24*60*60*1000,
			"day" : 24*60*60*1000,
			"hr"  : 60*60*1000,
			"min" : 60*1000,
			"sec" : 1000
		};

		var alias_lu = {
			"yr" : "y,yr,yrs,year,years",
			"mon" : "mo,mon,mos,mons,month,months",
			"day" : "d,dy,dys,day,days",
			"hr" : "h,hr,hrs,hour,hours",
			"min" : "m,min,mins,minute,minutes",
			"sec" : "s,sec,secs,second,seconds"
		};

		for(var key in alias_lu) {
			if(alias_lu.hasOwnProperty(key)) {
				var aliases = alias_lu[key].split(",");
				for(var i = 0; i < aliases.length; i++) {
					drp._relTokens[aliases[i]] = values[key];
				}
			}
		}
	})();

	function makeArray(d) {
		var da = new Date(d);
		return [ da.getUTCFullYear(), da.getUTCMonth()+1, da.getUTCDate(), da.getUTCHours(), da.getUTCMinutes(), da.getUTCSeconds(), da.getUTCMilliseconds() ];
	}

	function fromArray(a) {
		var d = [].concat(a); d[1]--;
		return Date.UTC.apply(null, d);
	}

	drp._parse = function parse(v) {
		var now = this.now || new Date().getTime();

		function precArray(d, p, offset) {
			var tn = makeArray(d);
			tn[p] += offset || 0;
			for(var i = p+1; i < 7; i++) {
				tn[i] = i < 3 ? 1 : 0;
			}
			return tn;
		}
		function makePrecRange(dt, p, r) {
			var ret = { };
			ret.start = fromArray(dt);
			dt[p] += r || 1;
			ret.end = fromArray(dt);
			return ret;
		}
		function procTerm(term) {
			var m = term.replace(/\s/g, "").toLowerCase().match(/^([a-z ]+)$|^([ 0-9:-]+)$|^(\d+[a-z]+)$/);
			if(m[1]) {	// matches ([a-z ]+)
				function dra(p, o, r) {
					var dt = precArray(now, p, o);
					if(r) {
						dt[2] -= new Date(fromArray(dt)).getUTCDay();
					}
					return makePrecRange(dt, p, r);
				}
				switch( m[1]) {
					case "now" : return { start: now, end: now, now: now };
					case "today" : return dra( 2, 0 );
					case "thisweek" : return dra( 2, 0, 7 );
					case "thismonth" : return dra( 1, 0 );
					case "thisyear" : return dra( 0, 0 );
					case "yesterday" : return dra( 2, -1 );
					case "lastweek" : return dra( 2, -7, 7 );
					case "lastmonth" : return dra( 1, -1 );
					case "lastyear" : return dra( 0, -1 );
					case "tomorrow" : return dra( 2, 1 );
					case "nextweek" : return dra( 2, 7, 7 );
					case "nextmonth" : return dra( 1, 1 );
					case "nextyear" : return dra(0, 1 );
				}
				throw "unknown token " +  m[1];
			} else if(m[2]) { // matches ([ 0-9:-]+)
				dn = makeArray(now);
				var dt = m[2].match(/^(?:(\d{4})(?:\-(\d\d))?(?:\-(\d\d))?)? ?(?:(\d{1,2})(?:\:(\d\d)(?:\:(\d\d))?)?)?$/);
				dt.shift();
				for(var p = 0, z = false, i = 0; i < 7; i++) {
					if(dt[i]) {
						dn[i] = parseInt(dt[i], 10);
						p = i;
						z = true;
					} else {
						if(z)
							dn[i] = i < 3 ? 1 : 0;
					}
				}
				return makePrecRange(dn, p);
			} else if(m[3]) { // matches (\d+[a-z]{1,4})
				var dr = m[3].match(/(\d+)\s*([a-z]+)/i);
				var n = parseInt(dr[1], 10);
				return { rel: n * drp._relTokens[dr[2]] };
			}
			throw "unknown term " + term;
		}

		if(!v) {
			return { start: null, end: null };
		}
		var terms = v.split(/\s*([^<>]*[^<>-])?\s*(->|<>|<)?\s*([^<>]+)?\s*/);

		var term1 = terms[1] ? procTerm(terms[1]) : null;
		var op = terms[2] || "";
		var term2 = terms[3] ? procTerm(terms[3]) : null;

		if(op === "<" || op === "->" ) {
			if(term1 && !term2) {
				return { start: term1.start, end: null };
			} else if(!term1 && term2) {
				return { start: null, end: term2.end };
			} else {
				if(term2.rel) {
					return { start: term1.start, end: term1.end + term2.rel };
				} else if(term1.rel) {
					return { start: term2.start - term1.rel, end: term2.end };
				} else {
					return { start: term1.start, end: term2.end };
				}
			}
		} else if(op === "<>") {
			if(!term2) {
				return { start: term1.start - drp.defaultRange, end: term1.end + drp.defaultRange }
			} else {
				if(! ("rel" in term2)) throw "second term did not hav a range";
				return { start: term1.start - term2.rel, end: term1.end + term2.rel };
			}
		} else {
			if(term1.rel) {
				return { start: now - term1.rel, end: now + term1.rel };
			} else if(term1.now) {
				return { start: term1.now - drp.defaultRange, end: term1.now + drp.defaultRange };
			} else {
				return { start: term1.start, end: term1.end };
			}
		}
		throw "could not process value " + v;
	};
})();
(function() {
	/**
	 * provides text formatting and i18n key storage features<br>
	 * implements most of the Sun Java MessageFormat functionality.
	 * @see <a href="http://java.sun.com/j2se/1.5.0/docs/api/java/text/MessageFormat.html" target="sun">Sun's Documentation</a>
	 */

	var keys = {};

	var format = function(message, args) {
		var substitute = function() {
			var format = arguments[1].split(',');
			var substr = escape(args[format.shift()]);
			if(format.length === 0) {
				return substr; // simple substitution eg {0}
			}
			switch(format.shift()) {
				case "number" : return (new Number(substr)).toLocaleString();
				case "date" : return (new Date(+substr)).toLocaleDateString(); // date and time require milliseconds since epoch
				case "time" : return (new Date(+substr)).toLocaleTimeString(); //  eg i18n.text("Key", +(new Date())); for current time
			}
			var styles = format.join("").split("|").map(function(style) {
				return style.match(/(-?[\.\d]+)(#|<)([^{}]*)/);
			});
			var match = styles[0][3];
			for(var i=0; i<styles.length; i++) {
				if((styles[i][2] === "#" && (+styles[i][1]) === (+substr)) ||
						(styles[i][2] === "<" && ((+styles[i][1]) < (+substr)))) {
					match = styles[i][3];
				}
			}
			return match;
		};

		return message && message.replace(/'(')|'([^']+)'|([^{']+)|([^']+)/g, function(x, sq, qs, ss, sub) {
			do {} while(sub && (sub !== (sub = (sub.replace(/\{([^{}]+)\}/, substitute)))));
			return sq || qs || ss || unescape(sub);
		});
	};

	this.i18n = {

		setKeys: function(strings) {
			for(var key in strings) {
				keys[key] = strings[key];
			}
		},

		text: function() {
			var args = Array.prototype.slice.call(arguments),
				key = keys[args.shift()];
			if(args.length === 0) {
				return key;
			}
			return format(key, args);
		},

		complex: function() {
			var args = Array.prototype.slice.call(arguments),
				key = keys[args.shift()],
				ret = [],
				replacer = function(x, pt, sub) { ret.push(pt || args[+sub]); return ""; };
			do {} while(key && key !== (key = key.replace(/([^{]+)|\{(\d+)\}/, replacer )));
			return ret;
		}

	};

})();


(function() {
	var nav = window.navigator;
	var userLang = ( nav.languages && nav.languages[0] ) || nav.language || nav.userLanguage;
	var scripts = document.getElementsByTagName('script');
	var data = scripts[ scripts.length - 1].dataset;
	if( ! data["langs"] ) {
		return;
	}
	var langs = data["langs"].split(/\s*,\s*/);
	var script0 = scripts[0];
	function install( lang ) {
		var s = document.createElement("script");
		s.src = data["basedir"] + "/" + lang + '_strings.js';
		s.async = false;
		script0.parentNode.appendChild(s);
		script0 = s;
	}

	install( langs.shift() ); // always install primary language
	userLang && langs
		.filter( function( lang ) { return userLang.indexOf( lang ) === 0; } )
		.forEach( install );
}());

(function() {

	var window = this,
		$ = jQuery;

	function ns( namespace ) {
		return (namespace || "").split(".").reduce( function( space, name ) {
			return space[ name ] || ( space[ name ] = { ns: ns } );
		}, this );
	}

	var app = ns("app");

	var acx = ns("acx");

	/**
	 * object iterator, returns an array with one element for each property of the object
	 * @function
	 */
	acx.eachMap = function(obj, fn, thisp) {
		var ret = [];
		for(var n in obj) {
			ret.push(fn.call(thisp, n, obj[n], obj));
		}
		return ret;
	};

	/**
	 * augments the first argument with the properties of the second and subsequent arguments
	 * like {@link $.extend} except that existing properties are not overwritten
	 */
	acx.augment = function() {
		var args = Array.prototype.slice.call(arguments),
			src = (args.length === 1) ? this : args.shift(),
			augf = function(n, v) {
				if(! (n in src)) {
					src[n] = v;
				}
			};
		for(var i = 0; i < args.length; i++) {
			$.each(args[i], augf);
		}
		return src;
	};

	/**
	 * tests whether the argument is an array
	 * @function
	 */
	acx.isArray = $.isArray;

	/**
	 * tests whether the argument is an object
	 * @function
	 */
	acx.isObject = function (value) {
		return Object.prototype.toString.call(value) == "[object Object]";
	};

	/**
	 * tests whether the argument is a function
	 * @function
	 */
	acx.isFunction = $.isFunction;

	/**
	 * tests whether the argument is a date
	 * @function
	 */
	acx.isDate = function (value) {
		return Object.prototype.toString.call(value) == "[object Date]";
	};

	/**
	 * tests whether the argument is a regexp
	 * @function
	 */
	acx.isRegExp = function (value) {
		return Object.prototype.toString.call(value) == "[object RegExp]";
	};

	/**
	 * tests whether the value is blank or empty
	 * @function
	 */
	acx.isEmpty = function (value, allowBlank) {
		return value === null || value === undefined || ((acx.isArray(value) && !value.length)) || (!allowBlank ? value === '' : false);
	};

	/**
	 * data type for performing chainable geometry calculations<br>
	 * can be initialised x,y | {x, y} | {left, top}
	 */
	acx.vector = function(x, y) {
		return new acx.vector.prototype.Init(x, y);
	};

	acx.vector.prototype = {
		Init : function(x, y) {
			x = x || 0;
			this.y = isFinite(x.y) ? x.y : (isFinite(x.top) ? x.top : (isFinite(y) ? y : 0));
			this.x = isFinite(x.x) ? x.x : (isFinite(x.left) ? x.left : (isFinite(x) ? x : 0));
		},
		
		add : function(i, j) {
			var d = acx.vector(i, j);
			return new this.Init(this.x + d.x, this.y + d.y);
		},
		
		sub : function(i, j) {
			var d = acx.vector(i, j);
			return new this.Init(this.x - d.x, this.y - d.y);
		},
		
		addX : function(i) {
			return new this.Init(this.x + i, this.y);
		},
		
		addY : function(j) {
			return new this.Init(this.x, this.y + j);
		},

		mod : function(fn) { // runs a function against the x and y values
			return new this.Init({x: fn.call(this, this.x, "x"), y: fn.call(this, this.y, "y")});
		},
		
		/** returns true if this is within a rectangle formed by the points p and q */
		within : function(p, q) {
			return ( this.x >= ((p.x < q.x) ? p.x : q.x) && this.x <= ((p.x > q.x) ? p.x : q.x) &&
					this.y >= ((p.y < q.y) ? p.y : q.y) && this.y <= ((p.y > q.y) ? p.y : q.y) );
		},
		
		asOffset : function() {
			return { top: this.y, left: this.x };
		},
		
		asSize : function() {
			return { height: this.y, width: this.x };
		}
	};

	acx.vector.prototype.Init.prototype = acx.vector.prototype;

	/**
	 * short cut functions for working with vectors and jquery.
	 * Each function returns the equivalent jquery value in a two dimentional vector
	 */
	$.fn.vSize = function() { return acx.vector(this.width(), this.height()); };
	$.fn.vOuterSize = function(margin) { return acx.vector(this.outerWidth(margin), this.outerHeight(margin)); };
	$.fn.vScroll = function() { return acx.vector(this.scrollLeft(), this.scrollTop()); };
	$.fn.vOffset = function() { return acx.vector(this.offset()); };
	$.fn.vPosition = function() { return acx.vector(this.position()); };
	$.Event.prototype.vMouse = function() { return acx.vector(this.pageX, this.pageY); };

	/**
	 * object extensions (ecma5 compatible)
	 */
	acx.augment(Object, {
		keys: function(obj) {
			var ret = [];
			for(var n in obj) if(Object.prototype.hasOwnProperty.call(obj, n)) ret.push(n);
			return ret;
		}
	});

	/**
	 * Array prototype extensions
	 */
	acx.augment(Array.prototype, {
		'contains' : function(needle) {
			return this.indexOf(needle) !== -1;
		},

		// returns a new array consisting of all the members that are in both arrays
		'intersection' : function(b) {
			var ret = [];
			for(var i = 0; i < this.length; i++) {
				if(b.contains(this[i])) {
					ret.push(this[i]);
				}
			}
			return ret;
		},
		
		'remove' : function(value) {
			var i = this.indexOf(value);
			if(i !== -1) {
				this.splice(i, 1);
			}
		}
	});

	/**
	 * String prototype extensions
	 */
	acx.augment(String.prototype, {
		'contains' : function(needle) {
			return this.indexOf(needle) !== -1;
		},

		'equalsIgnoreCase' : function(match) {
			return this.toLowerCase() === match.toLowerCase();
		},

		'escapeHtml' : function() {
			return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		},

		'escapeJS' : function() {
			var meta = {'"':'\\"', '\\':'\\\\', '/':'\\/', '\b':'\\b', '\f':'\\f', '\n':'\\n', '\r':'\\r', '\t':'\\t'},
				xfrm = function(c) { return meta[c] || "\\u" + c.charCodeAt(0).toString(16).zeroPad(4); };
			return this.replace(new RegExp('(["\\\\\x00-\x1f\x7f-\uffff])', 'g'), xfrm);
		},

		'escapeRegExp' : function() {
			var ret = "", esc = "\\^$*+?.()=|{,}[]-";
			for ( var i = 0; i < this.length; i++) {
				ret += (esc.contains(this.charAt(i)) ? "\\" : "") + this.charAt(i);
			}
			return ret;
		},
		
		'zeroPad' : function(len) {
			return ("0000000000" + this).substring(this.length - len + 10);
		}
	});

	$.fn.forEach = Array.prototype.forEach;

	// joey / jquery integration
	$.joey = function( obj ) {
		return $( window.joey( obj ) );
	};

	window.joey.plugins.push( function( obj ) {
		if( obj instanceof jQuery ) {
			return obj[0];
		}
	});

})();

/**
 * base class for creating inheritable classes
 * based on resigs 'Simple Javascript Inheritance Class' (based on base2 and prototypejs)
 * modified with static super and auto config
 * @name Class
 * @constructor
 */
(function( $, app ){

	var ux = app.ns("ux");

	var initializing = false, fnTest = /\b_super\b/;

	ux.Class = function(){};

	ux.Class.extend = function(prop) {
		function Class() {
			if(!initializing) {
				var args = Array.prototype.slice.call(arguments);
				this.config = $.extend( function(t) { // automatically construct a config object based on defaults and last item passed into the constructor
					return $.extend(t._proto && t._proto() && arguments.callee(t._proto()) || {}, t.defaults);
				} (this) , args.pop() );
				this.init && this.init.apply(this, args); // automatically run the init function when class created
			}
		}

		initializing = true;
		var prototype = new this();
		initializing = false;
		
		var _super = this.prototype;
		prototype._proto = function() {
			return _super;
		};

		for(var name in prop) {
			prototype[name] = typeof prop[name] === "function" && typeof _super[name] === "function" && fnTest.test(prop[name]) ?
				(function(name, fn){
					return function() { this._super = _super[name]; return fn.apply(this, arguments); };
				})(name, prop[name]) : prop[name];
		}

		Class.prototype = prototype;
		Class.constructor = Class;

		Class.extend = arguments.callee; // make class extendable

		return Class;
	};
})( this.jQuery, this.app );

(function( app ) {

	var ut = app.ns("ut");

	ut.option_template = function(v) { return { tag: "OPTION", value: v, text: v }; };

	ut.require_template = function(f) { return f.require ? { tag: "SPAN", cls: "require", text: "*" } : null; };


	var sib_prefix = ['B','ki','Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi', 'Yi'];

	ut.byteSize_template = function(n) {
		var i = 0;
		while( n >= 1000 ) {
			i++;
			n /= 1024;
		}
		return (i === 0 ? n.toString() : n.toFixed( 3 - parseInt(n,10).toString().length )) + ( sib_prefix[ i ] || "..E" );
	};

	var sid_prefix = ['','k','M', 'G', 'T', 'P', 'E', 'Z', 'Y'];

	ut.count_template = function(n) {
		var i = 0;
		while( n >= 1000 ) {
			i++;
			n /= 1000;
		}
		return i === 0 ? n.toString() : ( n.toFixed( 3 - parseInt(n,10).toString().length ) + ( sid_prefix[ i ] || "..E" ) );
	};

})( this.app );

(function( app ) {

	var ux = app.ns("ux");

	ux.Observable = ux.Class.extend((function() {
		return {
			init: function() {
				this.observers = {};
				for( var opt in this.config ) { // automatically install observers that are defined in the configuration
					if( opt.indexOf( 'on' ) === 0 ) {
						this.on( opt.substring(2) , this.config[ opt ] );
					}
				}
			},
			_getObs: function( type ) {
				return ( this.observers[ type.toLowerCase() ] || ( this.observers[ type.toLowerCase() ] = [] ) );
			},
			on: function( type, fn, params, thisp ) {
				this._getObs( type ).push( { "cb" : fn, "args" : params || [] , "cx" : thisp || this } );
				return this;
			},
			fire: function( type ) {
				var params = Array.prototype.slice.call( arguments, 1 );
				this._getObs( type ).slice().forEach( function( ob ) {
					ob["cb"].apply( ob["cx"], ob["args"].concat( params ) );
				} );
				return this;
			},
			removeAllObservers: function() {
				this.observers = {};
			},
			removeObserver: function( type, fn ) {
				var obs = this._getObs( type ),
					index = obs.reduce( function(p, t, i) { return (t.cb === fn) ? i : p; }, -1 );
				if(index !== -1) {
					obs.splice( index, 1 );
				}
				return this; // make observable functions chainable
			},
			hasObserver: function( type ) {
				return !! this._getObs( type ).length;
			}
		};
	})());

})( this.app );
(function( app ) {

	var ux = app.ns("ux");

	var extend = ux.Observable.extend;
	var instance = function() {
		if( ! ("me" in this) ) {
			this.me = new this();
		}
		return this.me;
	};

	ux.Singleton = ux.Observable.extend({});

	ux.Singleton.extend = function() {
		var Self = extend.apply( this, arguments );
		Self.instance = instance;
		return Self;
	};

})( this.app );

(function( $, app ) {

	var ux = app.ns("ux");

	/**
	 * Provides drag and drop functionality<br>
	 * a DragDrop instance is created for each usage pattern and then used over and over again<br>
	 * first a dragObj is defined - this is the jquery node that will be dragged around<br>
	 * second, the event callbacks are defined - these allow you control the ui during dragging and run functions when successfully dropping<br>
	 * thirdly drop targets are defined - this is a list of DOM nodes, the constructor works in one of two modes:
	 * <li>without targets - objects can be picked up and dragged around, dragStart and dragStop events fire</li>
	 * <li>with targets - as objects are dragged over targets dragOver, dragOut and DragDrop events fire
	 * to start dragging call the DragDrop.pickup_handler() function, dragging stops when the mouse is released.
	 * @constructor
	 * The following options are supported
	 * <dt>targetSelector</dt>
	 *   <dd>an argument passed directly to jquery to create a list of targets, as such it can be a CSS style selector, or an array of DOM nodes<br>if target selector is null the DragDrop does Drag only and will not fire dragOver dragOut and dragDrop events</dd>
	 * <dt>pickupSelector</dt>
	 *   <dd>a jquery selector. The pickup_handler is automatically bound to matched elements (eg clicking on these elements starts the drag). if pickupSelector is null, the pickup_handler must be manually bound <code>$(el).bind("mousedown", dragdrop.pickup_handler)</code></dd>
	 * <dt>dragObj</dt>
	 *   <dd>the jQuery element to drag around when pickup is called. If not defined, dragObj must be set in onDragStart</dd>
	 * <dt>draggingClass</dt>
	 *   <dd>the class(es) added to items when they are being dragged</dd>
	 * The following observables are supported
	 * <dt>dragStart</dt>
	 *   <dd>a callback when start to drag<br><code>function(jEv)</code></dd>
	 * <dt>dragOver</dt>
	 *   <dd>a callback when we drag into a target<br><code>function(jEl)</code></dd>
	 * <dt>dragOut</dt>
	 *   <dd>a callback when we drag out of a target, or when we drop over a target<br><code>function(jEl)</code></dd>
	 * <dt>dragDrop</dt>
	 *   <dd>a callback when we drop on a target<br><code>function(jEl)</code></dd>
	 * <dt>dragStop</dt>
	 *   <dd>a callback when we stop dragging<br><code>function(jEv)</code></dd>
	 */
	ux.DragDrop = ux.Observable.extend({
		defaults : {
			targetsSelector : null,
			pickupSelector:   null,
			dragObj :         null,
			draggingClass :   "dragging"
		},

		init: function(options) {
			this._super(); // call the class initialiser
		
			this.drag_handler = this.drag.bind(this);
			this.drop_handler = this.drop.bind(this);
			this.pickup_handler = this.pickup.bind(this);
			this.targets = [];
			this.dragObj = null;
			this.dragObjOffset = null;
			this.currentTarget = null;
			if(this.config.pickupSelector) {
				$(this.config.pickupSelector).bind("mousedown", this.pickup_handler);
			}
		},

		drag : function(jEv) {
			jEv.preventDefault();
			var mloc = acx.vector( this.lockX || jEv.pageX, this.lockY || jEv.pageY );
			this.dragObj.css(mloc.add(this.dragObjOffset).asOffset());
			if(this.targets.length === 0) {
				return;
			}
			if(this.currentTarget !== null && mloc.within(this.currentTarget[1], this.currentTarget[2])) {
				return;
			}
			if(this.currentTarget !== null) {
				this.fire('dragOut', this.currentTarget[0]);
				this.currentTarget = null;
			}
			for(var i = 0; i < this.targets.length; i++) {
				if(mloc.within(this.targets[i][1], this.targets[i][2])) {
					this.currentTarget = this.targets[i];
					break;
				}
			}
			if(this.currentTarget !== null) {
				this.fire('dragOver', this.currentTarget[0]);
			}
		},
		
		drop : function(jEv) {
			$(document).unbind("mousemove", this.drag_handler);
			$(document).unbind("mouseup", this.drop_handler);
			this.dragObj.removeClass(this.config.draggingClass);
			if(this.currentTarget !== null) {
				this.fire('dragOut', this.currentTarget[0]);
				this.fire('dragDrop', this.currentTarget[0]);
			}
			this.fire('dragStop', jEv);
			this.dragObj = null;
		},
		
		pickup : function(jEv, opts) {
			$.extend(this.config, opts);
			this.fire('dragStart', jEv);
			this.dragObj = this.dragObj || this.config.dragObj;
			this.dragObjOffset = this.config.dragObjOffset || acx.vector(this.dragObj.offset()).sub(jEv.pageX, jEv.pageY);
			this.lockX = this.config.lockX ? jEv.pageX : 0;
			this.lockY = this.config.lockY ? jEv.pageY : 0;
			this.dragObj.addClass(this.config.draggingClass);
			if(!this.dragObj.get(0).parentNode || this.dragObj.get(0).parentNode.nodeType === 11) { // 11 = document fragment
				$(document.body).append(this.dragObj);
			}
			if(this.config.targetsSelector) {
				this.currentTarget = null;
				var targets = ( this.targets = [] );
				// create an array of elements optimised for rapid collision detection calculation
				$(this.config.targetsSelector).each(function(i, el) {
					var jEl = $(el);
					var tl = acx.vector(jEl.offset());
					var br = tl.add(jEl.width(), jEl.height());
					targets.push([jEl, tl, br]);
				});
			}
			$(document).bind("mousemove", this.drag_handler);
			$(document).bind("mouseup", this.drop_handler);
			this.drag_handler(jEv);
		}
	});

})( this.jQuery, this.app );

(function( app ) {

	var ux = app.ns("ux");

	ux.FieldCollection = ux.Observable.extend({
		defaults: {
			fields: []	// the collection of fields
		},
		init: function() {
			this._super();
			this.fields = this.config.fields;
		},
		validate: function() {
			return this.fields.reduce(function(r, field) {
				return r && field.validate();
			}, true);
		},
		getData: function(type) {
			return this.fields.reduce(function(r, field) {
				r[field.name] = field.val(); return r;
			}, {});
		}
	});

})( this.app );

(function( $, app ) {

	var data = app.ns("data");
	var ux = app.ns("ux");

	data.Model = ux.Observable.extend({
		defaults: {
			data: null
		},
		init: function() {
			this.set( this.config.data );
		},
		set: function( key, value ) {
			if( arguments.length === 1 ) {
				this._data = $.extend( {}, key );
			} else {
				key.split(".").reduce(function( ptr, prop, i, props) {
					if(i === (props.length - 1) ) {
						ptr[prop] = value;
					} else {
						if( !(prop in ptr) ) {
							ptr[ prop ] = {};
						}
						return ptr[prop];
					}
				}, this._data );
			}
		},
		get: function( key ) {
			return key.split(".").reduce( function( ptr, prop ) {
				return ( ptr && ( prop in ptr ) ) ? ptr[ prop ] : undefined;
			}, this._data );
		},
	});
})( this.jQuery, this.app );

(function( app ) {

	var data = app.ns("data");
	var ux = app.ns("ux");

	data.DataSourceInterface = ux.Observable.extend({
		/*
		properties
			meta = { total: 0 },
			headers = [ { name: "" } ],
			data = [ { column: value, column: value } ],
			sort = { column: "name", dir: "desc" }
		events
			data: function( DataSourceInterface )
		 */
		_getSummary: function(res) {
			this.summary = i18n.text("TableResults.Summary", res._shards.successful, res._shards.total, res.hits.total, (res.took / 1000).toFixed(3));
		},
		_getMeta: function(res) {
			this.meta = { total: res.hits.total, shards: res._shards, tool: res.took };
		}
	});

})( this.app );
(function( app ) {

	var data = app.ns("data");

	data.ResultDataSourceInterface = data.DataSourceInterface.extend({
		results: function(res) {
			this._getSummary(res);
			this._getMeta(res);
			this._getData(res);
			this.sort = {};
			this.fire("data", this);
		},
		_getData: function(res) {
			var columns = this.columns = [];
			this.data = res.hits.hits.map(function(hit) {
				var row = (function(path, spec, row) {
					for(var prop in spec) {
						if(acx.isObject(spec[prop])) {
							arguments.callee(path.concat(prop), spec[prop], row);
						} else if(acx.isArray(spec[prop])) {
							if(spec[prop].length) {
								arguments.callee(path.concat(prop), spec[prop][0], row)
							}
						} else {
							var dpath = path.concat(prop).join(".");
							if(! columns.contains(dpath)) {
								columns.push(dpath);
							}
							row[dpath] = (spec[prop] || "null").toString();
						}
					}
					return row;
				})([ hit._type ], hit, {});
				row._source = hit;
				return row;
			}, this);
		}
	});

})( this.app );

(function( app ) {

	/*
	notes on elasticsearch terminology used in this project

	indices[index] contains one or more
	types[type] contains one or more
	documents contain one or more
	paths[path]
	each path contains one element of data
	each path maps to one field

	eg PUT, "/twitter/tweet/1"
	{
		user: "mobz",
		date: "2011-01-01",
		message: "You know, for browsing elasticsearch",
		name: {
			first: "Ben",
			last: "Birch"
		}
	}

	creates
		1 index: twitter
				this is the collection of index data
		1 type: tweet
				this is the type of document (kind of like a table in sql)
		1 document: /twitter/tweet/1
				this is an actual document in the index ( kind of like a row in sql)
		5 paths: [ ["user"], ["date"], ["message"], ["name","first"], ["name","last"] ]
				since documents can be heirarchical this maps a path from a document root to a piece of data
		5 fields: [ "user", "date", "message", "first", "last" ]
				this is an indexed 'column' of data. fields are not heirarchical

		the relationship between a path and a field is called a mapping. mappings also contain a wealth of information about how es indexes the field

	notes
	1) a path is stored as an array, the dpath is  <index> . <type> . path.join("."),
			which can be considered the canonical reference for a mapping
	2) confusingly, es uses the term index for both the collection of indexed data, and the individually indexed fields
			so the term index_name is the same as field_name in this sense.

	*/

	var data = app.ns("data");
	var ux = app.ns("ux");

	var coretype_map = {
		"string" : "string",
		"keyword" : "string",
		"text" : "string",
		"byte" : "number",
		"short" : "number",
		"long" : "number",
		"integer" : "number",
		"float" : "number",
		"double" : "number",
		"ip" : "number",
		"date" : "date",
		"boolean" : "boolean",
		"binary" : "binary",
		"multi_field" : "multi_field"
	};

	var default_property_map = {
		"string" : { "store" : "no", "index" : "analysed" },
		"number" : { "store" : "no", "precision_steps" : 4 },
		"date" : { "store" : "no", "format" : "dateOptionalTime", "index": "yes", "precision_steps": 4 },
		"boolean" : { "store" : "no", "index": "yes" },
		"binary" : { },
		"multi_field" : { }
	};

	// parses metatdata from a cluster, into a bunch of useful data structures
	data.MetaData = ux.Observable.extend({
		defaults: {
			state: null // (required) response from a /_cluster/state request
		},
		init: function() {
			this._super();
			this.refresh(this.config.state);
		},
		getIndices: function(alias) {
			return alias ? this.aliases[alias] : this.indicesList;
		},
		// returns an array of strings containing all types that are in all of the indices passed in, or all types
		getTypes: function(indices) {
			var indices = indices || [], types = [];
			this.typesList.forEach(function(type) {
				for(var i = 0; i < indices.length; i++) {
					if(! this.indices[indices[i]].types.contains(type))
						return;
				}
				types.push(type);
			}, this);
			return types;
		},
		refresh: function(state) {
			// currently metadata expects all like named fields to have the same type, even when from different types and indices
			var aliases = this.aliases = {};
			var indices = this.indices = {};
			var types = this.types = {};
			var fields = this.fields = {};
			var paths = this.paths = {};

			function createField( mapping, index, type, path, name ) {
				var dpath = [ index, type ].concat( path ).join( "." );
				var field_name = mapping.index_name || path.join( "." );
				var field = paths[ dpath ] = fields[ field_name ] || $.extend({
					field_name : field_name,
					core_type : coretype_map[ mapping.type ],
					dpaths : []
				}, default_property_map[ coretype_map[ mapping.type ] ], mapping );

				if (field.type === "multi_field" && typeof field.fields !== "undefined") {
					for (var subField in field.fields) {
						field.fields[ subField ] = createField( field.fields[ subField ], index, type, path.concat( subField ), name + "." + subField );
					}
				}
				if (fields.dpaths) {
					field.dpaths.push(dpath);
				}
				return field;
			}
			function getFields(properties, type, index, listeners) {
				(function procPath(prop, path) {
					for (var n in prop) {
						if ("properties" in prop[n]) {
							procPath( prop[ n ].properties, path.concat( n ) );
						} else {
							var field = createField(prop[n], index, type, path.concat(n), n);							
							listeners.forEach( function( listener ) {
								listener[ field.field_name ] = field;
							} );
						}
					}
				})(properties, []);
			}
			for (var index in state.metadata.indices) {
				indices[index] = {
					types : [], fields : {}, paths : {}, parents : {}
				};
				indices[index].aliases = state.metadata.indices[index].aliases;
				indices[index].aliases.forEach(function(alias) {
					(aliases[alias] || (aliases[alias] = [])).push(index);
				});
				var mapping = state.metadata.indices[index].mappings;
				for (var type in mapping) {
					indices[index].types.push(type);
					if ( type in types) {
						types[type].indices.push(index);
					} else {
						types[type] = {
							indices : [index], fields : {}
						};
					}
					getFields(mapping[type].properties, type, index, [fields, types[type].fields, indices[index].fields]);
					if ( typeof mapping[type]._parent !== "undefined") {
						indices[index].parents[type] = mapping[type]._parent.type;
					}
				}
			}

			this.aliasesList = Object.keys(aliases);
			this.indicesList = Object.keys(indices);
			this.typesList = Object.keys(types);
			this.fieldsList = Object.keys(fields);
		}
	});

})( this.app );	

(function( app ) {

	var data = app.ns("data");
	var ux = app.ns("ux");

	data.MetaDataFactory = ux.Observable.extend({
		defaults: {
			cluster: null // (required) an app.services.Cluster
		},
		init: function() {
			this._super();
			var _cluster = this.config.cluster;
			this.config.cluster.get("_cluster/state", function(data) {
				this.metaData = new app.data.MetaData({state: data});
				this.fire("ready", this.metaData,  { originalData: data, "k": 1 }); // TODO originalData needed for legacy ui.FilterBrowser
			}.bind(this), function() {
				
				var _this = this;
				
				_cluster.get("_all", function( data ) {
					clusterState = {routing_table:{indices:{}}, metadata:{indices:{}}};
					
					for(var k in data) {
						clusterState["routing_table"]["indices"][k] = {"shards":{"1":[{
                            "state":"UNASSIGNED",
                            "primary":false,
                            "node":"unknown",
                            "relocating_node":null,
                            "shard":'?',
                            "index":k
                        }]}};
						

						clusterState["metadata"]["indices"][k] = {};
						clusterState["metadata"]["indices"][k]["mappings"] = data[k]["mappings"];
						clusterState["metadata"]["indices"][k]["aliases"] = $.makeArray(Object.keys(data[k]["aliases"]));
						clusterState["metadata"]["indices"][k]["settings"] = data[k]["settings"];
						clusterState["metadata"]["indices"][k]["fields"] = {};
					}
					
					_this.metaData = new app.data.MetaData({state: clusterState});
					_this.fire("ready", _this.metaData, {originalData: clusterState});
				});				

			}.bind(this));
		}
	});

})( this.app );

(function( app ) {

	var data = app.ns("data");
	var ux = app.ns("ux");

	data.Query = ux.Observable.extend({
		defaults: {
			cluster: null,  // (required) instanceof app.services.Cluster
			size: 50        // size of pages to return
		},
		init: function() {
			this._super();
			this.cluster = this.config.cluster;
			this.refuid = 0;
			this.refmap = {};
			this.indices = [];
			this.types = [];
			this.search = {
				query: { bool: { must: [], must_not: [], should: [] } },
				from: 0,
				size: this.config.size,
				sort: [],
				aggs: {},
				version: true
			};
			this.defaultClause = this.addClause();
			this.history = [ this.getState() ];
		},
		clone: function() {
			var q = new data.Query({ cluster: this.cluster });
			q.restoreState(this.getState());
			for(var uqid in q.refmap) {
				q.removeClause(uqid);
			}
			return q;
		},
		getState: function() {
			return $.extend(true, {}, { search: this.search, indices: this.indices, types: this.types });
		},
		restoreState: function(state) {
			state = $.extend(true, {}, state || this.history[this.history.length - 1]);
			this.indices = state.indices;
			this.types = state.types;
			this.search = state.search;
		},
		getData: function() {
			return JSON.stringify(this.search);
		},
		query: function() {
			var state = this.getState();
			this.cluster.post(
					(this.indices.join(",") || "_all") + "/" + ( this.types.length ? this.types.join(",") + "/" : "") + "_search",
					this.getData(),
					function(results) {
						if(results === null) {
							alert(i18n.text("Query.FailAndUndo"));
							this.restoreState();
							return;
						}
						this.history.push(state);

						this.fire("results", this, results);
					}.bind(this));
		},
		loadParents: function(res,metadata){
			//create data for mget
			var data = { docs :[] };
			var indexToTypeToParentIds = {};
			res.hits.hits.forEach(function(hit) {
			if (typeof hit.fields != "undefined"){
				if (typeof hit.fields._parent != "undefined"){
					var parentType = metadata.indices[hit._index].parents[hit._type];
					if (typeof indexToTypeToParentIds[hit._index] == "undefined"){
						indexToTypeToParentIds[hit._index] = new Object();
					}
					if (typeof indexToTypeToParentIds[hit._index][hit._type] == "undefined"){
						indexToTypeToParentIds[hit._index][hit._type] = new Object();
					}
					if (typeof indexToTypeToParentIds[hit._index][hit._type][hit.fields._parent] == "undefined"){
						indexToTypeToParentIds[hit._index][hit._type][hit.fields._parent] = null;
						data.docs.push({ _index:hit._index, _type:parentType, _id:hit.fields._parent});
					}
				}
			}
		});

		//load parents
		var state = this.getState();
			this.cluster.post("_mget",JSON.stringify(data),
				function(results) {
					if(results === null) {
						alert(i18n.text("Query.FailAndUndo"));
						this.restoreState();
						return;
					}
					this.history.push(state);
					var indexToTypeToParentIdToHit = new Object();
					results.docs.forEach(function(doc) {
						if (typeof indexToTypeToParentIdToHit[doc._index] == "undefined"){
						indexToTypeToParentIdToHit[doc._index] = new Object();
					}
					
					if (typeof indexToTypeToParentIdToHit[doc._index][doc._type] == "undefined"){
						indexToTypeToParentIdToHit[doc._index][doc._type] = new Object();
					}
					
					indexToTypeToParentIdToHit[doc._index][doc._type][doc._id] = doc;
					});
					
					res.hits.hits.forEach(function(hit) {
						if (typeof hit.fields != "undefined"){
							if (typeof hit.fields._parent != "undefined"){
								var parentType = metadata.indices[hit._index].parents[hit._type];
								hit._parent = indexToTypeToParentIdToHit[hit._index][parentType][hit.fields._parent];
							}
						}
					});

					this.fire("resultsWithParents", this, res);
				}.bind(this));
		},
		setPage: function(page) {
			this.search.from = this.config.size * (page - 1);
		},
		setSort: function(index, desc) {
			var sortd = {}; sortd[index] = { order: desc ? 'asc' : 'desc' };
			this.search.sort.unshift( sortd );
			for(var i = 1; i < this.search.sort.length; i++) {
				if(Object.keys(this.search.sort[i])[0] === index) {
					this.search.sort.splice(i, 1);
					break;
				}
			}
		},
		setIndex: function(index, add) {
			if(add) {
				if(! this.indices.contains(index)) this.indices.push(index);
			} else {
				this.indices.remove(index);
			}
			this.fire("setIndex", this, { index: index, add: !!add });
		},
		setType: function(type, add) {
			if(add) {
				if(! this.types.contains(type)) this.types.push(type);
			} else {
				this.types.remove(type);
			}
			this.fire("setType", this, { type: type, add: !!add });
		},
		addClause: function(value, field, op, bool) {
			bool = bool || "should";
			op = op || "match_all";
			field = field || "_all";
			var clause = this._setClause(value, field, op, bool);
			var uqid = "q-" + this.refuid++;
			this.refmap[uqid] = { clause: clause, value: value, field: field, op: op, bool: bool };
			if(this.search.query.bool.must.length + this.search.query.bool.should.length > 1) {
				this.removeClause(this.defaultClause);
			}
			this.fire("queryChanged", this, { uqid: uqid, search: this.search} );
			return uqid; // returns reference to inner query object to allow fast updating
		},
		removeClause: function(uqid) {
			var ref = this.refmap[uqid],
				bool = this.search.query.bool[ref.bool];
			bool.remove(ref.clause);
			if(this.search.query.bool.must.length + this.search.query.bool.should.length === 0) {
				this.defaultClause = this.addClause();
			}
		},
		addAggs: function(aggs) {
			var aggsId = "f-" + this.refuid++;
			this.search.aggs[aggsId] = aggs;
			this.refmap[aggsId] = { aggsId: aggsId, aggs: aggs };
			return aggsId;
		},
		removeAggs: function(aggsId) {
			delete this.search.aggs[aggsId];
			delete this.refmap[aggsId];
		},
		_setClause: function(value, field, op, bool) {
			var clause = {}, query = {};
			if(op === "match_all") {
			} else if(op === "query_string") {
				query["default_field"] = field;
				query["query"] = value;
			} else if(op === "missing") {
				op = "constant_score"
				var missing = {}, filter = {};
				missing["field"] = field;
				filter["missing"] = missing
				query["filter"] = filter;
			} else {
				query[field] = value;
			}
			clause[op] = query;
			this.search.query.bool[bool].push(clause);
			return clause;
		}
	});

})( this.app );

(function( app ) {

	var data = app.ns("data");

	data.QueryDataSourceInterface = data.DataSourceInterface.extend({
		defaults: {
			metadata: null, // (required) instanceof app.data.MetaData, the cluster metadata
			query: null     // (required) instanceof app.data.Query the data source
		},
		init: function() {
			this._super();
			this.config.query.on("results", this._results_handler.bind(this) );
			this.config.query.on("resultsWithParents", this._load_parents.bind(this) );
		},
		_results_handler: function(query, res) {
			this._getSummary(res);
			this._getMeta(res);
			var sort = query.search.sort[0] || { "_score": { order: "asc" }};
			var sortField = Object.keys(sort)[0];
			this.sort = { column: sortField, dir: sort[sortField].order };
			this._getData(res, this.config.metadata);
			this.fire("data", this);
		},
		_load_parents: function(query, res) {
			query.loadParents(res, this.config.metadata);
		},
		_getData: function(res, metadata) {
			var metaColumns = ["_index", "_type", "_id", "_score"];
			var columns = this.columns = [].concat(metaColumns);

			this.data = res.hits.hits.map(function(hit) {
				var row = (function(path, spec, row) {
					for(var prop in spec) {
						if(acx.isObject(spec[prop])) {
							arguments.callee(path.concat(prop), spec[prop], row);
						} else if(acx.isArray(spec[prop])) {
							if(spec[prop].length) {
								arguments.callee(path.concat(prop), spec[prop][0], row)
							}
						} else {
							var dpath = path.concat(prop).join(".");
							if(metadata.paths[dpath]) {
								var field_name = metadata.paths[dpath].field_name;
								if(! columns.contains(field_name)) {
									columns.push(field_name);
								}
								row[field_name] = (spec[prop] === null ? "null" : spec[prop] ).toString();
							} else {
								// TODO: field not in metadata index
							}
						}
					}
					return row;
				})([ hit._index, hit._type ], hit._source, {});
				metaColumns.forEach(function(n) { row[n] = hit[n]; });
				row._source = hit;
				if (typeof hit._parent!= "undefined") {
					(function(prefix, path, spec, row) {
					for(var prop in spec) {
						if(acx.isObject(spec[prop])) {
							arguments.callee(prefix, path.concat(prop), spec[prop], row);
						} else if(acx.isArray(spec[prop])) {
							if(spec[prop].length) {
								arguments.callee(prefix, path.concat(prop), spec[prop][0], row)
							}
						} else {
							var dpath = path.concat(prop).join(".");
							if(metadata.paths[dpath]) {
								var field_name = metadata.paths[dpath].field_name;
								var column_name = prefix+"."+field_name;
								if(! columns.contains(column_name)) {
									columns.push(column_name);
								}
								row[column_name] = (spec[prop] === null ? "null" : spec[prop] ).toString();
							} else {
								// TODO: field not in metadata index
							}
						}
					}
					})(hit._parent._type,[hit._parent._index, hit._parent._type], hit._parent._source, row);
				}
				return row;
			}, this);
		}
	});

})( this.app );

(function( app ) {

	var data = app.ns("data");
	var ux = app.ns("ux");

	data.BoolQuery = ux.Observable.extend({
		defaults: {
			size: 50		// size of pages to return
		},
		init: function() {
			this._super();
			this.refuid = 0;
			this.refmap = {};
			this.search = {
				query: { bool: { must: [], must_not: [], should: [] } },
				from: 0,
				size: this.config.size,
				sort: [],
				aggs: {}
			};
			this.defaultClause = this.addClause();
		},
		setSize: function(size) {
			this.search.size = parseInt( size, 10 );
		},
		setPage: function(page) {
			this.search.from = this.config.size * (page - 1) + 1;
		},
		addClause: function(value, field, op, bool) {
			bool = bool || "should";
			op = op || "match_all";
			field = field || "_all";
			var clause = this._setClause(value, field, op, bool);
			var uqid = "q-" + this.refuid++;
			this.refmap[uqid] = { clause: clause, value: value, field: field, op: op, bool: bool };
			if(this.search.query.bool.must.length + this.search.query.bool.should.length > 1) {
				this.removeClause(this.defaultClause);
			}
			this.fire("queryChanged", this, { uqid: uqid, search: this.search} );
			return uqid; // returns reference to inner query object to allow fast updating
		},
		removeClause: function(uqid) {
			var ref = this.refmap[uqid],
				bool = this.search.query.bool[ref.bool];
			var clauseIdx = bool.indexOf(ref.clause);
			// Check that this clause hasn't already been removed
			if (clauseIdx >=0) {
				bool.splice(clauseIdx, 1);
			}
		},
		_setClause: function(value, field, op, bool) {
			var clause = {}, query = {};
			if(op === "match_all") {
			} else if(op === "query_string") {
				query["default_field"] = field;
				query["query"] = value;
			} else if(op === "missing") {
				op = "constant_score"
				var missing = {}, filter = {};
				missing["field"] = field;
				filter["missing"] = missing
				query["filter"] = filter;
			} else {
				query[field.substring(field.indexOf(".")+1)] = value;
			}
			clause[op] = query;
			this.search.query.bool[bool].push(clause);
			return clause;
		},
		getData: function() {
			return JSON.stringify(this.search);
		}
	});

})( this.app );
(function( app ) {
	
	var ux = app.ns("ux");
	var services = app.ns("services");

	services.Preferences = ux.Singleton.extend({
		init: function() {
			this._storage = window.localStorage;
			this._setItem("__version", 1 );
		},
		get: function( key ) {
			return this._getItem( key );
		},
		set: function( key, val ) {
			return this._setItem( key, val );
		},
		_getItem: function( key ) {
			try {
				return JSON.parse( this._storage.getItem( key ) );
			} catch(e) {
				console.warn( e );
				return undefined;
			}
		},
		_setItem: function( key, val ) {
			try {
				return this._storage.setItem( key, JSON.stringify( val ) );
			} catch(e) {
				console.warn( e );
				return undefined;
			}
		}
	});

})( this.app );

(function( $, app ) {

	var services = app.ns("services");
	var ux = app.ns("ux");

	function parse_version( v ) {
		return v.match(/^(\d+)\.(\d+)\.(\d+)/).slice(1,4).map( function(d) { return parseInt(d || 0, 10); } );
	}

	services.Cluster = ux.Class.extend({
		defaults: {
			base_uri: null
		},
		init: function() {
			this.base_uri = this.config.base_uri;
		},
		setVersion: function( v ) {
			this.version = v;
			this._version_parts = parse_version( v );
		},
		versionAtLeast: function( v ) {
			var testVersion = parse_version( v );
			for( var i = 0; i < 3; i++ ) {
				if( testVersion[i] !== this._version_parts[i] ) {
					return testVersion[i] < this._version_parts[i];
				}
			}
			return true;
		},
		request: function( params ) {
			return $.ajax( $.extend({
				url: this.base_uri + params.path,
				dataType: "json",
        xhr: function() {
          // Get new xhr object using default factory
          var xhr = jQuery.ajaxSettings.xhr();
          // Copy the browser's native setRequestHeader method
          var setRequestHeader = xhr.setRequestHeader;
          // Replace with a wrapper
          xhr.setRequestHeader = function(name, value) {
            // Ignore the X-Requested-With header
            if (name == 'Authorization') return;
            // Otherwise call the native setRequestHeader method
            // Note: setRequestHeader requires its 'this' to be the xhr object,
            // which is what 'this' is here when executed.
            setRequestHeader.call(this, name, value);
          }
          // pass it on to jQuery
          return xhr;
        },
				error: function(xhr, type, message) {
					if("console" in window) {
						console.log({ "XHR Error": type, "message": message });
					}
				}
			},  params) );
		},
		"get": function(path, success, error) { return this.request( { type: "GET", path: path, success: success, error: error } ); },
		"post": function(path, data, success, error) { return this.request( { type: "POST", path: path, data: data, success: success, error: error } ); },
		"put": function(path, data, success, error) { return this.request( { type: "PUT", path: path, data: data, success: success, error: error } ); },
		"delete": function(path, data, success, error) { return this.request( { type: "DELETE", path: path, data: data, success: success, error: error } ); }
	});

})( this.jQuery, this.app );

	(function( app ) {

	var services = app.ns("services");
	var ux = app.ns("ux");

	services.ClusterState = ux.Observable.extend({
		defaults: {
			cluster: null
		},
		init: function() {
			this._super();
			this.cluster = this.config.cluster;
			this.clusterState = null;
			this.status = null;
			this.nodeStats = null;
			this.clusterNodes = null;
		},
		refresh: function() {
			var self = this, clusterState, status, nodeStats, clusterNodes, clusterHealth;
			function updateModel() {
				if( clusterState && status && nodeStats && clusterNodes && clusterHealth ) {
					this.clusterState = clusterState;
					this.status = status;
					this.nodeStats = nodeStats;
					this.clusterNodes = clusterNodes;
					this.clusterHealth = clusterHealth;
					this.fire( "data", this );
				}
			}
			var _cluster = this.cluster;
			_cluster.get("_cluster/state", function( data ) {
				clusterState = data;
				updateModel.call( self );
			},function() {
				
				_cluster.get("_all", function( data ) {
					clusterState = {routing_table:{indices:{}}, metadata:{indices:{}}};
					
					for(var k in data) {
						clusterState["routing_table"]["indices"][k] = {"shards":{"1":[{
                            "state":"UNASSIGNED",
                            "primary":false,
                            "node":"unknown",
                            "relocating_node":null,
                            "shard":'?',
                            "index":k
                        }]}};
						

						clusterState["metadata"]["indices"][k] = {};
						clusterState["metadata"]["indices"][k]["mappings"] = data[k]["mappings"];
						clusterState["metadata"]["indices"][k]["aliases"] = $.makeArray(Object.keys(data[k]["aliases"]));
						clusterState["metadata"]["indices"][k]["settings"] = data[k]["settings"];
					}
					
					updateModel.call( self );
				});
				
			});
			this.cluster.get("_stats", function( data ) {
				status = data;
				updateModel.call( self );
			});
			this.cluster.get("_nodes/stats", function( data ) {
				nodeStats = data;
				updateModel.call( self );
			});
			this.cluster.get("_nodes", function( data ) {
				clusterNodes = data;
				updateModel.call( self );
			});
			this.cluster.get("_cluster/health", function( data ) {
				clusterHealth = data;
				updateModel.call( self );
			});
		},
		_clusterState_handler: function(state) {
			this.clusterState = state;
			this.redraw("clusterState");
		},
		_status_handler: function(status) {
			this.status = status;
			this.redraw("status");
		},
		_clusterNodeStats_handler: function(stats) {
			this.nodeStats = stats;
			this.redraw("nodeStats");
		},
		_clusterNodes_handler: function(nodes) {
			this.clusterNodes = nodes;
			this.redraw("clusterNodes");
		},
		_clusterHealth_handler: function(health) {
			this.clusterHealth = health;
			this.redraw("status");
		}
	});

})( this.app );

(function( $, joey, app ) {

	var ui = app.ns("ui");
	var ux = app.ns("ux");

	ui.AbstractWidget = ux.Observable.extend({
		defaults : {
			id: null     // the id of the widget
		},

		el: null,       // this is the jquery wrapped dom element(s) that is the root of the widget

		init: function() {
			this._super();
			for(var prop in this) {       // automatically bind all the event handlers
				if(prop.contains("_handler")) {
					this[prop] = this[prop].bind(this);
				}
			}
		},

		id: function(suffix) {
			return this.config.id ? (this.config.id + (suffix ? "-" + suffix : "")) : undefined;
		},

		attach: function( parent, method ) {
			if( parent ) {
				this.el[ method || "appendTo"]( parent );
			}
			this.fire("attached", this );
			return this;
		},

		remove: function() {
			this.el.remove();
			this.fire("removed", this );
			this.removeAllObservers();
			this.el = null;
			return this;
		}
	});

	joey.plugins.push( function( obj ) {
		if( obj instanceof ui.AbstractWidget ) {
			return obj.el[0];
		}
	});

})( this.jQuery, this.joey, this.app );

(function( $, app, joey ) {

	var ui = app.ns("ui");

	ui.AbstractField = ui.AbstractWidget.extend({

		defaults: {
			name : "",			// (required) - name of the field
			require: false,	// validation requirements (false, true, regexp, function)
			value: "",			// default value
			label: ""				// human readable label of this field
		},

		init: function(parent) {
			this._super();
			this.el = $.joey(this._main_template());
			this.field = this.el.find("[name="+this.config.name+"]");
			this.label = this.config.label;
			this.require = this.config.require;
			this.name = this.config.name;
			this.val( this.config.value );
			this.attach( parent );
		},

		val: function( val ) {
			if(val === undefined) {
				return this.field.val();
			} else {
				this.field.val( val );
				return this;
			}
		},

		validate: function() {
			var val = this.val(), req = this.require;
			if( req === false ) {
				return true;
			} else if( req === true ) {
				return val.length > 0;
			} else if( req.test && $.isFunction(req.test) ) {
				return req.test( val );
			} else if( $.isFunction(req) ) {
				return req( val, this );
			}
		}

	});

})( this.jQuery, this.app, this.joey );

(function( app ) {

	var ui = app.ns("ui");

	ui.TextField = ui.AbstractField.extend({
		init: function() {
			this._super();
		},
		_keyup_handler: function() {
			this.fire("change", this );
		},
		_main_template: function() {
			return { tag: "DIV", id: this.id(), cls: "uiField uiTextField", children: [
				{ tag: "INPUT",
					type: "text",
					name: this.config.name,
					placeholder: this.config.placeholder,
					onkeyup: this._keyup_handler
				}
			]};
		}
	});

})( this.app );

(function( app ) {

	var ui = app.ns("ui");

	ui.CheckField = ui.AbstractField.extend({
		_main_template: function() { return (
			{ tag: "DIV", id: this.id(), cls: "uiCheckField", children: [
				{ tag: "INPUT", type: "checkbox", name: this.config.name, checked: !!this.config.value }
			] }
		); },
		validate: function() {
			return this.val() || ( ! this.require );
		},
		val: function( val ) {
			if( val === undefined ) {
				return !!this.field.attr( "checked" );
			} else {
				this.field.attr( "checked", !!val );
			}
		}
	});

})( this.app );



(function( $, joey, app ) {

	var ui = app.ns("ui");

	ui.Button = ui.AbstractWidget.extend({
		defaults : {
			label: "",                 // the label text
			disabled: false,           // create a disabled button
			autoDisable: false         // automatically disable the button when clicked
		},

		_baseCls: "uiButton",

		init: function(parent) {
			this._super();
			this.el = $.joey(this.button_template())
				.bind("click", this.click_handler);
			this.config.disabled && this.disable();
			this.attach( parent );
		},

		click_handler: function(jEv) {
			if(! this.disabled) {
				this.fire("click", jEv, this);
				this.config.autoDisable && this.disable();
			}
		},

		enable: function() {
			this.el.removeClass("disabled");
			this.disabled = false;
			return this;
		},

		disable: function(disable) {
			if(disable === false) {
					return this.enable();
			}
			this.el.addClass("disabled");
			this.disabled = true;
			return this;
		},

		button_template: function() { return (
			{ tag: 'BUTTON', type: 'button', id: this.id(), cls: this._baseCls, children: [
				{ tag: 'DIV', cls: 'uiButton-content', children: [
					{ tag: 'DIV', cls: 'uiButton-label', text: this.config.label }
				] }
			] }
		); }
	});

})( this.jQuery, this.joey, this.app );

(function( $, app ) {

	var ui = app.ns("ui");

	ui.MenuButton = app.ui.Button.extend({
		defaults: {
			menu: null
		},
		_baseCls: "uiButton uiMenuButton",
		init: function(parent) {
			this._super(parent);
			this.menu = this.config.menu;
			this.on("click", this.openMenu_handler);
			this.menu.on("open", function() { this.el.addClass("active"); }.bind(this));
			this.menu.on("close", function() { this.el.removeClass("active"); }.bind(this));
		},
		openMenu_handler: function(jEv) {
			this.menu && this.menu.open(jEv);
		}
	});

})( this.jQuery, this.app );

(function( $, app ) {

	var ui = app.ns("ui");

	ui.SplitButton = ui.AbstractWidget.extend({
		defaults: {
			items: [],
			label: ""
		},
		_baseCls: "uiSplitButton",
		init: function( parent ) {
			this._super( parent );
			this.value = null;
			this.button = new ui.Button({
				label: this.config.label,
				onclick: this._click_handler
			});
			this.menu = new ui.SelectMenuPanel({
				value: this.config.value,
				items: this._getItems(),
				onSelect: this._select_handler
			});
			this.menuButton = new ui.MenuButton({
				label: "\u00a0",
				menu: this.menu
			});
			this.el = $.joey(this._main_template());
		},
		remove: function() {
			this.menu.remove();
		},
		disable: function() {
			this.button.disable();
		},
		enable: function() {
			this.button.enable();
		},
		_click_handler: function() {
			this.fire("click", this, { value: this.value } );
		},
		_select_handler: function( panel, event ) {
			this.fire( "select", this, event );
		},
		_getItems: function() {
			return this.config.items;
		},
		_main_template: function() {
			return { tag: "DIV", cls: this._baseCls, children: [
				this.button, this.menuButton
			] };
		}
	});

})( this.jQuery, this.app );

(function( $, app, i18n ) {

	var ui = app.ns("ui");

	ui.RefreshButton = ui.SplitButton.extend({
		defaults: {
			timer: -1
		},
		init: function( parent ) {
			this.config.label = i18n.text("General.RefreshResults");
			this._super( parent );
			this.set( this.config.timer );
		},
		set: function( value ) {
			this.value = value;
			window.clearInterval( this._timer );
			if( this.value > 0 ) {
				this._timer = window.setInterval( this._refresh_handler, this.value );
			}
		},
		_click_handler: function() {
			this._refresh_handler();
		},
		_select_handler: function( el, event ) {
			this.set( event.value );
			this.fire("change", this );
		},
		_refresh_handler: function() {
			this.fire("refresh", this );
		},
		_getItems: function() {
			return [
				{ text: i18n.text("General.ManualRefresh"), value: -1 },
				{ text: i18n.text("General.RefreshQuickly"), value: 100 },
				{ text: i18n.text("General.Refresh5seconds"), value: 5000 },
				{ text: i18n.text("General.Refresh1minute"), value: 60000 }
			];
		}
	});

})( this.jQuery, this.app, this.i18n );

(function( $, app ) {

	var ui = app.ns("ui");

	ui.Toolbar = ui.AbstractWidget.extend({
		defaults: {
			label: "",
			left: [],
			right: []
		},
		init: function(parent) {
			this._super();
			this.el = $.joey(this._main_template());
		},
		_main_template: function() {
			return { tag: "DIV", cls: "uiToolbar", children: [
				{ tag: "DIV", cls: "pull-left", children: [
					{ tag: "H2", text: this.config.label }
				].concat(this.config.left) },
				{ tag: "DIV", cls: "pull-right", children: this.config.right }
			]};
		}
	});

})( this.jQuery, this.app );

(function( $, app ) {

	var ui = app.ns("ui");

	ui.AbstractPanel = ui.AbstractWidget.extend({
		defaults: {
			body: null,            // initial content of the body
			modal: true,           // create a modal panel - creates a div that blocks interaction with page
			height: 'auto',        // panel height
			width: 400,            // panel width (in pixels)
			open: false,           // show the panel when it is created
			parent: 'BODY',        // node that panel is attached to
			autoRemove: false      // remove the panel from the dom and destroy it when the widget is closed
		},
		shared: {  // shared data for all instances of ui.Panel and decendants
			stack: [], // array of all open panels
			modal: $( { tag: "DIV", id: "uiModal", css: { opacity: 0.2, position: "absolute", top: "0px", left: "0px" } } )
		},
		init: function() {
			this._super();
		},
		open: function( ev ) {
			this.el
				.css( { visibility: "hidden" } )
				.appendTo( this.config.parent )
				.css( this._getPosition( ev ) )
				.css( { zIndex: (this.shared.stack.length ? (+this.shared.stack[this.shared.stack.length - 1].el.css("zIndex") + 10) : 100) } )
				.css( { visibility: "visible", display: "block" } );
			this.shared.stack.remove(this);
			this.shared.stack.push(this);
			this._setModal();
			$(document).bind("keyup", this._close_handler );
			this.fire("open", { source: this, event: ev } );
			return this;
		},
		close: function() {
			var index = this.shared.stack.indexOf(this);
			if(index !== -1) {
				this.shared.stack.splice(index, 1);
				this.el.css( { left: "-2999px" } ); // move the dialog to the left rather than hiding to prevent ie6 rendering artifacts
				this._setModal();
				this.fire("close", this );
				if(this.config.autoRemove) {
					this.remove();
				}
			}
			return this;
		},
		// close the panel and remove it from the dom, destroying it (you can not reuse the panel after calling remove)
		remove: function() {
			this.close();
			$(document).unbind("keyup", this._close_handler );
			this._super();
		},
		// starting at the top of the stack, find the first panel that wants a modal and put it just underneath, otherwise remove the modal
		_setModal: function() {
			for(var stackPtr = this.shared.stack.length - 1; stackPtr >= 0; stackPtr--) {
				if(this.shared.stack[stackPtr].config.modal) {
					this.shared.modal
						.appendTo( document.body )
						.css( { zIndex: this.shared.stack[stackPtr].el.css("zIndex") - 5 } )
						.css( $(document).vSize().asSize() );
					return;
				}
			}
			this.shared.modal.remove(); // no panels that want a modal were found
		},
		_getPosition: function() {
			return $(window).vSize()                        // get the current viewport size
				.sub(this.el.vSize())                         // subtract the size of the panel
				.mod(function(s) { return s / 2; })           // divide by 2 (to center it)
				.add($(document).vScroll())                   // add the current scroll offset
				.mod(function(s) { return Math.max(5, s); })  // make sure the panel is not off the edge of the window
				.asOffset();                                  // and return it as a {top, left} object
		},
		_close_handler: function( ev ) {
			if( ev.type === "keyup" && ev.keyCode !== 27) { return; } // press esc key to close
			$(document).unbind("keyup", this._close_handler);
			this.close( ev );
		}
	});

})( this.jQuery, this.app );

(function( $, app ) {

	var ui = app.ns("ui");

	ui.DraggablePanel = ui.AbstractPanel.extend({
		defaults: {
	//		title: ""   // (required) text for the panel title
		},

		_baseCls: "uiPanel",

		init: function() {
			this._super();
			this.body = $(this._body_template());
			this.title = $(this._title_template());
			this.el = $.joey( this._main_template() );
			this.el.css( { width: this.config.width } );
			this.dd = new app.ux.DragDrop({
				pickupSelector: this.el.find(".uiPanel-titleBar"),
				dragObj: this.el
			});
			// open the panel if set in configuration
			this.config.open && this.open();
		},

		setBody: function(body) {
				this.body.empty().append(body);
		},
		_body_template: function() { return { tag: "DIV", cls: "uiPanel-body", css: { height: this.config.height + (this.config.height === 'auto' ? "" : "px" ) }, children: [ this.config.body ] }; },
		_title_template: function() { return { tag: "SPAN", cls: "uiPanel-title", text: this.config.title }; },
		_main_template: function() { return (
			{ tag: "DIV", id: this.id(), cls: this._baseCls, children: [
				{ tag: "DIV", cls: "uiPanel-titleBar", children: [
					{ tag: "DIV", cls: "uiPanel-close", onclick: this._close_handler, text: "x" },
					this.title
				]},
				this.body
			] }
		); }
	});

})( this.jQuery, this.app );

(function( app ) {

	var ui = app.ns("ui");

	ui.InfoPanel = ui.DraggablePanel.extend({
		_baseCls: "uiPanel uiInfoPanel"
	});

})( this.app );

(function( app ) {

	var ui = app.ns("ui");

	ui.DialogPanel = ui.DraggablePanel.extend({
		_commit_handler: function(jEv) {
			this.fire("commit", this, { jEv: jEv });
		},
		_main_template: function() {
			var t = this._super();
			t.children.push(this._actionsBar_template());
			return t;
		},
		_actionsBar_template: function() {
			return { tag: "DIV", cls: "pull-right", children: [
				new app.ui.Button({ label: "Cancel", onclick: this._close_handler }),
				new app.ui.Button({ label: "OK", onclick: this._commit_handler })
			]};
		}
	});

})( this.app );

(function( app ) {

	var ui = app.ns("ui");

	ui.MenuPanel = ui.AbstractPanel.extend({
		defaults: {
			items: [],		// (required) an array of menu items
			modal: false
		},
		_baseCls: "uiMenuPanel",
		init: function() {
			this._super();
			this.el = $(this._main_template());
		},
		open: function(jEv) {
      if (!$(jEv.currentTarget).hasClass('active')) {
  			this._super(jEv);
	  		var cx = this; setTimeout(function() { $(document).bind("click", cx._close_handler); }, 50);
      }
		},
		_getItems: function() {
			return this.config.items;
		},
		_close_handler: function(jEv) {
			this._super(jEv);
			$(document).unbind("click", this._close_handler);
		},
		_main_template: function() {
			return { tag: "DIV", cls: this._baseCls, children: this._getItems().map(this._menuItem_template, this) };
		},
		_menuItem_template: function(item) {
			var dx = item.disabled ? { onclick: function() {} } : {};
			return { tag: "LI", cls: "uiMenuPanel-item" + (item.disabled ? " disabled" : "") + (item.selected ? " selected" : ""), children: [ $.extend({ tag: "DIV", cls: "uiMenuPanel-label" }, item, dx ) ] };
		},
		_getPosition: function(jEv) {
			var right = !! $(jEv.target).parents(".pull-right").length;
			var parent = $(jEv.target).closest("BUTTON");
			return parent.vOffset()
				.addY(parent.vSize().y)
				.addX( right ? parent.vSize().x - this.el.vSize().x : 0 )
				.asOffset();
		}
	});

})( this.app );

(function( app ) {

	var ui = app.ns("ui");

	ui.SelectMenuPanel = ui.MenuPanel.extend({
		defaults: {
			items: [],		// (required) an array of menu items
			value: null
		},
		_baseCls: "uiSelectMenuPanel uiMenuPanel",
		init: function() {
			this.value = this.config.value;
			this._super();
		},
		_getItems: function() {
			return this.config.items.map( function( item ) {
				return {
					text: item.text,
					selected: this.value === item.value,
					onclick: function( jEv ) {
						var el = $( jEv.target ).closest("LI");
						el.parent().children().removeClass("selected");
						el.addClass("selected");
						this.fire( "select", this, { value: item.value } );
						this.value = item.value;
					}.bind(this)
				};
			}, this );

		}
	});

})( this.app );

( function( $, app ) {

	var ui = app.ns("ui");

	ui.Table = ui.AbstractWidget.extend({
		defaults: {
			store: null, // (required) implements interface app.data.DataSourceInterface
			height: 0,
			width: 0
		},
		_baseCls: "uiTable",
		init: function(parent) {
			this._super();
			this.initElements(parent);
			this.config.store.on("data", this._data_handler);
		},
		attach: function(parent) {
			if(parent) {
				this._super(parent);
				this._reflow();
			}
		},
		initElements: function(parent) {
			this.el = $.joey(this._main_template());
			this.body = this.el.find(".uiTable-body");
			this.headers = this.el.find(".uiTable-headers");
			this.tools = this.el.find(".uiTable-tools");
			this.attach( parent );
		},
		_data_handler: function(store) {
			this.tools.text(store.summary);
			this.headers.empty().append(this._header_template(store.columns));
			this.body.empty().append(this._body_template(store.data, store.columns));
			this._reflow();
		},
		_reflow: function() {
			var firstCol = this.body.find("TR:first TH.uiTable-header-cell > DIV"),
					headers = this.headers.find("TR:first TH.uiTable-header-cell > DIV");
			for(var i = 0; i < headers.length; i++) {
				$(headers[i]).width( $(firstCol[i]).width() );
			}
			this._scroll_handler();
		},
		_scroll_handler: function(ev) {
			this.el.find(".uiTable-headers").scrollLeft(this.body.scrollLeft());
		},
		_dataClick_handler: function(ev) {
			var row = $(ev.target).closest("TR");
			if(row.length) {
				this.fire("rowClick", this, { row: row } );
			}
		},
		_headerClick_handler: function(ev) {
			var header = $(ev.target).closest("TH.uiTable-header-cell");
			if(header.length) {
				this.fire("headerClick", this, { header: header, column: header.data("column"), dir: header.data("dir") });
			}
		},
		_main_template: function() {
			return { tag: "DIV", id: this.id(), css: { width: this.config.width + "px" }, cls: this._baseCls, children: [
				{ tag: "DIV", cls: "uiTable-tools" },
				{ tag: "DIV", cls: "uiTable-headers", onclick: this._headerClick_handler },
				{ tag: "DIV", cls: "uiTable-body",
					onclick: this._dataClick_handler,
					onscroll: this._scroll_handler,
					css: { height: this.config.height + "px", width: this.config.width + "px" }
				}
			] };
		},
		_header_template: function(columns) {
			var ret = { tag: "TABLE", children: [ this._headerRow_template(columns) ] };
			ret.children[0].children.push(this._headerEndCap_template());
			return ret;
		},
		_headerRow_template: function(columns) {
			return { tag: "TR", cls: "uiTable-header-row", children: columns.map(function(column) {
				var dir = ((this.config.store.sort.column === column) && this.config.store.sort.dir) || "none";
				return { tag: "TH", data: { column: column, dir: dir }, cls: "uiTable-header-cell" + ((dir !== "none") ? " uiTable-sort" : ""), children: [
					{ tag: "DIV", children: [
						{ tag: "DIV", cls: "uiTable-headercell-menu", text: dir === "asc" ? "\u25b2" : "\u25bc" },
						{ tag: "DIV", cls: "uiTable-headercell-text", text: column }
					]}
				]};
			}, this)};
		},
		_headerEndCap_template: function() {
			return { tag: "TH", cls: "uiTable-headerEndCap", children: [ { tag: "DIV" } ] };
		},
		_body_template: function(data, columns) {
			return { tag: "TABLE", children: []
				.concat(this._headerRow_template(columns))
				.concat(data.map(function(row) {
					return { tag: "TR", data: { row: row }, cls: "uiTable-row", children: columns.map(function(column){
						return { tag: "TD", cls: "uiTable-cell", children: [ { tag: "DIV", text: (row[column] || "").toString() } ] };
					})};
				}))
			};
		}

	});

})( this.jQuery, this.app );

( function( $, app, joey ) {

	var ui = app.ns("ui");

	var CELL_SEPARATOR = ",";
	var CELL_QUOTE = '"';
	var LINE_SEPARATOR = "\r\n";

	ui.CSVTable = ui.AbstractWidget.extend({
		defaults: {
			results: null
		},
		_baseCls: "uiCSVTable",
		init: function( parent ) {
			this._super();
			var results = this.config.results.hits.hits;
			var columns = this._parseResults( results );
			this._downloadButton = new ui.Button({
				label: "Generate Download Link",
				onclick: this._downloadLinkGenerator_handler
			});
			this._downloadLink = $.joey( { tag: "A", text: "download", });
			this._downloadLink.hide();
			this._csvText = this._csv_template( columns, results );
			this.el = $.joey( this._main_template() );
			this.attach( parent );
		},
		_downloadLinkGenerator_handler: function() {
			var csvData = new Blob( [ this._csvText ], { type: 'text/csv' });
			var csvURL = URL.createObjectURL( csvData );
			this._downloadLink.attr( "href", csvURL );
			this._downloadLink.show();
		},
		_parseResults: function( results ) {
			var columnPaths = {};
			(function parse( path, obj ) {
				if( obj instanceof Array ) {
					for( var i = 0; i < obj.length; i++ ) {
						parse( path, obj[i] );
					}
				} else if( typeof obj === "object" ) {
					for( var prop in obj ) {
						parse( path + "." + prop, obj[ prop ] );
					}
				} else {
					columnPaths[ path ] = true;
				}
			})( "root", results );
			var columns = [];
			for( var column in columnPaths ) {
				columns.push( column.split(".").slice(1) );
			}
			return columns;
		},
		_main_template: function() { return (
			{ tag: "DIV", cls: this._baseCls, id: this.id(), children: [
				this._downloadButton,
				this._downloadLink,
				{ tag: "PRE", text: this._csvText }
			] }
		); },
		_csv_template: function( columns, results ) {
			return this._header_template( columns ) + LINE_SEPARATOR + this._results_template( columns, results );
		},
		_header_template: function( columns ) {
			return columns.map( function( column ) {
				return column.join(".");
			}).join( CELL_SEPARATOR );
		},
		_results_template: function( columns, results ) {
			return results.map( function( result ) {
				return columns.map( function( column ) {
					var l = 0,
						ptr = result;
					while( l !== column.length && ptr != null ) {
						ptr = ptr[ column[ l++ ] ];
					}
					return ( ptr == null ) ? "" : ( CELL_QUOTE + ptr.toString().replace(/"/g, '""') + CELL_QUOTE );
				}).join( CELL_SEPARATOR );
			}).join( LINE_SEPARATOR );
		}
	});

})( this.jQuery, this.app, this.joey );

(function( $, app ) {

	var ui = app.ns("ui");

	ui.JsonPretty = ui.AbstractWidget.extend({
		defaults: {
			obj: null
		},
		init: function(parent) {
			this._super();
			this.el = $(this._main_template());
			this.attach(parent);
			this.el.click(this._click_handler);
		},
		
		_click_handler: function(jEv) {
			var t = $(jEv.target).closest(".uiJsonPretty-name").closest("LI");
			if(t.length === 0 || t.parents(".uiJsonPretty-minimised").length > 0) { return; }
			t.toggleClass("uiJsonPretty-minimised");
			jEv.stopPropagation();
		},
		
		_main_template: function() {
			try {
					return { tag: "DIV", cls: "uiJsonPretty", children: this.pretty.parse(this.config.obj) };
			}	catch (error) {
					throw "JsonPretty error: " + error.message;
			}
		},
		
		pretty: { // from https://github.com/RyanAmos/Pretty-JSON/blob/master/pretty_json.js
			"expando" : function(value) {
				return (value && (/array|object/i).test(value.constructor.name)) ? "expando" : "";
			},
			"parse": function (member) {
				return this[(member == null) ? 'null' : member.constructor.name.toLowerCase()](member);
			},
			"null": function (value) {
				return this['value']('null', 'null');
			},
			"array": function (value) {
				var results = [];
				var lastItem = value.length - 1;
				value.forEach(function( v, i ) {
					results.push({ tag: "LI", cls: this.expando(v), children: [ this['parse'](v) ] });
					if( i !== lastItem ) {
						results.push(",");
					}
				}, this);
				return [ "[ ", ((results.length > 0) ? { tag: "UL", cls: "uiJsonPretty-array", children: results } : null), "]" ];
			},
			"object": function (value) {
				var results = [];
				var keys = Object.keys( value );
				var lastItem = keys.length - 1;
				keys.forEach( function( key, i ) {
					var children = [ this['value']( 'name', '"' + key + '"' ), ": ", this['parse']( value[ key ]) ];
					if( i !== lastItem ) {
						children.push(",");
					}
					results.push( { tag: "LI", cls: this.expando( value[ key ] ), children: children } );
				}, this);
				return [ "{ ", ((results.length > 0) ? { tag: "UL", cls: "uiJsonPretty-object", children: results } : null ),  "}" ];
			},
			"number": function (value) {
				return this['value']('number', value.toString());
			},
			"string": function (value) {
				if (/^(http|https|file):\/\/[^\s]+$/.test(value)) {
					return this['link']( value );
				} else {
					return this['value']('string', '"' + value.toString() + '"');
				}
			},
			"boolean": function (value) {
				return this['value']('boolean', value.toString());
			},
			"link": function( value ) {
					return this['value']("string", { tag: "A", href: value, target: "_blank", text: '"' + value + '"' } );
			},
			"value": function (type, value) {
				if (/^(http|https|file):\/\/[^\s]+$/.test(value)) {
				}
				return { tag: "SPAN", cls: "uiJsonPretty-" + type, text: value };
			}
		}
	});

})( this.jQuery, this.app );

(function( $, app ) {

	var ui = app.ns("ui");
	var ut = app.ns("ut");

	ui.PanelForm = ui.AbstractWidget.extend({
		defaults: {
			fields: null	// (required) instanceof app.ux.FieldCollection
		},
		init: function(parent) {
			this._super();
			this.el = $.joey(this._main_template());
			this.attach( parent );
		},
		_main_template: function() {
			return { tag: "DIV", id: this.id(), cls: "uiPanelForm", children: this.config.fields.fields.map(this._field_template, this) };
		},
		_field_template: function(field) {
			return { tag: "LABEL", cls: "uiPanelForm-field", children: [
				{ tag: "DIV", cls: "uiPanelForm-label", children: [ field.label, ut.require_template(field) ] },
				field
			]};
		}
	});

})( this.jQuery, this.app );

(function( app ){

	var ui = app.ns("ui");

	ui.HelpPanel = ui.InfoPanel.extend({
		defaults: {
			ref: "",
			open: true,
			autoRemove: true,
			modal: false,
			width: 500,
			height: 450,
			title: i18n.text("General.Help")
		},
		init: function() {
			this._super();
			this.body.append(i18n.text(this.config.ref));
		}
	});

})( this.app );

(function( app ) {

	var ui = app.ns("ui");

	ui.JsonPanel = ui.InfoPanel.extend({
		defaults: {
			json: null, // (required)
			modal: false,
			open: true,
			autoRemove: true,
			height: 500,
			width: 600
		},

		_baseCls: "uiPanel uiInfoPanel uiJsonPanel",

		_body_template: function() {
			var body = this._super();
			body.children = [ new ui.JsonPretty({ obj: this.config.json }) ];
			return body;
		}
	});

})( this.app );

(function( $, app, i18n ) {

	var ui = app.ns("ui");

	ui.SidebarSection = ui.AbstractWidget.extend({
		defaults: {
			title: "",
			help: null,
			body: null,
			open: false
		},
		init: function() {
			this._super();
			this.el = $.joey( this._main_template() );
			this.body = this.el.children(".uiSidebarSection-body");
			this.config.open && ( this.el.addClass("shown") && this.body.css("display", "block") );
		},
		_showSection_handler: function( ev ) {
			var shown = $( ev.target ).closest(".uiSidebarSection")
				.toggleClass("shown")
					.children(".uiSidebarSection-body").slideToggle(200, function() { this.fire("animComplete", this); }.bind(this))
				.end()
				.hasClass("shown");
			this.fire(shown ? "show" : "hide", this);
		},
		_showHelp_handler: function( ev ) {
			new ui.HelpPanel({ref: this.config.help});
			ev.stopPropagation();
		},
		_main_template: function() { return (
			{ tag: "DIV", cls: "uiSidebarSection", children: [
				(this.config.title && { tag: "DIV", cls: "uiSidebarSection-head", onclick: this._showSection_handler, children: [
					this.config.title,
					( this.config.help && { tag: "SPAN", cls: "uiSidebarSection-help pull-right", onclick: this._showHelp_handler, text: i18n.text("General.HelpGlyph") } )
				] }),
				{ tag: "DIV", cls: "uiSidebarSection-body", children: [ this.config.body ] }
			] }
		); }
	});

})( this.jQuery, this.app, this.i18n );

(function( $, app ) {

	var ui = app.ns("ui");

	ui.ResultTable = ui.Table.extend({
		defaults: {
			width: 500,
			height: 400
		},

		init: function() {
			this._super();
			this.on("rowClick", this._showPreview_handler);
			this.selectedRow = null;
			$(document).bind("keydown", this._nav_handler);
		},
		remove: function() {
			$(document).unbind("keydown", this._nav_handler);
			this._super();
		},
		attach: function(parent) {
			if(parent) {
				var height = parent.height() || ( $(document).height() - parent.offset().top - 41 ); // 41 = height in px of .uiTable-tools + uiTable-header
				var width = parent.width();
				this.el.width( width );
				this.body.width( width ).height( height );
			}
			this._super(parent);
		},
		showPreview: function(row) {
			row.addClass("selected");
			this.preview = new app.ui.JsonPanel({
				title: i18n.text("Browser.ResultSourcePanelTitle"),
				json: row.data("row")._source,
				onClose: function() { row.removeClass("selected"); }
			});
		},
		_nav_handler: function(jEv) {
			if(jEv.keyCode !== 40 && jEv.keyCode !== 38) {
				return;
			}
			this.selectedRow && this.preview && this.preview.remove();
			if(jEv.keyCode === 40) { // up arrow
				this.selectedRow = this.selectedRow ? this.selectedRow.next("TR") : this.body.find("TR:first");
			} else if(jEv.keyCode === 38) { // down arrow
				this.selectedRow = this.selectedRow ? this.selectedRow.prev("TR") : this.body.find("TR:last");
			}
			this.selectedRow && this.showPreview(this.selectedRow);
		},
		_showPreview_handler: function(obj, data) {
			this.showPreview(this.selectedRow = data.row);
		}
	});

})( this.jQuery, this.app );

(function( $, app, i18n ) {

	var ui = app.ns("ui");
	var ut = app.ns("ut");

	ui.QueryFilter = ui.AbstractWidget.extend({
		defaults: {
			metadata: null,   // (required) instanceof app.data.MetaData
			query: null       // (required) instanceof app.data.Query that the filters will act apon
		},
		init: function() {
			this._super();
			this.metadata = this.config.metadata;
			this.query = this.config.query;
			this.el = $(this._main_template());
		},
		helpTypeMap: {
			"date" : "QueryFilter.DateRangeHelp"
		},
		requestUpdate: function(jEv) {
			if(jEv && jEv.originalEvent) { // we only want to update on real user interaction not generated events
				this.query.setPage(1);
				this.query.query();
			}
		},
		getSpec: function(fieldName) {
			return this.metadata.fields[fieldName];
		},
		_selectAlias_handler: function(jEv) {
			var indices = (jEv.target.selectedIndex === 0) ? [] : this.metadata.getIndices($(jEv.target).val());
			$(".uiQueryFilter-index").each(function(i, el) {
				var jEl = $(el);
				if(indices.contains(jEl.text()) !== jEl.hasClass("selected")) {
					jEl.click();
				}
			});
			this.requestUpdate(jEv);
		},
		_selectIndex_handler: function(jEv) {
			var jEl = $(jEv.target).closest(".uiQueryFilter-index");
			jEl.toggleClass("selected");
			var selected = jEl.hasClass("selected");
			this.query.setIndex(jEl.text(), selected);
			if(selected) {
				var types = this.metadata.getTypes(this.query.indices);
				this.el.find("DIV.uiQueryFilter-type.selected").each(function(n, el) {
					if(! types.contains($(el).text())) {
						$(el).click();
					}
				});
			}
			this.requestUpdate(jEv);
		},
		_selectType_handler: function(jEv) {
			var jEl = $(jEv.target).closest(".uiQueryFilter-type");
			jEl.toggleClass("selected");
			var type = jEl.text(), selected = jEl.hasClass("selected");
			this.query.setType(type, selected);
			if(selected) {
				var indices = this.metadata.types[type].indices;
				// es throws a 500 if searching an index for a type it does not contain - so we prevent that
				this.el.find("DIV.uiQueryFilter-index.selected").each(function(n, el) {
					if(! indices.contains($(el).text())) {
						$(el).click();
					}
				});
				// es throws a 500 if you specify types from different indices with _all
				jEl.siblings(".uiQueryFilter-type.selected").forEach(function(el) {
					if(this.metadata.types[$(el).text()].indices.intersection(indices).length === 0) {
						$(el).click();
					}
				}, this);
			}
			this.requestUpdate(jEv);
		},
		_openFilter_handler: function(section) {
			var field_name = section.config.title;
			if(! section.loaded) {
				var spec = this.getSpec(field_name);
				if(spec.core_type === "string") {
					section.body.append(this._textFilter_template(spec));
				} else if(spec.core_type === "date") {
					section.body.append(this._dateFilter_template(spec));
					section.body.append(new ui.DateHistogram({ printEl: section.body.find("INPUT"), cluster: this.cluster, query: this.query, spec: spec }));
				} else if(spec.core_type === "number") {
					section.body.append(this._numericFilter_template(spec));
				} else if(spec.core_type === 'boolean') {
					section.body.append(this._booleanFilter_template(spec));
				} else if (spec.core_type === 'multi_field') {
					section.body.append(this._multiFieldFilter_template(section, spec));
				} 
				section.loaded = true;
			}
			section.on("animComplete", function(section) { section.body.find("INPUT").focus(); });
		},
		_textFilterChange_handler: function(jEv) {
			var jEl = $(jEv.target).closest("INPUT");
			var val = jEl.val();
			var spec = jEl.data("spec");
			var uqids = jEl.data("uqids") || [];
			uqids.forEach(function(uqid) {
				uqid && this.query.removeClause(uqid);
			}, this);
			if(val.length) {
				if(jEl[0] === document.activeElement && jEl[0].selectionStart === jEl[0].selectionEnd) {
					val = val.replace(new RegExp("(.{"+jEl[0].selectionStart+"})"), "$&*");
				}
				uqids = val.split(/\s+/).map(function(term) {
					// Figure out the actual field name - needed for multi_field, because
					// querying for "field.field" will not work. Simply "field" must be used
					// if nothing is aliased.
					var fieldNameParts = spec.field_name.split('.');
					var part = fieldNameParts.length - 1;
					var name = fieldNameParts[part];
					while (part >= 1) {
						if (fieldNameParts[part] !== fieldNameParts[part - 1]) {
							name = fieldNameParts[part - 1] + "." + name;
						}
						part--;
					}
					return term && this.query.addClause(term, name, "wildcard", "must");
				}, this);
			}
			jEl.data("uqids", uqids);
			this.requestUpdate(jEv);
		},
		_dateFilterChange_handler: function(jEv) {
			var jEl = $(jEv.target).closest("INPUT");
			var val = jEl.val();
			var spec = jEl.data("spec");
			var uqid = jEl.data("uqid") || null;
			var range = window.dateRangeParser.parse(val);
			var lastRange = jEl.data("lastRange");
			if(!range || (lastRange && lastRange.start === range.start && lastRange.end === range.end)) {
				return;
			}
			uqid && this.query.removeClause(uqid);
			if((range.start && range.end) === null) {
				uqid = null;
			} else {
				var value = {};
				if( range.start ) {
					value["gte"] = range.start;
				}
				if( range.end ) {
					value["lte"] = range.end;
				}
				uqid = this.query.addClause( value, spec.field_name, "range", "must");
			}
			jEl.data("lastRange", range);
			jEl.siblings(".uiQueryFilter-rangeHintFrom")
				.text(i18n.text("QueryFilter.DateRangeHint.from", range.start && new Date(range.start).toUTCString()));
			jEl.siblings(".uiQueryFilter-rangeHintTo")
				.text(i18n.text("QueryFilter.DateRangeHint.to", range.end && new Date(range.end).toUTCString()));
			jEl.data("uqid", uqid);
			this.requestUpdate(jEv);
		},
		_numericFilterChange_handler: function(jEv) {
			var jEl = $(jEv.target).closest("INPUT");
			var val = jEl.val();
			var spec = jEl.data("spec");
			var uqid = jEl.data("uqid") || null;
			var lastRange = jEl.data("lastRange");
			var range = (function(val) {
				var ops = val.split(/->|<>|</).map( function(v) { return parseInt(v.trim(), 10); });
				if(/<>/.test(val)) {
					return { gte: (ops[0] - ops[1]), lte: (ops[0] + ops[1]) };
				} else if(/->|</.test(val)) {
					return { gte: ops[0], lte: ops[1] };
				} else {
					return { gte: ops[0], lte: ops[0] };
				}
			})(val || "");
			if(!range || (lastRange && lastRange.lte === range.lte && lastRange.gte === range.gte)) {
				return;
			}
			jEl.data("lastRange", range);
			uqid && this.query.removeClause(uqid);
			uqid = this.query.addClause( range, spec.field_name, "range", "must");
			jEl.data("uqid", uqid);
			this.requestUpdate(jEv);
		},
		_booleanFilterChange_handler: function( jEv ) {
			var jEl = $(jEv.target).closest("SELECT");
			var val = jEl.val();
			var spec = jEl.data("spec");
			var uqid = jEl.data("uqid") || null;
			uqid && this.query.removeClause(uqid);
			if(val === "true" || val === "false") {
				jEl.data("uqid", this.query.addClause(val, spec.field_name, "term", "must") );
			}
			this.requestUpdate(jEv);
		},
		_main_template: function() {
			return { tag: "DIV", id: this.id(), cls: "uiQueryFilter", children: [
				this._aliasSelector_template(),
				this._indexSelector_template(),
				this._typesSelector_template(),
				this._filters_template()
			] };
		},
		_aliasSelector_template: function() {
			var aliases = Object.keys(this.metadata.aliases).sort();
			aliases.unshift( i18n.text("QueryFilter.AllIndices") );
			return { tag: "DIV", cls: "uiQueryFilter-section uiQueryFilter-aliases", children: [
				{ tag: "SELECT", onChange: this._selectAlias_handler, children: aliases.map(ut.option_template) }
			] };
		},
		_indexSelector_template: function() {
			var indices = Object.keys( this.metadata.indices ).sort();
			return { tag: "DIV", cls: "uiQueryFilter-section uiQueryFilter-indices", children: [
				{ tag: "HEADER", text: i18n.text("QueryFilter-Header-Indices") },
				{ tag: "DIV", onClick: this._selectIndex_handler, children: indices.map( function( name ) {
					return { tag: "DIV", cls: "uiQueryFilter-booble uiQueryFilter-index", text: name };
				})}
			] };
		},
		_typesSelector_template: function() {
			var types = Object.keys( this.metadata.types ).sort();
			return { tag: "DIV", cls: "uiQueryFilter-section uiQueryFilter-types", children: [
				{ tag: "HEADER", text: i18n.text("QueryFilter-Header-Types") },
				{ tag: "DIV", onClick: this._selectType_handler, children: types.map( function( name ) {
					return { tag: "DIV", cls: "uiQueryFilter-booble uiQueryFilter-type", text: name };
				})}
			] };
		},
		_filters_template: function() {
			var _metadataFields = this.metadata.fields;
			var fields = Object.keys( _metadataFields ).sort()
				.filter(function(d) { return (_metadataFields[d].core_type !== undefined); });
			return { tag: "DIV", cls: "uiQueryFilter-section uiQueryFilter-filters", children: [
				{ tag: "HEADER", text: i18n.text("QueryFilter-Header-Fields") },
				{ tag: "DIV", children: fields.map( function(name ) {
					return new app.ui.SidebarSection({
						title: name,
						help: this.helpTypeMap[this.metadata.fields[ name ].type],
						onShow: this._openFilter_handler
					});
				}, this ) }
			] };
		},
		_textFilter_template: function(spec) {
			return { tag: "INPUT", data: { spec: spec }, onKeyup: this._textFilterChange_handler };
		},
		_dateFilter_template: function(spec) {
			return { tag: "DIV", children: [
				{ tag: "INPUT", data: { spec: spec }, onKeyup: this._dateFilterChange_handler },
				{ tag: "PRE", cls: "uiQueryFilter-rangeHintFrom", text: i18n.text("QueryFilter.DateRangeHint.from", "")},
				{ tag: "PRE", cls: "uiQueryFilter-rangeHintTo", text: i18n.text("QueryFilter.DateRangeHint.to", "") }
			]};
		},
		_numericFilter_template: function(spec) {
			return { tag: "INPUT", data: { spec: spec }, onKeyup: this._numericFilterChange_handler };
		},
		_booleanFilter_template: function(spec) {
			return { tag: "SELECT", data: { spec: spec }, onChange: this._booleanFilterChange_handler,
				children: [ i18n.text("QueryFilter.AnyValue"), "true", "false" ].map( function( val ) {
					return { tag: "OPTION", value: val, text: val };
				})
			};
		},
		_multiFieldFilter_template: function(section, spec) {
			return {
				tag : "DIV", cls : "uiQueryFilter-subMultiFields", children : acx.eachMap(spec.fields, function(name, data) {
					if (name === spec.field_name) {
						section.config.title = spec.field_name + "." + name;
						return this._openFilter_handler(section);
					}
					return new app.ui.SidebarSection({
						title : data.field_name, help : this.helpTypeMap[data.type], onShow : this._openFilter_handler
					});
				}, this)
			};
		}	
	});

})( this.jQuery, this.app, this.i18n );

(function( app ) {

	var ui = app.ns("ui");

	ui.Page = ui.AbstractWidget.extend({
		show: function() {
			this.el.show();
		},
		hide: function() {
			this.el.hide();
		}
	});

})( this.app );
(function( $, app, i18n ){

	var ui = app.ns("ui");
	var data = app.ns("data");

	ui.Browser = ui.Page.extend({
		defaults: {
			cluster: null  // (required) instanceof app.services.Cluster
		},
		init: function() {
			this._super();
			this.cluster = this.config.cluster;
			this.query = new app.data.Query( { cluster: this.cluster } );
			this._refreshButton = new ui.Button({
				label: i18n.text("General.RefreshResults"),
				onclick: function( btn ) {
					this.query.query();
				}.bind(this)
			});
			this.el = $(this._main_template());
			new data.MetaDataFactory({
				cluster: this.cluster,
				onReady: function(metadata) {
					this.metadata = metadata;
					this.store = new data.QueryDataSourceInterface( { metadata: metadata, query: this.query } );
					this.queryFilter = new ui.QueryFilter({ metadata: metadata, query: this.query });
					this.queryFilter.attach(this.el.find("> .uiBrowser-filter") );
					this.resultTable = new ui.ResultTable( {
						onHeaderClick: this._changeSort_handler,
						store: this.store
					} );
					this.resultTable.attach( this.el.find("> .uiBrowser-table") );
					this.updateResults();
				}.bind(this)
			});
		},
		updateResults: function() {
			this.query.query();
		},
		_changeSort_handler: function(table, wEv) {
			this.query.setSort(wEv.column, wEv.dir === "desc");
			this.query.setPage(1);
			this.query.query();
		},
		_main_template: function() {
			return { tag: "DIV", cls: "uiBrowser", children: [
				new ui.Toolbar({
					label: i18n.text("Browser.Title"),
					left: [ ],
					right: [ this._refreshButton ]
				}),
				{ tag: "DIV", cls: "uiBrowser-filter" },
				{ tag: "DIV", cls: "uiBrowser-table" }
			] };
		}
	});

})( this.jQuery, this.app, this.i18n );

(function( $, app, i18n, raphael ) {

	var ui = app.ns("ui");
	var ut = app.ns("ut");
	var services = app.ns("services");

	ui.AnyRequest = ui.Page.extend({
		defaults: {
			cluster: null,       // (required) instanceof app.services.Cluster
			path: "_search",     // default uri to send a request to
			query: { query: { match_all: { }}},
			transform: "  return root;" // default transformer function (does nothing)
		},
		init: function(parent) {
			this._super();
			this.prefs = services.Preferences.instance();
			this.history = this.prefs.get("anyRequest-history") || [ { type: "POST", path: this.config.path, query : JSON.stringify(this.config.query), transform: this.config.transform } ];
			this.el = $.joey(this._main_template());
			this.base_uriEl = this.el.find("INPUT[name=base_uri]");
			this.pathEl = this.el.find("INPUT[name=path]");
			this.typeEl = this.el.find("SELECT[name=method]");
			this.dataEl = this.el.find("TEXTAREA[name=body]");
			this.prettyEl = this.el.find("INPUT[name=pretty]");
			this.transformEl = this.el.find("TEXTAREA[name=transform]");
			this.asGraphEl = this.el.find("INPUT[name=asGraph]");
			this.asTableEl = this.el.find("INPUT[name=asTable]");
			this.asJsonEl = this.el.find("INPUT[name=asJson]");
			this.cronEl = this.el.find("SELECT[name=cron]");
			this.outEl = this.el.find("DIV.uiAnyRequest-out");
			this.errEl = this.el.find("DIV.uiAnyRequest-jsonErr");
			this.typeEl.val("GET");
			this.attach(parent);
			this.setHistoryItem(this.history[this.history.length - 1]);
		},
		setHistoryItem: function(item) {
			this.pathEl.val(item.path);
			this.typeEl.val(item.type);
			this.dataEl.val(item.query);
			this.transformEl.val(item.transform);
		},
		_request_handler: function( ev ) {
			if(! this._validateJson_handler()) {
				return;
			}
			var path = this.pathEl.val(),
					type = this.typeEl.val(),
					query = JSON.stringify(JSON.parse(this.dataEl.val())),
					transform = this.transformEl.val(),
					base_uri = this.base_uriEl.val();
			if( ev ) { // if the user click request
				if(this.timer) {
					window.clearTimeout(this.timer); // stop any cron jobs
				}
				delete this.prevData; // remove data from previous cron runs
				this.outEl.text(i18n.text("AnyRequest.Requesting"));
				if( ! /\/$/.test( base_uri )) {
					base_uri += "/";
					this.base_uriEl.val( base_uri );
				}
				for(var i = 0; i < this.history.length; i++) {
					if(this.history[i].path === path &&
						this.history[i].type === type &&
						this.history[i].query === query &&
						this.history[i].transform === transform) {
						this.history.splice(i, 1);
					}
				}
				this.history.push({
					path: path,
					type: type,
					query: query,
					transform: transform
				});
				this.history.slice(250); // make sure history does not get too large
				this.prefs.set( "anyRequest-history", this.history );
				this.el.find("UL.uiAnyRequest-history")
					.empty()
					.append($( { tag: "UL", children: this.history.map(this._historyItem_template, this) }).children())
					.children().find(":last-child").each(function(i, j) { j.scrollIntoView(false); }).end()
					.scrollLeft(0);
			}
			this.config.cluster.request({
				url: base_uri + path,
				type: type,
				data: query,
				success: this._responseWriter_handler,
				error: this._responseError_handler
			});
		},
		_responseError_handler: function (response) {
			var obj;
			try {
				obj = JSON.parse(response.responseText);
				if (obj) {
					this._responseWriter_handler(obj);
				}
			} catch (err) {
			}
		},
		_responseWriter_handler: function(data) {
			this.outEl.empty();
			try {
				data = (new Function("root", "prev", this.transformEl.val()))(data, this.prevData)
			} catch(e) {
				this.errEl.text(e.message);
				return;
			}
			if(this.asGraphEl.attr("checked")) {
				var w = this.outEl.width();
				raphael(this.outEl[0], w - 10, 300)
					.g.barchart(10, 10, w - 20, 280, [data]);
			}
			if(this.asTableEl.attr("checked")) {
				try {
					var store = new app.data.ResultDataSourceInterface();
					this.outEl.append(new app.ui.ResultTable({
						width: this.outEl.width() - 23,
						store: store
					} ) );
					store.results(data);
				} catch(e) {
					this.errEl.text("Results Table Failed: " + e.message);
				}
			}
			if(this.asJsonEl.attr("checked")) {
				this.outEl.append(new ui.JsonPretty({ obj: data }));
			}
			if(this.cronEl.val() > 0) {
				this.timer = window.setTimeout(function(){
					this._request_handler();
				}.bind(this), this.cronEl.val());
			}
			this.prevData = data;
		},
		_validateJson_handler: function( ev ) {
			/* if the textarea is empty, we replace its value by an empty JSON object : "{}" and the request goes on as usual */
			var jsonData = this.dataEl.val().trim();
			var j;
			if(jsonData === "") {
				jsonData = "{}";
				this.dataEl.val( jsonData );
			}
			try {
				j = JSON.parse(jsonData);
			} catch(e) {
				this.errEl.text(e.message);
				return false;
			}
			this.errEl.text("");
			if(this.prettyEl.attr("checked")) {
				this.dataEl.val(JSON.stringify(j, null, "  "));
			}
			return true;
		},
		_historyClick_handler: function( ev ) {
			var item = $( ev.target ).closest( "LI" ).data( "item" );
			this.setHistoryItem( item );
		},
		_main_template: function() {
			return { tag: "DIV", cls: "anyRequest", children: [
				{ tag: "DIV", cls: "uiAnyRequest-request", children: [
					new app.ui.SidebarSection({
						open: false,
						title: i18n.text("AnyRequest.History"),
						body: { tag: "UL", onclick: this._historyClick_handler, cls: "uiAnyRequest-history", children: this.history.map(this._historyItem_template, this)	}
					}),
					new app.ui.SidebarSection({
						open: true,
						title: i18n.text("AnyRequest.Query"),
						body: { tag: "DIV", children: [
							{ tag: "INPUT", type: "text", name: "base_uri", value: this.config.cluster.config.base_uri },
							{ tag: "BR" },
							{ tag: "INPUT", type: "text", name: "path", value: this.config.path },
							{ tag: "SELECT", name: "method", children: ["POST", "GET", "PUT", "HEAD", "DELETE"].map(ut.option_template) },
							{ tag: "TEXTAREA", name: "body", rows: 20, text: JSON.stringify(this.config.query) },
							{ tag: "BUTTON", css: { cssFloat: "right" }, type: "button", children: [ { tag: "B", text: i18n.text("AnyRequest.Request") } ], onclick: this._request_handler },
							{ tag: "BUTTON", type: "button", text: i18n.text("AnyRequest.ValidateJSON"), onclick: this._validateJson_handler },
							{ tag: "LABEL", children: [ { tag: "INPUT", type: "checkbox", name: "pretty" }, i18n.text("AnyRequest.Pretty") ] },
							{ tag: "DIV", cls: "uiAnyRequest-jsonErr" }
						]}
					}),
					new app.ui.SidebarSection({
						title: i18n.text("AnyRequest.Transformer"),
						help: "AnyRequest.TransformerHelp",
						body: { tag: "DIV", children: [
							{ tag: "CODE", text: "function(root, prev) {" },
							{ tag: "BR" },
							{ tag: "TEXTAREA", name: "transform", rows: 5, text: this.config.transform },
							{ tag: "BR" },
							{ tag: "CODE", text: "}" }
						] }
					}),
					new app.ui.SidebarSection({
						title: i18n.text("AnyRequest.RepeatRequest"),
						body: { tag: "DIV", children: [
							i18n.text("AnyRequest.RepeatRequestSelect"), " ",
							{ tag: "SELECT", name: "cron", children: [
								{ value: 0, text: "do not repeat" },
								{ value: 1000, text: "second" },
								{ value: 1000 * 2, text: "2 seconds" },
								{ value: 1000 * 5, text: "5 seconds" },
								{ value: 1000 * 20, text: "20 seconds" },
								{ value: 1000 * 60, text: "minute" },
								{ value: 1000 * 60 * 10, text: "10 minutes" },
								{ value: 1000 * 60 * 60, text: "hour" }
							].map(function(op) { return $.extend({ tag: "OPTION"}, op); }) }
						] }
					}),
					new app.ui.SidebarSection({
						title: i18n.text("AnyRequest.DisplayOptions"),
						help: "AnyRequest.DisplayOptionsHelp",
						body: { tag: "DIV", children: [
							{ tag: "LABEL", children: [ { tag: "INPUT", type: "checkbox", checked: true, name: "asJson" }, i18n.text("AnyRequest.AsJson") ] },
							{ tag: "BR" },
							{ tag: "LABEL", children: [ { tag: "INPUT", type: "checkbox", name: "asGraph" }, i18n.text("AnyRequest.AsGraph") ] },
							{ tag: "BR" },
							{ tag: "LABEL", children: [ { tag: "INPUT", type: "checkbox", name: "asTable" }, i18n.text("AnyRequest.AsTable") ] }
						] }
					})
				] },
				{ tag: "DIV", cls: "uiAnyRequest-out" }
			] };
		},
		_historyItem_template: function(item) {
			return { tag: "LI", cls: "booble", data: { item: item }, children: [
				{ tag: "SPAN", text: item.path },
				" ",
				{ tag: "EM", text: item.query },
				" ",
				{ tag: "SPAN", text: item.transform }
			] };
		}
	});
	
})( this.jQuery, this.app, this.i18n, this.Raphael );

(function( app, i18n, joey ) {

	var ui = app.ns("ui");
	var ut = app.ns("ut");

	ui.NodesView = ui.AbstractWidget.extend({
		defaults: {
			interactive: true,
			aliasRenderer: "list",
			scaleReplicas: 1,
			cluster: null,
			data: null
		},
		init: function() {
			this._super();
			this.interactive = this.config.interactive;
			this.cluster = this.config.cluster;
			this._aliasRenderFunction = {
				"none": this._aliasRender_template_none,
				"list": this._aliasRender_template_list,
				"full": this._aliasRender_template_full
			}[ this.config.aliasRenderer ];
			this._styleSheetEl = joey({ tag: "STYLE", text: ".uiNodesView-nullReplica, .uiNodesView-replica { zoom: " + this.config.scaleReplicas + " }" });
			this.el = $( this._main_template( this.config.data.cluster, this.config.data.indices ) );
		},

		_newAliasAction_handler: function( index ) {
			var fields = new app.ux.FieldCollection({
				fields: [
					new ui.TextField({ label: i18n.text("AliasForm.AliasName"), name: "alias", require: true })
				]
			});
			var dialog = new ui.DialogPanel({
				title: i18n.text("AliasForm.NewAliasForIndexName", index.name),
				body: new ui.PanelForm({ fields: fields }),
				onCommit: function(panel, args) {
					if(fields.validate()) {
						var data = fields.getData();
						var command = {
							"actions" : [
								{ "add" : { "index" : index.name, "alias" : data["alias"] } }
							]
						};
						this.config.cluster.post('_aliases', JSON.stringify(command), function(d) {
							dialog.close();
							alert(JSON.stringify(d));
							this.fire("redraw");
						}.bind(this) );
					}
				}.bind(this)
			}).open();
		},
		_postIndexAction_handler: function(action, index, redraw) {
			this.cluster.post(encodeURIComponent( index.name ) + "/" + encodeURIComponent( action ), null, function(r) {
				alert(JSON.stringify(r));
				redraw && this.fire("redraw");
			}.bind(this));
		},
		_optimizeIndex_handler: function(index) {
			var fields = new app.ux.FieldCollection({
				fields: [
					new ui.TextField({ label: i18n.text("OptimizeForm.MaxSegments"), name: "max_num_segments", value: "1", require: true }),
					new ui.CheckField({ label: i18n.text("OptimizeForm.ExpungeDeletes"), name: "only_expunge_deletes", value: false }),
					new ui.CheckField({ label: i18n.text("OptimizeForm.FlushAfter"), name: "flush", value: true }),
					new ui.CheckField({ label: i18n.text("OptimizeForm.WaitForMerge"), name: "wait_for_merge", value: false })
				]
			});
			var dialog = new ui.DialogPanel({
				title: i18n.text("OptimizeForm.OptimizeIndex", index.name),
				body: new ui.PanelForm({ fields: fields }),
				onCommit: function( panel, args ) {
					if(fields.validate()) {
						this.cluster.post(encodeURIComponent( index.name ) + "/_optimize", fields.getData(), function(r) {
							alert(JSON.stringify(r));
						});
						dialog.close();
					}
				}.bind(this)
			}).open();
		},
		_testAnalyser_handler: function(index) {
			this.cluster.get(encodeURIComponent( index.name ) + "/_analyze?text=" + encodeURIComponent( prompt( i18n.text("IndexCommand.TextToAnalyze") ) ), function(r) {
				alert(JSON.stringify(r, true, "  "));
			});
		},
		_deleteIndexAction_handler: function(index) {
			if( prompt( i18n.text("AliasForm.DeleteAliasMessage", i18n.text("Command.DELETE"), index.name ) ) === i18n.text("Command.DELETE") ) {
				this.cluster["delete"](encodeURIComponent( index.name ), null, function(r) {
					alert(JSON.stringify(r));
					this.fire("redraw");
				}.bind(this) );
			}
		},
		_shutdownNode_handler: function(node) {
			if(prompt( i18n.text("IndexCommand.ShutdownMessage", i18n.text("Command.SHUTDOWN"), node.cluster.name ) ) === i18n.text("Command.SHUTDOWN") ) {
				this.cluster.post( "_cluster/nodes/" + encodeURIComponent( node.name ) + "/_shutdown", null, function(r) {
					alert(JSON.stringify(r));
					this.fire("redraw");
				}.bind(this));
			}
		},
		_deleteAliasAction_handler: function( index, alias ) {
			if( confirm( i18n.text("Command.DeleteAliasMessage" ) ) ) {
				var command = {
					"actions" : [
						{ "remove" : { "index" : index.name, "alias" : alias.name } }
					]
				};
				this.config.cluster.post('_aliases', JSON.stringify(command), function(d) {
					alert(JSON.stringify(d));
					this.fire("redraw");
				}.bind(this) );
			}
		},

		_replica_template: function(replica) {
			var r = replica.replica;
			return { tag: "DIV",
				cls: "uiNodesView-replica" + (r.primary ? " primary" : "") + ( " state-" + r.state ),
				text: r.shard.toString(),
				onclick: function() { new ui.JsonPanel({
					json: replica.status || r,
					title: r.index + "/" + r.node + " [" + r.shard + "]" });
				}
			};
		},
		_routing_template: function(routing) {
			var cell = { tag: "TD", cls: "uiNodesView-routing" + (routing.open ? "" : " close"), children: [] };
			for(var i = 0; i < routing.replicas.length; i++) {
				if(i % routing.max_number_of_shards === 0 && i > 0) {
					cell.children.push({ tag: "BR" });
				}
				if( routing.replicas[i] ) {
					cell.children.push(this._replica_template(routing.replicas[i]));
				} else {
					cell.children.push( { tag: "DIV", cls: "uiNodesView-nullReplica" } );
				}
			}
			return cell;
		},
		_nodeControls_template: function( node ) { return (
			{ tag: "DIV", cls: "uiNodesView-controls", children: [
				new ui.MenuButton({
					label: i18n.text("NodeInfoMenu.Title"),
					menu: new ui.MenuPanel({
						items: [
							{ text: i18n.text("NodeInfoMenu.ClusterNodeInfo"), onclick: function() { new ui.JsonPanel({ json: node.cluster, title: node.name });} },
							{ text: i18n.text("NodeInfoMenu.NodeStats"), onclick: function() { new ui.JsonPanel({ json: node.stats, title: node.name });} }
						]
					})
				}),
				new ui.MenuButton({
					label: i18n.text("NodeActionsMenu.Title"),
					menu: new ui.MenuPanel({
						items: [
							{ text: i18n.text("NodeActionsMenu.Shutdown"), onclick: function() { this._shutdownNode_handler(node); }.bind(this) }
						]
					})
				})
			] }
		); },
		_nodeIcon_template: function( node ) {
			var icon, alt;
			if( node.name === "Unassigned" ) {
				icon = "fa-exclamation-triangle";
				alt = i18n.text( "NodeType.Unassigned" );
			} else if( node.cluster.settings && "tribe" in node.cluster.settings) {
				icon = "fa-sitemap";
				alt = i18n.text("NodeType.Tribe" );
			} else {
				icon = "fa-" + (node.master_node ? "star" : "circle") + (node.data_node ? "" : "-o" );
				alt = i18n.text( node.master_node ? ( node.data_node ? "NodeType.Master" : "NodeType.Coord" ) : ( node.data_node ? "NodeType.Worker" : "NodeType.Client" ) );
			}
			return { tag: "TD", title: alt, cls: "uiNodesView-icon", children: [
				{ tag: "SPAN", cls: "fa fa-2x " + icon }
			] };
		},
		_node_template: function(node) {
			return { tag: "TR", cls: "uiNodesView-node" + (node.master_node ? " master": ""), children: [
				this._nodeIcon_template( node ),
				{ tag: "TH", children: node.name === "Unassigned" ? [
					{ tag: "H3", text: node.name }
				] : [
					{ tag: "H3", text: node.cluster.name },
					{ tag: "DIV", text: node.cluster.hostname },
					this.interactive ? this._nodeControls_template( node ) : null
				] }
			].concat(node.routings.map(this._routing_template, this))};
		},
		_indexHeaderControls_template: function( index ) { return (
			{ tag: "DIV", cls: "uiNodesView-controls", children: [
				new ui.MenuButton({
					label: i18n.text("IndexInfoMenu.Title"),
					menu: new ui.MenuPanel({
						items: [
							{ text: i18n.text("IndexInfoMenu.Status"), onclick: function() { new ui.JsonPanel({ json: index.status, title: index.name }); } },
							{ text: i18n.text("IndexInfoMenu.Metadata"), onclick: function() { new ui.JsonPanel({ json: index.metadata, title: index.name }); } }
						]
					})
				}),
				new ui.MenuButton({
					label: i18n.text("IndexActionsMenu.Title"),
					menu: new ui.MenuPanel({
						items: [
							{ text: i18n.text("IndexActionsMenu.NewAlias"), onclick: function() { this._newAliasAction_handler(index); }.bind(this) },
							{ text: i18n.text("IndexActionsMenu.Refresh"), onclick: function() { this._postIndexAction_handler("_refresh", index, false); }.bind(this) },
							{ text: i18n.text("IndexActionsMenu.Flush"), onclick: function() { this._postIndexAction_handler("_flush", index, false); }.bind(this) },
							{ text: i18n.text("IndexActionsMenu.Optimize"), onclick: function () { this._optimizeIndex_handler(index); }.bind(this) },
							{ text: i18n.text("IndexActionsMenu.Snapshot"), disabled: closed, onclick: function() { this._postIndexAction_handler("_gateway/snapshot", index, false); }.bind(this) },
							{ text: i18n.text("IndexActionsMenu.Analyser"), onclick: function() { this._testAnalyser_handler(index); }.bind(this) },
							{ text: (index.state === "close") ? i18n.text("IndexActionsMenu.Open") : i18n.text("IndexActionsMenu.Close"), onclick: function() { this._postIndexAction_handler((index.state === "close") ? "_open" : "_close", index, true); }.bind(this) },
							{ text: i18n.text("IndexActionsMenu.Delete"), onclick: function() { this._deleteIndexAction_handler(index); }.bind(this) }
						]
					})
				})
			] }
		); },
		_indexHeader_template: function( index ) {
			var closed = index.state === "close";
			var line1 = closed ? "index: close" : ( "size: " + (index.status && index.status.primaries && index.status.total ? ut.byteSize_template( index.status.primaries.store.size_in_bytes ) + " (" + ut.byteSize_template( index.status.total.store.size_in_bytes ) + ")" : "unknown" ) );
			var line2 = closed ? "\u00A0" : ( "docs: " + (index.status && index.status.primaries && index.status.primaries.docs && index.status.total && index.status.total.docs ? index.status.primaries.docs.count.toLocaleString() + " (" + (index.status.total.docs.count + index.status.total.docs.deleted).toLocaleString() + ")" : "unknown" ) );
			return index.name ? { tag: "TH", cls: (closed ? "close" : ""), children: [
				{ tag: "H3", text: index.name },
				{ tag: "DIV", text: line1 },
				{ tag: "DIV", text: line2 },
				this.interactive ? this._indexHeaderControls_template( index ) : null
			] } : [ { tag: "TD" }, { tag: "TH" } ];
		},
		_aliasRender_template_none: function( cluster, indices ) {
			return null;
		},
		_aliasRender_template_list: function( cluster, indices ) {
			return cluster.aliases.length && { tag: "TBODY", children: [
				{ tag: "TR", children: [
					{ tag: "TD" }
				].concat( indices.map( function( index ) {
					return { tag: "TD", children: index.metadata && index.metadata.aliases.map( function( alias ) {
						return { tag: "LI", text: alias };
					} ) };
				})) }
			] };
		},
		_aliasRender_template_full: function( cluster, indices ) {
			return cluster.aliases.length && { tag: "TBODY", children: cluster.aliases.map( function(alias, row) {
				return { tag: "TR", children: [ { tag: "TD" },{ tag: "TD" } ].concat(alias.indices.map(function(index, i) {
					if (index) {
						return {
							tag: "TD",
							css: { background: "#" + "9ce9c7fc9".substr((row+6)%7,3) },
							cls: "uiNodesView-hasAlias" + ( alias.min === i ? " min" : "" ) + ( alias.max === i ? " max" : "" ),
							text: alias.name,
							children: this.interactive ? [
								{	tag: 'SPAN',
									text: i18n.text("General.CloseGlyph"),
									cls: 'uiNodesView-hasAlias-remove',
									onclick: this._deleteAliasAction_handler.bind( this, index, alias )
								}
							]: null
						};
					}	else {
						return { tag: "TD" };
					}
				}, this ) ) };
			}, this )	};
		},
		_main_template: function(cluster, indices) {
			return { tag: "TABLE", cls: "table uiNodesView", children: [
				this._styleSheetEl,
				{ tag: "THEAD", children: [ { tag: "TR", children: indices.map(this._indexHeader_template, this) } ] },
				this._aliasRenderFunction( cluster, indices ),
				{ tag: "TBODY", children: cluster.nodes.map(this._node_template, this) }
			] };
		}

	});

})( this.app, this.i18n, this.joey );

(function( $, app, i18n ) {

	var ui = app.ns("ui");
	var services = app.ns("services");

	// ( master ) master = true, data = true
	// ( coordinator ) master = true, data = false
	// ( worker ) master = false, data = true;
	// ( client ) master = false, data = false;
	// http enabled ?

	function nodeSort_name(a, b) {
		if (!(a.cluster && b.cluster)) {
			return 0;
		}
		return a.cluster.name.toString().localeCompare( b.cluster.name.toString() );
	}

	function nodeSort_addr( a, b ) {
		if (!(a.cluster && b.cluster && a.cluster.transport_address && b.cluster.transport_address)) {
			return 0;
		}
		return a.cluster.transport_address.toString().localeCompare( b.cluster.transport_address.toString() );
	}

	function nodeSort_type( a, b ) {
		if (!(a.cluster && b.cluster)) {
			return 0;
		}
		if( a.master_node ) {
			return -1;
		} else if( b.master_node ) {
			return 1;
		} else if( a.data_node && !b.data_node ) {
			return -1;
		} else if( b.data_node && !a.data_node ) {
			return 1;
		} else {
			return a.cluster.name.toString().localeCompare( b.cluster.name.toString() );
		}
	}

	var NODE_SORT_TYPES = {
		"Sort.ByName": nodeSort_name,
		"Sort.ByAddress": nodeSort_addr,
		"Sort.ByType": nodeSort_type
	};

	function nodeFilter_none( a ) {
		return true;
	}

	function nodeFilter_clients( a ) {
		return (a.master_node || a.data_node );
	}


	ui.ClusterOverview = ui.Page.extend({
		defaults: {
			cluster: null // (reqired) an instanceof app.services.Cluster
		},
		init: function() {
			this._super();
			this.cluster = this.config.cluster;
			this.prefs = services.Preferences.instance();
			this._clusterState = this.config.clusterState;
			this._clusterState.on("data", this.draw_handler );
			this._refreshButton = new ui.RefreshButton({
				onRefresh: this.refresh.bind(this),
				onChange: function( btn ) {
					if( btn.value === -1 ) {
						this.draw_handler();
					}
				}.bind( this )
			});
			var nodeSortPref = this.prefs.get("clusterOverview-nodeSort") || Object.keys(NODE_SORT_TYPES)[0];
			this._nodeSort = NODE_SORT_TYPES[ nodeSortPref ];
			this._nodeSortMenu = new ui.MenuButton({
				label: i18n.text( "Preference.SortCluster" ),
				menu: new ui.SelectMenuPanel({
					value: nodeSortPref,
					items: Object.keys( NODE_SORT_TYPES ).map( function( k ) {
						return { text: i18n.text( k ), value: k };
					}),
					onSelect: function( panel, event ) {
						this._nodeSort = NODE_SORT_TYPES[ event.value ];
						this.prefs.set("clusterOverview-nodeSort", event.value );
						this.draw_handler();
					}.bind(this)
				})
			});
			this._indicesSort = this.prefs.get( "clusterOverview-indicesSort") || "desc";
			this._indicesSortMenu = new ui.MenuButton({
				label: i18n.text( "Preference.SortIndices" ),
				menu: new ui.SelectMenuPanel({
					value: this._indicesSort,
					items: [
						{ value: "desc", text: i18n.text( "SortIndices.Descending" ) },
						{ value: "asc", text: i18n.text( "SortIndices.Ascending" ) } ],
					onSelect: function( panel, event ) {
						this._indicesSort = event.value;
						this.prefs.set( "clusterOverview-indicesSort", this._indicesSort );
						this.draw_handler();
					}.bind(this)
				})
			});
			this._aliasRenderer = this.prefs.get( "clusterOverview-aliasRender" ) || "full";
			this._aliasMenu = new ui.MenuButton({
				label: i18n.text( "Preference.ViewAliases" ),
				menu: new ui.SelectMenuPanel({
					value: this._aliasRenderer,
					items: [
						{ value: "full", text: i18n.text( "ViewAliases.Grouped" ) },
						{ value: "list", text: i18n.text( "ViewAliases.List" ) },
						{ value: "none", text: i18n.text( "ViewAliases.None" ) } ],
					onSelect: function( panel, event ) {
						this._aliasRenderer = event.value;
						this.prefs.set( "clusterOverview-aliasRender", this._aliasRenderer );
						this.draw_handler();
					}.bind(this)
				})
			});
			this._indexFilter = new ui.TextField({
				value: this.prefs.get("clusterOverview-indexFilter"),
				placeholder: i18n.text( "Overview.IndexFilter" ),
				onchange: function( indexFilter ) {
					this.prefs.set("clusterOverview-indexFilter", indexFilter.val() );
					this.draw_handler();
				}.bind(this)
			});
			this.el = $(this._main_template());
			this.tablEl = this.el.find(".uiClusterOverview-table");
			this.refresh();
		},
		remove: function() {
			this._clusterState.removeObserver( "data", this.draw_handler );
		},
		refresh: function() {
			this._refreshButton.disable();
			this._clusterState.refresh();
		},
		draw_handler: function() {
			var data = this._clusterState;
			var indexFilter;
			try {
				var indexFilterRe = new RegExp( this._indexFilter.val() );
				indexFilter = function(s) { return indexFilterRe.test(s); };
			} catch(e) {
				indexFilter = function() { return true; };
			}
			var clusterState = data.clusterState;
			var status = data.status;
			var nodeStats = data.nodeStats;
			var clusterNodes = data.clusterNodes;
			var nodes = [];
			var indices = [];
			var cluster = {};
			var nodeIndices = {};
			var indexIndices = {}, indexIndicesIndex = 0;
			function newNode(n) {
				return {
					name: n,
					routings: [],
					master_node: clusterState.master_node === n
				};
			}
			function newIndex(i) {
				return {
					name: i,
					replicas: []
				};
			}
			function getIndexForNode(n) {
				return nodeIndices[n] = (n in nodeIndices) ? nodeIndices[n] : nodes.push(newNode(n)) - 1;
			}
			function getIndexForIndex(routings, i) {
				var index = indexIndices[i] = (i in indexIndices) ?
						(routings[indexIndices[i]] = routings[indexIndices[i]] || newIndex(i)) && indexIndices[i]
						: ( ( routings[indexIndicesIndex] = newIndex(i) )  && indexIndicesIndex++ );
				indices[index] = i;
				return index;
			}
			$.each(clusterNodes.nodes, function(name, node) {
				getIndexForNode(name);
			});

			var indexNames = [];
			$.each(clusterState.routing_table.indices, function(name, index){
				indexNames.push(name);
			});
			indexNames.sort();
			if (this._indicesSort === "desc") indexNames.reverse();
			indexNames.filter( indexFilter ).forEach(function(name) {
				var indexObject = clusterState.routing_table.indices[name];
				$.each(indexObject.shards, function(name, shard) {
					shard.forEach(function(replica){
						var node = replica.node;
						if(node === null) { node = "Unassigned"; }
						var index = replica.index;
						var shard = replica.shard;
						var routings = nodes[getIndexForNode(node)].routings;
						var indexIndex = getIndexForIndex(routings, index);
						var replicas = routings[indexIndex].replicas;
						if(node === "Unassigned" || !indexObject.shards[shard]) {
							replicas.push({ replica: replica });
						} else {
							replicas[shard] = {
								replica: replica,
								status: indexObject.shards[shard].filter(function(replica) {
									return replica.node === node;
								})[0]
							};
						}
					});
				});
			});
			indices = indices.map(function(index){
				return {
					name: index,
					state: "open",
					metadata: clusterState.metadata.indices[index],
					status: status.indices[index]
				};
			}, this);
			$.each(clusterState.metadata.indices, function(name, index) {
				if(index.state === "close" && indexFilter( name )) {
					indices.push({
						name: name,
						state: "close",
						metadata: index,
						status: null
					});
				}
			});
			nodes.forEach(function(node) {
				node.stats = nodeStats.nodes[node.name];
				var cluster = clusterNodes.nodes[node.name];
				node.cluster = cluster || { name: "<unknown>" };
				node.data_node = !( cluster && cluster.attributes && cluster.attributes.data === "false" );
				for(var i = 0; i < indices.length; i++) {
					node.routings[i] = node.routings[i] || { name: indices[i].name, replicas: [] };
					node.routings[i].max_number_of_shards = indices[i].metadata.settings["index.number_of_shards"];
					node.routings[i].open = indices[i].state === "open";
				}
			});
			var aliasesIndex = {};
			var aliases = [];
			var indexClone = indices.map(function() { return false; });
			$.each(clusterState.metadata.indices, function(name, index) {
				index.aliases.forEach(function(alias) {
					var aliasIndex = aliasesIndex[alias] = (alias in aliasesIndex) ? aliasesIndex[alias] : aliases.push( { name: alias, max: -1, min: 999, indices: [].concat(indexClone) }) - 1;
					var indexIndex = indexIndices[name];
					var aliasRow = aliases[aliasIndex];
					aliasRow.min = Math.min(aliasRow.min, indexIndex);
					aliasRow.max = Math.max(aliasRow.max, indexIndex);
					aliasRow.indices[indexIndex] = indices[indexIndex];
				});
			});
			cluster.aliases = aliases;
			cluster.nodes = nodes
				.filter( nodeFilter_none )
				.sort( this._nodeSort );
			indices.unshift({ name: null });
			this._drawNodesView( cluster, indices );
			this._refreshButton.enable();
		},
		_drawNodesView: function( cluster, indices ) {
			this._nodesView && this._nodesView.remove();
			this._nodesView = new ui.NodesView({
				onRedraw: function() {
					this.refresh();
				}.bind(this),
				interactive: ( this._refreshButton.value === -1 ),
				aliasRenderer: this._aliasRenderer,
				cluster: this.cluster,
				data: {
					cluster: cluster,
					indices: indices
				}
			});
			this._nodesView.attach( this.tablEl );
		},
		_main_template: function() {
			return { tag: "DIV", id: this.id(), cls: "uiClusterOverview", children: [
				new ui.Toolbar({
					label: i18n.text("Overview.PageTitle"),
					left: [
						this._nodeSortMenu,
						this._indicesSortMenu,
						this._aliasMenu,
						this._indexFilter
					],
					right: [
						this._refreshButton
					]
				}),
				{ tag: "DIV", cls: "uiClusterOverview-table" }
			] };
		}
	});

})( this.jQuery, this.app, this.i18n );

(function( app, i18n, raphael ) {

	var ui = app.ns("ui");

	ui.DateHistogram = ui.AbstractWidget.extend({
		defaults: {
			printEl: null, // (optional) if supplied, clicking on elements in the histogram changes the query
			cluster: null, // (required)
			query: null,   // (required) the current query
			spec: null     // (required) // date field spec
		},
		init: function() {
			this._super();
			this.el = $(this._main_template());
			this.query = this.config.query.clone();
			// check if the index/types have changed and rebuild the histogram
			this.config.query.on("results", function(query) {
				if(this.queryChanged) {
					this.buildHistogram(query);
					this.queryChanged = false;
				}
			}.bind(this));
			this.config.query.on("setIndex", function(query, params) {
				this.query.setIndex(params.index, params.add);
				this.queryChanged = true;
			}.bind(this));
			this.config.query.on("setType", function(query, params) {
				this.query.setType(params.type, params.add);
				this.queryChanged = true;
			}.bind(this));
			this.query.search.size = 0;
			this.query.on("results", this._stat_handler);
			this.query.on("results", this._aggs_handler);
			this.buildHistogram();
		},
		buildHistogram: function(query) {
			this.statAggs = this.query.addAggs({
				stats: { field: this.config.spec.field_name }
			});
			this.query.query();
			this.query.removeAggs(this.statAggs);
		},
		_stat_handler: function(query, results) {
			if(! results.aggregations[this.statAggs]) { return; }
			this.stats = results.aggregations[this.statAggs];
			// here we are calculating the approximate range  that will give us less than 121 columns
			var rangeNames = [ "year", "year", "month", "day", "hour", "minute" ];
			var rangeFactors = [100000, 12, 30, 24, 60, 60000 ];
			this.intervalRange = 1;
			var range = this.stats.max - this.stats.min;
			do {
				this.intervalName = rangeNames.pop();
				var factor = rangeFactors.pop();
				this.intervalRange *= factor;
				range = range / factor;
			} while(range > 70);
			this.dateAggs = this.query.addAggs({
				date_histogram : {
					field: this.config.spec.field_name,
					interval: this.intervalName
				}
			});
			this.query.query();
			this.query.removeAggs(this.dateAggs);
		},
		_aggs_handler: function(query, results) {
			if(! results.aggregations[this.dateAggs]) { return; }
			var buckets = [], range = this.intervalRange;
			var min = Math.floor(this.stats.min / range) * range;
			var prec = [ "year", "month", "day", "hour", "minute", "second" ].indexOf(this.intervalName);
			results.aggregations[this.dateAggs].buckets.forEach(function(entry) {
				buckets[parseInt((entry.key - min) / range , 10)] = entry.doc_count;
			}, this);
			for(var i = 0; i < buckets.length; i++) {
				buckets[i] = buckets[i] || 0;
			}
			this.el.removeClass("loading");
			var el = this.el.empty();
			var w = el.width(), h = el.height();
			var r = raphael(el[0], w, h );
			var printEl = this.config.printEl;
			query = this.config.query;
			r.g.barchart(0, 0, w, h, [buckets], { gutter: "0", vgutter: 0 }).hover(
				function() {
					this.flag = r.g.popup(this.bar.x, h - 5, this.value || "0").insertBefore(this);
				}, function() {
					this.flag.animate({opacity: 0}, 200, ">", function () {this.remove();});
				}
			).click(function() {
				if(printEl) {
					printEl.val(window.dateRangeParser.print(min + this.bar.index * range, prec));
					printEl.trigger("keyup");
					query.query();
				}
			});
		},
		_main_template: function() { return (
			{ tag: "DIV", cls: "uiDateHistogram loading", css: { height: "50px" }, children: [
				i18n.text("General.LoadingAggs")
			] }
		); }
	});

})( this.app, this.i18n, this.Raphael );
(function( $, app, i18n ) {

	var ui = app.ns("ui");
	var services = app.ns("services");

	ui.ClusterConnect = ui.AbstractWidget.extend({
		defaults: {
			cluster: null
		},
		init: function() {
			this._super();
			this.prefs = services.Preferences.instance();
			this.cluster = this.config.cluster;
			this.el = $.joey(this._main_template());
			this.cluster.get( "", this._node_handler );
		},
		
		_node_handler: function(data) {
			if(data) {
				this.prefs.set("app-base_uri", this.cluster.base_uri);
			}
		},
		
		_reconnect_handler: function() {
			var base_uri = this.el.find(".uiClusterConnect-uri").val();
			$("body").empty().append(new app.App("body", { id: "es", base_uri: base_uri }));
		},
		
		_main_template: function() {
			return { tag: "SPAN", cls: "uiClusterConnect", children: [
				{ tag: "INPUT", type: "text", cls: "uiClusterConnect-uri", onkeyup: function( ev ) {
					if(ev.which === 13) {
						ev.preventDefault();
						this._reconnect_handler();
					}
				}.bind(this), id: this.id("baseUri"), value: this.cluster.base_uri },
				{ tag: "BUTTON", type: "button", text: i18n.text("Header.Connect"), onclick: this._reconnect_handler }
			]};
		}
	});

})( this.jQuery, this.app, this.i18n );


(function( $, app, i18n ) {

	var ui = app.ns("ui");
	var data = app.ns("data");

	var StructuredQuery = ui.AbstractWidget.extend({
		defaults: {
			cluster: null  // (required) instanceof app.services.Cluster
		},
		_baseCls: "uiStructuredQuery",
		init: function(parent) {
			this._super();
			this.selector = new ui.IndexSelector({
				onIndexChanged: this._indexChanged_handler,
				cluster: this.config.cluster
			});
			this.el = $(this._main_template());
			this.out = this.el.find("DIV.uiStructuredQuery-out");
			this.attach( parent );
		},
		
		_indexChanged_handler: function( index ) {
			this.filter && this.filter.remove();
			this.filter = new ui.FilterBrowser({
				cluster: this.config.cluster,
				index: index,
				onStartingSearch: function() { this.el.find("DIV.uiStructuredQuery-out").text( i18n.text("General.Searching") ); this.el.find("DIV.uiStructuredQuery-src").hide(); }.bind(this),
				onSearchSource: this._searchSource_handler,
				onResults: this._results_handler
			});
			this.el.find(".uiStructuredQuery-body").append(this.filter);
		},
		
		_results_handler: function( filter, event ) {
			var typeMap = {
				"json": this._jsonResults_handler,
				"table": this._tableResults_handler,
				"csv": this._csvResults_handler
			};
			typeMap[ event.type ].call( this, event.data, event.metadata );
		},
		_jsonResults_handler: function( results ) {
			this.el.find("DIV.uiStructuredQuery-out").empty().append( new ui.JsonPretty({ obj: results }));
		},
		_csvResults_handler: function( results ) {
			this.el.find("DIV.uiStructuredQuery-out").empty().append( new ui.CSVTable({ results: results }));
		},
		_tableResults_handler: function( results, metadata ) {
			// hack up a QueryDataSourceInterface so that StructuredQuery keeps working without using a Query object
			var qdi = new data.QueryDataSourceInterface({ metadata: metadata, query: new data.Query() });
			var tab = new ui.Table( {
				store: qdi,
				height: 400,
				width: this.out.innerWidth()
			} ).attach(this.out.empty());
			qdi._results_handler(qdi.config.query, results);
		},
		
		_showRawJSON : function() {
			if($("#rawJsonText").length === 0) {
				var hiddenButton = $("#showRawJSON");
				var jsonText = $({tag: "P", type: "p", id: "rawJsonText"});
				jsonText.text(hiddenButton[0].value);
				hiddenButton.parent().append(jsonText);
			}
		},
		
		_searchSource_handler: function(src) {
			var searchSourceDiv = this.el.find("DIV.uiStructuredQuery-src");
			searchSourceDiv.empty().append(new app.ui.JsonPretty({ obj: src }));
			if(typeof JSON !== "undefined") {
				var showRawJSON = $({ tag: "BUTTON", type: "button", text: i18n.text("StructuredQuery.ShowRawJson"), id: "showRawJSON", value: JSON.stringify(src), onclick: this._showRawJSON });
				searchSourceDiv.append(showRawJSON);
			}
			searchSourceDiv.show();
		},
		
		_main_template: function() {
			return { tag: "DIV", cls: this._baseCls, children: [
				this.selector,
				{ tag: "DIV", cls: "uiStructuredQuery-body" },
				{ tag: "DIV", cls: "uiStructuredQuery-src", css: { display: "none" } },
				{ tag: "DIV", cls: "uiStructuredQuery-out" }
			]};
		}
	});

	ui.StructuredQuery = ui.Page.extend({
		init: function() {
			this.q = new StructuredQuery( this.config );
			this.el = this.q.el;
		}
	});

})( this.jQuery, this.app, this.i18n );

(function( $, app, i18n ) {

	var ui = app.ns("ui");
	var data = app.ns("data");
	var ut = app.ns("ut");

	ui.FilterBrowser = ui.AbstractWidget.extend({
		defaults: {
			cluster: null,  // (required) instanceof app.services.Cluster
			index: "" // (required) name of the index to query
		},

		init: function(parent) {
			this._super();
			this._cluster = this.config.cluster;
			this.el = $(this._main_template());
			this.filtersEl = this.el.find(".uiFilterBrowser-filters");
			this.attach( parent );
			new data.MetaDataFactory({ cluster: this._cluster, onReady: function(metadata, eventData) {
				this.metadata = metadata;
				this._createFilters_handler(eventData.originalData.metadata.indices);
			}.bind(this) });
		},

		_createFilters_handler: function(data) {
			var filters = [];
			function scan_properties(path, obj) {
				if (obj.properties) {
					for (var prop in obj.properties) {
						scan_properties(path.concat(prop), obj.properties[prop]);
					}
				} else {
					// handle multi_field 
					if (obj.fields) {
						for (var subField in obj.fields) {
							filters.push({ path: (path[path.length - 1] !== subField) ? path.concat(subField) : path, type: obj.fields[subField].type, meta: obj.fields[subField] });
						}
					} else {
						filters.push({ path: path, type: obj.type, meta: obj });
					}
				}
			}
			if (data[this.config.index]){
				for(var type in data[this.config.index].mappings) {
					scan_properties([type], data[this.config.index].mappings[type]);
				}
			}

			filters.sort( function(a, b) {
				var x = a.path.join(".");
				var y = b.path.join(".");
				return (x < y) ? -1 : (x > y) ? 1 : 0;
			});

			this.filters = [
				{ path: ["match_all"], type: "match_all", meta: {} },
				{ path: ["_all"], type: "_all", meta: {}}
			].concat(filters);

			this._addFilterRow_handler();
		},
		
		_addFilterRow_handler: function() {
			this.filtersEl.append(this._filter_template());
		},
		
		_removeFilterRow_handler: function(jEv) {
			$(jEv.target).closest("DIV.uiFilterBrowser-row").remove();
			if(this.filtersEl.children().length === 0) {
				this._addFilterRow_handler();
			}
		},
		
		_search_handler: function() {
			var search = new data.BoolQuery();
			search.setSize( this.el.find(".uiFilterBrowser-outputSize").val() )
			this.fire("startingSearch");
			this.filtersEl.find(".uiFilterBrowser-row").each(function(i, row) {
				row = $(row);
				var bool = row.find(".bool").val();
				var field = row.find(".field").val();
				var op = row.find(".op").val();
				var value = {};
				if(field === "match_all") {
					op = "match_all";
				} else if(op === "range") {
					var lowqual = row.find(".lowqual").val(),
						highqual = row.find(".highqual").val();
					if(lowqual.length) {
						value[row.find(".lowop").val()] = lowqual;
					}
					if(highqual.length) {
						value[row.find(".highop").val()] = highqual;
					}
				} else if(op === "fuzzy") {
					var qual = row.find(".qual").val(),
						fuzzyqual = row.find(".fuzzyqual").val();
					if(qual.length) {
						value["value"] = qual;
					}
					if(fuzzyqual.length) {
						value[row.find(".fuzzyop").val()] = fuzzyqual;
					}
				} else {
					value = row.find(".qual").val();
				}
				search.addClause(value, field, op, bool);
			});
			if(this.el.find(".uiFilterBrowser-showSrc").attr("checked")) {
				this.fire("searchSource", search.search);
			}
			this._cluster.post( this.config.index + "/_search", search.getData(), this._results_handler );
		},
		
		_results_handler: function( data ) {
			var type = this.el.find(".uiFilterBrowser-outputFormat").val();
			this.fire("results", this, { type: type, data: data, metadata: this.metadata });
		},
		
		_changeQueryField_handler: function(jEv) {
			var select = $(jEv.target);
			var spec = select.children(":selected").data("spec");
			select.siblings().remove(".op,.qual,.range,.fuzzy");
			var ops = [];
			if(spec.type === 'match_all') {
			} else if(spec.type === '_all') {
				ops = ["query_string"];
			} else if(spec.type === 'string' || spec.type === 'text' || spec.type === 'keyword') {
				ops = ["term", "wildcard", "prefix", "fuzzy", "range", "query_string", "text", "missing"];
			} else if(spec.type === 'long' || spec.type === 'integer' || spec.type === 'float' ||
					spec.type === 'byte' || spec.type === 'short' || spec.type === 'double') {
				ops = ["term", "range", "fuzzy", "query_string", "missing"];
			} else if(spec.type === 'date') {
				ops = ["term", "range", "fuzzy", "query_string", "missing"];
			} else if(spec.type === 'geo_point') {
				ops = ["missing"];
			} else if(spec.type === 'ip') {
				ops = ["term", "range", "fuzzy", "query_string", "missing"];
			} else if(spec.type === 'boolean') {
				ops = ["term"]
			}
			select.after({ tag: "SELECT", cls: "op", onchange: this._changeQueryOp_handler, children: ops.map(ut.option_template) });
			select.next().change();
		},
		
		_changeQueryOp_handler: function(jEv) {
			var op = $(jEv.target), opv = op.val();
			op.siblings().remove(".qual,.range,.fuzzy");
			if(opv === 'term' || opv === 'wildcard' || opv === 'prefix' || opv === "query_string" || opv === 'text') {
				op.after({ tag: "INPUT", cls: "qual", type: "text" });
			} else if(opv === 'range') {
				op.after(this._range_template());
			} else if(opv === 'fuzzy') {
				op.after(this._fuzzy_template());
			}
		},
		
		_main_template: function() {
			return { tag: "DIV", children: [
				{ tag: "DIV", cls: "uiFilterBrowser-filters" },
				{ tag: "BUTTON", type: "button", text: i18n.text("General.Search"), onclick: this._search_handler },
				{ tag: "LABEL", children:
					i18n.complex("FilterBrowser.OutputType", { tag: "SELECT", cls: "uiFilterBrowser-outputFormat", children: [
						{ text: i18n.text("Output.Table"), value: "table" },
						{ text: i18n.text("Output.JSON"), value: "json" },
						{ text: i18n.text("Output.CSV"), value: "csv" }
					].map(function( o ) { return $.extend({ tag: "OPTION" }, o ); } ) } )
				},
				{ tag: "LABEL", children:
					i18n.complex("FilterBrowser.OutputSize", { tag: "SELECT", cls: "uiFilterBrowser-outputSize",
						children: [ "10", "50", "250", "1000", "5000", "25000" ].map( ut.option_template )
					} )
				},
				{ tag: "LABEL", children: [ { tag: "INPUT", type: "checkbox", cls: "uiFilterBrowser-showSrc" }, i18n.text("Output.ShowSource") ] }
			]};
		},
		
		_filter_template: function() {
			return { tag: "DIV", cls: "uiFilterBrowser-row", children: [
				{ tag: "SELECT", cls: "bool", children: ["must", "must_not", "should"].map(ut.option_template) },
				{ tag: "SELECT", cls: "field", onchange: this._changeQueryField_handler, children: this.filters.map(function(f) {
					return { tag: "OPTION", data: { spec: f }, value: f.path.join("."), text: f.path.join(".") };
				})},
				{ tag: "BUTTON", type: "button", text: "+", onclick: this._addFilterRow_handler },
				{ tag: "BUTTON", type: "button", text: "-", onclick: this._removeFilterRow_handler }
			]};
		},
		
		_range_template: function() {
			return { tag: "SPAN", cls: "range", children: [
				{ tag: "SELECT", cls: "lowop", children: ["gt", "gte"].map(ut.option_template) },
				{ tag: "INPUT", type: "text", cls: "lowqual" },
				{ tag: "SELECT", cls: "highop", children: ["lt", "lte"].map(ut.option_template) },
				{ tag: "INPUT", type: "text", cls: "highqual" }
			]};
		},

		_fuzzy_template: function() {
			return { tag: "SPAN", cls: "fuzzy", children: [
				{ tag: "INPUT", cls: "qual", type: "text" },
				{ tag: "SELECT", cls: "fuzzyop", children: ["max_expansions", "min_similarity"].map(ut.option_template) },
				{ tag: "INPUT", cls: "fuzzyqual", type: "text" }
			]};
		}
	});
	
})( this.jQuery, this.app, this.i18n );

(function( $, app, i18n ) {

	var ui = app.ns("ui");

	ui.IndexSelector = ui.AbstractWidget.extend({
		init: function(parent) {
			this._super();
			this.el = $(this._main_template());
			this.attach( parent );
			this.cluster = this.config.cluster;
			this.update();
		},
		update: function() {
			this.cluster.get( "_stats", this._update_handler );
		},
		
		_update_handler: function(data) {
			var options = [];
			var index_names = Object.keys(data.indices).sort();
			for(var i=0; i < index_names.length; i++) { 
				name = index_names[i];
				options.push(this._option_template(name, data.indices[name])); 
			}
			this.el.find(".uiIndexSelector-select").empty().append(this._select_template(options));
			this._indexChanged_handler();
		},
		
		_main_template: function() {
			return { tag: "DIV", cls: "uiIndexSelector", children: i18n.complex( "IndexSelector.SearchIndexForDocs", { tag: "SPAN", cls: "uiIndexSelector-select" } ) };
		},

		_indexChanged_handler: function() {
			this.fire("indexChanged", this.el.find("SELECT").val());
		},

		_select_template: function(options) {
			return { tag: "SELECT", children: options, onChange: this._indexChanged_handler };
		},
		
		_option_template: function(name, index) {
			return  { tag: "OPTION", value: name, text: i18n.text("IndexSelector.NameWithDocs", name, index.primaries.docs.count ) };
		}
	});

})( this.jQuery, this.app, this.i18n );

(function( $, app, i18n ) {

	var ui = app.ns("ui");

	ui.Header = ui.AbstractWidget.extend({
		defaults: {
			cluster: null,
			clusterState: null
		},
		_baseCls: "uiHeader",
		init: function() {
			this._clusterConnect = new ui.ClusterConnect({
				cluster: this.config.cluster
			});
			var quicks = [
				{ text: i18n.text("Nav.Info"), path: "" },
				{ text: i18n.text("Nav.Status"), path: "_stats" },
				{ text: i18n.text("Nav.NodeStats"), path: "_nodes/stats" },
				{ text: i18n.text("Nav.ClusterNodes"), path: "_nodes" },
				{ text: i18n.text("Nav.Plugins"), path: "_nodes/plugins" },
				{ text: i18n.text("Nav.ClusterState"), path: "_cluster/state" },
				{ text: i18n.text("Nav.ClusterHealth"), path: "_cluster/health" },
				{ text: i18n.text("Nav.Templates"), path: "_template" }
			];
			var cluster = this.config.cluster;
			var quickPanels = {};
			var menuItems = quicks.map( function( item ) {
				return { text: item.text, onclick: function() {
					cluster.get( item.path, function( data ) {
						quickPanels[ item.path ] && quickPanels[ item.path ].el && quickPanels[ item.path ].remove();
						quickPanels[ item.path ] = new ui.JsonPanel({
							title: item.text,
							json: data
						});
					} );
				} };
			}, this );
			this._quickMenu = new ui.MenuButton({
				label: i18n.text("NodeInfoMenu.Title"),
				menu: new ui.MenuPanel({
					items: menuItems
				})
			});
			this.el = $.joey( this._main_template() );
			this.nameEl = this.el.find(".uiHeader-name");
			this.statEl = this.el.find(".uiHeader-status");
			this._clusterState = this.config.clusterState;
			this._clusterState.on("data", function( state ) {
				var shards = state.status._shards;
				var colour = state.clusterHealth.status;
				var name = state.clusterState.cluster_name;
				this.nameEl.text( name );
				this.statEl
					.text( i18n.text("Header.ClusterHealth", colour, shards.successful, shards.total ) )
					.css( "background", colour );
			}.bind(this));
			this.statEl.text( i18n.text("Header.ClusterNotConnected") ).css("background", "grey");
			this._clusterState.refresh();
		},
		_main_template: function() { return (
			{ tag: "DIV", cls: this._baseCls, children: [
				this._clusterConnect,
				{ tag: "SPAN", cls: "uiHeader-name" },
				{ tag: "SPAN", cls: "uiHeader-status" },
				{ tag: "H1", text: i18n.text("General.Elasticsearch") },
				{ tag: "SPAN", cls: "pull-right", children: [
					this._quickMenu
				] }
			] }
		); }
	} );

})( this.jQuery, this.app, this.i18n );

(function( $, app, i18n ) {
	
	var ui = app.ns("ui");
	var ut = app.ns("ut");

	ui.IndexOverview = ui.Page.extend({
		defaults: {
			cluster: null
		},
		init: function() {
			this._super();
			this.cluster = this.config.cluster;
			this._clusterState = this.config.clusterState;
			this._clusterState.on("data", this._refresh_handler );
			this.el = $(this._main_template());
			this._refresh_handler();
		},
		remove: function() {
			this._clusterState.removeObserver( "data", this._refresh_handler );
		},
		_refresh_handler: function() {
			var state = this._clusterState;
			var view = {
				indices: acx.eachMap( state.status.indices, function( name, index ) {
					return {
						name: name,
						state: index
					};
				}).sort( function( a, b ) {
					return a.name < b.name ? -1 : 1;
				})
			};
			this._indexViewEl && this._indexViewEl.remove();
			this._indexViewEl = $( this._indexTable_template( view ) );
			this.el.find(".uiIndexOverview-table").append( this._indexViewEl );
		},
		_newIndex_handler: function() {
			var fields = new app.ux.FieldCollection({
				fields: [
					new ui.TextField({ label: i18n.text("ClusterOverView.IndexName"), name: "_name", require: true }),
					new ui.TextField({
						label: i18n.text("ClusterOverview.NumShards"),
						name: "number_of_shards",
						value: "5",
						require: function( val ) { return parseInt( val, 10 ) >= 1; }
					}),
					new ui.TextField({
						label: i18n.text("ClusterOverview.NumReplicas"),
						name: "number_of_replicas",
						value: "1",
						require: function( val ) { return parseInt( val, 10 ) >= 0; }
					})
				]
			});
			var dialog = new ui.DialogPanel({
				title: i18n.text("ClusterOverview.NewIndex"),
				body: new ui.PanelForm({ fields: fields }),
				onCommit: function(panel, args) {
					if(fields.validate()) {
						var data = fields.getData();
						var name = data["_name"];
						delete data["_name"];
						this.config.cluster.put( encodeURIComponent( name ), JSON.stringify({ settings: { index: data } }), function(d) {
							dialog.close();
							alert(JSON.stringify(d));
							this._clusterState.refresh();
						}.bind(this) );
					}
				}.bind(this)
			}).open();
		},
		_indexTable_template: function( view ) { return (
			{ tag: "TABLE", cls: "table", children: [
				{ tag: "THEAD", children: [
					{ tag: "TR", children: [
						{ tag: "TH" },
						{ tag: "TH", children: [
							{ tag: "H3", text: "Size" }
						] },
						{ tag: "TH", children: [
							{ tag: "H3", text: "Docs" }
						] }
					] }
				] },
				{ tag: "TBODY", cls: "striped", children: view.indices.map( this._index_template, this ) }
			] }
		); },

		_index_template: function( index ) { return (
			{ tag: "TR", children: [
				{ tag: "TD", children: [
					{ tag: "H3", text: index.name }
				] },
				{ tag: "TD", text: ut.byteSize_template( index.state.primaries.store.size_in_bytes ) + "/" + ut.byteSize_template( index.state.total.store.size_in_bytes ) },
				{ tag: "TD", text: ut.count_template( index.state.primaries.docs.count ) }
			] }
		); },
		_main_template: function() {
			return { tag: "DIV", id: this.id(), cls: "uiIndexOverview", children: [
				new ui.Toolbar({
					label: i18n.text("IndexOverview.PageTitle"),
					left: [
						new ui.Button({
							label: i18n.text("ClusterOverview.NewIndex"),
							onclick: this._newIndex_handler
						}),
					]
				}),
				{ tag: "DIV", cls: "uiIndexOverview-table", children: this._indexViewEl }
			] };
		}

	});

})( this.jQuery, this.app, this.i18n );

(function( app, i18n ) {

	var ui = app.ns("ui");
	var services = app.ns("services");

	app.App = ui.AbstractWidget.extend({
		defaults: {
			base_uri: null
		},
		init: function(parent) {
			this._super();
			this.prefs = services.Preferences.instance();
			this.base_uri = this.config.base_uri || this.prefs.get("app-base_uri") || "http://localhost:9200";
			if( this.base_uri.charAt( this.base_uri.length - 1 ) !== "/" ) {
				// XHR request fails if the URL is not ending with a "/"
				this.base_uri += "/";
			}
			if( this.config.auth_user ) {
				var credentials = window.btoa( this.config.auth_user + ":" + this.config.auth_password );
				$.ajaxSetup({
					headers: {
						"Authorization": "Basic " + credentials
					}
				});
			}
			this.cluster = new services.Cluster({ base_uri: this.base_uri });
			this._clusterState = new services.ClusterState({
				cluster: this.cluster
			});

			this._header = new ui.Header({ cluster: this.cluster, clusterState: this._clusterState });
			this.$body = $.joey( this._body_template() );
			this.el = $.joey(this._main_template());
			this.attach( parent );
			this.instances = {};
			this.el.find(".uiApp-headerMenuItem:first").click();
			if( this.config.dashboard ) {
				if( this.config.dashboard === "cluster" ) {
					var page = this.instances["ClusterOverview"];
					page._refreshButton.set( 5000 );
				}
			}
		},

		navigateTo: function( type, config, ev ) {
			if( ev.target.classList.contains( "uiApp-headerNewMenuItem" ) ) {
				this.showNew( type, config, ev );
			} else {
				var ref = type + "0";
				if(! this.instances[ ref ]) {
					this.createPage( type, 0, config );
				}
				this.show( ref, ev );
			}
		},

		createPage: function( type, id, config ) {
			var page = this.instances[ type + id ] = new ui[ type ]( config );
			this.$body.append( page );
			return page;
		},

		show: function( ref, ev ) {
			$( ev.target ).closest("DIV.uiApp-headerMenuItem").addClass("active").siblings().removeClass("active");
			for(var p in this.instances) {
				this.instances[p][ p === ref ? "show" : "hide" ]();
			}
		},

		showNew: function( type, config, jEv ) {
			var ref, page, $tab,
				type_index = 0;

			while ( ! page ) {
				ref = type + ( ++type_index );
				if (! ( ref in this.instances ) ) {
					page = this.createPage( type, type_index, config );
				}
			}

			// Add the tab and its click handlers
			$tab = $.joey({
				tag: "DIV",
				cls: "uiApp-headerMenuItem pull-left",
				text: i18n.text("Nav." + type ) + " " + type_index,
				onclick: function( ev ) { this.show( ref, ev ); }.bind(this),
				children: [
					{ tag: "A", text: " [-]", onclick: function (ev) {
						$tab.remove();
						page.remove();
						delete this.instances[ ref ];
					}.bind(this) }
				]
			});

			$('.uiApp-headerMenu').append( $tab );
			$tab.trigger("click");
		},

		_openAnyRequest_handler: function(ev) { this.navigateTo("AnyRequest", { cluster: this.cluster }, ev ); },
		_openStructuredQuery_handler: function(ev) { this.navigateTo("StructuredQuery", { cluster: this.cluster }, ev ); },
		_openBrowser_handler: function(ev) { this.navigateTo("Browser", { cluster: this.cluster }, ev );  },
		_openClusterOverview_handler: function(ev) { this.navigateTo("ClusterOverview", { cluster: this.cluster, clusterState: this._clusterState }, ev ); },
		_openIndexOverview_handler: function(ev) { this.navigateTo("IndexOverview", { cluster: this.cluster, clusterState: this._clusterState }, ev ); },

		_body_template: function() { return (
			{ tag: "DIV", id: this.id("body"), cls: "uiApp-body" }
		); },

		_main_template: function() {
			return { tag: "DIV", cls: "uiApp", children: [
				{ tag: "DIV", id: this.id("header"), cls: "uiApp-header", children: [
					this._header,
					{ tag: "DIV", cls: "uiApp-headerMenu", children: [
						{ tag: "DIV", cls: "uiApp-headerMenuItem pull-left", text: i18n.text("Nav.Overview"), onclick: this._openClusterOverview_handler },
						{ tag: "DIV", cls: "uiApp-headerMenuItem pull-left", text: i18n.text("Nav.Indices"), onclick: this._openIndexOverview_handler },
						{ tag: "DIV", cls: "uiApp-headerMenuItem pull-left", text: i18n.text("Nav.Browser"), onclick: this._openBrowser_handler },
						{ tag: "DIV", cls: "uiApp-headerMenuItem pull-left", text: i18n.text("Nav.StructuredQuery"), onclick: this._openStructuredQuery_handler, children: [
							{ tag: "A", cls: "uiApp-headerNewMenuItem ", text: ' [+]' }
						] },
						{ tag: "DIV", cls: "uiApp-headerMenuItem pull-left", text: i18n.text("Nav.AnyRequest"), onclick: this._openAnyRequest_handler, children: [
							{ tag: "A", cls: "uiApp-headerNewMenuItem ", text: ' [+]' }
						] },
					]}
				]},
				this.$body
			]};
		}
		
	});

})( this.app, this.i18n );

i18n.setKeys({
	"General.Elasticsearch": "Elasticsearch",
	"General.LoadingAggs": "Loading Aggregations...",
	"General.Searching": "Searching...",
	"General.Search": "Search",
	"General.Help": "Help",
	"General.HelpGlyph": "?",
	"General.CloseGlyph": "X",
	"General.RefreshResults": "Refresh",
	"General.ManualRefresh": "Manual Refresh",
	"General.RefreshQuickly": "Refresh quickly",
	"General.Refresh5seconds": "Refresh every 5 seconds",
	"General.Refresh1minute": "Refresh every minute",
	"AliasForm.AliasName": "Alias Name",
	"AliasForm.NewAliasForIndex": "New Alias for {0}",
	"AliasForm.DeleteAliasMessage": "type ''{0}'' to delete {1}. There is no undo",
	"AnyRequest.DisplayOptions" : "Display Options",
	"AnyRequest.AsGraph" : "Graph Results",
	"AnyRequest.AsJson" : "Show Raw JSON",
	"AnyRequest.AsTable" : "Show Search Results Table",
	"AnyRequest.History" : "History",
	"AnyRequest.RepeatRequest" : "Repeat Request",
	"AnyRequest.RepeatRequestSelect" : "Repeat request every ",
	"AnyRequest.Transformer" : "Result Transformer",
	"AnyRequest.Pretty": "Pretty",
	"AnyRequest.Query" : "Query",
	"AnyRequest.Request": "Request",
	"AnyRequest.Requesting": "Requesting...",
	"AnyRequest.ValidateJSON": "Validate JSON",
	"Browser.Title": "Browser",
	"Browser.ResultSourcePanelTitle": "Result Source",
	"Command.DELETE": "DELETE",
	"Command.SHUTDOWN": "SHUTDOWN",
	"Command.DeleteAliasMessage": "Delete Alias?",
	"ClusterOverView.IndexName": "Index Name",
	"ClusterOverview.NumShards": "Number of Shards",
	"ClusterOverview.NumReplicas": "Number of Replicas",
	"ClusterOverview.NewIndex": "New Index",
	"IndexActionsMenu.Title": "Actions",
	"IndexActionsMenu.NewAlias": "New Alias...",
	"IndexActionsMenu.Refresh": "Refresh",
	"IndexActionsMenu.Flush": "Flush",
	"IndexActionsMenu.Optimize": "Optimize...",
	"IndexActionsMenu.Snapshot": "Gateway Snapshot",
	"IndexActionsMenu.Analyser": "Test Analyser",
	"IndexActionsMenu.Open": "Open",
	"IndexActionsMenu.Close": "Close",
	"IndexActionsMenu.Delete": "Delete...",
	"IndexInfoMenu.Title": "Info",
	"IndexInfoMenu.Status": "Index Status",
	"IndexInfoMenu.Metadata": "Index Metadata",
	"IndexCommand.TextToAnalyze": "Text to Analyse",
	"IndexCommand.ShutdownMessage": "type ''{0}'' to shutdown {1}. Node can NOT be restarted from this interface",
	"IndexOverview.PageTitle": "Indices Overview",
	"IndexSelector.NameWithDocs": "{0} ({1} docs)",
	"IndexSelector.SearchIndexForDocs": "Search {0} for documents where:",
	"FilterBrowser.OutputType": "Output Results: {0}",
	"FilterBrowser.OutputSize": "Number of Results: {0}",
	"Header.ClusterHealth": "cluster health: {0} ({1} of {2})",
	"Header.ClusterNotConnected": "cluster health: not connected",
	"Header.Connect": "Connect",
	"Nav.AnyRequest": "Any Request",
	"Nav.Browser": "Browser",
	"Nav.ClusterHealth": "Cluster Health",
	"Nav.ClusterState": "Cluster State",
	"Nav.ClusterNodes": "Nodes Info",
	"Nav.Info": "Info",
	"Nav.NodeStats": "Nodes Stats",
	"Nav.Overview": "Overview",
	"Nav.Indices": "Indices",
	"Nav.Plugins": "Plugins",
	"Nav.Status": "Indices Stats",
	"Nav.Templates": "Templates",
	"Nav.StructuredQuery": "Structured Query",
	"NodeActionsMenu.Title": "Actions",
	"NodeActionsMenu.Shutdown": "Shutdown...",
	"NodeInfoMenu.Title": "Info",
	"NodeInfoMenu.ClusterNodeInfo": "Cluster Node Info",
	"NodeInfoMenu.NodeStats": "Node Stats",
	"NodeType.Client": "Client Node",
	"NodeType.Coord": "Coordinator",
	"NodeType.Master": "Master Node",
	"NodeType.Tribe": "Tribe Node",
	"NodeType.Worker": "Worker Node",
	"NodeType.Unassigned": "Unassigned",
	"OptimizeForm.OptimizeIndex": "Optimize {0}",
	"OptimizeForm.MaxSegments": "Maximum # Of Segments",
	"OptimizeForm.ExpungeDeletes": "Only Expunge Deletes",
	"OptimizeForm.FlushAfter": "Flush After Optimize",
	"OptimizeForm.WaitForMerge": "Wait For Merge",
	"Overview.PageTitle" : "Cluster Overview",
	"Output.JSON": "JSON",
	"Output.Table": "Table",
	"Output.CSV": "CSV",
	"Output.ShowSource": "Show query source",
	"Preference.SortCluster": "Sort Cluster",
	"Sort.ByName": "By Name",
	"Sort.ByAddress": "By Address",
	"Sort.ByType": "By Type",
	"Preference.SortIndices": "Sort Indices",
	"SortIndices.Descending": "Descending",
	"SortIndices.Ascending": "Ascending",
	"Preference.ViewAliases": "View Aliases",
	"ViewAliases.Grouped": "Grouped",
	"ViewAliases.List": "List",
	"ViewAliases.None": "None",
	"Overview.IndexFilter": "Index Filter",
	"TableResults.Summary": "Searched {0} of {1} shards. {2} hits. {3} seconds",
	"QueryFilter.AllIndices": "All Indices",
	"QueryFilter.AnyValue": "any",
	"QueryFilter-Header-Indices": "Indices",
	"QueryFilter-Header-Types": "Types",
	"QueryFilter-Header-Fields": "Fields",
	"QueryFilter.DateRangeHint.from": "From : {0}",
	"QueryFilter.DateRangeHint.to": "  To : {0}",
	"Query.FailAndUndo": "Query Failed. Undoing last changes",
	"StructuredQuery.ShowRawJson": "Show Raw JSON"
});

i18n.setKeys({
	"AnyRequest.TransformerHelp" : "\
		<p>The Result Transformer can be used to post process the raw json results from a request into a more useful format.</p>\
		<p>The transformer should contain the body of a javascript function. The return value from the function becomes the new value passed to the json printer</p>\
		<p>Example:<br>\
		  <code>return root.hits.hits[0];</code> would traverse a result set to show just the first match<br>\
		  <code>return Object.keys(root.nodes).reduce(function(tot, node) { return tot + root.nodes[node].os.mem.used_in_bytes; }, 0);</code> would return the total memory used across an entire cluster<br></p>\
		<p>The following functions are available and can be useful processing arrays and objects<br>\
		<ul>\
			<li><i>Object.keys</i>(object) := array</li>\
			<li>array.<i>forEach</i>(function(prop, index))</li>\
			<li>array.<i>map</i>(function(prop, index)) := array</li>\
			<li>array.<i>reduce</i>(function(accumulator, prop, index), initial_value) := final_value</li>\
		</ul>\
		<p>When Repeat Request is running, an extra parameter called prev is passed to the transformation function. This allows comparisons, and cumulative graphing</p>\
		<p>Example:<br>\
		<code>var la = [ root.nodes[Object.keys(root.nodes)[0]].os.load_average[0] ]; return prev ? la.concat(prev) : la;</code> would return the load average on the first cluster node over the last minute\
		This could be fed into the Graph to produce a load graph for the node\
		"
});

i18n.setKeys({
	"AnyRequest.DisplayOptionsHelp" : "\
		<p>Raw Json: shows complete results of the query and transformation in raw JSON format </p>\
		<p>Graph Results: To produce a graph of your results, use the result transformer to produce an array of values</p>\
		<p>Search Results Table: If your query is a search, you can display the results of the search in a table.</p>\
		"
});

i18n.setKeys({
	"QueryFilter.DateRangeHelp" : "\
		<p>Date fields accept a natural language query to produce a From and To date that form a range that the results are queried over.</p>\
		<p>The following formats are supported:</p>\
		<ul>\
			<li><b>Keywords / Key Phrases</b><br>\
				<code>now<br> today<br> tomorrow<br> yesterday<br> last / this / next + week / month / year</code><br>\
				searches for dates matching the keyword. <code>last year</code> would search all of last year.</li>\
			<li><b>Ranges</b><br>\
				<code>1000 secs<br> 5mins<br> 1day<br> 2days<br> 80d<br> 9 months<br> 2yrs</code> (spaces optional, many synonyms for range qualifiers)<br>\
				Create a search range centered on <code>now</code> extending into the past and future by the amount specified.</li>\
			<li><b>DateTime and Partial DateTime</b><br>\
				<code>2011<br> 2011-01<br> 2011-01-18<br> 2011-01-18 12<br> 2011-01-18 12:32<br> 2011-01-18 12:32:45</code><br>\
				these formats specify a specific date range. <code>2011</code> would search the whole of 2011, while <code>2011-01-18 12:32:45</code> would only search for results in that 1 second range</li>\
			<li><b>Time and Time Partials</b><br>\
				<code>12<br> 12:32<br> 12:32:45</code><br>\
				these formats search for a particular time during the current day. <code>12:32</code> would search that minute during today</li>\
			<li><b>Date Ranges</b><br>\
				<code>2010 -&gt; 2011<br> last week -&gt; next week<br> 2011-05 -&gt;<br> &lt; now</code><br>\
				A Date Range is created by specifying two dates in any format (Keyword / DateTime / Time) separated by &lt; or -&gt; (both do the same thing). If either end of the date range is missing, it is the same as having no constraint in that direction.</li>\
			<li><b>Date Range using Offset</b><br>\
				<code>2010 -> 1yr<br> 3mins < now</code>\
				Searches the specified date including the range in the direction specified.</li>\
			<li><b>Anchored Ranges</b><br>\
				<code>2010-05-13 05:13 <> 10m<br> now <> 1yr<br> lastweek <> 1month</code><br>\
				Similar to above except the range is extend in both directions from the anchor date</li>\
		</ul>\
	"
});

var EsHead = (function (EsHead) {

  EsHead.pluginName = "eshead.hawtio";
  EsHead.log = Logger.get(EsHead.pluginName);

  angular.module(EsHead.pluginName, ['hawtioCore'])
    .run(function () {
      EsHead.log.debug("plugin running");
    })
    .directive('eshead', function() {
      return {
        restrict: 'A',
        scope: false,
        link: function($scope, $element, $attrs) {
          $scope.app = new app.App($element, {
            id: "es",
            base_uri: new Jolokia(Core.getJolokiaUrl()).execute("io.fabric8.insight:type=Elasticsearch2","getRestUrl","insight")
          });
        }
      };
    });

  return EsHead;
}(EsHead || {}));

hawtioPluginLoader.registerPreBootstrapTask(function (nextTask) {
  hawtioPluginLoader.addModule(EsHead.pluginName);

  Core.addCSS('../hawtio-eshead/vendor.css');
  Core.addCSS('../hawtio-eshead/hawtioPlugin.css');

  nextTask();
});
