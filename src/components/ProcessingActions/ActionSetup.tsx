import {
    Base64Decoder,
    Base64Encoder,
    ConfigureBase64,
    EnsureB64Config,
    SummarizeBase64
} from "./encoding/Base64";
import {
    ConfigureQueryJSON,
    EnsureQueryDataConfig,
    QueryJQ,
    QueryObject,
    SummarizeQueryJSON
} from "./query/QueryData";
import {
    ConfigureFormatting,
    ConfigureFormattingIndent,
    EnsureFormattingConfig,
    FormatJSON,
    FormatXML,
    FormatYAML,
    SummarizeFormatting
} from "./formatting/Format";
import {StringToLower, StringToUpper} from "./strings/Strings";
import {ActionGroup, AvailableAction} from "./ActionModels";
import {URLEncoder} from "./encoding/URL";
import {
    ConfigureRegexReplace,
    EnsureRegexConfig,
    RegexReplace,
    SummarizeRegexReplace
} from "./regex/Regex";
import {
    ParseJSON,
    ParseXML,
    ParseYAML
} from "./parsing/Common";
import {ParseJWT} from "./parsing/JWT";
import {ActionCode} from "../AppConfig/model";

export const AVAILABLE_ACTION_GROUPS:ActionGroup[] = []
export const AVAILABLE_ACTIONS:Record<string, AvailableAction> = {}

const addActionGroup = (label:string) => {
    AVAILABLE_ACTION_GROUPS.push({
        label: label,
        codes: []
    })
}

const registerAvailableAction = (action:AvailableAction) => {
    if(action.code in AVAILABLE_ACTIONS) {
        throw "available action setup is invalid, duplicate function: " + action.code
    }
    AVAILABLE_ACTIONS[action.code] = action
    const g = AVAILABLE_ACTION_GROUPS[AVAILABLE_ACTION_GROUPS.length-1]
    g.codes.push(action.code)
}

// ======================================================================================================= ENCODING

addActionGroup("Encoding")
registerAvailableAction({
    code: ActionCode.ENCODE_BASE64,
    label: "Base64 - Encode",
    processor: Base64Encoder,
    initConfig: EnsureB64Config,
    editPanel: ConfigureBase64,
    summaryPanel: SummarizeBase64,
})
registerAvailableAction({
    code: ActionCode.DECODE_BASE64,
    label: "Base64 - Decode",
    processor: Base64Decoder,
    initConfig: EnsureB64Config,
    editPanel: ConfigureBase64,
    summaryPanel: SummarizeBase64,
})
registerAvailableAction({
    code: ActionCode.ENCODE_URL,
    label: "URL - Encode",
    processor: URLEncoder,
})
registerAvailableAction({
    code: ActionCode.DECODE_URL,
    label: "URL - Decode",
    processor: URLEncoder,
})

// ======================================================================================================= Query Data

addActionGroup("Data Structures")
registerAvailableAction({
    code: ActionCode.QUERY_JQ,
    label: "JQ",
    processor: QueryJQ,
    initConfig: EnsureQueryDataConfig,
    editPanel: ConfigureQueryJSON,
    summaryPanel: SummarizeQueryJSON,
})
registerAvailableAction({
    code: ActionCode.QUERY_OBJECT,
    label: "Query Object Path",
    processor: QueryObject,
    initConfig: EnsureQueryDataConfig,
    editPanel: ConfigureQueryJSON,
    summaryPanel: SummarizeQueryJSON,
})

// ======================================================================================================= Formatting

addActionGroup("Parsing")
registerAvailableAction({
    code: ActionCode.PARSE_JSON,
    label: "Parse JSON",
    processor: ParseJSON,
})
registerAvailableAction({
    code: ActionCode.PARSE_YAML,
    label: "Parse YAML",
    processor: ParseYAML,
})
registerAvailableAction({
    code: ActionCode.PARSE_XML,
    label: "Parse XML",
    processor: ParseXML,
})
registerAvailableAction({
    code: ActionCode.PARSE_JWT,
    label: "Parse JWT",
    processor: ParseJWT,
})

// ======================================================================================================= Formatting

addActionGroup("Pretty Print")
registerAvailableAction({
    code: ActionCode.FORMAT_JSON,
    label: "Format JSON",
    processor: FormatJSON,
    initConfig: EnsureFormattingConfig,
    editPanel: ConfigureFormatting,
    summaryPanel: SummarizeFormatting,
})
registerAvailableAction({
    code: ActionCode.FORMAT_YAML,
    label: "Format YAML",
    processor: FormatYAML,
    initConfig: EnsureFormattingConfig,
    editPanel: ConfigureFormatting,
    summaryPanel: SummarizeFormatting,
})
registerAvailableAction({
    code: ActionCode.FORMAT_XML,
    label: "Format XML",
    processor: FormatXML,
    initConfig: EnsureFormattingConfig,
    editPanel: ConfigureFormattingIndent,
    summaryPanel: SummarizeFormatting,
})

// ======================================================================================================= Strings

addActionGroup("Strings")
registerAvailableAction({
    code: ActionCode.REGEX_REPLACE,
    label: "Regex Replace",
    processor: RegexReplace,
    initConfig: EnsureRegexConfig,
    editPanel: ConfigureRegexReplace,
    summaryPanel: SummarizeRegexReplace,
})
registerAvailableAction({
    code: ActionCode.STRING_TO_UPPER,
    label: "To Uppercase",
    processor: StringToUpper,
})
registerAvailableAction({
    code: ActionCode.STRING_TO_LOWER,
    label: "To Lowercase",
    processor: StringToLower,
})