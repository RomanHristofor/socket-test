import React, { useEffect, useState } from 'react'
import { useSession } from './websocket'
import { WebsocketMessage } from '@app/types'

export enum Status {
    Started = 'started',
    Stopped = 'stopped',
}

enum CommandType {
    Client = 'client',
    TestStart = 'test:start',
    TestStop = 'test:stop',
}

interface ContextValue {
    start: () => void
    stop: () => void
    toggle: () => void
    status: string
    dataset: WebsocketMessage['payload'][]
}

const Context = React.createContext<ContextValue | null>(null)

function Provider({ children }: React.PropsWithChildren<{}>) {
    const [status, setStatus] = useState('')
    const [dataset, setDataset] = useState<WebsocketMessage['payload'][]>([])

    useEffect(() => {
        const savedDataset = localStorage.getItem('dataset')
        if (savedDataset) {
            setDataset(JSON.parse(savedDataset))
        }
    }, []);

    useEffect(() => {
        if (dataset.length) {
            localStorage.setItem('dataset', JSON.stringify(dataset))
        }
    }, [dataset]);

    const { connect, close, sendMessage } = useSession(
        () => {
            console.debug('%c Соединение установлено', 'background-color: green; color: white')
        },
        (data) => {
            console.log('@@@', data.payload)
            setDataset([...dataset, data.payload])
        },
        () => console.debug('%c Соединение разорвано', 'background-color: red; color: white')
    )

    const start = () => {
        setStatus(Status.Started)
        sendMessage({ source: CommandType.Client, cmd: CommandType.TestStart })
    }
    const stop = () => {
        setStatus(Status.Stopped)
        sendMessage({ source: CommandType.Client, cmd: CommandType.TestStop })
    }

    const toggle = () => {
        if (status === Status.Started) {
            stop()
        } else {
            start()
        }
      }

    useEffect(() => {
        connect()
        return () => {
            close()
        }
    }, [])

    return (
        <Context.Provider
            value={{ status, dataset, start, stop, toggle }}
        >
            {children}
        </Context.Provider>
    )
}

function useExperiment() {
    const context = React.useContext(Context)
    if (!context) {
        throw new Error('hook useExperiment must be used with the Provider')
    }
    return context
}

export { Provider, useExperiment }
