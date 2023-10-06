import { ParsedQs } from "qs";
export function convertStr2Arr(query: string | string[] | ParsedQs | ParsedQs[] | undefined) {
    if (typeof query === "undefined" || Array.isArray(query)) {
        return query;
    }
    return [query];
}