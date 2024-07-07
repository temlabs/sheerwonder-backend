"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailAddressAndNameFilter = exports.createdBeforeNowFilter = exports.searchUsers = void 0;
process.env.PORT;
const stytch = __importStar(require("stytch"));
const config_1 = require("../../config");
const client = new stytch.Client({
    project_id: "project-test-2de4cd04-a5ef-4c66-83bd-963ed4e3cc2b",
    secret: "secret-test-8nOgZT_UT8yhs6ALNqmL1jwAS4q8RTqix0I=",
    env: stytch.envs.test,
});
async function searchUsers(filters) {
    const params = {
        limit: 200,
        cursor: "",
        query: {
            operator: "AND",
            operands: filters,
        },
    };
    try {
        const users = await client.users.search(params);
        return users;
    }
    catch (error) {
        throw error;
    }
}
exports.searchUsers = searchUsers;
const createdBeforeNowFilter = () => {
    return {
        filter_name: "created_at_between",
        filter_value: {
            less_than: new Date().toISOString(),
            greater_than: config_1.BEGINNING_OF_TIME,
        },
    };
};
exports.createdBeforeNowFilter = createdBeforeNowFilter;
const emailAddressAndNameFilter = ({ email, username, }) => {
    const emailFilter = {
        filter_name: "email_address",
        filter_value: [email],
    };
    const usernameFilter = {
        filter_name: "full_name_fuzzy",
        filter_value: username === null || username === void 0 ? void 0 : username.replaceAll("@", ""),
    };
    return email ? [usernameFilter, emailFilter] : [usernameFilter];
};
exports.emailAddressAndNameFilter = emailAddressAndNameFilter;
