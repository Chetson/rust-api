import { create } from 'zustand'

export const serverStatsStore = create((set, get) => ({

    servers: {
        data: [],
        loaded: false,
    },


    getServersStat: async (callback = () => {}) => {
        const result = new Promise((resolve) => {
            resolve([
                {
                    name: 'Trio Classic',
                    slots: 150,
                    players: 45,
                    connectAddress: 'steam://connect/31.184.218.75:28015',
                    online: true,
                },
                {
                    name: 'Duo x2',
                    slots: 250,
                    players: 186,
                    connectAddress: 'steam://connect/31.184.218.75:28025',
                    online: true,
                },
                {
                    name: 'No limit Classic',
                    slots: 0,
                    players: 0,
                    connectAddress: 'steam://connect/31.184.218.75:28017',
                    online: false,
                },
                {
                    name: 'Duo Classic',
                    slots: 120,
                    players: 12,
                    connectAddress: 'steam://connect/31.184.218.75:28078',
                    online: true,
                }
            ])
        }, 1000)

        return result
    },
}))
