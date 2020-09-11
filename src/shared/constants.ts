import {EntryUrlItem, LogLevel} from "./model/common";
import {
    description as PACKAGE_DESCRIPTION,
    homepage as PACKAGE_GITHUB_PROJECT_URL,
    license as PACKAGE_LICENSE,
    name as PACKAGE_NAME,
    version as PACKAGE_VERSION,
} from "package.json";

export const PRODUCT_NAME = "ElectronMail";

export const REPOSITORY_NAME = PRODUCT_NAME;

export const BINARY_NAME = PACKAGE_NAME;

export {
    PACKAGE_NAME,
    PACKAGE_VERSION,
    PACKAGE_LICENSE,
    PACKAGE_DESCRIPTION,
    PACKAGE_GITHUB_PROJECT_URL,
};

export const VIRTUAL_UNREAD_FOLDER_TYPE = `${PRODUCT_NAME}_VIRTUAL_UNREAD_`;

// user data dir, defaults to app.getPath("userData")
export const RUNTIME_ENV_USER_DATA_DIR = `ELECTRON_MAIL_USER_DATA_DIR`;

// boolean
export const RUNTIME_ENV_E2E = `ELECTRON_MAIL_E2E`;

export const ONE_SECOND_MS = 1000;

export const ONE_MINUTE_MS = ONE_SECOND_MS * 60;

export const DEFAULT_API_CALL_TIMEOUT = ONE_SECOND_MS * 25;

export const DEFAULT_TRAY_ICON_COLOR = "#1ca48c"; // src/assets/icon/icon.png dominant color

export const DEFAULT_UNREAD_BADGE_BG_COLOR = "#de4251";

export const DEFAULT_UNREAD_BADGE_BG_TEXT = "#ffffff";

export const DEFAULT_MESSAGES_STORE_PORTION_SIZE = 500;

export const APP_EXEC_PATH_RELATIVE_HUNSPELL_DIR = "./usr/share/hunspell";

export const UPDATE_CHECK_FETCH_TIMEOUT = ONE_SECOND_MS * 10;

export const WEB_CHUNK_NAMES = {
    "about": "about",
    "browser-window": "browser-window",
    "search-in-page-browser-view": "search-in-page-browser-view",
} as const;

export const PROVIDER_REPOS: DeepReadonly<Record<"WebClient" | "proton-mail-settings" | "proton-contacts" | "proton-calendar",
    {
        repoRelativeDistDir: string;
        baseDir: string;
        repo: string;
        version: string;
        commit: string;
        protonPackAppConfig: {
            clientId: string;
        };
        i18nEnvVars: {
            I18N_DEPENDENCY_REPO: "https://github.com/ProtonMail/proton-translations.git";
            I18N_DEPENDENCY_BRANCH: string;
            I18N_DEPENDENCY_BRANCH_V4?: string;
        };
    }>> = {
    "WebClient": {
        repoRelativeDistDir: "./build",
        baseDir: "", // TODO define model as {baseDir?: string} instead of using empty string value
        repo: "https://github.com/ProtonMail/WebClient.git",
        commit: "0912dff240dde923de91ed8c7d42e7ff3151259d",
        version: "4.0.0-beta20",
        protonPackAppConfig: {
            // TODO proton-v4: make sure this value comes to the build after 4.0.0-beta7+ update
            //      currently it's hadrcoded in the WebClient code
            clientId: "Web",
        },
        // "proton-i18n" project requires some env vars to be set
        // see https://github.com/ProtonMail/WebClient/issues/176#issuecomment-595111186
        i18nEnvVars: {
            I18N_DEPENDENCY_REPO: "https://github.com/ProtonMail/proton-translations.git",
            I18N_DEPENDENCY_BRANCH: "webmail",
            I18N_DEPENDENCY_BRANCH_V4: "webmail-v4",
        },
    },
    "proton-mail-settings": {
        repoRelativeDistDir: "./dist",
        baseDir: "settings",
        repo: "https://github.com/ProtonMail/proton-mail-settings.git",
        commit: "577f7513646dcf5923b7edfd5aeade36bac2fb69",
        version: "4.0.0-beta.10",
        protonPackAppConfig: {
            clientId: "WebMailSettings",
        },
        i18nEnvVars: {
            I18N_DEPENDENCY_REPO: "https://github.com/ProtonMail/proton-translations.git",
            I18N_DEPENDENCY_BRANCH: "fe-mail-settings",
        },
    },
    "proton-contacts": {
        repoRelativeDistDir: "./dist",
        baseDir: "contacts",
        repo: "https://github.com/ProtonMail/proton-contacts.git",
        commit: "462ff64106b752a06ca19b32413c012579f4b85c",
        version: "4.0.0-beta.13",
        protonPackAppConfig: {
            clientId: "WebContacts",
        },
        i18nEnvVars: {
            I18N_DEPENDENCY_REPO: "https://github.com/ProtonMail/proton-translations.git",
            I18N_DEPENDENCY_BRANCH: "fe-contacts",
        },
    },
    "proton-calendar": {
        repoRelativeDistDir: "./dist",
        baseDir: "calendar",
        repo: "https://github.com/ProtonMail/proton-calendar.git",
        commit: "f0878b3034e281df3c22f2b940f19886bb7c65de",
        version: "4.0.0-beta.7",
        protonPackAppConfig: {
            clientId: "WebCalendar",
        },
        i18nEnvVars: {
            I18N_DEPENDENCY_REPO: "https://github.com/ProtonMail/proton-translations.git",
            I18N_DEPENDENCY_BRANCH: "fe-calendar",
        },
    },
};

export const LOCAL_WEBCLIENT_PROTOCOL_PREFIX = "webclient";

export const LOCAL_WEBCLIENT_PROTOCOL_RE_PATTERN = `${LOCAL_WEBCLIENT_PROTOCOL_PREFIX}[\\d]+`;

export const PROTON_API_ENTRY_VALUE_PREFIX = "local:::";

export const PROTON_API_ENTRY_PRIMARY_VALUE = "https://mail.protonmail.com";

function getBuiltInWebClientTitle(): string {
    return `${PROVIDER_REPOS.WebClient.version} / ${PROVIDER_REPOS.WebClient.commit.substr(0, 7)}`;
}

export const PROTON_API_ENTRY_RECORDS: DeepReadonly<EntryUrlItem[]> = [
    {
        value: PROTON_API_ENTRY_PRIMARY_VALUE,
        title: `${PROTON_API_ENTRY_PRIMARY_VALUE} (${getBuiltInWebClientTitle()})`,
    },
    {
        value: "https://app.protonmail.ch",
        title: `https://app.protonmail.ch (${getBuiltInWebClientTitle()})`,
    },
    {
        value: "https://protonirockerxow.onion",
        title: `https://protonirockerxow.onion (${getBuiltInWebClientTitle()})`,
    },
];

export const PROTON_API_ENTRY_URLS = PROTON_API_ENTRY_RECORDS.map(({value: url}) => url);

// export const PROTON_API_ENTRY_ORIGINS = PROTON_API_ENTRY_URLS.map((url) => new URL(url).origin);

export const WEB_CLIENTS_BLANK_HTML_FILE_NAME = "blank.html";

export const LOG_LEVELS: Readonly<LogLevel[]> = Object.keys(
    ((stub: Record<LogLevel, null>) => stub)({ // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
        error: null,
        warn: null,
        info: null,
        verbose: null,
        debug: null,
        silly: null,
    }),
) as Readonly<LogLevel[]>;

export const ZOOM_FACTOR_DEFAULT = 1;

export const ZOOM_FACTORS: ReadonlyArray<number> = [
    0.5,
    0.55,
    0.6,
    0.65,
    0.7,
    0.75,
    0.8,
    0.85,
    0.9,
    0.95,
    ZOOM_FACTOR_DEFAULT,
    1.05,
    1.1,
    1.15,
    1.2,
    1.25,
    1.3,
    1.35,
    1.4,
    1.45,
    1.5,
    1.6,
    1.7,
    1.8,
    1.9,
    2,
];

export const LAYOUT_MODES = [
    {value: "top", title: "top"},
    {value: "left", title: "left"},
    {value: "left-thin", title: "left (thin)"},
] as const;

export const WEB_VIEW_SESSION_STORAGE_KEY_SKIP_LOGIN_DELAYS = "ELECTRON_MAIL_SKIP_LOGIN_DELAYS";

// TODO electron: get rid of "baseURLForDataURL" workaround, see https://github.com/electron/electron/issues/20700
export const WEB_PROTOCOL_SCHEME = "web";
