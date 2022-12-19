import {
    ACTION_CODE_B64_DECODE,
    ACTION_CODE_B64_ENCODE,
    Base64Decoder,
    Base64Encoder,
    ConfigureBase64, EnsureB64Config, SummarizeBase64, SUPPLY_DEFAULT_B64_CONFIG
} from "./encoding/Base64";
import {
    ACTION_CODE_QUERY_OBJ,
    ConfigureQueryJSON,
    EnsureQueryDataConfig,
    QueryObject,
    SummarizeQueryJSON
} from "./query/QueryData";
import {
    ACTION_CODE_FORMAT_JSON, ACTION_CODE_FORMAT_YAML, ACTION_CODE_PARSE_JSON, ACTION_CODE_PARSE_YAML,
    ConfigureFormatting, EnsureFormattingConfig,
    FormatJSON,
    FormatYAML, ParseJSON, ParseYAML,
    SummarizeFormatting
} from "./formatting/Format";
import {ACTION_CODE_STRINGS_LOWER, ACTION_CODE_STRINGS_UPPER, StringToLower, StringToUpper} from "./strings/Strings";
import {ActionGroup, AvailableAction, ProcessorConfig} from "./ActionModels";
import {ACTION_CODE_URL_DECODE, ACTION_CODE_URL_ENCODE, URLEncoder} from "./encoding/URL";
import {
    ACTION_CODE_REGEX_REPLACE,
    ConfigureRegexReplace,
    EnsureRegexConfig,
    RegexReplace,
    SummarizeRegexReplace
} from "./regex/Regex";

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
        throw "available action setup is invalid, duplicate code: " + action.code
    }
    AVAILABLE_ACTIONS[action.code] = action
    const g = AVAILABLE_ACTION_GROUPS[AVAILABLE_ACTION_GROUPS.length-1]
    g.codes.push(action.code)
}

// ======================================================================================================= ENCODING

addActionGroup("Encoding")
registerAvailableAction({
    code: ACTION_CODE_B64_ENCODE,
    label: "Base64 - Encode",
    processor: Base64Encoder,
    initConfig: EnsureB64Config,
    editPanel: ConfigureBase64,
    summaryPanel: SummarizeBase64,
})
registerAvailableAction({
    code: ACTION_CODE_B64_DECODE,
    label: "Base64 - Decode",
    processor: Base64Decoder,
    initConfig: EnsureB64Config,
    editPanel: ConfigureBase64,
    summaryPanel: SummarizeBase64,
})
registerAvailableAction({
    code: ACTION_CODE_URL_ENCODE,
    label: "URL - Encode",
    processor: URLEncoder,
})
registerAvailableAction({
    code: ACTION_CODE_URL_DECODE,
    label: "URL - Decode",
    processor: URLEncoder,
})

// ======================================================================================================= Query Data

addActionGroup("Data Structures")
registerAvailableAction({
    code: ACTION_CODE_QUERY_OBJ,
    label: "Query Object Path",
    processor: QueryObject,
    initConfig: EnsureQueryDataConfig,
    editPanel: ConfigureQueryJSON,
    summaryPanel: SummarizeQueryJSON,
})

// ======================================================================================================= Formatting

addActionGroup("Parsing")
registerAvailableAction({
    code: ACTION_CODE_PARSE_JSON,
    label: "Parse JSON",
    processor: ParseJSON,
})
registerAvailableAction({
    code: ACTION_CODE_PARSE_YAML,
    label: "Parse YAML",
    processor: ParseYAML,
})

// ======================================================================================================= Formatting

addActionGroup("Pretty Print")
registerAvailableAction({
    code: ACTION_CODE_FORMAT_JSON,
    label: "Format JSON",
    processor: FormatJSON,
    initConfig: EnsureFormattingConfig,
    editPanel: ConfigureFormatting,
    summaryPanel: SummarizeFormatting,
})
registerAvailableAction({
    code: ACTION_CODE_FORMAT_YAML,
    label: "Format YAML",
    processor: FormatYAML,
    initConfig: EnsureFormattingConfig,
    editPanel: ConfigureFormatting,
    summaryPanel: SummarizeFormatting,
})

// ======================================================================================================= Strings

addActionGroup("Strings")
registerAvailableAction({
    code: ACTION_CODE_REGEX_REPLACE,
    label: "Regex Replace",
    processor: RegexReplace,
    initConfig: EnsureRegexConfig,
    editPanel: ConfigureRegexReplace,
    summaryPanel: SummarizeRegexReplace,
})
registerAvailableAction({
    code: ACTION_CODE_STRINGS_UPPER,
    label: "To Uppercase",
    processor: StringToUpper,
})
registerAvailableAction({
    code: ACTION_CODE_STRINGS_LOWER,
    label: "To Lowercase",
    processor: StringToLower,
})