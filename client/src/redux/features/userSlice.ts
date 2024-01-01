import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from '../models/user.model'


export interface UserState {
    value : User
}

const initialState: UserState = {
    value: {} as User
}


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions


// export a selector
export const selectUser = (state: { user: UserState }) => state.user.value


export default userSlice.reducer