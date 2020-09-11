import _logger from "electron-log";
import sanitizeHtml from "sanitize-html";
import {BrowserWindow} from "electron";

import {Context} from "src/electron-main/model";
import {DEFAULT_WEB_PREFERENCES} from "./constants";
import {
    PACKAGE_DESCRIPTION,
    PACKAGE_GITHUB_PROJECT_URL,
    PACKAGE_LICENSE,
    PACKAGE_VERSION,
    PRODUCT_NAME,
    WEB_CHUNK_NAMES,
    WEB_PROTOCOL_SCHEME,
    ZOOM_FACTOR_DEFAULT,
} from "src/shared/constants";
import {curryFunctionMembers} from "src/shared/util";
import {injectVendorsAppCssIntoHtmlFile} from "src/electron-main/util";

const logger = curryFunctionMembers(_logger, "[src/electron-main/window/about]");

const resolveContent: (ctx: Context) => Promise<Unpacked<ReturnType<typeof injectVendorsAppCssIntoHtmlFile>>> = (
    (): typeof resolveContent => {
        let result: typeof resolveContent = async (ctx: Context) => {
            const jsonData = await import("./about.json");
            const htmlInjection: string = [
                sanitizeHtml(
                    `
                    <h1>
                        ${PRODUCT_NAME} v${PACKAGE_VERSION}
                        <sup style="top: -1em; font-size: 50%;">
                            <a href="${PACKAGE_GITHUB_PROJECT_URL}/commit/${jsonData.commit}">
                                ${jsonData.branch}:${jsonData.commitShort}
                            </a>
                        </sup>
                    </h1>
                    <p>${PACKAGE_DESCRIPTION}</p>
                    <p>Distributed under ${PACKAGE_LICENSE} license.</p>
                    `,
                    {
                        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "sup"]),
                        allowedAttributes: {
                            a: ["href"],
                            sup: ["style"],
                        },
                    },
                ),
                ((): string => {
                    const {versions} = process;
                    const props: ReadonlyArray<Readonly<{ prop: keyof typeof versions; title: string }>> = [
                        {prop: "electron", title: "Electron"},
                        {prop: "chrome", title: "Chromium"},
                        {prop: "node", title: "Node"},
                        {prop: "v8", title: "V8"},
                    ];
                    return `
                        <ul class="list-versions align-items-left justify-content-center font-weight-light text-muted">
                            ${props.map(({prop, title}) => sanitizeHtml(`<li>${title}: ${versions[prop]}</li>`)).join("")}
                        </ul>
                    `;
                })(),
            ].join("");
            const pageLocation = ctx.locations.aboutBrowserWindowPage;
            const cache = await injectVendorsAppCssIntoHtmlFile(pageLocation, ctx.locations);

            cache.html = cache.html.replace(
                /(.*)#MAIN_PROCESS_INJECTION_POINTCUT#(.*)/i,
                `$1${htmlInjection}$2`,
            );
            if (!cache.html.includes(htmlInjection)) {
                logger.error(JSON.stringify({cache}));
                throw new Error(`Failed to inject "${htmlInjection}" into the "${pageLocation}" page`);
            }
            logger.verbose(JSON.stringify(cache));

            // memoize the result
            result = async (): Promise<typeof cache> => cache;

            return cache;
        };
        return result;
    }
)();

export async function showAboutBrowserWindow(ctx: Context): Promise<BrowserWindow> {
    if (!ctx.uiContext) {
        throw new Error(`UI Context has not been initialized`);
    }

    const {aboutBrowserWindow: exitingBrowserWindow} = ctx.uiContext;

    if (exitingBrowserWindow && !exitingBrowserWindow.isDestroyed()) {
        exitingBrowserWindow.center();
        exitingBrowserWindow.show();
        exitingBrowserWindow.focus();
        return exitingBrowserWindow;
    }

    const {zoomFactor} = await ctx.configStore.readExisting();
    const windowSizeFactor = zoomFactor > 1 && zoomFactor < 3
        ? zoomFactor
        : 1;
    const browserWindow = new BrowserWindow({
        title: `About ${PRODUCT_NAME}`,
        center: true,
        modal: true,
        autoHideMenuBar: true,
        show: false,
        width: 650 * windowSizeFactor,
        height: 500 * windowSizeFactor,
        webPreferences: {
            ...DEFAULT_WEB_PREFERENCES,
            preload: ctx.locations.preload.aboutBrowserWindow,
            ...(zoomFactor !== ZOOM_FACTOR_DEFAULT && {zoomFactor}),
        },
    });

    browserWindow.on("closed", () => {
        if (!ctx.uiContext) {
            return;
        }
        delete ctx.uiContext.aboutBrowserWindow;
    });

    ctx.uiContext.aboutBrowserWindow = browserWindow;

    browserWindow.show();
    browserWindow.focus();

    const {html} = await resolveContent(ctx);

    await browserWindow.webContents.loadURL(
        `data:text/html,${html}`,
        {baseURLForDataURL: `${WEB_PROTOCOL_SCHEME}:/${WEB_CHUNK_NAMES.about}/`},
    );

    if (BUILD_ENVIRONMENT === "development") {
        browserWindow.webContents.openDevTools();
    }

    return browserWindow;
}
