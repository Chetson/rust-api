import { create } from 'zustand'
import axiosClient from '../../axios'

export const useAdminItemLibraryStore = create((set, get) => ({

    categories: {
        loaded: false,
        data: [],
    },

    items: {
        loaded: false,
        data: [],
    },



    fetchItemCategories: async () => {
        set({
            categories: { loaded: false, data: [] }
        })
        const { data } = await axiosClient.get('/admin/items/categories')
        set({
            categories: { loaded: true, data: data }
        })
    },

    fetchItems: async (category) => {
        set({
            items: { loaded: false, data: [] }
        })
        const { data } = await axiosClient.get('/admin/items', { params: { category }})
        set({
            items: { loaded: true, data: data }
        })

        return data
    }
}))
