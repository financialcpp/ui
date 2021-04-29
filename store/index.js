export function state() {
    return {
        mainArea: {
            height: 0,
            width: 0
        }
    }
}

export const mutations = {
    setMainAreaHeight(state, val) {
        state.mainArea.height = val
    },
    setMainAreaWidth(state, val) {
        state.mainArea.width = val
    }
}