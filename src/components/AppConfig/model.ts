// @generated by protobuf-ts 2.8.2
// @generated from protobuf file "model.proto" (syntax proto3)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MESSAGE_TYPE } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message AppConfig
 */
export interface AppConfig {
    /**
     * @generated from protobuf field: bool autoProcess = 1;
     */
    autoProcess: boolean;
    /**
     * @generated from protobuf field: repeated ActionInstance actions = 2;
     */
    actions: ActionInstance[];
    /**
     * @generated from protobuf field: bool zoomed = 3;
     */
    zoomed: boolean;
}
/**
 * @generated from protobuf message ActionInstance
 */
export interface ActionInstance {
    /**
     * @generated from protobuf field: ActionCode code = 1;
     */
    code: ActionCode;
    /**
     * @generated from protobuf field: ProcessorConfig config = 2;
     */
    config?: ProcessorConfig;
    /**
     * @generated from protobuf field: bool editing = 10;
     */
    editing: boolean;
}
/**
 * @generated from protobuf message ProcessorConfig
 */
export interface ProcessorConfig {
    /**
     * @generated from protobuf field: optional Base64Config base64 = 10;
     */
    base64?: Base64Config;
    /**
     * @generated from protobuf field: optional FormattingConfig formatting = 11;
     */
    formatting?: FormattingConfig;
    /**
     * @generated from protobuf field: optional QueryDataConfig queryData = 12;
     */
    queryData?: QueryDataConfig;
    /**
     * @generated from protobuf field: optional RegexConfig regex = 13;
     */
    regex?: RegexConfig;
    /**
     * @generated from protobuf field: optional StringConfig string = 14;
     */
    string?: StringConfig;
    /**
     * @generated from protobuf field: optional CompressionConfig compression = 15;
     */
    compression?: CompressionConfig;
}
/**
 * @generated from protobuf message Base64Config
 */
export interface Base64Config {
    /**
     * @generated from protobuf field: bool urlSafe = 1;
     */
    urlSafe: boolean;
    /**
     * @generated from protobuf field: bool stripPadding = 2;
     */
    stripPadding: boolean;
    /**
     * @generated from protobuf field: DataType output = 3;
     */
    output: DataType;
}
/**
 * @generated from protobuf message FormattingConfig
 */
export interface FormattingConfig {
    /**
     * @generated from protobuf field: int32 indentDepth = 1;
     */
    indentDepth: number;
    /**
     * @generated from protobuf field: bool sortKeys = 2;
     */
    sortKeys: boolean;
}
/**
 * @generated from protobuf message QueryDataConfig
 */
export interface QueryDataConfig {
    /**
     * @generated from protobuf field: string query = 1;
     */
    query: string;
}
/**
 * @generated from protobuf message RegexConfig
 */
export interface RegexConfig {
    /**
     * @generated from protobuf field: string pattern = 1;
     */
    pattern: string;
    /**
     * @generated from protobuf field: string replacement = 2;
     */
    replacement: string;
}
/**
 * @generated from protobuf message StringConfig
 */
export interface StringConfig {
    /**
     * @generated from protobuf field: string quoteCharacter = 1;
     */
    quoteCharacter: string;
}
/**
 * @generated from protobuf message CompressionConfig
 */
export interface CompressionConfig {
    /**
     * @generated from protobuf field: DataType output = 1;
     */
    output: DataType;
}
/**
 * @generated from protobuf enum ActionCode
 */
export enum ActionCode {
    /**
     * @generated from protobuf enum value: UNSET_ACTION_CODE = 0;
     */
    UNSET_ACTION_CODE = 0,
    /**
     * @generated from protobuf enum value: ENCODE_BASE64 = 1;
     */
    ENCODE_BASE64 = 1,
    /**
     * @generated from protobuf enum value: ENCODE_URL = 2;
     */
    ENCODE_URL = 2,
    /**
     * @generated from protobuf enum value: DECODE_BASE64 = 11;
     */
    DECODE_BASE64 = 11,
    /**
     * @generated from protobuf enum value: DECODE_URL = 12;
     */
    DECODE_URL = 12,
    /**
     * @generated from protobuf enum value: FORMAT_JSON = 21;
     */
    FORMAT_JSON = 21,
    /**
     * @generated from protobuf enum value: FORMAT_YAML = 22;
     */
    FORMAT_YAML = 22,
    /**
     * @generated from protobuf enum value: FORMAT_XML = 23;
     */
    FORMAT_XML = 23,
    /**
     * @generated from protobuf enum value: PARSE_JSON = 31;
     */
    PARSE_JSON = 31,
    /**
     * @generated from protobuf enum value: PARSE_YAML = 32;
     */
    PARSE_YAML = 32,
    /**
     * @generated from protobuf enum value: PARSE_XML = 33;
     */
    PARSE_XML = 33,
    /**
     * @generated from protobuf enum value: PARSE_JWT = 34;
     */
    PARSE_JWT = 34,
    /**
     * @generated from protobuf enum value: QUERY_OBJECT = 41;
     */
    QUERY_OBJECT = 41,
    /**
     * @generated from protobuf enum value: QUERY_JQ = 42;
     */
    QUERY_JQ = 42,
    /**
     * @generated from protobuf enum value: REGEX_REPLACE = 51;
     */
    REGEX_REPLACE = 51,
    /**
     * @generated from protobuf enum value: STRING_TO_UPPER = 61;
     */
    STRING_TO_UPPER = 61,
    /**
     * @generated from protobuf enum value: STRING_TO_LOWER = 62;
     */
    STRING_TO_LOWER = 62,
    /**
     * @generated from protobuf enum value: ESCAPE_STRING = 71;
     */
    ESCAPE_STRING = 71,
    /**
     * @generated from protobuf enum value: UNESCAPE_STRING = 81;
     */
    UNESCAPE_STRING = 81,
    /**
     * @generated from protobuf enum value: DECOMPRESS = 91;
     */
    DECOMPRESS = 91,
    /**
     * @generated from protobuf enum value: COMPRESS_GZIP = 101;
     */
    COMPRESS_GZIP = 101
}
/**
 * @generated from protobuf enum DataType
 */
export enum DataType {
    /**
     * @generated from protobuf enum value: UNSET_DATA_TYPE = 0;
     */
    UNSET_DATA_TYPE = 0,
    /**
     * @generated from protobuf enum value: STRING = 1;
     */
    STRING = 1,
    /**
     * @generated from protobuf enum value: OBJECT = 2;
     */
    OBJECT = 2,
    /**
     * @generated from protobuf enum value: BINARY = 3;
     */
    BINARY = 3
}
// @generated message type with reflection information, may provide speed optimized methods
class AppConfig$Type extends MessageType<AppConfig> {
    constructor() {
        super("AppConfig", [
            { no: 1, name: "autoProcess", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "actions", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => ActionInstance },
            { no: 3, name: "zoomed", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value?: PartialMessage<AppConfig>): AppConfig {
        const message = { autoProcess: false, actions: [], zoomed: false };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<AppConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AppConfig): AppConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bool autoProcess */ 1:
                    message.autoProcess = reader.bool();
                    break;
                case /* repeated ActionInstance actions */ 2:
                    message.actions.push(ActionInstance.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* bool zoomed */ 3:
                    message.zoomed = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: AppConfig, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* bool autoProcess = 1; */
        if (message.autoProcess !== false)
            writer.tag(1, WireType.Varint).bool(message.autoProcess);
        /* repeated ActionInstance actions = 2; */
        for (let i = 0; i < message.actions.length; i++)
            ActionInstance.internalBinaryWrite(message.actions[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* bool zoomed = 3; */
        if (message.zoomed !== false)
            writer.tag(3, WireType.Varint).bool(message.zoomed);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message AppConfig
 */
export const AppConfig = new AppConfig$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ActionInstance$Type extends MessageType<ActionInstance> {
    constructor() {
        super("ActionInstance", [
            { no: 1, name: "code", kind: "enum", T: () => ["ActionCode", ActionCode] },
            { no: 2, name: "config", kind: "message", T: () => ProcessorConfig },
            { no: 10, name: "editing", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value?: PartialMessage<ActionInstance>): ActionInstance {
        const message = { code: 0, editing: false };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<ActionInstance>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ActionInstance): ActionInstance {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* ActionCode code */ 1:
                    message.code = reader.int32();
                    break;
                case /* ProcessorConfig config */ 2:
                    message.config = ProcessorConfig.internalBinaryRead(reader, reader.uint32(), options, message.config);
                    break;
                case /* bool editing */ 10:
                    message.editing = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: ActionInstance, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* ActionCode code = 1; */
        if (message.code !== 0)
            writer.tag(1, WireType.Varint).int32(message.code);
        /* ProcessorConfig config = 2; */
        if (message.config)
            ProcessorConfig.internalBinaryWrite(message.config, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* bool editing = 10; */
        if (message.editing !== false)
            writer.tag(10, WireType.Varint).bool(message.editing);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message ActionInstance
 */
export const ActionInstance = new ActionInstance$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ProcessorConfig$Type extends MessageType<ProcessorConfig> {
    constructor() {
        super("ProcessorConfig", [
            { no: 10, name: "base64", kind: "message", T: () => Base64Config },
            { no: 11, name: "formatting", kind: "message", T: () => FormattingConfig },
            { no: 12, name: "queryData", kind: "message", T: () => QueryDataConfig },
            { no: 13, name: "regex", kind: "message", T: () => RegexConfig },
            { no: 14, name: "string", kind: "message", T: () => StringConfig },
            { no: 15, name: "compression", kind: "message", T: () => CompressionConfig }
        ]);
    }
    create(value?: PartialMessage<ProcessorConfig>): ProcessorConfig {
        const message = {};
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<ProcessorConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ProcessorConfig): ProcessorConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional Base64Config base64 */ 10:
                    message.base64 = Base64Config.internalBinaryRead(reader, reader.uint32(), options, message.base64);
                    break;
                case /* optional FormattingConfig formatting */ 11:
                    message.formatting = FormattingConfig.internalBinaryRead(reader, reader.uint32(), options, message.formatting);
                    break;
                case /* optional QueryDataConfig queryData */ 12:
                    message.queryData = QueryDataConfig.internalBinaryRead(reader, reader.uint32(), options, message.queryData);
                    break;
                case /* optional RegexConfig regex */ 13:
                    message.regex = RegexConfig.internalBinaryRead(reader, reader.uint32(), options, message.regex);
                    break;
                case /* optional StringConfig string */ 14:
                    message.string = StringConfig.internalBinaryRead(reader, reader.uint32(), options, message.string);
                    break;
                case /* optional CompressionConfig compression */ 15:
                    message.compression = CompressionConfig.internalBinaryRead(reader, reader.uint32(), options, message.compression);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: ProcessorConfig, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* optional Base64Config base64 = 10; */
        if (message.base64)
            Base64Config.internalBinaryWrite(message.base64, writer.tag(10, WireType.LengthDelimited).fork(), options).join();
        /* optional FormattingConfig formatting = 11; */
        if (message.formatting)
            FormattingConfig.internalBinaryWrite(message.formatting, writer.tag(11, WireType.LengthDelimited).fork(), options).join();
        /* optional QueryDataConfig queryData = 12; */
        if (message.queryData)
            QueryDataConfig.internalBinaryWrite(message.queryData, writer.tag(12, WireType.LengthDelimited).fork(), options).join();
        /* optional RegexConfig regex = 13; */
        if (message.regex)
            RegexConfig.internalBinaryWrite(message.regex, writer.tag(13, WireType.LengthDelimited).fork(), options).join();
        /* optional StringConfig string = 14; */
        if (message.string)
            StringConfig.internalBinaryWrite(message.string, writer.tag(14, WireType.LengthDelimited).fork(), options).join();
        /* optional CompressionConfig compression = 15; */
        if (message.compression)
            CompressionConfig.internalBinaryWrite(message.compression, writer.tag(15, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message ProcessorConfig
 */
export const ProcessorConfig = new ProcessorConfig$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Base64Config$Type extends MessageType<Base64Config> {
    constructor() {
        super("Base64Config", [
            { no: 1, name: "urlSafe", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "stripPadding", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 3, name: "output", kind: "enum", T: () => ["DataType", DataType] }
        ]);
    }
    create(value?: PartialMessage<Base64Config>): Base64Config {
        const message = { urlSafe: false, stripPadding: false, output: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Base64Config>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Base64Config): Base64Config {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bool urlSafe */ 1:
                    message.urlSafe = reader.bool();
                    break;
                case /* bool stripPadding */ 2:
                    message.stripPadding = reader.bool();
                    break;
                case /* DataType output */ 3:
                    message.output = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: Base64Config, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* bool urlSafe = 1; */
        if (message.urlSafe !== false)
            writer.tag(1, WireType.Varint).bool(message.urlSafe);
        /* bool stripPadding = 2; */
        if (message.stripPadding !== false)
            writer.tag(2, WireType.Varint).bool(message.stripPadding);
        /* DataType output = 3; */
        if (message.output !== 0)
            writer.tag(3, WireType.Varint).int32(message.output);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Base64Config
 */
export const Base64Config = new Base64Config$Type();
// @generated message type with reflection information, may provide speed optimized methods
class FormattingConfig$Type extends MessageType<FormattingConfig> {
    constructor() {
        super("FormattingConfig", [
            { no: 1, name: "indentDepth", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "sortKeys", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value?: PartialMessage<FormattingConfig>): FormattingConfig {
        const message = { indentDepth: 0, sortKeys: false };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<FormattingConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FormattingConfig): FormattingConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 indentDepth */ 1:
                    message.indentDepth = reader.int32();
                    break;
                case /* bool sortKeys */ 2:
                    message.sortKeys = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: FormattingConfig, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 indentDepth = 1; */
        if (message.indentDepth !== 0)
            writer.tag(1, WireType.Varint).int32(message.indentDepth);
        /* bool sortKeys = 2; */
        if (message.sortKeys !== false)
            writer.tag(2, WireType.Varint).bool(message.sortKeys);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message FormattingConfig
 */
export const FormattingConfig = new FormattingConfig$Type();
// @generated message type with reflection information, may provide speed optimized methods
class QueryDataConfig$Type extends MessageType<QueryDataConfig> {
    constructor() {
        super("QueryDataConfig", [
            { no: 1, name: "query", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<QueryDataConfig>): QueryDataConfig {
        const message = { query: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<QueryDataConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: QueryDataConfig): QueryDataConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string query */ 1:
                    message.query = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: QueryDataConfig, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string query = 1; */
        if (message.query !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.query);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message QueryDataConfig
 */
export const QueryDataConfig = new QueryDataConfig$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RegexConfig$Type extends MessageType<RegexConfig> {
    constructor() {
        super("RegexConfig", [
            { no: 1, name: "pattern", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "replacement", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<RegexConfig>): RegexConfig {
        const message = { pattern: "", replacement: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<RegexConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RegexConfig): RegexConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string pattern */ 1:
                    message.pattern = reader.string();
                    break;
                case /* string replacement */ 2:
                    message.replacement = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: RegexConfig, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string pattern = 1; */
        if (message.pattern !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.pattern);
        /* string replacement = 2; */
        if (message.replacement !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.replacement);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message RegexConfig
 */
export const RegexConfig = new RegexConfig$Type();
// @generated message type with reflection information, may provide speed optimized methods
class StringConfig$Type extends MessageType<StringConfig> {
    constructor() {
        super("StringConfig", [
            { no: 1, name: "quoteCharacter", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<StringConfig>): StringConfig {
        const message = { quoteCharacter: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<StringConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StringConfig): StringConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string quoteCharacter */ 1:
                    message.quoteCharacter = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: StringConfig, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string quoteCharacter = 1; */
        if (message.quoteCharacter !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.quoteCharacter);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message StringConfig
 */
export const StringConfig = new StringConfig$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CompressionConfig$Type extends MessageType<CompressionConfig> {
    constructor() {
        super("CompressionConfig", [
            { no: 1, name: "output", kind: "enum", T: () => ["DataType", DataType] }
        ]);
    }
    create(value?: PartialMessage<CompressionConfig>): CompressionConfig {
        const message = { output: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<CompressionConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CompressionConfig): CompressionConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* DataType output */ 1:
                    message.output = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: CompressionConfig, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* DataType output = 1; */
        if (message.output !== 0)
            writer.tag(1, WireType.Varint).int32(message.output);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message CompressionConfig
 */
export const CompressionConfig = new CompressionConfig$Type();
