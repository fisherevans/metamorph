import {useCallback, useState} from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {Buffer} from 'buffer';

import qs from "qs"
import {ActionInstance} from "../ProcessingActions/ProcessingActions";

export interface AppParams {
    autoProcess: boolean,
    actions: ActionInstance[],
}

const qpAuto = "auto"
const qpActions = "actions"

const encodeParams = (p:AppParams) : string => {
    const query: { [key: string]: string } = {}
    query[qpAuto] = String(p.autoProcess)
    query[qpActions] = Buffer.from(JSON.stringify(p.actions), 'utf8').toString('base64')
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
        out.actions = JSON.parse(Buffer.from(parsed[qpActions] as string, 'base64').toString('utf8'))
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