declare const exec: any;
interface Window {
    Ionic?: any;
    CanvasCamera: CanvasCamera;
}
declare type UISize = CanvasSize;
declare type UseImageAs = 'data' | 'file';
declare type CameraFacing = 'front' | 'back';
declare type PluginResultCallbackFunction = (data: CanvasCameraData) => void;
declare type CanvasCameraEventMethodName = 'beforeFrameRendering' | 'afterFrameRendering' | 'beforeFrameInitialization' | 'afterFrameInitialization' | 'beforeRenderingPresets' | 'afterRenderingPresets';
declare type CanvasCameraEventName = Lowercase<CanvasCameraEventMethodName>;
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
declare type Orientation = 'portrait' | 'landscape';
declare type CallbackFunction = (data: any) => void;
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
declare class Frame {
    ratio: number;
    sx: number;
    sy: number;
    sWidth: number;
    sHeight: number;
    dx: number;
    dy: number;
    dWidth: number;
    dHeight: number;
    renderer: Renderer;
    image: HTMLImageElement;
    element: HTMLCanvasElement;
    constructor(image: HTMLImageElement, element: HTMLCanvasElement, renderer: Renderer);
    initialize(): this;
    recycle(): void;
}
declare class Renderer {
    data: CanvasCameraDataImage | undefined;
    size: CanvasSize | undefined;
    image: HTMLImageElement | undefined;
    context: CanvasRenderingContext2D | undefined | null;
    orientation: Orientation | undefined;
    buffer: CanvasCameraDataImage[];
    available: boolean;
    fullscreen: boolean;
    element: HTMLCanvasElement;
    canvasCamera: CanvasCamera;
    onAfterDraw: CallbackFunction;
    onBeforeDraw: CallbackFunction;
    constructor(element: HTMLCanvasElement, canvasCamera: CanvasCamera);
    initialize(): this;
    onOrientationChange(): void;
    clear(): this;
    draw(frame: Frame): this;
    bufferize(data: CanvasCameraDataImage): this;
    run(): this;
    render(data: CanvasCameraDataImage | undefined): this;
    enable(): this;
    disable(): this;
    enabled(): boolean;
    disabled(): boolean;
    invert(): this;
    resize(): this;
    setSize(size: CanvasSize, auto?: boolean): this;
    setOnBeforeDraw(onBeforeDraw: CallbackFunction): this;
    setOnAfterDraw(onAfterDraw: CallbackFunction): this;
}
declare function withEvents(constructor: Function): void;
declare class CanvasCamera {
    onCapture: CallbackFunction | null;
    nativeClass: string;
    canvas: Renderers;
    options: CanvasCameraUserOptions;
    constructor();
    dispatch(this: CanvasCamera, eventName: CanvasCameraEventName, caller: CanvasCamera | Renderer | Frame, frame?: Frame): void;
    initialize(fcanvas: HTMLCanvasElement | CanvasElements, tcanvas?: HTMLCanvasElement): void;
    start(userOptions: CanvasCameraUserOptions, onError?: PluginResultCallbackFunction, onSuccess?: PluginResultCallbackFunction): void;
    stop(onError?: PluginResultCallbackFunction, onSuccess?: PluginResultCallbackFunction): void;
    flashMode(flashMode: boolean, onError?: PluginResultCallbackFunction, onSuccess?: PluginResultCallbackFunction): void;
    cameraPosition(cameraFacing: CameraFacing, onError?: PluginResultCallbackFunction, onSuccess?: PluginResultCallbackFunction): void;
    capture(data: CanvasCameraData): void;
    createFrame(image: HTMLImageElement, element: HTMLCanvasElement, renderer: Renderer): Frame;
    createRenderer(element: HTMLCanvasElement, canvasCamera: CanvasCamera): Renderer;
    enableRenderers(): void;
    disableRenderers(): void;
    setRenderingPresets(): this;
    getUISize(): CanvasSize;
    getUIOrientation(): Orientation;
    setRenderersSize(size: CanvasSize): this;
}
//# sourceMappingURL=canvascamera.d.ts.map