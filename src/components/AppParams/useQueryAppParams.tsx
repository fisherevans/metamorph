import {useCallback, useState} from "react"
import { useNavigate, useLocation } from "react-router-dom"

import qs from "qs"

export interface AppParams {
    autoProcess: boolean,
    actions: string[],
}

const qpAuto = "auto"
const qpActions = "actions"

const encodeParams = (p:AppParams) : string => {
    const query: { [key: string]: string } = {}
    query[qpAuto] = String(p.autoProcess)
    query[qpActions] = p.actions.join(",")
    return qs.stringify(query, { skipNulls: true })
}

const decodeParams = (s:string) : AppParams => {
    const parsed = qs.parse(s, {
        ignoreQueryPrefix: true,
    })
    const out:AppParams = {
        autoProcess: true,
        actions: []
    }
    if(parsed[qpAuto] !== undefined) {
        out.autoProcess = parsed[qpAuto] === "true"
    }
    if(parsed[qpActions] !== undefined) {
        out.actions = String(parsed[qpActions]).split(",")
    }
    return out
}

export const useQueryAppParams = ():[AppParams, (ap:AppParams) => void] => {
    const location = useLocation()
    const navigate = useNavigate()

    const setParams = useCallback(
        (newParams:AppParams) => {
            const queryString = encodeParams(newParams)
            navigate(`${location.pathname}?${queryString}`)
        },
        [history, location]
    )

    console.log("generate from " + location.search)
    const params = decodeParams(location.search)

    return [
        params,
        setParams,
    ]
}