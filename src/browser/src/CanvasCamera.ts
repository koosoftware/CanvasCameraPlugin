const exec = require('cordova/exec');

// CanvasCamera type definitions
interface Window {
  Ionic?: any;
  CanvasCamera: CanvasCamera;
}

type UISize = CanvasSize;
type UseImageAs = 'data' | 'file';
type CameraFacing = 'front' | 'back';

type PluginResultCallbackFunction = (data: CanvasCameraData) => void;

type CanvasCameraEventMethodName =
  | 'beforeFrameRendering'
  | 'afterFrameRendering'
  | 'beforeFrameInitialization'
  | 'afterFrameInitialization'
  | 'beforeRenderingPresets'
  | 'afterRenderingPresets';

type CanvasCameraEventName = Lowercase<CanvasCameraEventMethodName>;
interface CanvasElements {
  fullsize: HTMLCanvasElement;
  thumbnail?: HTMLCanvasElement;
}

interface Renderers {
  fullsize: Renderer;
  thumbnail?: Renderer;
  [key: string]: Renderer | undefined;
}

interface CanvasCameraUserOptions {
  width?: number;
  height?: number;
  cameraFacing?: CameraFacing;
  canvas?: {
    width?: number;
    height?: number;
  };
  capture?: {
    width?: number;
    height?: number;
  };
  use?: UseImageAs;
  fps?: number;
  flashMode?: boolean;
  hasThumbnail?: boolean;
  thumbnailRatio?: number;
  onAfterDraw?: (frame?: Frame) => void;
  onBeforeDraw?: (frame?: Frame) => void;
}

interface CanvasCameraDataImages {
  orientation?: Orientation;
  fullsize?: CanvasCameraDataImage;
  thumbnail: CanvasCameraDataImage;
}

interface CanvasCameraDataOutput {
  images?: CanvasCameraDataImages;
}

interface CanvasCameraCaptureId {
  id?: number;
}

interface CanvasCameraCaptureFps {
  min?: number;
  max?: number;
}

interface CanvasCameraCaptureSettings {
  width?: number;
  height?: number;
  format?: number;
  started?: boolean;
  focusMode?: string;
  fps?: CanvasCameraCaptureFps | number;
  camera?: CanvasCameraCaptureId;
}

interface CanvasCameraData {
  message?: string;
  options?: CanvasCameraUserOptions;
  preview?: CanvasCameraCaptureSettings;
  output?: CanvasCameraDataOutput;
}

// Renderer type definitions :
type Orientation = 'portrait' | 'landscape';
type CallbackFunction = (data: any) => void;

interface CanvasSize {
  height: number;
  width: number;
  auto?: boolean;
}

interface CanvasCameraDataImage {
  data?: string;
  file?: string;
  path?: string;
  rotation?: number;
  orientation?: Orientation;
  timestamp?: number;
}

/**
 * Represents a Frame.
 *
 * @export
 * @class Frame
 */
class Frame {
  public ratio = 0;

  public sx = 0;
  public sy = 0;
  public sWidth = 0;
  public sHeight = 0;
  public dx = 0;
  public dy = 0;
  public dWidth = 0;
  public dHeight = 0;

  public renderer: Renderer;
  public image: HTMLImageElement;
  public element: HTMLCanvasElement;

  constructor(
    image: HTMLImageElement,
    element: HTMLCanvasElement,
    renderer: Renderer
  ) {
    this.image = image;
    this.element = element;
    this.renderer = renderer;
  }

  initialize() {
    if (this.image && this.element) {
      this.renderer.canvasCamera.dispatch('beforeframeinitialization', this);
      // The X coordinate of the top left corner of the sub-rectangle of the
      // source image to draw into the destination context.
      this.sx = 0;
      // The Y coordinate of the top left corner of the sub-rectangle of the
      // source image to draw into the destination context.
      this.sy = 0;
      // The width of the sub-rectangle of the source image to draw into the
      // destination context. If not specified, the entire rectangle from the
      // coordinates specified by sx and sy to the bottom-right corner of the
      // image is used.
      this.sWidth = parseFloat(`${this.image.width}`);
      // The height of the sub-rectangle of the source image to draw into the
      // destination context.
      this.sHeight = parseFloat(`${this.image.height}`);
      // The X coordinate in the destination canvas at which to place the
      // top-left corner of the source image.
      this.dx = 0;
      // The Y coordinate in the destination canvas at which to place the
      // top-left corner of the source image.
      this.dy = 0;
      // The width to draw the image in the destination canvas. This allows
      // scaling of the drawn image. If not specified, the image is not scaled
      // in width when drawn.
      this.dWidth = parseFloat(`${this.element.width}`);
      // The height to draw the image in the destination canvas. This allows
      // scaling of the drawn image. If not specified, the image is not scaled
      // in height when drawn.
      this.dHeight = parseFloat(`${this.element.height}`);

      const hRatio = this.dWidth / this.sWidth;
      const vRatio = this.dHeight / this.sHeight;
      this.ratio = Math.max(hRatio, vRatio);

      this.dx = (this.dWidth - this.sWidth * this.ratio) / 2;
      this.dy = (this.dHeight - this.sHeight * this.ratio) / 2;

      this.dWidth = this.sWidth * this.ratio;
      this.dHeight = this.sHeight * this.ratio;

      this.renderer.canvasCamera.dispatch('afterframeinitialization', this);
    }

    return this;
  }

  recycle() {
    for (const property in this) {
      if (this.hasOwnProperty(property)) {
        delete this[property];
      }
    }
  }
}

/**
 * Represents a Renderer.
 *
 * @export
 * @class Renderer
 */
class Renderer {
  public data: CanvasCameraDataImage | undefined;
  public size: CanvasSize | undefined;
  public image: HTMLImageElement | undefined;
  public context: CanvasRenderingContext2D | undefined | null;
  public orientation: Orientation | undefined;
  public buffer: CanvasCameraDataImage[] = [];
  public available = true;
  public fullscreen = false;

  public element: HTMLCanvasElement;
  public canvasCamera: CanvasCamera;

  public onAfterDraw: CallbackFunction = () => {};
  public onBeforeDraw: CallbackFunction = () => {};

  constructor(element: HTMLCanvasElement, canvasCamera: CanvasCamera) {
    this.element = element;
    this.canvasCamera = canvasCamera;
  }

  initialize() {
    if (this.element) {
      this.context = this.element.getContext('2d');

      this.image = new Image();
      this.image.crossOrigin = 'Anonymous';

      this.image.addEventListener('load', () => {
        if (this.image) {
          let frame: Frame | null = this.canvasCamera.createFrame(
            this.image,
            this.element,
            this
          );

          if (frame) {
            this.resize().clear();
            if (this.onBeforeDraw) {
              this.onBeforeDraw(frame);
            }
            this.draw(frame);
            if (this.onAfterDraw) {
              this.onAfterDraw(frame);
            }

            frame.recycle();
          }
          frame = null;
        }
        this.enable();
      });

      this.image.addEventListener('error', () => {
        this.clear().enable();
      });

      window.addEventListener('orientationchange', () => {
        this.onOrientationChange();
      });
    }
    return this;
  }

  onOrientationChange() {
    if (this.canvasCamera.getUIOrientation() !== this.orientation) {
      this.invert();
    }
    this.buffer = [];
  }

  clear() {
    if (this.context) {
      this.context.clearRect(0, 0, this.element.width, this.element.height);
    }

    return this;
  }

  draw(frame: Frame) {
    if (frame && this.context) {
      this.canvasCamera.dispatch('beforeframerendering', this, frame);

      this.context.drawImage(
        frame.image,
        frame.sx,
        frame.sy,
        frame.sWidth,
        frame.sHeight,
        frame.dx,
        frame.dy,
        frame.dWidth,
        frame.dHeight
      );

      this.canvasCamera.dispatch('afterframerendering', this, frame);
    }
    return this;
  }

  bufferize(data: CanvasCameraDataImage) {
    if (this.enabled()) {
      this.buffer.push(data);
      this.run();
    }

    return this;
  }

  run() {
    if (this.enabled()) {
      window.requestAnimationFrame(() => {
        if (this.buffer.length) {
          this.render(this.buffer.pop());
          this.buffer = [];
        }
      });
    }

    return this;
  }

  render(data: CanvasCameraDataImage | undefined) {
    if (this.enabled()) {
      if (
        this.canvasCamera &&
        this.canvasCamera.options &&
        this.canvasCamera.options.use
      ) {
        if (data && data[this.canvasCamera.options.use]) {
          this.data = data;
          if (data.hasOwnProperty('orientation') && data.orientation) {
            this.orientation = data.orientation;
          }

          if (this.image) {
            // type can be 'data' or 'file'
            switch (this.canvasCamera.options.use) {
              case 'file':
                // If we are using cordova-plugin-ionic-webview plugin which
                // replaces the default UIWebView with WKWebView.
                if (
                  'Ionic' in window &&
                  window.Ionic &&
                  window.Ionic?.WebView &&
                  window.Ionic.WebView?.convertFileSrc
                ) {
                  data[this.canvasCamera.options.use] =
                    window.Ionic.WebView.convertFileSrc(
                      data[this.canvasCamera.options.use]
                    );
                }
                // add a random seed to prevent browser caching.
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
  }

  enable() {
    this.available = true;
    return this;
  }

  disable() {
    this.available = false;
    return this;
  }

  enabled() {
    return this.available;
  }

  disabled() {
    return !this.available;
  }

  invert() {
    if (this.size) {
      const iSize = this.size;
      if (this.size.width && !isNaN(this.size.width)) {
        if (this.fullscreen) {
          iSize.width = Number(window.innerHeight);
        } else {
          if (Number(this.size.height) <= Number(window.innerHeight)) {
            iSize.width = Number(this.size.height);
          } else {
            iSize.width = Number(window.innerHeight);
          }
        }
      }
      if (this.size.height && !isNaN(this.size.height)) {
        if (this.fullscreen) {
          iSize.height = Number(window.innerWidth);
        } else {
          if (Number(this.size.width) <= Number(window.innerWidth)) {
            iSize.height = Number(this.size.width);
          } else {
            iSize.height = Number(window.innerWidth);
          }
        }
      }
      this.size = iSize;
    }

    return this;
  }

  resize() {
    if (this.size) {
      const pixelRatio = window.devicePixelRatio || 1;
      if (this.size.width && !isNaN(this.size.width)) {
        if (
          !this.fullscreen &&
          Number(this.size.width) <= Number(window.innerWidth)
        ) {
          this.element.width = Number(this.size.width * pixelRatio);
          this.element.style.width = Number(this.size.width) + 'px';
        } else {
          this.element.width = Number(window.innerWidth * pixelRatio);
          this.element.style.width = Number(window.innerWidth) + 'px';
        }
      } else {
        this.element.width = Number(window.innerWidth * pixelRatio);
        this.element.style.width = Number(window.innerWidth) + 'px';
      }
      if (this.size.height && !isNaN(this.size.height)) {
        if (
          !this.fullscreen &&
          Number(this.size.height) <= Number(window.innerHeight)
        ) {
          this.element.height = Number(this.size.height * pixelRatio);
          this.element.style.height = Number(this.size.height) + 'px';
        } else {
          this.element.height = Number(window.innerHeight * pixelRatio);
          this.element.style.height = Number(window.innerHeight) + 'px';
        }
      } else {
        this.element.height = Number(window.innerHeight * pixelRatio);
        this.element.style.height = Number(window.innerHeight) + 'px';
      }
    }

    return this;
  }

  setSize(size: CanvasSize, auto?: boolean) {
    this.fullscreen = !!auto || false;
    if (size && size.width && size.height) {
      if (!isNaN(Number(size.width)) && !isNaN(Number(size.height))) {
        this.size = size;
        if (!this.fullscreen) {
          // If size is higher than windows size, set size to fullscreen.
          if (
            Number(size.width) >= Number(window.innerWidth) &&
            Number(size.height) >= Number(window.innerHeight)
          ) {
            this.fullscreen = true;
          }
        }
      }
    }

    return this;
  }

  setOnBeforeDraw(onBeforeDraw: CallbackFunction) {
    if (onBeforeDraw && typeof onBeforeDraw === 'function') {
      this.onBeforeDraw = onBeforeDraw;
    }
    return this;
  }

  setOnAfterDraw(onAfterDraw: CallbackFunction) {
    if (onAfterDraw && typeof onAfterDraw === 'function') {
      this.onAfterDraw = onAfterDraw;
    }
    return this;
  }
}

/**
 * Decorator for CanvasCamera
 *
 * @export
 * @param {Function} constructor
 */
function withEvents(constructor: Function) {
  const events: CanvasCameraEventMethodName[] = [
    'beforeFrameRendering',
    'afterFrameRendering',
    'beforeFrameInitialization',
    'afterFrameInitialization',
    'beforeRenderingPresets',
    'afterRenderingPresets',
  ];

  events.forEach(function (eventName) {
    constructor.prototype[eventName] = function (listener: CallbackFunction) {
      const listenerName = (this.nativeClass + '-' + eventName).toLowerCase();
      window.addEventListener(
        listenerName,
        function (e: CustomEvent) {
          listener.call(e.detail.caller, [e, e.detail.data]);
        }.bind(this) as EventListener
      );
    };
  });
}

/**
 * Represents a CanvasCamera.
 *
 * @export
 * @class CanvasCamera
 */
@withEvents
class CanvasCamera {
  public static instance: CanvasCamera;
  public onCapture: CallbackFunction | null = null;
  public nativeClass = 'CanvasCamera';
  public canvas: Renderers = {} as Renderers;
  public options: CanvasCameraUserOptions = {} as CanvasCameraUserOptions;

  constructor() {}

  static getInstance() {
    if (this.instance && this.instance instanceof CanvasCamera) {
      return this.instance;
    }
    return (this.instance = new CanvasCamera());
  }

  static start(
    userOptions: CanvasCameraUserOptions,
    onError?: PluginResultCallbackFunction,
    onSuccess?: PluginResultCallbackFunction
  ) {
    return this.getInstance().start(userOptions, onError, onSuccess);
  }

  static stop(
    onError?: PluginResultCallbackFunction,
    onSuccess?: PluginResultCallbackFunction
  ) {
    return this.getInstance().stop(onError, onSuccess);
  }

  static cameraPosition(
    cameraFacing: CameraFacing,
    onError?: PluginResultCallbackFunction,
    onSuccess?: PluginResultCallbackFunction
  ) {
    return this.getInstance().cameraPosition(cameraFacing, onError, onSuccess);
  }

  static flashMode(
    flashMode: boolean,
    onError?: PluginResultCallbackFunction,
    onSuccess?: PluginResultCallbackFunction
  ) {
    return this.getInstance().flashMode(flashMode, onError, onSuccess);
  }

  public dispatch(
    this: CanvasCamera,
    eventName: CanvasCameraEventName,
    caller: CanvasCamera | Renderer | Frame,
    frame?: Frame
  ): void {
    const listenerName = (this.nativeClass + '-' + eventName).toLowerCase();
    const event = new CustomEvent(listenerName, {
      detail: {
        caller: caller,
        data: frame || {},
      },
    });
    window.dispatchEvent(event);
  }

  initialize(
    fcanvas: HTMLCanvasElement | CanvasElements,
    tcanvas?: HTMLCanvasElement
  ) {
    if (fcanvas instanceof HTMLCanvasElement) {
      this.canvas.fullsize = this.createRenderer(fcanvas, this);
      if (tcanvas instanceof HTMLCanvasElement) {
        this.canvas.thumbnail = this.createRenderer(tcanvas, this);
      }
    } else {
      if (fcanvas?.fullsize && fcanvas?.fullsize instanceof HTMLCanvasElement) {
        this.canvas.fullsize = this.createRenderer(fcanvas.fullsize, this);
        if (
          fcanvas?.thumbnail &&
          fcanvas.thumbnail instanceof HTMLCanvasElement
        ) {
          this.canvas.thumbnail = this.createRenderer(fcanvas.thumbnail, this);
        }
      }
    }
  }

  start(
    userOptions: CanvasCameraUserOptions,
    onError?: PluginResultCallbackFunction,
    onSuccess?: PluginResultCallbackFunction
  ) {
    this.options = userOptions;
    this.setRenderingPresets();

    if (onSuccess && typeof onSuccess === 'function') {
      this.onCapture = onSuccess;
    }

    this.enableRenderers();
    exec(
      this.capture.bind(this),
      (error: CanvasCameraData) => {
        this.disableRenderers();
        if (onError && typeof onError === 'function') {
          onError(error);
        }
      },
      this.nativeClass,
      'startCapture',
      [this.options]
    );
  }

  stop(
    onError?: PluginResultCallbackFunction,
    onSuccess?: PluginResultCallbackFunction
  ) {
    this.disableRenderers();
    exec(
      (data: CanvasCameraData) => {
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(data);
        }
      },
      (error: CanvasCameraData) => {
        if (onError && typeof onError === 'function') {
          onError(error);
        }
      },
      this.nativeClass,
      'stopCapture',
      []
    );
  }

  flashMode(
    flashMode: boolean,
    onError?: PluginResultCallbackFunction,
    onSuccess?: PluginResultCallbackFunction
  ) {
    exec(
      (data: CanvasCameraData) => {
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(data);
        }
      },
      (error: CanvasCameraData) => {
        if (onError && typeof onError === 'function') {
          onError(error);
        }
      },
      this.nativeClass,
      'flashMode',
      [flashMode]
    );
  }

  cameraPosition(
    cameraFacing: CameraFacing,
    onError?: PluginResultCallbackFunction,
    onSuccess?: PluginResultCallbackFunction
  ) {
    this.disableRenderers();
    exec(
      (data: CanvasCameraData) => {
        this.enableRenderers();
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(data);
        }
      },
      (error: CanvasCameraData) => {
        if (onError && typeof onError === 'function') {
          onError(error);
        }
      },
      this.nativeClass,
      'cameraPosition',
      [cameraFacing]
    );
  }

  capture(data: CanvasCameraData) {
    if (data?.output && data.output.images) {
      if (
        this.options.use &&
        data.output.images.fullsize &&
        data.output.images.fullsize[this.options.use]
      ) {
        if (this.canvas.fullsize) {
          this.canvas.fullsize.bufferize(data.output.images.fullsize);
        }
        if (
          data.output.images.thumbnail &&
          data.output.images.thumbnail[this.options.use]
        ) {
          if (this.canvas.thumbnail) {
            this.canvas.thumbnail.bufferize(data.output.images.thumbnail);
          }
        }
      }
    }

    if (this.onCapture && typeof this.onCapture === 'function') {
      this.onCapture(data);
    }
  }

  createFrame(
    image: HTMLImageElement,
    element: HTMLCanvasElement,
    renderer: Renderer
  ) {
    const frame = new Frame(image, element, renderer);
    return frame.initialize();
  }

  createRenderer(element: HTMLCanvasElement, canvasCamera: CanvasCamera) {
    const renderer = new Renderer(element, canvasCamera);
    return renderer.initialize();
  }

  enableRenderers() {
    if (this.canvas && 'object' === typeof this.canvas) {
      for (const renderer in Object.entries) {
        if (
          this.canvas.hasOwnProperty(renderer) &&
          this.canvas[renderer] instanceof Renderer
        ) {
          if (this.canvas[renderer]?.disabled()) {
            this.canvas[renderer]?.enable();
          }
        }
      }
    }
  }

  disableRenderers() {
    if (this.canvas && 'object' === typeof this.canvas) {
      for (const renderer in this.canvas) {
        if (
          this.canvas.hasOwnProperty(renderer) &&
          this.canvas[renderer] instanceof Renderer
        ) {
          if (this.canvas[renderer]?.enabled()) {
            this.canvas[renderer]?.disable();
          }
        }
      }
    }
  }

  setRenderingPresets() {
    this.dispatch('beforerenderingpresets', this);

    switch (this.options.use) {
      case 'data':
      case 'file':
        break;
      default:
        this.options.use = 'file';
    }

    if (
      this.options.onBeforeDraw &&
      typeof this.options.onBeforeDraw === 'function'
    ) {
      if (this.canvas.fullsize) {
        this.canvas.fullsize.setOnBeforeDraw(this.options.onBeforeDraw);
      }
    }

    if (
      this.options.onAfterDraw &&
      typeof this.options.onAfterDraw === 'function'
    ) {
      if (this.canvas.fullsize) {
        this.canvas.fullsize.setOnAfterDraw(this.options.onAfterDraw);
      }
    }

    const size = this.getUISize();
    this.setRenderersSize(size);

    this.dispatch('afterrenderingpresets', this);

    return this;
  }

  getUISize() {
    const size: UISize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    if (this.options) {
      let canvasWidth: number = NaN;
      let canvasHeight: number = NaN;
      // Check if canvas height and width are set.
      if (this.options.canvas) {
        if (this.options.canvas.width && this.options.canvas.height) {
          canvasWidth = parseFloat(`${this.options.canvas.width}`);
          canvasHeight = parseFloat(`${this.options.canvas.height}`);
        }
      }
      // Check if capture and canvas height and width are set.
      if (this.options.width && this.options.height) {
        canvasWidth = parseFloat(`${this.options.width}`);
        canvasHeight = parseFloat(`${this.options.height}`);
      }
      // Assign height and width to UI size object.
      if (!isNaN(canvasWidth) && !isNaN(canvasHeight)) {
        size.auto = false;
        if (this.getUIOrientation() === 'portrait') {
          size.width = canvasHeight;
          size.height = canvasWidth;
        } else {
          size.width = canvasWidth;
          size.height = canvasHeight;
        }
      }
    }

    return size;
  }

  getUIOrientation(): Orientation {
    if (isNaN(Number(window.orientation))) {
      return 'landscape';
    } else {
      if (Number(window.orientation) % 180 === 0) {
        return 'portrait';
      } else {
        return 'landscape';
      }
    }
  }

  setRenderersSize(size: CanvasSize) {
    if (size.width && size.height) {
      if (this.canvas.fullsize) {
        const canvasWidth = Number(size.width);
        const canvasHeight = Number(size.height);
        if (!isNaN(canvasWidth) && !isNaN(canvasHeight)) {
          this.canvas.fullsize.setSize(
            {
              width: canvasWidth,
              height: canvasHeight,
            },
            size.auto
          );
          if (this.canvas.thumbnail) {
            let thumbnailRatio: number = NaN;
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
  }
}

module.exports = CanvasCamera;
