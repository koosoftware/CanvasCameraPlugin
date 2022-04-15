const exec = require('cordova/exec');

// CanvasCamera type definitions
interface Window {
  Ionic?: any;
  CanvasCamera: CanvasCamera;
}

type CanvasCameraUISize = CanvasCameraCanvasSize;
type CanvasCameraUseImageAs = 'data' | 'file';
type CanvasCameraCameraFacing = 'front' | 'back';

type CanvasCameraPluginResultCallbackFunction = (data: CanvasCameraData) => void;

type CanvasCameraEventMethodName =
  | 'beforeFrameRendering'
  | 'afterFrameRendering'
  | 'beforeFrameInitialization'
  | 'afterFrameInitialization'
  | 'beforeRenderingPresets'
  | 'afterRenderingPresets';

type CanvasCameraEventName = Lowercase<CanvasCameraEventMethodName>;
interface CanvasCameraCanvasElements {
  fullsize: HTMLCanvasElement;
  thumbnail?: HTMLCanvasElement;
}

interface CanvasCameraRenderers {
  fullsize: CanvasCameraRenderer;
  thumbnail?: CanvasCameraRenderer;
  [key: string]: CanvasCameraRenderer | undefined;
}

interface CanvasCameraEventDetail {
  context: CanvasCamera | CanvasCameraRenderer | CanvasCameraFrame;
  data: CanvasCamera | CanvasCameraRenderer | CanvasCameraFrame;
}
interface CanvasCameraUserOptions {
  width?: number;
  height?: number;
  cameraFacing?: CanvasCameraCameraFacing;
  canvas?: {
    width?: number;
    height?: number;
  };
  capture?: {
    width?: number;
    height?: number;
  };
  use?: CanvasCameraUseImageAs;
  fps?: number;
  flashMode?: boolean;
  hasThumbnail?: boolean;
  thumbnailRatio?: number;
  onAfterDraw?: <F>(frame: F) => void;
  onBeforeDraw?: <F>(frame: F) => void;
}

interface CanvasCameraDataImages {
  orientation?: CanvasCameraOrientation;
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

// CanvasCameraRenderer type definitions :
type CanvasCameraOrientation = 'portrait' | 'landscape';
type CanvasCameraEventListener = <D>(data: D) => void;

interface CanvasCameraCanvasSize {
  height: number;
  width: number;
  auto?: boolean;
}

interface CanvasCameraDataImage {
  data?: string;
  file?: string;
  path?: string;
  rotation?: number;
  orientation?: CanvasCameraOrientation;
  timestamp?: number;
}

/**
 * Represents a Frame.
 *
 * @export
 * @class CanvasCameraFrame
 */
class CanvasCameraFrame {
  public ratio = 0;

  public sx = 0;
  public sy = 0;
  public sWidth = 0;
  public sHeight = 0;
  public dx = 0;
  public dy = 0;
  public dWidth = 0;
  public dHeight = 0;

  public renderer: CanvasCameraRenderer;
  public image: HTMLImageElement;
  public element: HTMLCanvasElement;

  constructor(
    image: HTMLImageElement,
    element: HTMLCanvasElement,
    renderer: CanvasCameraRenderer
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
 * @class CanvasCameraRenderer
 */
class CanvasCameraRenderer {
  public data: CanvasCameraDataImage | undefined;
  public size: CanvasCameraCanvasSize | undefined;
  public image: HTMLImageElement | undefined;
  public context: CanvasRenderingContext2D | undefined | null;
  public orientation: CanvasCameraOrientation | undefined;
  public buffer: CanvasCameraDataImage[] = [];
  public available = true;
  public fullscreen = false;

  public element: HTMLCanvasElement;
  public canvasCamera: CanvasCamera;

  public onAfterDraw: CanvasCameraEventListener | undefined;
  public onBeforeDraw: CanvasCameraEventListener | undefined;

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
          let frame: CanvasCameraFrame | null = this.canvasCamera.createFrame(
            this.image,
            this.element,
            this
          );

          if (frame) {
            this.resize().clear();
            if (this.onBeforeDraw) {
              this.onBeforeDraw<CanvasCameraFrame>(frame);
            }
            this.draw(frame);
            if (this.onAfterDraw) {
              this.onAfterDraw<CanvasCameraFrame>(frame);
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

  draw(frame: CanvasCameraFrame) {
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
          const data = this.buffer.pop();
          if (data) {
            this.render(data);
          }
          this.buffer = [];
        }
      });
    }

    return this;
  }

  render(data: CanvasCameraDataImage) {
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

  setSize(size: CanvasCameraCanvasSize, auto?: boolean) {
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

  setOnBeforeDraw(onBeforeDraw: CanvasCameraEventListener) {
    if (onBeforeDraw && typeof onBeforeDraw === 'function') {
      this.onBeforeDraw = onBeforeDraw;
    }
    return this;
  }

  setOnAfterDraw(onAfterDraw: CanvasCameraEventListener) {
    if (onAfterDraw && typeof onAfterDraw === 'function') {
      this.onAfterDraw = onAfterDraw;
    }
    return this;
  }
}

abstract class CanvasCameraWithEvents {
  abstract beforeFrameRendering(listener: CanvasCameraEventListener): void;
  abstract afterFrameRendering(listener: CanvasCameraEventListener): void;
  abstract beforeFrameInitialization(listener: CanvasCameraEventListener): void;
  abstract afterFrameInitialization(listener: CanvasCameraEventListener): void;
  abstract beforeRenderingPresets(listener: CanvasCameraEventListener): void;
  abstract afterRenderingPresets(listener: CanvasCameraEventListener): void;
}

/**
 * Represents a CanvasCamera.
 *
 * @export
 * @class CanvasCamera
 */
class CanvasCamera extends CanvasCameraWithEvents {
  public static instance: CanvasCamera;
  public onCapture: CanvasCameraEventListener | undefined;
  public nativeClass = 'CanvasCamera';
  public canvas: CanvasCameraRenderers = {} as CanvasCameraRenderers;
  public options: CanvasCameraUserOptions = {} as CanvasCameraUserOptions;

  constructor() {
    super();
  }

  static getInstance() {
    if (this.instance && this.instance instanceof CanvasCamera) {
      return this.instance;
    }
    return (this.instance = new CanvasCamera());
  }

  static initialize(
    fcanvas: HTMLCanvasElement | CanvasCameraCanvasElements,
    tcanvas?: HTMLCanvasElement
  ) {
    return this.getInstance().initialize(fcanvas, tcanvas);
  }

  static start(
    userOptions: CanvasCameraUserOptions,
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
  ) {
    return this.getInstance().start(userOptions, onError, onSuccess);
  }

  static stop(
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
  ) {
    return this.getInstance().stop(onError, onSuccess);
  }

  static cameraPosition(
    cameraFacing: CanvasCameraCameraFacing,
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
  ) {
    return this.getInstance().cameraPosition(cameraFacing, onError, onSuccess);
  }

  static flashMode(
    flashMode: boolean,
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
  ) {
    return this.getInstance().flashMode(flashMode, onError, onSuccess);
  }

  beforeFrameRendering(listener: CanvasCameraEventListener) {
    return this.triggerEvent('beforeFrameRendering', listener);
  }

  static beforeFrameRendering(listener: CanvasCameraEventListener) {
    return this.getInstance().beforeFrameRendering(listener);
  }

  afterFrameRendering(listener: CanvasCameraEventListener) {
    return this.triggerEvent('afterFrameRendering', listener);
  }

  static afterFrameRendering(listener: CanvasCameraEventListener) {
    return this.getInstance().afterFrameRendering(listener);
  }

  beforeFrameInitialization(listener: CanvasCameraEventListener) {
    return this.triggerEvent('beforeFrameInitialization', listener);
  }

  static beforeFrameInitialization(listener: CanvasCameraEventListener) {
    return this.getInstance().beforeFrameInitialization(listener);
  }

  afterFrameInitialization(listener: CanvasCameraEventListener) {
    return this.triggerEvent('afterFrameInitialization', listener);
  }

  static afterFrameInitialization(listener: CanvasCameraEventListener) {
    return this.getInstance().afterFrameInitialization(listener);
  }

  beforeRenderingPresets(listener: CanvasCameraEventListener) {
    return this.triggerEvent('beforeRenderingPresets', listener);
  }

  static beforeRenderingPresets(listener: CanvasCameraEventListener) {
    return this.getInstance().beforeRenderingPresets(listener);
  }

  afterRenderingPresets(listener: CanvasCameraEventListener) {
    return this.triggerEvent('afterRenderingPresets', listener);
  }

  static afterRenderingPresets(listener: CanvasCameraEventListener) {
    return this.getInstance().afterRenderingPresets(listener);
  }

  private triggerEvent(
    eventName: CanvasCameraEventMethodName,
    listener: CanvasCameraEventListener
  ) {
    const listenerName = (this.nativeClass + '-' + eventName).toLowerCase();
    window.addEventListener(
      listenerName,
      function(e: CustomEvent<CanvasCameraEventDetail>) {
        listener.call(e.detail.context, [e, e.detail.data]);
      }.bind(this) as EventListener
    );

    return this;
  }

  public dispatch(
    this: CanvasCamera,
    eventName: CanvasCameraEventName,
    context: CanvasCamera | CanvasCameraRenderer | CanvasCameraFrame,
    data?: CanvasCamera | CanvasCameraRenderer | CanvasCameraFrame
  ): void {
    const listenerName = (this.nativeClass + '-' + eventName).toLowerCase();
    const event = new CustomEvent(listenerName, {
      detail: {
        context,
        data
      },
    });
    window.dispatchEvent(event);
  }

  initialize(
    fcanvas: HTMLCanvasElement | CanvasCameraCanvasElements,
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
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
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
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
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
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
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
    cameraFacing: CanvasCameraCameraFacing,
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
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
    renderer: CanvasCameraRenderer
  ) {
    const frame = new CanvasCameraFrame(image, element, renderer);
    return frame.initialize();
  }

  createRenderer(element: HTMLCanvasElement, canvasCamera: CanvasCamera) {
    const renderer = new CanvasCameraRenderer(element, canvasCamera);
    return renderer.initialize();
  }

  enableRenderers() {
    if (this.canvas && 'object' === typeof this.canvas) {
      for (const renderer in this.canvas) {
        if (
          this.canvas.hasOwnProperty(renderer) &&
          this.canvas[renderer] instanceof CanvasCameraRenderer
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
          this.canvas[renderer] instanceof CanvasCameraRenderer
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
    const size: CanvasCameraUISize = {
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

  getUIOrientation(): CanvasCameraOrientation {
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

  setRenderersSize(size: CanvasCameraCanvasSize) {
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
