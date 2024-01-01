import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface ActionType {
    value : "Add" | "Edit" | ""
}

const initialState: ActionType = {
    value: ""
}


export const ActionTypeSlice = createSlice({
    name: 'actionType',
    initialState,
    reducers: {
        setActionType: (state, action: PayloadAction<ActionType>) => {
            state.value = action.payload.value
        },
    },
})

// Action creators are generated for each case reducer function
export const { setActionType } = ActionTypeSlice.actions

// export a selector
export const selectActionType = (state: { actionType: ActionType }) => state.actionType.value

export default ActionTypeSlice.reducer