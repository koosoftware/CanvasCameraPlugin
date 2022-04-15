declare const exec: any;
interface Window {
    Ionic?: any;
    CanvasCamera: CanvasCamera;
}
declare type CanvasCameraUISize = CanvasCameraCanvasSize;
declare type CanvasCameraUseImageAs = 'data' | 'file';
declare type CanvasCameraCameraFacing = 'front' | 'back';
declare type CanvasCameraPluginResultCallbackFunction = (data: CanvasCameraData) => void;
declare type CanvasCameraEventMethodName = 'beforeFrameRendering' | 'afterFrameRendering' | 'beforeFrameInitialization' | 'afterFrameInitialization' | 'beforeRenderingPresets' | 'afterRenderingPresets';
declare type CanvasCameraEventName = Lowercase<CanvasCameraEventMethodName>;
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
declare type CanvasCameraOrientation = 'portrait' | 'landscape';
declare type CanvasCameraEventListener = <D>(data: D) => void;
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
declare class CanvasCameraFrame {
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
    constructor(image: HTMLImageElement, element: HTMLCanvasElement, renderer: CanvasCameraRenderer);
    initialize(): this;
    recycle(): void;
}
declare class CanvasCameraRenderer {
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
    onAfterDraw: CanvasCameraEventListener | undefined;
    onBeforeDraw: CanvasCameraEventListener | undefined;
    constructor(element: HTMLCanvasElement, canvasCamera: CanvasCamera);
    initialize(): this;
    onOrientationChange(): void;
    clear(): this;
    draw(frame: CanvasCameraFrame): this;
    bufferize(data: CanvasCameraDataImage): this;
    run(): this;
    render(data: CanvasCameraDataImage): this;
    enable(): this;
    disable(): this;
    enabled(): boolean;
    disabled(): boolean;
    invert(): this;
    resize(): this;
    setSize(size: CanvasCameraCanvasSize, auto?: boolean): this;
    setOnBeforeDraw(onBeforeDraw: CanvasCameraEventListener): this;
    setOnAfterDraw(onAfterDraw: CanvasCameraEventListener): this;
}
declare abstract class CanvasCameraWithEvents {
    abstract beforeFrameRendering(listener: CanvasCameraEventListener): void;
    abstract afterFrameRendering(listener: CanvasCameraEventListener): void;
    abstract beforeFrameInitialization(listener: CanvasCameraEventListener): void;
    abstract afterFrameInitialization(listener: CanvasCameraEventListener): void;
    abstract beforeRenderingPresets(listener: CanvasCameraEventListener): void;
    abstract afterRenderingPresets(listener: CanvasCameraEventListener): void;
}
declare class CanvasCamera extends CanvasCameraWithEvents {
    static instance: CanvasCamera;
    onCapture: CanvasCameraEventListener | undefined;
    nativeClass: string;
    canvas: CanvasCameraRenderers;
    options: CanvasCameraUserOptions;
    constructor();
    static getInstance(): CanvasCamera;
    static initialize(fcanvas: HTMLCanvasElement | CanvasCameraCanvasElements, tcanvas?: HTMLCanvasElement): void;
    static start(userOptions: CanvasCameraUserOptions, onError?: CanvasCameraPluginResultCallbackFunction, onSuccess?: CanvasCameraPluginResultCallbackFunction): void;
    static stop(onError?: CanvasCameraPluginResultCallbackFunction, onSuccess?: CanvasCameraPluginResultCallbackFunction): void;
    static cameraPosition(cameraFacing: CanvasCameraCameraFacing, onError?: CanvasCameraPluginResultCallbackFunction, onSuccess?: CanvasCameraPluginResultCallbackFunction): void;
    static flashMode(flashMode: boolean, onError?: CanvasCameraPluginResultCallbackFunction, onSuccess?: CanvasCameraPluginResultCallbackFunction): void;
    beforeFrameRendering(listener: CanvasCameraEventListener): this;
    static beforeFrameRendering(listener: CanvasCameraEventListener): CanvasCamera;
    afterFrameRendering(listener: CanvasCameraEventListener): this;
    static afterFrameRendering(listener: CanvasCameraEventListener): CanvasCamera;
    beforeFrameInitialization(listener: CanvasCameraEventListener): this;
    static beforeFrameInitialization(listener: CanvasCameraEventListener): CanvasCamera;
    afterFrameInitialization(listener: CanvasCameraEventListener): this;
    static afterFrameInitialization(listener: CanvasCameraEventListener): CanvasCamera;
    beforeRenderingPresets(listener: CanvasCameraEventListener): this;
    static beforeRenderingPresets(listener: CanvasCameraEventListener): CanvasCamera;
    afterRenderingPresets(listener: CanvasCameraEventListener): this;
    static afterRenderingPresets(listener: CanvasCameraEventListener): CanvasCamera;
    private triggerEvent;
    dispatch(this: CanvasCamera, eventName: CanvasCameraEventName, context: CanvasCamera | CanvasCameraRenderer | CanvasCameraFrame, data?: CanvasCamera | CanvasCameraRenderer | CanvasCameraFrame): void;
    initialize(fcanvas: HTMLCanvasElement | CanvasCameraCanvasElements, tcanvas?: HTMLCanvasElement): void;
    start(userOptions: CanvasCameraUserOptions, onError?: CanvasCameraPluginResultCallbackFunction, onSuccess?: CanvasCameraPluginResultCallbackFunction): void;
    stop(onError?: CanvasCameraPluginResultCallbackFunction, onSuccess?: CanvasCameraPluginResultCallbackFunction): void;
    flashMode(flashMode: boolean, onError?: CanvasCameraPluginResultCallbackFunction, onSuccess?: CanvasCameraPluginResultCallbackFunction): void;
    cameraPosition(cameraFacing: CanvasCameraCameraFacing, onError?: CanvasCameraPluginResultCallbackFunction, onSuccess?: CanvasCameraPluginResultCallbackFunction): void;
    capture(data: CanvasCameraData): void;
    createFrame(image: HTMLImageElement, element: HTMLCanvasElement, renderer: CanvasCameraRenderer): CanvasCameraFrame;
    createRenderer(element: HTMLCanvasElement, canvasCamera: CanvasCamera): CanvasCameraRenderer;
    enableRenderers(): void;
    disableRenderers(): void;
    setRenderingPresets(): this;
    getUISize(): CanvasCameraCanvasSize;
    getUIOrientation(): CanvasCameraOrientation;
    setRenderersSize(size: CanvasCameraCanvasSize): this;
}
//# sourceMappingURL=canvascamera.d.ts.map