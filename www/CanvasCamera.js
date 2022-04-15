"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var exec = require('cordova/exec');
var CanvasCameraFrame = (function () {
    function CanvasCameraFrame(image, element, renderer) {
        this.ratio = 0;
        this.sx = 0;
        this.sy = 0;
        this.sWidth = 0;
        this.sHeight = 0;
        this.dx = 0;
        this.dy = 0;
        this.dWidth = 0;
        this.dHeight = 0;
        this.image = image;
        this.element = element;
        this.renderer = renderer;
    }
    CanvasCameraFrame.prototype.initialize = function () {
        if (this.image && this.element) {
            this.renderer.canvasCamera.dispatch('beforeframeinitialization', this);
            this.sx = 0;
            this.sy = 0;
            this.sWidth = parseFloat("".concat(this.image.width));
            this.sHeight = parseFloat("".concat(this.image.height));
            this.dx = 0;
            this.dy = 0;
            this.dWidth = parseFloat("".concat(this.element.width));
            this.dHeight = parseFloat("".concat(this.element.height));
            var hRatio = this.dWidth / this.sWidth;
            var vRatio = this.dHeight / this.sHeight;
            this.ratio = Math.max(hRatio, vRatio);
            this.dx = (this.dWidth - this.sWidth * this.ratio) / 2;
            this.dy = (this.dHeight - this.sHeight * this.ratio) / 2;
            this.dWidth = this.sWidth * this.ratio;
            this.dHeight = this.sHeight * this.ratio;
            this.renderer.canvasCamera.dispatch('afterframeinitialization', this);
        }
        return this;
    };
    CanvasCameraFrame.prototype.recycle = function () {
        for (var property in this) {
            if (this.hasOwnProperty(property)) {
                delete this[property];
            }
        }
    };
    return CanvasCameraFrame;
}());
var CanvasCameraRenderer = (function () {
    function CanvasCameraRenderer(element, canvasCamera) {
        this.buffer = [];
        this.available = true;
        this.fullscreen = false;
        this.element = element;
        this.canvasCamera = canvasCamera;
    }
    CanvasCameraRenderer.prototype.initialize = function () {
        var _this = this;
        if (this.element) {
            this.context = this.element.getContext('2d');
            this.image = new Image();
            this.image.crossOrigin = 'Anonymous';
            this.image.addEventListener('load', function () {
                if (_this.image) {
                    var frame = _this.canvasCamera.createFrame(_this.image, _this.element, _this);
                    if (frame) {
                        _this.resize().clear();
                        if (_this.onBeforeDraw) {
                            _this.onBeforeDraw(frame);
                        }
                        _this.draw(frame);
                        if (_this.onAfterDraw) {
                            _this.onAfterDraw(frame);
                        }
                        frame.recycle();
                    }
                    frame = null;
                }
                _this.enable();
            });
            this.image.addEventListener('error', function () {
                _this.clear().enable();
            });
            window.addEventListener('orientationchange', function () {
                _this.onOrientationChange();
            });
        }
        return this;
    };
    CanvasCameraRenderer.prototype.onOrientationChange = function () {
        if (this.canvasCamera.getUIOrientation() !== this.orientation) {
            this.invert();
        }
        this.buffer = [];
    };
    CanvasCameraRenderer.prototype.clear = function () {
        if (this.context) {
            this.context.clearRect(0, 0, this.element.width, this.element.height);
        }
        return this;
    };
    CanvasCameraRenderer.prototype.draw = function (frame) {
        if (frame && this.context) {
            this.canvasCamera.dispatch('beforeframerendering', this, frame);
            this.context.drawImage(frame.image, frame.sx, frame.sy, frame.sWidth, frame.sHeight, frame.dx, frame.dy, frame.dWidth, frame.dHeight);
            this.canvasCamera.dispatch('afterframerendering', this, frame);
        }
        return this;
    };
    CanvasCameraRenderer.prototype.bufferize = function (data) {
        if (this.enabled()) {
            this.buffer.push(data);
            this.run();
        }
        return this;
    };
    CanvasCameraRenderer.prototype.run = function () {
        var _this = this;
        if (this.enabled()) {
            window.requestAnimationFrame(function () {
                if (_this.buffer.length) {
                    var data = _this.buffer.pop();
                    if (data) {
                        _this.render(data);
                    }
                    _this.buffer = [];
                }
            });
        }
        return this;
    };
    CanvasCameraRenderer.prototype.render = function (data) {
        var _a, _b;
        if (this.enabled()) {
            if (this.canvasCamera &&
                this.canvasCamera.options &&
                this.canvasCamera.options.use) {
                if (data && data[this.canvasCamera.options.use]) {
                    this.data = data;
                    if (data.hasOwnProperty('orientation') && data.orientation) {
                        this.orientation = data.orientation;
                    }
                    if (this.image) {
                        switch (this.canvasCamera.options.use) {
                            case 'file':
                                if ('Ionic' in window &&
                                    window.Ionic &&
                                    ((_a = window.Ionic) === null || _a === void 0 ? void 0 : _a.WebView) &&
                                    ((_b = window.Ionic.WebView) === null || _b === void 0 ? void 0 : _b.convertFileSrc)) {
                                    data[this.canvasCamera.options.use] =
                                        window.Ionic.WebView.convertFileSrc(data[this.canvasCamera.options.use]);
                                }
                                this.image.src =
                                    data[this.canvasCamera.options.use] +
                                        '?seed=' +
                                        Math.round(new Date().getTime() * Math.random() * 1000);
                                break;
                            default:
                                this.image.src = data[this.canvasCamera.options.use] || '';
                        }
                    }
                    this.disable();
                }
            }
        }
        return this;
    };
    CanvasCameraRenderer.prototype.enable = function () {
        this.available = true;
        return this;
    };
    CanvasCameraRenderer.prototype.disable = function () {
        this.available = false;
        return this;
    };
    CanvasCameraRenderer.prototype.enabled = function () {
        return this.available;
    };
    CanvasCameraRenderer.prototype.disabled = function () {
        return !this.available;
    };
    CanvasCameraRenderer.prototype.invert = function () {
        if (this.size) {
            var iSize = this.size;
            if (this.size.width && !isNaN(this.size.width)) {
                if (this.fullscreen) {
                    iSize.width = Number(window.innerHeight);
                }
                else {
                    if (Number(this.size.height) <= Number(window.innerHeight)) {
                        iSize.width = Number(this.size.height);
                    }
                    else {
                        iSize.width = Number(window.innerHeight);
                    }
                }
            }
            if (this.size.height && !isNaN(this.size.height)) {
                if (this.fullscreen) {
                    iSize.height = Number(window.innerWidth);
                }
                else {
                    if (Number(this.size.width) <= Number(window.innerWidth)) {
                        iSize.height = Number(this.size.width);
                    }
                    else {
                        iSize.height = Number(window.innerWidth);
                    }
                }
            }
            this.size = iSize;
        }
        return this;
    };
    CanvasCameraRenderer.prototype.resize = function () {
        if (this.size) {
            var pixelRatio = window.devicePixelRatio || 1;
            if (this.size.width && !isNaN(this.size.width)) {
                if (!this.fullscreen &&
                    Number(this.size.width) <= Number(window.innerWidth)) {
                    this.element.width = Number(this.size.width * pixelRatio);
                    this.element.style.width = Number(this.size.width) + 'px';
                }
                else {
                    this.element.width = Number(window.innerWidth * pixelRatio);
                    this.element.style.width = Number(window.innerWidth) + 'px';
                }
            }
            else {
                this.element.width = Number(window.innerWidth * pixelRatio);
                this.element.style.width = Number(window.innerWidth) + 'px';
            }
            if (this.size.height && !isNaN(this.size.height)) {
                if (!this.fullscreen &&
                    Number(this.size.height) <= Number(window.innerHeight)) {
                    this.element.height = Number(this.size.height * pixelRatio);
                    this.element.style.height = Number(this.size.height) + 'px';
                }
                else {
                    this.element.height = Number(window.innerHeight * pixelRatio);
                    this.element.style.height = Number(window.innerHeight) + 'px';
                }
            }
            else {
                this.element.height = Number(window.innerHeight * pixelRatio);
                this.element.style.height = Number(window.innerHeight) + 'px';
            }
        }
        return this;
    };
    CanvasCameraRenderer.prototype.setSize = function (size, auto) {
        this.fullscreen = !!auto || false;
        if (size && size.width && size.height) {
            if (!isNaN(Number(size.width)) && !isNaN(Number(size.height))) {
                this.size = size;
                if (!this.fullscreen) {
                    if (Number(size.width) >= Number(window.innerWidth) &&
                        Number(size.height) >= Number(window.innerHeight)) {
                        this.fullscreen = true;
                    }
                }
            }
        }
        return this;
    };
    CanvasCameraRenderer.prototype.setOnBeforeDraw = function (onBeforeDraw) {
        if (onBeforeDraw && typeof onBeforeDraw === 'function') {
            this.onBeforeDraw = onBeforeDraw;
        }
        return this;
    };
    CanvasCameraRenderer.prototype.setOnAfterDraw = function (onAfterDraw) {
        if (onAfterDraw && typeof onAfterDraw === 'function') {
            this.onAfterDraw = onAfterDraw;
        }
        return this;
    };
    return CanvasCameraRenderer;
}());
var CanvasCameraWithEvents = (function () {
    function CanvasCameraWithEvents() {
    }
    return CanvasCameraWithEvents;
}());
var CanvasCamera = (function (_super) {
    __extends(CanvasCamera, _super);
    function CanvasCamera() {
        var _this = _super.call(this) || this;
        _this.nativeClass = 'CanvasCamera';
        _this.canvas = {};
        _this.options = {};
        return _this;
    }
    CanvasCamera.getInstance = function () {
        if (this.instance && this.instance instanceof CanvasCamera) {
            return this.instance;
        }
        return (this.instance = new CanvasCamera());
    };
    CanvasCamera.initialize = function (fcanvas, tcanvas) {
        return this.getInstance().initialize(fcanvas, tcanvas);
    };
    CanvasCamera.start = function (userOptions, onError, onSuccess) {
        return this.getInstance().start(userOptions, onError, onSuccess);
    };
    CanvasCamera.stop = function (onError, onSuccess) {
        return this.getInstance().stop(onError, onSuccess);
    };
    CanvasCamera.cameraPosition = function (cameraFacing, onError, onSuccess) {
        return this.getInstance().cameraPosition(cameraFacing, onError, onSuccess);
    };
    CanvasCamera.flashMode = function (flashMode, onError, onSuccess) {
        return this.getInstance().flashMode(flashMode, onError, onSuccess);
    };
    CanvasCamera.prototype.beforeFrameRendering = function (listener) {
        return this.triggerEvent('beforeFrameRendering', listener);
    };
    CanvasCamera.beforeFrameRendering = function (listener) {
        return this.getInstance().beforeFrameRendering(listener);
    };
    CanvasCamera.prototype.afterFrameRendering = function (listener) {
        return this.triggerEvent('afterFrameRendering', listener);
    };
    CanvasCamera.afterFrameRendering = function (listener) {
        return this.getInstance().afterFrameRendering(listener);
    };
    CanvasCamera.prototype.beforeFrameInitialization = function (listener) {
        return this.triggerEvent('beforeFrameInitialization', listener);
    };
    CanvasCamera.beforeFrameInitialization = function (listener) {
        return this.getInstance().beforeFrameInitialization(listener);
    };
    CanvasCamera.prototype.afterFrameInitialization = function (listener) {
        return this.triggerEvent('afterFrameInitialization', listener);
    };
    CanvasCamera.afterFrameInitialization = function (listener) {
        return this.getInstance().afterFrameInitialization(listener);
    };
    CanvasCamera.prototype.beforeRenderingPresets = function (listener) {
        return this.triggerEvent('beforeRenderingPresets', listener);
    };
    CanvasCamera.beforeRenderingPresets = function (listener) {
        return this.getInstance().beforeRenderingPresets(listener);
    };
    CanvasCamera.prototype.afterRenderingPresets = function (listener) {
        return this.triggerEvent('afterRenderingPresets', listener);
    };
    CanvasCamera.afterRenderingPresets = function (listener) {
        return this.getInstance().afterRenderingPresets(listener);
    };
    CanvasCamera.prototype.triggerEvent = function (eventName, listener) {
        var listenerName = (this.nativeClass + '-' + eventName).toLowerCase();
        window.addEventListener(listenerName, function (e) {
            listener.call(e.detail.context, e, e.detail.data);
        }.bind(this));
        return this;
    };
    CanvasCamera.prototype.dispatch = function (eventName, context, data) {
        var listenerName = (this.nativeClass + '-' + eventName).toLowerCase();
        var event = new CustomEvent(listenerName, {
            detail: {
                context: context,
                data: data,
            },
        });
        window.dispatchEvent(event);
    };
    CanvasCamera.prototype.initialize = function (fcanvas, tcanvas) {
        if (fcanvas instanceof HTMLCanvasElement) {
            this.canvas.fullsize = this.createRenderer(fcanvas, this);
            if (tcanvas instanceof HTMLCanvasElement) {
                this.canvas.thumbnail = this.createRenderer(tcanvas, this);
            }
        }
        else {
            if ((fcanvas === null || fcanvas === void 0 ? void 0 : fcanvas.fullsize) && (fcanvas === null || fcanvas === void 0 ? void 0 : fcanvas.fullsize) instanceof HTMLCanvasElement) {
                this.canvas.fullsize = this.createRenderer(fcanvas.fullsize, this);
                if ((fcanvas === null || fcanvas === void 0 ? void 0 : fcanvas.thumbnail) &&
                    fcanvas.thumbnail instanceof HTMLCanvasElement) {
                    this.canvas.thumbnail = this.createRenderer(fcanvas.thumbnail, this);
                }
            }
        }
    };
    CanvasCamera.prototype.start = function (userOptions, onError, onSuccess) {
        var _this = this;
        this.options = userOptions;
        this.setRenderingPresets();
        if (onSuccess && typeof onSuccess === 'function') {
            this.onCapture = onSuccess;
        }
        this.enableRenderers();
        exec(this.capture.bind(this), function (error) {
            _this.disableRenderers();
            if (onError && typeof onError === 'function') {
                onError(error);
            }
        }, this.nativeClass, 'startCapture', [this.options]);
    };
    CanvasCamera.prototype.stop = function (onError, onSuccess) {
        this.disableRenderers();
        exec(function (data) {
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess(data);
            }
        }, function (error) {
            if (onError && typeof onError === 'function') {
                onError(error);
            }
        }, this.nativeClass, 'stopCapture', []);
    };
    CanvasCamera.prototype.flashMode = function (flashMode, onError, onSuccess) {
        exec(function (data) {
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess(data);
            }
        }, function (error) {
            if (onError && typeof onError === 'function') {
                onError(error);
            }
        }, this.nativeClass, 'flashMode', [flashMode]);
    };
    CanvasCamera.prototype.cameraPosition = function (cameraFacing, onError, onSuccess) {
        var _this = this;
        this.disableRenderers();
        exec(function (data) {
            _this.enableRenderers();
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess(data);
            }
        }, function (error) {
            if (onError && typeof onError === 'function') {
                onError(error);
            }
        }, this.nativeClass, 'cameraPosition', [cameraFacing]);
    };
    CanvasCamera.prototype.capture = function (data) {
        if ((data === null || data === void 0 ? void 0 : data.output) && data.output.images) {
            if (this.options.use &&
                data.output.images.fullsize &&
                data.output.images.fullsize[this.options.use]) {
                if (this.canvas.fullsize) {
                    this.canvas.fullsize.bufferize(data.output.images.fullsize);
                }
                if (data.output.images.thumbnail &&
                    data.output.images.thumbnail[this.options.use]) {
                    if (this.canvas.thumbnail) {
                        this.canvas.thumbnail.bufferize(data.output.images.thumbnail);
                    }
                }
            }
        }
        if (this.onCapture && typeof this.onCapture === 'function') {
            this.onCapture(data);
        }
    };
    CanvasCamera.prototype.createFrame = function (image, element, renderer) {
        var frame = new CanvasCameraFrame(image, element, renderer);
        return frame.initialize();
    };
    CanvasCamera.prototype.createRenderer = function (element, canvasCamera) {
        var renderer = new CanvasCameraRenderer(element, canvasCamera);
        return renderer.initialize();
    };
    CanvasCamera.prototype.enableRenderers = function () {
        var _a, _b;
        if (this.canvas && 'object' === typeof this.canvas) {
            for (var renderer in this.canvas) {
                if (this.canvas.hasOwnProperty(renderer) &&
                    this.canvas[renderer] instanceof CanvasCameraRenderer) {
                    if ((_a = this.canvas[renderer]) === null || _a === void 0 ? void 0 : _a.disabled()) {
                        (_b = this.canvas[renderer]) === null || _b === void 0 ? void 0 : _b.enable();
                    }
                }
            }
        }
    };
    CanvasCamera.prototype.disableRenderers = function () {
        var _a, _b;
        if (this.canvas && 'object' === typeof this.canvas) {
            for (var renderer in this.canvas) {
                if (this.canvas.hasOwnProperty(renderer) &&
                    this.canvas[renderer] instanceof CanvasCameraRenderer) {
                    if ((_a = this.canvas[renderer]) === null || _a === void 0 ? void 0 : _a.enabled()) {
                        (_b = this.canvas[renderer]) === null || _b === void 0 ? void 0 : _b.disable();
                    }
                }
            }
        }
    };
    CanvasCamera.prototype.setRenderingPresets = function () {
        this.dispatch('beforerenderingpresets', this);
        switch (this.options.use) {
            case 'data':
            case 'file':
                break;
            default:
                this.options.use = 'file';
        }
        if (this.options.onBeforeDraw &&
            typeof this.options.onBeforeDraw === 'function') {
            if (this.canvas.fullsize) {
                this.canvas.fullsize.setOnBeforeDraw(this.options.onBeforeDraw);
            }
        }
        if (this.options.onAfterDraw &&
            typeof this.options.onAfterDraw === 'function') {
            if (this.canvas.fullsize) {
                this.canvas.fullsize.setOnAfterDraw(this.options.onAfterDraw);
            }
        }
        var size = this.getUISize();
        this.setRenderersSize(size);
        this.dispatch('afterrenderingpresets', this);
        return this;
    };
    CanvasCamera.prototype.getUISize = function () {
        var size = {
            width: window.innerWidth,
            height: window.innerHeight,
        };
        if (this.options) {
            var canvasWidth = NaN;
            var canvasHeight = NaN;
            if (this.options.canvas) {
                if (this.options.canvas.width && this.options.canvas.height) {
                    canvasWidth = parseFloat("".concat(this.options.canvas.width));
                    canvasHeight = parseFloat("".concat(this.options.canvas.height));
                }
            }
            if (this.options.width && this.options.height) {
                canvasWidth = parseFloat("".concat(this.options.width));
                canvasHeight = parseFloat("".concat(this.options.height));
            }
            if (!isNaN(canvasWidth) && !isNaN(canvasHeight)) {
                size.auto = false;
                if (this.getUIOrientation() === 'portrait') {
                    size.width = canvasHeight;
                    size.height = canvasWidth;
                }
                else {
                    size.width = canvasWidth;
                    size.height = canvasHeight;
                }
            }
        }
        return size;
    };
    CanvasCamera.prototype.getUIOrientation = function () {
        if (isNaN(Number(window.orientation))) {
            return 'landscape';
        }
        else {
            if (Number(window.orientation) % 180 === 0) {
                return 'portrait';
            }
            else {
                return 'landscape';
            }
        }
    };
    CanvasCamera.prototype.setRenderersSize = function (size) {
        if (size.width && size.height) {
            if (this.canvas.fullsize) {
                var canvasWidth = Number(size.width);
                var canvasHeight = Number(size.height);
                if (!isNaN(canvasWidth) && !isNaN(canvasHeight)) {
                    this.canvas.fullsize.setSize({
                        width: canvasWidth,
                        height: canvasHeight,
                    }, size.auto);
                    if (this.canvas.thumbnail) {
                        var thumbnailRatio = NaN;
                        if (this.options.thumbnailRatio) {
                            thumbnailRatio = Number(this.options.thumbnailRatio);
                        }
                        if (isNaN(thumbnailRatio)) {
                            thumbnailRatio = 1 / 6;
                            this.options.thumbnailRatio = 1 / 6;
                        }
                        this.options.hasThumbnail = true;
                        this.canvas.thumbnail.setSize({
                            width: canvasWidth * thumbnailRatio,
                            height: canvasHeight * thumbnailRatio,
                        });
                    }
                }
            }
        }
        return this;
    };
    return CanvasCamera;
}(CanvasCameraWithEvents));
module.exports = CanvasCamera;
//# sourceMappingURL=canvascamera.js.map