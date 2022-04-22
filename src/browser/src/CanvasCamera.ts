const exec = require('cordova/exec');

declare global {
  interface Window {
    Ionic?: any;
    plugin: {
      CanvasCamera: CanvasCameraConstructor;
    };
    CanvasCamera: CanvasCameraConstructor;
  }
  var CanvasCamera: CanvasCameraConstructor;
}

// CanvasCamera export type definitions
export type CanvasCameraUISize = CanvasCameraCanvasSize;
export type CanvasCameraUseImageAs = 'data' | 'file';
export type CanvasCameraCameraFacing = 'front' | 'back';

export type CanvasCameraPluginCallback = <D>(data: D) => void;
export type CanvasCameraPluginResultCallbackFunction = (
  data: CanvasCameraData
) => void;

export type CanvasCameraEventMethodName =
  | 'beforeFrameRendering'
  | 'afterFrameRendering'
  | 'beforeFrameInitialization'
  | 'afterFrameInitialization'
  | 'beforeRenderingPresets'
  | 'afterRenderingPresets';

export type CanvasCameraEventName = Lowercase<CanvasCameraEventMethodName>;
export interface CanvasCameraCanvasElements {
  fullsize: HTMLCanvasElement;
  thumbnail?: HTMLCanvasElement;
}

export interface CanvasCameraRenderers {
  fullsize: CanvasCameraRenderer;
  thumbnail?: CanvasCameraRenderer;
  [key: string]: CanvasCameraRenderer | undefined;
}

export interface CanvasCameraEventDetail {
  context: CanvasCamera | CanvasCameraRenderer | CanvasCameraFrame;
  data: CanvasCamera | CanvasCameraRenderer | CanvasCameraFrame;
}
export interface CanvasCameraUserOptions {
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

export interface CanvasCameraDataImages {
  orientation?: CanvasCameraOrientation;
  fullsize?: CanvasCameraDataImage;
  thumbnail: CanvasCameraDataImage;
}

export interface CanvasCameraDataOutput {
  images?: CanvasCameraDataImages;
}

export interface CanvasCameraCaptureId {
  id?: number;
}

export interface CanvasCameraCaptureFps {
  min?: number;
  max?: number;
}

export interface CanvasCameraCaptureSettings {
  width?: number;
  height?: number;
  format?: number;
  started?: boolean;
  focusMode?: string;
  fps?: CanvasCameraCaptureFps | number;
  camera?: CanvasCameraCaptureId;
}

export interface CanvasCameraData {
  message?: string;
  options?: CanvasCameraUserOptions;
  preview?: CanvasCameraCaptureSettings;
  output?: CanvasCameraDataOutput;
}

export default interface CanvasCameraConstructor {
  new (): CanvasCamera;
  instance: CanvasCamera;
  getInstance(): CanvasCamera;
  beforeFrameRendering(
    listener: CanvasCameraRendererEventListener
  ): CanvasCamera;
  afterFrameRendering(
    listener: CanvasCameraRendererEventListener
  ): CanvasCamera;
  beforeFrameInitialization(
    listener: CanvasCameraFrameEventListener
  ): CanvasCamera;
  afterFrameInitialization(
    listener: CanvasCameraFrameEventListener
  ): CanvasCamera;
  beforeRenderingPresets(listener: CanvasCameraEventListener): CanvasCamera;
  afterRenderingPresets(listener: CanvasCameraEventListener): CanvasCamera;
  initialize(
    fcanvas: HTMLCanvasElement | CanvasCameraCanvasElements,
    tcanvas?: HTMLCanvasElement
  ): CanvasCamera;
  start(
    userOptions: CanvasCameraUserOptions,
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
  ): CanvasCamera;
  stop(
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
  ): CanvasCamera;
  flashMode(
    flashMode: boolean,
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
  ): CanvasCamera;
  cameraPosition(
    cameraFacing: CanvasCameraCameraFacing,
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
  ): CanvasCamera;
}
export interface CanvasCamera {
  onCapture: CanvasCameraPluginCallback | undefined;
  nativeClass: string;
  canvas: CanvasCameraRenderers;
  options: CanvasCameraUserOptions;
  beforeFrameRendering(
    listener: CanvasCameraRendererEventListener
  ): CanvasCamera;
  afterFrameRendering(
    listener: CanvasCameraRendererEventListener
  ): CanvasCamera;
  beforeFrameInitialization(
    listener: CanvasCameraFrameEventListener
  ): CanvasCamera;
  afterFrameInitialization(
    listener: CanvasCameraFrameEventListener
  ): CanvasCamera;
  beforeRenderingPresets(listener: CanvasCameraEventListener): CanvasCamera;
  afterRenderingPresets(listener: CanvasCameraEventListener): CanvasCamera;
  dispatch(
    this: CanvasCamera,
    eventName: CanvasCameraEventName,
    context: CanvasCamera | CanvasCameraRenderer | CanvasCameraFrame,
    data?: CanvasCamera | CanvasCameraRenderer | CanvasCameraFrame
  ): CanvasCamera;
  initialize(
    fcanvas: HTMLCanvasElement | CanvasCameraCanvasElements,
    tcanvas?: HTMLCanvasElement
  ): CanvasCamera;
  start(
    userOptions: CanvasCameraUserOptions,
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
  ): CanvasCamera;
  stop(
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
  ): CanvasCamera;
  flashMode(
    flashMode: boolean,
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
  ): CanvasCamera;
  cameraPosition(
    cameraFacing: CanvasCameraCameraFacing,
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
  ): CanvasCamera;
  capture(data: CanvasCameraData): CanvasCamera;
  createFrame(
    image: HTMLImageElement,
    element: HTMLCanvasElement,
    renderer: CanvasCameraRenderer
  ): CanvasCameraFrame;
  createRenderer(
    element: HTMLCanvasElement,
    canvasCamera: CanvasCamera
  ): CanvasCameraRenderer;
  enableRenderers(): CanvasCamera;
  disableRenderers(): CanvasCamera;
  setRenderingPresets(): CanvasCamera;
  getUISize(): CanvasCameraCanvasSize;
  getUIOrientation(): CanvasCameraOrientation;
  setRenderersSize(size: CanvasCameraCanvasSize): CanvasCamera;
}

// CanvasCameraRenderer export type definitions :
export type CanvasCameraOrientation = 'portrait' | 'landscape';

export type CanvasCameraEvent = CustomEvent<CanvasCameraEventDetail>;
export type CanvasCameraEventListener = (
  this: CanvasCamera,
  event: CanvasCameraEvent
) => void;
export type CanvasCameraFrameEventListener = (
  this: CanvasCameraFrame,
  event: CanvasCameraEvent
) => void;
export type CanvasCameraRendererEventListener = (
  this: CanvasCameraRenderer,
  event: CanvasCameraEvent,
  frame: CanvasCameraFrame
) => void;
export interface CanvasCameraCanvasSize {
  height: number;
  width: number;
  auto?: boolean;
}

export interface CanvasCameraDataImage {
  data?: string;
  file?: string;
  path?: string;
  rotation?: number;
  orientation?: CanvasCameraOrientation;
  timestamp?: number;
}

export interface CanvasCameraRendererConstructor {
  new (
    element: HTMLCanvasElement,
    canvasCamera: CanvasCamera
  ): CanvasCameraRenderer;
}

export interface CanvasCameraRenderer {
  data: CanvasCameraDataImage | undefined;
  size: CanvasCameraCanvasSize | undefined;
  image: HTMLImageElement | undefined;
  context: CanvasRenderingContext2D | undefined | null;
  orientation: CanvasCameraOrientation | undefined;
  buffer: CanvasCameraDataImage[];
  available: boolean;
  fullscreen: boolean;
  element: HTMLCanvasElement;
  canvasCamera: CanvasCamera;
  onAfterDraw: CanvasCameraPluginCallback | undefined;
  onBeforeDraw: CanvasCameraPluginCallback | undefined;
  initialize(): CanvasCameraRenderer;
  onOrientationChange(): void;
  clear(): CanvasCameraRenderer;
  draw(frame: CanvasCameraFrame): CanvasCameraRenderer;
  bufferize(data: CanvasCameraDataImage): CanvasCameraRenderer;
  run(): CanvasCameraRenderer;
  render(data: CanvasCameraDataImage): CanvasCameraRenderer;
  enable(): CanvasCameraRenderer;
  disable(): CanvasCameraRenderer;
  enabled(): boolean;
  disabled(): boolean;
  invert(): CanvasCameraRenderer;
  resize(): CanvasCameraRenderer;
  setSize(size: CanvasCameraCanvasSize, auto?: boolean): CanvasCameraRenderer;
  setOnBeforeDraw(
    onBeforeDraw: CanvasCameraPluginCallback
  ): CanvasCameraRenderer;
  setOnAfterDraw(onAfterDraw: CanvasCameraPluginCallback): CanvasCameraRenderer;
}

export interface CanvasCameraFrameConstructor {
  new (
    image: HTMLImageElement,
    element: HTMLCanvasElement,
    renderer: CanvasCameraRenderer
  ): CanvasCameraFrame;
}

// CanvasCameraFrame export type definitions :
export interface CanvasCameraFrame {
  ratio: number;
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
  renderer: CanvasCameraRenderer;
  image: HTMLImageElement;
  element: HTMLCanvasElement;
  initialize(): CanvasCameraFrame;
  recycle(): CanvasCameraFrame;
}

/**
 * Represents a Frame.
 *
 * @export
 * @class CanvasCameraFrameImplementation
 */
const CanvasCameraFrameImplementation: CanvasCameraFrameConstructor = class CanvasCameraFrameImplementation
  implements CanvasCameraFrame
{
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

  public initialize(): CanvasCameraFrame {
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

  public recycle(): CanvasCameraFrame {
    for (const property in this) {
      if (this.hasOwnProperty(property)) {
        delete this[property];
      }
    }
    return this;
  }
};

/**
 * Represents a Renderer.
 *
 * @export
 * @class CanvasCameraRendererImplementation
 */
const CanvasCameraRendererImplementation: CanvasCameraRendererConstructor = class CanvasCameraRendererImplementation
  implements CanvasCameraRenderer
{
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

  public onAfterDraw: CanvasCameraPluginCallback | undefined;
  public onBeforeDraw: CanvasCameraPluginCallback | undefined;

  constructor(element: HTMLCanvasElement, canvasCamera: CanvasCamera) {
    this.element = element;
    this.canvasCamera = canvasCamera;
  }

  public initialize(): CanvasCameraRenderer {
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

  public onOrientationChange(): CanvasCameraRenderer {
    if (this.canvasCamera.getUIOrientation() !== this.orientation) {
      this.invert();
    }
    this.buffer = [];
    return this;
  }

  public clear(): CanvasCameraRenderer {
    if (this.context) {
      this.context.clearRect(0, 0, this.element.width, this.element.height);
    }

    return this;
  }

  public draw(frame: CanvasCameraFrame): CanvasCameraRenderer {
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

  public bufferize(data: CanvasCameraDataImage): CanvasCameraRenderer {
    if (this.enabled()) {
      this.buffer.push(data);
      this.run();
    }

    return this;
  }

  public run(): CanvasCameraRenderer {
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

  public render(data: CanvasCameraDataImage): CanvasCameraRenderer {
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
            // export type can be 'data' or 'file'
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

  public enable(): CanvasCameraRenderer {
    this.available = true;
    return this;
  }

  public disable(): CanvasCameraRenderer {
    this.available = false;
    return this;
  }

  enabled() {
    return this.available;
  }

  disabled() {
    return !this.available;
  }

  public invert(): CanvasCameraRenderer {
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

  public resize(): CanvasCameraRenderer {
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

  public setSize(
    size: CanvasCameraCanvasSize,
    auto?: boolean
  ): CanvasCameraRenderer {
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

  public setOnBeforeDraw(
    onBeforeDraw: CanvasCameraPluginCallback
  ): CanvasCameraRenderer {
    if (onBeforeDraw && 'function' === typeof onBeforeDraw) {
      this.onBeforeDraw = onBeforeDraw;
    }
    return this;
  }

  public setOnAfterDraw(
    onAfterDraw: CanvasCameraPluginCallback
  ): CanvasCameraRenderer {
    if (onAfterDraw && 'function' === typeof onAfterDraw) {
      this.onAfterDraw = onAfterDraw;
    }
    return this;
  }
};

/**
 * Represents a CanvasCamera.
 *
 * @export
 * @class CanvasCameraImplementation
 */
const CanvasCameraImplementation: CanvasCameraConstructor = class CanvasCameraImplementation
  implements CanvasCamera
{
  public static instance: CanvasCamera;
  public onCapture: CanvasCameraPluginCallback | undefined;
  public nativeClass = 'CanvasCamera';
  public canvas: CanvasCameraRenderers = {} as CanvasCameraRenderers;
  public options: CanvasCameraUserOptions = {} as CanvasCameraUserOptions;

  static getInstance() {
    if (this.instance && this.instance instanceof CanvasCameraImplementation) {
      return this.instance;
    }
    return (this.instance = new CanvasCameraImplementation());
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

  beforeFrameRendering(listener: CanvasCameraRendererEventListener) {
    return this.triggerEvent('beforeFrameRendering', listener);
  }

  static beforeFrameRendering(listener: CanvasCameraRendererEventListener) {
    return this.getInstance().beforeFrameRendering(listener);
  }

  afterFrameRendering(listener: CanvasCameraRendererEventListener) {
    return this.triggerEvent('afterFrameRendering', listener);
  }

  static afterFrameRendering(listener: CanvasCameraRendererEventListener) {
    return this.getInstance().afterFrameRendering(listener);
  }

  beforeFrameInitialization(listener: CanvasCameraFrameEventListener) {
    return this.triggerEvent('beforeFrameInitialization', listener);
  }

  static beforeFrameInitialization(listener: CanvasCameraFrameEventListener) {
    return this.getInstance().beforeFrameInitialization(listener);
  }

  afterFrameInitialization(listener: CanvasCameraFrameEventListener) {
    return this.triggerEvent('afterFrameInitialization', listener);
  }

  static afterFrameInitialization(listener: CanvasCameraFrameEventListener) {
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
    listener:
      | CanvasCameraEventListener
      | CanvasCameraFrameEventListener
      | CanvasCameraRendererEventListener
  ): CanvasCamera {
    const listenerName = (this.nativeClass + '-' + eventName).toLowerCase();
    window.addEventListener(
      listenerName,
      function (e: CanvasCameraEvent) {
        if (
          2 === listener.length &&
          e.detail.context instanceof CanvasCameraRendererImplementation &&
          e.detail.data &&
          e.detail.data instanceof CanvasCameraFrameImplementation
        ) {
          (listener as CanvasCameraRendererEventListener).call(
            e.detail.context,
            e,
            e.detail.data
          );
        } else {
          if (1 === listener.length) {
            if (e.detail.context instanceof CanvasCameraImplementation) {
              (listener as CanvasCameraEventListener).call(e.detail.context, e);
            }
            if (e.detail.context instanceof CanvasCameraFrameImplementation) {
              (listener as CanvasCameraFrameEventListener).call(
                e.detail.context,
                e
              );
            }
          }
        }
      }.bind(this) as EventListener
    );

    return this;
  }

  public dispatch(
    this: CanvasCamera,
    eventName: CanvasCameraEventName,
    context: CanvasCamera | CanvasCameraRenderer | CanvasCameraFrame,
    data?: CanvasCamera | CanvasCameraRenderer | CanvasCameraFrame
  ): CanvasCamera {
    const listenerName = (this.nativeClass + '-' + eventName).toLowerCase();
    const event = new CustomEvent(listenerName, {
      detail: {
        context,
        data,
      },
    });
    window.dispatchEvent(event);
    return this;
  }

  public initialize(
    fcanvas: HTMLCanvasElement | CanvasCameraCanvasElements,
    tcanvas?: HTMLCanvasElement
  ): CanvasCamera {
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
    return this;
  }

  public start(
    userOptions: CanvasCameraUserOptions,
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
  ): CanvasCamera {
    this.options = userOptions;
    this.setRenderingPresets();

    if (onSuccess && 'function' === typeof onSuccess) {
      this.onCapture = onSuccess;
    }

    this.enableRenderers();
    exec(
      this.capture.bind(this),
      (error: CanvasCameraData) => {
        this.disableRenderers();
        if (onError && 'function' === typeof onError) {
          onError(error);
        }
      },
      this.nativeClass,
      'startCapture',
      [this.options]
    );

    return this;
  }

  public stop(
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
  ): CanvasCamera {
    this.disableRenderers();
    exec(
      (data: CanvasCameraData) => {
        if (onSuccess && 'function' === typeof onSuccess) {
          onSuccess(data);
        }
      },
      (error: CanvasCameraData) => {
        if (onError && 'function' === typeof onError) {
          onError(error);
        }
      },
      this.nativeClass,
      'stopCapture',
      []
    );

    return this;
  }

  public flashMode(
    flashMode: boolean,
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
  ): CanvasCamera {
    exec(
      (data: CanvasCameraData) => {
        if (onSuccess && 'function' === typeof onSuccess) {
          onSuccess(data);
        }
      },
      (error: CanvasCameraData) => {
        if (onError && 'function' === typeof onError) {
          onError(error);
        }
      },
      this.nativeClass,
      'flashMode',
      [flashMode]
    );

    return this;
  }

  public cameraPosition(
    cameraFacing: CanvasCameraCameraFacing,
    onError?: CanvasCameraPluginResultCallbackFunction,
    onSuccess?: CanvasCameraPluginResultCallbackFunction
  ): CanvasCamera {
    this.disableRenderers();
    exec(
      (data: CanvasCameraData) => {
        this.enableRenderers();
        if (onSuccess && 'function' === typeof onSuccess) {
          onSuccess(data);
        }
      },
      (error: CanvasCameraData) => {
        if (onError && 'function' === typeof onError) {
          onError(error);
        }
      },
      this.nativeClass,
      'cameraPosition',
      [cameraFacing]
    );

    return this;
  }

  public capture(data: CanvasCameraData): CanvasCamera {
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

    if (this.onCapture && 'function' === typeof this.onCapture) {
      this.onCapture(data);
    }

    return this;
  }

  public createFrame(
    image: HTMLImageElement,
    element: HTMLCanvasElement,
    renderer: CanvasCameraRenderer
  ) {
    const frame = new CanvasCameraFrameImplementation(image, element, renderer);
    return frame.initialize();
  }

  public createRenderer(
    element: HTMLCanvasElement,
    canvasCamera: CanvasCamera
  ) {
    const renderer = new CanvasCameraRendererImplementation(
      element,
      canvasCamera
    );
    return renderer.initialize();
  }

  public enableRenderers(): CanvasCamera {
    if (this.canvas && 'object' === typeof this.canvas) {
      for (const renderer in this.canvas) {
        if (
          this.canvas.hasOwnProperty(renderer) &&
          this.canvas[renderer] instanceof CanvasCameraRendererImplementation
        ) {
          if (this.canvas[renderer]?.disabled()) {
            this.canvas[renderer]?.enable();
          }
        }
      }
    }
    return this;
  }

  public disableRenderers(): CanvasCamera {
    if (this.canvas && 'object' === typeof this.canvas) {
      for (const renderer in this.canvas) {
        if (
          this.canvas.hasOwnProperty(renderer) &&
          this.canvas[renderer] instanceof CanvasCameraRendererImplementation
        ) {
          if (this.canvas[renderer]?.enabled()) {
            this.canvas[renderer]?.disable();
          }
        }
      }
    }
    return this;
  }

  public setRenderingPresets(): CanvasCamera {
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
      'function' === typeof this.options.onBeforeDraw
    ) {
      if (this.canvas.fullsize) {
        this.canvas.fullsize.setOnBeforeDraw(this.options.onBeforeDraw);
      }
    }

    if (
      this.options.onAfterDraw &&
      'function' === typeof this.options.onAfterDraw
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

  public getUISize() {
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
        if ('portrait' === this.getUIOrientation()) {
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

  public getUIOrientation(): CanvasCameraOrientation {
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

  public setRenderersSize(size: CanvasCameraCanvasSize): CanvasCamera {
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
};

module.exports = CanvasCameraImplementation;
